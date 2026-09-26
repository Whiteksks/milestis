'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { FilePlus2, Globe, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PublishModalFrame } from '@/editor/components/modals/publish-modal-frame'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { ImagePicker } from '@/editor/image/editor/image-picker'
import { createImageValue, replaceImageValueAsset } from '@/editor/image/editor/create-image-value'
import type { ImageValue } from '@/editor/image/data'
import { useContentStore } from '@/editor/lib/store/content'
import { useUiStore } from '@/editor/lib/store/ui'
import type { MenuPage } from './content-types'
import { isPagePath, PAGE_LIMITS } from '../../../../functions/src/domain/pages'
import { MenuPageError, nextMenuPagePath, suggestMenuPagePath } from '../../../../functions/src/domain/menu/page-commands'

export function MenuPageDialog({ page, onClose, onSelect }: {
  page?: MenuPage
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const t = useTranslations('editor.menu.pages')
  const fieldId = useId()
  const ownerId = useId()
  const homePageId = useContentStore((s) => s.menuContent.homePageId)
  const storedBackground = useContentStore((s) => page ? s.menuImages.pageBackgrounds[page.id] : undefined)
  const isHome = page?.id === homePageId
  const formId = useId()
  const [name, setName] = useState(page ? page.name || t(isHome ? 'home' : 'untitled') : '')
  const [path, setPath] = useState(page?.path ?? nextMenuPagePath(useContentStore.getState().menuContent))
  const [pathTouched, setPathTouched] = useState(false)
  const [makeHome, setMakeHome] = useState(false)
  const [background, setBackground] = useState<ImageValue | undefined>(storedBackground)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const publishedSlug = useUiStore((s) => s.publishedSlug)

  function report(cause: unknown) {
    setError(t(`errors.${cause instanceof MenuPageError ? cause.code : 'UNKNOWN'}`))
  }

  function save(event: React.FormEvent) {
    event.preventDefault()
    try {
      const store = useContentStore.getState()
      if (page) {
        store.updateMenuPage(page.id, { name, path, makeHome }, background ?? null)
        onSelect(page.id)
      } else {
        onSelect(store.addMenuPage(name, path, background))
      }
      onClose()
    } catch (cause) { report(cause) }
  }

  function remove() {
    if (!page) return
    try {
      useContentStore.getState().removeMenuPage(page.id)
      onSelect(useContentStore.getState().menuContent.homePageId)
      onClose()
    } catch (cause) { report(cause) }
  }

  return <PublishModalFrame open onOpenChange={(open) => { if (!open) onClose() }}
    title={<><FilePlus2 className="size-4 text-primary" />{t(deleting ? 'deleteTitle' : page ? 'settings' : 'add')}</>}
    description={t(deleting ? 'deleteDescription' : 'description')}
    footer={deleting ? <>
      <Button variant="outline" onClick={() => { setDeleting(false); setError(null) }}>{t('cancel')}</Button>
      <Button variant="destructive" onClick={remove}>{t('delete')}</Button>
    </> : <>
      {page && <Button type="button" variant="ghost" size="icon" className="sm:mr-auto text-destructive" disabled={isHome}
        title={t(isHome ? 'deleteHomeHint' : 'delete')} aria-label={t('delete')} onClick={() => { setError(null); setDeleting(true) }}><Trash2 className="size-4" /></Button>}
      <Button type="button" variant="outline" onClick={onClose}>{t('cancel')}</Button>
      <Button type="submit" form={formId} disabled={!name.trim()}>{t(page ? 'save' : 'create')}</Button>
    </>}>
    {deleting ? <div className="space-y-3">
      <p className="rounded-xl border bg-muted/20 p-4 text-sm font-medium">{page?.name || t('untitled')}</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div> : <form id={formId} className="min-w-0 space-y-5" onSubmit={save}>
      <label className="block space-y-2 text-sm font-medium">
        {t('name')}
        <Input autoFocus value={name} maxLength={PAGE_LIMITS.name} required placeholder={t('namePlaceholder')}
          className="h-12 rounded-xl" onChange={(event) => {
            const next = event.target.value
            setName(next)
            if (!page && !pathTouched) setPath(suggestMenuPagePath(useContentStore.getState().menuContent, next))
            setError(null)
          }} />
      </label>
      <div className="space-y-2">
        <label htmlFor={`${fieldId}-path`} className="block text-sm font-medium">{t('path')}</label>
        <div className="flex min-w-0 items-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5">
          <span className="border-r bg-muted/40 px-3 py-3 text-xs text-muted-foreground"><Globe className="size-4" /></span>
          <Input id={`${fieldId}-path`} value={path} maxLength={PAGE_LIMITS.path} readOnly={isHome} spellCheck={false} autoCapitalize="none" autoCorrect="off"
            className="h-12 min-w-0 border-0 bg-transparent px-3 font-mono text-sm shadow-none focus-visible:ring-0" aria-invalid={pathTouched && !isPagePath(path)}
            aria-describedby={`${fieldId}-path-hint`} onChange={(event) => { setPath(event.target.value); setPathTouched(true); setError(null) }} placeholder="/drinks" />
        </div>
        <p id={`${fieldId}-path-hint`} className="text-xs text-muted-foreground">{t(isHome ? 'homePathHint' : 'pathHint')}</p>
        {pathTouched && !isPagePath(path) && <p role="alert" className="text-xs text-destructive">{t('errors.INVALID_PATH')}</p>}
      </div>
      <div className="space-y-2 rounded-2xl border bg-muted/20 p-4">
        <div><p className="text-sm font-medium">{t('background')}</p><p className="mt-1 text-xs text-muted-foreground">{t('backgroundHint')}</p></div>
        <MediaPickerModal ownerId={ownerId} onSelectImage={(url, thumbUrl) => {
          const source = { slotId: 'menu.page.background' as const, src: url, blurDataUrl: thumbUrl }
          setBackground((current) => current ? replaceImageValueAsset(current, source) : createImageValue(source))
        }} />
        <ImagePicker slotId="menu.page.background" value={background ?? { asset: { src: '', width: 0, height: 0 } }} dense
          onChange={(next) => setBackground(next.asset.src ? next : undefined)} onOpenMediaPicker={() => useUiStore.getState().openMediaPicker(ownerId)} />
      </div>
      <div className="rounded-2xl border bg-muted/20 px-4 py-3">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{t('addressPreview')}</p>
        <p className="break-all font-mono text-sm">{publishedSlug ? `https://${publishedSlug}.milestis.site${makeHome ? '/' : path}` : path}</p>
      </div>
      {page && !isHome && <label className="flex items-start gap-3 rounded-2xl border p-4 text-sm">
        <input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={makeHome} onChange={(event) => setMakeHome(event.target.checked)} />
        <span className="space-y-1"><span className="block font-medium">{t('makeHome')}</span>
          <span className="block break-words text-xs text-muted-foreground">{t('makeHomeHint', { path })}</span></span>
      </label>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {isHome && <p className="text-xs text-muted-foreground">{t('deleteHomeHint')}</p>}
    </form>}
  </PublishModalFrame>
}
