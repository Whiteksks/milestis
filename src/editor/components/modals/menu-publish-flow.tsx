'use client'

import { useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import QRCodeSVG from 'react-qr-code'
import { CheckCircle2, Copy, Download, ExternalLink, Globe, Info, Loader2, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/editor/lib/store/ui'
import { saveProject } from '@/lib/projects/save-project'
import { getPublishedMenuLinks, publishMenu } from '@/lib/projects/publish-menu-api'
import { PublishProjectError } from '@/lib/projects/publish-project-api'
import { normalizeSlug } from '@/lib/slug'
import { buildPublishedMenuPageUrl } from '@/lib/slug/url'
import { useUserStore } from '@/hooks/useUserStore'
import { cachePublishedProject } from '@/lib/projects/published-project-cache'
import { usePublishSlug } from '@/hooks/usePublishSlug'
import { PublishModalFrame } from './publish-modal-frame'
import { PublishForm } from './publish-slug-form'
import type { PublishModalProps } from './publish-modal.types'
import { getMenuBillingStatus, reviewMenuPayment, changeMenuAutoRenew, type MenuBillingReview } from '@/lib/projects/menu-billing-api'
import { MenuBillingReviewPanel, MenuBillingStatusPanel } from './menu-billing-panel'
import type { MenuPlanId } from '../../../../functions/src/projects/menu/billing/model'

export function MenuPublishFlow({ projectId, initialSlug, onOpenChange, menuView = 'publish' }: PublishModalProps) {
  const t = useTranslations('editor.menu.publish')
  const common = useTranslations('editor.modal.publish')
  const pagesT = useTranslations('editor.menu.pages')
  const billingT = useTranslations('editor.menu.billing')
  const locale = useLocale()
  const queryClient = useQueryClient()
  const uid = useUserStore((state) => state.profile?.uid)
  const publishedSlug = useUiStore((state) => state.projectId === projectId ? state.publishedSlug : null)
  const isPublished = useUiStore((state) => state.projectId === projectId && state.isPublished)
  const data = usePublishSlug(projectId, 'menu', publishedSlug ?? normalizeSlug(initialSlug ?? ''), !!publishedSlug)
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState('/')
  const [qrOnly, setQrOnly] = useState(menuView === 'qr')
  const [review, setReview] = useState<MenuBillingReview | null>(null)
  const [accepted, setAccepted] = useState(false)
  const billingKey = ['menu-billing', uid, projectId] as const
  const billingStatus = useQuery({ queryKey: billingKey, queryFn: () => getMenuBillingStatus(projectId), enabled: !!uid, staleTime: 0, retry: false })
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
  const selectedPage = pages.find((page) => page.path === selectedPath)
    ?? pages.find((page) => page.path === '/')
  const url = buildPublishedMenuPageUrl(publishedSlug || data.slug, selectedPage?.path ?? '/')

  function showError(cause: unknown) {
    const code = cause instanceof PublishProjectError ? cause.code : 'UNKNOWN'
    setError(t.has(`errors.${code}`) ? t(`errors.${code}`) : t('errors.UNKNOWN'))
    if (['DRAFT_CHANGED', 'BILLING_STATE_CHANGED', 'INVALID_QUOTE', 'QUOTE_EXPIRED', 'INSUFFICIENT_CREDITS', 'BALANCE_INCONSISTENT'].includes(code)) { setReview(null); setAccepted(false) }
  }

  async function reviewPayment(planId?: MenuPlanId) {
    if (pending.current) return
    pending.current = true
    setBusy(true); setError(null); setReview(null); setAccepted(false)
    try {
      await saveProject(projectId)
      if (useUiStore.getState().projectId !== projectId || useUiStore.getState().isDirty) throw new PublishProjectError('DRAFT_CHANGED', 'Draft changed')
      setReview(await reviewMenuPayment(projectId, planId))
    } catch (cause) { showError(cause) }
    finally { pending.current = false; setBusy(false) }
  }

  async function autoRenew(enabled: boolean) {
    const current = billingStatus.data?.billing
    if (pending.current || !current) return
    pending.current = true; setBusy(true); setError(null); setReview(null); setAccepted(false)
    try {
      await changeMenuAutoRenew(projectId, enabled, current.revision)
      await billingStatus.refetch()
    } catch (cause) { showError(cause); void billingStatus.refetch() }
    finally { pending.current = false; setBusy(false) }
  }

  async function submit() {
    if (qrOnly || pending.current || data.slugStatus !== 'available' || !review || review.availableCredits < review.amount || (review.amount > 0 && !accepted)) return
    pending.current = true
    setBusy(true)
    setError(null)
    try {
      await saveProject(projectId)
      if (useUiStore.getState().projectId !== projectId || useUiStore.getState().isDirty) throw new PublishProjectError('DRAFT_CHANGED', 'Draft changed')
      const result = await publishMenu(projectId, data.slug, locale, review.quoteId)
      await queryClient.cancelQueries({ queryKey: publishedPagesKey })
      queryClient.setQueryData(publishedPagesKey, result.publishedPages)
      // A request can finish after navigation. Never mark a different project published.
      if (useUiStore.getState().projectId === projectId) {
        useUiStore.getState().setPublishedInfo(result.publishedSlug)
        useUiStore.getState().setIsPublished(true)
        useUiStore.getState().setProjectStatus('archived')
      }
      setSuccess(true)
      // A cache refresh cannot turn a confirmed payment into a failed publication.
      if (uid) void cachePublishedProject(queryClient, uid, projectId, result.publishedSlug).catch((cause) => console.warn('[menuPublish] Cache refresh failed', cause))
      void queryClient.invalidateQueries({ queryKey: billingKey })
      if (uid) void queryClient.invalidateQueries({ queryKey: ['billing', uid, 'transactions'] })
    } catch (cause) {
      showError(cause)
    } finally { pending.current = false; setBusy(false) }
  }

  const qr = publishedPages.isFetching ? <p role="status" className="text-sm text-muted-foreground">{t('loadingPages')}</p>
    : publishedPages.isError ? <div role="alert" className="space-y-2 text-sm">
      <p>{t('pagesError')}</p><Button variant="outline" onClick={() => void publishedPages.refetch()}>{t('retry')}</Button>
    </div> : selectedPage && isPublished && publishedSlug ? <div className="space-y-4">
      {pages.length > 1 && <label className="flex flex-col gap-2 text-sm">
        {t('sharePage')}
        <select value={selectedPage.path} onChange={(event) => setSelectedPath(event.target.value)} className="w-full min-w-0 rounded-xl border bg-background p-3 text-foreground">
          {[...pages].sort((a, b) => Number(b.path === '/') - Number(a.path === '/')).map((page) => <option key={page.id} value={page.path}>{page.path === '/' ? t('homeRecommended') : `${page.name || pagesT('untitled')} · ${page.path}`}</option>)}
        </select>
      </label>}
      <div className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${selectedPage.path === '/' ? 'bg-muted/30' : 'border-amber-500/30 bg-amber-500/5'}`}>
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>{t(selectedPage.path === '/' ? 'homeQrHint' : 'pageQrHint')}</p>
      </div>
      <MenuQrCode key={url} url={url} slug={publishedSlug} path={selectedPage.path} />
      <p className="text-xs text-muted-foreground">{t('availabilityHint')}</p>
    </div> : <p className="text-sm text-muted-foreground">{t('qrUnavailable')}</p>
  return <PublishModalFrame open onOpenChange={onOpenChange} busy={busy}
    title={<>{qrOnly ? <QrCode className="size-4 text-primary" /> : success ? <CheckCircle2 className="size-4 text-primary" /> : <Globe className="size-4 text-primary" />}{qrOnly ? t('qr') : success ? t('success') : isPublished ? t('updateTitle') : t('title')}</>}
    description={t(qrOnly ? 'qrDescription' : success ? 'saved' : 'description')}
    footer={<>
      <Button variant="outline" disabled={busy} onClick={() => onOpenChange(false)}>{common(success || qrOnly ? 'success.done' : 'actions.cancel')}</Button>
      {!success && !qrOnly && <Button disabled={busy || data.slugStatus !== 'available' || (!!review && (review.availableCredits < review.amount || (review.amount > 0 && !accepted)))} onClick={() => void (review ? submit() : reviewPayment())}>
        {busy && <Loader2 className="mr-2 size-4 animate-spin" />}{busy ? billingT('processing') : !review ? billingT('review') : review.amount > 0 ? billingT('pay', { amount: review.amount }) : isPublished ? t('update') : t('publish')}
      </Button>}
    </>}>
    {billingStatus.data?.billing && <MenuBillingStatusPanel billing={billingStatus.data.billing} busy={busy} onAutoRenew={(value) => void autoRenew(value)} />}
    {billingStatus.isError && <p role="alert" className="text-xs text-destructive">{billingT('statusError')} <button className="underline" onClick={() => void billingStatus.refetch()}>{t('retry')}</button></p>}
    {(success || qrOnly) && <Button variant="outline" disabled={busy} onClick={() => { setSuccess(false); setQrOnly(false); setReview(null) }}>{billingT('manage')}</Button>}
    {success || qrOnly ? qr : <>
      {publishedSlug ? <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
        <p className="text-xs font-medium text-muted-foreground">{t('fixedAddress')}</p>
        <p className="break-all font-mono text-sm select-all">{buildPublishedMenuPageUrl(publishedSlug, '/')}</p>
        <p className="text-sm">{t('updateHint')}</p>
      </div> : <PublishForm mode="menu" data={data} disabled={busy} notice={t('permanent')} />}
      {review && <MenuBillingReviewPanel review={review} busy={busy} accepted={accepted} onAccept={setAccepted} onPlan={(plan) => void reviewPayment(plan)} onRefresh={() => void reviewPayment(review.planId)} />}
      {busy && !review && <p role="status" className="text-sm text-muted-foreground">{billingT('processing')}</p>}
    </>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
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
  return <div className="flex min-w-0 flex-col items-center gap-3">
    <div ref={ref} className="max-w-full rounded-2xl border bg-white p-10"><QRCodeSVG value={url} size={200} level="M" title={t('qr')} className="h-auto max-w-full" /></div>
    <p className="max-w-full break-all text-center text-xs text-muted-foreground select-all">{url}</p>
    <div className="flex flex-wrap justify-center gap-2">
      <Button onClick={download}><Download className="size-4" />{t('download')}</Button>
      <Button variant="outline" onClick={async () => {
        try { await navigator.clipboard.writeText(url); setCopied(true); setCopyError(false) } catch { setCopyError(true) }
      }}><Copy className="size-4" />{copied ? t('copied') : t('copy')}</Button>
      <Button variant="outline" asChild><a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" />{t('open')}</a></Button>
    </div>
    {copyError && <p role="alert" className="text-xs text-destructive">{t('errors.COPY_FAILED')}</p>}
  </div>
}
