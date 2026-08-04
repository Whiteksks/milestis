import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import type {
  AiResponse,
  AiPhotobookChanges,
  AiPortfolioChanges,
  AiPhotobookImageChanges,
  AiPortfolioImageChanges,
  AiPortfolioProjectChange,
} from './types'
import { getProjectImageSelectUrl, type ProjectImageDoc } from '@/editor/hooks/use-project-images'
import type { PhotobookManagedImage } from '@/editor/modes/photobook/image/types'
import type { PortfolioManagedImage } from '@/editor/modes/portfolio/image/types'
import type { ImageValue } from '@/editor/image/data'

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

// ─── Assignment repair ─────────────────────────────────────────────────────────
// The model's photo ids are not trustworthy on their own (unknown ids, duplicates, or photos
// it forgot to place). These helpers turn them into a guaranteed-valid layout: every id in
// mustPlaceIds ends up in exactly one slot, and no id is used twice or references an unknown photo.

interface RepairedPhotobookAssignments {
  cover?: string
  introduction?: string
  story: string[]
  gallery: string[]
  highlight?: string
  ending?: string
}

function repairPhotobookAssignments(
  ia: AiPhotobookImageChanges,
  validIds: Set<string>,
  mustPlaceIds: Set<string>,
): RepairedPhotobookAssignments {
  const used = new Set<string>()
  const claim = (id: string | undefined): string | undefined => {
    if (!id || !validIds.has(id) || used.has(id)) return undefined
    used.add(id)
    return id
  }
  const claimMany = (arr: string[] | undefined): string[] =>
    (arr ?? []).map(claim).filter((id): id is string => id !== undefined)

  const cover = claim(ia.cover)
  const introduction = claim(ia.introduction)
  const highlight = claim(ia.highlight)
  const ending = claim(ia.ending)
  const story = claimMany(ia.story)
  const gallery = claimMany(ia.gallery)

  // Any newly attached photo the model didn't place anywhere falls back into the gallery so it's never lost
  for (const id of mustPlaceIds) {
    if (!used.has(id)) gallery.push(id)
  }

  return { cover, introduction, story, gallery, highlight, ending }
}

interface RepairedPortfolioAssignments {
  hero?: string
  bio?: string
  projects: AiPortfolioProjectChange[]
}

function repairPortfolioAssignments(
  ia: AiPortfolioImageChanges | undefined,
  projects: AiPortfolioProjectChange[] | undefined,
  validIds: Set<string>,
  mustPlaceIds: Set<string>,
): RepairedPortfolioAssignments {
  const used = new Set<string>()
  const claim = (id: string | undefined): string | undefined => {
    if (!id || !validIds.has(id) || used.has(id)) return undefined
    used.add(id)
    return id
  }

  const hero = claim(ia?.hero)
  const bio = claim(ia?.bio)
  const repairedProjects = (projects ?? []).map((p) => ({ ...p, photoId: claim(p.photoId) }))

  // Any newly attached photo no card claimed becomes its own new card so it's never lost
  const leftovers: AiPortfolioProjectChange[] = []
  for (const id of mustPlaceIds) {
    if (!used.has(id)) {
      used.add(id)
      leftovers.push({ id: crypto.randomUUID(), title: '', description: '', photoId: id })
    }
  }

  return { hero, bio, projects: [...repairedProjects, ...leftovers] }
}

// ─── Photobook ────────────────────────────────────────────────────────────────

function applyPhotobookChanges(changes: AiPhotobookChanges, idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): void {
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

  // Fall back to an empty assignment (repaired below) when the model forgot it, but only for photos newly attached this turn
  const rawIa = changes.imageAssignments ?? (newPhotoIds.length > 0 ? {} : undefined)
  if (rawIa) {
    const validIds = new Set(idToDoc.keys())
    const ia = repairPhotobookAssignments(rawIa, validIds, new Set(newPhotoIds))
    const captionMap = new Map((changes.captions ?? []).map((c) => [c.photoId, c.caption]))
    const doc = (id: string) => idToDoc.get(id)!
    const cap = (id: string) => captionMap.get(id)

    // Single-image slots read imageContent directly — no parallel array to keep in sync
    store.setPhotobookSingleImage('cover', ia.cover !== undefined ? makePhotobookImage(doc(ia.cover), 'photobook.cover.primary', cap(ia.cover)) : undefined)
    store.setPhotobookSingleImage('introduction', ia.introduction !== undefined ? makePhotobookImage(doc(ia.introduction), 'photobook.introduction.primary', cap(ia.introduction)) : undefined)
    store.setPhotobookSingleImage('highlight', ia.highlight !== undefined ? makePhotobookImage(doc(ia.highlight), 'photobook.highlight.primary', cap(ia.highlight)) : undefined)
    store.setPhotobookSingleImage('ending', ia.ending !== undefined ? makePhotobookImage(doc(ia.ending), 'photobook.ending.primary', cap(ia.ending)) : undefined)

    // Repeating slots (story/gallery) render from sectionContent's id-matched meta array, not imageContent directly —
    // these atomic setters are the only way to write them, so meta and image can never fall out of sync
    store.setPhotobookStoryMoments(ia.story.map((id) => ({ image: makePhotobookImage(doc(id), 'photobook.story.block', cap(id)), caption: cap(id) })))
    store.setPhotobookGalleryPhotos(ia.gallery.map((id) => ({ image: makePhotobookImage(doc(id), 'photobook.gallery.item', cap(id)), caption: cap(id) })))

    store.setPhotobookSectionVisibility({
      showCover:        true,
      showIntroduction: true,
      showStory:        ia.story.length > 0,
      showGallery:      ia.gallery.length > 0,
      showHighlight:    ia.highlight !== undefined,
      showEnding:       true,
    })
  }
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

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

  const projectsInput = changes.content?.featuredWork?.projects
  const hasImageIntent = !!changes.imageAssignments || !!projectsInput || newPhotoIds.length > 0
  if (hasImageIntent) {
    const validIds = new Set(idToDoc.keys())
    const { hero, bio, projects } = repairPortfolioAssignments(changes.imageAssignments, projectsInput, validIds, new Set(newPhotoIds))
    const captionMap = new Map((changes.captions ?? []).map((c) => [c.photoId, c.caption]))
    const doc = (id: string) => idToDoc.get(id)!
    const cap = (id: string) => captionMap.get(id)

    store.setPortfolioSingleImage('hero', hero !== undefined ? makePortfolioImage(doc(hero), 'portfolio.hero.primary', cap(hero)) : undefined)
    store.setPortfolioSingleImage('bio', bio !== undefined ? makePortfolioImage(doc(bio), 'portfolio.bio.primary', cap(bio)) : undefined)

    // Each card carries its own text AND (optionally) its photo, keyed by the same project id —
    // the atomic setter below can never let text and photo drift apart
    store.setFeaturedWorkItems(projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tags: p.tags,
      image: p.photoId ? makePortfolioImage(doc(p.photoId), 'portfolio.featured-work.item', undefined, p.id) : undefined,
    })))

    useContentStore.setState((state) => ({
      sectionVisibility: {
        ...state.sectionVisibility,
        showHeader:       true,
        showHero:         true,
        showBio:          !!bio,
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
    applyPhotobookChanges(response.changes as AiPhotobookChanges, idToDoc, newPhotoIds)
  } else {
    applyPortfolioChanges(response.changes as AiPortfolioChanges, idToDoc, newPhotoIds)
  }
}

