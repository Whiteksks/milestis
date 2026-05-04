'use client'

import { useState } from 'react'
import { Crop, ImageIcon, Palette, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { resolveImage } from '../resolve'
import type { ImageValue } from '../data'
import type { ImageSlotId } from '../slots'
import { updateImageRatio, updateImageFrame } from '../editor/update-image-value'
import { RatioPicker } from '../editor/ratio-picker'
import { FramePicker } from '../editor/frame-picker'
import { useImageCrop } from '../crop/use-image-crop'
import { ImageCropPanel } from '../crop/image-crop-panel'
import type { FrameStyle, TemplateId } from '@/editor/lib/types'
import type { ImageRatioValue } from '../data'
import { useThemeStore } from '@/editor/lib/store-theme'

type ActivePanel = 'default' | 'crop' | 'style'

export interface ImagePickerProps {
  slotId: ImageSlotId
  value: ImageValue
  onChange: (next: ImageValue) => void
  onOpenMediaPicker?: () => void
  /** Show caption input. Default: false. */
  showCaption?: boolean
  /** Show description textarea. Default: false. */
  showDescription?: boolean
  /** Compact thumbnail layout. Default: false. */
  dense?: boolean
  label?: string
  className?: string
  templateId?: TemplateId
}

export function ImagePicker({
  slotId,
  value,
  onChange,
  onOpenMediaPicker,
  showCaption = false,
  showDescription = false,
  dense = false,
  label,
  className,
  templateId: templateIdProp,
}: ImagePickerProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>('default')
  const currentTemplateId = useThemeStore((state) => state.currentTemplateId)
  const templateId = templateIdProp ?? currentTemplateId

  const resolved = resolveImage(value, slotId, templateId)

  const crop = useImageCrop({
    value,
    ratio: resolved.ratio,
    onApply: (next) => { onChange(next); setActivePanel('default') },
    onReset: (next) => { onChange(next); setActivePanel('default') },
  })

  const handleRatioChange = (ratio: ImageRatioValue) => {
    onChange(updateImageRatio(value, slotId, ratio, templateId))
  }

  const handleFrameChange = (frame: FrameStyle) => {
    onChange(updateImageFrame(value, slotId, frame, templateId))
  }

  const handleRemove = () => {
    // Caller is responsible for clearing the value in their store.
    // We call onChange with a signal — but typically caller replaces with undefined.
    // This is a design decision: ImagePicker doesn't own the "remove" action fully.
    onChange({ ...value, asset: { ...value.asset, src: '' } })
  }

  const previewBackgroundStyle = value.asset.src
    ? {
        backgroundImage: `url(${JSON.stringify(value.asset.src).slice(1, -1)})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }
    : undefined

  if (dense) {
    return (
      <div className={cn('space-y-1.5', className)}>
        {activePanel === 'crop' && value.asset.src ? (
          <div className="overflow-hidden rounded-md border border-border bg-background">
            <ImageCropPanel
              imageSrc={value.asset.src}
              aspectRatio={crop.aspectRatio}
              frameStyle={resolved.frameStyle}
              cropPosition={crop.cropPosition}
              zoom={crop.zoom}
              isApplying={crop.isApplying}
              onCropChange={crop.setCropPosition}
              onZoomChange={crop.setZoom}
              onCropComplete={crop.onCropComplete}
              onReset={crop.handleReset}
              onApply={crop.handleApply}
              onCancel={() => setActivePanel('default')}
            />
          </div>
        ) : activePanel === 'style' ? (
          <div className="overflow-hidden rounded-md border border-border bg-background p-3 space-y-3">
            <RatioPicker slotId={slotId} templateId={templateId} value={resolved.ratio} onChange={handleRatioChange} />
            <FramePicker slotId={slotId} templateId={templateId} value={resolved.frameStyle} onChange={handleFrameChange} />
            <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground px-0" onClick={() => setActivePanel('default')}>
              ← Back
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-xl border border-border/50 bg-muted/20 group">
            <button
              type="button"
              onClick={onOpenMediaPicker}
              className="relative rounded-lg overflow-hidden border border-border shadow-sm bg-background hover:ring-2 ring-primary/20 transition-all"
              style={{ width: 56, height: 56, flexShrink: 0 }}
              aria-label="Pick image"
            >
              {value.asset.src ? (
                <>
                  <div aria-hidden="true" className="absolute inset-0" style={previewBackgroundStyle} />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1">
                  <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                  <span className="text-[8px] uppercase font-medium text-muted-foreground/60">Add</span>
                </div>
              )}
            </button>

            <div className="flex-1 min-w-0 flex items-center gap-2">
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  disabled={!value.asset.src}
                  onClick={() => setActivePanel('style')}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 transition-all"
                  title="Style"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={!value.asset.src}
                  onClick={() => { crop.open(); setActivePanel('crop') }}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 transition-all"
                  title="Crop"
                >
                  <Crop className="w-3.5 h-3.5" />
                </button>
                {value.asset.src && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1.5 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Full (non-dense) layout ───────────────────────────────────────────────

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
        {activePanel === 'crop' && value.asset.src ? (
          <ImageCropPanel
            imageSrc={value.asset.src}
            aspectRatio={crop.aspectRatio}
            frameStyle={resolved.frameStyle}
            initialCroppedAreaPixels={crop.initialCroppedAreaPixels}
            cropPosition={crop.cropPosition}
            zoom={crop.zoom}
            isApplying={crop.isApplying}
            onCropChange={crop.setCropPosition}
            onZoomChange={crop.setZoom}
            onCropComplete={crop.onCropComplete}
            onReset={crop.handleReset}
            onApply={crop.handleApply}
            onCancel={() => setActivePanel('default')}
          />
        ) : activePanel === 'style' ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setActivePanel('default')}>
                ← Back
              </Button>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                Style
              </span>
            </div>
            <RatioPicker slotId={slotId} templateId={templateId} value={resolved.ratio} onChange={handleRatioChange} />
            <FramePicker slotId={slotId} templateId={templateId} value={resolved.frameStyle} onChange={handleFrameChange} />
          </div>
        ) : (
          <>
            {/* Photo area */}
            <div className="bg-muted/50" style={{ position: 'relative', width: '100%', height: 256, overflow: 'hidden' }}>
              {value.asset.src ? (
                <>
                  <div
                    aria-label={label ?? ''}
                    className="absolute inset-0"
                    style={{
                      ...previewBackgroundStyle,
                      filter: 'blur(2px)',
                      transform: 'scale(1.02)',
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onOpenMediaPicker}
                    className="absolute inset-0 h-auto w-auto flex items-center justify-center rounded-none cursor-pointer hover:bg-transparent"
                    aria-label="Change image"
                  >
                    <span className="flex items-center gap-1.5 rounded-full bg-background/60 backdrop-blur-md border border-white/20 px-3 py-1.5 shadow-sm text-xs font-medium text-foreground/90 hover:bg-background/80 transition-colors">
                      <Plus className="w-3 h-3" />
                      Change
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    className="absolute right-2 top-2 z-10 h-7 w-7 rounded-full bg-background/60 backdrop-blur-md border border-white/20 shadow-sm text-foreground/70 hover:text-foreground hover:bg-background/80"
                    aria-label="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onOpenMediaPicker}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                >
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs font-medium">Add image</span>
                </button>
              )}
            </div>

            {/* Controls */}
            {value.asset.src && (
              <div className="flex items-center gap-1 px-2 py-1.5 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setActivePanel('style')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Palette className="w-3 h-3" />
                  Style
                </button>
                <button
                  type="button"
                  onClick={() => { crop.open(); setActivePanel('crop') }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Crop className="w-3 h-3" />
                  Crop
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Caption / Description — only in default panel */}
      {activePanel === 'default' && showCaption && (
        <div>
          <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-1 block font-medium">
            Caption
          </label>
          <Input
            value={value.caption ?? ''}
            onChange={(e) => onChange({ ...value, caption: e.target.value })}
            placeholder="Add caption..."
            className="border-0 border-b border-border/40 bg-transparent rounded-none px-0 py-1 h-auto text-xs italic text-muted-foreground focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/30"
          />
        </div>
      )}

      {activePanel === 'default' && showDescription && (
        <div>
          <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-1 block font-medium">
            Description
          </label>
          <Textarea
            value={value.description ?? ''}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="Add description..."
            rows={2}
            className="border-0 border-b border-border/40 bg-transparent rounded-none px-0 py-1 h-auto text-xs resize-none focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/30"
          />
        </div>
      )}
    </div>
  )
}
