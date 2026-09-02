'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useTranslations, useLocale } from 'next-intl'
import { MobileDrawer } from '@/editor/components/editor/layout/mobile/mobile-drawer'
import { Button } from '@/components/ui/button'
import {
  Globe,
  Lock,
  Loader2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  Gift,
  Mail,
} from 'lucide-react'
import { FaWhatsapp, FaTelegram } from 'react-icons/fa6'
import { usePublishModal } from '@/hooks/usePublishModal'
import { usePublishMutation, useRepublishMutation } from '@/hooks/useProjectMutations'
import { useUiSelector } from '@/editor/lib/store'
import { useIsMobile } from '@/hooks/use-mobile'
import { useUserStore, selectSubscription } from '@/hooks/useUserStore'
import { getEffectiveSubscriptionFeatures } from '@/lib/billing/billing.utils'
import { ReferralModal } from '@/components/layout/dashboard/referral'
import { PublishForm } from './publish-slug-form'
import { ReviewPane } from './publish-review'

interface PublishModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  mode: 'portfolio' | 'photobook' | 'event'
  /** Pre-fill the slug field and skip straight to review (used after payment return). */
  initialSlug?: string
  initialAccessToken?: string
  autoAdvance?: boolean
  /** When true, runs the republish flow (analyzeRepublish → republishProject). */
  republishMode?: boolean
}

