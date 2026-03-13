/* eslint-disable @next/next/no-img-element */
'use client'

import { previewTheme, type PreviewColors } from './theme-extract'
import { EditorialHeroPreview } from './portfolio-preview/editorial-hero-preview'
import { MinimalHeroPreview } from './portfolio-preview/minimal-hero-preview'
import { ElegantHeroPreview } from './portfolio-preview/elegant-hero-preview'
import { GridHeroPreview } from './portfolio-preview/grid-hero-preview'
import { BentoHeroPreview } from './portfolio-preview/bento-hero-preview'
import { ShowcaseHeroPreview } from './portfolio-preview/showcase-hero-preview'
import { LiquidGlassHeroPreview } from './portfolio-preview/liquid-glass-hero-preview'
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
}

export function TemplatePreview({ themeId, templateId, heroImageUrl, title, subtitle, date, aspectRatio, frameStyle }: TemplatePreviewProps) {
  const c = previewTheme(themeId ?? 'parchment')
  const img = heroImageUrl || undefined

  switch (templateId) {
    // Portfolio
    case 'editorial':          return <EditorialHeroPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'minimal':            return <MinimalHeroPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'elegant':            return <ElegantHeroPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'grid':               return <GridHeroPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'bento':              return <BentoHeroPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'showcase':           return <ShowcaseHeroPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} />
    case 'liquid-glass':       return <LiquidGlassHeroPreview themeId={themeId} title={title} subtitle={subtitle} heroImageUrl={img} />
    // Photobook
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
