import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import type {
  AiResponse,
  AiChatMode,
  AiPhotobookChanges,
  AiPortfolioChanges,
  AiPortfolioProjectChange,
} from './types'
import { getProjectImageSelectUrl, type ProjectImageDoc } from '@/editor/hooks/use-project-images'
import type { PhotobookManagedImage } from '@/editor/modes/photobook/image/types'
import type { PortfolioManagedImage } from '@/editor/modes/portfolio/image/types'
import type { ImageValue } from '@/editor/image/data'
import {
  computePhotobookDefaults,
  computePortfolioDefaults,
  type PhotobookSingleSlot,
  type PortfolioSingleSlot,
} from './defaultPlacement'

function buildImageValue(doc: ProjectImageDoc, caption: string | undefined): ImageValue {
  return {
    asset: { src: getProjectImageSelectUrl(doc), width: doc.meta?.width ?? 0, height: doc.meta?.height ?? 0 },
    ...(caption ? { caption } : {}),
  }
}

function makePhotobookImage(doc: ProjectImageDoc, slotId: PhotobookManagedImage['slotId'], caption: string | undefined): PhotobookManagedImage {
  return { id: crypto.randomUUID(), slotId, value: buildImageValue(doc, caption) }
}

// id defaults to a fresh uuid (hero/bio); featured-work cards pass their own stable project id explicitly
function makePortfolioImage(doc: ProjectImageDoc, slotId: PortfolioManagedImage['slotId'], caption: string | undefined, id = crypto.randomUUID()): PortfolioManagedImage {
  return { id, slotId, value: buildImageValue(doc, caption) }
}

function urlToIdMap(idToDoc: Map<string, ProjectImageDoc>): Map<string, string> {
  return new Map(Array.from(idToDoc.entries()).map(([id, doc]) => [getProjectImageSelectUrl(doc), id]))
}

const PHOTOBOOK_SINGLE_SLOTS: PhotobookSingleSlot[] = ['cover', 'introduction', 'highlight', 'ending']
const PHOTOBOOK_SLOT_IDS: Record<PhotobookSingleSlot, PhotobookManagedImage['slotId']> = {
  cover: 'photobook.cover.primary',
  introduction: 'photobook.introduction.primary',
  highlight: 'photobook.highlight.primary',
  ending: 'photobook.ending.primary',
}

const PORTFOLIO_SINGLE_SLOTS: PortfolioSingleSlot[] = ['hero', 'bio']
const PORTFOLIO_SLOT_IDS: Record<PortfolioSingleSlot, PortfolioManagedImage['slotId']> = {
  hero: 'portfolio.hero.primary',
  bio: 'portfolio.bio.primary',
}

// ─── Default placement (runs BEFORE the AI call) ───────────────────────────────
// Guarantees every newly attached photo already has a sensible home using cheap heuristics
// (orientation/resolution match, attach order) — the AI never places from scratch, it only
// reviews/overrides a handful of single-photo slots afterwards and writes captions.

function applyPhotobookDefaultPlacement(idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): void {
  const store = useContentStore.getState()
  const current = store.photobookImageContent
  const emptySlots = new Set(PHOTOBOOK_SINGLE_SLOTS.filter((slot) => !current[slot]))
  const { singles, story, gallery } = computePhotobookDefaults(newPhotoIds, idToDoc, emptySlots)
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
  const emptySlots = new Set(PORTFOLIO_SINGLE_SLOTS.filter((slot) => !current[slot]))
  const { hero, bio } = computePortfolioDefaults(newPhotoIds, idToDoc, emptySlots)
  const doc = (id: string) => idToDoc.get(id)!

  if (hero) store.setPortfolioSingleImage('hero', makePortfolioImage(doc(hero), PORTFOLIO_SLOT_IDS.hero, undefined))
  if (bio)  store.setPortfolioSingleImage('bio', makePortfolioImage(doc(bio), PORTFOLIO_SLOT_IDS.bio, undefined))
}

