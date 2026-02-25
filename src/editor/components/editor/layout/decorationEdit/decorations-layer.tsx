"use client"

import type { DecorationElement } from '@/editor/lib/types'
import { useUiStore } from '@/editor/lib/store-ui'
import { useEditorDecorations } from '@/editor/hooks/use-editor-decorations'
import { DecorationsLayer as OptimizedDecorationsLayer } from '.'

interface DecorationsLayerProps {
  decorations: DecorationElement[]
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-down' | string
}

const normalizeAnimation = (animation?: string): 'none' | 'fade' | 'slide-up' | 'slide-down' | undefined => {
  switch (animation) {
    case 'none':
    case 'fade':
    case 'slide-up':
    case 'slide-down':
      return animation
    default:
      return undefined
  }
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
