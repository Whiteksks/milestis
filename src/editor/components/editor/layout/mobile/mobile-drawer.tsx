'use client'

import { ReactNode, useRef } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title?: ReactNode
  description?: string
  children: ReactNode
  showHeader?: boolean
  showCloseButton?: boolean
  /** Custom footer content — replaces the default close button when provided */
  footer?: ReactNode
  /** Extra className for the scrollable children container */
  bodyClassName?: string
}

export function MobileDrawer({ 
  open, 
  onOpenChange, 
  trigger, 
  title, 
  description, 
  children,
  showHeader = false,
  showCloseButton = false,
  footer,
  bodyClassName,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          containerRef.current?.focus()
        }}
      >
        <DrawerHeader className={showHeader ? 'shrink-0' : 'sr-only'}>
          <DrawerTitle className="mt-2">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div 
          ref={containerRef} 
          tabIndex={-1} 
          className={`min-h-0 overflow-y-auto mt-2 pb-2 px-2 outline-none${bodyClassName ? ` ${bodyClassName}` : ''}`}
        >
          {children}
        </div>

        {(footer || showCloseButton) && (
          <DrawerFooter className="shrink-0 pt-2">
            {footer ?? (
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