/** Call once, right before sending the message to the AI, for any newly attached photos. */
export function applyDefaultPlacement(mode: AiChatMode, idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): void {
  if (newPhotoIds.length === 0) return
  if (mode === 'photobook') applyPhotobookDefaultPlacement(idToDoc, newPhotoIds)
  else applyPortfolioDefaultPlacement(idToDoc, newPhotoIds)
}

// ─── Photobook: AI overrides + captions (runs AFTER the AI responds) ──────────
// imageAssignments is now an OPTIONAL, partial override of the four single-photo slots only —
// story/gallery are never part of it, they keep whatever the default placement gave them
// (captions still apply to a photo there, wherever it currently sits).

interface PhotoEntry { photoId: string; caption?: string }

function applyPhotobookImageChanges(changes: AiPhotobookChanges, idToDoc: Map<string, ProjectImageDoc>): void {
  const ia = changes.imageAssignments
  const captions = changes.captions
  if (!ia && !captions) return

  const store = useContentStore.getState()
  const current = store.photobookImageContent
  const urlToId = urlToIdMap(idToDoc)
  const photoIdOf = (img?: PhotobookManagedImage) => (img ? urlToId.get(img.value.asset.src) : undefined)

  const singles: Partial<Record<PhotobookSingleSlot, PhotoEntry>> = {}
  for (const slot of PHOTOBOOK_SINGLE_SLOTS) {
    const id = photoIdOf(current[slot])
    if (id) singles[slot] = { photoId: id, caption: current[slot]?.value.caption }
  }
  let gallery: PhotoEntry[] = current.gallery.map((img) => ({ photoId: photoIdOf(img)!, caption: img.value.caption })).filter((e) => e.photoId)
  let story: PhotoEntry[] = current.story.map((img) => ({ photoId: photoIdOf(img)!, caption: img.value.caption })).filter((e) => e.photoId)

  // Move the target photo into its overridden slot from wherever it currently sits, and push
  // whatever it displaces into gallery so it's never lost.
  for (const slot of PHOTOBOOK_SINGLE_SLOTS) {
    const newId = ia?.[slot]
    if (!newId || !idToDoc.has(newId) || singles[slot]?.photoId === newId) continue

    gallery = gallery.filter((e) => e.photoId !== newId)
    story = story.filter((e) => e.photoId !== newId)
    for (const other of PHOTOBOOK_SINGLE_SLOTS) {
      if (other !== slot && singles[other]?.photoId === newId) singles[other] = undefined
    }
    const displaced = singles[slot]
    if (displaced) gallery.push(displaced)
    singles[slot] = { photoId: newId }
  }

  // Captions apply to a photo wherever it currently lives, regardless of whether it was
  // auto-placed by the default or just overridden above.
  for (const { photoId, caption } of captions ?? []) {
    for (const slot of PHOTOBOOK_SINGLE_SLOTS) {
      if (singles[slot]?.photoId === photoId) singles[slot] = { photoId, caption }
    }
    gallery = gallery.map((e) => (e.photoId === photoId ? { ...e, caption } : e))
    story = story.map((e) => (e.photoId === photoId ? { ...e, caption } : e))
  }

  const doc = (id: string) => idToDoc.get(id)!
  for (const slot of PHOTOBOOK_SINGLE_SLOTS) {
    const entry = singles[slot]
    store.setPhotobookSingleImage(slot, entry ? makePhotobookImage(doc(entry.photoId), PHOTOBOOK_SLOT_IDS[slot], entry.caption) : undefined)
  }
  store.setPhotobookStoryMoments(story.map((e) => ({ image: makePhotobookImage(doc(e.photoId), 'photobook.story.block', e.caption), caption: e.caption })))
  store.setPhotobookGalleryPhotos(gallery.map((e) => ({ image: makePhotobookImage(doc(e.photoId), 'photobook.gallery.item', e.caption), caption: e.caption })))
  store.setPhotobookSectionVisibility({
    showStory: story.length > 0,
    showGallery: gallery.length > 0,
    showHighlight: !!singles.highlight,
  })
}

