'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2, RefreshCw } from 'lucide-react'
import { ReviewPrimaryButton } from './publish-review'
import type { PublishModalData, PublishTranslation } from './publish-modal.types'

interface PublishModalFooterProps {
  modalData: PublishModalData
  insufficient: boolean
  isFreeRepublish: boolean
  republishMode?: boolean
  priceDollars: string
  effectiveTermsAccepted: boolean
  confirmMutation: { isPending: boolean }
  onConfirm: () => void
  onClose: () => void
  t: PublishTranslation
  fullWidth?: boolean
  size?: 'sm' | 'default'
}

export function PublishModalFooter({
  modalData,
  insufficient,
  isFreeRepublish,
  republishMode,
  priceDollars,
  effectiveTermsAccepted,
  confirmMutation,
  onConfirm,
  onClose,
  t,
  fullWidth,
  size,
}: PublishModalFooterProps) {
  const { step } = modalData

  if (step === 'slug') {
    return (
      <>
        <Button
          variant="ghost"
          size={size}
          onClick={onClose}
          className={fullWidth ? 'w-full' : undefined}
        >
          {t('actions.cancel')}
        </Button>
        <Button
          size={size}
          onClick={modalData.advanceToReview}
          disabled={!modalData.canProceedToReview}
          className={`gap-1.5 ${fullWidth ? 'w-full' : ''}`}
        >
          {modalData.isAnalyzing ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              {t('actions.checking')}
            </>
          ) : (
            <>
              {t('actions.continue')}
              <ArrowRight className="size-3.5" />
            </>
          )}
        </Button>
      </>
    )
  }

  if (step === 'review') {
    return (
      <>
        {!republishMode && (
          <Button
            variant="ghost"
            size={size}
            onClick={modalData.analyzeError ? modalData.advanceToReview : modalData.goBack}
            disabled={confirmMutation.isPending || modalData.isAnalyzing || modalData.isBuyingCredits}
            className={`gap-1.5 ${fullWidth ? 'w-full' : ''}`}
          >
            {modalData.analyzeError ? (
              <>
                <RefreshCw className="size-3.5" />
                {t('actions.tryAgain')}
              </>
            ) : (
              <>
                <ArrowLeft className="size-3.5" />
                {t('actions.back')}
              </>
            )}
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
          fullWidth={fullWidth}
          size={size}
        />
      </>
    )
  }

  return (
    <Button
      size={size}
      onClick={onClose}
      className={`rounded-lg ${fullWidth ? 'w-full' : ''}`}
    >
      {t('success.done')}
    </Button>
  )
}
