/* eslint-disable @next/next/no-img-element */
'use client'

import { previewTheme, type PreviewColors } from './theme-extract'
import { EditorialHeroPreview } from './editorial-hero-preview'
import { MinimalHeroPreview } from './minimal-hero-preview'
import { ElegantHeroPreview } from './elegant-hero-preview'
import { GridHeroPreview } from './grid-hero-preview'
import { BentoHeroPreview } from './bento-hero-preview'
import { ShowcaseHeroPreview } from './showcase-hero-preview'
import { LiquidGlassHeroPreview } from './liquid-glass-hero-preview'

type PC = PreviewColors
type T = { title?: string; subtitle?: string; date?: string }

// ─── Photobook ───────────────────────────────────────────────────────────────

function WeddingTimeline({ c, img, t }: { c: PC; img?: string; t: T }) {
  return (
    <div className="flex h-full w-full" style={{ background: c.bg }}>
      <div className="flex w-2/5 flex-col justify-center gap-2 p-3">
        <p className="truncate text-[9px] font-bold leading-tight" style={{ color: c.fg }}>{t.title || 'Our Story'}</p>
        {t.date && <p className="truncate text-[7px]" style={{ color: c.fg, opacity: 0.5 }}>{t.date}</p>}
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="size-1.5 flex-shrink-0 rounded-full" style={{ background: i === 0 ? c.primary : c.muted }} />
            <div className="h-px flex-1" style={{ background: c.fg, opacity: 0.15 }} />
          </div>
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden">
        {img
          ? <img src={img} alt="" className="h-full w-full object-cover" />
          : <div className="h-full w-full" style={{ background: c.muted }} />}
      </div>
    </div>
  )
}

function Masonry({ c, img, t }: { c: PC; img?: string; t: T }) {
  return (
    <div className="relative h-full w-full" style={{ background: c.bg }}>
      <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-0.5">
        <div className="col-span-1 row-span-2 overflow-hidden">
          {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full" style={{ background: c.muted }} />}
        </div>
        <div className="col-span-2 overflow-hidden">
          {img ? <img src={img} alt="" className="h-full w-full object-cover" style={{ objectPosition: 'right' }} /> : <div className="h-full w-full" style={{ background: c.card }} />}
        </div>
        <div style={{ background: c.primary, opacity: 0.3 }} />
        <div style={{ background: c.muted, opacity: 0.7 }} />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-2" style={{ background: `linear-gradient(to top, ${c.bg}dd, transparent)` }}>
        <p className="truncate text-[9px] font-bold" style={{ color: c.fg }}>{t.title || 'Our Album'}</p>
        {t.date && <p className="truncate text-[7px]" style={{ color: c.fg, opacity: 0.5 }}>{t.date}</p>}
      </div>
    </div>
  )
}

function Classic({ c, img, t }: { c: PC; img?: string; t: T }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2" style={{ background: c.bg }}>
      <div className="h-16 w-24 overflow-hidden" style={{ boxShadow: `0 0 0 3px ${c.border}` }}>
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full" style={{ background: c.muted }} />}
      </div>
      <p className="max-w-[90%] truncate text-center text-[10px] font-bold" style={{ color: c.fg }}>{t.title || 'Our Story'}</p>
      {t.date
        ? <p className="text-[8px]" style={{ color: c.fg, opacity: 0.45 }}>{t.date}</p>
        : <p className="text-[8px]" style={{ color: c.fg, opacity: 0.45 }}>{t.subtitle || 'Photo Album'}</p>}
    </div>
  )
}

function Circle({ c, img, t }: { c: PC; img?: string; t: T }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2" style={{ background: c.bg }}>
      <div className="size-16 overflow-hidden rounded-full" style={{ outline: `2px solid ${c.primary}` }}>
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full" style={{ background: c.muted }} />}
      </div>
      <p className="max-w-[90%] truncate text-center text-[10px] font-bold" style={{ color: c.fg }}>{t.title || 'Our Story'}</p>
      {t.date
        ? <p className="text-[8px]" style={{ color: c.fg, opacity: 0.45 }}>{t.date}</p>
        : <p className="text-[8px]" style={{ color: c.fg, opacity: 0.45 }}>{t.subtitle || 'Album'}</p>}
    </div>
  )
}

function Magazine({ c, img, t }: { c: PC; img?: string; t: T }) {
  return (
    <div className="flex h-full w-full" style={{ background: c.bg }}>
      <div className="relative w-1/2 overflow-hidden">
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full" style={{ background: c.muted }} />}
        <span className="absolute right-1.5 top-1 text-xl font-bold leading-none" style={{ color: c.primary, opacity: 0.85 }}>01</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-3">
        <div className="h-0.5 w-6" style={{ background: c.accent }} />
        <p className="truncate text-[10px] font-bold leading-tight" style={{ color: c.fg }}>{t.title || 'Our Story'}</p>
        <p className="truncate text-[8px] leading-tight" style={{ color: c.fg, opacity: 0.5 }}>{t.date || t.subtitle || 'Album'}</p>
        <div className="h-px w-full" style={{ background: c.fg, opacity: 0.1 }} />
      </div>
    </div>
  )
}

