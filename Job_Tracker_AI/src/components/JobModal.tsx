import React, { useState, useEffect } from 'react'
import { Job, JobStatus } from '../lib/db'

interface JobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (job: Job) => void
  existingJob?: Job
}

const defaultJob: Omit<Job, 'id'> = {
  company: '',
  role: '',
  url: '',
  resume: '',
  dateApplied: Date.now(),
  salary: '',
  notes: '',
  status: 'Wishlist'
}

export function JobModal({ isOpen, onClose, onSave, existingJob }: JobModalProps) {
  const [formData, setFormData] = useState<Omit<Job, 'id'>>(defaultJob)

  useEffect(() => {
    if (existingJob) {
      setFormData(existingJob)
    } else {
      setFormData(defaultJob)
    }
  }, [existingJob, isOpen])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...(existingJob || { id: crypto.randomUUID() }),
      ...formData
    } as Job)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-semibold text-card-foreground">
            {existingJob ? 'Edit Job' : 'Add New Job'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company *</label>
              <input 
                required 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                className="w-full p-2 bg-transparent border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role *</label>
              <input 
                required 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                className="w-full p-2 bg-transparent border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LinkedIn/Job URL</label>
            <input 
              type="url" 
              name="url" 
              value={formData.url || ''} 
              onChange={handleChange} 
              className="w-full p-2 bg-transparent border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="w-full p-2 bg-transparent border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salary Range</label>
              <input 
                name="salary" 
                value={formData.salary || ''} 
                onChange={handleChange} 
                placeholder="$150-180K"
                className="w-full p-2 bg-transparent border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resume Used</label>
            <input 
              name="resume" 
              value={formData.resume || ''} 
              onChange={handleChange} 
              placeholder="e.g. SDE_Resume_v3"
              className="w-full p-2 bg-transparent border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes || ''} 
              onChange={handleChange} 
              rows={3}
              className="w-full p-2 bg-transparent border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none resize-none" 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md hover:bg-accent text-sm font-medium">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
              Save Job
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
