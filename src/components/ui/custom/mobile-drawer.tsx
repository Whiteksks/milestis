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
  title?: string
  description?: string
  children: ReactNode
  showHeader?: boolean
  showCloseButton?: boolean
}

export function MobileDrawer({ 
  open, 
  onOpenChange, 
  trigger, 
  title, 
  description, 
  children,
  showHeader = false,
  showCloseButton = false 
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
        <DrawerHeader className={`${showHeader ? '' : 'sr-only'}`}>
          <DrawerTitle className="mt-2">{title}</DrawerTitle>
          <DrawerDescription >{description}</DrawerDescription>
        </DrawerHeader>

        <div 
          ref={containerRef} 
          tabIndex={-1} 
          className="overflow-y-auto mt-2 pb-2 px-2 outline-none"
        >
        {children}
        </div>

        {showCloseButton && (
        <DrawerFooter className="pt-2">
            <DrawerClose asChild>
            <Button variant="outline">Закрыть</Button>
            </DrawerClose>
        </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}