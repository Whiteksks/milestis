import { createAiOperation } from './operation'
import { runMenuPipeline } from '../menu/pipeline'
import { useContentStore } from '@/editor/lib/store/content'
import { useAiBriefStore } from '@/editor/lib/store/ai-brief'
import { getProjectImageThumbUrl, type ProjectImageDoc } from '@/editor/hooks/use-project-images'
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
// WHICH of them to run and committing their results only while the project revision is current.

export type AiPipelineResult =
  | { kind: 'chat'; message: string }
  | { kind: 'applied'; intent: 'generate_all' | 'edit_theme' | 'edit_section'; sectionsWritten: string[]; styleChanged: boolean; message?: string; undo?: () => boolean }

export type AiPipelineStage =
  | { kind: 'classifying' }
  | { kind: 'style' }
  | { kind: 'writing'; done: number; total: number }
  | { kind: 'replying' }

export interface RunAiPipelineInput {
  projectId: string
  signal?: AbortSignal
  mode: AiChatMode
  prompt: string
  language: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
  /** Every photo currently in the project's media library, keyed by its stable id. */
  idToDoc: Map<string, ProjectImageDoc>
  /** Ids attached specifically this turn (subset of idToDoc's keys). */
  newPhotoIds: string[]
  /** Fired at each real pipeline phase transition — lets the UI show an accurate status
   *  instead of a blind timed cycle. Best-effort only, never awaited. */
  onStage?: (stage: AiPipelineStage) => void
}

const MAX_STYLE_SAMPLE_PHOTOS = 6

function pickStyleSamplePhotos(idToDoc: Map<string, ProjectImageDoc>, newPhotoIds: string[]): AiPhotoRef[] {
  const ids = newPhotoIds.length > 0 ? newPhotoIds : Array.from(idToDoc.keys())
  return ids.slice(0, MAX_STYLE_SAMPLE_PHOTOS).map((id) => ({ id, url: getProjectImageThumbUrl(idToDoc.get(id)!) }))
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
  if (input.mode === 'menu') return runMenuPipeline(input)
  const operation = createAiOperation(input.projectId, input.signal)
  const guardedInput = { ...input, signal: operation.signal, onStage: (stage: AiPipelineStage) => {
    if (operation.isCurrent()) input.onStage?.(stage)
  } }
  try {
    return await Promise.race([runPipeline(guardedInput, operation), operation.interrupted])
  } finally { operation.dispose() }
}

async function runPipeline(input: RunAiPipelineInput, operation: ReturnType<typeof createAiOperation>): Promise<AiPipelineResult> {
  operation.check()
  const contentStoreBefore = useContentStore.getState()
  const isBlankProject = isProjectBlank(
    input.mode,
    input.mode === 'photobook' ? contentStoreBefore.photobookImageContent : contentStoreBefore.portfolioImageContent,
  )

  const sectionKeys = input.mode === 'photobook' ? [...PHOTOBOOK_SECTION_KEYS] : [...PORTFOLIO_SECTION_KEYS]
  input.onStage?.({ kind: 'classifying' })
  const intent = await classifyIntent({
    prompt: input.prompt,
    language: input.language,
    sectionKeys,
    isBlankProject,
    hasNewPhotos: input.newPhotoIds.length > 0,
  }, input)

  operation.check()
  if (intent.kind === 'chat') {
    input.onStage?.({ kind: 'replying' })
    const message = await generateChatReply({ prompt: input.prompt, language: input.language, mode: input.mode }, input)
    operation.check()
    return { kind: 'chat', message }
  }

  operation.apply(() => applyDefaultPlacement(input.mode, input.idToDoc, input.newPhotoIds))

  const runStyle = intent.kind === 'generate_all' || intent.kind === 'edit_theme'
  const runContent = intent.kind === 'generate_all' || intent.kind === 'edit_section'
  const sectionsInScope = intent.kind === 'edit_section' ? (intent.sections ?? []) : sectionKeys

  const [applyStyle, applyContent] = await Promise.all([
    runStyle
      ? runStyleDecision(input, pickStyleSamplePhotos(input.idToDoc, input.newPhotoIds))
      : Promise.resolve(() => {}),
    runContent ? runContentGeneration(input, sectionsInScope) : Promise.resolve([]),
  ])

  // Nothing generated is applied until every request succeeds and the original revision is current.
  operation.apply(() => {
    applyStyle()
    applyContent.forEach((apply) => apply())
    if (runContent) useAiBriefStore.getState().markGenerated(sectionsInScope)
  })

  return {
    kind: 'applied',
    intent: intent.kind,
    sectionsWritten: runContent ? sectionsInScope : [],
    styleChanged: runStyle,
  }
}

