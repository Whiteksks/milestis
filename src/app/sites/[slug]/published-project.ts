import 'server-only'
import { cache } from 'react'
import { adminDb } from '@/lib/firebase/admin'
import { getPublishedGlobalProject } from '@/lib/projects/published-global'

// Request-scoped: metadata and page see the same snapshot; the next request sees updates.
export const getPublishedProjectBySlugGlobal = cache((slug: string) => getPublishedGlobalProject(adminDb, slug))
