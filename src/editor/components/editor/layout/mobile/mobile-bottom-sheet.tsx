"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  contentClassName?: string
  contentPadding?: boolean
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  contentClassName,
  contentPadding = true,
}: MobileBottomSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="p-0 pb-6 md:hidden rounded-t-3xl bg-card border-border/60">
        {/* Handle bar */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <SheetHeader className="px-6 py-3 border-b border-border/40 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-base font-semibold text-foreground tracking-tight">
            {title}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Mobile settings panel
          </SheetDescription>
        </SheetHeader>

        {isOpen && (
          <ScrollArea className="overflow-y-auto" style={{ height: 'calc(85vh - 120px)' }}>
            <div className={cn(contentPadding && 'p-5', contentClassName)}>
              {children}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}
