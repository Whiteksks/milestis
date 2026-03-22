/* eslint-disable @next/next/no-img-element */
'use client'

import { getTheme } from '@/editor/lib/themes'
import type { SectionContent } from '@/editor/lib/types'
import type { AspectRatio, FrameStyle } from '@/editor/lib/types'
import { previewTheme, type PreviewColors } from './theme-extract'
import { ScaledWrapper } from './scaled-wrapper'
import { PORTFOLIO_PREVIEW_REGISTRY } from './template-registry'
import { CoverSplitPreview } from './photobook-preview/cover-split-preview'
import { CoverTimelinePreview } from './photobook-preview/cover-timeline-preview'
import { CoverMasonryPreview } from './photobook-preview/cover-masonry-preview'
import { CoverHeroFullscreenPreview } from './photobook-preview/cover-hero-fullscreen-preview'
import { CoverCirclePortraitPreview } from './photobook-preview/cover-circle-portrait-preview'
import { CoverMagazinePreview } from './photobook-preview/cover-magazine-preview'
import { CoverPolaroidPreview } from './photobook-preview/cover-polaroid-preview'
import { CoverVerticalTextPreview } from './photobook-preview/cover-vertical-text-preview'

type PC = PreviewColors

// ─── Fallback ─────────────────────────────────────────────────────────────────

function Fallback({ c }: { c: PC }) {
  return (
    <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${c.muted}, ${c.bg})` }} />
  )
}

// ─── sectionContent builder ───────────────────────────────────────────────────

function buildPreviewSectionContent({ title, subtitle, heroImageUrl, aspectRatio, frameStyle }: {
  title?: string
  subtitle?: string
  heroImageUrl?: string
  aspectRatio?: string
  frameStyle?: string
}): SectionContent {
  return {
    hero: {
      title: title ?? 'Your Name',
      subtitle: subtitle ?? 'Photographer',
      description: 'Photography that tells the story behind the frame.',
      image: heroImageUrl,
      aspectRatio: (aspectRatio as AspectRatio) ?? 'portrait',
      frameStyle: (frameStyle as FrameStyle) ?? 'none',
    },
  } as SectionContent
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

interface TemplatePreviewProps {
  themeId?: string
  templateId?: string
  heroImageUrl?: string
  title?: string
  subtitle?: string
  date?: string
  aspectRatio?: string
  frameStyle?: string
  /** Zoom multiplier for the scaled wrapper. Default 3. Use 4 for smaller cards. */
  zoom?: number
}

export function TemplatePreview({ themeId, templateId, heroImageUrl, title, subtitle, date, aspectRatio, frameStyle, zoom = 3 }: TemplatePreviewProps) {
  const c = previewTheme(themeId ?? 'parchment')
  const img = heroImageUrl || undefined

  // Portfolio templates — resolved from registry
  const HeroComponent = PORTFOLIO_PREVIEW_REGISTRY[templateId ?? '']
  if (HeroComponent) {
    const theme = getTheme(themeId ?? 'parchment')
    const sectionContent = buildPreviewSectionContent({ title, subtitle, heroImageUrl: img, aspectRatio, frameStyle })
    return (
      <ScaledWrapper zoom={zoom} background={theme.background}>
        <HeroComponent theme={theme} sectionContent={sectionContent} disableAnimations />
      </ScaledWrapper>
    )
  }

  // Photobook templates
  switch (templateId) {
    case 'wedding-timeline':   return <CoverTimelinePreview themeId={themeId} title={title} subtitle={subtitle || date} heroImageUrl={img} />
    case 'masonry':            return <CoverMasonryPreview themeId={themeId} title={title} subtitle={subtitle || date} heroImageUrl={img} />
    case 'photobook-classic':  return <CoverHeroFullscreenPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} />
    case 'photobook-circle':   return <CoverCirclePortraitPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} />
    case 'photobook-magazine': return <CoverMagazinePreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} />
    case 'photobook-polaroid': return <CoverPolaroidPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} />
    case 'photobook-split':    return <CoverSplitPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} />
    case 'photobook-vertical': return <CoverVerticalTextPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} />
    default:                   return <Fallback c={c} />
  }
}

