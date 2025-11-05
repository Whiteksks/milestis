"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useRef, useEffect } from "react"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !sheetRef.current) return

    let touchStart = 0
    let touchEnd = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEnd = e.changedTouches[0].screenY
      if (touchEnd - touchStart > 100 && touchStart < 100) {
        onClose()
      }
    }

    const sheet = sheetRef.current
    sheet.addEventListener("touchstart", handleTouchStart)
    sheet.addEventListener("touchend", handleTouchEnd)

    return () => {
      sheet.removeEventListener("touchstart", handleTouchStart)
      sheet.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 md:hidden max-h-[90vh]"
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 500, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle & Header */}
            <div className="sticky top-0 bg-background border-b border-border rounded-t-2xl">
              <div className="flex justify-center pt-2">
                <div className="w-10 h-1 bg-muted rounded-full" />
              </div>

              <div className="flex items-center justify-between p-4">
                {title && <h3 className="text-sm font-medium text-foreground">{title}</h3>}
                <div className="flex-1" />
                <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
                  <X size={18} className="text-muted-foreground" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pb-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
