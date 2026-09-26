import { doc, getDocFromServer } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
import { PublishProjectError } from './publish-project-api'
import type { PageLink } from '../../../functions/src/domain/pages'
import { readPublishedMenuLinks } from './published-menu'

export async function getPublishedMenuLinks(projectId: string): Promise<PageLink[]> {
  const snapshot = await getDocFromServer(doc(db, 'published_projects', projectId))
  return readPublishedMenuLinks(snapshot.data())
}

export async function publishMenu(projectId: string, slug: string, locale: string): Promise<{ ok: true; publishedSlug: string; publishedPages: PageLink[] }> {
  const user = auth.currentUser
  if (!user) throw new PublishProjectError('UNAUTHORIZED', 'Not authenticated')
  const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const url = process.env.NEXT_PUBLIC_PUBLISH_MENU_URL
    || (firebaseProjectId ? `https://europe-west4-${firebaseProjectId}.cloudfunctions.net/publishMenu` : undefined)
  if (!url) throw new PublishProjectError('CONFIG_ERROR', 'Publish menu URL not configured')
  const token = await user.getIdToken()
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ projectId, slug, locale }),
  })
  const data = await response.json()
  if (!response.ok) throw new PublishProjectError(data.error ?? 'UNKNOWN', 'Menu publication failed')
  return data
}
