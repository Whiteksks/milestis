import type { MenuContent } from '@/editor/modes/menu/content-types'
import type { MenuTemplateId } from '@/editor/modes/menu/template-ids'
import type { Theme } from '@/editor/lib/types'
import type { AiPhotoRef } from '../core/types'

export interface MenuAiInput {
  prompt: string
  language: string
  current: MenuContent
  activePageId: string
  style: { templateId: MenuTemplateId; currentTheme: Theme }
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  photos: AiPhotoRef[]
}

export interface MenuAiResult {
  message: string
  menu: Omit<MenuContent, 'mascot'> | null
  style: MenuAiInput['style'] | null
  photoAssignments: Array<{ dishId: string; photoId: string }>
}
