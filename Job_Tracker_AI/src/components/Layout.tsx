import React, { useRef } from 'react'
import { Moon, Sun, Download, Upload } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { Job } from '../lib/db'

interface LayoutProps {
  children: React.ReactNode
  jobs: Job[]
  onImport: (jobs: Job[]) => void
  onAddJobClick: () => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function Layout({ children, jobs, onImport, onAddJobClick, searchTerm, setSearchTerm }: LayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const dataStr = JSON.stringify(jobs, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = 'jobs-backup.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string) as Job[]
        onImport(importedData)
      } catch (err) {
        alert("Failed to parse JSON file.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Job Tracker
        </h1>
        
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search company or role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button 
            onClick={onAddJobClick}
            className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Add Job
          </button>
          
          <button onClick={handleExport} title="Export JSON" className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
            <Download size={18} />
          </button>
          
          <button onClick={() => fileInputRef.current?.click()} title="Import JSON" className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
            <Upload size={18} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />

          <button onClick={toggleTheme} className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6">
        {children}
      </main>
    </div>
  )
}
