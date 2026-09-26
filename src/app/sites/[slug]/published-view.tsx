'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/config/themes'
import { MODE_REGISTRY } from '@/editor/lib/modes'
import type { EditorMode } from '@/editor/lib/types'
import type { ThemeCustomizations } from '@/editor/lib/store/theme'
import type { ThemeCustomDecorations } from '@/editor/lib/types'
import type { DecorationAnimation } from '@/editor/lib/config/decoration-animations'
import { PublishedBackgroundLayers } from '@/editor/components/editor/layout/background-layers/published-background-layers'
import { DecorationsLayer } from '@/editor/components/editor/layout/decorationEdit/decorations-logic'
import { MilestisWhiteLabel } from '@/app/sites/[slug]/milestis-white-label'

// ─── Published view ───────────────────────────────────────────────────────────

interface PublishedViewProps {
  pageId?: string
  onPageChange?: (pageId: string) => void
  mode: EditorMode
  templateId: string
  themeId: string
  themeCustomizations: ThemeCustomizations
  customDecorations: ThemeCustomDecorations[]
  content: Record<string, unknown>
  imageContent?: Record<string, unknown>
  visibility: Record<string, unknown>
  clickable?: boolean
  /** uid владельца проекта — прокидывается в MilestisWhiteLabel для реферальной ссылки. */
  referrerUid?: string
  /** Passed to renderPublished for modes that need direct Firestore access (event). */
  projectId?: string
  publishedData?: Record<string, unknown>
}

export function PublishedView({
  pageId,
  onPageChange,
  mode,
  templateId,
  themeId,
  themeCustomizations,
  customDecorations,
  content,
  imageContent,
  visibility,
  clickable = true,
  referrerUid,
  projectId,
  publishedData,
}: PublishedViewProps) {
  const theme = getTheme(themeId)
  const isMobile = useIsMobile()

  // Disable browser scroll restoration so the browser doesn't try to restore
  // a saved scroll offset on reload, which conflicts with motion/react's
  // initial animation states and causes a visible scroll-then-snap-to-top jump.
  useEffect(() => {
    if (mode === 'menu') return
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      const previous = history.scrollRestoration
      history.scrollRestoration = 'manual'
      return () => { history.scrollRestoration = previous }
    }
  }, [mode])
  const deviceView = isMobile === true ? 'mobile' : 'desktop'

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const template = MODE_REGISTRY[mode].renderPublished({
    pageId,
    onPageChange,
    templateId,
    theme,
    themeCustomizations,
    content,
    imageContent,
    visibility,
    handleAnchorClick,
    projectId,
    publishedData,
  })

  // Ensure every decoration has a stable id (same normalisation as the editor)
  const decorations = customDecorations.map((d, i) => ({ ...d, id: d.id ?? `decoration-${i}` }))

  const decorationAnimation = (themeCustomizations.decorationAnimation ?? 'fade') as DecorationAnimation

  return (
    <div className={cn('@container w-full min-h-screen relative', theme.background)}>
      {/* Background effects layer (depth / rays / texture) */}
      {mode !== 'menu' && <PublishedBackgroundLayers theme={theme} themeCustomizations={themeCustomizations} />}

      {/* Content root — mirrors the canvas content-root div with typography classes */}
      <div
        className={cn(
          'relative z-10 w-full min-h-screen',
          theme.foreground,
          theme.fontBody,
          theme.lineHeight,
          theme.letterSpacing,
          theme.shadow,
        )}
      >
        {/* Decorations layer — read-only (no selection / dragging) */}
        {!MODE_REGISTRY[mode].uiConfig.hideDecorations && <DecorationsLayer
          decorations={decorations}
          selectedId={null}
          deviceView={deviceView}
          animation={decorationAnimation}
          onUpdate={() => {}}
          onRemove={() => {}}
        />}

        <div className="relative z-10">
          {template}
        </div>

        {mode !== 'menu' && <MilestisWhiteLabel clickable={clickable} referrerUid={referrerUid} />}
      </div>
    </div>
  )
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
    router.push(`?share=${encodeURIComponent(value.trim())}`)
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
