'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { cn } from '@/lib/utils'
import type { MenuPage } from '../content-types'

const hideScrollbar = 'no-scrollbar min-w-0 overflow-x-auto overscroll-x-contain motion-safe:scroll-smooth'

export function MenuPageNavigation({ pages, homePageId, pageId, onPageChange, theme, variant = 'classic' }: {
  pages: MenuPage[]
  homePageId: string
  pageId: string
  onPageChange?: (pageId: string) => void
  theme: ThemeConfig
  variant?: 'classic' | 'bistro'
}) {
  const t = useTranslations('editor.menu')
  const reduceMotion = useReducedMotion()
  const rail = useRef<HTMLElement>(null)
  const [edges, setEdges] = useState({ overflow: false, left: false, right: false })
  const activeIndex = Math.max(0, pages.findIndex((page) => page.id === pageId))

  useEffect(() => {
    const container = rail.current
    const active = container?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!container || !active) return
    container.scrollLeft = active.offsetLeft - container.offsetLeft - (container.clientWidth - active.clientWidth) / 2
  }, [pageId])

  useEffect(() => {
    const container = rail.current
    if (!container) return
    const update = () => {
      const next = {
        overflow: container.scrollWidth > container.clientWidth + 2,
        left: container.scrollLeft > 2,
        right: container.scrollLeft + container.clientWidth < container.scrollWidth - 2,
      }
      setEdges((current) => current.overflow === next.overflow && current.left === next.left && current.right === next.right ? current : next)
    }
    const frame = requestAnimationFrame(update)
    const observer = new ResizeObserver(update)
    observer.observe(container)
    container.addEventListener('scroll', update, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      container.removeEventListener('scroll', update)
    }
  }, [pages])

  function scroll(direction: -1 | 1) {
    rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.75, behavior: reduceMotion ? 'instant' : 'smooth' })
  }

  if (pages.length < 2) return null

  return <div className="border-t border-[var(--menu-accent-line)] pt-5">
    <div className="mb-2 flex items-center justify-between gap-4">
      <p className={cn('text-[11px] font-semibold uppercase tracking-[0.2em]', theme.mutedText)}>{t('pages.title')}</p>
      <p className={cn('text-xs tabular-nums', theme.mutedText)}>{String(activeIndex + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</p>
    </div>
    <div className="flex items-center gap-2 py-1">
      {edges.overflow && <button type="button" aria-label={t('navigation.previous')} disabled={!edges.left} onClick={() => scroll(-1)} className={cn('hidden size-10 shrink-0 place-items-center rounded-xl transition-colors hover:opacity-70 focus-visible:outline-2 disabled:opacity-30 @md:grid', theme.mutedText)}><ChevronLeft aria-hidden="true" className="size-4" /></button>}
      <nav ref={rail} aria-label={t('pages.title')} className={cn(hideScrollbar, 'flex flex-1 snap-x snap-proximity gap-1.5')}>
        {pages.map((page) => {
          const label = page.name || t(page.id === homePageId ? 'pages.home' : 'pages.untitled')
          const className = cn(
            'min-h-11 max-w-[min(72vw,18rem)] shrink-0 snap-start truncate rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
            variant === 'bistro' && 'rounded-sm text-xs uppercase tracking-wider',
            page.id === pageId ? cn(theme.primary, theme.primaryText, 'border-transparent') : cn(theme.cardForeground, theme.border, 'hover:bg-[var(--menu-accent-soft)]'),
          )
          return onPageChange
            ? <button key={page.id} type="button" aria-current={page.id === pageId ? 'page' : undefined} className={className} title={label} onClick={(event) => {
              onPageChange(page.id)
              event.currentTarget.closest('[data-scroll-root]')?.scrollTo({ top: 0 })
            }}>{label}</button>
            : <a key={page.id} href={page.path} aria-current={page.id === pageId ? 'page' : undefined} className={className} title={label}>{label}</a>
        })}
      </nav>
      {edges.overflow && <button type="button" aria-label={t('navigation.next')} disabled={!edges.right} onClick={() => scroll(1)} className={cn('hidden size-10 shrink-0 place-items-center rounded-xl transition-colors hover:opacity-70 focus-visible:outline-2 disabled:opacity-30 @md:grid', theme.mutedText)}><ChevronRight aria-hidden="true" className="size-4" /></button>}
    </div>
  </div>
}

export function MenuCategoryNavigation({ categories, theme, preview = false }: {
  categories: { id: string; name: string }[]
  theme: ThemeConfig
  preview?: boolean
}) {
  const t = useTranslations('editor.menu')
  const reduceMotion = useReducedMotion()
  const rail = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')
  const activeCategoryId = categories.some((category) => category.id === activeId) ? activeId : categories[0]?.id ?? ''

  useEffect(() => {
    const container = rail.current
    const article = container?.closest('article')
    if (!container || !article) return
    const scrollRoot = article.closest('[data-scroll-root]')
    const target = scrollRoot ?? window
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const threshold = container.getBoundingClientRect().bottom + 28
        let next = categories[0]?.id ?? ''
        for (const category of categories) {
          const section = article.querySelector<HTMLElement>(`[id="menu-category-${category.id}"]`)
          if (section && section.getBoundingClientRect().top <= threshold) next = category.id
        }
        setActiveId((current) => current === next ? current : next)
      })
    }
    target.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      target.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [categories])

  useEffect(() => {
    const container = rail.current
    const active = Array.from(container?.querySelectorAll<HTMLElement>('[data-category-id]') ?? []).find((item) => item.dataset.categoryId === activeCategoryId)
    if (!container || !active) return
    const left = active.offsetLeft - container.offsetLeft - (container.clientWidth - active.clientWidth) / 2
    container.scrollTo({ left, behavior: reduceMotion ? 'instant' : 'smooth' })
  }, [activeCategoryId, reduceMotion])

  return <nav aria-label={t('categories')} className={cn(
    'sticky z-20 -mx-5 border-b border-[var(--menu-accent-line)] px-5 @md:-mx-10 @md:px-10 @lg:-mx-14 @lg:px-14', preview ? 'top-14' : 'top-0', theme.glassPanel,
  )}>
    <div ref={rail} className={cn(hideScrollbar, 'flex snap-x snap-proximity gap-6 @md:gap-8')}>
      {categories.map((category) => <a key={category.id} data-category-id={category.id} href={`#menu-category-${category.id}`} aria-current={activeCategoryId === category.id ? 'location' : undefined} onClick={(event) => {
        event.preventDefault()
        setActiveId(category.id)
        event.currentTarget.closest('article')?.querySelector(`[id="menu-category-${category.id}"]`)?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' })
      }} className={cn(
        'min-h-14 max-w-[70vw] shrink-0 snap-start truncate border-b-2 py-4 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] @md:text-sm',
        activeCategoryId === category.id ? 'border-[var(--menu-accent)] text-[var(--menu-accent)]' : cn('border-transparent hover:text-[var(--menu-accent)]', theme.mutedText),
      )} title={category.name}>{category.name}</a>)}
    </div>
  </nav>
}
