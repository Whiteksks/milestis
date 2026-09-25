'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { PublishModalFrame } from './publish-modal-frame'
import { MenuPublishFlow } from './menu-publish-flow'
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
  if (!props.open) return null
  return props.mode === 'menu'
    ? <MenuPublishFlow key={props.projectId} {...props} />
    : <StandardPublishModal key={props.projectId} {...props} />
}

function StandardPublishModal(props: PublishModalProps) {
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

  const success = modalData.step === 'success'
  const title = success ? t('success.title') : modalData.step === 'slug' ? step1Title : reviewTitle
  const description = success ? t('success.description') : modalData.step === 'slug' ? step1Description : isMobile ? t('description.review') : reviewDescription
  return <>
    <PublishModalFrame open={open} onOpenChange={handleClose} success={success} busy={confirmMutation.isPending}
      title={<>{!success && modeIcon}{title}</>} description={description}
      footer={<PublishModalFooter modalData={modalData} insufficient={insufficient} isFreeRepublish={isFreeRepublish}
        republishMode={republishMode} priceDollars={priceDollars} effectiveTermsAccepted={effectiveTermsAccepted}
        confirmMutation={confirmMutation} onConfirm={onConfirm} onClose={() => handleClose(false)} t={t}
        fullWidth={isMobile === true} size={isMobile ? undefined : 'sm'} />}>
      {modalBody}
    </PublishModalFrame>
    <ReferralModal open={referralOpen} onOpenChange={setReferralOpen} locale={locale} />
  </>
}
