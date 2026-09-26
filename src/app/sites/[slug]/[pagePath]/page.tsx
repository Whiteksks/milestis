import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getSlugModePolicy, isSlugMode } from '@/lib/slug'
import { isPagePath } from '../../../../../functions/src/domain/pages'
import { publishedMenuMetadata, resolvePublishedMenuPage } from '@/lib/projects/published-menu'
import { getPublishedProjectBySlugGlobal } from '../published-project'
import { MenuPageView } from '../menu-page-view'

type Props = { params: Promise<{ slug: string; pagePath: string }> }

const getPage = cache(async (slug: string, pagePath: string) => {
  const mode = (await headers()).get('x-milestis-mode')
  if (!isSlugMode(mode) || getSlugModePolicy(mode).namespace !== 'global' || !isPagePath(`/${pagePath}`)) notFound()
  const resolved = resolvePublishedMenuPage(await getPublishedProjectBySlugGlobal(slug), `/${pagePath}`)
  if (!resolved) notFound()
  return resolved
})

export async function generateMetadata({ params }: Props) {
  const { slug, pagePath } = await params
  return publishedMenuMetadata(await getPage(slug, pagePath))
}

export default async function MenuPage({ params }: Props) {
  const { slug, pagePath } = await params
  return <MenuPageView resolved={await getPage(slug, pagePath)} />
}
