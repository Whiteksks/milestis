'use client'

import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import type { MenuContent } from './content-types'
import { resolveMenuSelection, type MenuSelection } from './guest-selection'

export function MenuGuestSelectionPanel({ content, theme, selection, open, onOpenChange, onChangeQuantity, onRemove }: {
  content: MenuContent
  theme: ThemeConfig
  selection: MenuSelection
  open: boolean
  onOpenChange: (open: boolean) => void
  onChangeQuantity: (dishId: string, delta: -1 | 1) => void
  onRemove: (dishId: string) => void
}) {
  const t = useTranslations('editor.menu.selection')
  const locale = useLocale()
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, {
    style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2,
  })
  const { items, count, totalPriceMinor } = resolveMenuSelection(selection, content)
  if (count === 0) return null

  return <>
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button type="button" onClick={() => onOpenChange(true)} className={cn(
        'pointer-events-auto flex min-h-14 w-full max-w-md items-center justify-between gap-3 rounded-2xl px-5 py-3 text-left shadow-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2',
        theme.primary, theme.primaryText,
      )}>
        <span className="flex items-center gap-3 font-semibold"><ShoppingBag aria-hidden="true" className="size-5" />{t('title')}</span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-sm tabular-nums" aria-label={t('count', { count })}>{count}</span>
      </button>
    </div>
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn(
        'z-[220] max-h-[85dvh] rounded-t-3xl border-t p-0', theme.card, theme.cardForeground, theme.border, theme.fontBody,
      )} overlayClassName="z-[219] bg-black/75">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
          <DrawerHeader className="relative px-0 pr-10 text-left">
            <DrawerTitle className={cn('text-2xl !text-[#f5f1e9]', theme.fontTitle)}>{t('title')}</DrawerTitle>
            <DrawerDescription className="!text-[#b9b7af]">{t('showWaiter')}</DrawerDescription>
            <DrawerClose className="absolute right-0 top-0 grid size-10 place-items-center rounded-full text-[#b9b7af] hover:bg-white/10 focus-visible:outline-2" aria-label={t('close')}><X aria-hidden="true" className="size-5" /></DrawerClose>
          </DrawerHeader>
          <div className="mt-4 divide-y" role="list">
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
          <div className={cn('mt-3 flex items-center justify-between border-t pt-5 font-semibold', theme.border)}>
            <span>{items.some((item) => !item.dish) ? t('availableTotal') : t('total')}</span><span className="tabular-nums">{money.format(totalPriceMinor / 100)}</span>
          </div>
          <p className={cn('mt-3 text-xs', theme.mutedText)}>{t('notOrder')}</p>
        </div>
      </DrawerContent>
    </Drawer>
  </>
}
