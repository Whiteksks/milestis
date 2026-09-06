'use client'

import { useState } from 'react'
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
import { Globe, Lock } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { ReferralModal } from '@/components/layout/dashboard/referral'
import { PublishForm } from './publish-slug-form'
import { ReviewPane } from './publish-review'
import { PublishSuccessPane } from './publish-success'
import { PublishModalFooter } from './publish-modal-footer'
import { usePublishFlow } from './publish-modal.hooks'
import type { PublishModalProps } from './publish-modal.types'

export type { PublishModalProps, PublishMode } from './publish-modal.types'

export function PublishModal(props: PublishModalProps) {
  const { open, mode, republishMode } = props
  const t = useTranslations('editor.modal.publish')
  const locale = useLocale()
  const isMobile = useIsMobile()
  const [referralOpen, setReferralOpen] = useState(false)

  const {
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
  } = usePublishFlow(props)

  const modeIcon =
    mode === 'portfolio' ? (
      <Globe className="size-4 text-primary" />
    ) : (
      <Lock className="size-4 text-primary" />
    )

  const step1Title = mode === 'portfolio' ? t('title.portfolio') : t('title.photobook')
  const step1Description = mode === 'portfolio' ? t('description.portfolio') : t('description.photobook')
  const reviewTitle = republishMode ? t('title.republish') : t('title.review')
  const reviewDescription = republishMode ? t('description.republish') : t('description.reviewDesktop')

  const modalBody =
    modalData.step === 'slug' ? (
      <PublishForm mode={mode} data={modalData} />
    ) : modalData.step === 'review' ? (
      <ReviewPane
        data={modalData}
        termsAccepted={termsAccepted}
        onTermsChange={setTermsAccepted}
        republishMode={republishMode}
      />
    ) : (
      <PublishSuccessPane siteUrl={siteUrl} t={t} onInviteClick={() => setReferralOpen(true)} />
    )

  if (isMobile) {
    return (
      <>
        <MobileDrawer
          open={open}
          onOpenChange={handleClose}
          title={
            <span className="flex items-center gap-2 text-base">
              {modeIcon}
              {modalData.step === 'slug'
                ? step1Title
                : modalData.step === 'review'
                  ? reviewTitle
                  : t('success.title')}
            </span>
          }
          description={
            modalData.step === 'slug'
              ? step1Description
              : modalData.step === 'review'
                ? t('description.review')
                : t('success.description')
          }
          showHeader={modalData.step !== 'success'}
          footer={
            <PublishModalFooter
              modalData={modalData}
              insufficient={insufficient}
              isFreeRepublish={isFreeRepublish}
              republishMode={republishMode}
              priceDollars={priceDollars}
              effectiveTermsAccepted={effectiveTermsAccepted}
              confirmMutation={confirmMutation}
              onConfirm={onConfirm}
              onClose={() => handleClose(false)}
              t={t}
              fullWidth
            />
          }
          bodyClassName="px-2 min-h-64"
        >
          {modalBody}
        </MobileDrawer>
        <ReferralModal open={referralOpen} onOpenChange={setReferralOpen} locale={locale} />
      </>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl w-full min-w-0 overflow-hidden gap-4">
          <DialogHeader className={modalData.step === 'success' ? 'sr-only' : 'gap-1'}>
            <DialogTitle className="flex items-center gap-2 text-base">
              {modalData.step === 'success' ? (
                t('success.title')
              ) : (
                <>
                  {modeIcon}
                  {modalData.step === 'slug' ? step1Title : reviewTitle}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {modalData.step === 'success'
                ? t('success.description')
                : modalData.step === 'slug'
                  ? step1Description
                  : reviewDescription}
            </DialogDescription>
          </DialogHeader>

          {modalBody}

          <DialogFooter className="gap-2">
            <PublishModalFooter
              modalData={modalData}
              insufficient={insufficient}
              isFreeRepublish={isFreeRepublish}
              republishMode={republishMode}
              priceDollars={priceDollars}
              effectiveTermsAccepted={effectiveTermsAccepted}
              confirmMutation={confirmMutation}
              onConfirm={onConfirm}
              onClose={() => handleClose(false)}
              t={t}
              size="sm"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ReferralModal open={referralOpen} onOpenChange={setReferralOpen} locale={locale} />
    </>
  )
}         