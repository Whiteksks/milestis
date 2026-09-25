'use client'

import type { useTranslations } from 'next-intl'
import type { usePublishModal } from '@/hooks/usePublishModal'

export type PublishMode = 'portfolio' | 'photobook' | 'event' | 'menu'

export interface PublishModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  mode: PublishMode
  /** Pre-fill the slug field and skip straight to review (used after payment return). */
  initialSlug?: string
  initialAccessToken?: string
  autoAdvance?: boolean
  /** When true, runs the republish flow (analyzeRepublish → republishProject). */
  republishMode?: boolean
}

export type PublishModalData = ReturnType<typeof usePublishModal>
export type PublishTranslation = ReturnType<typeof useTranslations<'editor.modal.publish'>>
