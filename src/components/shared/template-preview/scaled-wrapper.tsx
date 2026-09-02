'use client'

import { MotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

interface ScaledWrapperProps {
  /** Zoom multiplier — inner content is `zoom×` the outer container size,
   *  then scaled back down. Default 3 (good for ~200-240px cards).
   *  Use 4 for smaller cards (< 180px). */
  zoom?: number
  /** Tailwind background class from the theme, e.g. theme.background */
  background?: string
  children: React.ReactNode
}

export function ScaledWrapper({ zoom = 3, background, children }: ScaledWrapperProps) {
  const scale = 1 / zoom
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden pointer-events-none select-none',
        // Pause all CSS animations (animate-pulse, animate-ping, etc.)
        '[&_*]:[animation-play-state:paused]',
      )}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${zoom * 100}%`,
          height: `${zoom * 100}%`,
          transform: `scale(${scale}) translateZ(0)`,
          transformOrigin: 'top left',
          willChange: 'transform',
        }}
      >
        {/* MotionConfig here ensures ALL Framer Motion animations are disabled
            regardless of what individual components do internally */}
        <MotionConfig reducedMotion="always">
          <div className={cn('h-full', background)}>
            {children}
          </div>
        </MotionConfig>
      </div>
    </div>
  )
}
