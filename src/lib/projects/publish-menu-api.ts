import { requestProjectFunction } from './request-project-function'
import { doc, getDocFromServer } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { PublishProjectError } from './publish-project-api'
import type { PageLink } from '../../../functions/src/domain/pages'
import { readPublishedMenuLinks } from './published-menu'
import type { MenuBilling } from '../../../functions/src/projects/menu/billing/model'

export async function getPublishedMenuLinks(projectId: string): Promise<PageLink[]> {
  const snapshot = await getDocFromServer(doc(db, 'published_projects', projectId))
  return readPublishedMenuLinks(snapshot.data())
}

export async function publishMenu(projectId: string, slug: string, locale: string, quoteId: string): Promise<{ ok: true; publishedSlug: string; publishedPages: PageLink[]; billing: MenuBilling }> {
  return requestProjectFunction(
    'publishMenu', { projectId, slug, locale, quoteId },
    { errorClass: PublishProjectError, fallbackMessage: 'Menu publication failed', useServerMessage: false },
  )
}
