'use client'

import { FileImage, Loader2, RotateCcw, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { UploadingEntry } from '@/editor/hooks/use-project-images'
import { cn } from '@/lib/utils'

export function UploadTile({ entry, compact = false, onRetry, onDismiss }: {
  entry: UploadingEntry
  compact?: boolean
  onRetry: (id: string) => void
  onDismiss: (id: string) => void
}) {
  const t = useTranslations('editor.controls.media')
  const failed = entry.status === 'failed'
  const status = entry.status === 'uploading' ? `${entry.progress}%`
    : failed ? t(`uploadErrors.${entry.errorCode && t.has(`uploadErrors.${entry.errorCode}`) ? entry.errorCode : 'processingFailed'}`)
    : t(entry.status === 'queued' ? 'uploadQueued' : 'uploadProcessing')
  return (
    <div className={cn('relative rounded-xl border bg-muted/40 p-2 flex flex-col items-center justify-center gap-1 text-center overflow-hidden',
      compact ? 'shrink-0 w-40 min-h-[76px]' : 'aspect-square', failed && 'border-destructive/50')} title={entry.name}>
      {entry.status === 'processing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4 text-muted-foreground" />}
      <span className="text-[10px] truncate max-w-full">{entry.name}</span>
      <span role={failed ? 'alert' : 'status'} className={cn('text-xs', failed && 'text-destructive')}>{status}</span>
      {failed && <div className="flex gap-3">
        {entry.file && <button type="button" className="text-xs flex items-center gap-1" onClick={() => onRetry(entry.id)}><RotateCcw className="h-3 w-3" />{t('uploadRetry')}</button>}
        <button type="button" aria-label={t('uploadDismiss')} onClick={() => onDismiss(entry.id)}><X className="h-4 w-4" /></button>
      </div>}
      {entry.status === 'uploading' && <div className="absolute bottom-0 left-0 h-1 bg-primary" style={{ width: `${entry.progress}%` }} />}
    </div>
  )
}
