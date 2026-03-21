'use client'

import { useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Globe,
  Lock,
  Loader2,
  Check,
  X,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { usePublishModal } from '@/hooks/usePublishModal'
import { usePublishMutation } from '@/hooks/useProjectMutations'
import { useUiSelector } from '@/editor/lib/store'

interface PublishModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  mode: 'portfolio' | 'photobook'
}

export function PublishModal({ open, onOpenChange, projectId, mode }: PublishModalProps) {
  const { setIsPublished, setPublishedInfo } = useUiSelector((s) => ({
    setIsPublished: s.setIsPublished,
    setPublishedInfo: s.setPublishedInfo,
  }))

  const publishMutation = usePublishMutation()
  const { slug, handleSlugChange, slugStatus, accessToken, portfolioUrl, photobookUrl, canPublish } =
    usePublishModal(projectId, mode)

  const publicUrl = mode === 'portfolio' ? portfolioUrl : photobookUrl

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
  }, [])

  function handlePublish() {
    if (!canPublish) return
    publishMutation.mutate(
      { projectId, slug, accessToken: mode === 'photobook' ? accessToken : undefined },
      {
        onSuccess: () => {
          setIsPublished(true)
          setPublishedInfo(slug, mode === 'photobook' ? accessToken : undefined)
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'portfolio' ? (
              <Globe className="size-4 text-primary" />
            ) : (
              <Lock className="size-4 text-primary" />
            )}
            {mode === 'portfolio' ? 'Publish Portfolio' : 'Publish Photobook'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'portfolio'
              ? 'Your portfolio will be publicly available at a custom subdomain.'
              : 'Your photobook will only be accessible with the generated link.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Slug input */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              {mode === 'portfolio' ? 'Subdomain' : 'Link name'}
            </Label>
            <div className="flex items-center gap-2">
              {mode === 'portfolio' && (
                <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
                  https://
                </span>
              )}
              <div className="relative flex-1">
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder={mode === 'portfolio' ? 'john-portfolio' : 'summer-trip'}
                  className="pr-8"
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <SlugStatusIcon status={slugStatus} />
                </div>
              </div>
              {mode === 'portfolio' && (
                <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
                  .milestis.site
                </span>
              )}
            </div>
            <SlugStatusMessage status={slugStatus} mode={mode} />
          </div>

          {/* URL preview */}
          {publicUrl && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                {mode === 'portfolio' ? 'Your portfolio URL' : 'Share link (keep it private)'}
              </Label>
              <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/40 px-3 py-2">
                <span className="flex-1 text-xs font-mono text-foreground/80 truncate select-all">
                  {publicUrl}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopy(publicUrl)}
                  title="Copy link"
                >
                  <Copy className="size-3" />
                </Button>
              </div>

              {mode === 'photobook' && (
                <p className="text-xs text-muted-foreground">
                  Anyone with this link and token can view your photobook. Store it safely.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={publishMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!canPublish || publishMutation.isPending}
            className="gap-2"
          >
            {publishMutation.isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : publicUrl ? (
              <ExternalLink className="size-3" />
            ) : (
              <Globe className="size-3" />
            )}
            {publishMutation.isPending ? 'Publishing...' : 'Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Small helper components ──────────────────────────────────────────────────

function SlugStatusIcon({ status }: { status: ReturnType<typeof usePublishModal>['slugStatus'] }) {
  if (status === 'checking') return <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
  if (status === 'available') return <Check className="size-3.5 text-emerald-500" />
  if (status === 'taken') return <X className="size-3.5 text-destructive" />
  if (status === 'invalid') return <X className="size-3.5 text-destructive" />
  return null
}

function SlugStatusMessage({
  status,
  mode,
}: {
  status: ReturnType<typeof usePublishModal>['slugStatus']
  mode: 'portfolio' | 'photobook'
}) {
  if (status === 'taken')
    return <p className="text-xs text-destructive">This subdomain is already taken.</p>
  if (status === 'invalid')
    return (
      <p className="text-xs text-destructive">
        Use only lowercase letters, numbers, and hyphens (3–63 chars).
      </p>
    )
  if (status === 'available' && mode === 'portfolio')
    return <p className="text-xs text-emerald-600 dark:text-emerald-400">Subdomain is available!</p>
  return null
}
