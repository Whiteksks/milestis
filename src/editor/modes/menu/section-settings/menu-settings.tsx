'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowDown, ArrowUp, Eye, EyeOff, MoreHorizontal, Plus, Trash2, Unlink, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PublishModalFrame } from '@/editor/components/modals/publish-modal-frame'
import { ContentImage } from '@/editor/image/render/content-image'
import { resolveImage } from '@/editor/image/resolve'
import { useContentSelector, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { ImagePicker } from '@/editor/image/editor/image-picker'
import { createImageValue, replaceImageValueAsset } from '@/editor/image/editor/create-image-value'
import { MENU_CURRENCIES, MENU_LIMITS, type MenuCurrency } from '../content-types'
import { menuPageCategories } from '../model'
import { useActiveMenuPage } from '../use-active-menu-page'
import { MenuDishDialog } from '../dish-dialog'
import { MenuCategoryDialog } from '../category-dialog'

const field = 'space-y-2 text-sm'
const selectClass = 'h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm'

function MenuImageField() {
  const t = useTranslations('editor.menu')
  const ownerId = useId()
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  const { image, setImage } = useContentSelector((s) => ({ image: s.menuImages.logo, setImage: s.setMenuImage }))
  const slotId = 'menu.venue.logo'
  return <div className={field}>
    <p>{t('logo')}</p>
    <MediaPickerModal ownerId={ownerId} onSelectImage={(url, thumbUrl) => {
      const source = { slotId, src: url, blurDataUrl: thumbUrl } as const
      setImage(null, image ? replaceImageValueAsset(image, source) : createImageValue(source))
    }} />
    <ImagePicker slotId={slotId} value={image ?? { asset: { src: '', width: 0, height: 0 } }} dense
      onChange={(next) => setImage(null, next.asset.src ? next : undefined)} onOpenMediaPicker={() => openMediaPicker(ownerId)} />
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

export function MenuItemsSettings() {
  const t = useTranslations('editor.menu')
  const tp = useTranslations('editor.menu.pages')
  const locale = useLocale()
  const page = useActiveMenuPage()
  const activeCategoryId = useUiStore((s) => s.activeMenuCategoryId)
  const { content, images, updateCategory, removeCategory, moveCategory, moveDish, setPageCategory } = useContentSelector((s) => ({
    content: s.menuContent, images: s.menuImages.dishes,
    updateCategory: s.updateMenuCategory,
    removeCategory: s.removeMenuCategory, moveCategory: s.moveMenuCategory,
    moveDish: s.moveMenuDish, setPageCategory: s.setMenuPageCategory,
  }))
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [editDishId, setEditDishId] = useState<string | null>(null)
  const [creatingDish, setCreatingDish] = useState(false)
  const tabList = useRef<HTMLDivElement>(null)
  const categories = menuPageCategories(content, page.id)
  const availableCategories = content.categories.filter((category) => !page.content.categoryIds.includes(category.id))
  const category = categories.find((entry) => entry.id === activeCategoryId) ?? categories[0]
  const dishes = category ? content.dishes.filter((dish) => dish.categoryId === category.id) : []
  const money = new Intl.NumberFormat(locale === 'kz' ? 'kk-KZ' : locale, { style: 'currency', currency: content.venue.currency, maximumFractionDigits: 2 })
  const editingDish = editDishId ? content.dishes.find((dish) => dish.id === editDishId) : undefined
  const deletingCategory = deletingCategoryId ? content.categories.find((entry) => entry.id === deletingCategoryId) : undefined

  useEffect(() => {
    tabList.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [category?.id])

  function attach(id: string) {
    setPageCategory(page.id, id, true)
    useUiStore.getState().setActiveMenuCategoryId(id)
  }

  function selectCategory(id: string) {
    useUiStore.getState().setActiveMenuCategoryId(id)
  }

  return <div className="min-w-0 space-y-5 p-1">
    <div className="space-y-1 px-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{tp('title')}</p>
      <h2 className="break-words text-lg font-semibold">{page.name || tp(page.id === content.homePageId ? 'home' : 'untitled')}</h2>
    </div>

    <div className="flex min-w-0 items-end gap-2 border-b">
      <div ref={tabList} role="tablist" aria-label={t('categories')} className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {categories.map((entry, index) => {
          const count = content.dishes.filter((dish) => dish.categoryId === entry.id).length
          return <button key={entry.id} type="button" role="tab" id={`menu-category-tab-${entry.id}`}
            aria-selected={category?.id === entry.id} aria-controls="menu-category-panel" tabIndex={category?.id === entry.id ? 0 : -1}
            onClick={() => selectCategory(entry.id)} onKeyDown={(event) => {
              let next: number
              if (event.key === 'ArrowRight') next = (index + 1) % categories.length
              else if (event.key === 'ArrowLeft') next = (index - 1 + categories.length) % categories.length
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = categories.length - 1
              else return
              event.preventDefault()
              selectCategory(categories[next].id)
              document.getElementById(`menu-category-tab-${categories[next].id}`)?.focus()
            }}
            className={`flex h-11 max-w-40 shrink-0 items-center gap-1.5 rounded-t-xl border border-b-0 px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${category?.id === entry.id ? 'border-border bg-background font-semibold text-foreground' : 'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/60'}`}>
            {!entry.visible && <EyeOff className="size-3.5 shrink-0" aria-label={t('hidden')} />}
            <span className="truncate">{entry.name || t('newCategory')}</span>
            <span className="rounded-full bg-muted px-1.5 text-[10px] tabular-nums">{count}</span>
          </button>
        })}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="mb-1 shrink-0" aria-label={t('addCategory')}
            disabled={content.categories.length >= MENU_LIMITS.categories && availableCategories.length === 0}><Plus className="size-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-72 min-w-48 overflow-y-auto">
          {content.categories.length < MENU_LIMITS.categories && <DropdownMenuItem onSelect={() => setCategoryDialog(true)}><Plus className="size-4" />{t('categoryForm.title')}</DropdownMenuItem>}
          {availableCategories.length > 0 && <>
            {content.categories.length < MENU_LIMITS.categories && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{tp('attachCategory')}</DropdownMenuLabel>
            {availableCategories.map((entry) => <DropdownMenuItem key={entry.id} onSelect={() => attach(entry.id)}>{entry.name || t('newCategory')}</DropdownMenuItem>)}
          </>}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {category ? <div id="menu-category-panel" role="tabpanel" aria-labelledby={`menu-category-tab-${category.id}`} className="space-y-5">
      <div className="space-y-4 rounded-2xl border bg-card p-4">
        <label className="block space-y-2 text-sm font-medium">{t('categoryName')}
          <Input value={category.name} maxLength={MENU_LIMITS.name} placeholder={t('newCategory')} onChange={(event) => updateCategory(category.id, { name: event.target.value })} />
        </label>
        <div className="flex items-center gap-1">
          <Button type="button" variant="outline" size="sm" onClick={() => updateCategory(category.id, { visible: !category.visible })}>
            {category.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}{t(category.visible ? 'hide' : 'show')}
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label={t('up')} disabled={categories[0].id === category.id} onClick={() => moveCategory(page.id, category.id, -1)}><ArrowUp className="size-4" /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label={t('down')} disabled={categories.at(-1)?.id === category.id} onClick={() => moveCategory(page.id, category.id, 1)}><ArrowDown className="size-4" /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon" className="ml-auto" aria-label={t('categoryForm.actions')}><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setPageCategory(page.id, category.id, false)}><Unlink className="size-4" />{tp('detachCategory')}</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" disabled={dishes.length > 0} onSelect={() => setDeletingCategoryId(category.id)}><Trash2 className="size-4" />{t('removeCategory')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground">{tp('sharedCatalogHint')}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <div><h3 className="text-sm font-semibold">{t('dishForm.dishes')}</h3><p className="text-xs text-muted-foreground">{t('dishForm.count', { count: dishes.length })}</p></div>
          <Button type="button" size="sm" disabled={content.dishes.length >= MENU_LIMITS.dishes} onClick={() => setCreatingDish(true)}><Plus className="size-4" />{t('addDish')}</Button>
        </div>
        {dishes.length === 0 ? <div className="rounded-2xl border border-dashed bg-muted/20 px-5 py-9 text-center">
          <UtensilsCrossed className="mx-auto mb-3 size-6 text-muted-foreground" />
          <p className="text-sm font-medium">{t('dishForm.empty')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('dishForm.emptyHint')}</p>
        </div> : <div className="space-y-2">
          {dishes.map((dish, index) => {
            const image = images[dish.id]
            return <div key={dish.id} className="flex min-w-0 items-center gap-2 rounded-xl border bg-background p-2.5 shadow-xs">
              <button type="button" onClick={() => setEditDishId(dish.id)} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                  {image?.asset.src ? <ContentImage fillParent image={resolveImage(image, 'menu.dish.photo', 'menu-classic')} alt={dish.name} /> : <UtensilsCrossed className="size-5" />}
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{dish.name || t('newDish')}</span>
                  <span className="block text-xs text-muted-foreground">{dish.priceMinor === null ? t('dishForm.incomplete') : money.format(dish.priceMinor / 100)}{!dish.visible && ` · ${t('hidden')}`}</span>
                </span>
              </button>
              <div className="flex shrink-0 items-center">
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={t('up')} disabled={index === 0} onClick={() => moveDish(dish.id, -1)}><ArrowUp className="size-3.5" /></Button>
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={t('down')} disabled={index === dishes.length - 1} onClick={() => moveDish(dish.id, 1)}><ArrowDown className="size-3.5" /></Button>
              </div>
            </div>
          })}
        </div>}
      </div>
    </div> : <div className="rounded-2xl border border-dashed bg-muted/20 px-5 py-8 text-center text-sm text-muted-foreground">{tp('empty')}</div>}

    {categoryDialog && <MenuCategoryDialog pageId={page.id} onClose={() => setCategoryDialog(false)} />}
    {category && (creatingDish || editingDish) && <MenuDishDialog key={editingDish?.id ?? 'new'} pageId={page.id} categoryId={category.id} dish={editingDish} onClose={() => { setCreatingDish(false); setEditDishId(null) }} />}
    {deletingCategory && <PublishModalFrame open onOpenChange={(open) => { if (!open) setDeletingCategoryId(null) }}
      title={<><Trash2 className="size-4 text-destructive" />{t('removeCategory')}</>}
      description={t('categoryForm.deleteDescription', { name: deletingCategory.name || t('newCategory') })}
      footer={<><Button variant="outline" onClick={() => setDeletingCategoryId(null)}>{tp('cancel')}</Button>
        <Button variant="destructive" onClick={() => { removeCategory(deletingCategory.id); setDeletingCategoryId(null) }}>{tp('delete')}</Button></>}>
      <p className="rounded-xl border bg-muted/20 p-4 text-sm">{t('categoryForm.deleteHint')}</p>
    </PublishModalFrame>}
  </div>
}
