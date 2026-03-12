import { doc, updateDoc, serverTimestamp, deleteField } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Restores a project from the trash back to active status.
 * Clears the deletedAt and purgeAt fields.
 */
export async function restoreProject(projectId: string): Promise<void> {
  await updateDoc(doc(db, 'projects', projectId), {
    status: 'active',
    deletedAt: deleteField(),
    purgeAt: deleteField(),
    updatedAt: serverTimestamp(),
  })
}
