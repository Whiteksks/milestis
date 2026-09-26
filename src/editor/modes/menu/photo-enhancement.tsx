'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase'
import { useUiStore } from '@/editor/lib/store/ui'
import { useProjectImages } from '@/editor/hooks/use-project-images'
import { enqueueImageUpload } from '@/editor/lib/store/uploads'
import { waitForProjectImage } from '@/editor/image/editor/wait-for-image'
import { FOOD_PHOTO_STYLES, type FoodPhotoStyle } from '@/lib/ai/menu/photo-styles'

const STYLE_SWATCHES: Record<FoodPhotoStyle, string> = {
  eveningWood: 'bg-gradient-to-br from-amber-700 via-stone-800 to-stone-950',
  daylightCeramic: 'bg-gradient-to-br from-white via-orange-50 to-stone-300',
  darkSlate: 'bg-gradient-to-br from-slate-500 via-zinc-800 to-zinc-950',
}

export function MenuPhotoEnhancement({ sourceUrl, onApply, onBusyChange }: {
  sourceUrl: string
  onApply: (url: string, thumbUrl?: string) => void
  onBusyChange: (busy: boolean) => void
}) {
  const t = useTranslations('editor.menu.photoEnhancement')
  const styleGroupId = useId()
  const [style, setStyle] = useState<FoodPhotoStyle>('eveningWood')
  const projectId = useUiStore((state) => state.projectId)
  const images = useProjectImages()
  const photo = images.find((entry) => Object.values(entry.urls).includes(sourceUrl))
  const [preview, setPreview] = useState<{ url: string; blob: Blob } | null>(null)
  const [status, setStatus] = useState<'idle' | 'generating' | 'saving'>('idle')
  const [error, setError] = useState('')
  const request = useRef<AbortController | null>(null)
  const previewUrl = useRef<string | null>(null)
  const uploadId = useRef<string | null>(null)
  const busy = status !== 'idle'

  useEffect(() => {
    onBusyChange(busy)
    return () => onBusyChange(false)
  }, [busy, onBusyChange])

  useEffect(() => () => {
    request.current?.abort()
    request.current = null
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
  }, [projectId, sourceUrl])

  function errorMessage(cause: unknown, saving = false) {
    const code = cause instanceof Error ? cause.message : ''
    if (code === 'AI_NOT_CONFIGURED') return t('notConfigured')
    if (code === 'AI_RATE_LIMIT') return t('rateLimit')
    if (code === 'UNAUTHENTICATED' || code === 'INVALID_SESSION') return t('signIn')
    if (code === 'storageLimit') return t('storageLimit')
    if (code === 'IMAGE_PROCESSING_TIMEOUT') return t('processingTimeout')
    if (code === 'AI_TIMEOUT' || (cause instanceof Error && cause.name === 'TimeoutError')) return t('timeout')
    return t(saving ? 'saveError' : 'error')
  }

  function discard() {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    previewUrl.current = null
    uploadId.current = null
    setPreview(null)
    setError('')
  }

  async function generate() {
    if (!projectId || !photo || request.current) return
    const controller = new AbortController()
    request.current = controller
    setStatus('generating')
    setError('')
    try {
      const response = await fetch('/api/ai/enhance-photo', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(180_000)]),
        body: JSON.stringify({ projectId, photoId: photo.id, style }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? 'AI_REQUEST_FAILED')
      }
      const blob = await response.blob()
      if (blob.type !== 'image/webp' || !blob.size) throw new Error('AI_INVALID_RESPONSE')
      if (request.current !== controller || controller.signal.aborted) return
      const url = URL.createObjectURL(blob)
      previewUrl.current = url
      setPreview({ url, blob })
    } catch (cause) {
      if (request.current === controller && !controller.signal.aborted) setError(errorMessage(cause))
    } finally {
      if (request.current === controller) { request.current = null; setStatus('idle') }
    }
  }

  async function apply() {
    const uid = auth.currentUser?.uid
    if (!projectId || !preview || request.current) return
    if (!uid || photo?.ownerId !== uid) { setError(t('signIn')); return }
    const controller = new AbortController()
    request.current = controller
    setStatus('saving')
    setError('')
    try {
      // Retry saving the same result without paying for another generation.
      uploadId.current ??= enqueueImageUpload(new File([preview.blob], 'dish-enhanced.webp', { type: 'image/webp' }), uid, projectId)
      const saved = await waitForProjectImage(uploadId.current, projectId, uid, controller.signal)
      if (request.current !== controller || controller.signal.aborted || auth.currentUser?.uid !== uid || useUiStore.getState().projectId !== projectId) return
      onApply(saved.urls.full!, saved.urls.thumb)
      discard()
    } catch (cause) {
      if (request.current === controller && !controller.signal.aborted) {
        const code = cause instanceof Error ? cause.message : ''
        if (['uploadFailed', 'processingFailed', 'storageLimit', 'tooManyPixels'].includes(code)) uploadId.current = null
        setError(errorMessage(cause, true))
      }
    } finally {
      if (request.current === controller) { request.current = null; setStatus('idle') }
    }
  }

  return <div className="space-y-3 rounded-xl border bg-muted/20 p-3">
    <fieldset disabled={busy} aria-describedby={`${styleGroupId}-description`}>
      <legend className="mb-2 text-sm font-medium">{t('styleLabel')}</legend>
      <div className="grid grid-cols-3 gap-2">
        {FOOD_PHOTO_STYLES.map((option) => <label key={option} className="min-w-0 cursor-pointer has-disabled:cursor-wait">
          <input type="radio" name={styleGroupId} value={option} checked={style === option} className="peer sr-only" onChange={() => {
            if (request.current || style === option) return
            discard()
            setStyle(option)
          }} />
          <span className="flex h-full flex-col items-center gap-2 rounded-lg border bg-background px-2 py-3 text-center text-xs peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:opacity-50">
            <span aria-hidden="true" className={`h-5 w-10 rounded-full border border-black/10 ${STYLE_SWATCHES[option]}`} />
            <span>{t(`styles.${option}.name`)}</span>
          </span>
        </label>)}
      </div>
      <p id={`${styleGroupId}-description`} className="mt-2 text-xs text-muted-foreground">{t(`styles.${style}.description`)}</p>
    </fieldset>
    {!preview ? <>
      <Button type="button" variant="outline" className="w-full" disabled={busy || !photo || !projectId} onClick={generate}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {status === 'generating' ? t('generating') : t('button')}
      </Button>
      <p className="text-xs text-muted-foreground">{t('hint')}</p>
    </> : <>
      <div className="grid grid-cols-2 gap-2">
        {[{ url: sourceUrl, label: t('before') }, { url: preview.url, label: t('after') }].map(({ url, label }) => <figure key={label} className="min-w-0">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image src={url} alt={label} fill unoptimized sizes="(max-width: 640px) 42vw, 240px" className="object-contain" />
          </div>
          <figcaption className="mt-1 text-center text-xs text-muted-foreground">{label}</figcaption>
        </figure>)}
      </div>
      <p className="text-xs text-muted-foreground">{t('review')}</p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" disabled={busy} onClick={discard}>{t('discard')}</Button>
        <Button type="button" className="flex-1" disabled={busy} onClick={apply}>
          {status === 'saving' && <Loader2 className="size-4 animate-spin" />}{status === 'saving' ? t('saving') : t('apply')}
        </Button>
      </div>
    </>}
    {status === 'generating' && <button type="button" className="text-xs underline" onClick={() => request.current?.abort()}>{t('cancel')}</button>}
    <span className="sr-only" role="status" aria-live="polite">{status === 'generating' ? t('generating') : status === 'saving' ? t('saving') : ''}</span>
    {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
  </div>
}
