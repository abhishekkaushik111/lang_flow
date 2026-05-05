import React, { useState } from 'react'
import { Layout } from './components/Layout'
import { KanbanBoard } from './components/KanbanBoard'
import { JobModal } from './components/JobModal'
import { useJobs } from './hooks/useJobs'
import { Job } from './lib/db'

export default function App() {
  const { jobs, setJobs, isLoading, addJob, updateJob, deleteJob, importJobs } = useJobs()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddClick = () => {
    setEditingJob(undefined)
    setIsModalOpen(true)
  }

  const handleEditClick = (job: Job) => {
    setEditingJob(job)
    setIsModalOpen(true)
  }

  const handleSaveJob = (job: Job) => {
    if (jobs.find(j => j.id === job.id)) {
      updateJob(job.id, job)
    } else {
      addJob(job)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Layout 
      jobs={jobs} 
      onImport={importJobs} 
      onAddJobClick={handleAddClick}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <KanbanBoard 
        jobs={jobs}
        setJobs={setJobs} // Let Kanban manage optimistic drag-drop local array state 
        updateJob={updateJob} // Persist to DB on drop
        onEdit={handleEditClick}
        onDelete={deleteJob}
        searchFilter={searchTerm}
      />
      
      <JobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveJob}
        existingJob={editingJob}
      />
    </Layout>
  )
}

