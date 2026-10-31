'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { ArrowUpRight, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import { cn } from '@/lib/utils'
import type { MenuContent, MenuImageContent } from './content-types'
import type { MenuTemplateId } from './template-ids'
import { visibleMenuCategories } from './model'
import { resolveMenuSelection, type MenuSelection, type MenuSelectionInteraction } from './guest-selection'
import { MenuMascot, MenuMascotMessage } from './mascot/mascot'
import { useMascot } from './mascot/use-mascot'
import { MascotPairGame } from './mascot/game/pair-game'

type DrawerView = 'recommendations' | 'selection' | 'game'

export function MenuGuestSelectionPanel({ content, images, pageId, theme, menuStyle, selection, interaction, onChangeQuantity, onRemove, templateId = 'menu-classic' }: {
  templateId?: MenuTemplateId
  content: MenuContent
  images: MenuImageContent
  pageId: string
  theme: ThemeConfig
  menuStyle: CSSProperties
  selection: MenuSelection
  interaction: MenuSelectionInteraction | null
  onChangeQuantity: (dishId: string, delta: -1 | 1) => void
  onRemove: (dishId: string) => void
}) {
  const t = useTranslations('editor.menu.selection')
  const tr = useTranslations('editor.menu.recommendations')
  const tg = useTranslations('editor.menu.mascot.game')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<DrawerView>('recommendations')
  const scrollRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { playback, play } = useMascot(content.mascot.enabled, interaction)
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, {
    style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2,
  })
  const { items, count, totalPriceMinor } = resolveMenuSelection(selection, content)
  const recommended = visibleMenuCategories(content, pageId).flatMap((category) => category.dishes.filter((dish) => dish.recommended))

  function openView(next: DrawerView) {
    if (next === 'recommendations' && content.mascot.enabled) play('curious')
    setView(next)
    setOpen(true)
  }

  return <>
    {/* One stack: the mascot sits above the selection bar and glides up when the bar appears. */}
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-end gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <motion.div layout="position" transition={{ duration: reduceMotion ? 0 : .25, ease: 'easeOut' }} className="pointer-events-auto max-w-full">
        <button type="button" onClick={() => openView('recommendations')} aria-label={tr('open')}
          className="flex max-w-full items-center gap-2 rounded-full border border-[var(--menu-accent-line)] bg-[var(--menu-surface-raised)] py-2 pl-2 pr-4 text-[var(--menu-text)] shadow-[0_4px_24px_-6px_rgba(44,39,26,.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--menu-accent)]">
          {content.mascot.enabled ? <MenuMascot settings={content.mascot} playback={playback} className="size-12 shrink-0" /> : <Sparkles aria-hidden="true" className="m-2 size-5 shrink-0" />}
          <span className="text-xs font-semibold">{tr('title')}</span>
        </button>
      </motion.div>
      <AnimatePresence initial={false}>
        {count > 0 && <motion.div key="selection-bar" layout="position" className="pointer-events-auto flex w-full max-w-md items-center self-center"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          transition={{ duration: reduceMotion ? 0 : .25, ease: 'easeOut' }}>
          <button type="button" onClick={() => openView('selection')} className={cn(
            'flex min-h-16 w-full items-center justify-between gap-3 rounded-full px-6 py-3 text-left shadow-[0_8px_32px_-8px_rgba(30,40,28,.35)] focus-visible:outline-2 focus-visible:outline-offset-2',
            theme.primary, theme.primaryText,
          )}>
            <span className="flex min-w-0 items-center gap-3 text-sm font-semibold"><ShoppingBag aria-hidden="true" className="size-4 shrink-0" />{t('title')}</span>
            <span className="flex shrink-0 items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-white/15 text-xs tabular-nums" aria-label={t('count', { count })}>{count}</span><ArrowUpRight aria-hidden="true" className="size-4" /></span>
          </button>
        </motion.div>}
      </AnimatePresence>
    </div>
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent style={menuStyle} className={cn(
        'z-[220] h-[min(85dvh,44rem)] min-h-[min(85dvh,32rem)] data-[vaul-drawer-direction=bottom]:max-h-[85dvh] data-[vaul-drawer-direction=bottom]:rounded-t-[2rem] border-t p-0 [&>div:first-child]:bg-[var(--menu-accent-line)]', theme.card, theme.cardForeground, theme.border, theme.fontBody,
      )} overlayClassName="z-[219] bg-[#242820]/40 backdrop-blur-sm">
        <Tabs value={view} onValueChange={(value) => {
          setView(value as DrawerView)
          if (scrollRef.current) scrollRef.current.scrollTop = 0
        }} className="mx-auto min-h-0 w-full max-w-2xl flex-1 gap-0">
          <div data-vaul-no-drag className="relative shrink-0 px-5 pb-4 pt-4 sm:px-8">
            <div className="pr-13">
              <TabsList className="h-auto w-full gap-1 rounded-full bg-[var(--menu-accent-soft)] p-1">
                {(['recommendations', 'selection', ...(content.mascot.enabled ? ['game' as const] : [])] as const).map((tab) => <TabsTrigger key={tab} value={tab}
                  className="h-auto min-h-11 min-w-0 flex-1 rounded-full border-0 px-3 py-2 text-xs font-semibold text-[var(--menu-muted-text)] data-[state=active]:bg-[var(--menu-accent)] data-[state=active]:text-[var(--menu-accent-ink)] data-[state=active]:shadow-none dark:text-[var(--menu-muted-text)] dark:data-[state=active]:bg-[var(--menu-accent)] dark:data-[state=active]:text-[var(--menu-accent-ink)]">
                  <span className="min-w-0 truncate">{tab === 'game' ? tg('play') : tab === 'recommendations' ? tr('tab') : t('title')}{tab === 'selection' && count > 0 ? ' · ' + count : ''}</span>
                </TabsTrigger>)}
              </TabsList>
            </div>
            <DrawerClose className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-[var(--menu-accent-soft)] text-[var(--menu-muted-text)] hover:opacity-70 focus-visible:outline-2 sm:right-8" aria-label={t('close')}><X aria-hidden="true" className="size-5" /></DrawerClose>
          </div>
          <div ref={scrollRef} data-vaul-no-drag className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] [overflow-anchor:none] sm:px-8">
            <DrawerHeader className={cn('px-0 pt-0 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left', view === 'game' && 'sr-only')}>
              {content.mascot.enabled && view !== 'game' && <div className="flex items-center gap-3"><MenuMascot settings={content.mascot} playback={playback} className="size-16 shrink-0" /><MenuMascotMessage mood={playback.mood} /></div>}
              <DrawerTitle className={view === 'game' ? 'sr-only' : 'mt-5 text-4xl tracking-tight !text-[var(--menu-text)]'}>{view === 'game' ? tg('title') : view === 'recommendations' ? tr('title') : t('title')}</DrawerTitle>
              <DrawerDescription className={view === 'game' ? 'sr-only' : 'mt-2 text-sm leading-6 !text-[var(--menu-muted-text)]'}>{view === 'game' ? tg('hint') : view === 'recommendations' ? tr('description') : t('showWaiter')}</DrawerDescription>
            </DrawerHeader>
            {content.mascot.enabled && <TabsContent value="game" forceMount className="mx-auto max-w-sm data-[state=inactive]:hidden"><MascotPairGame key={content.mascot.characterId} settings={content.mascot} playback={playback} onReaction={play} /></TabsContent>}
            <TabsContent value="recommendations" forceMount className="data-[state=inactive]:hidden">
              {recommended.length > 0 ? <div className="mt-4 divide-y divide-[var(--menu-accent-line)]">
                {recommended.map((dish) => {
                  const image = images.dishes[dish.id]
                  const quantity = selection[dish.id] ?? 0
                  return <div key={dish.id} className="flex items-start gap-3 py-5">
                    {image?.asset.src && <ContentImage image={resolveImage(image, 'menu.dish.photo', templateId)} alt={dish.name} className="w-20 shrink-0 rounded-xl sm:w-24" />}
                    <div className="min-w-0 flex-1"><p className="break-words font-semibold">{dish.name}</p>
                      {dish.description && <p className={cn('mt-1 line-clamp-2 text-sm', theme.mutedText)}>{dish.description}</p>}
                      <p className="mt-2 text-sm font-semibold tabular-nums">{money.format(dish.priceMinor! / 100)}</p>
                    </div>
                    <button type="button" onClick={() => onChangeQuantity(dish.id, 1)} disabled={quantity >= 99}
                      aria-label={tr('add', { name: dish.name })} className={cn('grid size-11 shrink-0 place-items-center self-center rounded-full transition-opacity hover:opacity-75 disabled:opacity-40', theme.primary, theme.primaryText)}><Plus aria-hidden="true" className="size-5" /></button>
                  </div>
                })}
              </div> : <p className={cn('mt-6 rounded-2xl border border-dashed p-6 text-center text-sm leading-6', theme.border, theme.mutedText)}>{tr('empty')}</p>}
            </TabsContent>
            <TabsContent value="selection" forceMount className="data-[state=inactive]:hidden">
              {count > 0 ? <><div className="mt-4 divide-y divide-[var(--menu-accent-line)]" role="list">
                {items.map(({ id, quantity, dish }) => <div key={id} role="listitem" className={cn('flex items-start justify-between gap-4 py-4', theme.border)}>
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-medium">{dish?.name || t('unavailable')}</p>
                    {dish ? <p className={cn('mt-1 text-sm tabular-nums', theme.mutedText)}>{money.format((dish.priceMinor ?? 0) * quantity / 100)}</p>
                      : <p className={cn('mt-1 text-sm', theme.mutedText)}>{t('removedFromMenu')}</p>}
                  </div>
                  {dish ? <div className={cn('flex shrink-0 items-center rounded-full border', theme.border)}>
                    <button type="button" onClick={() => onChangeQuantity(id, -1)} aria-label={t('decrease', { name: dish.name })} className="grid size-10 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-2"><Minus aria-hidden="true" className="size-4" /></button>
                    <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-label={t('quantity', { count: quantity })}>{quantity}</span>
                    <button type="button" onClick={() => onChangeQuantity(id, 1)} disabled={quantity >= 99} aria-label={t('increase', { name: dish.name })} className="grid size-10 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-2 disabled:opacity-40"><Plus aria-hidden="true" className="size-4" /></button>
                  </div> : <button type="button" onClick={() => onRemove(id)} aria-label={t('removeUnavailable')} className={cn('grid size-10 shrink-0 place-items-center rounded-full border', theme.border)}><Trash2 aria-hidden="true" className="size-4" /></button>}
                </div>)}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--menu-accent-soft)] p-5 text-lg font-semibold">
                <span>{items.some((item) => !item.dish) ? t('availableTotal') : t('total')}</span><span className="tabular-nums">{money.format(totalPriceMinor / 100)}</span>
              </div>
              <p className={cn('mt-3 text-xs', theme.mutedText)}>{t('notOrder')}</p></> : <p className={cn('mt-6 rounded-2xl border border-dashed p-6 text-center text-sm leading-6', theme.border, theme.mutedText)}>{t('empty')}</p>}
            </TabsContent>
          </div>
        </Tabs>
      </DrawerContent>
    </Drawer>
  </>
}
