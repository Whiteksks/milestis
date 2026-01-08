"use client"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { useState } from 'react'
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

export function PhotobookStorySettings() {
  const { story, updatePhotobookSection } = useContentSelector((state) => ({
    story: state.photobookSectionContent.story,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const paragraphs = story.paragraphs || []
  const slots = story.images || []
  const { toggleMediaPicker } = useUiSelector((state) => ({
    toggleMediaPicker: state.toggleMediaPicker,
  }))
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null)

  const updateParagraph = (idx: number, value: string) => {
    const newParagraphs = [...paragraphs]
    newParagraphs[idx] = value
    updatePhotobookSection('story', { paragraphs: newParagraphs })
  }

  const addParagraph = () => {
    updatePhotobookSection('story', { paragraphs: [...paragraphs, ''] })
  }

  const removeParagraph = (idx: number) => {
    const filtered = paragraphs.filter((_, i) => i !== idx)
    updatePhotobookSection('story', { paragraphs: filtered })
  }

  const addSlot = () => {
    const newSlot = { id: `slot-${Date.now()}`, label: 'New Moment', images: [], caption: '', imageSettings: [] }
    updatePhotobookSection('story', { images: [...slots, newSlot] })
  }

  const updateSlotLabel = (idx: number, val: string) => {
    const newSlots = [...slots]
    newSlots[idx] = { ...newSlots[idx], label: val }
    updatePhotobookSection('story', { images: newSlots })
  }

  const addImagesToSlot = (idx: number, urls: string[]) => {
    const newSlots = [...slots]
    const slot = newSlots[idx]
    if (!slot) return

    const slotImages = slot.images ? [...slot.images] : []
    const imgSettings = slot.imageSettings ? [...slot.imageSettings] : []

    const remainingSlots = Math.max(0, 4 - slotImages.length)
    if (remainingSlots === 0) return

    const toAdd = urls.slice(0, remainingSlots)

    toAdd.forEach((url) => {
      slotImages.push(url)
      imgSettings.push({ aspectRatio: 'landscape', frameStyle: 'soft' })
    })

    newSlots[idx] = { ...slot, images: slotImages, imageSettings: imgSettings }
    updatePhotobookSection('story', { images: newSlots })
  }

  const removeSlot = (idx: number) => {
    const newSlots = slots.filter((_, i) => i !== idx)
    updatePhotobookSection('story', { images: newSlots })
  }

  const handleSelectImageFromLibrary = (url: string) => {
    if (activeSlotIndex === null) return
    addImagesToSlot(activeSlotIndex, [url])
  }

  const handleSelectImagesFromLibrary = (urls: string[]) => {
    if (activeSlotIndex === null || urls.length === 0) return
    addImagesToSlot(activeSlotIndex, urls)
  }

  const handleStoryTitleChange = (value: string) => {
    updatePhotobookSection('story', { title: value })
  }

  const handleStoryDateChange = (value: string) => {
    updatePhotobookSection('story', { date: value })
  }

  const handleStoryLocationChange = (value: string) => {
    updatePhotobookSection('story', { location: value })
  }

  const handleParagraphChange = (idx: number, value: string) => {
    updateParagraph(idx, value)
  }

  const handleParagraphBlur = (idx: number) => {
    const value = paragraphs[idx]
    if (!value || !value.trim()) {
      removeParagraph(idx)
    }
  }

  const handleAddSlotClick = () => {
    addSlot()
  }

  const handleAddImageClick = (idx: number) => {
    if ((slots[idx].images?.length || 0) >= 4) return
    setActiveSlotIndex(idx)
    toggleMediaPicker()
  }

  const handleRemoveSlotClick = (idx: number) => {
    removeSlot(idx)
  }

  const handleSlotCaptionChange = (idx: number, value: string) => {
    const newSlots = [...slots]
    newSlots[idx] = { ...newSlots[idx], caption: value }
    updatePhotobookSection('story', { images: newSlots })
  }

  const handleRemoveImageFromSlot = (slotIdx: number, imageIdx: number) => {
    const newSlots = [...slots]
    const slot = newSlots[slotIdx]
    if (!slot) return

    const images = [...(slot.images || [])]
    const imageSettings = [...(slot.imageSettings || [])]

    images.splice(imageIdx, 1)
    imageSettings.splice(imageIdx, 1)

    newSlots[slotIdx] = { ...slot, images, imageSettings }
    updatePhotobookSection('story', { images: newSlots })
  }

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal onSelectImage={handleSelectImageFromLibrary} onSelectImages={handleSelectImagesFromLibrary} />
      <div className="px-6 py-5 space-y-8">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Story</h3>
          <p className="text-xs text-muted-foreground">Write text and group photos by moments</p>
        </div>

        <section className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Header</Label>
            <Input
              value={story.title || ''}
              onChange={(e) => handleStoryTitleChange(e.target.value)}
              placeholder="Story title"
              className="h-10 text-sm font-medium"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={story.date || ''}
                onChange={(e) => handleStoryDateChange(e.target.value)}
                placeholder="Date"
                className="h-9 text-xs"
              />
              <Input
                value={story.location || ''}
                onChange={(e) => handleStoryLocationChange(e.target.value)}
                placeholder="Location"
                className="h-9 text-xs"
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-border/40 w-full" />

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
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
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

        <div className="h-px bg-border/40 w-full" />

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-foreground">Moments</h4>
              <p className="text-xs text-muted-foreground">Up to 4 photos per moment</p>
            </div>
            <Button size="sm" onClick={handleAddSlotClick} className="h-8 text-xs">
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
                      onClick={() => handleRemoveSlotClick(idx)}
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
                      value={s.caption || ''}
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
      </div>
    </ScrollArea>
  )
}

export default PhotobookStorySettings