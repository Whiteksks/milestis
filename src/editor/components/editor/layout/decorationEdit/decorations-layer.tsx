"use client"

import { useEffect, useState } from 'react'
import type { DecorationElement } from '@/editor/lib/types'
import { useUiStore } from '@/editor/lib/store/ui'
import { useEditorDecorations } from '@/editor/hooks/use-editor-decorations'
import { DecorationsLayer as OptimizedDecorationsLayer } from '.'
import { DECORATION_ANIMATIONS, type DecorationAnimation } from '@/editor/lib/config/decoration-animations'

interface DecorationsLayerProps {
  decorations: DecorationElement[]
  animation?: DecorationAnimation
}

const normalizeAnimation = (animation?: string): DecorationAnimation | undefined => {
  if (animation && animation in DECORATION_ANIMATIONS) return animation as DecorationAnimation
  return undefined
}

export function DecorationsLayer({ decorations, animation }: DecorationsLayerProps) {
  const deviceView = useUiStore((s) => s.deviceView)
  const { normalizedDecorations, selectedId, handleUpdate, handleRemove, handleSelect } =
    useEditorDecorations(decorations)

  // Delay rendering until the canvas layout has settled so decorations don't
  // jump from the top to their final percentage-based position during load.
  // Decorations start at opacity:0 (framer-motion initial), so the extra
  // 300 ms is invisible to the user.
  const [layoutReady, setLayoutReady] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setLayoutReady(true), 300)
    return () => clearTimeout(id)
  }, [])

  if (!layoutReady) return null

  return (
    <OptimizedDecorationsLayer
      decorations={normalizedDecorations}
      selectedId={selectedId}
      deviceView={deviceView}
      animation={normalizeAnimation(animation)}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      onSelect={handleSelect}
    />
  )
}

export default DecorationsLayer
