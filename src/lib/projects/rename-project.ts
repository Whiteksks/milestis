import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export async function renameProject(projectId: string, name: string): Promise<void> {
  await updateDoc(doc(db, 'projects', projectId), {
    name: name.trim(),
    updatedAt: serverTimestamp(),
  })
}