export function PublishModal({ open, onOpenChange, projectId, mode, initialSlug, initialAccessToken, autoAdvance, republishMode }: PublishModalProps) {
  const t = useTranslations('editor.modal.publish')
  const { setIsPublished, setPublishedInfo } = useUiSelector((s) => ({
    setIsPublished: s.setIsPublished,
    setPublishedInfo: s.setPublishedInfo,
  }))

  const subscription = useUserStore(selectSubscription)
  const ratePerDollar = getEffectiveSubscriptionFeatures(subscription).creditTopupRatePerDollar || 1
  const locale = useLocale()
  const [referralOpen, setReferralOpen] = useState(false)

  const publishMutation = usePublishMutation()
  const republishMutation = useRepublishMutation()
  const modalData = usePublishModal(projectId, mode, { initialSlug, initialAccessToken, ratePerDollar, republishMode })
  const isMobile = useIsMobile()
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Free republish — terms not required
  const isFreeRepublish = republishMode && (modalData.quoteData?.creditCost ?? 1) === 0
  const effectiveTermsAccepted = isFreeRepublish || termsAccepted

  // Derived: is the user short on credits in the review step?
  const insufficient =
    modalData.step === 'review' &&
    modalData.quoteData !== null &&
    !modalData.isAnalyzing &&
    modalData.quoteData.userBalance < modalData.quoteData.creditCost

  // Price for Pay & Publish button — minimum $10 purchase enforced.
  // Matches the minimum enforced in usePublishModal.initiateBuyAndPublish and buy-credits route.
  const deficit = Math.max(0, (modalData.quoteData?.creditCost ?? 0) - (modalData.quoteData?.userBalance ?? 0))
  const MIN_TOPUP_DOLLARS = 10
  const minTopupCredits = Math.ceil(MIN_TOPUP_DOLLARS * ratePerDollar)
  const topupCredits = Math.max(deficit, minTopupCredits)
  const priceDollars = (topupCredits / ratePerDollar).toFixed(2)

  // Auto-advance to review when returning from payment (afterTopup flow)
  // OR when republishMode opens — immediately run analyzeRepublish
  const { step: modalStep, canProceedToReview, advanceToReview } = modalData
  const hasAutoAdvanced = useRef(false)
  useEffect(() => {
    if (!open) {
      hasAutoAdvanced.current = false
      return
    }
    if (hasAutoAdvanced.current) return
    const shouldAdvance = autoAdvance || republishMode
    if (shouldAdvance && modalStep === 'slug' && canProceedToReview) {
      hasAutoAdvanced.current = true
      advanceToReview()
    }
  }, [open, autoAdvance, republishMode, modalStep, canProceedToReview, advanceToReview])

  // Re-analyze after Polar payment if balance was not yet updated when we first analyzed.
  // The Polar webhook may fire after the redirect back, so onSnapshot updates the store
  // later. We detect this by watching store balance — when it increases while showing
  // an insufficient state, re-run analysis to get the fresh server-side balance.
  const storeBalance = useUserStore((s) => s.profile?.balance?.total ?? 0)
  const lastSeenBalanceRef = useRef<number | null>(null)
  const hasReanalyzedRef = useRef(false)
  useEffect(() => {
    if (!autoAdvance) return
    if (!insufficient) {
      // Reset when no longer insufficient (e.g. modal closed or user has enough).
      lastSeenBalanceRef.current = null
      hasReanalyzedRef.current = false
      return
    }
    if (hasReanalyzedRef.current) return
    if (lastSeenBalanceRef.current === null) {
      // Record the balance at the time analysis first showed insufficient.
      lastSeenBalanceRef.current = storeBalance
      return
    }
    if (storeBalance > lastSeenBalanceRef.current) {
      // Balance increased — webhook has fired and Firestore updated. Re-analyze.
      hasReanalyzedRef.current = true
      void advanceToReview()
    }
  }, [autoAdvance, insufficient, storeBalance, advanceToReview])

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) { modalData.reset(); setTermsAccepted(false) }
    onOpenChange(nextOpen)
  }

  function handlePublish() {
    if (!modalData.canPublish || !modalData.quoteData) return
    publishMutation.mutate(
      {
        projectId,
        slug: modalData.slug,
        quoteId: modalData.quoteData.quoteId,
        accessToken: (mode === 'photobook' || mode === 'event') ? modalData.accessToken : undefined,
      },
      {
        onSuccess: () => {
          setIsPublished(true)
          setPublishedInfo(modalData.slug, (mode === 'photobook' || mode === 'event') ? modalData.accessToken : undefined)
          modalData.showSuccess()
        },
      },
    )
  }

  function handleRepublish() {
    if (!modalData.canPublish && !isFreeRepublish) return
    if (!modalData.quoteData) return
    republishMutation.mutate(
      { projectId, quoteId: modalData.quoteData.quoteId },
      { onSuccess: () => handleClose(false) },
    )
  }

  const onConfirm = republishMode ? handleRepublish : handlePublish
  const confirmMutation = republishMode ? republishMutation : publishMutation

  const modeIcon = mode === 'portfolio'
    ? <Globe className="size-4 text-primary" />
    : <Lock className="size-4 text-primary" />

  const step1Title = mode === 'portfolio' ? t('title.portfolio') : t('title.photobook')
  const step1Description = mode === 'portfolio'
    ? t('description.portfolio')
    : t('description.photobook')
  const reviewTitle = republishMode ? t('title.republish') : t('title.review')
  const reviewDescription = republishMode ? t('description.republish') : t('description.reviewDesktop')
  const siteUrl = modalData.portfolioUrl ?? modalData.photobookUrl ?? ''

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
    ) : modalData.step === 'review' ? (
      <>
        <ReviewPrimaryButton
            insufficient={insufficient}
            isFreeRepublish={isFreeRepublish}
            republishMode={republishMode}
            priceDollars={priceDollars}
            effectiveTermsAccepted={effectiveTermsAccepted}
            modalData={modalData}
            confirmMutation={confirmMutation}
            onConfirm={onConfirm}
            t={t}
            fullWidth
          />
        {!republishMode && (
        <Button
          variant="ghost"
          onClick={modalData.analyzeError ? modalData.advanceToReview : modalData.goBack}
          disabled={confirmMutation.isPending || modalData.isAnalyzing || modalData.isBuyingCredits}
          className="gap-1.5 w-full"
        >
          {modalData.analyzeError
            ? <><RefreshCw className="size-3" /> {t('actions.tryAgain')}</>
            : <><ArrowLeft className="size-3" /> {t('actions.back')}</>
          }
        </Button>
        )}
      </>
    ) : (
      <Button onClick={() => handleClose(false)} className="w-full">
        {t('success.done')}
      </Button>
    )

    return (
      <>
        <MobileDrawer
          open={open}
          onOpenChange={handleClose}
          title={<span className="flex items-center gap-2 text-base">{modeIcon}{modalData.step === 'slug' ? step1Title : modalData.step === 'review' ? reviewTitle : t('success.title')}</span>}
          description={modalData.step === 'slug' ? step1Description : modalData.step === 'review' ? t('description.review') : t('success.description')}
          showHeader={modalData.step !== 'success'}
          footer={mobileFooter}
          bodyClassName="px-2 min-h-64"
        >
          {modalData.step === 'slug' ? (
            <PublishForm mode={mode} data={modalData} />
          ) : modalData.step === 'review' ? (
            <ReviewPane data={modalData} termsAccepted={termsAccepted} onTermsChange={setTermsAccepted} republishMode={republishMode} />
          ) : (
            <PublishSuccessPane siteUrl={siteUrl} t={t} onInviteClick={() => setReferralOpen(true)} />
          )}
        </MobileDrawer>
        <ReferralModal open={referralOpen} onOpenChange={setReferralOpen} locale={locale} />
      </>
    )
  }

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl gap-4">
        <DialogHeader className={modalData.step === 'success' ? 'sr-only' : 'gap-1'}>
          <DialogTitle className="flex items-center gap-2 text-base">
            {modalData.step === 'success' ? t('success.title') : <>{modeIcon}{modalData.step === 'slug' ? step1Title : reviewTitle}</>}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {modalData.step === 'success'
              ? t('success.description')
              : modalData.step === 'slug'
                ? step1Description
                : reviewDescription}
          </DialogDescription>
        </DialogHeader>

        {modalData.step === 'slug' ? (
          <PublishForm mode={mode} data={modalData} />
        ) : modalData.step === 'review' ? (
          <ReviewPane data={modalData} termsAccepted={termsAccepted} onTermsChange={setTermsAccepted} republishMode={republishMode} />
        ) : (
          <PublishSuccessPane siteUrl={siteUrl} t={t} onInviteClick={() => setReferralOpen(true)} />
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
          ) : modalData.step === 'review' ? (
            <>
              {!republishMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={modalData.analyzeError ? modalData.advanceToReview : modalData.goBack}
                disabled={confirmMutation.isPending || modalData.isAnalyzing || modalData.isBuyingCredits}
                className="gap-1.5"
              >
                {modalData.analyzeError
                  ? <><RefreshCw className="size-3" /> {t('actions.tryAgain')}</>
                  : <><ArrowLeft className="size-3" /> {t('actions.back')}</>
                }
              </Button>
              )}
              <ReviewPrimaryButton
                insufficient={insufficient}
                isFreeRepublish={isFreeRepublish}
                republishMode={republishMode}
                priceDollars={priceDollars}
                effectiveTermsAccepted={effectiveTermsAccepted}
                modalData={modalData}
                confirmMutation={confirmMutation}
                onConfirm={onConfirm}
                t={t}
                size="sm"
              />
            </>
          ) : (
            <Button size="sm" onClick={() => handleClose(false)}>
              {t('success.done')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <ReferralModal open={referralOpen} onOpenChange={setReferralOpen} locale={locale} />
    </>
  )
}

