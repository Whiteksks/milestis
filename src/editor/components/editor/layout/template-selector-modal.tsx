"use client"

import { useUiSelector, useThemeSelector } from '@/editor/lib/store'
import { getModeSectionCount, getModeTemplates } from '@/editor/lib/mode-registry'
import type { TemplateId } from '@/editor/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LayoutTemplate } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileBottomSheet } from './mobile/mobile-bottom-sheet'

export function TemplateSelectorModal() {
  const { isTemplateModalOpen, toggleTemplateModal, editorMode } = useUiSelector((state) => ({
    isTemplateModalOpen: state.isTemplateModalOpen,
    toggleTemplateModal: state.toggleTemplateModal,
    editorMode: state.editorMode,
  }))
  const { setTemplate } = useThemeSelector((state) => ({
    setTemplate: state.setTemplate,
  }))
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId | null>(null)
  const isMobile = useIsMobile()

  const templates = getModeTemplates(editorMode)
  const sectionCount = getModeSectionCount(editorMode)

  const handleSelectTemplate = () => {
    if (selectedTemplateId) {
      // set visual template id
      setTemplate(selectedTemplateId)

      // close modal
      toggleTemplateModal()
    }
  }

  const content = (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6">
        {templates.length > 0 ? (
          templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id as TemplateId)}
              className={cn(
                "group relative flex flex-col items-start p-3 gap-3 rounded-2xl border transition-all duration-300 text-left",
                selectedTemplateId === template.id
                  ? "border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900/5"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-0.5"
              )}
            >
              <div className="w-full aspect-3/4 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-slate-200 transition-colors relative">
                <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300",
                    selectedTemplateId === template.id 
                        ? "bg-white shadow-sm text-slate-900 scale-110" 
                        : "bg-white/80 text-slate-400 group-hover:scale-110 group-hover:text-slate-600"
                )}>
                    <LayoutTemplate className="h-6 w-6" />
                </div>
              </div>
              <div className="w-full px-1">
                <div className="font-medium text-slate-900 tracking-tight">{template.name}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1.5">
                    {sectionCount} Sections
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-2 sm:col-span-3 py-16 text-center">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutTemplate className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-900 font-medium">No {editorMode} templates found</p>
            <p className="text-sm text-slate-500 mt-1">We are working on new designs!</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <Button 
            variant="ghost" 
            onClick={toggleTemplateModal}
            className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSelectTemplate}
          disabled={!selectedTemplateId}
          className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 px-6 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          Apply Template
        </Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <MobileBottomSheet
        isOpen={isTemplateModalOpen}
        onClose={toggleTemplateModal}
        title="Choose a Template"
      >
        {content}
      </MobileBottomSheet>
    )
  }

  return (
    <Dialog open={isTemplateModalOpen} onOpenChange={toggleTemplateModal}>
      <DialogContent className="sm:max-w-225 max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-xl border-slate-100 shadow-2xl p-8 gap-0">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-medium text-slate-900 tracking-tight">Choose a Template</DialogTitle>
          <DialogDescription className="text-slate-500">
            Select a {editorMode} template to replace your current design
          </DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  )
}
