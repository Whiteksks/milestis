'use client'

import { useUiStore } from '@/editor/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ThemeSelectorContent } from './theme-selector-content'

export function ThemeSelectorModal() {
  const { isThemeModalOpen, toggleThemeModal } = useUiStore()

  return (
    <Dialog open={isThemeModalOpen} onOpenChange={toggleThemeModal}>
      <DialogContent className="sm:max-w-225 max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-xl border-slate-100 shadow-2xl p-8 gap-0">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-medium text-slate-900 tracking-tight">Choose a Theme</DialogTitle>
          <DialogDescription className="text-slate-500">
            Select a color scheme and typography for your website
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <ThemeSelectorContent onClose={toggleThemeModal} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
