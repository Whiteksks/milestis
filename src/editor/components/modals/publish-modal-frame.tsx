'use client'

import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { MobileDrawer } from '@/editor/components/editor/layout/mobile/mobile-drawer'
import { useIsMobile } from '@/hooks/use-mobile'

/** Shared publication window for every mode; billing and persistence stay in their flows. */
export function PublishModalFrame({ open, onOpenChange, title, description, success, busy, footer, children }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: ReactNode; description: string
  success?: boolean; busy?: boolean; footer: ReactNode; children: ReactNode
}) {
  const isMobile = useIsMobile()
  const handleClose = (next: boolean) => { if (!busy) onOpenChange(next) }
  if (isMobile) return <MobileDrawer open={open} onOpenChange={handleClose} title={<span className="flex items-center justify-center gap-2 text-base">{title}</span>} description={description}
    showHeader={!success} footer={footer} bodyClassName="px-2">{children}</MobileDrawer>
  return <Dialog open={open} onOpenChange={handleClose}>
    <DialogContent className="sm:max-w-xl w-full min-w-0 max-h-[90dvh] overflow-y-auto gap-4">
      <DialogHeader className={success ? 'sr-only' : 'gap-1'}>
        <DialogTitle className="flex items-center gap-2 text-base">{title}</DialogTitle>
        <DialogDescription className="text-xs">{description}</DialogDescription>
      </DialogHeader>
      {children}
      <DialogFooter className="gap-2">{footer}</DialogFooter>
    </DialogContent>
  </Dialog>
}