function applyPhotobookChanges(changes: AiPhotobookChanges, idToDoc: Map<string, ProjectImageDoc>): void {
  const store = useContentStore.getState()
  const themeStore = useThemeStore.getState()

  if (changes.theme) {
    const t = changes.theme
    if (t.templateId) themeStore.setTemplate(t.templateId)
    if (t.currentTheme) themeStore.setTheme(t.currentTheme)
    if (t.photobookMood !== undefined || t.photobookTexture !== undefined) {
      themeStore.updateThemeCustomization({
        ...(t.photobookMood !== undefined ? { photobookMood: t.photobookMood } : {}),
        ...(t.photobookTexture !== undefined ? { photobookTexture: t.photobookTexture } : {}),
      })
    }
  }

  if (changes.content) {
    const c = changes.content
    if (c.cover)        store.updatePhotobookSection('cover', c.cover)
    if (c.introduction) store.updatePhotobookSection('introduction', c.introduction)
    if (c.story)        store.updatePhotobookSection('story', c.story)
    if (c.gallery)      store.updatePhotobookSection('gallery', c.gallery)
    if (c.highlight)    store.updatePhotobookSection('highlight', c.highlight)
    if (c.ending)       store.updatePhotobookSection('ending', c.ending)
  }

  applyPhotobookImageChanges(changes, idToDoc)
}

// ─── Portfolio: AI overrides + captions (runs AFTER the AI responds) ──────────

function applyPortfolioImageChanges(changes: AiPortfolioChanges, idToDoc: Map<string, ProjectImageDoc>): void {
  const ia = changes.imageAssignments
  const captions = changes.captions
  if (!ia && !captions) return

  const store = useContentStore.getState()
  const current = store.portfolioImageContent
  const urlToId = urlToIdMap(idToDoc)
  const photoIdOf = (img?: PortfolioManagedImage) => (img ? urlToId.get(img.value.asset.src) : undefined)

  const singles: Partial<Record<PortfolioSingleSlot, PhotoEntry>> = {}
  for (const slot of PORTFOLIO_SINGLE_SLOTS) {
    const id = photoIdOf(current[slot])
    if (id) singles[slot] = { photoId: id, caption: current[slot]?.value.caption }
  }

  for (const slot of PORTFOLIO_SINGLE_SLOTS) {
    const newId = ia?.[slot]
    if (!newId || !idToDoc.has(newId) || singles[slot]?.photoId === newId) continue
    for (const other of PORTFOLIO_SINGLE_SLOTS) {
      if (other !== slot && singles[other]?.photoId === newId) singles[other] = undefined
    }
    singles[slot] = { photoId: newId }
  }

  for (const { photoId, caption } of captions ?? []) {
    for (const slot of PORTFOLIO_SINGLE_SLOTS) {
      if (singles[slot]?.photoId === photoId) singles[slot] = { photoId, caption }
    }
  }

  const doc = (id: string) => idToDoc.get(id)!
  for (const slot of PORTFOLIO_SINGLE_SLOTS) {
    const entry = singles[slot]
    store.setPortfolioSingleImage(slot, entry ? makePortfolioImage(doc(entry.photoId), PORTFOLIO_SLOT_IDS[slot], entry.caption) : undefined)
  }
}

// Featured-work cards are still fully AI-authored content (title/description), so this only
// guards against unknown/duplicate photoId references and catches any new photo no card claimed.
function repairPortfolioProjects(
  projects: AiPortfolioProjectChange[] | undefined,
  validIds: Set<string>,
  mustPlaceIds: Set<string>,
): AiPortfolioProjectChange[] {
  const used = new Set<string>()
  const claim = (id: string | undefined): string | undefined => {
    if (!id || !validIds.has(id) || used.has(id)) return undefined
    used.add(id)
    return id
  }
  const repaired = (projects ?? []).map((p) => ({ ...p, photoId: claim(p.photoId) }))

  const leftovers: AiPortfolioProjectChange[] = []
  for (const id of mustPlaceIds) {
    if (!used.has(id)) {
      used.add(id)
      leftovers.push({ id: crypto.randomUUID(), title: '', description: '', photoId: id })
    }
  }
  return [...repaired, ...leftovers]
}

