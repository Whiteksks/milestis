"use client"

import { motion } from "framer-motion"
import { Settings } from "lucide-react"

interface FloatingSettingsButtonProps {
  onClick: () => void
  visible?: boolean
}

export function FloatingSettingsButton({ onClick, visible = true }: FloatingSettingsButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: visible ? 1 : 0.5, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-6 top-20 z-40 p-2.5 rounded-full bg-card border border-border text-foreground shadow-sm hover:bg-muted transition-smooth"
      title="Open structure panel"
    >
      <Settings size={20} strokeWidth={1.5} />
    </motion.button>
  )
}
