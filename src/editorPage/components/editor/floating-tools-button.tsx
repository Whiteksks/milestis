"use client"

import { motion } from "framer-motion"
import { Sliders } from "lucide-react"

interface FloatingToolsButtonProps {
  onClick: () => void
  visible: boolean
}

export function FloatingToolsButton({ onClick, visible }: FloatingToolsButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-24 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 z-40 md:hidden"
      initial={{ scale: 0, opacity: 0 }}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Sliders size={20} strokeWidth={1.5} />
    </motion.button>
  )
}
