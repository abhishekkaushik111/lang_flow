import { openDB } from 'idb'

export type JobStatus = 'Wishlist' | 'Applied' | 'Follow-up' | 'Interview' | 'Offer' | 'Rejected'

export interface Job {
  id: string;
  company: string;
  role: string;
  url?: string;
  resume?: string;
  dateApplied: number;
  salary?: string;
  notes?: string;
  status: JobStatus;
}

const DB_NAME = 'JobTrackerDB'
const DB_VERSION = 1
const STORE_NAME = 'jobs'

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export const dbService = {
  async getAllJobs(): Promise<Job[]> {
    const db = await initDB()
    return db.getAll(STORE_NAME)
  },

  async addJob(job: Job): Promise<void> {
    const db = await initDB()
    await db.put(STORE_NAME, job)
  },

  async updateJob(id: string, job: Job): Promise<void> {
    const db = await initDB()
    await db.put(STORE_NAME, job)
  },

  async deleteJob(id: string): Promise<void> {
    const db = await initDB()
    await db.delete(STORE_NAME, id)
  },

  async clearJobs(): Promise<void> {
    const db = await initDB()
    await db.clear(STORE_NAME)
  },

  async insertBulkJobs(jobs: Job[]): Promise<void> {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    await Promise.all(jobs.map(job => tx.store.put(job)))
    await tx.done
  }
}
