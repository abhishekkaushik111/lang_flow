import React, { useMemo } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { Job, JobStatus } from '../lib/db'
import { JobCard } from './JobCard'

interface ColumnProps {
  status: JobStatus
  jobs: Job[]
  onEdit: (job: Job) => void
  onDelete: (id: string) => void
}

export function Column({ status, jobs, onEdit, onDelete }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: { type: 'Column', status }
  })

  const jobIds = useMemo(() => jobs.map(j => j.id), [jobs])

  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm tracking-wide text-foreground flex items-center gap-2">
          {status}
          <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            {jobs.length}
          </span>
        </h3>
      </div>
      
      <div 
        ref={setNodeRef}
        className="flex-1 bg-secondary/50 p-3 rounded-2xl min-h-[500px] flex flex-col gap-3 transition-colors hover:bg-secondary/70"
      >
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </SortableContext>
        {!jobs.length && (
           <div className="text-center text-xs text-muted-foreground mt-4 italic opacity-50">
             Drop items here
           </div>
        )}
      </div>
    </div>
  )
}
