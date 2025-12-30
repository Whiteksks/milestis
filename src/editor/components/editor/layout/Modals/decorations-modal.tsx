"use client"

import { useUiStore } from '@/editor/lib/store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DecorationsSelectorContent } from '../decorations-selector-content'

export function DecorationsModal() {
  const {
    isDecorationsModalOpen,
    toggleDecorationsModal,
    clearPreviewDecorations
  } = useUiStore()

  return (
    <Dialog
      open={isDecorationsModalOpen}
      onOpenChange={(open) => {
        if (!open) clearPreviewDecorations()
        toggleDecorationsModal()
      }}
    >
      <DialogContent
        className="
          sm:max-w-3xl max-h-[80vh]
          flex flex-col
          bg-white/95 backdrop-blur-xl
          border-slate-100 shadow-2xl
          p-8 gap-0
        "
      >
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-medium text-slate-900 tracking-tight">
            Decoration Presets
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto pr-1">
          <DecorationsSelectorContent onClose={toggleDecorationsModal} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DecorationsModal