async function runStyleDecision(input: RunAiPipelineInput, photos: AiPhotoRef[]): Promise<() => void> {
  input.onStage?.({ kind: 'style' })
  if (input.mode === 'photobook') {
    const result = await decidePhotobookStyle({ prompt: input.prompt, language: input.language, photos }, input)
    return () => applyPhotobookStyle(result)
  } else {
    const result = await decidePortfolioStyle({ prompt: input.prompt, language: input.language, photos }, input)
    return () => applyPortfolioStyle(result)
  }
}

async function runContentGeneration(input: RunAiPipelineInput, sections: string[]): Promise<Array<() => void>> {
  const inScope = new Set(sections)
  const calls: Promise<() => void>[] = []
  // Maps a placed managed image's (full-res) src back to its original doc id — managed images
  // get a fresh slot uuid on placement (see placement.ts makePhotobookImage/makePortfolioImage),
  // so this is the only way to recover the real photo id for thumbnail lookup/claim-matching.
  const urlToId = urlToIdMap(input.idToDoc)

  function managedImageRef(img: { id: string; value: { asset: { src: string } } } | undefined): AiPhotoRef | undefined {
    if (!img) return undefined
    const docId = urlToId.get(img.value.asset.src)
    const doc = docId ? input.idToDoc.get(docId) : undefined
    return docId && doc ? { id: docId, url: getProjectImageThumbUrl(doc) } : undefined
  }

  if (input.mode === 'photobook') {
    const store = useContentStore.getState()
    const content = store.photobookSectionContent
    const images = store.photobookImageContent

    if (inScope.has('cover')) {
      calls.push(generatePhotobookCover({
        prompt: input.prompt, language: input.language, current: blankDefaults(content.cover, defaultPhotobookContent.cover), photo: managedImageRef(images.cover),
      }, input).then((result) => () => applyPhotobookCover(result)))
    }
    if (inScope.has('introduction')) {
      calls.push(generatePhotobookIntroduction({
        prompt: input.prompt, language: input.language, current: blankDefaults(content.introduction, defaultPhotobookContent.introduction), photo: managedImageRef(images.introduction),
      }, input).then((result) => () => applyPhotobookIntroduction(result)))
    }
    if (inScope.has('gallery')) {
      calls.push(generatePhotobookGallery({
        prompt: input.prompt, language: input.language, current: blankDefaults(
          { label: content.gallery.label, title: content.gallery.title, description: content.gallery.description },
          { label: defaultPhotobookContent.gallery.label, title: defaultPhotobookContent.gallery.title, description: defaultPhotobookContent.gallery.description },
        ),
      }, input).then((result) => () => applyPhotobookGallery(result)))
    }
    if (inScope.has('highlight')) {
      calls.push(generatePhotobookHighlight({
        prompt: input.prompt, language: input.language, current: blankDefaults(
          { label: content.highlight.label, title: content.highlight.title, description: content.highlight.description, quote: content.highlight.quote },
          { label: defaultPhotobookContent.highlight.label, title: defaultPhotobookContent.highlight.title, description: defaultPhotobookContent.highlight.description, quote: defaultPhotobookContent.highlight.quote },
        ), photo: managedImageRef(images.highlight),
      }, input).then((result) => () => applyPhotobookHighlight(result)))
    }
    if (inScope.has('ending')) {
      calls.push(generatePhotobookEnding({
        prompt: input.prompt, language: input.language, current: blankDefaults(content.ending, defaultPhotobookContent.ending), photo: managedImageRef(images.ending),
      }, input).then((result) => () => applyPhotobookEnding(result)))
    }
    if (inScope.has('story')) {
      const storyPhotos: AiPhotoRef[] = images.story
        .map((img) => managedImageRef(img))
        .filter((p): p is AiPhotoRef => !!p)
      calls.push(generatePhotobookStory({
        prompt: input.prompt, language: input.language, current: blankDefaults(
          { label: content.story.label, title: content.story.title, date: content.story.date, location: content.story.location },
          { label: defaultPhotobookContent.story.label, title: defaultPhotobookContent.story.title, date: defaultPhotobookContent.story.date, location: defaultPhotobookContent.story.location },
        ), storyPhotos,
      }, input).then((result) => () => applyPhotobookStory(result, input.idToDoc)))
    }
  } else {
    const store = useContentStore.getState()
    const content = store.sectionContent
    const images = store.portfolioImageContent

    if (inScope.has('header')) {
      calls.push(generatePortfolioHeader({ prompt: input.prompt, language: input.language, current: blankDefaults(content.header, defaultPortfolioContent.header) }, input).then((result) => () => applyPortfolioHeader(result)))
    }
    if (inScope.has('hero')) {
      calls.push(generatePortfolioHero({
        prompt: input.prompt, language: input.language, current: blankDefaults(content.hero, defaultPortfolioContent.hero), photo: managedImageRef(images.hero),
      }, input).then((result) => () => applyPortfolioHero(result)))
    }
    if (inScope.has('bio')) {
      calls.push(generatePortfolioBio({
        prompt: input.prompt, language: input.language, current: blankDefaults(
          { title: content.bio.title, subtitle: content.bio.subtitle, description: content.bio.description },
          { title: defaultPortfolioContent.bio.title, subtitle: defaultPortfolioContent.bio.subtitle, description: defaultPortfolioContent.bio.description },
        ), photo: managedImageRef(images.bio),
      }, input).then((result) => () => applyPortfolioBio(result)))
    }
    if (inScope.has('contact')) {
      calls.push(generatePortfolioContact({ prompt: input.prompt, language: input.language, current: blankDefaults(content.contact, defaultPortfolioContent.contact) }, input).then((result) => () => applyPortfolioContact(result)))
    }
    if (inScope.has('footer')) {
      calls.push(generatePortfolioFooter({ prompt: input.prompt, language: input.language, current: blankDefaults(content.footer, defaultPortfolioContent.footer) }, input).then((result) => () => applyPortfolioFooter(result)))
    }
    if (inScope.has('featuredWork')) {
      const claimedIds = new Set(
        [images.hero, images.bio].map((img) => managedImageRef(img)).filter((p): p is AiPhotoRef => !!p).map((p) => p.id),
      )
      const newPhotos: AiPhotoRef[] = input.newPhotoIds
        .filter((id) => !claimedIds.has(id))
        .map((id) => ({ id, url: getProjectImageThumbUrl(input.idToDoc.get(id)!) }))
      calls.push(generatePortfolioFeaturedWork({
        prompt: input.prompt,
        language: input.language,
        current: {
          title: content.featuredWork.title === defaultPortfolioContent.featuredWork.title ? '' : content.featuredWork.title,
          subtitle: content.featuredWork.subtitle === defaultPortfolioContent.featuredWork.subtitle ? '' : content.featuredWork.subtitle,
        },
        existingProjects: content.featuredWork.projects,
        newPhotos,
      }, input).then((result) => () => applyPortfolioFeaturedWork(result, input.idToDoc)))
    }
  }

  const total = calls.length
  let done = 0
  input.onStage?.({ kind: 'writing', done, total })
  return Promise.all(calls.map((call) => call.then((apply) => {
    done += 1
    input.onStage?.({ kind: 'writing', done, total })
    return apply
  })))

}
