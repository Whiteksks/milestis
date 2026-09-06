"use client"

import { useTranslations } from 'next-intl'
import { useUiSelector } from '@/editor/lib/store'
import { useUiStore } from '@/editor/lib/store/ui'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Palette, WandSparkles, LayoutTemplate, HelpCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { selectCurrentUid, selectProfileHydrating, useUserStore } from '@/hooks/useUserStore'

export function FloatingActions() {
  const t = useTranslations('editor.layout.floating')
  const tHelp = useTranslations('editor.layout.helpGuide')
  const { openDesignModal } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
  }))
  const setIsHelpGuideOpen = useUiStore((s) => s.setIsHelpGuideOpen)
  const uid = useUserStore(selectCurrentUid)
  const hydrating = useUserStore(selectProfileHydrating)
  const hasSeenEditorHelp = useUserStore((state) => state.profile?.settings?.hasSeenEditorHelp)
  // Pulse the help button until the user has opened the guide at least once
  const helpUnseen = !hydrating && !!uid && hasSeenEditorHelp !== true

  return (
    <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-2">
      <Tooltip>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => openDesignModal('templates')}
              size="lg"
              className="h-12 w-12 rounded-xl transition-all bg-foreground border border-background/40 hover:bg-foreground/90 text-background"
            >
              <LayoutTemplate className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
        </motion.div>
        <TooltipContent side="right">{t('changeTemplate')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => openDesignModal('themes')}
              size="lg"
              className="h-12 w-12 rounded-xl transition-all bg-editor-surface hover:bg-muted text-foreground border border-border"
            >
              <Palette className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
        </motion.div>
        <TooltipContent side="right">{t('changeTheme')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => openDesignModal('backgrounds')}
              size="lg"
              className="h-12 w-12 rounded-xl transition-all bg-editor-surface hover:bg-muted text-foreground border border-border"
            >
              <WandSparkles className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
        </motion.div>
        <TooltipContent side="right">{t('background')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsHelpGuideOpen(true)}
              size="lg"
              className="relative h-12 w-12 rounded-xl transition-all bg-editor-surface hover:bg-primary/90 text-foreground border border-border bg-primary"
            >
              {helpUnseen && (
                <span className="absolute inset-0 rounded-xl bg-primary/40 animate-ping" aria-hidden="true" />
              )}
              <HelpCircle className="relative h-5 w-5" />
            </Button>
          </TooltipTrigger>
        </motion.div>
        <TooltipContent side="right">{tHelp('buttonLabel')}</TooltipContent>
      </Tooltip>
    </div>
  )
}
