'use client'

import { useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import QRCodeSVG from 'react-qr-code'
import { Globe, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/editor/lib/store/ui'
import { saveProject } from '@/lib/projects/save-project'
import { getPublishedMenuLinks, publishMenu } from '@/lib/projects/publish-menu-api'
import { PublishProjectError } from '@/lib/projects/publish-project-api'
import { normalizeSlug } from '@/lib/slug'
import { buildPublishedMenuPageUrl } from '@/lib/slug/url'
import { useUserStore } from '@/hooks/useUserStore'
import { projectKeys } from '@/hooks/useProjectsQuery'
import { usePublishSlug } from '@/hooks/usePublishSlug'
import { PublishModalFrame } from './publish-modal-frame'
import { PublishForm } from './publish-slug-form'
import { PublishSuccessPane } from './publish-success'
import type { PublishModalProps } from './publish-modal.types'

export function MenuPublishFlow({ projectId, initialSlug, onOpenChange }: PublishModalProps) {
  const t = useTranslations('editor.menu.publish')
  const common = useTranslations('editor.modal.publish')
  const pagesT = useTranslations('editor.menu.pages')
  const locale = useLocale()
  const activePageId = useUiStore((state) => state.activeMenuPageId)
  const queryClient = useQueryClient()
  const uid = useUserStore((state) => state.profile?.uid)
  const publishedSlug = useUiStore((state) => state.projectId === projectId ? state.publishedSlug : null)
  const isPublished = useUiStore((state) => state.projectId === projectId && state.isPublished)
  const data = usePublishSlug(projectId, 'menu', publishedSlug ?? normalizeSlug(initialSlug ?? ''), !!publishedSlug)
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const publishedPagesKey = ['published-menu-pages', uid, projectId] as const
  const publishedPages = useQuery({
    queryKey: publishedPagesKey,
    queryFn: () => getPublishedMenuLinks(projectId),
    enabled: !!uid && isPublished,
    // Another editor tab may have renamed or removed a published page.
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  })
  const pages = publishedPages.data ?? []
  const selectedPage = pages.find((page) => page.id === (selectedPageId ?? activePageId))
    ?? pages.find((page) => page.path === '/')
  const url = buildPublishedMenuPageUrl(publishedSlug || data.slug, selectedPage?.path ?? '/')

  async function submit() {
    if (pending.current || data.slugStatus !== 'available') return
    pending.current = true
    setBusy(true)
    setError(null)
    try {
      await saveProject(projectId)
      if (useUiStore.getState().projectId !== projectId || useUiStore.getState().isDirty) throw new PublishProjectError('DRAFT_CHANGED', 'Draft changed')
      const result = await publishMenu(projectId, data.slug, locale)
      await queryClient.cancelQueries({ queryKey: publishedPagesKey })
      queryClient.setQueryData(publishedPagesKey, result.publishedPages)
      // A request can finish after navigation. Never mark a different project published.
      if (useUiStore.getState().projectId === projectId) {
        useUiStore.getState().setPublishedInfo(result.publishedSlug)
        useUiStore.getState().setIsPublished(true)
      }
      if (uid) void queryClient.invalidateQueries({ queryKey: projectKeys.active(uid) })
      setSuccess(true)
    } catch (cause) {
      const code = cause instanceof PublishProjectError ? cause.code : 'UNKNOWN'
      setError(t.has(`errors.${code}`) ? t(`errors.${code}`) : t('errors.UNKNOWN'))
    } finally { pending.current = false; setBusy(false) }
  }

  const qr = publishedPages.isFetching ? <p role="status" className="text-sm text-muted-foreground">{t('loadingPages')}</p>
    : publishedPages.isError ? <div role="alert" className="space-y-2 text-sm">
      <p>{t('pagesError')}</p><Button variant="outline" onClick={() => void publishedPages.refetch()}>{t('retry')}</Button>
    </div> : selectedPage ? <div className="space-y-4">
      {pages.length > 1 && <label className="flex flex-col gap-2 text-sm">
        {t('sharePage')}
        <select value={selectedPage.id} onChange={(event) => setSelectedPageId(event.target.value)} className="w-full min-w-0 rounded-md border bg-background p-2 text-foreground">
          {pages.map((page) => <option key={page.id} value={page.id}>{page.name || pagesT(page.path === '/' ? 'home' : 'untitled')} · {page.path}</option>)}
        </select>
      </label>}
      <MenuQrCode key={url} url={url} slug={publishedSlug ?? data.slug} path={selectedPage.path} />
    </div> : null
  return <PublishModalFrame open onOpenChange={onOpenChange} success={success} busy={busy}
    title={<><Globe className="size-4 text-primary" />{success ? t('success') : isPublished ? t('updateTitle') : t('title')}</>}
    description={t('description')}
    footer={<>
      <Button variant="outline" disabled={busy} onClick={() => onOpenChange(false)}>{common(success ? 'success.done' : 'actions.cancel')}</Button>
      {!success && <Button disabled={busy || data.slugStatus !== 'available'} onClick={() => void submit()}>
        {busy && <Loader2 className="mr-2 size-4 animate-spin" />}{busy ? t('publishing') : isPublished ? t('update') : t('publish')}
      </Button>}
    </>}>
    {success ? <PublishSuccessPane siteUrl={url} title={t('success')} description={t('saved')} shareMessage={t('open')}>{qr}</PublishSuccessPane> : <>
      <PublishForm mode="menu" data={data} disabled={busy || !!publishedSlug} notice={t('permanent')} hint={publishedSlug ? t('fixedAddress') : undefined} />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {isPublished && publishedSlug && qr}
    </>}
  </PublishModalFrame>
}

function MenuQrCode({ url, slug, path }: { url: string; slug: string; path: string }) {
  const t = useTranslations('editor.menu.publish')
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  function download() {
    const svg = ref.current?.querySelector('svg')
    if (!svg) return
    const outer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    outer.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    outer.setAttribute('viewBox', '0 0 280 280')
    outer.setAttribute('width', '280')
    outer.setAttribute('height', '280')
    const background = document.createElementNS(outer.namespaceURI, 'rect')
    background.setAttribute('width', '280')
    background.setAttribute('height', '280')
    background.setAttribute('fill', '#fff')
    const code = svg.cloneNode(true) as SVGSVGElement
    code.removeAttribute('class')
    code.setAttribute('x', '40')
    code.setAttribute('y', '40')
    outer.append(background, code)
    const objectUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(outer)], { type: 'image/svg+xml' }))
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `menu-${slug}${path === '/' ? '' : `-${path.slice(1)}`}-qr.svg`
    link.click()
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
  return <div className="flex min-w-0 flex-col items-center gap-3 border-t pt-4">
    <div ref={ref} className="max-w-full rounded-xl bg-white p-10"><QRCodeSVG value={url} size={200} level="M" title={t('qr')} className="h-auto max-w-full" /></div>
    <p className="max-w-full break-all text-center text-xs text-muted-foreground select-all">{url}</p>
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="outline" onClick={async () => {
        try { await navigator.clipboard.writeText(url); setCopied(true); setCopyError(false) } catch { setCopyError(true) }
      }}>{copied ? t('copied') : t('copy')}</Button>
      <Button variant="outline" onClick={download}>{t('download')}</Button>
      <Button variant="outline" asChild><a href={url} target="_blank" rel="noopener noreferrer">{t('open')}</a></Button>
    </div>
    {copyError && <p role="alert" className="text-xs text-destructive">{t('errors.COPY_FAILED')}</p>}
  </div>
}
