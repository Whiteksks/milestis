'use client'

import { useEffect, useRef, useState } from 'react'
import { UploadTile } from '../upload-tile'

import { Upload, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollEdges, setScrollEdges] = useState({ previous: false, next: false })

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    const update = () => setScrollEdges({
      previous: element.scrollLeft > 1,
      next: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    })
    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => { element.removeEventListener('scroll', update); observer.disconnect() }
  }, [images.length, pendingUploads.length])

  function scrollPhotos(direction: number) {
    const element = scrollRef.current
    if (!element) return
    element.scrollBy({ left: direction * Math.max(62, element.clientWidth * 0.8), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return (
    <div className="min-w-0 w-full shrink-0 border-t border-border bg-background p-2.5 space-y-2">
      {/* Верхняя панель управления */}
      {!isEmpty && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
          <span className="text-xs text-muted-foreground leading-none">
            {selectedUrls.length > 0 ? t('selectedCount', { count: selectedUrls.length }) : null}
          </span>
          <div className="ml-auto flex items-center gap-2">
          {images.length > 0 && <button
            type="button"
            onClick={onToggleAll}
            className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded leading-none"
          >
            {allSelected ? t('deselectAll') : t('selectAll')}
          </button>}
          <button type="button" aria-label={t('previousPhotos')} disabled={!scrollEdges.previous} onClick={() => scrollPhotos(-1)} className="flex size-8 items-center justify-center rounded-lg border hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label={t('nextPhotos')} disabled={!scrollEdges.next} onClick={() => scrollPhotos(1)} className="flex size-8 items-center justify-center rounded-lg border hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ChevronRight className="size-4" />
          </button>
          </div>
        </div>
      )}

      {/* Горизонтальный скролл с элементами */}
      <div ref={scrollRef} role="region" aria-label={t('photoList')} tabIndex={isEmpty ? -1 : 0} data-vaul-no-drag
        className="flex w-full min-w-0 max-w-full gap-2.5 overflow-x-auto overscroll-x-contain items-center px-0.5 py-1.5 [scrollbar-width:thin] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
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
        {images.map((img, index) => {
          const displayUrl = getProjectImageDisplayUrl(img)
          const selectUrl = getProjectImageSelectUrl(img)
          const isSelected = selectedUrls.includes(selectUrl)

          return (
            <button
              key={img.id}
              type="button"
              aria-label={t('photoNumber', { number: index + 1 })}
              aria-pressed={isSelected}
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
