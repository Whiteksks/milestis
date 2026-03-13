"use client"

import { memo, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useCanvasScrollContainer } from "@/editor/components/editor/canvas-scroll-context"
import { useScrollAtBottom } from "@/editor/hooks/use-scroll-at-bottom"
import { useIsMobile } from "@/hooks/use-mobile"

import type { FloatingToolbarTab } from '@/editor/lib/editor-tabs'
export type { FloatingToolbarTab }

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
  const scrollRef = useCanvasScrollContainer()
  const atBottom = useScrollAtBottom(scrollRef ?? { current: null }, 8)
  const isMobile = useIsMobile()
  // Desktop: docks to viewport bottom edge
  const docked = atBottom && !isMobile
  // Mobile: docks flush on top of MobileBottomNav
  const mobileDocked = atBottom && isMobile

  const targetRadius = (docked || mobileDocked) ? "24px 24px 0 0" : "24px";

  return (
    // Static container — fixed to bottom, no layout animation
    <div
      className={cn(
        "fixed bottom-0 left-0 z-50 flex justify-center pointer-events-none w-full",
        className,
      )}
      style={{ right: "var(--canvas-scrollbar-width, 0px)" }}
    >

      <AnimatePresence mode="wait">
        {panel && (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: docked
                ? 0
                : mobileDocked
                  ? 8
                  : -8,
            }}
            exit={{ opacity: 0, y: 16 }}
            transition={{
              opacity: { duration: 0.12, ease: "easeOut"},
                y: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
            }}
            style={{ borderRadius: targetRadius }}
            className={cn(
              "pointer-events-auto",
              "bg-card/75 backdrop-blur-md",
              "border border-foreground/40",
              mobileDocked && "border-b-0",
              "md:p-0.5 mb-14 md:mb-0",
              "flex gap-0",
              "transform-gpu will-change-transform will-change-opacity"
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