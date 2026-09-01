import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import type {
  AiResponse,
  AiPhotobookChanges,
  AiPortfolioChanges,
  AiPortfolioProjectChange,
} from './types'
import { type ProjectImageDoc } from '@/editor/hooks/use-project-images'
import type { PhotobookManagedImage } from '@/editor/modes/photobook/image/types'
import type { PortfolioManagedImage } from '@/editor/modes/portfolio/image/types'
import { LIMITS } from '@/editor/components/editor/section-settings/ui/panel-ui'
import { useAiBriefStore } from '@/editor/lib/store/ai-brief'
import type { PhotobookSingleSlot, PortfolioSingleSlot } from './defaultPlacement'
// Placement/blank-detection logic lives in ./pipeline/placement.ts (shared with the new pipeline
// being built alongside this file — see /memories/session/ai-rewrite-plan.md). Re-exported here
// unchanged so this file's public API (used by ai-chat-content.tsx) doesn't need to change yet.
import {
  makePhotobookImage,
  makePortfolioImage,
  urlToIdMap,
  PHOTOBOOK_SINGLE_SLOTS,
  PHOTOBOOK_SLOT_IDS,
  PORTFOLIO_SINGLE_SLOTS,
  PORTFOLIO_SLOT_IDS,
  applyDefaultPlacement,
  isProjectBlank,
} from './pipeline/placement'

export { applyDefaultPlacement, isProjectBlank }

// ─── Defensive text limits (system boundary) ───────────────────────────────────
// Gemini's structured-output schema has no way to cap a string's length, so nothing stops the
// model from ignoring the schema's char-budget hints and cramming a huge chunk of text into one
// field (seen in practice: everything piled into cover.title). Clamp every AI-authored string to
// the same limit the manual editor inputs already enforce, right before it reaches the store —
// only ever shortens fields that are actually present, so the "omit a field to keep its old
// value" partial-merge contract is untouched.
function clampStrings<T extends Record<string, unknown>>(obj: T, limits: Partial<Record<keyof T, number>>): T {
  const out = { ...obj }
  for (const key of Object.keys(out) as (keyof T)[]) {
    const limit = limits[key]
    const value = out[key]
    if (limit !== undefined && typeof value === 'string') out[key] = value.slice(0, limit) as T[keyof T]
  }
  return out
}

const PHOTOBOOK_CONTENT_LIMITS = {
  cover:        { title: LIMITS.title, subtitle: LIMITS.subtitle, date: LIMITS.date, location: LIMITS.location, tagline: LIMITS.tagline },
  introduction: { label: LIMITS.label, title: LIMITS.title, quote: LIMITS.quote, dedication: LIMITS.dedication },
  story:        { label: LIMITS.label, title: LIMITS.title, date: LIMITS.date, location: LIMITS.location },
  gallery:      { label: LIMITS.label, title: LIMITS.title, description: LIMITS.description },
  highlight:    { label: LIMITS.label, title: LIMITS.title, description: LIMITS.description, quote: LIMITS.quote },
  ending:       { title: LIMITS.title, text: LIMITS.description, date: LIMITS.date, signature: LIMITS.signature },
} as const

const PORTFOLIO_CONTENT_LIMITS = {
  header:  { title: LIMITS.title },
  hero:    { title: LIMITS.title, subtitle: LIMITS.subtitle, description: LIMITS.description },
  bio:     { title: LIMITS.title, subtitle: LIMITS.subtitle, description: LIMITS.bio },
  contact: { title: LIMITS.title, subtitle: LIMITS.subtitle, description: LIMITS.description, email: LIMITS.email },
  footer:  { copyright: LIMITS.copyright },
} as const

