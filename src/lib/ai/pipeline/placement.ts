import { useContentStore } from '@/editor/lib/store/content'
import { getProjectImageSelectUrl, type ProjectImageDoc } from '@/editor/hooks/use-project-images'
import type { PhotobookManagedImage } from '@/editor/modes/photobook/image/types'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import type { PortfolioManagedImage } from '@/editor/modes/portfolio/image/types'
import type { PortfolioImageContent } from '@/editor/modes/portfolio/image/content'
import type { ImageValue } from '@/editor/image/data'
import type { AiChatMode } from '../core/types'
import {
  computePhotobookDefaults,
  computePortfolioDefaults,
  type PhotobookSingleSlot,
  type PortfolioSingleSlot,
} from '../defaultPlacement'

// Place attached photos before model calls using orientation, resolution and attachment order.

export function buildImageValue(doc: ProjectImageDoc, caption: string | undefined): ImageValue {
  return {
    // blurDataUrl must be the thumb variant — the dashboard card preview only accepts thumb URLs.
    asset: {
      src: getProjectImageSelectUrl(doc),
      width: doc.meta?.width ?? 0,
      height: doc.meta?.height ?? 0,
      ...(doc.urls?.thumb ? { blurDataUrl: doc.urls.thumb } : {}),
    },
    ...(caption ? { caption } : {}),
  }
}

export function makePhotobookImage(doc: ProjectImageDoc, slotId: PhotobookManagedImage['slotId'], caption: string | undefined): PhotobookManagedImage {
  return { id: crypto.randomUUID(), slotId, value: buildImageValue(doc, caption) }
}

// id defaults to a fresh uuid (hero/bio); featured-work cards pass their own stable project id explicitly
export function makePortfolioImage(doc: ProjectImageDoc, slotId: PortfolioManagedImage['slotId'], caption: string | undefined, id = crypto.randomUUID()): PortfolioManagedImage {
  return { id, slotId, value: buildImageValue(doc, caption) }
}

export function urlToIdMap(idToDoc: Map<string, ProjectImageDoc>): Map<string, string> {
  return new Map(Array.from(idToDoc.entries()).map(([id, doc]) => [getProjectImageSelectUrl(doc), id]))
}

export const PHOTOBOOK_SINGLE_SLOTS: PhotobookSingleSlot[] = ['cover', 'introduction', 'highlight', 'ending']
export const PHOTOBOOK_SLOT_IDS: Record<PhotobookSingleSlot, PhotobookManagedImage['slotId']> = {
  cover: 'photobook.cover.primary',
  introduction: 'photobook.introduction.primary',
  highlight: 'photobook.highlight.primary',
  ending: 'photobook.ending.primary',
}

export const PORTFOLIO_SINGLE_SLOTS: PortfolioSingleSlot[] = ['hero', 'bio']
export const PORTFOLIO_SLOT_IDS: Record<PortfolioSingleSlot, PortfolioManagedImage['slotId']> = {
  hero: 'portfolio.hero.primary',
  bio: 'portfolio.bio.primary',
}

// Photo pickers may resend ids already placed somewhere (e.g. "select all" reopens with
// previously-arranged photos still checked) — always re-derive which ids are genuinely unplaced
// before handing them to the placement heuristics, so nothing gets inserted twice.
function collectPhotobookPlacedIds(current: PhotobookImageContent, urlToId: Map<string, string>): Set<string> {
  const ids = new Set<string>()
  const add = (img?: PhotobookManagedImage) => {
    const id = img && urlToId.get(img.value.asset.src)
    if (id) ids.add(id)
  }
  add(current.cover)
  add(current.introduction)
  add(current.highlight)
  add(current.ending)
  current.story.forEach(add)
  current.gallery.forEach(add)
  return ids
}

function collectPortfolioPlacedIds(current: PortfolioImageContent, urlToId: Map<string, string>): Set<string> {
  const ids = new Set<string>()
  const add = (img?: PortfolioManagedImage) => {
    const id = img && urlToId.get(img.value.asset.src)
    if (id) ids.add(id)
  }
  add(current.hero)
  add(current.bio)
  current.featuredWork.forEach(add)
  return ids
}

