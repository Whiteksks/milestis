"use client"

import { useUiStore } from '@/editor/lib/store'
import { Button } from '@/components/ui/button'
import { Plus, Palette, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function FloatingActions() {
  const { toggleTemplateModal, toggleThemeModal, toggleDecorationsModal } = useUiStore()

  return (
    <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={toggleTemplateModal}
          size="lg"
          className="h-12 w-12 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-slate-900 hover:bg-slate-800 backdrop-blur-sm"
          title="Change Template"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={toggleThemeModal}
          size="lg"
          className="h-12 w-12 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200"
          variant="outline"
          title="Change Theme"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={toggleDecorationsModal}
          size="lg"
          className="h-12 w-12 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200"
          variant="outline"
          title="Decorations"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  )
}
