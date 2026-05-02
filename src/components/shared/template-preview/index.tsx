'use client'

import { getTheme } from '@/editor/lib/themes'
import type { SectionContent, PhotobookSectionContent } from '@/editor/lib/types'
import type { AspectRatio, FrameStyle } from '@/editor/lib/types'
import type { ImageCropData } from '@/editor/lib/crop-data'
import { previewTheme, type PreviewColors } from './theme-extract'
import { ScaledWrapper } from './scaled-wrapper'
import { PORTFOLIO_PREVIEW_REGISTRY, PHOTOBOOK_PREVIEW_REGISTRY } from './template-registry'
import { AnimationProvider, type TemplateId } from '@/editor/components/templates/primitives/animation-context'

type PC = PreviewColors

// ─── Fallback ─────────────────────────────────────────────────────────────────

function Fallback({ c }: { c: PC }) {
  return (
    <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${c.muted}, ${c.bg})` }} />
  )
}

// ─── sectionContent builders ──────────────────────────────────────────────────

function buildPreviewSectionContent({ title, subtitle, heroImageUrl, aspectRatio, frameStyle, cropData }: {
  title?: string
  subtitle?: string
  heroImageUrl?: string
  aspectRatio?: string
  frameStyle?: string
  cropData?: ImageCropData
}): SectionContent {
  return {
    hero: {
      title: title ?? 'Your Name',
      subtitle: subtitle ?? 'Photographer',
      description: 'Photography that tells the story behind the frame.',
      image: heroImageUrl,
      aspectRatio: (aspectRatio as AspectRatio) ?? 'portrait',
      frameStyle: (frameStyle as FrameStyle) ?? 'none',
      cropData,
    },
  } as SectionContent
}

function buildPreviewPhotobookSectionContent({ title, subtitle, date, heroImageUrl, aspectRatio, frameStyle, cropData }: {
  title?: string
  subtitle?: string
  date?: string
  heroImageUrl?: string
  aspectRatio?: string
  frameStyle?: string
  cropData?: ImageCropData
}): PhotobookSectionContent {
  return {
    cover: {
      title: title ?? 'Album Title',
      subtitle: subtitle,
      date: date,
      images: heroImageUrl
        ? {
            id: 'preview',
            image: heroImageUrl,
            imageSettings: [{
              aspectRatio: (aspectRatio as AspectRatio) ?? 'portrait',
              frameStyle: (frameStyle as FrameStyle) ?? 'none',
              cropData,
            }],
          }
        : undefined,
    },
    introduction: {},
    story: {},
    gallery: {},
    highlight: {},
    ending: {},
  } as PhotobookSectionContent
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
  cropData?: ImageCropData
  /** Zoom multiplier for the scaled wrapper. Default 3. Use 4 for smaller cards. */
  zoom?: number
}

export function TemplatePreview({ themeId, templateId, heroImageUrl, title, subtitle, date, aspectRatio, frameStyle, cropData, zoom = 3 }: TemplatePreviewProps) {
  const c = previewTheme(themeId ?? 'parchment')
  const theme = getTheme(themeId ?? 'parchment')
  const img = heroImageUrl || undefined

  // Normalise: strip 'photobook-' prefix so the id matches TEMPLATE_CONFIG keys
  const normalizedId = (templateId ?? '').replace(/^photobook-/, '')

  // Portfolio templates
  const HeroComponent = PORTFOLIO_PREVIEW_REGISTRY[templateId ?? '']
  if (HeroComponent) {
    const sectionContent = buildPreviewSectionContent({ title, subtitle, heroImageUrl: img, aspectRatio, frameStyle, cropData })
    return (
      <ScaledWrapper zoom={zoom} background={theme.background}>
        <AnimationProvider templateId={(normalizedId || 'editorial') as TemplateId} disabled>
          <HeroComponent theme={theme} sectionContent={sectionContent} />
        </AnimationProvider>
      </ScaledWrapper>
    )
  }

  // Photobook templates
  const CoverComponent = PHOTOBOOK_PREVIEW_REGISTRY[templateId ?? '']
  if (CoverComponent) {
    const sectionContent = buildPreviewPhotobookSectionContent({ title, subtitle, date, heroImageUrl: img, aspectRatio, frameStyle, cropData })
    return (
      <ScaledWrapper zoom={zoom} background={theme.background}>
        <AnimationProvider templateId={(normalizedId || 'lumiere') as TemplateId} disabled>
          <CoverComponent theme={theme} sectionContent={sectionContent} />
        </AnimationProvider>
      </ScaledWrapper>
    )
  }

  return <Fallback c={c} />
}

