"use client"

import { useRef, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { aspectRatios, RATIO_LABELS } from "@/editor/lib/config/aspect-ratios"
import { frameStyles } from "@/editor/lib/config/frame-styles"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/config/crop-data"
import { useCrop } from "@/editor/hooks/use-crop"
import { buildFrameStylePatch, getFrameStyleRestrictions, getEffectiveAspectRatio } from "@/editor/lib/restrictions/frame-style-restrictions"
import { type SectionImageRestrictions } from "@/editor/lib/restrictions/template-restrictions"
import { InlineCropPanel } from "@/editor/components/editor/section-settings/ui/inline-crop-panel"
import { InlineStylePanel } from "@/editor/components/editor/section-settings/ui/inline-style-panel"
import { Crop, ImageIcon, Palette, Plus, Settings2, Trash2, X } from "lucide-react"
import { editorialLabel } from "./panel-ui"

/**
 * Flat value that ImagePickerCore operates on.
 * Adapter components normalize their domain-specific types to/from this shape.
 */
export interface ImagePickerCoreValue {
  image: string
  aspectRatio: AspectRatio
  frameStyle: FrameStyle
  cropData?: ImageCropData
  caption?: string
  description?: string
  /** Ratio saved before entering a locked frame style (e.g. diamond). Restored on exit. */
  aspectRatioBeforeLock?: AspectRatio
}

export interface ImagePickerCoreProps {
  value: ImagePickerCoreValue
  /** Called with only the changed fields — merge into your own type. */
  onChange: (patch: Partial<ImagePickerCoreValue>) => void
  label?: string
  /** Compact thumbnail + text controls layout. Default: false. */
  dense?: boolean
  /** Show the caption input below the picker. Default: false. */
  showCaption?: boolean
  /** Show the description textarea below the picker. Default: false. */
  showDescription?: boolean
  onOpenMediaPicker?: () => void
  restrictions?: SectionImageRestrictions
}

export function ImagePickerCore({
  value,
  onChange,
  label = "Image",
  dense = false,
  showCaption = false,
  showDescription = false,
  onOpenMediaPicker,
  restrictions = {},
}: ImagePickerCoreProps) {
  const [showStylePicker, setShowStylePicker] = useState(false)
  const t = useTranslations("editor.controls.media")

  const handleFrameStyleChange = (newStyle: FrameStyle) => {
    const currentlyLocked = !!getFrameStyleRestrictions(value.frameStyle).lockedAspectRatio
    const nextLocked = !!getFrameStyleRestrictions(newStyle).lockedAspectRatio

    const patch = buildFrameStylePatch(newStyle)

    if (!currentlyLocked && nextLocked) {
      // Entering a locked style — persist current ratio so we can restore it later
      onChange({ ...patch, aspectRatioBeforeLock: value.aspectRatio })
    } else if (currentlyLocked && !nextLocked) {
      // Leaving a locked style — restore the ratio that was active before the lock
      const restore = value.aspectRatioBeforeLock ?? value.aspectRatio
      onChange({ ...patch, aspectRatio: restore, aspectRatioBeforeLock: undefined })
    } else {
      onChange(patch)
    }
  }

  const {
    showCrop, setShowCrop,
    isApplying,
    crop, setCrop,
    zoom, setZoom,
    onCropComplete,
    handleReset,
    handleApply,
    originalImage,
    syncImage,
  } = useCrop({ image: value.image, cropData: value.cropData })

  // Reset crop state whenever a new image URL is loaded externally.
  // onChange намеренно исключён из deps: это внешний коллбэк, который родитель
  // не всегда оборачивает в useCallback. Включение его сюда вызвало бы
  // бесконечный цикл: onChange → рендер родителя → новая ссылка → эффект снова.
  const prevImageRef = useRef(value.image)
  useEffect(() => {
    if (value.image !== prevImageRef.current) {
      prevImageRef.current = value.image
      syncImage(value.image)
      if (value.cropData) {
        onChange({ cropData: undefined })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.image, syncImage])

  const handleApplyAndSave = async () => {
    const cropData = await handleApply()
    if (cropData) {
      onChange({ cropData })
      setShowCrop(false)
    }
  }

  // ── Dense / compact mode ─────────────────────────────────────────────────
if (dense) {
    return (
      <div className="space-y-1.5">
        {showCrop && value.image ? (
          <div className="overflow-hidden rounded-md border border-border bg-background">
            <InlineCropPanel
              image={originalImage}
              aspectRatio={value.aspectRatio}
              frameStyle={value.frameStyle}
              crop={crop}
              zoom={zoom}
              isApplying={isApplying}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onReset={handleReset}
              onApply={handleApplyAndSave}
              onCancel={() => setShowCrop(false)}
            />
          </div>
        ) : showStylePicker && !restrictions.hideFrameStyle ? (
          <div className="overflow-hidden rounded-md border border-border bg-background">
            <InlineStylePanel
              image={value.image}
              value={value.frameStyle}
              aspectRatio={value.aspectRatio}
              onChange={handleFrameStyleChange}
              onAspectRatioChange={(val) => onChange({ aspectRatio: val, cropData: undefined })}
              onBack={() => setShowStylePicker(false)}
              restrictions={restrictions}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-xl border border-border/50 bg-muted/20 group">
            <button
              type="button"
              onClick={onOpenMediaPicker}
              className="rounded-lg border border-border shadow-sm bg-background hover:ring-2 ring-primary/20 transition-all"
              style={{ position: 'relative', flexShrink: 0, width: 56, height: 56, overflow: 'hidden' }}
              aria-label={t("pickImage")}
            >
              {value.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1">
                  <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                  <span className="text-[8px] uppercase font-medium text-muted-foreground/60">{t("add")}</span>
                </div>
              )}
            </button>

            {/* Компактное управление */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                
                {/* Группа Aspect Ratio */}
                {!restrictions.hideAspectRatio && (
                  <Select
                    value={getEffectiveAspectRatio(value.frameStyle, value.aspectRatio)}
                    onValueChange={(val) => onChange({ aspectRatio: val as AspectRatio, cropData: undefined })}
                    disabled={!!getFrameStyleRestrictions(value.frameStyle).lockedAspectRatio}
                  >
                    <SelectTrigger className="h-7 border-none bg-transparent hover:bg-background px-2 py-0 text-[10px] font-medium tracking-wide uppercase text-foreground/70 w-auto gap-1.5 transition-colors">
                      <SelectValue>{RATIO_LABELS[getEffectiveAspectRatio(value.frameStyle, value.aspectRatio)]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(aspectRatios).map((r) => (
                        <SelectItem key={r.id} value={r.id} className="text-xs">
                          <span className="font-mono mr-1.5 text-muted-foreground">{RATIO_LABELS[r.id]}</span>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Вторичные действия: Style, Crop, Remove */}
                <div className="flex items-center gap-1 ml-auto">
                  {!restrictions.hideFrameStyle && (
                    <button
                      type="button"
                      disabled={!value.image}
                      onClick={() => setShowStylePicker(true)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 transition-all"
                      title={frameStyles[value.frameStyle]?.name ?? t("style")}
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!restrictions.hideCrop && (
                    <button
                      type="button"
                      disabled={!value.image}
                      onClick={() => setShowCrop(true)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 transition-all"
                      title={t("crop")}
                    >
                      <Crop className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {value.image && (
                    <button
                      type="button"
                      onClick={() => onChange({ image: "", cropData: undefined })}
                      className="p-1.5 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                      title={t("remove")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showCaption && !showCrop && !showStylePicker && (
          <div className="pt-2">
            <label className={editorialLabel}>{t("caption")}</label>
            <Input
              value={value.caption || ""}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder={t("addCaption")}
              className="border-0 border-b border-border/40 bg-transparent rounded-none px-0 py-1 h-auto text-xs italic text-muted-foreground focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/30"
            />
          </div>
        )}

        {showDescription && !showCrop && !showStylePicker && (
          <div className="pt-2">
            <label className={editorialLabel}>{t("description")}</label>
            <Textarea
              value={value.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder={t("addDescription")}
              rows={2}
              className="border-0 border-b border-border/40 bg-transparent rounded-none px-0 py-1 h-auto text-xs resize-none overflow-x-hidden break-words w-full focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/30"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {label && (
        <Label className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
      )}

      <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
        {showCrop && value.image ? (
          <InlineCropPanel
            image={originalImage}
            aspectRatio={value.aspectRatio}
            frameStyle={value.frameStyle}
            crop={crop}
            zoom={zoom}
            isApplying={isApplying}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onReset={handleReset}
            onApply={handleApplyAndSave}
            onCancel={() => setShowCrop(false)}
          />
        ) : showStylePicker && !restrictions.hideFrameStyle ? (
          <InlineStylePanel
            image={value.image}
            value={value.frameStyle}
            aspectRatio={value.aspectRatio}
            onChange={handleFrameStyleChange}
            onAspectRatioChange={(val) => onChange({ aspectRatio: val, cropData: undefined })}
            onBack={() => setShowStylePicker(false)}
            restrictions={restrictions}
          />
        ) : (
          <>
            {/* Photo area */}
            <div className="bg-muted/50" style={{ position: 'relative', width: '100%', height: 256, overflow: 'hidden' }}>
              {value.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value.image}
                    alt={label}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px)' }}
                  />

                  {/* Change button — centered pill with backdrop blur */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onOpenMediaPicker}
                    className="absolute inset-0 h-auto w-auto flex items-center justify-center rounded-none cursor-pointer hover:bg-transparent"
                    aria-label={t("changeImage")}
                  >
                    <span className="flex items-center gap-1.5 rounded-full bg-background/60 backdrop-blur-md border border-white/20 px-3 py-1.5 shadow-sm text-xs font-medium text-foreground/90 hover:bg-background/80 transition-colors">
                      <Plus className="w-3 h-3" />
                      {t("change")}
                    </span>
                  </Button>

                  {/* Delete button — top-right, always visible */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange({ image: "", cropData: undefined })
                    }}
                    className="absolute right-2 top-2 z-10 h-7 w-7 rounded-full bg-background/60 backdrop-blur-md border border-white/20 shadow-sm text-foreground/70 hover:text-foreground hover:bg-background/80"
                    aria-label={t("removeImage")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onOpenMediaPicker}
                  className="flex flex-col items-center justify-center w-full h-full gap-2 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted/70"
                >
                  <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-xs font-medium">{t("selectMedia")}</span>
                </Button>
              )}
            </div>

            {/* Settings bar — hidden when every control is restricted */}
            {!(restrictions.hideAspectRatio && restrictions.hideFrameStyle && restrictions.hideCrop) && (
              <div className="flex items-center gap-1 p-1.5 bg-card border-t border-border/50">
                <div className="flex flex-1 items-center gap-1 min-w-0">
                  {!restrictions.hideAspectRatio && (
                    <Select
                      value={getEffectiveAspectRatio(value.frameStyle, value.aspectRatio)}
                      onValueChange={(val) => onChange({ aspectRatio: val as AspectRatio, cropData: undefined })}
                      disabled={!!getFrameStyleRestrictions(value.frameStyle).lockedAspectRatio}
                    >
                      <SelectTrigger className="h-8 w-[72px] shrink-0 border-none shadow-none bg-transparent hover:bg-muted/50 text-xs px-2 focus:ring-0">
                        <SelectValue>
                          {RATIO_LABELS[getEffectiveAspectRatio(value.frameStyle, value.aspectRatio)]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(aspectRatios).map((r) => (
                          <SelectItem key={r.id} value={r.id} className="text-xs">
                            <span className="font-mono mr-1.5 text-muted-foreground">{RATIO_LABELS[r.id]}</span>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {!restrictions.hideAspectRatio && !restrictions.hideFrameStyle && (
                    <Separator orientation="vertical" className="h-4 bg-border/50 shrink-0" />
                  )}

                  {!restrictions.hideFrameStyle && (
                    <Button
                      variant="ghost"
                      disabled={!value.image}
                      onClick={() => setShowStylePicker(true)}
                      className="h-8 flex-1 min-w-0 px-2 text-xs text-left justify-start truncate rounded-md text-foreground/80 hover:text-foreground hover:bg-muted/50"
                    >
                      {frameStyles[value.frameStyle]?.name ?? t("style")}
                    </Button>
                  )}
                </div>

                {!restrictions.hideCrop && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        disabled={!value.image}
                        onClick={() => setShowCrop(true)}
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("cropImage")}</TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showCaption && (
        <div className="px-1">
          <Input
            value={value.caption || ""}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder={t("addCaption")}
            className="h-7 border-b border-t-0 border-x-0 rounded-none bg-transparent text-xs italic text-muted-foreground focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50 shadow-none"
          />
        </div>
      )}

      {showDescription && (
        <Textarea
          value={value.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={t("addDescription")}
          rows={3}
          className="border-0 border-b border-border/40 bg-transparent rounded-none px-1 h-auto text-xs resize-none overflow-x-hidden break-words w-full focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/30"
        />
      )}
    </div>
  )
}
