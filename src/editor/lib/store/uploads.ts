import { create } from 'zustand'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { auth, storage } from '@/lib/firebase'

export type UploadStatus = 'queued' | 'uploading' | 'processing' | 'failed'
export interface UploadingEntry {
  id: string
  projectId: string
  ownerId: string
  name: string
  progress: number
  status: UploadStatus
  updatedAt: number
  errorCode?: string
  file?: File
}

export const PROCESSING_TIMEOUT_MS = 10 * 60_000
export const useUploadStore = create<{
  entries: UploadingEntry[]
  dismissed: Record<string, true>
}>(() => ({ entries: [], dismissed: {} }))

function update(id: string, values: Partial<UploadingEntry>) {
  useUploadStore.setState((state) => ({ entries: state.entries.map((entry) => entry.id === id ? { ...entry, ...values } : entry) }))
}

export function dismissUpload(id: string) {
  useUploadStore.setState((state) => ({
    entries: state.entries.filter((entry) => entry.id !== id),
    dismissed: { ...state.dismissed, [id]: true },
  }))
}

let running = 0
const queue: Array<() => Promise<void>> = []
function pump() {
  while (running < 3 && queue.length) {
    const task = queue.shift()!
    running += 1
    void task().finally(() => { running -= 1; pump() })
  }
}

export function enqueueImageUpload(file: File, ownerId: string, projectId: string) {
  const id = crypto.randomUUID()
  const errorCode = !file.type.startsWith('image/') ? 'unsupportedFormat'
    : file.size >= 100 * 1024 * 1024 ? 'fileTooLarge' : undefined
  const entry: UploadingEntry = {
    id, projectId, ownerId, name: file.name, file, progress: 0,
    status: errorCode ? 'failed' : 'queued', errorCode, updatedAt: Date.now(),
  }
  useUploadStore.setState((state) => ({ entries: [...state.entries, entry] }))
  if (errorCode) return id
  queue.push(async () => {
    // Do not send another user's queued files after logout/account switch.
    if (auth.currentUser?.uid !== ownerId) {
      update(id, { status: 'failed', errorCode: 'uploadFailed' })
      return
    }
    update(id, { status: 'uploading' })
    try {
      const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const task = uploadBytesResumable(ref(storage, `users/${ownerId}/projects/${projectId}/images/${id}/original.${ext}`), file, {
        contentType: file.type, customMetadata: { originalName: file.name },
      })
      await new Promise<void>((resolve, reject) => {
        task.on('state_changed', (snapshot) => {
          update(id, { progress: Math.min(99, Math.round(snapshot.bytesTransferred / Math.max(1, snapshot.totalBytes) * 100)) })
        }, reject, resolve)
      })
      update(id, { status: 'processing', progress: 100, updatedAt: Date.now() })
    } catch {
      update(id, { status: 'failed', errorCode: 'uploadFailed' })
    }
  })
  pump()
  return id
}
