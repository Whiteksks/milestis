"use client"

import type { DecorationElement } from '@/editor/lib/types'
import { useUiStore } from '@/editor/lib/store-ui'
import { useEditorDecorations } from '@/editor/hooks/use-editor-decorations'
import { DecorationsLayer as OptimizedDecorationsLayer } from '.'
import { DECORATION_ANIMATIONS, type DecorationAnimation } from '@/editor/lib/decoration-animations'

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
