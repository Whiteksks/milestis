import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Computes the purge date based on when the project was deleted.
 *
 * Rule:
 *   day < 10  → purge on the 1st of NEXT month
 *   day >= 10 → purge on the 1st of the month AFTER NEXT
 *
 * Examples:
 *   deleted Jan 5  → purge Feb 1
 *   deleted Jan 20 → purge Mar 1
 */
export function computePurgeAt(deletedAt: Date): Date {
  const day = deletedAt.getDate()
  const month = deletedAt.getMonth() // 0-indexed
  const year = deletedAt.getFullYear()

  if (day < 10) {
    return new Date(year, month + 1, 1)
  } else {
    return new Date(year, month + 2, 1)
  }
}

/**
 * Soft-deletes a project by moving it to the trash.
 * The project will be permanently purged by the Cloud Function on the
 * computed purgeAt date (1st of next or following month).
 */
export async function softDeleteProject(projectId: string): Promise<void> {
  const now = new Date()
  const purgeAt = computePurgeAt(now)

  await updateDoc(doc(db, 'projects', projectId), {
    status: 'deleted',
    deletedAt: serverTimestamp(),
    purgeAt: Timestamp.fromDate(purgeAt),
    updatedAt: serverTimestamp(),
  })
}
