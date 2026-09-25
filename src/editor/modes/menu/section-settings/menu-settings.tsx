'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useContentSelector, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { ImagePicker } from '@/editor/image/editor/image-picker'
import { createImageValue, replaceImageValueAsset } from '@/editor/image/editor/create-image-value'
import { MENU_CURRENCIES, MENU_LIMITS, type MenuCurrency, type MenuDish } from '../content-types'
import { menuPriceInput, parseMenuPrice } from '../model'

const field = 'space-y-2 text-sm'
const selectClass = 'h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm'

function MenuImageField({ dishId = null }: { dishId?: string | null }) {
  const t = useTranslations('editor.menu')
  const ownerId = useId()
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  const { image, setImage } = useContentSelector((s) => ({ image: dishId === null ? s.menuImages.logo : s.menuImages.dishes[dishId], setImage: s.setMenuImage }))
  const slotId = dishId === null ? 'menu.venue.logo' : 'menu.dish.photo'
  return <div className={field}>
    <p>{dishId === null ? t('logo') : t('photo')}</p>
    <MediaPickerModal ownerId={ownerId} onSelectImage={(url, thumbUrl) => {
      const source = { slotId, src: url, blurDataUrl: thumbUrl } as const
      setImage(dishId, image ? replaceImageValueAsset(image, source) : createImageValue(source))
    }} />
    <ImagePicker slotId={slotId} value={image ?? { asset: { src: '', width: 0, height: 0 } }} dense
      onChange={(next) => setImage(dishId, next.asset.src ? next : undefined)} onOpenMediaPicker={() => openMediaPicker(ownerId)} />
  </div>
}

