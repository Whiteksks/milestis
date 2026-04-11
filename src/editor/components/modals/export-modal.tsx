'use client'

import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Download, Loader2, FileText, Globe, Coins, AlertTriangle } from 'lucide-react'
import { useExportModal } from '@/hooks/useExportModal'
import { PublishForm } from '@/editor/components/modals/publish-modal'
import { exportProject } from '@/lib/projects'
import { toastProject } from '@/lib/toast'
import { projectKeys } from '@/hooks/useProjectsQuery'
import { useUserStore } from '@/hooks/useUserStore'
import { useUiSelector } from '@/editor/lib/store'
import { useIsMobile } from '@/hooks/use-mobile'
import { EXPORT_COST_CREDITS } from '@/editor/components/modals/export-modal.constants'
import { getProjectConfig } from '@/lib/projects/project-type-config'

// ─── Export / Publish modal ───────────────────────────────────────────────────────────
//
// Portfolio  → costs credits, migrates media to public, publishes the site.
//             Publish is mandatory (no toggle), slug is always required.
//
// Photobook  → costs credits, generates PDF for download.
//             Optional toggle to also publish online with a private link.

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  mode: 'portfolio' | 'photobook'
  isExported?: boolean
}

export function ExportModal({ open, onOpenChange, projectId, mode, isExported }: ExportModalProps) {
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)
  const balance = useUserStore((s) => s.profile?.balance?.total ?? 0)
  const { setIsPublished, setPublishedInfo } = useUiSelector((s) => ({
    setIsPublished: s.setIsPublished,
    setPublishedInfo: s.setPublishedInfo,
  }))

  const modalData = useExportModal(projectId, mode)
  const isMobile = useIsMobile()

  // Portfolio: publishing is mandatory — force withPublish on.
  useEffect(() => {
    if (mode === 'portfolio') modalData.setWithPublish(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const exportMutation = useMutation({
    mutationFn: () =>
      exportProject({ projectId, publish: modalData.publishPayload }),
    onSuccess: async (result) => {
      // Photobook: download generated PDF
      if (result.fileDownloadUrl) {
        const link = document.createElement('a')
        link.href = result.fileDownloadUrl
        link.download = ''
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      if (result.publishedSlug) {
        setIsPublished(true)
        setPublishedInfo(result.publishedSlug, modalData.publishPayload?.accessToken)
      }
      if (uid) {
        void queryClient.invalidateQueries({ queryKey: projectKeys.active(uid) })
        void queryClient.invalidateQueries({ queryKey: projectKeys.archived(uid) })
        void queryClient.invalidateQueries({ queryKey: projectKeys.exports(uid) })
      }
      onOpenChange(false)
    },
  })

  function handleSubmit() {
    if (!modalData.canExport || exportMutation.isPending) return
    const promise = exportMutation.mutateAsync()
    toastProject.export(promise)
  }

  const hasEnoughCredits = balance >= EXPORT_COST_CREDITS
  const isPortfolio = mode === 'portfolio'
  const config = getProjectConfig(mode)

  const actionLabel = exportMutation.isPending
    ? config.modal.pendingLabel
    : isPortfolio
      ? config.modal.actionLabel
      : (modalData.withPublish ? 'Export & Publish' : config.modal.actionLabel)

  const title = config.modal.title
  const description = config.modal.description
  const ActionIcon = isPortfolio ? Globe : FileText
  const costLabel = config.modal.costLabel
  const costDesc = config.modal.costDescription

  const reExportWarningText = config.modal.republishWarning

  const body = (
    <div className="space-y-5 py-2">
      {isExported && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            {reExportWarningText}
          </p>
        </div>
      )}

      {/* Cost summary */}
      <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg border border-border/40 bg-background">
            <ActionIcon className="size-3.5 text-primary/70" />
          </div>
          <div>
            <p className="text-sm font-medium">{costLabel}</p>
            <p className="text-xs text-muted-foreground">{costDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <Coins className="size-3.5 text-amber-500" />
          <span>{EXPORT_COST_CREDITS}</span>
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-muted-foreground">Your balance</span>
        <span className={`text-xs font-medium ${hasEnoughCredits ? 'text-foreground' : 'text-destructive'}`}>
          {balance} credits {!hasEnoughCredits && '— insufficient'}
        </span>
      </div>

      <Separator className="bg-border/40" />

      {/* Portfolio: publish is the only outcome — show slug form directly with a clear label */}
      {isPortfolio ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 px-1">
            {'addressLabel' in config.modal ? config.modal.addressLabel : 'Your site address'}
          </p>
          <PublishForm mode="portfolio" data={modalData} />
        </div>
      ) : (
        /* Photobook: optional publish toggle */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="with-publish" className="text-sm font-medium flex items-center gap-2">
                <Globe className="size-3.5 text-primary/70" />
                Publish online
              </Label>
              <p className="text-xs text-muted-foreground pl-5">
                Share a private link to your photobook.
              </p>
            </div>
            <Switch
              id="with-publish"
              checked={modalData.withPublish}
              onCheckedChange={modalData.setWithPublish}
            />
          </div>
          {modalData.withPublish && (
            <PublishForm mode="photobook" data={modalData} />
          )}
        </div>
      )}
    </div>
  )

  const footerButtons = (
    <>
      <Button variant="ghost" size={isMobile ? 'default' : 'sm'} onClick={() => onOpenChange(false)} disabled={exportMutation.isPending} className={isMobile ? 'w-full' : ''}>
        Cancel
      </Button>
      <Button
        size={isMobile ? 'default' : 'sm'}
        onClick={handleSubmit}
        disabled={!modalData.canExport || !hasEnoughCredits || exportMutation.isPending}
        className={`gap-2 ${isMobile ? 'w-full' : ''}`}
      >
        {exportMutation.isPending
          ? <Loader2 className="size-3 animate-spin" />
          : isPortfolio
            ? <Globe className="size-3" />
            : <Download className="size-3" />
        }
        {actionLabel}
      </Button>
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-2 min-h-80">
          <DrawerHeader className="px-0 pt-2 pb-0 text-left">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <ActionIcon className="size-4 text-primary" />
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-xs sr-only">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          {body}
          <DrawerFooter className="px-0 pt-2 flex-col">{footerButtons}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl gap-4">
        <DialogHeader className="gap-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            <ActionIcon className="size-4 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {description}
          </DialogDescription>
        </DialogHeader>
        {body}
        <DialogFooter className="gap-2">{footerButtons}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

