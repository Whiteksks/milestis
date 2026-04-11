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
import { Loader2, Globe } from 'lucide-react'
import { usePublishModal } from '@/hooks/usePublishModal'
import { PublishForm } from '@/editor/components/modals/publish-modal'
import { publishExportedProject } from '@/lib/projects'
import { projectKeys } from '@/hooks/useProjectsQuery'
import { useUiSelector } from '@/editor/lib/store'
import { useUserStore } from '@/hooks/useUserStore'
import { useIsMobile } from '@/hooks/use-mobile'
import { toast } from 'sonner'

interface PublishExportedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  /** This modal is exclusively for the photobook two-step flow (export → publish). */
  mode: 'photobook'
}

export function PublishExportedModal({
  open,
  onOpenChange,
  projectId,
  mode,
}: PublishExportedModalProps) {
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)
  const { setIsPublished, setPublishedInfo } = useUiSelector((s) => ({
    setIsPublished: s.setIsPublished,
    setPublishedInfo: s.setPublishedInfo,
  }))
  const isMobile = useIsMobile()

  const modalData = usePublishModal(projectId, mode)

  const publishMutation = useMutation({
    mutationFn: () =>
      publishExportedProject({
        projectId,
        slug: modalData.slug,
        accessToken: mode === 'photobook' ? modalData.accessToken : undefined,
      }),
    onSuccess: (result) => {
      setIsPublished(true)
      setPublishedInfo(result.publishedSlug, mode === 'photobook' ? modalData.accessToken : undefined)
      if (uid) void queryClient.invalidateQueries({ queryKey: projectKeys.archived(uid) })
      onOpenChange(false)
      toast.success('Published!')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Publish failed')
    },
  })

  const label = publishMutation.isPending ? 'Publishing…' : 'Publish'

  const body = (
    <div className="py-2">
      <PublishForm mode={mode} data={modalData} />
    </div>
  )

  const footer = (
    <div className={`flex gap-2 ${isMobile ? 'flex-col-reverse' : 'justify-end'}`}>
      <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={publishMutation.isPending}>
        Cancel
      </Button>
      <Button
        onClick={() => publishMutation.mutate()}
        disabled={!modalData.canPublish || publishMutation.isPending}
        className="gap-2"
      >
        {publishMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Globe className="size-4" />
        )}
        {label}
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-2 min-h-64">
          <DrawerHeader className="px-0 pt-2 pb-0 text-left">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4 text-primary" />
              Publish project
            </DrawerTitle>
            <DrawerDescription className="text-xs sr-only">
              Make your exported project accessible online.
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
      <DialogContent className="sm:max-w-md gap-4">
        <DialogHeader className="gap-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Globe className="size-4 text-primary" />
            Publish project
          </DialogTitle>
          <DialogDescription className="text-xs">
            {mode === 'photobook'
              ? 'Share a private link to your photobook.'
              : 'Make your portfolio publicly accessible.'}
          </DialogDescription>
        </DialogHeader>
        {body}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
