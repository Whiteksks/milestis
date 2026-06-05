"use client"

import { memo, useId } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from 'next-intl'

import { Button } from "@/components/ui/button"
import { MediaPickerModal } from "../Modals/media-picker-modal"
import { useUiStore } from "@/editor/lib/store"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Droplet,
  ImageIcon,
  BringToFront,
  SendToBack,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  MoreVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ScanSearch,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { DecorationElement } from "../decorationEdit/decorationTypes"
import { clamp } from "../decorationEdit/utils"
import { useDecorationToolbar } from "../../../../hooks/use-decoration-toolbar"
import { BUBBLE_STYLE_OPTIONS } from "../decorationEdit/decoration-visual"
import { localizeOptions, useEditorTranslationResolver } from '@/editor/hooks/use-localized-editor-config'

// Module-level constants — не пересоздаются при каждом рендере
const ICON_BTN = "h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
const SEP = "mx-1.5 h-4 bg-border/60"

function OpacityIcon({ percent }: { percent: number }) {
  const clipTop = clamp(100 - percent, 0, 100)

  return (
    <span className="relative block h-4 w-4">
      <span
        className="absolute inset-0"
        style={{ clipPath: `inset(${clipTop}% 0 0 0)` }}
        aria-hidden="true"
      >
        <Droplet className="h-4 w-4" style={{ fill: "currentColor", stroke: "none" }} />
      </span>
      <Droplet className="absolute inset-0 h-4 w-4" aria-hidden="true" />
    </span>
  )
}

// Выделен в отдельный компонент — используется и в collapsed, и в "more"-поповере
interface DecorationPickerProps {
  decorations: DecorationElement[]
  activeDecorationId: string | null
  activeName: string | undefined
  onPick: (id: string) => void
  /** compact — кнопка-триггер в стиле collapsed-toolbar */
  variant: "compact" | "full"
}

