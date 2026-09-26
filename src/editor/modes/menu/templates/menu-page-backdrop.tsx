'use client'

import { useEffect, useRef } from 'react'
import type { ImageValue } from '@/editor/image/data'
import type { MenuTemplateId } from '../template-ids'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import type { PhotobookMood, PhotobookTexture } from '@/editor/lib/types'
import { getMoodFilter, getTextureStyle } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'

export function MenuPageBackdrop({ image, mood, texture, templateId = 'menu-classic' }: { image?: ImageValue; mood: PhotobookMood; texture: PhotobookTexture; templateId?: MenuTemplateId }) {
  const backdrop = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = backdrop.current
    if (!layer || !image?.asset.src) return
    const root = layer.closest('[data-scroll-root]')
    const target = root ?? window
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scroll = root?.scrollTop ?? window.scrollY
        layer.style.setProperty('--menu-photo-shift', `${reduceMotion.matches ? 0 : Math.min(36, scroll * 0.08)}px`)
      })
    }
    update()
    target.addEventListener('scroll', update, { passive: true })
    reduceMotion.addEventListener('change', update)
    return () => {
      cancelAnimationFrame(frame)
      target.removeEventListener('scroll', update)
      reduceMotion.removeEventListener('change', update)
    }
  }, [image])

  const textureStyle = getTextureStyle(texture)

  return <div ref={backdrop} aria-hidden="true" className="pointer-events-none sticky top-0 z-0 -mb-[100dvh] h-[100dvh] overflow-hidden bg-[var(--menu-stage)]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,var(--menu-surface-raised)_0%,var(--menu-stage)_85%)]" style={mood !== 'none' ? { filter: getMoodFilter(mood) } : undefined} />
    {image?.asset.src && <div className="absolute left-1/2 top-1/2 will-change-transform" style={{ width: 'max(100%, 177.78dvh)', filter: mood !== 'none' ? getMoodFilter(mood) : undefined, transform: 'translate3d(-50%,calc(-50% + var(--menu-photo-shift,0px)),0) scale(1.08)' }}>
      <ContentImage image={resolveImage(image, 'menu.page.background', templateId)} alt="" className="w-full" />
    </div>}
    <div className="absolute inset-0 bg-[var(--menu-photo-veil)]" />
    {textureStyle && <div className="absolute inset-0" style={textureStyle} />}
    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,var(--menu-stage))]" />
  </div>
}
