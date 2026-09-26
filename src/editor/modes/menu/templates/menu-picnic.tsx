'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus, Sparkles, Sun } from 'lucide-react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import { getMoodFilter, getTextureStyle } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'
import { cn } from '@/lib/utils'
import { visibleMenuCategories } from '../model'
import { useGuestSelection } from '../use-guest-selection'
import { MenuGuestSelectionPanel } from '../guest-selection-panel'
import { getPicnicVisualStyle, getMenuPalette, menuFontClassName } from '../visual-style'
import { MenuCategoryNavigation, MenuPageNavigation } from './menu-navigation'
import { MenuPageBackdrop } from './menu-page-backdrop'
import type { MenuTemplateProps } from './types'

const checkerboard = 'bg-[conic-gradient(var(--menu-accent)_25%,transparent_0_50%,var(--menu-accent)_0_75%,transparent_0)] bg-size-[20px_20px]'

export function MenuPicnic({ theme, visual, content, images, visibility, editing = false, pageId = content.homePageId, onPageChange, projectId }: MenuTemplateProps) {
  const t = useTranslations('editor.menu')
  const ts = useTranslations('editor.menu.selection')
  const tr = useTranslations('editor.menu.recommendations')
  const locale = useLocale()
  const categories = useMemo(() => visibleMenuCategories(content, pageId), [content, pageId])
  const { selection, interaction, changeQuantity, remove } = useGuestSelection(projectId)
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, { style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2 })
  const menuStyle = getPicnicVisualStyle(theme)
  const fontClass = menuFontClassName(visual?.menuFontPair)
  const palette = getMenuPalette(theme, fontClass)
  const cover = images.pageBackgrounds?.[pageId]
  const textureStyle = getTextureStyle(visual?.photobookTexture ?? 'none')

  return <article data-menu-template="menu-picnic" className={cn('relative isolate min-h-screen overflow-x-clip bg-[var(--menu-stage)] text-[var(--menu-text)] selection:bg-[var(--menu-leaf)]', fontClass, theme.lineHeight, theme.letterSpacing)} style={menuStyle}>
    <MenuPageBackdrop templateId="menu-picnic" image={cover} mood={visual?.photobookMood ?? 'none'} texture={visual?.photobookTexture ?? 'none'} />
    <div className="relative z-10 mx-auto min-h-screen max-w-6xl bg-[var(--menu-surface)] px-5 pb-48 pt-5 @md:px-10 @md:pt-8 @lg:px-14">
      {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={textureStyle} />}
      {visibility.showVenue && <header id="venue" data-section-id="venue" className="relative mb-8 overflow-hidden rounded-2xl border-2 border-[var(--menu-accent)] bg-[var(--menu-banner)] shadow-[4px_4px_0_var(--menu-accent)] @md:mb-10">
        <div className={cn('grid', cover?.asset.src && '@2xl:grid-cols-[1.35fr_1fr]')}>
          <div className="min-w-0 px-5 py-6 text-center @md:px-8 @md:py-9">
            <div className="mb-4 flex items-center justify-center gap-3">
              {images.logo?.asset.src ? <ContentImage image={resolveImage(images.logo, 'menu.venue.logo', 'menu-picnic')} alt={content.venue.name} className="w-12" /> : <Sun aria-hidden="true" className="size-9 stroke-[1.25]" />}
              <span className="rounded-full border border-[var(--menu-accent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">{t('title')}</span>
            </div>
            <h1 className="break-words text-[clamp(3rem,7cqi,6rem)] leading-[0.95] tracking-[-0.045em] [text-wrap:balance]">{content.venue.name || (editing ? t('venuePlaceholder') : t('title'))}</h1>
            {content.venue.description && <p className="mx-auto mt-4 max-w-md whitespace-pre-wrap break-words text-xs leading-6 @md:text-sm">{content.venue.description}</p>}
          </div>
          {cover?.asset.src && <div className="relative mx-5 mb-5 h-32 overflow-hidden rounded-[5rem_5rem_1rem_1rem] border-2 border-[var(--menu-accent)] @md:h-44 @2xl:my-6 @2xl:ml-0 @2xl:mr-6 @2xl:h-auto @2xl:min-h-52" style={visual?.photobookMood && visual.photobookMood !== 'none' ? { filter: getMoodFilter(visual.photobookMood) } : undefined}>
            <ContentImage image={resolveImage(cover, 'menu.page.background', 'menu-picnic')} alt="" fillParent />
            {textureStyle && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25" style={textureStyle} />}
          </div>}
        </div>
        <div aria-hidden="true" className={cn('h-2.5 border-t border-[var(--menu-accent)]', checkerboard)} />
      </header>}
      <MenuPageNavigation pages={content.pages} homePageId={content.homePageId} pageId={pageId} onPageChange={onPageChange} theme={palette} />
      {visibility.showMenu && <section id="menu" data-section-id="menu" className="relative pt-3 @md:pt-5">
        {categories.length ? <>
          <MenuCategoryNavigation key={pageId} categories={categories} theme={palette} preview={!!onPageChange && !editing} />
          <div className="space-y-10 pt-7 @md:space-y-14 @md:pt-10">
            {categories.map((category, index) => <section key={category.id} id={`menu-category-${category.id}`} className={onPageChange && !editing ? 'scroll-mt-36' : 'scroll-mt-28'}>
              <div className="mb-5 flex items-center gap-3 @md:mb-6">
                <span className="grid size-9 shrink-0 -rotate-6 place-items-center rounded-lg border border-[var(--menu-accent)] bg-[var(--menu-banner)] text-xs font-semibold tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <h2 className="min-w-0 break-words text-3xl leading-tight tracking-tight @md:text-4xl">{category.name}</h2>
                <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-[var(--menu-accent-line)]" />
              </div>
              <div className="grid gap-4 @2xl:grid-cols-2 @2xl:gap-5">
                {category.dishes.map((dish) => {
                  const photo = images.dishes[dish.id]
                  const quantity = selection[dish.id] ?? 0
                  return <div key={dish.id} className={cn('flex min-w-0 flex-col rounded-xl border border-[var(--menu-accent)] p-4 shadow-[3px_3px_0_var(--menu-accent-line)] @md:p-5', dish.recommended ? 'bg-[var(--menu-leaf)]' : 'bg-[var(--menu-surface-raised)]')}>
                    <div className="mb-3 flex items-start gap-3 @md:gap-4">
                      <div className="min-w-0 flex-1">
                        {dish.recommended && <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold"><Sparkles aria-hidden="true" className="size-3 shrink-0" />{tr('tab')}</p>}
                        <h3 className="break-words text-[1.65rem] leading-[1.1] tracking-tight @md:text-3xl">{dish.name}</h3>
                      </div>
                      {photo?.asset.src && <ContentImage image={resolveImage(photo, 'menu.dish.photo', 'menu-picnic')} alt={dish.name} className="w-24 shrink-0 rounded-xl border border-[var(--menu-accent)] @md:w-28" />}
                    </div>
                    {dish.description && <p className="mb-4 whitespace-pre-wrap break-words text-xs leading-6 text-[var(--menu-muted-text)] @md:text-[13px]">{dish.description}</p>}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[var(--menu-accent-line)] pt-4">
                      <p className="break-words text-sm font-semibold tabular-nums @md:text-base">{money.format(dish.priceMinor! / 100)}</p>
                      {!editing && (quantity === 0
                        ? <button type="button" onClick={() => changeQuantity(dish.id, 1)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--menu-accent)] bg-[var(--menu-banner)] px-3 text-xs font-semibold shadow-[2px_2px_0_var(--menu-accent)] transition-transform motion-safe:active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4"><Plus aria-hidden="true" className="size-4" />{ts('add')}</button>
                        : <div className="inline-flex items-center rounded-lg bg-[var(--menu-accent)] text-[var(--menu-accent-ink)]">
                          <button type="button" onClick={() => changeQuantity(dish.id, -1)} aria-label={ts('decrease', { name: dish.name })} className="grid size-11 place-items-center rounded-lg hover:opacity-65 focus-visible:outline-2"><Minus aria-hidden="true" className="size-4" /></button>
                          <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-label={ts('quantity', { count: quantity })}>{quantity}</span>
                          <button type="button" onClick={() => changeQuantity(dish.id, 1)} disabled={quantity >= 99} aria-label={ts('increase', { name: dish.name })} className="grid size-11 place-items-center rounded-lg hover:opacity-65 focus-visible:outline-2 disabled:opacity-40"><Plus aria-hidden="true" className="size-4" /></button>
                        </div>)}
                    </div>
                  </div>
                })}
              </div>
            </section>)}
          </div>
        </> : <div className="rounded-xl border border-dashed border-[var(--menu-accent)] bg-[var(--menu-leaf)] px-5 py-16 text-center text-sm">{editing ? t('emptyEditor') : t('emptyPublic')}</div>}
      </section>}
    </div>
    {!editing && visibility.showMenu && <MenuGuestSelectionPanel templateId="menu-picnic" content={content} images={images} pageId={pageId} theme={palette} menuStyle={menuStyle} selection={selection} interaction={interaction} onChangeQuantity={changeQuantity} onRemove={remove} />}
  </article>
}