// ─── Review primary action button ─────────────────────────────────────────────
// Renders either "Pay & Publish" (insufficient balance) or "Publish" (sufficient).
// Shared by both the mobile drawer and desktop dialog footers.

function ReviewPrimaryButton({
  insufficient,
  isFreeRepublish,
  republishMode,
  priceDollars,
  effectiveTermsAccepted,
  modalData,
  confirmMutation,
  onConfirm,
  t,
  fullWidth,
  size,
}: {
  insufficient: boolean
  isFreeRepublish?: boolean
  republishMode?: boolean
  priceDollars: string
  effectiveTermsAccepted: boolean
  modalData: ReturnType<typeof usePublishModal>
  confirmMutation: { isPending: boolean }
  onConfirm: () => void
  t: ReturnType<typeof useTranslations>
  fullWidth?: boolean
  size?: 'sm' | 'default'
}) {
  const cls = `gap-2${fullWidth ? ' w-full' : ''}`

  if (insufficient && !republishMode) {
    return (
      <Button
        size={size}
        onClick={modalData.initiateBuyAndPublish}
        disabled={modalData.isBuyingCredits || !effectiveTermsAccepted}
        className={cls}
      >
        {modalData.isBuyingCredits
          ? <><Loader2 className="size-3 animate-spin" /> {t('actions.checking')}</>
          : <><CreditCard className="size-3" /> {t('review.payAndPublish', { price: priceDollars })}</>}
      </Button>
    )
  }

  const label = republishMode ? t('actions.republish') : t('actions.publish')
  const pendingLabel = republishMode ? t('actions.republishing') : t('actions.publishing')

  return (
    <Button
      size={size}
      onClick={onConfirm}
      disabled={
        (!modalData.canPublish && !isFreeRepublish) ||
        confirmMutation.isPending ||
        modalData.isAnalyzing ||
        !effectiveTermsAccepted
      }
      className={cls}
    >
      {confirmMutation.isPending
        ? <><Loader2 className="size-3 animate-spin" /> {pendingLabel}</>
        : <><ExternalLink className="size-3" /> {label}</>}
    </Button>
  )
}

