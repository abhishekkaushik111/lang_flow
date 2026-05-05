import React, { useState } from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Job, JobStatus } from '../lib/db'
import { Column } from './Column'
import { JobCard } from './JobCard'

interface KanbanBoardProps {
  jobs: Job[]
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>
  updateJob: (id: string, updated: Job) => void
  onEdit: (job: Job) => void
  onDelete: (id: string) => void
  searchFilter: string
}

const ALL_STATUSES: JobStatus[] = ['Wishlist', 'Applied', 'Follow-up', 'Interview', 'Offer', 'Rejected']

export function KanbanBoard({ jobs, setJobs, updateJob, onEdit, onDelete, searchFilter }: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<Job | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const filteredJobs = jobs.filter(job => 
    job.company.toLowerCase().includes(searchFilter.toLowerCase()) || 
    job.role.toLowerCase().includes(searchFilter.toLowerCase())
  )

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === 'Job') {
      setActiveJob(e.active.data.current.job)
    }
  }

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === 'Job'
    const isOverTask = over.data.current?.type === 'Job'
    const isOverColumn = over.data.current?.type === 'Column'

    if (!isActiveTask) return

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setJobs((jobsState) => {
        const activeIndex = jobsState.findIndex((t) => t.id === activeId)
        const overIndex = jobsState.findIndex((t) => t.id === overId)

        if (jobsState[activeIndex].status !== jobsState[overIndex].status) {
          const updatedJobs = [...jobsState]
          updatedJobs[activeIndex].status = jobsState[overIndex].status
          return arrayMove(updatedJobs, activeIndex, overIndex)
        }
        return arrayMove(jobsState, activeIndex, overIndex)
      })
    }

    // Dropping a Task over an empty Column container
    if (isActiveTask && isOverColumn) {
      setJobs((jobsState) => {
        const activeIndex = jobsState.findIndex((t) => t.id === activeId)
        const updatedJobs = [...jobsState]
        updatedJobs[activeIndex].status = over.data.current?.status
        return arrayMove(updatedJobs, activeIndex, activeIndex)
      })
    }
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActiveJob(null)
    const { active, over } = e
    if (!over) return

    const activeId = active.id
    const overId = over.id
    if (activeId === overId) return

    // Save final status update to DB
    const finalJob = jobs.find(j => j.id === activeId)
    if (finalJob) {
       updateJob(finalJob.id, finalJob) // Save DB async
    }
  }

  const columnsData = ALL_STATUSES.map(status => {
    const colJobs = filteredJobs.filter(j => j.status === status)
    return { status, jobs: colJobs }
  })

  // Sort logically newest first per column mostly by default, array ordering persists dynamically mostly.
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-6 pb-4 items-start h-full">
        {columnsData.map(col => (
          <Column 
            key={col.status} 
            status={col.status} 
            jobs={col.jobs} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
        {activeJob && (
          <div className="opacity-90 scale-105 rotate-2 shadow-2xl">
             <JobCard job={activeJob} onEdit={()=>{}} onDelete={()=>{}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