function Polaroid({ c, img, t }: { c: PC; img?: string; t: T }) {
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ background: c.bg }}>
      <div
        className="flex flex-col items-center"
        style={{ background: c.card, padding: '5px 5px 14px', boxShadow: '0 4px 14px rgba(0,0,0,0.18)', transform: 'rotate(-2deg)' }}
      >
        <div className="h-14 w-20 overflow-hidden">
          {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full" style={{ background: c.muted }} />}
        </div>
        <p className="mx-auto mt-1.5 max-w-[72px] truncate text-center text-[8px]" style={{ color: c.fg, opacity: 0.55 }}>{t.title || 'Our Story'}</p>
      </div>
    </div>
  )
}

function PhotobookSplit({ c, img, t }: { c: PC; img?: string; t: T }) {
  return (
    <div className="flex h-full w-full" style={{ background: c.bg }}>
      <div className="w-1/2 overflow-hidden">
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full" style={{ background: c.muted }} />}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-3">
        <p className="truncate text-[10px] font-bold leading-tight" style={{ color: c.fg }}>{t.title || 'Our Story'}</p>
        <p className="truncate text-[8px] leading-tight" style={{ color: c.fg, opacity: 0.5 }}>{t.date || t.subtitle || 'Album'}</p>
        <div className="mt-0.5 h-px w-8" style={{ background: c.primary }} />
        <div className="h-px w-full" style={{ background: c.fg, opacity: 0.1 }} />
        <div className="h-px w-4/5" style={{ background: c.fg, opacity: 0.1 }} />
      </div>
    </div>
  )
}

function Vertical({ c, img, t }: { c: PC; img?: string; t: T }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {img
        ? <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        : <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c.muted} 0%, ${c.bg} 100%)` }} />}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3"
        style={{ background: `linear-gradient(to top, ${c.bg}ee, transparent)` }}
      >
        <p className="truncate text-[10px] font-bold" style={{ color: c.fg }}>{t.title || 'Our Story'}</p>
        <p className="truncate text-[8px]" style={{ color: c.fg, opacity: 0.5 }}>{t.date || t.subtitle || 'Album'}</p>
      </div>
    </div>
  )
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function Fallback({ c }: { c: PC }) {
  return (
    <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${c.muted}, ${c.bg})` }} />
  )
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

interface TemplatePreviewProps {
  themeId?: string
  templateId?: string
  heroImageUrl?: string
  title?: string
  subtitle?: string
  date?: string
  aspectRatio?: string
  frameStyle?: string
}

export function TemplatePreview({ themeId, templateId, heroImageUrl, title, subtitle, date, aspectRatio, frameStyle }: TemplatePreviewProps) {
  const c = previewTheme(themeId ?? 'parchment')
  const img = heroImageUrl || undefined
  const t = { title, subtitle, date }

  switch (templateId) {
    // Portfolio
    case 'editorial':          return <EditorialHeroPreview themeId={themeId} title={t.title} subtitle={t.subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'minimal':            return <MinimalHeroPreview themeId={themeId} title={t.title} subtitle={t.subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'elegant':            return <ElegantHeroPreview themeId={themeId} title={t.title} subtitle={t.subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'grid':               return <GridHeroPreview themeId={themeId} title={t.title} subtitle={t.subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'bento':              return <BentoHeroPreview themeId={themeId} title={t.title} subtitle={t.subtitle} heroImageUrl={img} aspectRatio={aspectRatio} frameStyle={frameStyle} />
    case 'showcase':           return <ShowcaseHeroPreview themeId={themeId} title={t.title} subtitle={t.subtitle} heroImageUrl={img} />
    case 'liquid-glass':       return <LiquidGlassHeroPreview themeId={themeId} title={t.title} subtitle={t.subtitle} heroImageUrl={img} />
    // Photobook
    case 'wedding-timeline':   return <WeddingTimeline c={c} img={img} t={t} />
    case 'masonry':            return <Masonry c={c} img={img} t={t} />
    case 'photobook-classic':  return <Classic c={c} img={img} t={t} />
    case 'photobook-circle':   return <Circle c={c} img={img} t={t} />
    case 'photobook-magazine': return <Magazine c={c} img={img} t={t} />
    case 'photobook-polaroid': return <Polaroid c={c} img={img} t={t} />
    case 'photobook-split':    return <PhotobookSplit c={c} img={img} t={t} />
    case 'photobook-vertical': return <Vertical c={c} img={img} t={t} />
    default:                   return <Fallback c={c} />
  }
}
