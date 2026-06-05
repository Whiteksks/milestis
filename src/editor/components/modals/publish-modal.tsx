'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { MobileDrawer } from '@/editor/components/editor/layout/mobile/mobile-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Globe,
  Lock,
  Loader2,
  Check,
  X,
  ExternalLink,
  Link2,
  ShieldCheck,
  Coins,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ImageIcon,
  RefreshCw,
} from 'lucide-react'
import { usePublishModal } from '@/hooks/usePublishModal'
import { usePublishMutation } from '@/hooks/useProjectMutations'
import { useUiSelector } from '@/editor/lib/store'
import { useIsMobile } from '@/hooks/use-mobile'
import { getSlugInputChrome } from '@/lib/slug'
import type { AnalyzeProjectResult } from '@/lib/projects/analyze-project-api'

interface PublishModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  mode: 'portfolio' | 'photobook'
}

export function PublishModal({ open, onOpenChange, projectId, mode }: PublishModalProps) {
  const t = useTranslations('editor.modal.publish')
  const { setIsPublished, setPublishedInfo } = useUiSelector((s) => ({
    setIsPublished: s.setIsPublished,
    setPublishedInfo: s.setPublishedInfo,
  }))

  const publishMutation = usePublishMutation()
  const modalData = usePublishModal(projectId, mode)
  const isMobile = useIsMobile()

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) modalData.reset()
    onOpenChange(nextOpen)
  }

  function handlePublish() {
    if (!modalData.canPublish || !modalData.quoteData) return
    publishMutation.mutate(
      {
        projectId,
        slug: modalData.slug,
        quoteId: modalData.quoteData.quoteId,
        accessToken: mode === 'photobook' ? modalData.accessToken : undefined,
      },
      {
        onSuccess: () => {
          setIsPublished(true)
          setPublishedInfo(modalData.slug, mode === 'photobook' ? modalData.accessToken : undefined)
          handleClose(false)
        },
      },
    )
  }

  const modeIcon = mode === 'portfolio'
    ? <Globe className="size-4 text-primary" />
    : <Lock className="size-4 text-primary" />

  const step1Title = mode === 'portfolio' ? t('title.portfolio') : t('title.photobook')
  const step1Description = mode === 'portfolio'
    ? t('description.portfolio')
    : t('description.photobook')

  if (isMobile) {
    const mobileFooter = modalData.step === 'slug' ? (
      <>
        <Button
          onClick={modalData.advanceToReview}
          disabled={!modalData.canProceedToReview}
          className="gap-2 w-full"
        >
          {modalData.isAnalyzing
            ? <><Loader2 className="size-3 animate-spin" /> {t('actions.checking')}</>
            : <>{t('actions.continue')} <ArrowRight className="size-3" /></>
          }
        </Button>
        <Button variant="ghost" onClick={() => handleClose(false)} className="w-full">
          {t('actions.cancel')}
        </Button>
      </>
    ) : (
      <>
        <Button
          onClick={handlePublish}
          disabled={!modalData.canPublish || publishMutation.isPending || modalData.isAnalyzing}
          className="gap-2 w-full"
        >
          {publishMutation.isPending
            ? <><Loader2 className="size-3 animate-spin" /> {t('actions.publishing')}</>
            : <><ExternalLink className="size-3" /> {t('actions.publish')}</>
          }
        </Button>
        <Button
          variant="ghost"
          onClick={modalData.analyzeError ? modalData.advanceToReview : modalData.goBack}
          disabled={publishMutation.isPending || modalData.isAnalyzing}
          className="gap-1.5 w-full"
        >
          {modalData.analyzeError
            ? <><RefreshCw className="size-3" /> {t('actions.tryAgain')}</>
            : <><ArrowLeft className="size-3" /> {t('actions.back')}</>
          }
        </Button>
      </>
    )

    return (
      <MobileDrawer
        open={open}
        onOpenChange={handleClose}
        title={<span className="flex items-center gap-2 text-base">{modeIcon}{modalData.step === 'slug' ? step1Title : t('title.review')}</span>}
        description={modalData.step === 'slug' ? step1Description : t('description.review')}
        showHeader
        footer={mobileFooter}
        bodyClassName="px-2 min-h-64"
      >
        {modalData.step === 'slug' ? (
          <PublishForm mode={mode} data={modalData} />
        ) : (
          <ReviewPane data={modalData} />
        )}
      </MobileDrawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl gap-4">
        <DialogHeader className="gap-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            {modeIcon}
            {modalData.step === 'slug' ? step1Title : t('title.review')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {modalData.step === 'slug'
              ? step1Description
              : t('description.reviewDesktop')}
          </DialogDescription>
        </DialogHeader>

        {modalData.step === 'slug' ? (
          <PublishForm mode={mode} data={modalData} />
        ) : (
          <ReviewPane data={modalData} />
        )}

        <DialogFooter className="gap-2">
          {modalData.step === 'slug' ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleClose(false)}>
                {t('actions.cancel')}
              </Button>
              <Button
                size="sm"
                onClick={modalData.advanceToReview}
                disabled={!modalData.canProceedToReview}
                className="gap-1.5"
              >
                {modalData.isAnalyzing
                  ? <><Loader2 className="size-3 animate-spin" /> {t('actions.checking')}</>
                  : <>{t('actions.continue')} <ArrowRight className="size-3" /></>
                }
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={modalData.analyzeError ? modalData.advanceToReview : modalData.goBack}
                disabled={publishMutation.isPending || modalData.isAnalyzing}
                className="gap-1.5"
              >
                {modalData.analyzeError
                  ? <><RefreshCw className="size-3" /> {t('actions.tryAgain')}</>
                  : <><ArrowLeft className="size-3" /> {t('actions.back')}</>
                }
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={!modalData.canPublish || publishMutation.isPending || modalData.isAnalyzing}
                className="gap-2"
              >
                {publishMutation.isPending
                  ? <><Loader2 className="size-3 animate-spin" /> {t('actions.publishing')}</>
                  : <><ExternalLink className="size-3" /> {t('actions.publish')}</>
                }
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Step 1: Slug form ────────────────────────────────────────────────────────

export function PublishForm({ mode, data }: { mode: 'portfolio' | 'photobook'; data: ReturnType<typeof usePublishModal> }) {
  const { slug, handleSlugChange, slugStatus } = data
  const maxLength = 24
  const chrome = getSlugInputChrome(mode)

  const t = useTranslations('editor.modal.publish')
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <Label htmlFor="slug" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] flex items-center gap-2">
            {mode === 'portfolio' ? <Globe className="size-3.5 text-primary/60" /> : <Link2 className="size-3.5 text-primary/60" />}
            {mode === 'portfolio' ? t('form.subdomainSettings') : t('form.linkIdentifier')}
          </Label>
          <span className={`text-[10px] font-mono font-medium ${slug.length >= maxLength ? 'text-destructive' : 'text-muted-foreground/40'}`}>
            {slug.length}<span className="opacity-50">/{maxLength}</span>
          </span>
        </div>

        <div className="group relative flex items-center rounded-2xl border border-border/50 bg-muted/5 shadow-sm focus-within:ring-[5px] focus-within:ring-primary/5 focus-within:border-primary/30 transition-all duration-300 overflow-hidden w-full">
          <div className="flex items-center px-4 h-13 bg-muted/30 border-r border-border/40 text-muted-foreground/70 text-sm font-medium select-none shrink-0 italic font-serif">
            {chrome.prefix}
          </div>
          <div className="relative flex-1 min-w-0 flex items-center bg-background/50">
            <Input
              id="slug"
              value={slug}
              onChange={(e) => e.target.value.length <= maxLength && handleSlugChange(e.target.value)}
              placeholder={mode === 'portfolio' ? t('form.placeholderPortfolio') : t('form.placeholderPhotobook')}
              className="h-13 border-0 bg-transparent px-4 text-base font-medium placeholder:text-muted-foreground/20 focus-visible:ring-0 w-full truncate"
              autoComplete="off"
              spellCheck={false}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 shrink-0 pl-2">
              <SlugStatusIcon status={slugStatus} />
            </div>
          </div>
          {chrome.suffix && (
            <div className="flex items-center px-4 h-13 bg-muted/30 border-l border-border/40 text-muted-foreground/70 text-sm font-medium select-none shrink-0 tracking-tight">
              {chrome.suffix}
            </div>
          )}
        </div>

        <div className="px-1 min-h-[20px]">
          <SlugStatusMessage status={slugStatus} mode={mode} />
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/[0.02] border border-primary/5 shadow-inner">
        <div className="p-1.5 rounded-lg bg-background border border-border/40">
          <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground/80 font-medium pt-0.5">
          {mode === 'photobook'
            ? t('form.privacyFirst')
            : t('form.globalAccess')
          }
        </p>
      </div>
    </div>
  )
}

// ─── Step 2: Review pane ──────────────────────────────────────────────────────

function ReviewPane({ data }: { data: ReturnType<typeof usePublishModal> }) {
  const { isAnalyzing, analyzeError, quoteData } = data

  if (isAnalyzing) return <ReviewSkeleton />
  if (analyzeError) return <ReviewError message={analyzeError} />
  if (!quoteData) return null

  return <ReviewContent quoteData={quoteData} />
}

function ReviewContent({ quoteData }: { quoteData: AnalyzeProjectResult }) {
  const insufficient = quoteData.userBalance < quoteData.creditCost
  const t = useTranslations('editor.modal.publish')

  return (
    <div className="space-y-3 py-2">
      {/* Summary rows */}
      <div className="rounded-2xl border border-border/50 overflow-hidden">
        <ReviewRow label={t('review.project')} value={quoteData.projectName} />
        <ReviewRow label={t('review.address')} value={quoteData.domain} mono />
        <ReviewRow
          label={t('review.photos')}
          value={quoteData.photoCount === 0 ? t('review.noPhotos') : t('review.uniquePhotos', { count: quoteData.photoCount })}
          icon={<ImageIcon className="size-3 text-muted-foreground/60" />}
        />
      </div>

      {/* Cost + balance */}
      <div className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 border text-xs font-medium ${insufficient ? 'border-destructive/30 bg-destructive/5' : 'border-border/50 bg-muted/30'}`}>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Coins className="size-3.5" />
          {t('review.cost')}
        </span>
        <div className="flex items-center gap-2">
          {insufficient && <AlertTriangle className="size-3 text-destructive" />}
          <span className={insufficient ? 'text-destructive' : 'text-foreground'}>
            {quoteData.creditCost} {t('review.credits')}
            <span className="text-muted-foreground/60 ml-1.5 font-normal">({t('review.balance', { balance: quoteData.userBalance })})</span>
          </span>
        </div>
      </div>

      {insufficient && (
        <p className="text-xs text-destructive px-1">
          {t('review.insufficient')}
        </p>
      )}

      {/* Terms */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/[0.02] border border-primary/5 shadow-inner">
        <div className="p-1.5 rounded-lg bg-background border border-border/40 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground/80 font-medium pt-0.5">
          {t('review.terms')}
        </p>
      </div>
    </div>
  )
}

function ReviewRow({ label, value, mono, icon }: { label: string; value: string; mono?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/40 last:border-b-0">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
        {icon}
        {label}
      </span>
      <span className={`text-xs font-medium text-foreground truncate max-w-[55%] text-right ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}

function ReviewSkeleton() {
  return (
    <div className="space-y-3 py-2 animate-pulse">
      <div className="rounded-2xl border border-border/50 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-3.5 py-3 border-b border-border/40 last:border-b-0">
            <div className="h-3 w-12 rounded bg-muted/70" />
            <div className={`h-3 rounded bg-muted/70 ${i === 1 ? 'w-40' : 'w-24'}`} />
          </div>
        ))}
      </div>
      <div className="h-10 rounded-xl bg-muted/40" />
      <div className="h-16 rounded-2xl bg-muted/20" />
    </div>
  )
}

