'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { MODE_REGISTRY } from '@/editor/lib/modes'
import type { EditorMode } from '@/editor/lib/types'
import type { ThemeCustomizations } from '@/editor/lib/store-theme'
import type { ThemeCustomDecorations } from '@/editor/lib/types'
import type { DecorationAnimation } from '@/editor/lib/decoration-animations'
import { PublishedBackgroundLayers } from '@/editor/components/editor/layout/background-layers/published-background-layers'
import { DecorationsLayer } from '@/editor/components/editor/layout/decorationEdit/decorations-logic'

// ─── Published view ───────────────────────────────────────────────────────────

interface PublishedViewProps {
  mode: EditorMode
  templateId: string
  themeId: string
  themeCustomizations: ThemeCustomizations
  customDecorations: ThemeCustomDecorations[]
  content: Record<string, unknown>
  visibility: Record<string, unknown>
}

export function PublishedView({
  mode,
  templateId,
  themeId,
  themeCustomizations,
  customDecorations,
  content,
  visibility,
}: PublishedViewProps) {
  const theme = getTheme(themeId)

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith('#')) {
        e.preventDefault()
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [],
  )

  const template = MODE_REGISTRY[mode].renderPublished({
    templateId,
    theme,
    content,
    visibility,
    handleAnchorClick,
  })

  // Ensure every decoration has a stable id (same normalisation as the editor)
  const decorations = useMemo(
    () => customDecorations.map((d, i) => ({ ...d, id: d.id ?? `decoration-${i}` })),
    [customDecorations],
  )

  const decorationAnimation = (themeCustomizations.decorationAnimation ?? 'fade') as DecorationAnimation

  return (
    <div className={cn('@container w-full min-h-screen relative', theme.background)}>
      {/* Background effects layer (depth / rays / texture) */}
      <PublishedBackgroundLayers theme={theme} themeCustomizations={themeCustomizations} />

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
        <DecorationsLayer
          decorations={decorations}
          selectedId={null}
          deviceView="desktop"
          animation={decorationAnimation}
          onUpdate={() => {}}
          onRemove={() => {}}
        />

        <div className="relative z-10">
          {template}
        </div>
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