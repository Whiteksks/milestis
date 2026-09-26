import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import { LIMITS } from '@/editor/components/editor/section-settings/ui/panel-ui'
import type { ProjectImageDoc } from '@/editor/hooks/use-project-images'
import { urlToIdMap, makePortfolioImage } from './placement'
import type { PhotobookStyleResult } from '../style/photobook'
import type { PortfolioStyleResult } from '../style/portfolio'
import type {
  PhotobookCoverResult,
  PhotobookIntroductionResult,
  PhotobookGalleryResult,
  PhotobookHighlightResult,
  PhotobookEndingResult,
  PhotobookStoryResult,
} from '../content/photobook'
import type {
  PortfolioHeaderResult,
  PortfolioHeroResult,
  PortfolioBioResult,
  PortfolioContactResult,
  PortfolioFooterResult,
  PortfolioFeaturedWorkResult,
} from '../content/portfolio'

// Writes narrow-call results into the stores. Each function here only ever touches the ONE
// section it's given — nothing here can accidentally clear a section it wasn't handed, unlike
// the old single-response applyChanges() which had to special-case "field omitted = keep old
// value" across one giant merged object. Text is still clamped as a defensive system-boundary
// measure so generated text respects the editor's field budgets.

function clampStrings<T extends object>(obj: T, limits: Record<string, number | undefined>): T {
  const out: Record<string, unknown> = { ...obj } as Record<string, unknown>
  for (const key of Object.keys(out)) {
    const limit = limits[key]
    const value = out[key]
    if (limit !== undefined && typeof value === 'string') out[key] = value.slice(0, limit)
  }
  return out as T
}

function withCaption<T extends { value: { caption?: string } }>(img: T, caption: string | undefined): T {
  if (caption === undefined) return img
  return { ...img, value: { ...img.value, caption: caption.slice(0, LIMITS.caption) } }
}

// ─── Style ──────────────────────────────────────────────────────────────────

export function applyPhotobookStyle(result: PhotobookStyleResult): void {
  const themeStore = useThemeStore.getState()
  themeStore.setTemplate(result.templateId)
  themeStore.setTheme(result.currentTheme)
  themeStore.updateThemeCustomization({
    photobookMood: result.photobookMood,
    photobookTexture: result.photobookTexture,
  })
}

export function applyPortfolioStyle(result: PortfolioStyleResult): void {
  const themeStore = useThemeStore.getState()
  themeStore.setTemplate(result.templateId)
  themeStore.setTheme(result.currentTheme)
  themeStore.updateThemeCustomization({
    depthEffect: result.depthEffect,
    raysEffect: result.raysEffect,
    textureEffect: result.textureEffect,
    backgroundLayersTheme: result.backgroundLayersTheme,
  })
}

// ─── Photobook content ──────────────────────────────────────────────────────

export function applyPhotobookCover(result: PhotobookCoverResult): void {
  const store = useContentStore.getState()
  const { caption, ...fields } = result
  store.updatePhotobookSection('cover', clampStrings(fields, {
    title: LIMITS.title, subtitle: LIMITS.subtitle, date: LIMITS.date, location: LIMITS.location, tagline: LIMITS.tagline,
  }), 'ai')
  const current = store.photobookImageContent.cover
  if (current && caption !== undefined) store.setPhotobookSingleImage('cover', withCaption(current, caption))
}

export function applyPhotobookIntroduction(result: PhotobookIntroductionResult): void {
  const store = useContentStore.getState()
  const { caption, ...fields } = result
  store.updatePhotobookSection('introduction', clampStrings(fields, {
    label: LIMITS.label, title: LIMITS.title, quote: LIMITS.quote, dedication: LIMITS.dedication,
  }), 'ai')
  const current = store.photobookImageContent.introduction
  if (current && caption !== undefined) store.setPhotobookSingleImage('introduction', withCaption(current, caption))
}

export function applyPhotobookGallery(result: PhotobookGalleryResult): void {
  const store = useContentStore.getState()
  store.updatePhotobookSection('gallery', clampStrings(result, {
    label: LIMITS.label, title: LIMITS.title, description: LIMITS.description,
  }), 'ai')
}

export function applyPhotobookHighlight(result: PhotobookHighlightResult): void {
  const store = useContentStore.getState()
  const { caption, ...fields } = result
  store.updatePhotobookSection('highlight', clampStrings(fields, {
    label: LIMITS.label, title: LIMITS.title, description: LIMITS.description, quote: LIMITS.quote,
  }), 'ai')
  const current = store.photobookImageContent.highlight
  if (current && caption !== undefined) store.setPhotobookSingleImage('highlight', withCaption(current, caption))
}

