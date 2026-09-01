import { useContentStore } from '@/editor/lib/store/content'
import { useAiBriefStore } from '@/editor/lib/store/ai-brief'
import { getProjectImageSelectUrl, type ProjectImageDoc } from '@/editor/hooks/use-project-images'
import type { AiChatMode, AiPhotoRef } from '../core/types'
import { classifyIntent } from '../intent/classify'
import { generateChatReply } from '../chat/respond'
import { decidePhotobookStyle } from '../style/photobook'
import { decidePortfolioStyle } from '../style/portfolio'
import {
  PHOTOBOOK_SECTION_KEYS,
  generatePhotobookCover,
  generatePhotobookIntroduction,
  generatePhotobookGallery,
  generatePhotobookHighlight,
  generatePhotobookEnding,
  generatePhotobookStory,
} from '../content/photobook'
import {
  PORTFOLIO_SECTION_KEYS,
  generatePortfolioHeader,
  generatePortfolioHero,
  generatePortfolioBio,
  generatePortfolioContact,
  generatePortfolioFooter,
  generatePortfolioFeaturedWork,
} from '../content/portfolio'
import { defaultPhotobookContent } from '@/editor/modes/photobook/store-slice'
import { defaultPortfolioContent } from '@/editor/modes/portfolio/store-slice'
import { applyDefaultPlacement, isProjectBlank, urlToIdMap } from './placement'
import {
  applyPhotobookStyle,
  applyPortfolioStyle,
  applyPhotobookCover,
  applyPhotobookIntroduction,
  applyPhotobookGallery,
  applyPhotobookHighlight,
  applyPhotobookEnding,
  applyPhotobookStory,
  applyPortfolioHeader,
  applyPortfolioHero,
  applyPortfolioBio,
  applyPortfolioContact,
  applyPortfolioFooter,
  applyPortfolioFeaturedWork,
} from './apply'

// The single entry point for the new pipeline — replaces the old one-mega-call sendMessage() +
// applyChanges(). Every step below is a small, independently-callable, fully-`required`-schema
// narrow call (see /memories/session/ai-rewrite-plan.md); the orchestrator's only job is deciding
// WHICH of them to run this turn and applying each result the instant it comes back.

export type AiPipelineResult =
  | { kind: 'chat'; message: string }
  | { kind: 'applied'; intent: 'generate_all' | 'edit_theme' | 'edit_section'; sectionsWritten: string[]; styleChanged: boolean }

export interface RunAiPipelineInput {
  mode: AiChatMode
  prompt: string
  language: string
  /** Every photo currently in the project's media library, keyed by its stable id. */
  idToDoc: Map<string, ProjectImageDoc>
  /** Ids attached specifically this turn (subset of idToDoc's keys). */
  newPhotoIds: string[]
}

const MAX_STYLE_SAMPLE_PHOTOS = 6

function pickStyleSamplePhotos(idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): AiPhotoRef[] {
  const ids = newPhotoIds.length > 0 ? newPhotoIds : Array.from(idToDoc.keys())
  return ids.slice(0, MAX_STYLE_SAMPLE_PHOTOS).map((id) => ({ id, url: getProjectImageSelectUrl(idToDoc.get(id)!) }))
}

function managedImageToPhotoRef(img: { id: string; value: { asset: { src: string } } } | undefined): AiPhotoRef | undefined {
  return img ? { id: img.id, url: img.value.asset.src } : undefined
}

// Every section starts out holding the template's nice-looking sample copy (kept on purpose so a
// brand-new project doesn't look empty in the editor) — sending that to a generator as "current
// content" would make the model treat it as real existing content and write around it instead of
// replacing it. Blank out any field that still exactly matches its section's untouched sample
// value before it's ever handed to a generate* call, so an unwritten field reads as genuinely
// empty (needs writing) rather than someone else's placeholder wedding.
function blankDefaults<T extends Record<string, unknown>>(current: T, defaults: T): T {
  const out = { ...current }
  for (const key of Object.keys(out) as (keyof T)[]) {
    if (typeof out[key] === 'string' && out[key] === defaults[key]) out[key] = '' as T[keyof T]
  }
  return out
}

