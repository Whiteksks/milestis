'use client'

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
import { Download, Loader2, FileText, Archive, Globe, Coins, AlertTriangle } from 'lucide-react'
import { useExportModal } from '@/hooks/useExportModal'
import { PublishForm } from '@/editor/components/modals/publish-modal'
import { exportProject } from '@/lib/projects'
import { toastProject } from '@/lib/toast'
import { projectKeys } from '@/hooks/useProjectsQuery'
import { useUserStore } from '@/hooks/useUserStore'
import { useUiSelector } from '@/editor/lib/store'
import { useIsMobile } from '@/hooks/use-mobile'
import { EXPORT_COST_CREDITS } from '@/editor/components/modals/export-modal.constants'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  mode: 'portfolio' | 'photobook'
  /** Whether the project was previously exported. Shows a re-export warning. */
  isExported?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  const exportMutation = useMutation({
    mutationFn: () =>
      exportProject({ projectId, publish: modalData.publishPayload }),
    onSuccess: (result) => {
      // Trigger file download.
      const link = document.createElement('a')
      link.href = result.fileDownloadUrl
      link.download = ''
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Update editor UI if the export included a publish.
      if (result.publishedSlug) {
        setIsPublished(true)
        setPublishedInfo(
          result.publishedSlug,
          modalData.publishPayload?.accessToken,
        )
      }

      // Invalidate dashboard cache so the export record and storage stats refresh.
      if (uid) {
        void queryClient.invalidateQueries({ queryKey: projectKeys.active(uid) })
        void queryClient.invalidateQueries({ queryKey: projectKeys.archived(uid) })
        void queryClient.invalidateQueries({ queryKey: projectKeys.exports(uid) })
      }

      onOpenChange(false)
    },
  })

  function handleExport() {
    if (!modalData.canExport || exportMutation.isPending) return
    const promise = exportMutation.mutateAsync()
    toastProject.export(promise)
  }

  const hasEnoughCredits = balance >= EXPORT_COST_CREDITS
  const fileLabel = mode === 'photobook' ? 'PDF' : 'ZIP'
  const FileIcon = mode === 'photobook' ? FileText : Archive

  const body = (
    <ExportForm
      mode={mode}
      modalData={modalData}
      balance={balance}
      hasEnoughCredits={hasEnoughCredits}
      fileLabel={fileLabel}
      FileIcon={FileIcon}
      isReExport={isExported}
    />
  )

  const footer = (
    <ExportFooter
      isPending={exportMutation.isPending}
      canExport={modalData.canExport && hasEnoughCredits}
      fileLabel={fileLabel}
      withPublish={modalData.withPublish}
      onExport={handleExport}
      onCancel={() => onOpenChange(false)}
      isMobile={isMobile ?? false}
    />
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-2 min-h-80">
          <DrawerHeader className="px-0 pt-2 pb-0 text-left">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <FileIcon className="size-4 text-primary" />
              Export {fileLabel}
            </DrawerTitle>
            <DrawerDescription className="text-xs sr-only">
              Export your project as a {fileLabel} file.
            </DrawerDescription>
          </DrawerHeader>
          {body}
          <DrawerFooter className="px-0 pt-2">{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl gap-4">
        <DialogHeader className="gap-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileIcon className="size-4 text-primary" />
            Export {fileLabel}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {mode === 'photobook'
              ? 'Download your photobook as a print-ready PDF.'
              : 'Download your portfolio as a portable ZIP archive.'}
          </DialogDescription>
        </DialogHeader>
        {body}
        <DialogFooter className="gap-2">{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExportForm({
  mode,
  modalData,
  balance,
  hasEnoughCredits,
  fileLabel,
  FileIcon,
  isReExport,
}: {
  mode: 'portfolio' | 'photobook'
  modalData: ReturnType<typeof useExportModal>
  balance: number
  hasEnoughCredits: boolean
  fileLabel: string
  FileIcon: React.ElementType
  isReExport?: boolean
}) {
  return (
    <div className="space-y-5 py-2">
      {/* Re-export warning */}
      {isReExport && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <span className="font-semibold">This will replace your previous export.</span>{' '}
            Download the current {fileLabel} first if you still need it.
          </p>
        </div>
      )}

      {/* Cost summary */}
      <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg border border-border/40 bg-background">
            <FileIcon className="size-3.5 text-primary/70" />
          </div>
          <div>
            <p className="text-sm font-medium">{fileLabel} Export</p>
            <p className="text-xs text-muted-foreground">
              {mode === 'photobook' ? 'Print-ready PDF' : 'Portable ZIP archive'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <Coins className="size-3.5 text-amber-500" />
          <span>{EXPORT_COST_CREDITS}</span>
        </div>
      </div>

      {/* Balance indicator */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-muted-foreground">Your balance</span>
        <span className={`text-xs font-medium ${hasEnoughCredits ? 'text-foreground' : 'text-destructive'}`}>
          {balance} credits {!hasEnoughCredits && '— insufficient'}
        </span>
      </div>

      <Separator className="bg-border/40" />

      {/* Publish toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="with-publish" className="text-sm font-medium flex items-center gap-2">
              <Globe className="size-3.5 text-primary/70" />
              Publish online
            </Label>
            <p className="text-xs text-muted-foreground pl-5">
              {mode === 'photobook'
                ? 'Share a private link to your photobook.'
                : 'Make your portfolio publicly accessible.'}
            </p>
          </div>
          <Switch
            id="with-publish"
            checked={modalData.withPublish}
            onCheckedChange={modalData.setWithPublish}
          />
        </div>

        {modalData.withPublish && (
          <PublishForm mode={mode} data={modalData} />
        )}
      </div>
    </div>
  )
}

function ExportFooter({
  isPending,
  canExport,
  fileLabel,
  withPublish,
  onExport,
  onCancel,
  isMobile,
}: {
  isPending: boolean
  canExport: boolean
  fileLabel: string
  withPublish: boolean
  onExport: () => void
  onCancel: () => void
  isMobile: boolean
}) {
  const label = isPending
    ? 'Exporting…'
    : withPublish
      ? `Export & Publish`
      : `Export ${fileLabel}`

  if (isMobile) {
    return (
      <>
        <Button onClick={onExport} disabled={!canExport || isPending} className="gap-2 w-full">
          {isPending ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
          {label}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isPending} className="w-full">
          Cancel
        </Button>
      </>
    )
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
        Cancel
      </Button>
      <Button size="sm" onClick={onExport} disabled={!canExport || isPending} className="gap-2">
        {isPending ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
        {label}
      </Button>
    </>
  )
}
