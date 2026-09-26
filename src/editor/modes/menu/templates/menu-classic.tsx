'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus, Sparkles } from 'lucide-react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { cn } from '@/lib/utils'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import { visibleMenuCategories } from '../model'
import { MenuGuestSelectionPanel } from '../guest-selection-panel'
import { useGuestSelection } from '../use-guest-selection'
import { MenuCategoryNavigation, MenuPageNavigation } from './menu-navigation'
import { MenuPageBackdrop } from './menu-page-backdrop'
import { getMoodFilter, getTextureStyle } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'
import { getMenuPalette, getMenuVisualStyle, menuFontClassName } from '../visual-style'
import type { MenuTemplateProps } from './types'

export function MenuClassic({ theme, visual, content, images, visibility, editing = false, pageId = content.homePageId, onPageChange, projectId }: MenuTemplateProps) {
  const t = useTranslations('editor.menu')
  const ts = useTranslations('editor.menu.selection')
  const tr = useTranslations('editor.menu.recommendations')
  const locale = useLocale()
  const categories = useMemo(() => visibleMenuCategories(content, pageId), [content, pageId])
  const { selection, interaction, changeQuantity, remove } = useGuestSelection(projectId)
  const hasSelection = !editing && visibility.showMenu && Object.keys(selection).length > 0
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, { style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2 })
  const menuStyle = getMenuVisualStyle(theme)
  const fontClass = menuFontClassName(visual?.menuFontPair)
  const textureStyle = getTextureStyle(visual?.photobookTexture ?? 'none')
  const cover = images.pageBackgrounds?.[pageId]
  const palette = getMenuPalette(theme, fontClass)

  return <article className={cn(
    'relative isolate min-h-screen w-full overflow-x-clip bg-[var(--menu-stage)] text-[var(--menu-text)] selection:bg-[var(--menu-accent-soft)]',
    fontClass, theme.lineHeight, theme.letterSpacing,
  )} style={menuStyle}>
    <MenuPageBackdrop image={images.pageBackgrounds?.[pageId]} mood={visual?.photobookMood ?? 'none'} texture={visual?.photobookTexture ?? 'none'} />
    <div className={cn(
      'relative isolate z-10 mx-auto min-h-screen max-w-6xl bg-[var(--menu-surface)] px-5 pb-32 @md:mt-6 @md:rounded-t-[2rem] @md:px-10 @md:pb-36 @lg:px-14 @md:shadow-[0_12px_80px_-32px_rgba(44,39,26,.18)]',
      hasSelection && 'pb-48 @md:pb-48',
    )}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-0 h-1 bg-[var(--menu-accent)] @md:inset-x-10 @lg:inset-x-14" />
    {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-t-[inherit] opacity-15" style={textureStyle} />}
    <div className="relative z-10">
    {visibility.showVenue && <header id="venue" data-section-id="venue" className={cn('relative grid items-center gap-5 pb-6 pt-7 @md:gap-10 @md:pb-10 @md:pt-12', cover?.asset.src && '@lg:grid-cols-[1.1fr_1fr]')}>
      <div className="min-w-0">
        <div className="mb-5 flex items-center gap-4 @md:mb-7">
          {images.logo?.asset.src && <ContentImage image={resolveImage(images.logo, 'menu.venue.logo', 'menu-classic')} alt={content.venue.name} className="w-12 shrink-0 @md:w-14" />}
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--menu-accent)]">{t('title')}</span>
          <span aria-hidden="true" className="h-px w-12 bg-[var(--menu-accent-line)]" />
        </div>
        <h1 className="max-w-3xl break-words text-[clamp(3rem,7cqi,5.5rem)] leading-[0.98] tracking-[-0.035em] [text-wrap:balance]">{content.venue.name || (editing ? t('venuePlaceholder') : t('title'))}</h1>
        {content.venue.description && <p className={cn('mt-4 max-w-md whitespace-pre-wrap break-words text-[13px] leading-6 @md:mt-6 @md:text-sm @md:leading-7', palette.mutedText)}>{content.venue.description}</p>}
      </div>
      {cover?.asset.src && <div className="relative h-36 overflow-hidden rounded-[1.25rem] @md:h-52 @lg:h-72 @lg:rounded-[1.5rem]" style={visual?.photobookMood && visual.photobookMood !== 'none' ? { filter: getMoodFilter(visual.photobookMood) } : undefined}>
        <ContentImage image={resolveImage(cover, 'menu.page.background', 'menu-classic')} alt="" fillParent />
        {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25" style={textureStyle} />}
      </div>}
    </header>}

    <MenuPageNavigation pages={content.pages} homePageId={content.homePageId} pageId={pageId} onPageChange={onPageChange} theme={palette} />

    {visibility.showMenu && <section id="menu" data-section-id="menu" className="pt-3 @md:pt-5">
      {categories.length > 0 ? <>
        <MenuCategoryNavigation key={pageId} categories={categories} theme={palette} preview={!!onPageChange && !editing} />
        <div className="space-y-12 pt-8 @md:space-y-16 @md:pt-10">
          {categories.map((category, categoryIndex) => <section key={category.id} id={`menu-category-${category.id}`} className={onPageChange && !editing ? 'scroll-mt-36' : 'scroll-mt-28'}>
            <div className="mb-5 flex items-center gap-4 @md:mb-7">
              <span className="self-start pt-2 text-[10px] font-semibold tabular-nums tracking-widest text-[var(--menu-accent)]">{String(categoryIndex + 1).padStart(2, '0')}</span>
              <h2 className="min-w-0 break-words text-4xl leading-tight tracking-tight @md:text-5xl">{category.name}</h2>
              <span aria-hidden="true" className="h-px min-w-5 flex-1 bg-[var(--menu-accent-line)]" />
            </div>
            <div className="grid items-start gap-4 @xl:grid-cols-2 @xl:gap-5">
              {category.dishes.map((dish) => {
                const image = images.dishes[dish.id]
                const quantity = selection[dish.id] ?? 0
                return <div key={dish.id} className={cn('group min-w-0 overflow-hidden rounded-[1.25rem] border bg-[var(--menu-surface-raised)] transition-shadow motion-reduce:transition-none hover:shadow-[0_8px_28px_-16px_rgba(44,39,26,.18)]', palette.border, dish.recommended && image?.asset.src && '@xl:col-span-2 @xl:grid @xl:grid-cols-2 @xl:items-center')}>
                  {image?.asset.src && <div className="relative min-w-0">
                    <ContentImage image={resolveImage(image, 'menu.dish.photo', 'menu-classic')} alt={dish.name} className="w-full" />
                    {dish.recommended && <span className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-[var(--menu-surface-raised)] px-3 py-1.5 text-[10px] font-semibold text-[var(--menu-accent)] shadow-sm"><Sparkles aria-hidden="true" className="size-3 shrink-0" />{tr('tab')}</span>}
                  </div>}
                  <div className={cn('min-w-0 p-5 @md:p-6', dish.recommended && image?.asset.src && '@xl:p-9')}>
                    {!image?.asset.src && dish.recommended && <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--menu-accent)]"><Sparkles aria-hidden="true" className="size-3" />{tr('tab')}</p>}
                    <h3 className="break-words text-[1.75rem] leading-[1.15] tracking-tight @md:text-3xl">{dish.name}</h3>
                    {dish.description && <p className={cn('mt-2.5 whitespace-pre-wrap break-words text-[13px] leading-6', palette.mutedText)}>{dish.description}</p>}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--menu-accent-line)] pt-4">
                    <p className="break-words text-base font-semibold tabular-nums tracking-tight">{money.format(dish.priceMinor! / 100)}</p>
                    {!editing && (quantity === 0
                      ? <button type="button" onClick={() => changeQuantity(dish.id, 1)} className={cn('inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2', palette.primary, palette.primaryText)}><Plus aria-hidden="true" className="size-4" />{ts('add')}</button>
                      : <div className="inline-flex items-center rounded-full bg-[var(--menu-accent-soft)] text-[var(--menu-accent)]">
                        <button type="button" onClick={() => changeQuantity(dish.id, -1)} aria-label={ts('decrease', { name: dish.name })} className="grid size-11 place-items-center rounded-full hover:opacity-65 focus-visible:outline-2"><Minus aria-hidden="true" className="size-4" /></button>
                        <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-label={ts('quantity', { count: quantity })}>{quantity}</span>
                        <button type="button" onClick={() => changeQuantity(dish.id, 1)} disabled={quantity >= 99} aria-label={ts('increase', { name: dish.name })} className="grid size-11 place-items-center rounded-full hover:opacity-65 focus-visible:outline-2 disabled:opacity-40"><Plus aria-hidden="true" className="size-4" /></button>
                      </div>)}
                  </div>
                  </div>
                </div>
              })}
            </div>
          </section>)}
        </div>
      </> : <div className={cn('rounded-2xl border bg-[var(--menu-surface-raised)] px-6 py-16 text-center text-sm', palette.border, palette.mutedText)}>
        <p>{editing ? t('emptyEditor') : t('emptyPublic')}</p>
      </div>}
    </section>}

    </div>
    </div>
    {!editing && visibility.showMenu && <MenuGuestSelectionPanel content={content} images={images} pageId={pageId} theme={palette} menuStyle={menuStyle} selection={selection} interaction={interaction} onChangeQuantity={changeQuantity} onRemove={remove} />}
  </article>
}

