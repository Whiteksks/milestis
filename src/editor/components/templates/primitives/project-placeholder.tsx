'use client'

import type React from 'react'
import { getPlaceholderGradient } from '@/hooks/usePlaceholderGradient'

interface ProjectPlaceholderProps {
  /** Project or block id for deterministic gradient. Falls back to 'abc123'. */
  seed?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders a soft memory-toned mesh-gradient placeholder.
 * Identical output on server and client — no hydration mismatch.
 * Fill your container with `position: absolute; inset: 0` or use `h-full w-full`.
 */
export function ProjectPlaceholder({ seed, className, style }: ProjectPlaceholderProps) {
  const { background } = getPlaceholderGradient(seed ?? 'abc123')

  return (
    <div
      className={className}
      style={{ background, ...style }}
      aria-hidden
    />
  )
}