function DecorationPicker({
  decorations,
  activeDecorationId,
  activeName,
  onPick,
  variant,
}: DecorationPickerProps) {
  const t = useTranslations('editor.controls.decorations')
  const trigger =
    variant === "compact" ? (
      <Button
        type="button"
        variant="ghost"
        className="h-8 px-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        aria-label={t('selectDecoration')}
      >
        <span className="text-xs font-medium">{activeName || t('selectDecoration')}</span>
        <ChevronDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ) : (
      <Button
        variant="outline"
        className="w-full justify-between h-8 text-xs font-normal rounded-xl border-border/60"
        aria-label={t('selectDecoration')}
      >
        <span>{activeName || t('select')}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        sideOffset={10}
        className={cn("rounded-xl", variant === "compact" ? "w-64" : "w-60")}
      >
        {variant === "compact" && (
          <DropdownMenuLabel className="text-xs">{t('title')}</DropdownMenuLabel>
        )}
        <DropdownMenuRadioGroup
          value={activeDecorationId ?? ""}
          onValueChange={(v) => v && onPick(v)}
        >
          {decorations.map((d, i) => (
            <DropdownMenuRadioItem key={d.id} value={d.id}>
              {d.name || t('decorationName', { count: i + 1 })}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface DecorationToolbarProps {
  decorations: DecorationElement[]
  activeDecorationId: string | null
  onActiveDecorationChange: (id: string) => void

  decoration?: DecorationElement
  onUpdate?: (updates: Partial<DecorationElement>) => void
  onDelete?: () => void
  onImageSelect?: (url: string) => void

  onCloseSettings: () => void
  onOpenSettings: () => void
  onSelectDecoration?: (id: string) => void
  onLocate?: () => void // прокрутить к элементу на canvas
  onAddDecoration?: () => void
  className?: string
}

export const DecorationToolbar = memo(function DecorationToolbar({
  decorations,
  activeDecorationId,
  onActiveDecorationChange,
  decoration,
  onUpdate,
  onDelete,
  onImageSelect,
  onCloseSettings,
  onOpenSettings,
  onSelectDecoration,
  onLocate,
  onAddDecoration,
  className,
}: DecorationToolbarProps) {
  const t = useTranslations('editor.controls.decorations')
  const tm = useTranslations('editor.controls.media')
  const resolveLabel = useEditorTranslationResolver()
  const fallbackOwnerId = useId()
  const ownerId = decoration?.id ?? fallbackOwnerId
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  const editorMode = useUiStore((s) => s.editorMode)
  const isPhotobook = editorMode === 'photobook'
  const imageButtonLabel = decoration?.kind === 'bubble' ? tm('addImage') : tm('changeImage')
  const bubbleStyle = decoration?.bubbleStyle ?? 'soft'
  const bubbleStyleOptions = localizeOptions(BUBBLE_STYLE_OPTIONS, resolveLabel)

  const {
    isExpanded,
    scalePercent,
    opacityPercent,
    isFront,
    responsiveScale,
    toggleFlipX,
    toggleFlipY,
    handleDecorationPick,
    handleScaleChange,
    handleOpacityChange,
    toggleZIndex,
    handleResponsiveScaleChange,
  } = useDecorationToolbar({
    decoration,
    onUpdate,
    onActiveDecorationChange,
    onSelectDecoration,
  })

  return (
    <div className={cn("flex p-1 gap-0", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="flex items-center gap-0"
          >
            {/* Add decoration */}
            <Button
              type="button"
              variant="ghost"
              onClick={onAddDecoration}
              aria-label={t('addNew')}
              title={t('addNew')}
              className={ICON_BTN}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className={SEP} />

            {/* Active decoration picker */}
            <DecorationPicker
              decorations={decorations}
              activeDecorationId={activeDecorationId}
              activeName={decoration?.name}
              onPick={handleDecorationPick}
              variant="compact"
            />

            <Separator orientation="vertical" className={SEP} />

            <Button
              type="button"
              variant="ghost"
              onClick={onOpenSettings}
              disabled={!activeDecorationId}
              aria-label={t('openSettings')}
              className={ICON_BTN}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="flex items-center gap-0"
          >
            {/* flip */}
            <Button
              variant="ghost"
              onClick={toggleFlipX}
              aria-label="Flip horizontal"
              className={ICON_BTN}
            >
              <FlipHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={toggleFlipY}
              aria-label="Flip vertical"
              className={ICON_BTN}
            >
              <FlipVertical className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className={SEP} />

            {/* scale */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" aria-label="Scale" className={ICON_BTN}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" sideOffset={10} className="w-64 p-4 rounded-2xl border-border/60 shadow-lg m-1">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-xs text-muted-foreground">{t('scale')}</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">{scalePercent}%</span>
                </div>
                <Slider
                  value={[scalePercent]}
                  min={50}
                  max={300}
                  step={5}
                  onValueChange={([v]) => handleScaleChange(v)}
                />
              </PopoverContent>
            </Popover>

            {/* opacity */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" aria-label="Opacity" className={ICON_BTN}>
                  <OpacityIcon percent={opacityPercent} />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" sideOffset={10} className="w-64 p-4 rounded-2xl border-border/60 shadow-lg m-1">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-xs text-muted-foreground">{t('opacity')}</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">{opacityPercent}%</span>
                </div>
                <Slider
                  value={[opacityPercent]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={([v]) => handleOpacityChange(v)}
                />
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className={SEP} />

            {/* z-index */}
            {!isPhotobook && (
            <Button
              variant="ghost"
              onClick={toggleZIndex}
              aria-label={isFront ? t('sendToBack') : t('bringToFront')}
              className={ICON_BTN}
            >
              {isFront ? <BringToFront className="h-4 w-4" /> : <SendToBack className="h-4 w-4" />}
            </Button>
            )}

            {/* image replace */}
            <MediaPickerModal ownerId={ownerId} onSelectImage={onImageSelect} />
            <Button
              variant="ghost"
              onClick={() => openMediaPicker(ownerId)}
              aria-label={imageButtonLabel}
              title={imageButtonLabel}
              className={ICON_BTN}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            {/* more options */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" aria-label="More options" className={ICON_BTN}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" sideOffset={10} className="w-72 p-4 rounded-2xl border-border/60 shadow-lg m-1">
                {/* Decoration Selector — единый источник, тот же DecorationPicker */}
                <div className="mb-4">
                  <Label className="text-xs text-muted-foreground mb-2 block">{t('title')}</Label>
                  <DecorationPicker
                    decorations={decorations}
                    activeDecorationId={activeDecorationId}
                    activeName={decoration?.name}
                    onPick={handleDecorationPick}
                    variant="full"
                  />
                </div>

                <Separator className="mb-4 bg-border/40" />

                {decoration?.kind === 'bubble' && (
                  <>
                    <div className="mb-4">
                      <Label className="text-xs text-muted-foreground mb-2 block">{t('bubbleStyle')}</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between h-8 text-xs font-normal rounded-xl border-border/60"
                          >
                            <span>{bubbleStyleOptions.find((option) => option.id === bubbleStyle)?.label ?? t('bubbleStyles.soft')}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" sideOffset={8} className="w-56 rounded-xl">
                          <DropdownMenuRadioGroup
                            value={bubbleStyle}
                            onValueChange={(value) => onUpdate?.({ bubbleStyle: value as DecorationElement['bubbleStyle'] })}
                          >
                            {bubbleStyleOptions.map((option) => (
                              <DropdownMenuRadioItem key={option.id} value={option.id}>
                                {option.label}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Separator className="mb-4 bg-border/40" />
                  </>
                )}

                {/* Mobile Adaptation */}
                <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-foreground">{t('mobileAdaptation')}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {t('mobileAdaptationDescription')}
                    </div>
                  </div>
                  <Switch
                    checked={Boolean(responsiveScale)}
                    onCheckedChange={handleResponsiveScaleChange}
                  />
                </label>

                <Separator className="my-4 bg-border/40" />

                {/* Actions */}
                <div className="space-y-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl"
                    onClick={onLocate}
                    disabled={!onLocate}
                  >
                    <ScanSearch className="h-3.5 w-3.5 mr-2" />
                    {t('locateOnCanvas')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    {tm('deleteImage')}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className={SEP} />

            <Button
              variant="ghost"
              onClick={onCloseSettings}
              aria-label={tm('close')}
              className={ICON_BTN}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})
