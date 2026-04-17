'use client'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Globe,
  Lock,
  Loader2,
  Check,
  X,
  ExternalLink,
  Link2,
  ShieldCheck,
  Coins,
  AlertTriangle,
} from 'lucide-react'
import { usePublishModal } from '@/hooks/usePublishModal'
import { usePublishMutation } from '@/hooks/useProjectMutations'
import { useUiSelector } from '@/editor/lib/store'
import { useIsMobile } from '@/hooks/use-mobile'
import { useUserStore } from '@/hooks/useUserStore'
import { getProjectConfig } from '@/lib/projects/project-type-config'
import { getSlugInputChrome } from '@/lib/slug'

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

  const balance = useUserStore((s) => s.profile?.balance?.total ?? 0)
  const config = getProjectConfig(mode)
  const creditCost = config.creditCost
  const hasEnoughCredits = balance >= creditCost

  const publishMutation = usePublishMutation()
  const modalData = usePublishModal(projectId, mode)
  const isMobile = useIsMobile()

  function handlePublish() {
    if (!modalData.canPublish || !hasEnoughCredits) return
    publishMutation.mutate(
      { projectId, slug: modalData.slug, accessToken: mode === 'photobook' ? modalData.accessToken : undefined },
      {
        onSuccess: () => {
          setIsPublished(true)
          setPublishedInfo(modalData.slug, mode === 'photobook' ? modalData.accessToken : undefined)
          onOpenChange(false)
        },
      },
    )
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-2 min-h-80">
          <DrawerHeader className="px-0 pt-2 pb-0 text-left">
            <DrawerTitle className="flex items-center gap-2 text-base text-center">
              {mode === 'portfolio' ? <Globe className="size-4 text-primary" /> : <Lock className="size-4 text-primary" />}
              {mode === 'portfolio' ? 'Publish Portfolio' : 'Publish Photobook'}
            </DrawerTitle>
            <DrawerDescription className="text-xs sr-only">
              {mode === 'portfolio'
                ? 'Publicly available at a custom subdomain.'
                : 'Only accessible with the generated link.'}
            </DrawerDescription>
          </DrawerHeader>
          <PublishForm mode={mode} data={modalData} />
          <CreditCostRow creditCost={creditCost} balance={balance} />
          <DrawerFooter className="px-0 pt-2">
            <Button
              onClick={handlePublish}
              disabled={!modalData.canPublish || !hasEnoughCredits || publishMutation.isPending}
              className="gap-2 w-full"
            >
              <PublishButtonIcon isPending={publishMutation.isPending} hasUrl={!!modalData.portfolioUrl || !!modalData.photobookUrl} />
              {publishMutation.isPending ? 'Publishing...' : 'Publish'}
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={publishMutation.isPending} className="w-full">
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl gap-4">
        <DialogHeader className="gap-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            {mode === 'portfolio' ? <Globe className="size-4 text-primary" /> : <Lock className="size-4 text-primary" />}
            {mode === 'portfolio' ? 'Publish Portfolio' : 'Publish Photobook'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {mode === 'portfolio'
              ? 'Publicly available at a custom subdomain.'
              : 'Only accessible with the generated link.'}
          </DialogDescription>
        </DialogHeader>
        <PublishForm mode={mode} data={modalData} />
        <CreditCostRow creditCost={creditCost} balance={balance} />
        <DialogFooter className="gap-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} disabled={publishMutation.isPending}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={!modalData.canPublish || !hasEnoughCredits || publishMutation.isPending}
            className="gap-2"
          >
            <PublishButtonIcon isPending={publishMutation.isPending} hasUrl={!!modalData.portfolioUrl || !!modalData.photobookUrl} />
            {publishMutation.isPending ? 'Publishing...' : 'Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export function PublishForm({ mode, data }: { mode: 'portfolio' | 'photobook'; data: ReturnType<typeof usePublishModal> }) {
  const { slug, handleSlugChange, slugStatus } = data
  const maxLength = 24
  const chrome = getSlugInputChrome(mode)

  return (
    <div className="space-y-4 py-2">
      {/* SECTION 1: CONFIGURATION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <Label htmlFor="slug" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] flex items-center gap-2">
            {mode === 'portfolio' ? <Globe className="size-3.5 text-primary/60" /> : <Link2 className="size-3.5 text-primary/60" />}
            {mode === 'portfolio' ? 'Subdomain Settings' : 'Link Identifier'}
          </Label>
          <span className={`text-[10px] font-mono font-medium ${slug.length >= maxLength ? 'text-destructive' : 'text-muted-foreground/40'}`}>
            {slug.length}<span className="opacity-50">/{maxLength}</span>
          </span>
        </div>

        <div className="group relative flex items-center rounded-2xl border border-border/50 bg-muted/5 shadow-sm focus-within:ring-[5px] focus-within:ring-primary/5 focus-within:border-primary/30 transition-all duration-300 overflow-hidden w-full">
          
          {/* Левая часть (Префикс) */}
          <div className="flex items-center px-4 h-13 bg-muted/30 border-r border-border/40 text-muted-foreground/70 text-sm font-medium select-none shrink-0 italic font-serif">
            {chrome.prefix}
          </div>
          
          <div className="relative flex-1 min-w-0 flex items-center bg-background/50">
            <Input
              id="slug"
              value={slug}
              onChange={(e) => e.target.value.length <= maxLength && handleSlugChange(e.target.value)}
              placeholder={mode === 'portfolio' ? 'unique-name' : 'moment-2026'}
              className="h-13 border-0 bg-transparent px-4 text-base font-medium placeholder:text-muted-foreground/20 focus-visible:ring-0 w-full truncate"
              autoComplete="off"
              spellCheck={false}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 shrink-0 pl-2">
               <SlugStatusIcon status={slugStatus} />
            </div>
          </div>

          {/* Правая часть (только для портфолио) */}
          {chrome.suffix && (
            <div className="flex items-center px-4 h-13 bg-muted/30 border-l border-border/40 text-muted-foreground/70 text-sm font-medium select-none shrink-0 tracking-tight">
              {chrome.suffix}
            </div>
          )}
        </div>
        
        <div className="px-1 min-h-[20px]">
           <SlugStatusMessage status={slugStatus} mode={mode} />
        </div>
      </div>

      {/* POLICY FOOTER */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/[0.02] border border-primary/5 shadow-inner">
        <div className="p-1.5 rounded-lg bg-background border border-border/40">
          <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground/80 font-medium pt-0.5">
          {mode === 'photobook' 
            ? "Privacy First: This link is encrypted and hidden from search engines. Only people with the direct URL can see your photos."
            : "Global Access: Your site will be optimized for fast loading worldwide. You can update your content or domain at any time."
          }
        </p>
      </div>
    </div>
  )
}
function CreditCostRow({ creditCost, balance }: { creditCost: number; balance: number }) {
  const insufficient = balance < creditCost
  return (
    <div className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 border text-xs font-medium ${insufficient ? 'border-destructive/30 bg-destructive/5' : 'border-border/50 bg-muted/30'}`}>
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Coins className="size-3.5" />
        Cost
      </span>
      <div className="flex items-center gap-2">
        {insufficient && <AlertTriangle className="size-3 text-destructive" />}
        <span className={insufficient ? 'text-destructive' : 'text-foreground'}>
          {creditCost} credits
          <span className="text-muted-foreground/60 ml-1.5 font-normal">(balance: {balance})</span>
        </span>
      </div>
    </div>
  )
}

function PublishButtonIcon({ isPending, hasUrl }: { isPending: boolean; hasUrl: boolean }) {
  if (isPending) return <Loader2 className="size-3 animate-spin" />
  if (hasUrl) return <ExternalLink className="size-3" />
  return <Globe className="size-3" />
}

// ─── Small helpers ────────────────────────────────────────────────────────────

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
    return <p className="text-xs text-destructive">Lowercase letters, numbers, hyphens (3–24 chars).</p>
  if (status === 'available' && mode === 'portfolio')
    return <p className="text-xs text-emerald-600 dark:text-emerald-400">Subdomain is available!</p>
  return null
}
