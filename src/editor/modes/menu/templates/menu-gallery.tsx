'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus, Sparkles } from 'lucide-react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import { getMoodFilter, getTextureStyle } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'
import { cn } from '@/lib/utils'
import { visibleMenuCategories } from '../model'
import { useGuestSelection } from '../use-guest-selection'
import { MenuGuestSelectionPanel } from '../guest-selection-panel'
import { getGalleryVisualStyle, getMenuPalette, menuFontClassName } from '../visual-style'
import { MenuCategoryNavigation, MenuPageNavigation } from './menu-navigation'
import { MenuPageBackdrop } from './menu-page-backdrop'
import type { MenuTemplateProps } from './types'

export function MenuGallery({ theme, visual, content, images, visibility, editing = false, pageId = content.homePageId, onPageChange, projectId }: MenuTemplateProps) {
  const t = useTranslations('editor.menu')
  const ts = useTranslations('editor.menu.selection')
  const tr = useTranslations('editor.menu.recommendations')
  const locale = useLocale()
  const categories = useMemo(() => visibleMenuCategories(content, pageId), [content, pageId])
  const { selection, interaction, changeQuantity, remove } = useGuestSelection(projectId)
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, { style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2 })
  const menuStyle = getGalleryVisualStyle(theme)
  const fontClass = menuFontClassName(visual?.menuFontPair)
  const palette = getMenuPalette(theme, fontClass)
  const cover = images.pageBackgrounds?.[pageId]
  const textureStyle = getTextureStyle(visual?.photobookTexture ?? 'none')

  return <article data-menu-template="menu-gallery" className={cn('relative isolate min-h-screen overflow-x-clip bg-[var(--menu-stage)] text-[var(--menu-text)] selection:bg-[var(--menu-accent-soft)]', fontClass, theme.lineHeight, theme.letterSpacing)} style={menuStyle}>
    <MenuPageBackdrop templateId="menu-gallery" image={cover} mood={visual?.photobookMood ?? 'none'} texture={visual?.photobookTexture ?? 'none'} />
    <div className="relative z-10 mx-auto min-h-screen max-w-6xl bg-[var(--menu-surface)] px-5 pb-48 @md:px-10 @lg:px-14">
      {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={textureStyle} />}
      {visibility.showVenue && <header id="venue" data-section-id="venue" className="relative mb-7 @md:mb-10">
        {cover?.asset.src && <div className="relative -mx-5 h-48 overflow-hidden @md:-mx-10 @md:h-72 @lg:-mx-14 @lg:h-96" style={visual?.photobookMood && visual.photobookMood !== 'none' ? { filter: getMoodFilter(visual.photobookMood) } : undefined}>
          <ContentImage image={resolveImage(cover, 'menu.page.background', 'menu-gallery')} alt="" fillParent />
          {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25" style={textureStyle} />}
        </div>}
        <div className={cn('relative min-w-0 border-b border-[var(--menu-accent-line)] bg-[var(--menu-surface)] pb-7 pt-7 @md:pb-9 @md:pt-10', cover?.asset.src && '-mt-10 mr-5 px-5 @md:-mt-20 @md:mr-16 @md:px-8 @lg:mr-36')}>
          <div className="mb-5 flex items-center gap-3 text-[var(--menu-accent)]">
            {images.logo?.asset.src && <ContentImage image={resolveImage(images.logo, 'menu.venue.logo', 'menu-gallery')} alt={content.venue.name} className="w-10 shrink-0" />}
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{t('title')}</span>
          </div>
          <h1 className="break-words text-[clamp(2.75rem,7.5cqi,6.5rem)] leading-[0.98] tracking-[-0.045em] text-[var(--menu-accent)] [text-wrap:balance]">{content.venue.name || (editing ? t('venuePlaceholder') : t('title'))}</h1>
          {content.venue.description && <p className="mt-4 max-w-xl whitespace-pre-wrap break-words text-xs leading-6 text-[var(--menu-muted-text)] @md:mt-5 @md:text-sm @md:leading-7">{content.venue.description}</p>}
        </div>
      </header>}

      <MenuPageNavigation pages={content.pages} homePageId={content.homePageId} pageId={pageId} onPageChange={onPageChange} theme={palette} />
      {visibility.showMenu && <section id="menu" data-section-id="menu" className="relative pt-3 @md:pt-5">
        {categories.length ? <>
          <MenuCategoryNavigation key={pageId} categories={categories} theme={palette} preview={!!onPageChange && !editing} />
          <div className="space-y-14 pt-8 @md:space-y-20 @md:pt-12">
            {categories.map((category, categoryIndex) => <section key={category.id} id={`menu-category-${category.id}`} className={onPageChange && !editing ? 'scroll-mt-36' : 'scroll-mt-28'}>
              <div className="mb-7 flex items-center gap-4 @md:mb-10 @md:gap-6">
                <span aria-hidden="true" className="shrink-0 text-[3.5rem] font-extralight leading-none tracking-[-0.08em] text-[var(--menu-accent-line)] @md:text-7xl">{String(categoryIndex + 1).padStart(2, '0')}</span>
                <h2 className="min-w-0 break-words text-3xl leading-tight tracking-tight text-[var(--menu-accent)] @md:text-5xl">{category.name}</h2>
              </div>
              <div className="space-y-7 @md:space-y-10">
                {category.dishes.map((dish, dishIndex) => {
                  const photo = images.dishes[dish.id]
                  const quantity = selection[dish.id] ?? 0
                  return <div key={dish.id} className={cn('grid min-w-0 items-center gap-5 border-b border-[var(--menu-accent-line)] pb-7 @md:gap-8 @md:pb-10', photo?.asset.src && '@2xl:grid-cols-2 @2xl:gap-12')}>
                    {photo?.asset.src && <div className={cn('min-w-0', dishIndex % 2 === 1 && '@2xl:order-2')}>
                      <ContentImage image={resolveImage(photo, 'menu.dish.photo', 'menu-gallery')} alt={dish.name} className="w-full" />
                    </div>}
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--menu-accent)]">
                        <span aria-hidden="true" className="tabular-nums">{String(categoryIndex + 1).padStart(2, '0')} / {String(dishIndex + 1).padStart(2, '0')}</span>
                        {dish.recommended && <span className="inline-flex items-center gap-1.5 border-l border-[var(--menu-accent-line)] pl-3"><Sparkles aria-hidden="true" className="size-3 shrink-0" />{tr('tab')}</span>}
                      </div>
                      <h3 className="break-words text-3xl leading-[1.1] tracking-tight @md:text-4xl">{dish.name}</h3>
                      {dish.description && <p className="mt-3 max-w-lg whitespace-pre-wrap break-words text-[13px] leading-7 text-[var(--menu-muted-text)]">{dish.description}</p>}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 @md:mt-7">
                        <p className="break-words text-base font-semibold tabular-nums text-[var(--menu-accent)]">{money.format(dish.priceMinor! / 100)}</p>
                        {!editing && (quantity === 0
                          ? <button type="button" onClick={() => changeQuantity(dish.id, 1)} className="inline-flex min-h-11 items-center gap-3 border-b border-[var(--menu-accent)] px-2 text-xs font-semibold text-[var(--menu-accent)] transition-colors hover:bg-[var(--menu-accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-2"><Plus aria-hidden="true" className="size-4" />{ts('add')}</button>
                          : <div className="inline-flex items-center border-b border-[var(--menu-accent)] text-[var(--menu-accent)]">
                            <button type="button" onClick={() => changeQuantity(dish.id, -1)} aria-label={ts('decrease', { name: dish.name })} className="grid size-11 place-items-center hover:bg-[var(--menu-accent-soft)] focus-visible:outline-2"><Minus aria-hidden="true" className="size-4" /></button>
                            <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-label={ts('quantity', { count: quantity })}>{quantity}</span>
                            <button type="button" onClick={() => changeQuantity(dish.id, 1)} disabled={quantity >= 99} aria-label={ts('increase', { name: dish.name })} className="grid size-11 place-items-center hover:bg-[var(--menu-accent-soft)] focus-visible:outline-2 disabled:opacity-40"><Plus aria-hidden="true" className="size-4" /></button>
                          </div>)}
                      </div>
                    </div>
                  </div>
                })}
              </div>
            </section>)}
          </div>
        </> : <div className="border-y border-[var(--menu-accent-line)] px-5 py-16 text-center text-sm text-[var(--menu-muted-text)]">{editing ? t('emptyEditor') : t('emptyPublic')}</div>}
      </section>}
    </div>
    {!editing && visibility.showMenu && <MenuGuestSelectionPanel templateId="menu-gallery" content={content} images={images} pageId={pageId} theme={palette} menuStyle={menuStyle} selection={selection} interaction={interaction} onChangeQuantity={changeQuantity} onRemove={remove} />}
  </article>
}

