"use client"

import { useId, useState } from "react"
import Image, { type ImageLoader } from "next/image"
import { Plus, Trash2, Image as ImageIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { useContentSelector, useUiSelector } from "@/editor/lib/store"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"

const passthroughLoader: ImageLoader = ({ src }) => src

export function StoryHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { story, updatePhotobookSection } = useContentSelector((state) => ({
    story: state.photobookSectionContent.story,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Header</Label>}
      <Input
        value={story.title || ""}
        onChange={(e) => updatePhotobookSection("story", { title: e.target.value })}
        placeholder="Story title"
        className="h-10 text-sm font-medium"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          value={story.date || ""}
          onChange={(e) => updatePhotobookSection("story", { date: e.target.value })}
          placeholder="Date"
          className="h-9 text-xs"
        />
        <Input
          value={story.location || ""}
          onChange={(e) => updatePhotobookSection("story", { location: e.target.value })}
          placeholder="Location"
          className="h-9 text-xs"
        />
      </div>
    </div>
  )
}

export function StoryTextPanel({ dense = false }: { dense?: boolean }) {
  const { story, updatePhotobookSection } = useContentSelector((state) => ({
    story: state.photobookSectionContent.story,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const paragraphs = story.paragraphs || []

  const addParagraph = () => updatePhotobookSection("story", { paragraphs: [...paragraphs, ""] })

  const updateParagraph = (idx: number, value: string) => {
    const next = [...paragraphs]
    next[idx] = value
    updatePhotobookSection("story", { paragraphs: next })
  }

  const removeParagraph = (idx: number) => {
    const filtered = paragraphs.filter((_, i) => i !== idx)
    updatePhotobookSection("story", { paragraphs: filtered })
  }

  const handleParagraphBlur = (idx: number) => {
    const value = paragraphs[idx]
    if (!value || !value.trim()) removeParagraph(idx)
  }

  if (dense) {
    return (
      <div className="space-y-3">
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={addParagraph}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add paragraph
        </Button>
        <p className="text-[11px] text-muted-foreground">For full text editing, open the section settings.</p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground">Text</h4>
          <p className="text-xs text-muted-foreground">Add paragraphs (empty ones are removed)</p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={addParagraph}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        {paragraphs.map((p, idx) => (
          <div key={idx} className="relative">
            <Textarea
              value={p}
              onChange={(e) => updateParagraph(idx, e.target.value)}
              onBlur={() => handleParagraphBlur(idx)}
              rows={3}
              className="text-xs resize-none min-h-25"
              placeholder="Start writing..."
            />
          </div>
        ))}

        {paragraphs.length === 0 && (
          <button
            type="button"
            onClick={addParagraph}
            className="w-full rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            Click to add the first paragraph
          </button>
        )}
      </div>
    </section>
  )
}

export function StoryMomentsPanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { story, updatePhotobookSection } = useContentSelector((state) => ({
    story: state.photobookSectionContent.story,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const slots = story.images || []
  const { openMediaPicker } = useUiSelector((state) => ({
    openMediaPicker: state.openMediaPicker,
  }))

  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null)

  const addSlot = () => {
    const newSlot = { id: `slot-${Date.now()}`, label: "New Moment", images: [], caption: "", imageSettings: [] }
    updatePhotobookSection("story", { images: [...slots, newSlot] })
  }

  const removeSlot = (idx: number) => {
    const next = slots.filter((_, i) => i !== idx)
    updatePhotobookSection("story", { images: next })
  }

  const updateSlotLabel = (idx: number, val: string) => {
    const next = [...slots]
    next[idx] = { ...next[idx], label: val }
    updatePhotobookSection("story", { images: next })
  }

  const handleSlotCaptionChange = (idx: number, value: string) => {
    const next = [...slots]
    next[idx] = { ...next[idx], caption: value }
    updatePhotobookSection("story", { images: next })
  }

  const addImagesToSlot = (idx: number, urls: string[]) => {
    const nextSlots = [...slots]
    const slot = nextSlots[idx]
    if (!slot) return

    const slotImages = slot.images ? [...slot.images] : []
    const imgSettings = slot.imageSettings ? [...slot.imageSettings] : []

    const remainingSlots = Math.max(0, 4 - slotImages.length)
    if (remainingSlots === 0) return

    const toAdd = urls.slice(0, remainingSlots)
    toAdd.forEach((url) => {
      slotImages.push(url)
      imgSettings.push({ aspectRatio: "landscape", frameStyle: "soft" })
    })

    nextSlots[idx] = { ...slot, images: slotImages, imageSettings: imgSettings }
    updatePhotobookSection("story", { images: nextSlots })
  }

  const handleSelectImageFromLibrary = (url: string) => {
    if (activeSlotIndex === null) return
    addImagesToSlot(activeSlotIndex, [url])
  }

  const handleSelectImagesFromLibrary = (urls: string[]) => {
    if (activeSlotIndex === null || urls.length === 0) return
    addImagesToSlot(activeSlotIndex, urls)
  }

  const handleAddImageClick = (idx: number) => {
    if ((slots[idx].images?.length || 0) >= 4) return
    setActiveSlotIndex(idx)
    openMediaPicker(ownerId)
  }

  const handleRemoveImageFromSlot = (slotIdx: number, imageIdx: number) => {
    const nextSlots = [...slots]
    const slot = nextSlots[slotIdx]
    if (!slot) return

    const images = [...(slot.images || [])]
    const imageSettings = [...(slot.imageSettings || [])]

    images.splice(imageIdx, 1)
    imageSettings.splice(imageIdx, 1)

    nextSlots[slotIdx] = { ...slot, images, imageSettings }
    updatePhotobookSection("story", { images: nextSlots })
  }

  if (dense) {
    return (
      <div className="space-y-3">
        <MediaPickerModal ownerId={ownerId} onSelectImage={handleSelectImageFromLibrary} onSelectImages={handleSelectImagesFromLibrary} />
        <Button size="sm" onClick={addSlot} className="h-8 text-xs">
          <Plus className="w-3.5 h-3.5 mr-2" /> Add moment
        </Button>
        <p className="text-[11px] text-muted-foreground">Edit photos inside moments in full settings.</p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <MediaPickerModal ownerId={ownerId} onSelectImage={handleSelectImageFromLibrary} onSelectImages={handleSelectImagesFromLibrary} />

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground">Moments</h4>
          <p className="text-xs text-muted-foreground">Up to 4 photos per moment</p>
        </div>
        <Button size="sm" onClick={addSlot} className="h-8 text-xs">
          <Plus className="w-3.5 h-3.5 mr-2" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        {slots.map((s, idx) => {
          const canAddMore = (s.images?.length || 0) < 4

          return (
            <div key={s.id} className="rounded-xl bg-muted/30 p-3 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                  <Input
                    value={s.label}
                    onChange={(e) => updateSlotLabel(idx, e.target.value)}
                    className="h-9 text-xs"
                    placeholder="Event name..."
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeSlot(idx)}
                  className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-muted"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(s.images || []).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-4/3 overflow-hidden rounded-lg border border-border/40 bg-background group"
                  >
                    <Image
                      loader={passthroughLoader}
                      unoptimized
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 200px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImageFromSlot(idx, i)}
                      className="absolute right-1.5 top-1.5 rounded-md bg-background/90 border border-border/60 text-muted-foreground p-1 opacity-0 group-hover:opacity-100 transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {canAddMore && (
                  <button
                    type="button"
                    onClick={() => handleAddImageClick(idx)}
                    className="flex flex-col items-center justify-center aspect-4/3 rounded-lg border border-dashed border-border/60 bg-background text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5 mb-1 opacity-60" />
                    <span className="text-[10px] font-medium">Add Photo</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Caption</Label>
                <Input
                  value={s.caption || ""}
                  onChange={(e) => handleSlotCaptionChange(idx, e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Add a caption for this moment..."
                />
              </div>
            </div>
          )
        })}

        {slots.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-10 text-center text-xs text-muted-foreground">
            No moments added yet
          </div>
        )}
      </div>
    </section>
  )
}
