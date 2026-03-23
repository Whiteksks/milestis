"use client"

import { useCallback, useId, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PhotoBlock } from "@/editor/lib/types"

// --- Shared Hooks ---

function useStoryData() {
  return useContentSelector((state) => ({
    story: state.photobookSectionContent.story,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
}

export function StoryHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { story, updatePhotobookSection } = useStoryData()
  const update = (fields: any) => updatePhotobookSection("story", fields)

  return (
    <div className={ps.pbRoot}>
      {!dense && <PanelLabel>Header</PanelLabel>}
      <Input
        value={story.title || ""}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="Story title"
        className={ps.pbInputTitle}
      />
      <div className={ps.pbGrid2}>
        <Input value={story.date || ""} onChange={(e) => update({ date: e.target.value })} placeholder="Date" className={ps.pbInput} />
        <Input value={story.location || ""} onChange={(e) => update({ location: e.target.value })} placeholder="Location" className={ps.pbInput} />
      </div>
    </div>
  )
}

export function StoryTextPanel({ dense = false }: { dense?: boolean }) {
  const { story, updatePhotobookSection } = useStoryData()
  const paragraphs = story.paragraphs || []

  const updateParagraphs = (next: string[]) => updatePhotobookSection("story", { paragraphs: next })
  const add = () => updateParagraphs([...paragraphs, ""])

  if (dense) {
    return (
      <div className="space-y-2">
        {paragraphs.map((p, i) => (
          <Textarea
            key={i}
            value={p}
            onChange={(e) => {
              const next = [...paragraphs]; next[i] = e.target.value; updateParagraphs(next)
            }}
            onBlur={() => !paragraphs[i]?.trim() && updateParagraphs(paragraphs.filter((_, idx) => idx !== i))}
            rows={2}
            className="text-xs resize-none"
            placeholder="Start writing..."
          />
        ))}
        {!paragraphs.length && (
          <button
            onClick={add}
            className="w-full rounded-xl border border-dashed p-4 text-xs text-muted-foreground hover:bg-muted/30"
          >
            Click to add the first paragraph
          </button>
        )}
        <Button size="sm" variant="outline" className="h-7 w-full text-xs" onClick={add}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add paragraph
        </Button>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Text</h4>
          <p className="text-xs text-muted-foreground">Add paragraphs (empty ones are removed)</p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={add}><Plus className="w-3.5 h-3.5 mr-2" /> Add</Button>
      </div>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <Textarea
            key={i}
            value={p}
            onChange={(e) => {
              const next = [...paragraphs]; next[i] = e.target.value; updateParagraphs(next)
            }}
            onBlur={() => !paragraphs[i]?.trim() && updateParagraphs(paragraphs.filter((_, idx) => idx !== i))}
            rows={3}
            className="text-xs resize-none min-h-25"
            placeholder="Start writing..."
          />
        ))}
        {!paragraphs.length && (
          <button onClick={add} className="w-full rounded-xl border border-dashed p-8 text-xs text-muted-foreground hover:bg-muted/30">
            Click to add the first paragraph
          </button>
        )}
      </div>
    </section>
  )
}

// --- Single moment item — has its own MediaPickerModal so image can be replaced ---

function StoryMomentItem({
  block,
  onUpdate,
}: {
  block: PhotoBlock
  onUpdate: (patch: Partial<PhotoBlock>) => void
}) {
  const ownerId = useId()
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  return (
    <div className="space-y-2">
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url) =>
          onUpdate({
            image: url,
            imageSettings: block.imageSettings?.length
              ? block.imageSettings
              : [{ aspectRatio: "landscape" as const, frameStyle: "none" as const }],
          })
        }
      />
      <Input
        value={block.label || ""}
        onChange={(e) => onUpdate({ label: e.target.value })}
        placeholder="Label (e.g. Morning)"
        className={ps.pbInput}
      />
      <ImagePicker
        label=""
        value={block}
        onChange={(next) => onUpdate(next)}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        showCaption
      />
    </div>
  )
}

