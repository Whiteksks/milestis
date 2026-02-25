"use client"

import { memo, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useCanvasScrollContainer } from "@/editor/components/editor/canvas-scroll-context"
import { useScrollAtBottom } from "@/editor/hooks/use-scroll-at-bottom"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const scrollRef = useCanvasScrollContainer()
  const atBottom = useScrollAtBottom(scrollRef ?? { current: null }, 8)
  const isMobile = useIsMobile()
  // Desktop: docks to viewport bottom edge
  const docked = atBottom && !isMobile
  // Mobile: docks flush on top of MobileBottomNav
  const mobileDocked = atBottom && isMobile

  return (
    // Static container — fixed to bottom, no layout animation
    <div
      className={cn(
        "fixed bottom-0 left-0 z-50 flex justify-center pointer-events-none w-full",
        className,
      )}
      style={{ right: "var(--canvas-scrollbar-width, 0px)" }}
    >
      {/* AnimatePresence needed for exit animation when tab changes */}
      <AnimatePresence mode="wait">
        {panel && (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: docked
                ? 0          // desktop: flush with viewport bottom
                : mobileDocked
                  ? 8        // mobile docked: +8px closes the gap that opens when nav snaps to y:0
                  : -8,      // floating: lift 8px off the bottom edge
              borderRadius: (docked || mobileDocked) ? "24px 24px 0 0" : "24px",
            }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              opacity: { duration: 0.15, ease: "easeOut" },
              scale: { duration: 0.15, ease: "easeOut" },
              y: { type: "spring", stiffness: 350, damping: 35 },
              borderRadius: { type: "spring", stiffness: 350, damping: 35 },
            }}
            className={cn(
              "pointer-events-auto",
              "bg-card/75 backdrop-blur-md",
              "border border-foreground/40",
              // Remove bottom border when docked on mobile so it merges seamlessly with nav
              mobileDocked && "border-b-0",
              "md:p-0.5 mb-14 md:mb-0",
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