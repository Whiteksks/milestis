"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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

// Delay before decorations appear, giving the canvas content time to lay out
// so that percentage-based positions resolve correctly (no teleport on load).
const DECORATION_MOUNT_DELAY_MS = 500

export function DecorationsLayer({ decorations, animation }: DecorationsLayerProps) {
  const deviceView = useUiStore((s) => s.deviceView)
  const { normalizedDecorations, selectedId, handleUpdate, handleRemove, handleSelect } =
    useEditorDecorations(decorations)

  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), DECORATION_MOUNT_DELAY_MS)
    return () => clearTimeout(id)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 pointer-events-none"
    >
      <OptimizedDecorationsLayer
        decorations={normalizedDecorations}
        selectedId={selectedId}
        deviceView={deviceView}
        animation={normalizeAnimation(animation)}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        onSelect={handleSelect}
      />
    </motion.div>
  )
}

export default DecorationsLayer