function ReviewError({ message }: { message: string }) {
  const t = useTranslations('editor.modal.publish')
  return (
    <div className="py-8 flex flex-col items-center gap-3 text-center">
      <div className="p-2.5 rounded-xl bg-destructive/10">
        <AlertTriangle className="size-5 text-destructive" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{t('review.analysisFailed')}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{message}</p>
      </div>
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function SlugStatusIcon({ status }: { status: ReturnType<typeof usePublishModal>['slugStatus'] }) {
  if (status === 'checking') return <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
  if (status === 'available') return <Check className="size-3.5 text-emerald-500" />
  if (status === 'taken') return <X className="size-3.5 text-destructive" />
  if (status === 'invalid') return <X className="size-3.5 text-destructive" />
  if (status === 'reserved') return <X className="size-3.5 text-amber-500" />
  return null
}

function SlugStatusMessage({
  status,
  mode,
}: {
  status: ReturnType<typeof usePublishModal>['slugStatus']
  mode: 'portfolio' | 'photobook'
}) {
  const t = useTranslations('editor.modal.publish')
  if (status === 'taken')
    return <p className="text-xs text-destructive">{t('form.taken')}</p>
  if (status === 'invalid')
    return <p className="text-xs text-destructive">{t('form.invalid')}</p>
  if (status === 'reserved')
    return <p className="text-xs text-amber-600 dark:text-amber-400">{t('form.reserved')}</p>
  if (status === 'available' && mode === 'portfolio')
    return <p className="text-xs text-emerald-600 dark:text-emerald-400">{t('form.available')}</p>
  return null
}
