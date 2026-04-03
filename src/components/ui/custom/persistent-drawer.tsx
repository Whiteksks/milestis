"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Константы для "дорогой" анимации
const drawerTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  restDelta: 0.001
} as const

interface PersistentDrawerProps {
  isOpen: boolean
  children: React.ReactNode
  width?: number
  className?: string
}

export function PersistentDrawer({
  isOpen,
  children,
  width = 380,
  className
}: PersistentDrawerProps) {
  return (
    <div className="relative flex h-full overflow-hidden">
      {/* Spacer: Сдвигает основной контент. 
         AnimatePresence здесь не нужен, так как div всегда в DOM, 
         мы просто меняем его ширину.
      */}
      <motion.div
        layout
        initial={false}
        animate={{ width: isOpen ? width : 0 }}
        transition={drawerTransition}
        className="shrink-0 hidden md:block"
      />

      {/* Panel: Сама панель. 
         Используем x: 0 для открытого и x: 100% для закрытого состояния.
      */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={drawerTransition}
        style={{ width }}
        className={cn(
          "fixed right-0 top-0 z-20 h-full border-border bg-editor-surface",
          "will-change-transform transform-gpu",
          className
        )}
      >
        {children}
      </motion.aside>
    </div>
  )
}