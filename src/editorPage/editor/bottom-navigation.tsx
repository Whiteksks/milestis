"use client"

import { motion } from "framer-motion"
import { Plus, Type, ImageIcon, Zap, MessageSquare } from "lucide-react"

interface BottomNavigationProps {
  onAddBlock: () => void
  activeButton?: string
}

export function BottomNavigation({ onAddBlock, activeButton }: BottomNavigationProps) {
  const buttons = [
    { icon: Plus, label: "Add Block", id: "add", action: onAddBlock },
    { icon: Type, label: "Text", id: "text", action: onAddBlock },
    { icon: ImageIcon, label: "Gallery", id: "gallery", action: onAddBlock },
    { icon: Zap, label: "CTA", id: "cta", action: onAddBlock },
    { icon: MessageSquare, label: "Form", id: "form", action: onAddBlock },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border z-40 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto scrollbar-hide h-full">
        <div className="flex gap-1 px-2 py-3 h-full min-w-max">
          {buttons.map((btn) => (
            <motion.button
              key={btn.id}
              onClick={btn.action}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                activeButton === btn.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <btn.icon size={20} strokeWidth={1.5} />
              <span className="text-xs font-medium">{btn.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  )
}
