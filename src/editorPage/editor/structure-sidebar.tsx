"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, GripVertical } from "lucide-react"
import { Reorder } from "framer-motion"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface StructureSidebarProps {
  isOpen: boolean
  onClose: () => void
  blocks: CanvasBlock[]
  selectedBlockId: string | null
  onSelectBlock: (id: string) => void
  onReorderBlocks: (fromIndex: number, toIndex: number) => void
}

export function StructureSidebar({
  isOpen,
  onClose,
  blocks,
  selectedBlockId,
  onSelectBlock,
  onReorderBlocks,
}: StructureSidebarProps) {
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-screen w-80 bg-background border-l border-border z-50 overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-foreground">Structure</h2>
                {selectedBlock && <p className="text-xs text-muted-foreground">{selectedBlock.title}</p>}
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 rounded hover:bg-muted transition-smooth text-muted-foreground hover:text-foreground"
              >
                <X size={18} strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* Breadcrumb */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground/60">Structure</span>
                {selectedBlock && (
                  <>
                    <span className="text-foreground/40 mx-1.5">/</span>
                    <span className="text-foreground">{selectedBlock.title}</span>
                  </>
                )}
              </p>
            </div>

            {/* Blocks List */}
            <div className="flex-1 overflow-y-auto p-3">
              {blocks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center text-center"
                >
                  <p className="text-xs text-muted-foreground">No blocks added yet</p>
                </motion.div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={blocks}
                  onReorder={(newBlocks) => {
                    newBlocks.forEach((block, idx) => {
                      if (block.order !== idx) {
                        onReorderBlocks(block.order, idx)
                      }
                    })
                  }}
                  className="space-y-2"
                >
                  <AnimatePresence>
                    {blocks.map((block) => (
                      <Reorder.Item key={block.id} value={block} as="div">
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`group flex items-start gap-2 p-2 rounded border transition-smooth cursor-pointer ${
                            selectedBlockId === block.id
                              ? "border-foreground/30 bg-muted/80"
                              : "border-transparent hover:bg-muted/50"
                          }`}
                          onClick={() => onSelectBlock(block.id)}
                        >
                          {/* Drag Handle */}
                          <div className="pt-1 opacity-0 group-hover:opacity-100 transition-smooth">
                            <GripVertical size={14} strokeWidth={1.5} className="text-muted-foreground" />
                          </div>

                          {/* Thumbnail */}
                          <div className="flex-1 min-w-0">
                            <div
                              className={`w-full h-12 rounded border border-border ${block.settings.background} ${block.settings.textColor} flex items-center justify-center overflow-hidden text-xs font-medium`}
                            >
                              <span className="truncate px-2">{block.title}</span>
                            </div>
                          </div>
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              )}
            </div>

            {/* Info Footer */}
            <div className="p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
              <p>Drag blocks to reorder. Click to select.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