export function StoryImagePanel({ dense = false }: { dense?: boolean }) {
  const addOwnerId = useId()
  const { story, updatePhotobookSection } = useStoryData()
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const images: PhotoBlock[] = story.images || []
  const updateImages = (next: PhotoBlock[]) => updatePhotobookSection("story", { images: next })

  const [activeImageIndex, setActiveImageIndex] = useState<number>(() =>
    images.length ? 0 : -1
  )

  const normalizedIndex = useMemo(() => {
    if (!images.length) return -1
    return Math.min(Math.max(activeImageIndex, 0), images.length - 1)
  }, [activeImageIndex, images.length])

  const activeImage = normalizedIndex >= 0 ? images[normalizedIndex] : null

  const updateActiveImage = useCallback(
    (patch: Partial<PhotoBlock>) => {
      if (normalizedIndex < 0) return
      updatePhotobookSection("story", {
        images: images.map((b, i) => (i === normalizedIndex ? { ...b, ...patch } : b)),
      })
    },
    [normalizedIndex, images, updatePhotobookSection],
  )

  const handleMultiAdd = (urls: string[]) => {
    if (!urls.length) return
    const ts = Date.now()
    const newBlocks: PhotoBlock[] = urls.map((url, i) => ({
      id: `story-${ts}-${i}`,
      image: url,
      label: "",
      caption: "",
      imageSettings: [{ aspectRatio: "landscape" as const, frameStyle: "none" as const }],
    }))
    const next = [...images, ...newBlocks]
    updateImages(next)
    setActiveImageIndex(next.length - 1)
  }

  const addEmpty = () => {
    const newBlock: PhotoBlock = {
      id: `story-${Date.now()}`,
      image: "",
      label: "",
      caption: "",
      imageSettings: [{ aspectRatio: "landscape" as const, frameStyle: "none" as const }],
    }
    const next = [...images, newBlock]
    updateImages(next)
    setActiveImageIndex(next.length - 1)
  }

  const deleteImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx)
    updateImages(next)
    setActiveImageIndex(next.length ? Math.min(idx, next.length - 1) : -1)
  }

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal ownerId={addOwnerId} onSelectImages={handleMultiAdd} />

      <div className="flex items-center justify-between gap-3">
        {!dense && <PanelLabel>Photos</PanelLabel>}
        <Button
          variant="ghost"
          size="sm"
          className={`${ps.addBtn} ${dense ? "ml-auto" : ""}`}
          onClick={addEmpty}
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> {dense ? "Add photo" : "Add"}
        </Button>
      </div>

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => openMediaPicker(addOwnerId)}
          className={ps.emptyZone}
        >
          <Plus className={ps.emptyIcon} />
          {!dense && <span className={ps.emptyText}>Click to add story photos</span>}
        </button>
      ) : (
        <div className="space-y-4">
          {/* Switcher */}
          <div className="flex items-center justify-between gap-2">
            {!dense && (
              <span className="text-[11px] text-muted-foreground/60 tabular-nums">
                {normalizedIndex + 1} / {images.length}
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

              <Select
                value={String(normalizedIndex)}
                onValueChange={(v) => setActiveImageIndex(parseInt(v, 10))}
              >
                <SelectTrigger className="h-8 text-xs bg-background rounded-xl w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {images.map((img, idx) => (
                    <SelectItem key={img.id} value={String(idx)}>
                      {img.label?.trim() ? img.label : `Photo ${idx + 1}`}
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

          {/* Active item editor */}
          {activeImage && (
            <div className="rounded-xl bg-muted/30 p-3 space-y-4 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted"
                onClick={() => deleteImage(normalizedIndex)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="pr-10">
                <StoryMomentItem
                  key={activeImage.id}
                  block={activeImage}
                  onUpdate={updateActiveImage}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <Button variant="outline" className="h-8 text-xs w-full" onClick={() => openMediaPicker(addOwnerId)}>
        <Plus className="w-3.5 h-3.5 mr-2" /> Add photo
      </Button>
    </div>
  )
}
