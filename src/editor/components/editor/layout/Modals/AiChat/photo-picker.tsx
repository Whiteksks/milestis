'use client'

import { UploadTile } from '../upload-tile'

import { Upload, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  getProjectImageDisplayUrl,
  getProjectImageSelectUrl,
  type ProjectImageDoc,
  type UploadingEntry,
} from '@/editor/hooks/use-project-images'

interface PhotoPickerProps {
  selectedUrls: string[]
  images: ProjectImageDoc[]
  pendingUploads: UploadingEntry[]
  onToggle: (url: string) => void
  onToggleAll: () => void
  onRetry: (id: string) => void
  onDismiss: (id: string) => void
  onUploadClick: () => void
}

export function PhotoPicker({
  selectedUrls,
  images,
  pendingUploads,
  onToggle,
  onToggleAll,
  onUploadClick,
  onRetry,
  onDismiss,
}: PhotoPickerProps) {
  const t = useTranslations('editor.layout.aiChat')
  const isEmpty = images.length === 0 && pendingUploads.length === 0
  const allSelected = images.length > 0 && images.every((img) => selectedUrls.includes(getProjectImageSelectUrl(img)))

  return (
    <div className="shrink-0 border-t border-border bg-background p-2.5 space-y-2">
      {/* Верхняя панель управления */}
      {images.length > 0 && (
        <div className="flex items-center justify-between min-h-[20px] px-0.5">
          <span className="text-xs text-muted-foreground leading-none">
            {selectedUrls.length > 0 ? t('selectedCount', { count: selectedUrls.length }) : null}
          </span>
          <button
            type="button"
            onClick={onToggleAll}
            className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded leading-none"
          >
            {allSelected ? t('deselectAll') : t('selectAll')}
          </button>
        </div>
      )}

      {/* Горизонтальный скролл с элементами */}
      <div className="flex gap-2.5 overflow-x-auto items-center scrollbar-none">
        {/* Кнопка загрузки */}
        {isEmpty ? (
          <button
            type="button"
            onClick={onUploadClick}
            className={cn(
              'flex-1 h-[52px] min-w-[200px] px-3.5 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary',
              'flex items-center justify-between transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <div className="flex items-center gap-2.5 text-left">
              <Upload className="h-4 w-4 shrink-0 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">
                  {t('addPhotosCta')}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {t('addPhotosCtaSubtitle')}
                </span>
              </div>
            </div>
            <Plus className="h-4 w-4 shrink-0 text-primary" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onUploadClick}
            aria-label={t('addPhotosCta')}
            className={cn(
              'shrink-0 h-[52px] w-[52px] rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-accent text-muted-foreground hover:text-foreground',
              'flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <Upload className="h-5 w-5" />
          </button>
        )}

        {/* Процесс загрузки */}
        {pendingUploads.map((u) => (<UploadTile key={u.id} entry={u} compact onRetry={onRetry} onDismiss={onDismiss} />))}

        {/* Загруженные изображения */}
        {images.map((img) => {
          const displayUrl = getProjectImageDisplayUrl(img)
          const selectUrl = getProjectImageSelectUrl(img)
          const isSelected = selectedUrls.includes(selectUrl)

          return (
            <button
              key={img.id}
              type="button"
              onClick={() => onToggle(selectUrl)}
              className={cn(
                'relative shrink-0 h-[52px] w-[52px] rounded-lg overflow-hidden transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected ? 'ring-2 ring-inset ring-primary' : 'hover:opacity-90'
              )}
            >
              <Image
                src={displayUrl}
                alt=""
                fill
                unoptimized
                sizes="52px"
                className="object-cover"
              />

              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}