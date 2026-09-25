'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { cn } from '@/lib/utils'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import type { MenuContent, MenuImageContent, MenuVisibility } from '../content-types'
import { visibleMenuCategories } from '../model'

export interface MenuTemplateProps {
  theme: ThemeConfig
  content: MenuContent
  images: MenuImageContent
  visibility: MenuVisibility
  editing?: boolean
}

export function MenuClassic({ theme, content, images, visibility, editing = false }: MenuTemplateProps) {
  const t = useTranslations('editor.menu')
  const locale = useLocale()
  const categories = visibleMenuCategories(content)
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, { style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2 })
  return (
    <article className={cn('mx-auto min-h-screen max-w-4xl px-5 py-12 @md:px-10 @md:py-16', theme.foreground, theme.fontBody, theme.lineHeight, theme.letterSpacing)}>
      {visibility.showVenue && (
        <header id="venue" data-section-id="venue" className={cn('border-b pb-10 text-center', theme.border)}>
          {images.logo?.asset.src && <ContentImage image={resolveImage(images.logo, 'menu.venue.logo', 'menu-classic')} alt={content.venue.name} className="mx-auto mb-6 w-20" />}
          <p className={cn('mb-3 text-xs uppercase tracking-[0.3em]', theme.mutedText)}>{t('title')}</p>
          <h1 className={cn('break-words text-4xl @md:text-6xl', theme.fontTitle)}>{content.venue.name || (editing ? t('venuePlaceholder') : t('title'))}</h1>
          {content.venue.description && <p className={cn('mx-auto mt-5 max-w-lg whitespace-pre-wrap break-words text-sm', theme.mutedText)}>{content.venue.description}</p>}
        </header>
      )}
      {visibility.showMenu && (
        <section id="menu" data-section-id="menu" className="pt-8">
          {categories.length > 0 ? <>
            <nav aria-label={t('categories')} className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((category) => <a key={category.id} href={`#menu-category-${category.id}`} onClick={(event) => {
                event.preventDefault()
                event.currentTarget.closest('article')?.querySelector(`[id="menu-category-${category.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }} className={cn('max-w-full break-words rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-70', theme.border, theme.muted)}>{category.name}</a>)}
            </nav>
            <div className="space-y-12">
              {categories.map((category) => <section key={category.id} id={`menu-category-${category.id}`} className="scroll-mt-6">
                <h2 className={cn('mb-5 break-words border-b pb-3 text-2xl @md:text-3xl', theme.fontTitle, theme.border)}>{category.name}</h2>
                <div className="grid gap-4 @lg:grid-cols-2">
                  {category.dishes.map((dish) => {
                    const image = images.dishes[dish.id]
                    return <div key={dish.id} className={cn('flex min-w-0 gap-4 border p-4', theme.card, theme.cardForeground, theme.border, theme.radiusMedium)}>
                      {image?.asset.src && <ContentImage image={resolveImage(image, 'menu.dish.photo', 'menu-classic')} alt={dish.name} className="w-20 shrink-0 self-start @md:w-24" />}
                      <div className="min-w-0 flex-1">
                        <h3 className={cn('break-words text-lg', theme.fontTitle)}>{dish.name}</h3>
                        {dish.description && <p className={cn('mt-1 whitespace-pre-wrap break-words text-sm', theme.mutedText)}>{dish.description}</p>}
                        <p className="mt-3 break-words text-sm font-semibold tabular-nums">{money.format(dish.priceMinor! / 100)}</p>
                      </div>
                    </div>
                  })}
                </div>
              </section>)}
            </div>
          </> : <div className={cn('rounded-2xl border border-dashed px-6 py-16 text-center', theme.border, theme.mutedText)}>
            <p>{editing ? t('emptyEditor') : t('emptyPublic')}</p>
          </div>}
        </section>
      )}
    </article>
  )
}

export function MenuCoverPreview({ theme, title }: { theme: ThemeConfig; title?: string }) {
  const t = useTranslations('editor.menu')
  return <div className={cn('min-h-[320px] p-10 text-center', theme.background, theme.foreground)}>
    <p className="text-xs uppercase tracking-[0.3em]">{t('title')}</p>
    <h2 className={cn('my-6 break-words text-4xl', theme.fontTitle)}>{title || t('venuePlaceholder')}</h2>
    <div className={cn('border-t pt-5 text-left', theme.border)}>
      {[0, 1, 2].map((row) => <div key={row} className={cn('mb-4 flex items-center gap-4 border-b pb-4', theme.border)}>
        <div className={cn('h-12 w-12 shrink-0 rounded-lg', theme.muted)} />
        <div className="flex-1 space-y-2"><div className={cn('h-2 w-3/4 rounded', theme.muted)} /><div className={cn('h-2 w-1/2 rounded', theme.muted)} /></div>
      </div>)}
    </div>
  </div>
}