export async function runAiPipeline(input: RunAiPipelineInput): Promise<AiPipelineResult> {
  const contentStoreBefore = useContentStore.getState()
  const isBlankProject = isProjectBlank(
    input.mode,
    input.mode === 'photobook' ? contentStoreBefore.photobookImageContent : contentStoreBefore.portfolioImageContent,
  )

  // Deterministic placement runs before any model call, exactly as in the old pipeline.
  applyDefaultPlacement(input.mode, input.idToDoc, input.newPhotoIds)

  const sectionKeys = input.mode === 'photobook' ? [...PHOTOBOOK_SECTION_KEYS] : [...PORTFOLIO_SECTION_KEYS]
  const intent = await classifyIntent({
    prompt: input.prompt,
    language: input.language,
    sectionKeys,
    isBlankProject,
    hasNewPhotos: input.newPhotoIds.length > 0,
  })

  if (intent.kind === 'chat') {
    const message = await generateChatReply({ prompt: input.prompt, language: input.language, mode: input.mode })
    return { kind: 'chat', message }
  }

  const runStyle = intent.kind === 'generate_all' || intent.kind === 'edit_theme'
  const runContent = intent.kind === 'generate_all' || intent.kind === 'edit_section'
  const sectionsInScope = intent.kind === 'edit_section' ? (intent.sections ?? []) : sectionKeys

  const [styleChanged] = await Promise.all([
    runStyle
      ? runStyleDecision(input, pickStyleSamplePhotos(input.idToDoc, input.newPhotoIds)).then(() => true)
      : Promise.resolve(false),
    runContent ? runContentGeneration(input, sectionsInScope) : Promise.resolve(),
  ])

  return {
    kind: 'applied',
    intent: intent.kind,
    sectionsWritten: runContent ? sectionsInScope : [],
    styleChanged,
  }
}

async function runStyleDecision(input: RunAiPipelineInput, photos: AiPhotoRef[]): Promise<void> {
  if (input.mode === 'photobook') {
    const result = await decidePhotobookStyle({ prompt: input.prompt, language: input.language, photos })
    applyPhotobookStyle(result)
  } else {
    const result = await decidePortfolioStyle({ prompt: input.prompt, language: input.language, photos })
    applyPortfolioStyle(result)
  }
}

