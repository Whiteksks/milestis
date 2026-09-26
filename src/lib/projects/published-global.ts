import type { Firestore } from 'firebase-admin/firestore'
import { getSlugReservationDocId } from '../slug/reservation'
import { PUBLISHED_PROJECT_SLUGS_COLLECTION } from '../slug/constants'

/** A subdomain identifies a reservation; the published document defines its mode. */
export async function getPublishedGlobalProject(db: Pick<Firestore, 'collection'>, slug: string) {
  const reservation = await db.collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .doc(getSlugReservationDocId('portfolio', slug)).get()
  const reserved = reservation.data()
  if (!reserved?.projectId || typeof reserved.projectId !== 'string') return null
  const document = await db.collection('published_projects').doc(reserved.projectId).get()
  const data = document.data()
  if (!data || data.isPublished !== true || data.slug !== slug || !['portfolio', 'menu'].includes(data.mode)) return null
  if (reserved.mode && reserved.mode !== data.mode) return null
  if (data.mode === 'menu') {
    const project = await db.collection('projects').doc(document.id).get()
    if (!['active', 'archived'].includes(project.data()?.status)) return null
  }
  return {
    id: document.id,
    slug: data.slug as string,
    name: data.name as string,
    mode: data.mode as 'portfolio' | 'menu',
    locale: data.locale === 'ru' || data.locale === 'kz' ? data.locale as 'ru' | 'kz' : 'en' as const,
    content: data.content ?? null,
    theme: data.theme ?? null,
    ogImageUrl: (data.ogImageUrl as string | undefined) ?? null,
    ownerId: (data.ownerId as string | undefined) ?? null,
  }
}