export function MenuVenueSettings() {
  const t = useTranslations('editor.menu')
  const { venue, update } = useContentSelector((s) => ({ venue: s.menuContent.venue, update: s.updateMenuVenue }))
  return <div className="space-y-6 p-1">
    <label className="block space-y-2 text-sm">{t('venueName')}<Input value={venue.name} maxLength={MENU_LIMITS.name} placeholder={t('venuePlaceholder')} onChange={(e) => update({ name: e.target.value })} /></label>
    <label className="block space-y-2 text-sm">{t('description')}<Textarea value={venue.description} maxLength={MENU_LIMITS.description} onChange={(e) => update({ description: e.target.value })} /></label>
    <label className="block space-y-2 text-sm">{t('currency')}<select className={selectClass} value={venue.currency} onChange={(e) => update({ currency: e.target.value as MenuCurrency })}>
      {MENU_CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
    </select></label>
    <p className="text-xs text-muted-foreground">{t('currencyHint')}</p>
    <MenuImageField />
  </div>
}

function DishPrice({ dish }: { dish: MenuDish }) {
  const t = useTranslations('editor.menu')
  const update = useContentSelector((s) => s.updateMenuDish)
  const [draft, setDraft] = useState(() => menuPriceInput(dish.priceMinor))
  const error = draft.trim() !== '' && parseMenuPrice(draft) === null
  return <label className="block space-y-2 text-sm">{t('price')}
    <Input value={draft} inputMode="decimal" maxLength={12} aria-invalid={error} placeholder="0.00" onChange={(e) => {
      const value = e.target.value
      setDraft(value)
      // Invalid drafts cannot silently save the old price or publish as a zero-price dish.
      update(dish.id, { priceMinor: parseMenuPrice(value) })
    }} onBlur={() => { if (!error) setDraft(menuPriceInput(dish.priceMinor)) }} />
    {error && <span role="alert" className="text-xs text-destructive">{t('invalidPrice')}</span>}
  </label>
}

function DishEditor({ dish, index, count }: { dish: MenuDish; index: number; count: number }) {
  const t = useTranslations('editor.menu')
  const { categories, update, remove, move } = useContentSelector((s) => ({ categories: s.menuContent.categories, update: s.updateMenuDish, remove: s.removeMenuDish, move: s.moveMenuDish }))
  const [expanded, setExpanded] = useState(!dish.name)
  return <details className="rounded-xl border border-border bg-background p-3" open={expanded} onToggle={(e) => setExpanded(e.currentTarget.open)}>
    <summary className="cursor-pointer break-words text-sm font-medium">{dish.name || t('newDish')}{!dish.visible && <span className="ml-2 text-xs text-muted-foreground">{t('hidden')}</span>}</summary>
    <div className="mt-4 space-y-4">
      <label className="block space-y-2 text-sm">{t('dishName')}<Input value={dish.name} maxLength={MENU_LIMITS.name} onChange={(e) => update(dish.id, { name: e.target.value })} /></label>
      <label className="block space-y-2 text-sm">{t('ingredients')}<Textarea value={dish.description} maxLength={MENU_LIMITS.description} onChange={(e) => update(dish.id, { description: e.target.value })} /></label>
      <DishPrice dish={dish} />
      <label className="block space-y-2 text-sm">{t('category')}<select className={selectClass} value={dish.categoryId} onChange={(e) => update(dish.id, { categoryId: e.target.value })}>
        {categories.map((category) => <option value={category.id} key={category.id}>{category.name || t('newCategory')}</option>)}
      </select></label>
      <MenuImageField dishId={dish.id} />
      <div className="flex flex-wrap gap-1">
        <Button variant="ghost" size="icon" aria-label={t('up')} disabled={index === 0} onClick={() => move(dish.id, -1)}><ArrowUp className="size-4" /></Button>
        <Button variant="ghost" size="icon" aria-label={t('down')} disabled={index === count - 1} onClick={() => move(dish.id, 1)}><ArrowDown className="size-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => update(dish.id, { visible: !dish.visible })}>{dish.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}{t(dish.visible ? 'hide' : 'show')}</Button>
        <Button variant="ghost" size="icon" className="ml-auto text-destructive" aria-label={t('removeDish')} onClick={() => remove(dish.id)}><Trash2 className="size-4" /></Button>
      </div>
    </div>
  </details>
}

export function MenuItemsSettings() {
  const t = useTranslations('editor.menu')
  const { content, addCategory, updateCategory, removeCategory, moveCategory, addDish } = useContentSelector((s) => ({
    content: s.menuContent, addCategory: s.addMenuCategory, updateCategory: s.updateMenuCategory,
    removeCategory: s.removeMenuCategory, moveCategory: s.moveMenuCategory, addDish: s.addMenuDish,
  }))
  return <div className="space-y-5 p-1">
    <p className="text-xs text-muted-foreground">{t('draftHint')}</p>
    {content.categories.map((category, index) => {
      const dishes = content.dishes.filter((dish) => dish.categoryId === category.id)
      return <section key={category.id} className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-3">
        <label className="block space-y-2 text-sm">{t('categoryName')}<Input value={category.name} maxLength={MENU_LIMITS.name} placeholder={t('newCategory')} onChange={(e) => updateCategory(category.id, { name: e.target.value })} /></label>
        <div className="flex flex-wrap gap-1">
          <Button size="icon" variant="ghost" aria-label={t('up')} disabled={index === 0} onClick={() => moveCategory(category.id, -1)}><ArrowUp className="size-4" /></Button>
          <Button size="icon" variant="ghost" aria-label={t('down')} disabled={index === content.categories.length - 1} onClick={() => moveCategory(category.id, 1)}><ArrowDown className="size-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => updateCategory(category.id, { visible: !category.visible })}>{category.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}{t(category.visible ? 'hide' : 'show')}</Button>
          <Button size="icon" variant="ghost" className="ml-auto text-destructive" aria-label={t('removeCategory')} disabled={dishes.length > 0} onClick={() => removeCategory(category.id)}><Trash2 className="size-4" /></Button>
        </div>
        {dishes.length > 0 && <p className="text-xs text-muted-foreground">{t('removeCategoryHint')}</p>}
        {dishes.map((dish, i) => <DishEditor key={dish.id} dish={dish} index={i} count={dishes.length} />)}
        <Button className="w-full" size="sm" variant="outline" disabled={content.dishes.length >= MENU_LIMITS.dishes} onClick={() => addDish(category.id)}><Plus className="size-4" />{t('addDish')}</Button>
      </section>
    })}
    <Button className="w-full" variant="outline" disabled={content.categories.length >= MENU_LIMITS.categories} onClick={addCategory}><Plus className="size-4" />{t('addCategory')}</Button>
    <p className="text-xs text-muted-foreground">{t('limits', { categories: MENU_LIMITS.categories, dishes: MENU_LIMITS.dishes })}</p>
  </div>
}