function applyPhotobookDefaultPlacement(idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): void {
  const store = useContentStore.getState()
  const current = store.photobookImageContent
  const alreadyPlaced = collectPhotobookPlacedIds(current, urlToIdMap(idToDoc))
  const freshIds = newPhotoIds.filter((id) => !alreadyPlaced.has(id))
  if (freshIds.length === 0) return
  const emptySlots = new Set(PHOTOBOOK_SINGLE_SLOTS.filter((slot) => !current[slot]))
  const { singles, story, gallery } = computePhotobookDefaults(freshIds, idToDoc, emptySlots, current.story.length)
  const doc = (id: string) => idToDoc.get(id)!

  for (const slot of PHOTOBOOK_SINGLE_SLOTS) {
    const id = singles[slot]
    if (id) store.setPhotobookSingleImage(slot, makePhotobookImage(doc(id), PHOTOBOOK_SLOT_IDS[slot], undefined))
  }
  if (story.length > 0) {
    store.setPhotobookStoryMoments([
      ...current.story.map((image) => ({ image, caption: image.value.caption })),
      ...story.map((id) => ({ image: makePhotobookImage(doc(id), 'photobook.story.block', undefined) })),
    ])
  }
  if (gallery.length > 0) {
    store.setPhotobookGalleryPhotos([
      ...current.gallery.map((image) => ({ image, caption: image.value.caption })),
      ...gallery.map((id) => ({ image: makePhotobookImage(doc(id), 'photobook.gallery.item', undefined) })),
    ])
  }
  store.setPhotobookSectionVisibility({
    showStory:     story.length > 0 || current.story.length > 0,
    showGallery:   gallery.length > 0 || current.gallery.length > 0,
    showHighlight: !!(singles.highlight || current.highlight),
  })
}

function applyPortfolioDefaultPlacement(idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): void {
  const store = useContentStore.getState()
  const current = store.portfolioImageContent
  const alreadyPlaced = collectPortfolioPlacedIds(current, urlToIdMap(idToDoc))
  const freshIds = newPhotoIds.filter((id) => !alreadyPlaced.has(id))
  if (freshIds.length === 0) return
  const emptySlots = new Set(PORTFOLIO_SINGLE_SLOTS.filter((slot) => !current[slot]))
  const { hero, bio } = computePortfolioDefaults(freshIds, idToDoc, emptySlots)
  const doc = (id: string) => idToDoc.get(id)!

  if (hero) store.setPortfolioSingleImage('hero', makePortfolioImage(doc(hero), PORTFOLIO_SLOT_IDS.hero, undefined))
  if (bio)  store.setPortfolioSingleImage('bio', makePortfolioImage(doc(bio), PORTFOLIO_SLOT_IDS.bio, undefined))
}

/** Call once, right before any generation step, for any newly attached photos. */
export function applyDefaultPlacement(mode: AiChatMode, idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): void {
  if (newPhotoIds.length === 0) return
  if (mode === 'photobook') applyPhotobookDefaultPlacement(idToDoc, newPhotoIds)
  else applyPortfolioDefaultPlacement(idToDoc, newPhotoIds)
}

/** Section content always starts out holding the template's sample copy (kept on purpose so a
 *  brand-new project doesn't look empty in the editor) — this checks the actual PHOTO placement
 *  instead, which is a reliable "nothing here yet" signal. Call BEFORE applyDefaultPlacement runs,
 *  so it reflects whether the project had zero photos placed prior to this turn. */
export function isProjectBlank(mode: AiChatMode, current: PhotobookImageContent | PortfolioImageContent): boolean {
  if (mode === 'photobook') {
    const img = current as PhotobookImageContent
    return !img.cover && !img.introduction && !img.highlight && !img.ending && img.story.length === 0 && img.gallery.length === 0
  }
  const img = current as PortfolioImageContent
  return !img.hero && !img.bio && img.featuredWork.length === 0
}
