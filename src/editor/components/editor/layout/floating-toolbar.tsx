"use client"

import { memo, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion" // Импортируем motion
import { cn } from "@/lib/utils"

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
    // AnimatePresence нужен для анимации выхода (exit), когда panel становится null
    <AnimatePresence mode="wait">
      {panel ? (
        <motion.div
          key={tab} // key заставит анимацию проигрываться при смене вкладок
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "anticipate" }}
          className={cn(
            "fixed bottom-1 md:bottom-2 left-0 z-50 flex justify-center pointer-events-none w-full",
            className,
          )}
          style={{ right: "var(--canvas-scrollbar-width, 0px)" }}
        >
          <div
            className={cn(
              "pointer-events-auto",
              "bg-white/55 backdrop-blur-sm",
              "border border-slate-200",
              "shadow-lg shadow-slate-900/10",
              "rounded-full",
              "p-1.5",
              "flex gap-0",
            )}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-0">
              {panel}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
})