export function MenuCoverPreview({ theme, title }: { theme: ThemeConfig; title?: string }) {
  const t = useTranslations('editor.menu')
  return <div className="menu-font-signature h-full overflow-hidden bg-[var(--menu-stage)] p-[4cqmin] text-[var(--menu-text)]" style={getMenuVisualStyle(theme)}>
    <div className="flex h-full flex-col overflow-hidden rounded-t-[5.33cqmin] border-t-[0.8cqmin] border-[var(--menu-accent)] bg-[var(--menu-surface)] p-[5.33cqmin] text-left shadow-sm">
      <p className="text-[3.07cqmin] font-semibold uppercase tracking-[0.22em] text-[var(--menu-accent)]">{t('title')}</p>
      <h2 className="mb-[4cqmin] mt-[2.67cqmin] line-clamp-2 break-words text-[10.67cqmin] leading-none tracking-tight">{title || t('venuePlaceholder')}</h2>
      <div aria-hidden="true" className="mb-[4cqmin] flex shrink-0 gap-[2.67cqmin] border-y border-[var(--menu-accent-line)] py-[2.67cqmin]">
        <span className="h-[5.33cqmin] w-[24cqmin] rounded-full bg-[var(--menu-accent)]" /><span className="h-[5.33cqmin] w-[21.33cqmin] rounded-full bg-[var(--menu-accent-soft)]" /><span className="h-[5.33cqmin] w-[18.67cqmin] rounded-full bg-[var(--menu-accent-soft)]" />
      </div>
      <h3 className="mb-[2.67cqmin] text-[6.67cqmin] leading-none">{t('categories')}</h3>
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-[4cqmin]" aria-hidden="true">{[0, 1].map(row => <div key={row} className="flex min-h-0 flex-col overflow-hidden rounded-[2.67cqmin] border border-[var(--menu-accent-line)] bg-[var(--menu-surface-raised)]">
        <div className="min-h-0 flex-1 bg-[var(--menu-accent-soft)]" />
        <div className="space-y-[2cqmin] p-[2.67cqmin]"><div className="h-[1.73cqmin] w-3/4 rounded bg-[var(--menu-accent-line)]" /><div className="h-[1.33cqmin] w-1/2 rounded bg-[var(--menu-accent-line)]" /><div className="ml-auto h-[4cqmin] w-[10.67cqmin] rounded-full bg-[var(--menu-accent)]" /></div>
      </div>)}</div>
    </div>
  </div>
}