// ─── Default placement (runs BEFORE the AI call) ───────────────────────────────
// Moved to ./pipeline/placement.ts (re-exported above) — kept here only as a comment anchor for
// where this logic used to live, since applyPhotobookImageChanges/applyPortfolioImageChanges
// below still depend on the slot constants imported above.

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
  for (const { photoId, caption: rawCaption } of captions ?? []) {
    const caption = rawCaption.slice(0, LIMITS.caption)
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
    if (c.cover)        store.updatePhotobookSection('cover', clampStrings(c.cover, PHOTOBOOK_CONTENT_LIMITS.cover), 'ai')
    if (c.introduction) store.updatePhotobookSection('introduction', clampStrings(c.introduction, PHOTOBOOK_CONTENT_LIMITS.introduction), 'ai')
    if (c.story)        store.updatePhotobookSection('story', clampStrings(c.story, PHOTOBOOK_CONTENT_LIMITS.story), 'ai')
    if (c.gallery)      store.updatePhotobookSection('gallery', clampStrings(c.gallery, PHOTOBOOK_CONTENT_LIMITS.gallery), 'ai')
    if (c.highlight)    store.updatePhotobookSection('highlight', clampStrings(c.highlight, PHOTOBOOK_CONTENT_LIMITS.highlight), 'ai')
    if (c.ending)       store.updatePhotobookSection('ending', clampStrings(c.ending, PHOTOBOOK_CONTENT_LIMITS.ending), 'ai')
    useAiBriefStore.getState().markGenerated(Object.keys(c))
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

  for (const { photoId, caption: rawCaption } of captions ?? []) {
    const caption = rawCaption.slice(0, LIMITS.caption)
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
    if (c.header) {
      const header = clampStrings(c.header, PORTFOLIO_CONTENT_LIMITS.header)
      store.updateSectionContent('header', {
        ...header,
        ...(header.links ? { links: header.links.slice(0, LIMITS.links).map((l) => ({ ...l, label: l.label.slice(0, LIMITS.linkLabel) })) } : {}),
      }, 'ai')
    }
    if (c.hero)    store.updateSectionContent('hero', clampStrings(c.hero, PORTFOLIO_CONTENT_LIMITS.hero), 'ai')
    if (c.bio) {
      const bio = clampStrings(c.bio, PORTFOLIO_CONTENT_LIMITS.bio)
      store.updateSectionContent('bio', {
        ...bio,
        ...(bio.achievements ? { achievements: bio.achievements.slice(0, LIMITS.count).map((a) => a.slice(0, LIMITS.achievement)) } : {}),
      }, 'ai')
    }
    if (c.contact) store.updateSectionContent('contact', clampStrings(c.contact, PORTFOLIO_CONTENT_LIMITS.contact), 'ai')
    if (c.footer)  store.updateSectionContent('footer', clampStrings(c.footer, PORTFOLIO_CONTENT_LIMITS.footer), 'ai')
    if (c.featuredWork && (c.featuredWork.title !== undefined || c.featuredWork.subtitle !== undefined)) {
      store.updateSectionContent('featuredWork', {
        ...(c.featuredWork.title !== undefined    ? { title: c.featuredWork.title.slice(0, LIMITS.title) } : {}),
        ...(c.featuredWork.subtitle !== undefined ? { subtitle: c.featuredWork.subtitle.slice(0, LIMITS.subtitle) } : {}),
      }, 'ai')
    }
    useAiBriefStore.getState().markGenerated(Object.keys(c))
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
    const projects = repairPortfolioProjects(projectsInput, validIds, mustPlaceIds).map((p) => ({
      ...p,
      title: p.title.slice(0, LIMITS.projectTitle),
      description: p.description.slice(0, LIMITS.projectDesc),
    }))
    const captionMap = new Map((changes.captions ?? []).map((c) => [c.photoId, c.caption.slice(0, LIMITS.caption)]))
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

/** Detects an "edit" response that claims to change something but actually carries nothing
 *  actionable (model hallucinating success) — lets the caller avoid a misleading confirmation. */
export function hasActionableChanges(changes: AiPhotobookChanges | AiPortfolioChanges | undefined): boolean {
  if (!changes) return false
  return !!(changes.theme || changes.content || changes.imageAssignments || (changes.captions && changes.captions.length > 0))
}

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