export function MenuGalleryPreview({ theme, title }: { theme: ThemeConfig; title?: string }) {
  const t = useTranslations('editor.menu')
  return <div className="menu-font-signature flex h-full flex-col overflow-hidden bg-[var(--menu-surface)] text-[var(--menu-text)]" style={getGalleryVisualStyle(theme)}>
    <div aria-hidden="true" className="h-[22%] shrink-0 bg-[var(--menu-stage)]" />
    <div className="relative -mt-[6.67cqmin] ml-[6.67cqmin] mr-[13.33cqmin] shrink-0 bg-[var(--menu-surface)] px-[5.33cqmin] pb-[4cqmin] pt-[4cqmin]">
      <p className="text-[3.07cqmin] font-semibold uppercase tracking-[0.25em] text-[var(--menu-accent)]">{t('title')}</p>
      <h2 className="mt-[2.67cqmin] line-clamp-2 break-words text-[10.67cqmin] leading-none tracking-tight text-[var(--menu-accent)]">{title || t('venuePlaceholder')}</h2>
    </div>
    <div className="flex min-h-0 flex-1 flex-col px-[6.67cqmin] pb-[5.33cqmin]">
      <h3 className="mb-[2.67cqmin] shrink-0 border-t border-[var(--menu-accent-line)] pt-[2.67cqmin] text-[6.67cqmin] leading-none">{t('categories')}</h3>
      <div aria-hidden="true" className="grid min-h-0 flex-1 grid-rows-2 gap-[2.67cqmin]">{[0, 1].map(row => <div key={row} className="grid min-h-0 grid-cols-2 gap-[5.33cqmin] border-b border-[var(--menu-accent-line)] pb-[2.67cqmin]"><div className={cn('bg-[var(--menu-stage)]', row === 1 && 'order-2')} /><div className="flex flex-col justify-center gap-[2cqmin]"><div className="h-[2cqmin] w-full bg-[var(--menu-accent-line)]" /><div className="h-[1.33cqmin] w-2/3 bg-[var(--menu-accent-line)]" /><div className="ml-auto h-[4cqmin] w-[9.33cqmin] border-b border-[var(--menu-accent)]" /></div></div>)}</div>
    </div>
  </div>
}