export function applyPhotobookEnding(result: PhotobookEndingResult): void {
  const store = useContentStore.getState()
  const { caption, ...fields } = result
  store.updatePhotobookSection('ending', clampStrings(fields, {
    title: LIMITS.title, text: LIMITS.description, date: LIMITS.date, signature: LIMITS.signature,
  }), 'ai')
  const current = store.photobookImageContent.ending
  if (current && caption !== undefined) store.setPhotobookSingleImage('ending', withCaption(current, caption))
}

export function applyPhotobookStory(result: PhotobookStoryResult, idToDoc: Map<string, ProjectImageDoc>): void {
  const store = useContentStore.getState()
  const { moments, ...fields } = result
  store.updatePhotobookSection('story', clampStrings(fields, {
    label: LIMITS.label, title: LIMITS.title, date: LIMITS.date, location: LIMITS.location,
  }), 'ai')
  if (!moments || moments.length === 0) return

  const urlToId = urlToIdMap(idToDoc)
  const captionByPhotoId = new Map(moments.map((m) => [m.photoId, m.caption]))
  const current = store.photobookImageContent.story
  store.setPhotobookStoryMoments(current.map((image) => {
    const photoId = urlToId.get(image.value.asset.src)
    const caption = (photoId && captionByPhotoId.get(photoId)) ?? image.value.caption
    return { image: withCaption(image, caption), caption }
  }))
}

// ─── Portfolio content ──────────────────────────────────────────────────────

export function applyPortfolioHeader(result: PortfolioHeaderResult): void {
  const store = useContentStore.getState()
  store.updateSectionContent('header', clampStrings(result, { title: LIMITS.title }), 'ai')
}

export function applyPortfolioHero(result: PortfolioHeroResult): void {
  const store = useContentStore.getState()
  const { caption, ...fields } = result
  store.updateSectionContent('hero', clampStrings(fields, {
    title: LIMITS.title, subtitle: LIMITS.subtitle, description: LIMITS.description,
  }), 'ai')
  const current = store.portfolioImageContent.hero
  if (current && caption !== undefined) store.setPortfolioSingleImage('hero', withCaption(current, caption))
}

export function applyPortfolioBio(result: PortfolioBioResult): void {
  const store = useContentStore.getState()
  const { caption, achievements, ...fields } = result
  store.updateSectionContent('bio', {
    ...clampStrings(fields, { title: LIMITS.title, subtitle: LIMITS.subtitle, description: LIMITS.bio }),
    achievements: (achievements ?? []).slice(0, LIMITS.count).map((a) => a.slice(0, LIMITS.achievement)),
  }, 'ai')
  const current = store.portfolioImageContent.bio
  if (current && caption !== undefined) store.setPortfolioSingleImage('bio', withCaption(current, caption))
}

export function applyPortfolioContact(result: PortfolioContactResult): void {
  const store = useContentStore.getState()
  store.updateSectionContent('contact', clampStrings(result, {
    title: LIMITS.title, subtitle: LIMITS.subtitle, description: LIMITS.description, email: LIMITS.email,
  }), 'ai')
}

export function applyPortfolioFooter(result: PortfolioFooterResult): void {
  const store = useContentStore.getState()
  store.updateSectionContent('footer', clampStrings(result, { copyright: LIMITS.copyright }), 'ai')
}

export function applyPortfolioFeaturedWork(result: PortfolioFeaturedWorkResult, idToDoc: Map<string, ProjectImageDoc>): void {
  const store = useContentStore.getState()
  store.updateSectionContent('featuredWork', {
    title: result.title.slice(0, LIMITS.title),
    subtitle: result.subtitle.slice(0, LIMITS.subtitle),
  }, 'ai')

  // Reconciliation the schema itself can't guarantee (see content/portfolio.ts's comment on this
  // function): drop duplicate/unknown photoId claims deterministically instead of trusting the
  // model never to double-claim a photo across two cards.
  const used = new Set<string>()
  const claim = (id: string | undefined): string | undefined => {
    if (!id || !idToDoc.has(id) || used.has(id)) return undefined
    used.add(id)
    return id
  }

  // The model is never told which existing card already has which photo (existingProjects only
  // carries text) — so a card with no fresh photoId claim this turn keeps whatever image it had
  // before, instead of losing it just because this generation call didn't re-confirm it.
  const existingImageById = new Map(store.portfolioImageContent.featuredWork.map((img) => [img.id, img]))
  const doc = (id: string) => idToDoc.get(id)!
  store.setFeaturedWorkItems(result.projects.map((p) => {
    const photoId = claim(p.photoId)
    const image = photoId ? makePortfolioImage(doc(photoId), 'portfolio.featured-work.item', undefined, p.id) : existingImageById.get(p.id)
    return {
      id: p.id,
      title: p.title.slice(0, LIMITS.projectTitle),
      description: p.description.slice(0, LIMITS.projectDesc),
      tags: p.tags,
      image,
    }
  }))

  useContentStore.setState((state) => ({
    sectionVisibility: {
      ...state.sectionVisibility,
      showFeaturedWork: result.projects.length > 0,
    },
  }))
}
