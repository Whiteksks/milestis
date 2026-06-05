"use client"

import { useCallback, useId, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { PanelLabel, ps, editorialInput, editorialLabel, LIMITS } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { ImagePicker, createPhotobookRepeatingImage, replacePhotobookManagedImageAsset, type ImageValue, type PhotobookManagedImage } from "@/editor/image"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import type { PhotobookSectionContent, PhotobookStoryMoment } from "@/editor/lib/types"
import { cn } from "@/lib/utils"

const EMPTY_IMAGE_VALUE: ImageValue = {
  asset: { src: "", width: 0, height: 0 },
}

function useStoryData() {
  return useContentSelector((state) => ({
    story: state.photobookSectionContent.story,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
}

export function StoryHeaderPanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.story")
  const { story, updatePhotobookSection } = useStoryData()
  const update = (fields: Partial<PhotobookSectionContent["story"]>) => updatePhotobookSection("story", fields)

  return (
    <div className="py-2">
      {!dense && (
        <div className="space-y-1 pb-4 mb-4">
          <label className={editorialLabel}>{t("sectionLabel")}</label>
          <Input
            value={story.label || ""}
            onChange={(e) => update({ label: e.target.value })}
            placeholder={t("placeholder.sectionLabel")}
            className={cn(editorialInput, "text-sm text-muted-foreground")}
            maxLength={LIMITS.label}
          />
        </div>
      )}
      {!dense && (
        <div className="grid grid-cols-2 divide-x divide-border/30 border-b border-border/30 pb-4 mb-4">
          <div className="space-y-1 pr-2">
            <label className={editorialLabel}>{t("title")}</label>
            <Input
              value={story.title || ""}
              onChange={(e) => update({ title: e.target.value })}
              placeholder={t("placeholder.storyTitle")}
              className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
              maxLength={LIMITS.title}
            />
          </div>
          <div className="space-y-1 pl-2">
            <label className={editorialLabel}>{t("date")}</label>
            <Input
              value={story.date || ""}
              onChange={(e) => update({ date: e.target.value })}
              placeholder={t("placeholder.date")}
              className={cn(editorialInput, "text-base text-muted-foreground")}
              maxLength={LIMITS.date}
            />
          </div>
        </div>
      )}
      {dense && (
        <div className={ps.pbGrid2}>
          <Input value={story.title || ""} onChange={(e) => update({ title: e.target.value })} placeholder={t("placeholder.storyTitle")} className={ps.pbInput} maxLength={LIMITS.title} />
          <Input value={story.date || ""} onChange={(e) => update({ date: e.target.value })} placeholder={t("placeholder.denseDate")} className={ps.pbInput} maxLength={LIMITS.date} />
        </div>
      )}
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>{t("location")}</label>}
        <Input
          value={story.location || ""}
          onChange={(e) => update({ location: e.target.value })}
          placeholder={t("placeholder.location")}
          className={dense ? ps.pbInput : cn(editorialInput, "text-sm text-muted-foreground")}
          maxLength={LIMITS.location}
        />
      </div>
    </div>
  )
}

function StoryMomentItem({
  block,
  managedImage,
  dense = false,
  onUpdate,
  onDelete,
  onSelectImage,
  onImageChange,
}: {
  block: PhotobookStoryMoment
  managedImage?: PhotobookManagedImage
  dense?: boolean
  onUpdate: (patch: Partial<PhotobookStoryMoment>) => void
  onDelete: () => void
  onSelectImage: (url: string, thumbUrl?: string) => void
  onImageChange: (next: ImageValue) => void
}) {
  const t = useTranslations("editor.photobookSettings.story")
  const ownerId = useId()
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  const pickerValue = managedImage?.value ?? EMPTY_IMAGE_VALUE

  return (
    <div className="space-y-3">
      <MediaPickerModal ownerId={ownerId} onSelectImage={onSelectImage} />

      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <label className={editorialLabel}>{t("label")}</label>
          <Input
            value={block.label || ""}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder={t("placeholder.label")}
            className={cn(editorialInput, "text-sm")}
            maxLength={LIMITS.label}
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground/30 hover:text-destructive/60 transition-colors mt-5 flex items-center gap-1 shrink-0"
        >
          <Trash2 className="w-3 h-3" />
          {t("remove")}
        </button>
      </div>

      <div className="space-y-1">
        <label className={editorialLabel}>{t("caption")}</label>
        <Input
          value={block.caption || ""}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          placeholder={t("placeholder.caption")}
          className={cn(editorialInput, "text-sm")}
          maxLength={LIMITS.caption}
        />
      </div>

      <div className="space-y-1">
        <label className={editorialLabel}>{t("description")}</label>
        <Textarea
          value={block.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder={t("placeholder.description")}
          rows={4}
          className={ps.pbTextarea}
          maxLength={LIMITS.description}
        />
      </div>

      <ImagePicker
        slotId="photobook.story.block"
        value={pickerValue}
        dense={dense}
        onChange={onImageChange}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        showCaption={false}
        showDescription={false}
      />
    </div>
  )
}

export function StoryImagePanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.story")
  const addOwnerId = useId()
  const {
    story,
    photobookStoryImages,
    updatePhotobookSection,
    appendPhotobookRepeatingImage,
    replacePhotobookRepeatingImage,
    removePhotobookRepeatingImage,
  } = useContentSelector((state) => ({
    story: state.photobookSectionContent.story,
    photobookStoryImages: state.photobookImageContent.story,
    updatePhotobookSection: state.updatePhotobookSection,
    appendPhotobookRepeatingImage: state.appendPhotobookRepeatingImage,
    replacePhotobookRepeatingImage: state.replacePhotobookRepeatingImage,
    removePhotobookRepeatingImage: state.removePhotobookRepeatingImage,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const images = useMemo(() => story.moments || [], [story.moments])
  const updateImages = useCallback(
    (next: PhotobookStoryMoment[]) => updatePhotobookSection("story", { moments: next }),
    [updatePhotobookSection],
  )

  const [activeImageIndex, setActiveImageIndex] = useState<number>(() => (images.length ? 0 : -1))

  const normalizedIndex = useMemo(() => {
    if (!images.length) return -1
    return Math.min(Math.max(activeImageIndex, 0), images.length - 1)
  }, [activeImageIndex, images.length])

  const activeImage = normalizedIndex >= 0 ? images[normalizedIndex] : null
  const activeManagedImage = activeImage
    ? photobookStoryImages.find((image) => image.id === activeImage.id)
    : undefined

  const updateActiveImage = useCallback(
    (patch: Partial<PhotobookStoryMoment>) => {
      if (normalizedIndex < 0) return
      updateImages(images.map((entry, index) => (index === normalizedIndex ? { ...entry, ...patch } : entry)))
    },
    [images, normalizedIndex, updateImages],
  )

  const handleActiveImageSelect = useCallback(
    (url: string, thumbUrl?: string) => {
      if (!activeImage) return

      if (activeManagedImage) {
        replacePhotobookRepeatingImage("story", activeImage.id, replacePhotobookManagedImageAsset(activeManagedImage, { src: url, blurDataUrl: thumbUrl }))
        return
      }

      appendPhotobookRepeatingImage("story", createPhotobookRepeatingImage({
        id: activeImage.id,
        sectionId: "story",
        src: url,
        blurDataUrl: thumbUrl,
        alt: activeImage.label,
        caption: activeImage.caption,
        description: activeImage.description,
      }))
    },
    [activeImage, activeManagedImage, appendPhotobookRepeatingImage, replacePhotobookRepeatingImage],
  )

  const handleActiveImageChange = useCallback(
    (next: ImageValue) => {
      if (!activeImage) return

      if (!next.asset.src) {
        removePhotobookRepeatingImage("story", activeImage.id)
        return
      }

      if (activeManagedImage) {
        replacePhotobookRepeatingImage("story", activeImage.id, { ...activeManagedImage, value: next })
      }
    },
    [activeImage, activeManagedImage, removePhotobookRepeatingImage, replacePhotobookRepeatingImage],
  )

  const handleMultiAdd = useCallback((urls: string[]) => {
    if (!urls.length) return

    const remaining = LIMITS.storyImages - images.length
    if (remaining <= 0) return

    const selectedUrls = urls.slice(0, remaining)
    const timestamp = Date.now()
    const newBlocks: PhotobookStoryMoment[] = selectedUrls.map((_, index) => ({
      id: `story-${timestamp}-${index}`,
      label: "",
      caption: "",
      description: "",
    }))

    updateImages([...images, ...newBlocks])

    const managedImages = newBlocks.map((block, index) =>
      createPhotobookRepeatingImage({
        id: block.id,
        sectionId: "story",
        src: selectedUrls[index],
        alt: block.label,
        caption: block.caption,
        description: block.description,
      }),
    )

    managedImages.forEach((image) => appendPhotobookRepeatingImage("story", image))
    setActiveImageIndex(images.length + newBlocks.length - 1)
  }, [appendPhotobookRepeatingImage, images, updateImages])

  const addEmpty = () => {
    if (images.length >= LIMITS.storyImages) return

    const newBlock: PhotobookStoryMoment = {
      id: `story-${Date.now()}`,
      label: "",
      caption: "",
      description: "",
    }
    const next = [...images, newBlock]
    updateImages(next)
    setActiveImageIndex(next.length - 1)
  }

  const deleteImage = (indexToDelete: number) => {
    const imageId = images[indexToDelete]?.id
    const next = images.filter((_, index) => index !== indexToDelete)
    updateImages(next)
    if (imageId) {
      removePhotobookRepeatingImage("story", imageId)
    }
    setActiveImageIndex(next.length ? Math.min(indexToDelete, next.length - 1) : -1)
  }

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal ownerId={addOwnerId} onSelectImages={handleMultiAdd} />

      <div className="flex items-center justify-between gap-3">
        {!dense && <PanelLabel>{t("photos")}</PanelLabel>}
        <Button
          variant="ghost"
          size="sm"
          className={`${ps.addBtn} ${dense ? "ml-auto" : ""}`}
          onClick={addEmpty}
          disabled={images.length >= LIMITS.storyImages}
          title={images.length >= LIMITS.storyImages ? t("maximumPhotos", { count: LIMITS.storyImages }) : undefined}
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> {dense ? t("addPhoto") : t("add")}
        </Button>
      </div>

      {images.length === 0 ? (
        <button type="button" onClick={() => openMediaPicker(addOwnerId)} className={ps.emptyZone}>
          <Plus className={ps.emptyIcon} />
          {!dense && <span className={ps.emptyText}>{t("clickToAddStoryPhotos")}</span>}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            {!dense && (
              <span className="text-[11px] text-muted-foreground/60 tabular-nums">
                {normalizedIndex + 1} / {images.length} <span className="text-muted-foreground/30">({LIMITS.storyImages} max)</span>
              </span>
            )}

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl"
                onClick={() => setActiveImageIndex(Math.max(0, normalizedIndex - 1))}
                disabled={normalizedIndex <= 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Select value={String(normalizedIndex)} onValueChange={(value) => setActiveImageIndex(parseInt(value, 10))}>
                <SelectTrigger className="h-8 text-xs bg-background rounded-xl w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {images.map((image, index) => (
                    <SelectItem key={image.id} value={String(index)}>
                      {image.label?.trim() ? image.label : t("photoOption", { index: index + 1 })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl"
                onClick={() => setActiveImageIndex(Math.min(images.length - 1, normalizedIndex + 1))}
                disabled={normalizedIndex >= images.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {activeImage && (
            <StoryMomentItem
              key={activeImage.id}
              block={activeImage}
              managedImage={activeManagedImage}
              dense={dense}
              onUpdate={updateActiveImage}
              onDelete={() => deleteImage(normalizedIndex)}
              onSelectImage={handleActiveImageSelect}
              onImageChange={handleActiveImageChange}
            />
          )}
        </div>
      )}

      <Button variant="outline" className="h-8 text-xs w-full" onClick={() => openMediaPicker(addOwnerId)} disabled={images.length >= LIMITS.storyImages}>
        <Plus className="w-3.5 h-3.5 mr-2" /> {t("addPhoto")}
      </Button>
    </div>
  )
}
