"use client"

import { useUiSelector } from '@/editor/lib/store'
import { Button } from '@/components/ui/button'
import { Plus, Palette, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function FloatingActions() {
  const { openDesignModal } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
  }))

  return (
    <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-2.5">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => openDesignModal('templates')}
          size="lg"
          className="h-12 w-12 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-foreground hover:bg-foreground/90 text-background"
          title="Change Template"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => openDesignModal('themes')}
          size="lg"
          className="h-12 w-12 rounded-2xl shadow-md hover:shadow-lg transition-all bg-background hover:bg-muted text-foreground border border-border"
          variant="outline"
          title="Change Theme"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => openDesignModal('decorations')}
          size="lg"
          className="h-12 w-12 rounded-2xl shadow-md hover:shadow-lg transition-all bg-background hover:bg-muted text-foreground border border-border"
          variant="outline"
          title="Decorations"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  )
}
