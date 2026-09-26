'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Layers3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PublishModalFrame } from '@/editor/components/modals/publish-modal-frame'
import { useContentStore } from '@/editor/lib/store/content'
import { useUiStore } from '@/editor/lib/store/ui'
import { MENU_LIMITS } from './content-types'

export function MenuCategoryDialog({ pageId, onClose }: { pageId: string; onClose: () => void }) {
  const t = useTranslations('editor.menu')
  const formId = useId()
  const [name, setName] = useState('')
  const [error, setError] = useState(false)

  function save(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    const id = useContentStore.getState().addMenuCategory(pageId, name)
    if (!id) { setError(true); return }
    useUiStore.getState().setActiveMenuCategoryId(id)
    onClose()
  }

  return <PublishModalFrame open onOpenChange={(open) => { if (!open) onClose() }}
    title={<><Layers3 className="size-4 text-primary" />{t('categoryForm.title')}</>}
    description={t('categoryForm.description')}
    footer={<>
      <Button variant="outline" onClick={onClose}>{t('pages.cancel')}</Button>
      <Button type="submit" form={formId} disabled={!name.trim()}>{t('pages.create')}</Button>
    </>}>
    <form id={formId} onSubmit={save} className="min-w-0 space-y-4">
      <label className="block space-y-2 text-sm font-medium">{t('categoryName')}
        <Input autoFocus value={name} maxLength={MENU_LIMITS.name} placeholder={t('categoryForm.placeholder')}
          onChange={(event) => { setName(event.target.value); setError(false) }} />
      </label>
      {error && <p role="alert" className="text-sm text-destructive">{t('categoryForm.error')}</p>}
    </form>
  </PublishModalFrame>
}
