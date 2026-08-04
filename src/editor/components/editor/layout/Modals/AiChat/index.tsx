'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useUiStore } from '@/editor/lib/store/ui'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sparkles } from 'lucide-react'
import { resetChatSession } from '@/lib/ai/service'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { MobileDrawer } from '../../mobile/mobile-drawer'
import { AiChatContent } from './ai-chat-content'

export function AiChatModal() {
  const t = useTranslations('editor.layout.aiChat')
  const isAiChatOpen = useUiStore((s) => s.isAiChatOpen)
  const setIsAiChatOpen = useUiStore((s) => s.setIsAiChatOpen)
  const projectId = useUiStore((s) => s.projectId)
  const clearAiChat = useUiStore((s) => s.clearAiChat)
  const isMobile = useIsMobile()

  // Reset chat and AI session when navigating to a different project
  useEffect(() => {
    clearAiChat()
    resetChatSession()
  }, [projectId, clearAiChat])

  if (isMobile) {
    return (
      <MobileDrawer
        open={isAiChatOpen}
        onOpenChange={(v: boolean) => { if (!v) setIsAiChatOpen(false) }}
        title={t('title')}
        showHeader
        bodyClassName="h-[65vh] !overflow-hidden !p-0 !mt-0"
      >
        <AiChatContent />
      </MobileDrawer>
    )
  }

  return (
    <Sheet open={isAiChatOpen} onOpenChange={setIsAiChatOpen}>
      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] flex flex-col p-0 gap-0">
        <SheetHeader className="p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted border border-border">
              <Sparkles className="h-4 w-4 text-foreground/70" />
            </div>
            <SheetTitle className="text-base font-semibold">{t('title')}</SheetTitle>
          </div>
          <SheetDescription className="sr-only">{t('title')}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 min-h-0 flex flex-col">
          <AiChatContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}
