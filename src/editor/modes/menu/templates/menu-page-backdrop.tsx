'use client'

import { useEffect, useRef } from 'react'
import type { ImageValue } from '@/editor/image/data'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'

export function MenuPageBackdrop({ image }: { image?: ImageValue }) {
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

  return <div ref={backdrop} aria-hidden="true" className="pointer-events-none sticky top-0 z-0 -mb-[100dvh] h-[100dvh] overflow-hidden bg-[radial-gradient(ellipse_at_50%_25%,#34302a_0%,#111311_53%,#050606_100%)]">
    {image?.asset.src && <div className="absolute left-1/2 top-1/2 will-change-transform" style={{ width: 'max(100%, 177.78dvh)', transform: 'translate3d(-50%,calc(-50% + var(--menu-photo-shift,0px)),0) scale(1.08)' }}>
      <ContentImage image={resolveImage(image, 'menu.page.background', 'menu-classic')} alt="" className="w-full" />
    </div>}
    <div className="absolute inset-0 bg-[#090b0a]/55" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_37%,transparent_8%,rgba(0,0,0,.43)_73%,rgba(0,0,0,.85)_100%)]" />
  </div>
}
