'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus } from 'lucide-react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { cn } from '@/lib/utils'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import type { MenuContent, MenuImageContent, MenuVisibility } from '../content-types'
import { visibleMenuCategories } from '../model'
import { MenuGuestSelectionPanel } from '../guest-selection-panel'
import { MenuGuestMascotPlaceholder } from '../guest-mascot-placeholder'
import { useGuestSelection } from '../use-guest-selection'
import { MenuCategoryNavigation, MenuPageNavigation } from './menu-navigation'
import { MenuPageBackdrop } from './menu-page-backdrop'

export interface MenuTemplateProps {
  theme: ThemeConfig
  content: MenuContent
  images: MenuImageContent
  visibility: MenuVisibility
  editing?: boolean
  pageId?: string
  onPageChange?: (pageId: string) => void
  projectId?: string
}

export function MenuClassic({ theme, content, images, visibility, editing = false, pageId = content.homePageId, onPageChange, projectId }: MenuTemplateProps) {
  const t = useTranslations('editor.menu')
  const ts = useTranslations('editor.menu.selection')
  const locale = useLocale()
  const categories = useMemo(() => visibleMenuCategories(content, pageId), [content, pageId])
  const { selection, interaction, changeQuantity, remove } = useGuestSelection(projectId)
  const [selectionOpen, setSelectionOpen] = useState(false)
  const hasSelection = !editing && visibility.showMenu && Object.keys(selection).length > 0
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, { style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2 })
  const palette: ThemeConfig = {
    ...theme,
    foreground: 'text-[#f5f1e9]', mutedText: 'text-[#b9b7af]', border: 'border-white/15',
    primary: 'bg-[#c9a46c]', primaryText: 'text-[#191913]', muted: 'bg-white/10',
    card: 'bg-[#22241f]', cardForeground: 'text-[#f5f1e9]', glassPanel: 'bg-[#171a16]/95 backdrop-blur-xl',
  }

  return <article className={cn(
    'relative isolate min-h-screen w-full overflow-x-clip bg-[#080a09] text-[#f5f1e9]',
    theme.fontBody, theme.lineHeight, theme.letterSpacing,
  )}>
    <MenuPageBackdrop image={images.pageBackgrounds?.[pageId]} />
    <div className={cn(
      'relative z-10 mx-auto min-h-screen max-w-5xl border-x border-white/10 bg-[linear-gradient(180deg,rgba(16,19,16,.55)_0%,rgba(16,19,16,.83)_460px,rgba(16,19,16,.91)_100%)] px-5 pb-20 shadow-[0_0_0_1px_rgba(255,255,255,.03),0_20px_100px_rgba(0,0,0,.65),inset_0_0_80px_rgba(0,0,0,.35)] backdrop-blur-[3px] @md:mt-6 @md:rounded-t-[2.5rem] @md:border-t @md:px-10 @md:pb-28',
      hasSelection && 'pb-36 @md:pb-36',
    )}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-44 rounded-t-[inherit] bg-[radial-gradient(ellipse_at_top,rgba(226,186,124,.10),transparent_70%)]" />
    {visibility.showVenue && <header id="venue" data-section-id="venue" className="relative mx-auto max-w-3xl px-1 pb-2 pt-10 text-center @md:pt-20">
      {images.logo?.asset.src && <ContentImage image={resolveImage(images.logo, 'menu.venue.logo', 'menu-classic')} alt={content.venue.name} className="mx-auto mb-6 w-16 @md:w-20" />}
      <div className={cn('mb-5 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]', palette.mutedText)}>
        <span aria-hidden="true" className={cn('h-px w-8 border-t', palette.border)} />{t('title')}<span aria-hidden="true" className={cn('h-px w-8 border-t', palette.border)} />
      </div>
      <h1 className={cn('break-words text-4xl leading-[1.08] tracking-tight @md:text-6xl', theme.fontTitle)}>{content.venue.name || (editing ? t('venuePlaceholder') : t('title'))}</h1>
      {content.venue.description && <p className={cn('mx-auto mt-5 max-w-xl whitespace-pre-wrap break-words text-sm leading-7 @md:text-base', palette.mutedText)}>{content.venue.description}</p>}
    </header>}

    <MenuPageNavigation pages={content.pages} homePageId={content.homePageId} pageId={pageId} onPageChange={onPageChange} theme={palette} />

    {visibility.showMenu && <section id="menu" data-section-id="menu" className="pt-5 @md:pt-10">
      {categories.length > 0 ? <>
        {!editing && <div className="relative mx-auto mb-7 max-w-lg rounded-2xl border border-[#c9a46c]/20 bg-[#c9a46c]/[0.07] p-2"><MenuGuestMascotPlaceholder interaction={interaction} theme={palette} /></div>}
        <MenuCategoryNavigation key={pageId} categories={categories} theme={palette} preview={!!onPageChange && !editing} />
        <div className="space-y-14 pt-7 @md:space-y-20 @md:pt-14">
          {categories.map((category, categoryIndex) => <section key={category.id} id={`menu-category-${category.id}`} className={onPageChange && !editing ? 'scroll-mt-36' : 'scroll-mt-28'}>
            <div className={cn('mb-1 flex items-end gap-4 border-b pb-4', palette.border)}>
              <span className={cn('pb-1 text-xs font-semibold tabular-nums', palette.mutedText)}>{String(categoryIndex + 1).padStart(2, '0')}</span>
              <h2 className={cn('min-w-0 flex-1 break-words text-3xl leading-tight tracking-tight @md:text-4xl', theme.fontTitle)}>{category.name}</h2>
            </div>
            <div className="grid gap-x-10 @lg:grid-cols-2">
              {category.dishes.map((dish) => {
                const image = images.dishes[dish.id]
                const quantity = selection[dish.id] ?? 0
                return <div key={dish.id} className={cn('flex min-w-0 flex-col border-b py-6 @md:py-7', palette.border)}>
                  <div className="flex min-w-0 items-start gap-4">
                    {image?.asset.src && <ContentImage image={resolveImage(image, 'menu.dish.photo', 'menu-classic')} alt={dish.name} className="w-24 shrink-0 rounded-xl @md:w-28" />}
                    <div className="min-w-0 flex-1">
                      <h3 className={cn('break-words text-lg leading-snug @md:text-xl', theme.fontTitle)}>{dish.name}</h3>
                      {dish.description && <p className={cn('mt-2 whitespace-pre-wrap break-words text-sm leading-6', palette.mutedText)}>{dish.description}</p>}
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <p className="break-words text-base font-semibold tabular-nums">{money.format(dish.priceMinor! / 100)}</p>
                    {!editing && (quantity === 0
                      ? <button type="button" onClick={() => changeQuantity(dish.id, 1)} className={cn('inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2', palette.muted, palette.cardForeground)}><Plus aria-hidden="true" className="size-4" />{ts('add')}</button>
                      : <div className={cn('inline-flex items-center rounded-full border', palette.border)}>
                        <button type="button" onClick={() => changeQuantity(dish.id, -1)} aria-label={ts('decrease', { name: dish.name })} className="grid size-11 place-items-center rounded-full hover:opacity-65 focus-visible:outline-2"><Minus aria-hidden="true" className="size-4" /></button>
                        <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-label={ts('quantity', { count: quantity })}>{quantity}</span>
                        <button type="button" onClick={() => changeQuantity(dish.id, 1)} disabled={quantity >= 99} aria-label={ts('increase', { name: dish.name })} className="grid size-11 place-items-center rounded-full hover:opacity-65 focus-visible:outline-2 disabled:opacity-40"><Plus aria-hidden="true" className="size-4" /></button>
                      </div>)}
                  </div>
                </div>
              })}
            </div>
          </section>)}
        </div>
      </> : <div className={cn('rounded-3xl border border-dashed px-6 py-16 text-center', palette.border, palette.mutedText)}>
        <p>{editing ? t('emptyEditor') : t('emptyPublic')}</p>
      </div>}
    </section>}

    </div>
    {!editing && visibility.showMenu && <MenuGuestSelectionPanel content={content} theme={palette} selection={selection} open={selectionOpen} onOpenChange={setSelectionOpen} onChangeQuantity={changeQuantity} onRemove={remove} />}
  </article>
}

