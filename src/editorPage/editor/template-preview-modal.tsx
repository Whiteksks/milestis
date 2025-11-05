"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { BlockData } from "@/editorPage/lib/block-types"
import { ArrowRight, Check, X } from "lucide-react"

interface TemplatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  block: BlockData | null
  onApply: (mode: "replace" | "add") => void
}

export function TemplatePreviewModal({ isOpen, onClose, block, onApply }: TemplatePreviewModalProps) {
  const [mode, setMode] = useState<"replace" | "add">("add")
  const [showModeSelect, setShowModeSelect] = useState(false)

  const handleApply = () => {
    setShowModeSelect(true)
  }

  const handleModeSelect = (selectedMode: "replace" | "add") => {
    onApply(selectedMode)
    setMode("add")
    setShowModeSelect(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border border-border bg-background rounded-lg p-0 overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          {!showModeSelect ? (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {block && (
                <div className="grid grid-cols-2 gap-0">
                  {/* Preview Side */}
                  <div className="border-r border-border p-6 flex flex-col gap-4 bg-muted/20">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-foreground uppercase tracking-wide">Preview</p>
                      <motion.div
                        className={`w-full h-48 rounded-md border border-border overflow-hidden flex items-center justify-center ${block.settings.background} ${block.settings.textColor}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={block.id}
                      >
                        <div className="text-center px-4">
                          <p className="font-medium text-sm">{block.title}</p>
                          <p className="text-xs opacity-60 mt-2">{block.description}</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Details Side */}
                  <div className="p-6 flex flex-col gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-medium text-foreground">{block.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{block.description}</p>
                    </div>

                    <div className="space-y-3 flex-1">
                      <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Features</p>
                      <div className="space-y-2">
                        {["Responsive design", "Easy to customize", "Mobile optimized"].map((feature) => (
                          <div key={feature} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-1.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end pt-2">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        size="sm"
                        className="bg-transparent text-xs h-9 border border-border hover:bg-muted/50"
                      >
                        <X size={14} strokeWidth={2} />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleApply}
                        className="bg-foreground text-background hover:bg-foreground/90 gap-1.5 text-xs h-9"
                        size="sm"
                      >
                        <Check size={14} strokeWidth={2} />
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="mode-select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-medium text-foreground">How to apply?</h3>
                <p className="text-sm text-muted-foreground">Choose how you'd like to add this template</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => handleModeSelect("replace")}
                  className="p-4 rounded-md border border-border hover:border-foreground/30 hover:bg-muted/50 transition-colors text-left group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm text-foreground group-hover:text-foreground">Replace All</p>
                      <p className="text-xs text-muted-foreground">Clear and replace entire canvas</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground/60 mt-1" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleModeSelect("add")}
                  className="p-4 rounded-md border border-border hover:border-foreground/30 hover:bg-muted/50 transition-colors text-left group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm text-foreground group-hover:text-foreground">Add New Block</p>
                      <p className="text-xs text-muted-foreground">Keep existing blocks</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground/60 mt-1" />
                  </div>
                </motion.button>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowModeSelect(false)}
                  size="sm"
                  className="bg-transparent text-xs h-9 border border-border hover:bg-muted/50"
                >
                  Back
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
