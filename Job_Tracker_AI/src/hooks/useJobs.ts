import { useState, useEffect } from 'react'
import { dbService, Job } from '../lib/db'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    setIsLoading(true)
    try {
      const data = await dbService.getAllJobs()
      setJobs(data)
    } catch (error) {
      console.error("Failed to load jobs", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addJob = async (job: Job) => {
    await dbService.addJob(job)
    setJobs(prev => [...prev, job])
  }

  const updateJob = async (id: string, updatedJob: Job) => {
    await dbService.updateJob(id, updatedJob)
    setJobs(prev => prev.map(job => (job.id === id ? updatedJob : job)))
  }

  const deleteJob = async (id: string) => {
    await dbService.deleteJob(id)
    setJobs(prev => prev.filter(job => job.id !== id))
  }

  const importJobs = async (importedJobs: Job[]) => {
    await dbService.clearJobs()
    await dbService.insertBulkJobs(importedJobs)
    setJobs(importedJobs)
  }

  return { jobs, setJobs, isLoading, addJob, updateJob, deleteJob, importJobs }
}
