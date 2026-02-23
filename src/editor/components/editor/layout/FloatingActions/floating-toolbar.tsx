"use client"

import { memo, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion" // Добавляем импорты

export type FloatingToolbarTab = "decorations" | "sections" | "theme"

export interface FloatingToolbarProps {
  tab: FloatingToolbarTab
  panels: Partial<Record<FloatingToolbarTab, ReactNode>>
  className?: string
}

export const FloatingToolbar = memo(function FloatingToolbar({
  tab,
  panels,
  className,
}: FloatingToolbarProps) {
  const panel = panels[tab]

  return (
    <div
      className={cn(
        "fixed bottom-1 md:bottom-2 left-0 z-50 flex justify-center pointer-events-none w-full",
        className,
      )}
      style={{ right: "var(--canvas-scrollbar-width, 0px)" }}
    >
      {/* AnimatePresence нужна для анимации исчезновения (exit) */}
      <AnimatePresence mode="wait">
        {panel && (
          <motion.div
            key={tab} // key={tab} заставляет Framer Motion реагировать на смену вкладки
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "pointer-events-auto",
              "bg-card/75 backdrop-blur-md",
              "border border-foreground/40",
              "rounded-full md:p-0.5 mb-14 md:mb-0",
              "flex gap-0",
            )}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-0">
              {panel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})