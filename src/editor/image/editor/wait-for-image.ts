import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUploadStore } from '@/editor/lib/store/uploads'
import type { ProjectImageDoc } from '@/editor/hooks/use-project-images'

/** Reuse the normal upload/resize pipeline; never persist a temporary blob URL. */
export function waitForProjectImage(id: string, projectId: string, ownerId: string, signal: AbortSignal): Promise<ProjectImageDoc> {
  return new Promise((resolve, reject) => {
    let settled = false
    const subscriptions: Array<() => void> = []
    const clean = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); subscriptions.forEach((unsubscribe) => unsubscribe()) }
    const fail = (message: string) => {
      if (settled) return
      settled = true
      clean()
      reject(new Error(message))
    }
    const abort = () => fail('AI_CANCELLED')
    const timer = setTimeout(() => fail('IMAGE_PROCESSING_TIMEOUT'), 120_000)
    const listen = (unsubscribe: () => void) => { if (settled) unsubscribe(); else subscriptions.push(unsubscribe) }
    signal.addEventListener('abort', abort, { once: true })
    if (signal.aborted) { abort(); return }
    const checkUpload = () => {
      const upload = useUploadStore.getState().entries.find((entry) => entry.id === id)
      if (upload?.status === 'failed') fail(upload.errorCode ?? 'uploadFailed')
    }
    listen(useUploadStore.subscribe(checkUpload))
    checkUpload()
    if (settled) return
    listen(onSnapshot(doc(db, 'images', id), (snapshot) => {
      if (settled || !snapshot.exists()) return
      const data = snapshot.data() as Omit<ProjectImageDoc, 'id'>
      if (data.projectId !== projectId || data.ownerId !== ownerId) { fail('AI_PHOTO_UNAVAILABLE'); return }
      if (!data.urls?.full) { fail('processingFailed'); return }
      settled = true
      clean()
      resolve({ ...data, id })
    }, () => fail('connectionFailed')))
    if (settled) return
    listen(onSnapshot(doc(db, 'projects', projectId, 'imageJobs', id), (snapshot) => {
      const job = snapshot.data()
      if (job?.status === 'failed') fail(job.errorCode ?? 'processingFailed')
    }, () => fail('connectionFailed')))
  })
}
