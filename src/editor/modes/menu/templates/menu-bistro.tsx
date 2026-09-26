'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight, Minus, Plus, Sparkles } from 'lucide-react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import { getMoodFilter, getTextureStyle } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'
import { cn } from '@/lib/utils'
import { visibleMenuCategories } from '../model'
import { useGuestSelection } from '../use-guest-selection'
import { MenuGuestSelectionPanel } from '../guest-selection-panel'
import { getBistroVisualStyle, getMenuPalette, menuFontClassName } from '../visual-style'
import { MenuCategoryNavigation, MenuPageNavigation } from './menu-navigation'
import { MenuPageBackdrop } from './menu-page-backdrop'
import type { MenuTemplateProps } from './types'

export function MenuBistro({ theme, visual, content, images, visibility, editing = false, pageId = content.homePageId, onPageChange, projectId }: MenuTemplateProps) {
  const t = useTranslations('editor.menu')
  const ts = useTranslations('editor.menu.selection')
  const tr = useTranslations('editor.menu.recommendations')
  const locale = useLocale()
  const categories = useMemo(() => visibleMenuCategories(content, pageId), [content, pageId])
  const { selection, interaction, changeQuantity, remove } = useGuestSelection(projectId)
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, { style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2 })
  const menuStyle = getBistroVisualStyle(theme)
  const fontClass = menuFontClassName(visual?.menuFontPair)
  const palette = getMenuPalette(theme, fontClass)
  const cover = images.pageBackgrounds?.[pageId]
  const textureStyle = getTextureStyle(visual?.photobookTexture ?? 'none')

  return <article data-menu-template="menu-bistro" className={cn('relative isolate min-h-screen overflow-x-clip bg-[var(--menu-stage)] text-[var(--menu-text)] selection:bg-[var(--menu-accent-soft)]', fontClass, theme.lineHeight, theme.letterSpacing)} style={menuStyle}>
    <MenuPageBackdrop templateId="menu-bistro" image={cover} mood={visual?.photobookMood ?? 'none'} texture={visual?.photobookTexture ?? 'none'} />
    <div className="relative z-10 mx-auto min-h-screen max-w-6xl bg-[var(--menu-surface)] px-5 pb-48 @md:px-10 @lg:px-14">
      {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={textureStyle} />}
      {visibility.showVenue && <header id="venue" data-section-id="venue" className="relative pb-7 pt-7 @md:pb-10 @md:pt-10">
        <div className="mb-7 flex items-center justify-between gap-5 border-b border-[var(--menu-accent-line)] pb-5">
          <div className="flex min-w-0 items-center gap-3">
            {images.logo?.asset.src && <ContentImage image={resolveImage(images.logo, 'menu.venue.logo', 'menu-bistro')} alt={content.venue.name} className="w-10 shrink-0" />}
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--menu-accent)]">{t('title')}</span>
          </div>
          <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-[var(--menu-accent)]" />
        </div>
        <h1 className="relative z-10 max-w-4xl break-words text-[clamp(3.25rem,9cqi,8rem)] uppercase leading-[0.92] tracking-[-0.045em] [text-wrap:balance]">{content.venue.name || (editing ? t('venuePlaceholder') : t('title'))}</h1>
        <div className={cn('mt-6 grid gap-5 @lg:mt-8 @lg:gap-10', cover?.asset.src && '@lg:grid-cols-[1fr_1.8fr] @lg:items-end')}>
          {content.venue.description && <p className="max-w-md whitespace-pre-wrap break-words border-l-2 border-[var(--menu-accent)] pl-4 text-[13px] leading-6 text-[var(--menu-muted-text)] @md:text-sm @md:leading-7">{content.venue.description}</p>}
          {cover?.asset.src && <div className={cn('relative h-32 overflow-hidden rounded-sm @md:h-44 @lg:h-56', !content.venue.description && '@lg:col-span-2')} style={visual?.photobookMood && visual.photobookMood !== 'none' ? { filter: getMoodFilter(visual.photobookMood) } : undefined}>
            <ContentImage image={resolveImage(cover, 'menu.page.background', 'menu-bistro')} alt="" fillParent />
            {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25" style={textureStyle} />}
          </div>}
        </div>
      </header>}

      <MenuPageNavigation pages={content.pages} homePageId={content.homePageId} pageId={pageId} onPageChange={onPageChange} theme={palette} variant="bistro" />
      {visibility.showMenu && <section id="menu" data-section-id="menu" className="relative pt-3 @md:pt-5">
        {categories.length ? <>
          <MenuCategoryNavigation key={pageId} categories={categories} theme={palette} preview={!!onPageChange && !editing} />
          <div className="space-y-12 pt-8 @md:space-y-16 @md:pt-12">
            {categories.map((category, index) => <section key={category.id} id={`menu-category-${category.id}`} className={cn('grid gap-3 @3xl:grid-cols-[13rem_minmax(0,1fr)] @3xl:gap-12', onPageChange && !editing ? 'scroll-mt-36' : 'scroll-mt-28')}>
              <div className="min-w-0 border-t-2 border-[var(--menu-accent)] pt-4 @3xl:pt-5">
                <p className="mb-3 text-[10px] font-semibold tabular-nums tracking-[0.25em] text-[var(--menu-accent)]">/ {String(index + 1).padStart(2, '0')}</p>
                <h2 className="break-words text-3xl uppercase leading-[1.05] tracking-tight @md:text-4xl">{category.name}</h2>
              </div>
              <div className="min-w-0 divide-y divide-[var(--menu-accent-line)] @3xl:border-t @3xl:border-[var(--menu-accent-line)]">
                {category.dishes.map((dish) => {
                  const photo = images.dishes[dish.id]
                  const quantity = selection[dish.id] ?? 0
                  return <div key={dish.id} className="min-w-0 py-5 @md:py-6">
                    <div className="flex items-start gap-4 @md:gap-6">
                      <div className="min-w-0 flex-1">
                        {dish.recommended && <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--menu-accent)]"><Sparkles aria-hidden="true" className="size-3 shrink-0" />{tr('tab')}</p>}
                        <h3 className="break-words text-2xl leading-tight tracking-tight @md:text-3xl">{dish.name}</h3>
                        {dish.description && <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-[var(--menu-muted-text)] @md:text-[13px]">{dish.description}</p>}
                      </div>
                      {photo?.asset.src && <ContentImage image={resolveImage(photo, 'menu.dish.photo', 'menu-bistro')} alt={dish.name} className="w-24 shrink-0 rounded-sm @md:w-32" />}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="break-words text-sm font-semibold tabular-nums text-[var(--menu-accent)] @md:text-base">{money.format(dish.priceMinor! / 100)}</p>
                      {!editing && (quantity === 0
                        ? <button type="button" onClick={() => changeQuantity(dish.id, 1)} className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-[var(--menu-accent-line)] px-4 text-xs font-semibold text-[var(--menu-accent)] transition-colors hover:bg-[var(--menu-accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-2"><Plus aria-hidden="true" className="size-4" />{ts('add')}</button>
                        : <div className="inline-flex items-center rounded-sm bg-[var(--menu-accent)] text-[var(--menu-accent-ink)]">
                          <button type="button" onClick={() => changeQuantity(dish.id, -1)} aria-label={ts('decrease', { name: dish.name })} className="grid size-11 place-items-center hover:opacity-65 focus-visible:outline-2"><Minus aria-hidden="true" className="size-4" /></button>
                          <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-label={ts('quantity', { count: quantity })}>{quantity}</span>
                          <button type="button" onClick={() => changeQuantity(dish.id, 1)} disabled={quantity >= 99} aria-label={ts('increase', { name: dish.name })} className="grid size-11 place-items-center hover:opacity-65 focus-visible:outline-2 disabled:opacity-40"><Plus aria-hidden="true" className="size-4" /></button>
                        </div>)}
                    </div>
                  </div>
                })}
              </div>
            </section>)}
          </div>
        </> : <div className="border-y border-[var(--menu-accent-line)] px-5 py-16 text-center text-sm text-[var(--menu-muted-text)]">{editing ? t('emptyEditor') : t('emptyPublic')}</div>}
      </section>}
    </div>
    {!editing && visibility.showMenu && <MenuGuestSelectionPanel templateId="menu-bistro" content={content} images={images} pageId={pageId} theme={palette} menuStyle={menuStyle} selection={selection} interaction={interaction} onChangeQuantity={changeQuantity} onRemove={remove} />}
  </article>
}

export function MenuBistroPreview({ theme, title }: { theme: ThemeConfig; title?: string }) {
  const t = useTranslations('editor.menu')
  return <div className="menu-font-signature min-h-[320px] overflow-hidden bg-[var(--menu-surface)] px-6 py-7 text-[var(--menu-text)]" style={getBistroVisualStyle(theme)}>
    <div className="mb-5 flex items-center justify-between border-b border-[var(--menu-accent-line)] pb-3 text-[var(--menu-accent)]"><span className="text-[9px] font-semibold uppercase tracking-[0.25em]">{t('title')}</span><ArrowUpRight className="size-4" aria-hidden="true" /></div>
    <h2 className="mb-6 break-words text-[2.5rem] uppercase leading-[0.95] tracking-tight">{title || t('venuePlaceholder')}</h2>
    <div className="mb-5 flex gap-2" aria-hidden="true"><span className="h-5 w-20 rounded-sm bg-[var(--menu-accent)]" /><span className="h-5 w-16 rounded-sm border border-[var(--menu-accent-line)]" /></div>
    <div className="grid grid-cols-[1fr_2fr] gap-4 border-t-2 border-[var(--menu-accent)] pt-3">
      <h3 className="break-words text-base uppercase">{t('categories')}</h3>
      <div aria-hidden="true">{[0, 1, 2].map((row) => <div key={row} className="flex items-center gap-3 border-b border-[var(--menu-accent-line)] py-3"><div className="flex-1 space-y-2"><div className="h-1.5 w-full rounded bg-[var(--menu-accent-line)]" /><div className="h-1 w-2/3 rounded bg-[var(--menu-accent-line)]" /></div><div className="size-7 rounded-sm bg-[var(--menu-accent-soft)]" /></div>)}</div>
    </div>
  </div>
}