function applyPortfolioChanges(changes: AiPortfolioChanges, idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): void {
  const store = useContentStore.getState()
  const themeStore = useThemeStore.getState()

  if (changes.theme) {
    const t = changes.theme
    if (t.templateId) themeStore.setTemplate(t.templateId)
    if (t.currentTheme) themeStore.setTheme(t.currentTheme)
    if (t.depthEffect !== undefined || t.raysEffect !== undefined || t.textureEffect !== undefined || t.backgroundLayersTheme !== undefined) {
      themeStore.updateThemeCustomization({
        ...(t.depthEffect !== undefined           ? { depthEffect: t.depthEffect } : {}),
        ...(t.raysEffect !== undefined            ? { raysEffect: t.raysEffect } : {}),
        ...(t.textureEffect !== undefined         ? { textureEffect: t.textureEffect } : {}),
        ...(t.backgroundLayersTheme !== undefined ? { backgroundLayersTheme: t.backgroundLayersTheme } : {}),
      })
    }
  }

  if (changes.content) {
    const c = changes.content
    if (c.header)  store.updateSectionContent('header', c.header)
    if (c.hero)    store.updateSectionContent('hero', c.hero)
    if (c.bio)     store.updateSectionContent('bio', c.bio)
    if (c.contact) store.updateSectionContent('contact', c.contact)
    if (c.footer)  store.updateSectionContent('footer', c.footer)
    if (c.featuredWork && (c.featuredWork.title !== undefined || c.featuredWork.subtitle !== undefined)) {
      store.updateSectionContent('featuredWork', {
        ...(c.featuredWork.title !== undefined    ? { title: c.featuredWork.title } : {}),
        ...(c.featuredWork.subtitle !== undefined ? { subtitle: c.featuredWork.subtitle } : {}),
      })
    }
  }

  applyPortfolioImageChanges(changes, idToDoc)

  const projectsInput = changes.content?.featuredWork?.projects
  const hasImageIntent = !!changes.imageAssignments || !!projectsInput || newPhotoIds.length > 0
  if (hasImageIntent) {
    // Re-read after applyPortfolioImageChanges so hero/bio overrides aren't re-claimed by a project card
    const afterImages = useContentStore.getState().portfolioImageContent
    const urlToId = urlToIdMap(idToDoc)
    const claimedBySingles = new Set(
      [afterImages.hero, afterImages.bio]
        .map((img) => (img ? urlToId.get(img.value.asset.src) : undefined))
        .filter((id): id is string => !!id),
    )
    const validIds = new Set(idToDoc.keys())
    const mustPlaceIds = new Set(newPhotoIds.filter((id) => !claimedBySingles.has(id)))
    const projects = repairPortfolioProjects(projectsInput, validIds, mustPlaceIds)
    const captionMap = new Map((changes.captions ?? []).map((c) => [c.photoId, c.caption]))
    const doc = (id: string) => idToDoc.get(id)!

    // Each card carries its own text AND (optionally) its photo, keyed by the same project id —
    // the atomic setter below can never let text and photo drift apart
    store.setFeaturedWorkItems(projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tags: p.tags,
      image: p.photoId ? makePortfolioImage(doc(p.photoId), 'portfolio.featured-work.item', captionMap.get(p.photoId), p.id) : undefined,
    })))

    useContentStore.setState((state) => ({
      sectionVisibility: {
        ...state.sectionVisibility,
        showHeader:       true,
        showHero:         true,
        showBio:          !!afterImages.bio,
        showFeaturedWork: projects.length > 0,
        showVideo:        false,
        showContact:      true,
        showFooter:       true,
      },
    }))
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function applyChanges(
  response: AiResponse,
  idToDoc: Map<string, ProjectImageDoc>,
  newPhotoIds: string[],
): void {
  if (!response.changes) return
  if (response.mode === 'photobook') {
    applyPhotobookChanges(response.changes as AiPhotobookChanges, idToDoc)
  } else {
    applyPortfolioChanges(response.changes as AiPortfolioChanges, idToDoc, newPhotoIds)
  }
}