export function MenuPicnicPreview({ theme, title }: { theme: ThemeConfig; title?: string }) {
  const t = useTranslations('editor.menu')
  return <div className="menu-font-signature flex h-full flex-col overflow-hidden bg-[var(--menu-surface)] p-[6.67cqmin] text-[var(--menu-text)]" style={getPicnicVisualStyle(theme)}>
    <div className="shrink-0 overflow-hidden rounded-[4cqmin] border border-[var(--menu-accent)] bg-[var(--menu-banner)] text-center shadow-[1.07cqmin_1.07cqmin_0_var(--menu-accent)]">
      <div className="px-[5.33cqmin] py-[4cqmin]"><div className="mb-[2.67cqmin] flex items-center justify-center gap-[2.67cqmin]"><Sun aria-hidden="true" className="size-[6.67cqmin]" /><p className="text-[3.07cqmin] font-semibold uppercase tracking-[0.2em]">{t('title')}</p></div><h2 className="line-clamp-2 break-words text-[10.67cqmin] leading-none tracking-tight">{title || t('venuePlaceholder')}</h2></div>
      <div aria-hidden="true" className={cn('h-[2.67cqmin]', checkerboard)} />
    </div>
    <h3 className="mb-[2.67cqmin] mt-[5.33cqmin] text-[6.67cqmin] leading-none">{t('categories')}</h3>
    <div className="grid min-h-0 flex-1 grid-cols-2 gap-[4cqmin]" aria-hidden="true">{[0, 1].map(row => <div key={row} className={cn('flex min-h-0 flex-col rounded-[2.67cqmin] border border-[var(--menu-accent)] p-[4cqmin] shadow-[0.67cqmin_0.67cqmin_0_var(--menu-accent-line)]', row === 0 ? 'bg-[var(--menu-leaf)]' : 'bg-[var(--menu-surface-raised)]')}>
      <div className="mb-[2.67cqmin] min-h-0 flex-1 rounded-t-full bg-[var(--menu-accent-soft)]" />
      <div className="mb-[2cqmin] h-[2cqmin] w-3/4 bg-[var(--menu-accent-line)]" /><div className="h-[1.33cqmin] w-1/2 bg-[var(--menu-accent-line)]" /><div className="ml-auto mt-[2.67cqmin] h-[4.67cqmin] w-[12cqmin] border border-[var(--menu-accent)] bg-[var(--menu-banner)]" />
    </div>)}</div>
  </div>
}
