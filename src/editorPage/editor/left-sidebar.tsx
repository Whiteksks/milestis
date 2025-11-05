"use client"

import { motion } from "framer-motion"
import { BLOCK_LIBRARY } from "@/editorPage/lib/block-types"

interface LeftSidebarProps {
  onAddBlock: () => void
}

export function LeftSidebar({ onAddBlock }: LeftSidebarProps) {
  return (
    <motion.div
      className="w-20 border-r border-border bg-card/30 glass-effect flex flex-col items-center gap-2 py-4 overflow-y-auto"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {BLOCK_LIBRARY.map((block, idx) => (
        <motion.button
          key={block.id}
          onClick={onAddBlock}
          className="w-14 h-14 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-smooth group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={block.title}
        >
          <span className="text-2xl">
            {idx === 0
              ? "▲"
              : idx === 1
                ? "⬜"
                : idx === 2
                  ? "📝"
                  : idx === 3
                    ? "❝"
                    : idx === 4
                      ? "✉"
                      : idx === 5
                        ? "→"
                        : idx === 6
                          ? "⭐"
                          : "💬"}
          </span>
          <motion.div
            className="absolute left-full ml-2 bg-card border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            {block.title}
          </motion.div>
        </motion.button>
      ))}
    </motion.div>
  )
}