export function MenuCoverPreview({ theme, title }: { theme: ThemeConfig; title?: string }) {
  const t = useTranslations('editor.menu')
  return <div className="min-h-[320px] overflow-hidden bg-[radial-gradient(ellipse_at_top,#34302a,#080a09_75%)] p-4 text-[#f5f1e9]">
    <div className="min-h-[288px] rounded-t-[2rem] border border-white/10 bg-[#101310]/85 px-5 pt-8 text-center shadow-[0_20px_60px_rgba(0,0,0,.6),inset_0_0_35px_rgba(0,0,0,.3)]">
    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b9b7af]">{t('title')}</p>
    <h2 className={cn('my-5 break-words text-4xl leading-tight', theme.fontTitle)}>{title || t('venuePlaceholder')}</h2>
    <div className="mx-auto mb-6 h-px w-16 border-t border-white/20" />
    <div className="mb-5 flex gap-1 rounded-xl border border-white/15 bg-[#22241f] p-1">
      <span className="h-7 w-20 rounded-lg bg-[#c9a46c]" /><span className="h-7 w-24 rounded-lg bg-white/10" /><span className="h-7 w-16 rounded-lg bg-white/10" />
    </div>
    <div className={cn('border-b border-white/15 pb-2 text-left text-lg', theme.fontTitle)}>{t('categories')}</div>
    {[0, 1].map((row) => <div key={row} className="flex items-center gap-3 border-b border-white/15 py-3">
      <div className="size-11 shrink-0 rounded-lg bg-white/10" />
      <div className="flex-1 space-y-2"><div className="h-2 w-3/4 rounded bg-white/10" /><div className="h-2 w-1/2 rounded bg-white/10" /></div>
      <div className="h-2 w-10 rounded bg-white/10" />
    </div>)}
    </div>
  </div>
}
