'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getTheme } from '@/editor/lib/themes'
import type { SectionContent, SectionVisibility, PhotobookSectionContent, PhotobookSectionVisibility } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'

// ─── Dynamic portfolio template imports (lazy, no SSR) ───────────────────────

const MinimalTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/minimal-template').then((m) => m.MinimalTemplateDesign),
  { ssr: false },
)
const EditorialTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/editorial-template').then((m) => m.EditorialTemplateDesign),
  { ssr: false },
)
const ElegantTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/elegant-template').then((m) => m.ElegantTemplateDesign),
  { ssr: false },
)
const GridTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/grid-template').then((m) => m.GridTemplateDesign),
  { ssr: false },
)
const BentoTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/bento-template').then((m) => m.BentoTemplateDesign),
  { ssr: false },
)
const ShowcaseTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/showcase-template').then((m) => m.ShowcaseTemplateDesign),
  { ssr: false },
)
const LiquidGlassTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/liquid-glass-template').then((m) => m.LiquidGlassTemplateDesign),
  { ssr: false },
)

// ─── Dynamic photobook template imports (lazy, no SSR) ───────────────────────

const TemplateMemoirDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-memoir').then((m) => m.TemplateMemoirDesign),
  { ssr: false },
)
const TemplateChronicleDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-chronicle').then((m) => m.TemplateChronicleDesign),
  { ssr: false },
)
const TemplateMagazineDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-magazine').then((m) => m.TemplateMagazineDesign),
  { ssr: false },
)
const TemplateLumiereDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-lumiere').then((m) => m.TemplateLumiereDesign),
  { ssr: false },
)
const TemplateSoleilDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-soleil').then((m) => m.TemplateSoleilDesign),
  { ssr: false },
)

// ─── Portfolio view ───────────────────────────────────────────────────────────

interface PortfolioViewProps {
  templateId: string
  themeId: string
  sectionContent: SectionContent
  sectionVisibility: SectionVisibility
}

export function PublishedPortfolioView({
  templateId,
  themeId,
  sectionContent,
  sectionVisibility,
}: PortfolioViewProps) {
  const theme: ThemeConfig = getTheme(themeId)

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith('#')) {
        e.preventDefault()
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [],
  )

  const sharedProps = {
    theme,
    sectionContent,
    sectionVisibility,
    handleAnchorClick,
  }

  switch (templateId) {
    case 'editorial':
      return <EditorialTemplateDesign {...sharedProps} />
    case 'elegant':
      return <ElegantTemplateDesign {...sharedProps} />
    case 'grid':
      return <GridTemplateDesign {...sharedProps} />
    case 'bento':
      return <BentoTemplateDesign {...sharedProps} />
    case 'showcase':
      return <ShowcaseTemplateDesign {...sharedProps} />
    case 'liquid-glass':
      return <LiquidGlassTemplateDesign {...sharedProps} />
    default:
      return <MinimalTemplateDesign {...sharedProps} />
  }
}

// ─── Photobook view ───────────────────────────────────────────────────────────

interface PhotobookViewProps {
  templateId: string
  themeId: string
  sectionContent: PhotobookSectionContent
  sectionVisibility: PhotobookSectionVisibility
}

export function PublishedPhotobookView({
  templateId,
  themeId,
  sectionContent,
  sectionVisibility,
}: PhotobookViewProps) {
  const theme: ThemeConfig = getTheme(themeId)

  const sharedProps = {
    theme,
    sectionContent,
    sectionVisibility,
  }

  switch (templateId) {
    case 'photobook-chronicle':
      return <TemplateChronicleDesign {...sharedProps} />
    case 'photobook-magazine':
      return <TemplateMagazineDesign {...sharedProps} />
    case 'photobook-lumiere':
      return <TemplateLumiereDesign {...sharedProps} />
    case 'photobook-soleil':
      return <TemplateSoleilDesign {...sharedProps} />
    default:
      return <TemplateMemoirDesign {...sharedProps} />
  }
}

// ─── Token gate form ──────────────────────────────────────────────────────────

interface TokenGateFormProps {
  slug: string
}

export function TokenGateForm({ slug: _slug }: TokenGateFormProps) {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    setError(false)
    router.push(`?token=${encodeURIComponent(value.trim())}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm px-6"
      >
        <h1 className="text-white text-xl font-medium text-center">
          This photobook is private
        </h1>
        <p className="text-neutral-400 text-sm text-center">
          Enter the access password to view it.
        </p>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false) }}
          placeholder="Password"
          className="rounded-lg border border-neutral-700 bg-neutral-900 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          autoFocus
        />
        {error && (
          <p className="text-red-400 text-xs text-center">Incorrect password</p>
        )}
        <button
          type="submit"
          className="rounded-lg bg-white text-black font-medium py-2.5 text-sm hover:bg-neutral-200 transition-colors"
        >
          View photobook
        </button>
      </form>
    </div>
  )
}
