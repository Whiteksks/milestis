"use client"

import { motion, AnimatePresence, Reorder } from "framer-motion"
import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { BlockCard } from "./block-card"

interface CanvasProps {
  blocks: CanvasBlock[]
  selectedBlockId: string | null
  onSelectBlock: (id: string) => void
  onDeleteBlock: (id: string) => void
  onReorderBlocks: (fromIndex: number, toIndex: number) => void
  viewport?: "desktop" | "tablet" | "mobile"
}

export function Canvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
  onReorderBlocks,
  viewport = "desktop",
}: CanvasProps) {
  const getCanvasWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-3xl"
      case "desktop":
      default:
        return "max-w-5xl"
    }
  }

  return (
    <div className={`${getCanvasWidth()} w-full mx-auto p-8 transition-all duration-300`}>
      {blocks.length === 0 ? (
        <motion.div
          className="h-96 rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl opacity-40">+</div>
          <p className="text-muted-foreground text-sm">Start by adding your first block</p>
          <p className="text-xs text-muted-foreground">Use the floating buttons on the left</p>
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
          className="space-y-4"
        >
          <AnimatePresence>
            {blocks.map((block) => (
              <Reorder.Item key={block.id} value={block}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <BlockCard
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => onSelectBlock(block.id)}
                    onDelete={() => onDeleteBlock(block.id)}
                  />
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </div>
  )
}
