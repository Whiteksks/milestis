"use client"

import { useTranslations } from 'next-intl'
import { useUiSelector } from '@/editor/lib/store'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Palette, WandSparkles, LayoutTemplate } from 'lucide-react'
import { motion } from 'framer-motion'

export function FloatingActions() {
  const t = useTranslations('editor.layout.floating')
  const { openDesignModal } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
  }))

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
    </div>
  )
}
