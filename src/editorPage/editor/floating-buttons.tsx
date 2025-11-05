"use client"

import { motion } from "framer-motion"
import { Plus, Type, ImageIcon, Zap, MessageSquare } from "lucide-react"

interface FloatingButtonsProps {
  onAddBlock: () => void
}

export function FloatingButtons({ onAddBlock }: FloatingButtonsProps) {
  const buttons = [
    { icon: Plus, label: "Add Block", action: onAddBlock },
    { icon: Type, label: "Text", action: onAddBlock },
    { icon: ImageIcon, label: "Gallery", action: onAddBlock },
    { icon: Zap, label: "CTA", action: onAddBlock },
    { icon: MessageSquare, label: "Form", action: onAddBlock },
  ]

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
      <motion.div
        className="flex flex-col gap-3 pl-2 pr-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {buttons.map((btn, idx) => (
          <motion.button
            key={idx}
            onClick={btn.action}
            className="pointer-events-auto w-10 h-10 rounded-full bg-card border border-border text-foreground hover:bg-muted hover:border-foreground/20 flex items-center justify-center shadow-sm transition-smooth group"
            whileHover={{ scale: 1.05, x: 4 }}
            whileTap={{ scale: 0.95 }}
            title={btn.label}
          >
            <btn.icon size={18} strokeWidth={1.5} />
            <motion.div
              className="absolute left-full ml-2 bg-foreground text-background text-xs font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0, x: -4 }}
              whileHover={{ opacity: 1, x: 0 }}
            >
              {btn.label}
            </motion.div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
