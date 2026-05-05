import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Job, JobStatus } from '../lib/db'
import { Calendar, Briefcase, ExternalLink, Link as LinkIcon, Edit, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface JobCardProps {
  job: Job
  onEdit: (job: Job) => void
  onDelete: (id: string) => void
}

const statusColors: Record<JobStatus, string> = {
  'Wishlist': 'border-l-slate-400 dark:border-l-slate-600',
  'Applied': 'border-l-blue-500',
  'Follow-up': 'border-l-indigo-500',
  'Interview': 'border-l-yellow-500',
  'Offer': 'border-l-green-500',
  'Rejected': 'border-l-red-500'
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: job.id, data: { type: 'Job', job } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group bg-card text-card-foreground p-4 rounded-xl shadow-sm border border-border border-l-4 ${statusColors[job.status]} cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button 
          onPointerDown={(e) => { e.stopPropagation(); onEdit(job) }}
          className="p-1 hover:bg-accent hover:text-accent-foreground rounded text-muted-foreground"
          title="Edit"
        >
          <Edit size={14} />
        </button>
        <button 
          onPointerDown={(e) => { 
            e.stopPropagation(); 
            if(window.confirm('Delete this job?')) onDelete(job.id) 
          }}
          className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded text-muted-foreground"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mb-2 pr-10">
        <h4 className="font-semibold text-sm leading-tight line-clamp-2">{job.role}</h4>
        <div className="flex flex-wrap items-center gap-x-2 mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80 flex items-center gap-1">
            <Briefcase size={12} /> {job.company}
          </span>
          {job.url && (
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onPointerDown={(e) => e.stopPropagation()}
              className="hover:text-primary flex items-center"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {job.salary && (
          <span className="text-[10px] font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
            {job.salary}
          </span>
        )}
        {job.resume && (
          <span className="text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
            <LinkIcon size={10} /> {job.resume}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 border-t border-border mt-auto">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDistanceToNow(job.dateApplied, { addSuffix: true })}
        </div>
      </div>
    </div>
  )
}
