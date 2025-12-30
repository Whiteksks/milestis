"use client"

import { X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useEffect } from 'react'

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function MobileBottomSheet({ isOpen, onClose, title, children }: MobileBottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="p-0 pb-4 md:hidden rounded-t-3xl">
        {/* Handle bar */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        <SheetHeader className="px-6 py-3 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-semibold text-slate-900">
            {title}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Mobile settings panel
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="overflow-y-auto" style={{ height: 'calc(85vh - 120px)' }}>
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
