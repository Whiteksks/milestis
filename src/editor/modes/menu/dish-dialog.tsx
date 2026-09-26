'use client'

import { useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Trash2, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PublishModalFrame } from '@/editor/components/modals/publish-modal-frame'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { ImagePicker } from '@/editor/image/editor/image-picker'
import { createImageValue, replaceImageValueAsset } from '@/editor/image/editor/create-image-value'
import type { ImageValue } from '@/editor/image/data'
import { useContentStore } from '@/editor/lib/store/content'
import { useUiStore } from '@/editor/lib/store/ui'
import { MENU_LIMITS, type MenuDish } from './content-types'
import { menuPageCategories, menuPriceInput, parseMenuPrice } from './model'
import { MenuPhotoEnhancement } from './photo-enhancement'

const selectClass = 'h-11 w-full rounded-xl border border-input bg-background px-3 text-sm'

export function MenuDishDialog({ pageId, categoryId, dish, onClose }: {
  pageId: string
  categoryId: string
  dish?: MenuDish
  onClose: () => void
}) {
  const t = useTranslations('editor.menu')
  const tf = useTranslations('editor.menu.dishForm')
  const ownerId = useId()
  const projectId = useUiStore((s) => s.projectId)
  const formId = useId()
  const nameRef = useRef<HTMLInputElement>(null)
  const menuContent = useContentStore((s) => s.menuContent)
  const categories = menuPageCategories(menuContent, pageId)
  const storedImage = useContentStore((s) => dish ? s.menuImages.dishes[dish.id] : undefined)
  const [name, setName] = useState(dish?.name ?? '')
  const [price, setPrice] = useState(menuPriceInput(dish?.priceMinor ?? null))
  const [description, setDescription] = useState(dish?.description ?? '')
  const [selectedCategoryId, setSelectedCategoryId] = useState(dish?.categoryId ?? categoryId)
  const [visible, setVisible] = useState(dish?.visible ?? true)
  const [recommended, setRecommended] = useState(dish?.recommended ?? false)
  const [image, setImage] = useState<ImageValue | undefined>(storedImage)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState(false)
  const priceMinor = parseMenuPrice(price)
  const nameError = submitted && !name.trim()
  const priceError = (submitted || price.length > 0) && priceMinor === null
  const categoryName = categories.find((category) => category.id === categoryId)?.name || t('newCategory')

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (photoBusy) return
    setSubmitted(true)
    if (!name.trim() || priceMinor === null) return
    const details = { name: name.trim(), description: description.trim(), priceMinor, visible, recommended }
    const store = useContentStore.getState()
    const done = dish
      ? store.saveMenuDish(dish.id, { ...details, categoryId: selectedCategoryId }, image)
      : !!store.addMenuDish(pageId, categoryId, details, image)
    if (!done) { setError(true); return }
    if (dish && selectedCategoryId !== dish.categoryId) useUiStore.getState().setActiveMenuCategoryId(selectedCategoryId)
    if (dish || (event.nativeEvent as SubmitEvent).submitter?.getAttribute('data-add-another') !== 'true') {
      onClose()
      return
    }
    setName('')
    setPrice('')
    setDescription('')
    setImage(undefined)
    setVisible(true)
    setRecommended(false)
    setSubmitted(false)
    setError(false)
    setAdded(true)
    requestAnimationFrame(() => nameRef.current?.focus())
  }

  function remove() {
    if (!dish) return
    useContentStore.getState().removeMenuDish(dish.id)
    onClose()
  }

  return <PublishModalFrame open onOpenChange={(open) => { if (!open) onClose() }}
    title={<><UtensilsCrossed className="size-4 text-primary" />{deleting ? tf('deleteTitle') : dish ? tf('editTitle') : tf('createTitle')}</>}
    description={deleting ? tf('deleteDescription') : tf('description', { category: categoryName })}
    footer={deleting ? <>
      <Button variant="outline" onClick={() => setDeleting(false)}>{t('pages.cancel')}</Button>
      <Button variant="destructive" onClick={remove}>{t('removeDish')}</Button>
    </> : <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
      {dish && <Button variant="ghost" size="icon" className="text-destructive" aria-label={t('removeDish')} onClick={() => setDeleting(true)}><Trash2 className="size-4" /></Button>}
      <Button variant="outline" className="min-w-0" onClick={onClose}>{t('pages.cancel')}</Button>
      <Button type="submit" form={formId} disabled={photoBusy} className="min-w-0 sm:order-3">{dish ? t('pages.save') : t('pages.create')}</Button>
      {!dish && <Button type="submit" form={formId} disabled={photoBusy} variant="secondary" data-add-another="true" className="col-span-2 sm:order-2"><Plus className="size-4" />{tf('saveAndAnother')}</Button>}
    </div>}>
    {deleting ? <p className="rounded-xl border bg-muted/30 p-4 text-sm font-medium">{dish?.name}</p> : <form id={formId} onSubmit={save} className="min-w-0 space-y-5">
      {added && <p role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">{tf('added')}</p>}
      <label className="block space-y-2 text-sm font-medium">
        {t('dishName')}
        <Input ref={nameRef} autoFocus value={name} maxLength={MENU_LIMITS.name} placeholder={tf('namePlaceholder')} aria-invalid={nameError}
          onChange={(event) => { setName(event.target.value); setAdded(false) }} />
        {nameError && <span role="alert" className="text-xs font-normal text-destructive">{tf('nameRequired')}</span>}
      </label>
      <label className="block space-y-2 text-sm font-medium">
        {t('price')}
        <Input value={price} inputMode="decimal" maxLength={12} placeholder="0.00" aria-invalid={priceError}
          onChange={(event) => setPrice(event.target.value)} />
        {priceError && <span role="alert" className="text-xs font-normal text-destructive">{t('invalidPrice')}</span>}
      </label>
      <label className="flex items-start gap-3 rounded-xl border bg-muted/20 px-4 py-3 text-sm">
        <input type="checkbox" checked={recommended} onChange={(event) => setRecommended(event.target.checked)} className="mt-0.5 size-4 accent-primary" />
        <span><span className="block font-medium">{tf('recommend')}</span><span className="mt-0.5 block text-xs text-muted-foreground">{tf('recommendHint')}</span></span>
      </label>
      <div className="space-y-2 text-sm">
        <p>{t('photo')}</p>
        <MediaPickerModal ownerId={ownerId} onSelectImage={(url, thumbUrl) => {
          const source = { slotId: 'menu.dish.photo' as const, src: url, blurDataUrl: thumbUrl }
          setImage((current) => current ? replaceImageValueAsset(current, source) : createImageValue(source))
        }} />
        <ImagePicker slotId="menu.dish.photo" value={image ?? { asset: { src: '', width: 0, height: 0 } }} dense
          onChange={(next) => setImage(next.asset.src ? next : undefined)} onOpenMediaPicker={() => useUiStore.getState().openMediaPicker(ownerId)} />
        {image?.asset.src && <MenuPhotoEnhancement key={projectId + ':' + image.asset.src} sourceUrl={image.asset.src} onBusyChange={setPhotoBusy}
          onApply={(url, thumbUrl) => setImage((current) => current?.asset.src === image.asset.src
            ? replaceImageValueAsset(current, { slotId: 'menu.dish.photo', src: url, blurDataUrl: thumbUrl }) : current)} />}
      </div>
      <details className="group rounded-xl border bg-muted/20 px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium">{tf('additional')}</summary>
        <div className="mt-5 space-y-5">
          <label className="block space-y-2 text-sm">{t('ingredients')}
            <Textarea value={description} maxLength={MENU_LIMITS.description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          {dish && <label className="block space-y-2 text-sm">{t('category')}
            <select className={selectClass} value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.target.value)}>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name || t('newCategory')}</option>)}
            </select>
          </label>}
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} className="size-4 accent-primary" />
            {tf('showInMenu')}
          </label>
        </div>
      </details>
      {error && <p role="alert" className="text-sm text-destructive">{tf('saveError')}</p>}
    </form>}
  </PublishModalFrame>
}