async function runContentGeneration(input: RunAiPipelineInput, sections: string[]): Promise<void> {
  const inScope = new Set(sections)
  const calls: Promise<void>[] = []

  if (input.mode === 'photobook') {
    const store = useContentStore.getState()
    const content = store.photobookSectionContent
    const images = store.photobookImageContent

    if (inScope.has('cover')) {
      calls.push(generatePhotobookCover({
        prompt: input.prompt, language: input.language, current: blankDefaults(content.cover, defaultPhotobookContent.cover), photo: managedImageToPhotoRef(images.cover),
      }).then(applyPhotobookCover))
    }
    if (inScope.has('introduction')) {
      calls.push(generatePhotobookIntroduction({
        prompt: input.prompt, language: input.language, current: blankDefaults(content.introduction, defaultPhotobookContent.introduction), photo: managedImageToPhotoRef(images.introduction),
      }).then(applyPhotobookIntroduction))
    }
    if (inScope.has('gallery')) {
      calls.push(generatePhotobookGallery({
        prompt: input.prompt, language: input.language, current: blankDefaults(
          { label: content.gallery.label, title: content.gallery.title, description: content.gallery.description },
          { label: defaultPhotobookContent.gallery.label, title: defaultPhotobookContent.gallery.title, description: defaultPhotobookContent.gallery.description },
        ),
      }).then(applyPhotobookGallery))
    }
    if (inScope.has('highlight')) {
      calls.push(generatePhotobookHighlight({
        prompt: input.prompt, language: input.language, current: blankDefaults(
          { label: content.highlight.label, title: content.highlight.title, description: content.highlight.description, quote: content.highlight.quote },
          { label: defaultPhotobookContent.highlight.label, title: defaultPhotobookContent.highlight.title, description: defaultPhotobookContent.highlight.description, quote: defaultPhotobookContent.highlight.quote },
        ), photo: managedImageToPhotoRef(images.highlight),
      }).then(applyPhotobookHighlight))
    }
    if (inScope.has('ending')) {
      calls.push(generatePhotobookEnding({
        prompt: input.prompt, language: input.language, current: blankDefaults(content.ending, defaultPhotobookContent.ending), photo: managedImageToPhotoRef(images.ending),
      }).then(applyPhotobookEnding))
    }
    if (inScope.has('story')) {
      const urlToId = urlToIdMap(input.idToDoc)
      const storyPhotos: AiPhotoRef[] = images.story
        .map((img) => {
          const id = urlToId.get(img.value.asset.src)
          return id ? { id, url: img.value.asset.src } : undefined
        })
        .filter((p): p is AiPhotoRef => !!p)
      calls.push(generatePhotobookStory({
        prompt: input.prompt, language: input.language, current: blankDefaults(
          { label: content.story.label, title: content.story.title, date: content.story.date, location: content.story.location },
          { label: defaultPhotobookContent.story.label, title: defaultPhotobookContent.story.title, date: defaultPhotobookContent.story.date, location: defaultPhotobookContent.story.location },
        ), storyPhotos,
      }).then((result) => applyPhotobookStory(result, input.idToDoc)))
    }
  } else {
    const store = useContentStore.getState()
    const content = store.sectionContent
    const images = store.portfolioImageContent

    if (inScope.has('header')) {
      calls.push(generatePortfolioHeader({ prompt: input.prompt, language: input.language, current: blankDefaults(content.header, defaultPortfolioContent.header) }).then(applyPortfolioHeader))
    }
    if (inScope.has('hero')) {
      calls.push(generatePortfolioHero({
        prompt: input.prompt, language: input.language, current: blankDefaults(content.hero, defaultPortfolioContent.hero), photo: managedImageToPhotoRef(images.hero),
      }).then(applyPortfolioHero))
    }
    if (inScope.has('bio')) {
      calls.push(generatePortfolioBio({
        prompt: input.prompt, language: input.language, current: blankDefaults(
          { title: content.bio.title, subtitle: content.bio.subtitle, description: content.bio.description },
          { title: defaultPortfolioContent.bio.title, subtitle: defaultPortfolioContent.bio.subtitle, description: defaultPortfolioContent.bio.description },
        ), photo: managedImageToPhotoRef(images.bio),
      }).then(applyPortfolioBio))
    }
    if (inScope.has('contact')) {
      calls.push(generatePortfolioContact({ prompt: input.prompt, language: input.language, current: blankDefaults(content.contact, defaultPortfolioContent.contact) }).then(applyPortfolioContact))
    }
    if (inScope.has('footer')) {
      calls.push(generatePortfolioFooter({ prompt: input.prompt, language: input.language, current: blankDefaults(content.footer, defaultPortfolioContent.footer) }).then(applyPortfolioFooter))
    }
    if (inScope.has('featuredWork')) {
      const urlToId = urlToIdMap(input.idToDoc)
      const claimedIds = new Set(
        [images.hero, images.bio].map(managedImageToPhotoRef).filter((p): p is AiPhotoRef => !!p).map((p) => urlToId.get(p.url)).filter((id): id is string => !!id),
      )
      const newPhotos: AiPhotoRef[] = input.newPhotoIds
        .filter((id) => !claimedIds.has(id))
        .map((id) => ({ id, url: getProjectImageSelectUrl(input.idToDoc.get(id)!) }))
      calls.push(generatePortfolioFeaturedWork({
        prompt: input.prompt,
        language: input.language,
        current: {
          title: content.featuredWork.title === defaultPortfolioContent.featuredWork.title ? '' : content.featuredWork.title,
          subtitle: content.featuredWork.subtitle === defaultPortfolioContent.featuredWork.subtitle ? '' : content.featuredWork.subtitle,
        },
        existingProjects: content.featuredWork.projects,
        newPhotos,
      }).then((result) => applyPortfolioFeaturedWork(result, input.idToDoc)))
    }
  }

  await Promise.all(calls)
  useAiBriefStore.getState().markGenerated(sections)
}
