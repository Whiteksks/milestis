'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { useParallaxLayer } from '@/editor/hooks/use-parallax-layer'
import { getBackgroundLayerProps, type ResolvedBackgroundImage, type BackgroundPlacement } from '@/editor/lib/background'

interface BackgroundLayerProps {
  config: ResolvedBackgroundImage | null
  placement: BackgroundPlacement
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  viewportRef?: React.RefObject<HTMLElement | null>
}

const NULL_REF = { current: null }

export function BackgroundLayer({
  config,
  placement,
  scrollContainerRef,
  viewportRef,
}: BackgroundLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  
  const isMatch = config?.placement === placement
  const isParallax = config?.mode === 'parallax'

  useParallaxLayer({
    enabled: isMatch && isParallax,
    scrollContainerRef: scrollContainerRef || NULL_REF,
    viewportRef: viewportRef || NULL_REF,
    layerRef,
    strength: config?.parallaxStrength ?? 1,
    scale: config?.parallaxScale ?? 1.12,
  })

  if (!config || !isMatch) return null

  const layerProps = getBackgroundLayerProps(config)
  if (!layerProps) return null

  return (
    <div
      ref={layerRef}
      className={cn(layerProps.className, 'z-0')}
      style={layerProps.style}
    />
  )
}
