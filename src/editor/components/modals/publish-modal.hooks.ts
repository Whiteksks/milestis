'use client'

import { useState, useEffect, useRef } from 'react'
import { usePublishMutation, useRepublishMutation } from '@/hooks/useProjectMutations'
import { useUiSelector } from '@/editor/lib/store'
import { useUserStore, selectSubscription } from '@/hooks/useUserStore'
import { getEffectiveSubscriptionFeatures } from '@/lib/billing/billing.utils'
import { usePublishModal } from '@/hooks/usePublishModal'
import type { PublishModalProps, PublishModalData } from './publish-modal.types'

export function usePublishFlow({
  open,
  onOpenChange,
  projectId,
  mode,
  initialSlug,
  initialAccessToken,
  autoAdvance,
  republishMode,
}: PublishModalProps) {
  const { setIsPublished, setPublishedInfo } = useUiSelector((s) => ({
    setIsPublished: s.setIsPublished,
    setPublishedInfo: s.setPublishedInfo,
  }))

  const subscription = useUserStore(selectSubscription)
  const ratePerDollar = getEffectiveSubscriptionFeatures(subscription).creditTopupRatePerDollar || 1

  const publishMutation = usePublishMutation()
  const republishMutation = useRepublishMutation()
  const modalData: PublishModalData = usePublishModal(projectId, mode, {
    initialSlug,
    initialAccessToken,
    ratePerDollar,
    republishMode,
  })

  const [termsAccepted, setTermsAccepted] = useState(false)

  // Free republish — terms not required
  const isFreeRepublish = Boolean(republishMode && (modalData.quoteData?.creditCost ?? 1) === 0)
  const effectiveTermsAccepted = isFreeRepublish || termsAccepted

  // Derived: is the user short on credits in the review step?
  const insufficient =
    modalData.step === 'review' &&
    modalData.quoteData !== null &&
    !modalData.isAnalyzing &&
    modalData.quoteData.userBalance < modalData.quoteData.creditCost

  // Price for Pay & Publish button — minimum $10 purchase enforced.
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
  const storeBalance = useUserStore((s) => s.profile?.balance?.total ?? 0)
  const lastSeenBalanceRef = useRef<number | null>(null)
  const hasReanalyzedRef = useRef(false)
  useEffect(() => {
    if (!autoAdvance) return
    if (!insufficient) {
      lastSeenBalanceRef.current = null
      hasReanalyzedRef.current = false
      return
    }
    if (hasReanalyzedRef.current) return
    if (lastSeenBalanceRef.current === null) {
      lastSeenBalanceRef.current = storeBalance
      return
    }
    if (storeBalance > lastSeenBalanceRef.current) {
      hasReanalyzedRef.current = true
      void advanceToReview()
    }
  }, [autoAdvance, insufficient, storeBalance, advanceToReview])

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      modalData.reset()
      setTermsAccepted(false)
    }
    onOpenChange(nextOpen)
  }

  function handlePublish() {
    if (!modalData.canPublish || !modalData.quoteData) return
    publishMutation.mutate(
      {
        projectId,
        slug: modalData.slug,
        quoteId: modalData.quoteData.quoteId,
        accessToken: mode === 'photobook' || mode === 'event' ? modalData.accessToken : undefined,
      },
      {
        onSuccess: () => {
          setIsPublished(true)
          setPublishedInfo(
            modalData.slug,
            mode === 'photobook' || mode === 'event' ? modalData.accessToken : undefined,
          )
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
  const siteUrl = modalData.portfolioUrl ?? modalData.photobookUrl ?? ''

  return {
    modalData,
    termsAccepted,
    setTermsAccepted,
    isFreeRepublish,
    effectiveTermsAccepted,
    insufficient,
    priceDollars,
    confirmMutation,
    onConfirm,
    handleClose,
    siteUrl,
  }
}
