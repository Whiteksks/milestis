'use client'

import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Globe, Link2, ShieldCheck, Check, X, Loader2 } from 'lucide-react'
import { usePublishModal } from '@/hooks/usePublishModal'
import { getSlugInputChrome } from '@/lib/slug'

// ─── Slug form (step 1) ───────────────────────────────────────────────────────

export function PublishForm({
  mode,
  data,
}: {
  mode: 'portfolio' | 'photobook'
  data: ReturnType<typeof usePublishModal>
}) {
  const { slug, handleSlugChange, slugStatus } = data
  const maxLength = 24
  const chrome = getSlugInputChrome(mode)
  const t = useTranslations('editor.modal.publish')

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <Label
            htmlFor="slug"
            className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] flex items-center gap-2"
          >
            {mode === 'portfolio'
              ? <Globe className="size-3.5 text-primary/60" />
              : <Link2 className="size-3.5 text-primary/60" />}
            {mode === 'portfolio' ? t('form.subdomainSettings') : t('form.linkIdentifier')}
          </Label>
          <span
            className={`text-[10px] font-mono font-medium ${slug.length >= maxLength ? 'text-destructive' : 'text-muted-foreground/40'}`}
          >
            {slug.length}<span className="opacity-50">/{maxLength}</span>
          </span>
        </div>

        <div className="group relative flex items-center rounded-2xl border border-border/50 bg-muted/5 shadow-sm focus-within:ring-[5px] focus-within:ring-primary/5 focus-within:border-primary/30 transition-all duration-300 overflow-hidden w-full">
          <div className="flex items-center px-4 h-13 bg-muted/30 border-r border-border/40 text-muted-foreground/70 text-sm font-medium select-none shrink-0 italic font-serif">
            {chrome.prefix}
          </div>
          <div className="relative flex-1 min-w-0 flex items-center bg-background/50">
            <Input
              id="slug"
              value={slug}
              onChange={(e) =>
                e.target.value.length <= maxLength && handleSlugChange(e.target.value)
              }
              placeholder={
                mode === 'portfolio'
                  ? t('form.placeholderPortfolio')
                  : t('form.placeholderPhotobook')
              }
              className="h-13 border-0 bg-transparent px-4 text-base font-medium placeholder:text-muted-foreground/20 focus-visible:ring-0 w-full truncate"
              autoComplete="off"
              spellCheck={false}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 shrink-0 pl-2">
              <SlugStatusIcon status={slugStatus} />
            </div>
          </div>
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

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/[0.02] border border-primary/5 shadow-inner">
        <div className="p-1.5 rounded-lg bg-background border border-border/40">
          <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground/80 font-medium pt-0.5">
          {mode === 'photobook' ? t('form.privacyFirst') : t('form.globalAccess')}
        </p>
      </div>
    </div>
  )
}

// ─── Slug status helpers ──────────────────────────────────────────────────────

export function SlugStatusIcon({
  status,
}: {
  status: ReturnType<typeof usePublishModal>['slugStatus']
}) {
  if (status === 'checking') return <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
  if (status === 'available') return <Check className="size-3.5 text-emerald-500" />
  if (status === 'taken') return <X className="size-3.5 text-destructive" />
  if (status === 'invalid') return <X className="size-3.5 text-destructive" />
  if (status === 'reserved') return <X className="size-3.5 text-amber-500" />
  return null
}

export function SlugStatusMessage({
  status,
  mode,
}: {
  status: ReturnType<typeof usePublishModal>['slugStatus']
  mode: 'portfolio' | 'photobook'
}) {
  const t = useTranslations('editor.modal.publish')
  if (status === 'taken')
    return <p className="text-xs text-destructive">{t('form.taken')}</p>
  if (status === 'invalid')
    return <p className="text-xs text-destructive">{t('form.invalid')}</p>
  if (status === 'reserved')
    return <p className="text-xs text-amber-600 dark:text-amber-400">{t('form.reserved')}</p>
  if (status === 'available' && mode === 'portfolio')
    return <p className="text-xs text-emerald-600 dark:text-emerald-400">{t('form.available')}</p>
  return null
}
