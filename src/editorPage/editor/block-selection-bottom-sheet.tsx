"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BLOCK_LIBRARY, type BlockData } from "@/editorPage/lib/block-types"
import { BottomSheet } from "./bottom-sheet"
import { Button } from "@/components/ui/button"
import { Check, Plus } from "lucide-react"

interface BlockSelectionBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onAddBlock: (block: BlockData, mode: "replace" | "add") => void
}

export function BlockSelectionBottomSheet({ isOpen, onClose, onAddBlock }: BlockSelectionBottomSheetProps) {
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(BLOCK_LIBRARY[0])
  const [mode, setMode] = useState<"replace" | "add">("add")

  const handleApply = () => {
    if (selectedBlock) {
      onAddBlock(selectedBlock, mode)
      setSelectedBlock(BLOCK_LIBRARY[0])
      setMode("add")
      onClose()
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Block">
      <div className="px-4 space-y-4 py-4">
        {/* Block Selection */}
        <div>
          <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-3">Blocks</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {BLOCK_LIBRARY.map((block) => (
              <motion.button
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedBlock?.id === block.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-foreground/20"
                }`}
                whileHover={{ x: 2 }}
              >
                <p className="font-medium text-sm text-foreground">{block.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{block.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Block Preview */}
        <AnimatePresence mode="wait">
          {selectedBlock && (
            <motion.div
              key={selectedBlock.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div
                className={`w-full h-32 rounded-lg border border-border overflow-hidden flex items-center justify-center ${selectedBlock.settings.background} ${selectedBlock.settings.textColor}`}
              >
                <div className="text-center px-4">
                  <p className="font-medium text-sm">{selectedBlock.title}</p>
                  <p className="text-xs opacity-60 mt-1">{selectedBlock.description}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Selection */}
        <div>
          <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-2">Apply Mode</p>
          <div className="grid grid-cols-2 gap-2">
            {(["replace", "add"] as const).map((m) => (
              <motion.button
                key={m}
                onClick={() => setMode(m)}
                className={`p-2.5 rounded-lg border transition-colors text-xs font-medium ${
                  mode === m
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/20"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {m === "replace" ? (
                  "Replace All"
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <Plus size={12} /> Add
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent text-xs h-10 border border-border hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs h-10"
          >
            <Check size={14} strokeWidth={2} />
            Apply
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}
