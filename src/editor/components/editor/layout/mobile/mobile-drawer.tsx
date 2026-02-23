"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  contentClassName?: string
}

export function MobileDrawer({
  isOpen,
  onClose,
  title,
  children,
  contentClassName,
}: MobileDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="md:hidden max-h-[92vh] flex flex-col bg-card border-border/60 focus:outline-none">
        <DrawerHeader className="px-6 py-4 text-left">
          <DrawerTitle className="text-lg tabIndex={-1} font-semibold tracking-tight">
            {title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {title} settings
          </DrawerDescription>
        </DrawerHeader>
        <div 
          className={cn(
            "flex-1 overflow-y-auto overscroll-contain px-4 min-h-120",
            contentClassName
          )}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}