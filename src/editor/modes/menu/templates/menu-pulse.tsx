'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Asterisk, Minus, Plus, Sparkles } from 'lucide-react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import { getMoodFilter, getTextureStyle } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'
import { cn } from '@/lib/utils'
import { visibleMenuCategories } from '../model'
import { useGuestSelection } from '../use-guest-selection'
import { MenuGuestSelectionPanel } from '../guest-selection-panel'
import { getPulseVisualStyle, getMenuPalette, menuFontClassName } from '../visual-style'
import { MenuCategoryNavigation, MenuPageNavigation } from './menu-navigation'
import { MenuPageBackdrop } from './menu-page-backdrop'
import type { MenuTemplateProps } from './types'

export function MenuPulse({ theme, visual, content, images, visibility, editing = false, pageId = content.homePageId, onPageChange, projectId }: MenuTemplateProps) {
  const t = useTranslations('editor.menu')
  const ts = useTranslations('editor.menu.selection')
  const tr = useTranslations('editor.menu.recommendations')
  const locale = useLocale()
  const categories = useMemo(() => visibleMenuCategories(content, pageId), [content, pageId])
  const { selection, interaction, changeQuantity, remove } = useGuestSelection(projectId)
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, { style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2 })
  const menuStyle = getPulseVisualStyle(theme)
  const fontClass = menuFontClassName(visual?.menuFontPair)
  const palette = getMenuPalette(theme, fontClass)
  const cover = images.pageBackgrounds?.[pageId]
  const textureStyle = getTextureStyle(visual?.photobookTexture ?? 'none')

  return <article data-menu-template="menu-pulse" className={cn('relative isolate min-h-screen overflow-x-clip bg-[var(--menu-stage)] text-[var(--menu-text)] selection:bg-[var(--menu-accent-soft)]', fontClass, theme.lineHeight, theme.letterSpacing)} style={menuStyle}>
    <MenuPageBackdrop templateId="menu-pulse" image={cover} mood={visual?.photobookMood ?? 'none'} texture={visual?.photobookTexture ?? 'none'} />
    <div className="relative z-10 mx-auto min-h-screen max-w-6xl bg-[var(--menu-surface)] px-5 pb-48 pt-5 @md:px-10 @md:pt-8 @lg:px-14">
      {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={textureStyle} />}
      {visibility.showVenue && <header id="venue" data-section-id="venue" className="relative mb-7 @md:mb-9">
        <div className="bg-[var(--menu-accent)] p-5 text-[var(--menu-accent-ink)] @md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-current/30 pb-4">
            <div className="flex min-w-0 items-center gap-3">
              {images.logo?.asset.src && <ContentImage image={resolveImage(images.logo, 'menu.venue.logo', 'menu-pulse')} alt={content.venue.name} className="w-10 shrink-0" />}
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{t('title')}</span>
            </div>
            <Asterisk aria-hidden="true" className="size-8 shrink-0 stroke-[1.5]" />
          </div>
          <div className={cn('grid items-center gap-6 @md:gap-8', cover?.asset.src && '@2xl:grid-cols-[1.4fr_1fr]')}>
            <h1 className="min-w-0 break-words text-[clamp(3.25rem,9cqi,8rem)] uppercase leading-[0.9] tracking-[-0.05em] [text-wrap:balance]">{content.venue.name || (editing ? t('venuePlaceholder') : t('title'))}</h1>
            {cover?.asset.src && <div className="relative mx-1 my-1 h-32 -rotate-2 overflow-hidden border-4 border-[var(--menu-accent-ink)] shadow-[5px_5px_0_var(--menu-accent-ink)] @md:h-44 @2xl:h-60" style={visual?.photobookMood && visual.photobookMood !== 'none' ? { filter: getMoodFilter(visual.photobookMood) } : undefined}>
              <ContentImage image={resolveImage(cover, 'menu.page.background', 'menu-pulse')} alt="" fillParent />
              {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25" style={textureStyle} />}
            </div>}
          </div>
        </div>
        {content.venue.description && <p className="border-x border-b border-[var(--menu-accent-line)] px-5 py-4 text-xs leading-6 text-[var(--menu-muted-text)] whitespace-pre-wrap break-words @md:px-8 @md:text-sm">{content.venue.description}</p>}
      </header>}

      <MenuPageNavigation pages={content.pages} homePageId={content.homePageId} pageId={pageId} onPageChange={onPageChange} theme={palette} variant="bistro" />
      {visibility.showMenu && <section id="menu" data-section-id="menu" className="relative pt-3 @md:pt-5">
        {categories.length ? <>
          <MenuCategoryNavigation key={pageId} categories={categories} theme={palette} preview={!!onPageChange && !editing} />
          <div className="space-y-12 pt-8 @md:space-y-16 @md:pt-10">
            {categories.map((category, categoryIndex) => <section key={category.id} id={`menu-category-${category.id}`} className={onPageChange && !editing ? 'scroll-mt-36' : 'scroll-mt-28'}>
              <div className="mb-5 flex items-center gap-4 @md:mb-7">
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center bg-[var(--menu-accent)] text-sm font-bold tabular-nums text-[var(--menu-accent-ink)]">{String(categoryIndex + 1).padStart(2, '0')}</span>
                <h2 className="min-w-0 break-words text-3xl uppercase leading-tight tracking-tight @md:text-4xl">{category.name}</h2>
                <span aria-hidden="true" className="h-0.5 min-w-4 flex-1 bg-[var(--menu-accent-line)]" />
              </div>
              <div className="grid gap-5 @2xl:grid-cols-2 @2xl:gap-6">
                {category.dishes.map((dish) => {
                  const photo = images.dishes[dish.id]
                  const quantity = selection[dish.id] ?? 0
                  return <div key={dish.id} className="flex min-w-0 flex-col bg-[var(--menu-paper)] text-[var(--menu-accent-ink)]">
                    {photo?.asset.src && <div className="relative min-w-0 p-2 pb-0">
                      <ContentImage image={resolveImage(photo, 'menu.dish.photo', 'menu-pulse')} alt={dish.name} className="w-full" />
                      {dish.recommended && <span className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] -rotate-2 items-center gap-1.5 bg-[var(--menu-accent)] px-3 py-2 text-[10px] font-bold uppercase tracking-wide shadow-[2px_2px_0_var(--menu-accent-ink)]"><Sparkles aria-hidden="true" className="size-3 shrink-0" />{tr('tab')}</span>}
                    </div>}
                    <div className="flex flex-1 flex-col p-5 @md:p-6">
                      {!photo?.asset.src && dish.recommended && <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"><Sparkles aria-hidden="true" className="size-3 shrink-0" />{tr('tab')}</p>}
                      <h3 className="break-words text-3xl leading-[1.05] tracking-tight @md:text-4xl">{dish.name}</h3>
                      {dish.description && <p className="mt-3 whitespace-pre-wrap break-words text-[13px] leading-6 text-[var(--menu-paper-muted)]">{dish.description}</p>}
                      <div className="mt-auto pt-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--menu-accent-ink)]/20 pt-4">
                          <p className="break-words text-base font-bold tabular-nums">{money.format(dish.priceMinor! / 100)}</p>
                          {!editing && (quantity === 0
                            ? <button type="button" onClick={() => changeQuantity(dish.id, 1)} className="inline-flex min-h-11 items-center gap-2 bg-[var(--menu-accent-ink)] px-4 text-xs font-semibold text-[var(--menu-paper)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"><Plus aria-hidden="true" className="size-4" />{ts('add')}</button>
                            : <div className="inline-flex items-center bg-[var(--menu-accent)]">
                              <button type="button" onClick={() => changeQuantity(dish.id, -1)} aria-label={ts('decrease', { name: dish.name })} className="grid size-11 place-items-center hover:opacity-65 focus-visible:outline-2"><Minus aria-hidden="true" className="size-4" /></button>
                              <span className="min-w-7 text-center text-sm font-bold tabular-nums" aria-label={ts('quantity', { count: quantity })}>{quantity}</span>
                              <button type="button" onClick={() => changeQuantity(dish.id, 1)} disabled={quantity >= 99} aria-label={ts('increase', { name: dish.name })} className="grid size-11 place-items-center hover:opacity-65 focus-visible:outline-2 disabled:opacity-40"><Plus aria-hidden="true" className="size-4" /></button>
                            </div>)}
                        </div>
                      </div>
                    </div>
                  </div>
                })}
              </div>
            </section>)}
          </div>
        </> : <div className="border-2 border-[var(--menu-accent)] px-5 py-16 text-center text-sm text-[var(--menu-muted-text)]">{editing ? t('emptyEditor') : t('emptyPublic')}</div>}
      </section>}
    </div>
    {!editing && visibility.showMenu && <MenuGuestSelectionPanel templateId="menu-pulse" content={content} images={images} pageId={pageId} theme={palette} menuStyle={menuStyle} selection={selection} interaction={interaction} onChangeQuantity={changeQuantity} onRemove={remove} />}
  </article>
}

export function MenuPulsePreview({ theme, title }: { theme: ThemeConfig; title?: string }) {
  const t = useTranslations('editor.menu')
  return <div className="menu-font-signature flex h-full flex-col overflow-hidden bg-[var(--menu-surface)] p-[6.67cqmin] text-[var(--menu-text)]" style={getPulseVisualStyle(theme)}>
    <div className="shrink-0 bg-[var(--menu-accent)] p-[5.33cqmin] text-[var(--menu-accent-ink)]">
      <div className="mb-[4cqmin] flex items-center justify-between border-b border-current/30 pb-[2.67cqmin]"><span className="text-[3.07cqmin] font-bold uppercase tracking-[0.25em]">{t('title')}</span><Asterisk aria-hidden="true" className="size-[6.67cqmin]" /></div>
      <h2 className="line-clamp-2 break-words text-[12cqmin] uppercase leading-[0.9] tracking-tight">{title || t('venuePlaceholder')}</h2>
    </div>
    <h3 className="mb-[2.67cqmin] mt-[5.33cqmin] text-[6.67cqmin] uppercase leading-none">{t('categories')}</h3>
    <div className="grid min-h-0 flex-1 grid-cols-2 gap-[4cqmin]" aria-hidden="true">{[0, 1].map(row => <div key={row} className="flex min-h-0 flex-col bg-[var(--menu-paper)] p-[2.67cqmin]">
      <div className="relative min-h-0 flex-1 bg-[var(--menu-stage)]/15">{row === 0 && <div className="absolute bottom-[1.33cqmin] left-[1.33cqmin] h-[4cqmin] w-[16cqmin] -rotate-3 bg-[var(--menu-accent)]" />}</div>
      <div className="mb-[2.67cqmin] mt-[2.67cqmin] h-[2cqmin] w-3/4 bg-[var(--menu-accent-ink)]/30" /><div className="ml-auto h-[4.67cqmin] w-[13.33cqmin] bg-[var(--menu-accent-ink)]" />
    </div>)}</div>
  </div>
}