// ─── Publish success pane ──────────────────────────────────────────────────────
// Shown right after a first publish: the live link, share shortcuts, and a soft
// referral nudge — the moment of highest satisfaction is the best time to ask.
// Shared by both the mobile drawer and desktop dialog.

function PublishSuccessPane({
  siteUrl,
  t,
  onInviteClick,
}: {
  siteUrl: string
  t: ReturnType<typeof useTranslations>
  onInviteClick: () => void
}) {
  const [copied, setCopied] = useState(false)

  const shareMessage = t('success.shareMessage')
  const encodedLink = encodeURIComponent(siteUrl)
  const encodedMessage = encodeURIComponent(shareMessage)

  const shareChannels = [
    {
      key: 'whatsapp',
      label: t('success.shareWhatsapp'),
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedMessage}%20${encodedLink}`,
      className: 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20',
    },
    {
      key: 'telegram',
      label: t('success.shareTelegram'),
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedLink}&text=${encodedMessage}`,
      className: 'bg-[#26A5E4]/10 text-[#26A5E4] hover:bg-[#26A5E4]/20',
    },
    {
      key: 'email',
      label: t('success.shareEmail'),
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(t('success.emailSubject'))}&body=${encodedMessage}%20${encodedLink}`,
      className: 'bg-muted text-foreground hover:bg-muted/70',
    },
  ]

  const handleCopy = async () => {
    if (!siteUrl) return
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — user can still select the text manually.
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 px-1 py-2 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="size-7 text-emerald-600" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{t('success.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('success.description')}</p>
      </div>

      <div className="flex w-full items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2">
        <span className="flex-1 truncate px-2 text-xs text-muted-foreground">{siteUrl}</span>
        <Button size="sm" variant="outline" onClick={handleCopy} disabled={!siteUrl} className="shrink-0 gap-1.5">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? t('success.copied') : t('success.copy')}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-3">
        {shareChannels.map(({ key, label, icon: Icon, href, className }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={`flex size-10 items-center justify-center rounded-full transition-colors ${siteUrl ? className : 'bg-muted text-muted-foreground/40 pointer-events-none'}`}
          >
            <Icon className="size-4.5" />
          </a>
        ))}
      </div>

      <div className="flex w-full items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-left">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
          <Gift className="size-4.5 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold">{t('success.referralTitle')}</p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{t('success.referralDescription')}</p>
        </div>
        <Button size="sm" variant="outline" onClick={onInviteClick} className="shrink-0">
          {t('success.referralCta')}
        </Button>
      </div>
    </div>
  )
}

