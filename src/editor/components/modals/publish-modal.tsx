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
import { useTranslations } from 'next-intl'
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
} from 'lucide-react'
import { usePublishModal } from '@/hooks/usePublishModal'
import { usePublishMutation } from '@/hooks/useProjectMutations'
import { useUiSelector } from '@/editor/lib/store'
import { useIsMobile } from '@/hooks/use-mobile'
import { useUserStore, selectSubscription } from '@/hooks/useUserStore'
import { getEffectiveSubscriptionFeatures } from '@/lib/billing/billing.utils'
import { PublishForm } from './publish-slug-form'
import { ReviewPane } from './publish-review'

interface PublishModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  mode: 'portfolio' | 'photobook'
  /** Pre-fill the slug field and skip straight to review (used after payment return). */
  initialSlug?: string
  initialAccessToken?: string
  autoAdvance?: boolean
}

export function PublishModal({ open, onOpenChange, projectId, mode, initialSlug, initialAccessToken, autoAdvance }: PublishModalProps) {
  const t = useTranslations('editor.modal.publish')
  const { setIsPublished, setPublishedInfo } = useUiSelector((s) => ({
    setIsPublished: s.setIsPublished,
    setPublishedInfo: s.setPublishedInfo,
  }))

  const publishMutation = usePublishMutation()
  const modalData = usePublishModal(projectId, mode, { initialSlug, initialAccessToken })
  const isMobile = useIsMobile()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const subscription = useUserStore(selectSubscription)
  const ratePerDollar = getEffectiveSubscriptionFeatures(subscription).creditTopupRatePerDollar || 1

  // Derived: is the user short on credits in the review step?
  const insufficient =
    modalData.step === 'review' &&
    modalData.quoteData !== null &&
    !modalData.isAnalyzing &&
    modalData.quoteData.userBalance < modalData.quoteData.creditCost

  // Price for Pay & Publish button — exact deficit, not rounded up
  const deficit = Math.max(0, (modalData.quoteData?.creditCost ?? 0) - (modalData.quoteData?.userBalance ?? 0))
  const priceDollars = (deficit / ratePerDollar).toFixed(2)

  // Auto-advance to review when returning from payment (afterTopup flow)
  const { step: modalStep, canProceedToReview, advanceToReview } = modalData
  const hasAutoAdvanced = useRef(false)
  useEffect(() => {
    if (!open) {
      hasAutoAdvanced.current = false
      return
    }
    if (!autoAdvance || !open || hasAutoAdvanced.current) return
    if (modalStep === 'slug' && canProceedToReview) {
      hasAutoAdvanced.current = true
      advanceToReview()
    }
  }, [open, autoAdvance, modalStep, canProceedToReview, advanceToReview])

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
        <ReviewPrimaryButton
            insufficient={insufficient}
            priceDollars={priceDollars}
            termsAccepted={termsAccepted}
            modalData={modalData}
            publishMutation={publishMutation}
            onPublish={handlePublish}
            t={t}
            fullWidth
          />
        <Button
          variant="ghost"
          onClick={modalData.analyzeError ? modalData.advanceToReview : modalData.goBack}
          disabled={publishMutation.isPending || modalData.isAnalyzing || modalData.isBuyingCredits}
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
          <ReviewPane data={modalData} termsAccepted={termsAccepted} onTermsChange={setTermsAccepted} />
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
          <ReviewPane data={modalData} termsAccepted={termsAccepted} onTermsChange={setTermsAccepted} />
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
                disabled={publishMutation.isPending || modalData.isAnalyzing || modalData.isBuyingCredits}
                className="gap-1.5"
              >
                {modalData.analyzeError
                  ? <><RefreshCw className="size-3" /> {t('actions.tryAgain')}</>
                  : <><ArrowLeft className="size-3" /> {t('actions.back')}</>
                }
              </Button>
              <ReviewPrimaryButton
                insufficient={insufficient}
                priceDollars={priceDollars}
                termsAccepted={termsAccepted}
                modalData={modalData}
                publishMutation={publishMutation}
                onPublish={handlePublish}
                t={t}
                size="sm"
              />
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Review primary action button ─────────────────────────────────────────────
// Renders either "Pay & Publish" (insufficient balance) or "Publish" (sufficient).
// Shared by both the mobile drawer and desktop dialog footers.

function ReviewPrimaryButton({
  insufficient,
  priceDollars,
  termsAccepted,
  modalData,
  publishMutation,
  onPublish,
  t,
  fullWidth,
  size,
}: {
  insufficient: boolean
  priceDollars: string
  termsAccepted: boolean
  modalData: ReturnType<typeof usePublishModal>
  publishMutation: { isPending: boolean }
  onPublish: () => void
  t: ReturnType<typeof useTranslations>
  fullWidth?: boolean
  size?: 'sm' | 'default'
}) {
  const cls = `gap-2${fullWidth ? ' w-full' : ''}`

  if (insufficient) {
    return (
      <Button
        size={size}
        onClick={modalData.initiateBuyAndPublish}
        disabled={modalData.isBuyingCredits || !termsAccepted}
        className={cls}
      >
        {modalData.isBuyingCredits
          ? <><Loader2 className="size-3 animate-spin" /> {t('actions.checking')}</>
          : <><CreditCard className="size-3" /> {t('review.payAndPublish', { price: priceDollars })}</>}
      </Button>
    )
  }

  return (
    <Button
      size={size}
      onClick={onPublish}
      disabled={
        !modalData.canPublish ||
        publishMutation.isPending ||
        modalData.isAnalyzing ||
        !termsAccepted
      }
      className={cls}
    >
      {publishMutation.isPending
        ? <><Loader2 className="size-3 animate-spin" /> {t('actions.publishing')}</>
        : <><ExternalLink className="size-3" /> {t('actions.publish')}</>}
    </Button>
  )
}

