"use client"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentStore, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/ui/media-picker-modal'
import { useState } from 'react'
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react' // Опционально: можно добавить иконки для UI, если они доступны, иначе оставлю текст

export function PhotobookStorySettings() {
  const { photobookSectionContent, updatePhotobookSection } = useContentStore()
  const paragraphs = photobookSectionContent.story.paragraphs || []
  const slots = photobookSectionContent.story.images || []
  const { toggleMediaPicker } = useUiStore()
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

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"
  const textareaStyle = "rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs resize-none"

  return (
    <ScrollArea className="h-full bg-white">
      <MediaPickerModal onSelectImage={handleSelectImageFromLibrary} onSelectImages={handleSelectImagesFromLibrary} />
      
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        
        {/* Section: Header Info */}
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Story Title</Label>
              <Input
                value={photobookSectionContent.story.title || ''}
                onChange={(e) => handleStoryTitleChange(e.target.value)}
                placeholder="e.g. Our Trip to Paris"
                className="h-11 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-lg font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Date</Label>
                <Input
                  value={photobookSectionContent.story.date || ''}
                  onChange={(e) => handleStoryDateChange(e.target.value)}
                  placeholder="August 12, 2024"
                  className={inputStyle}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Location</Label>
                <Input
                  value={photobookSectionContent.story.location || ''}
                  onChange={(e) => handleStoryLocationChange(e.target.value)}
                  placeholder="Paris, France"
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-100 w-full" />

        {/* Section: Text Content */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h2 className="text-sm font-semibold text-slate-900">Story Text</h2>
               <p className="text-[11px] text-slate-500 font-medium">Tell us how it happened.</p>
            </div>
            <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium h-8 rounded-lg" onClick={addParagraph}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Paragraph
            </Button>
          </div>

          <div className="space-y-5">
            {paragraphs.map((p, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 top-3 text-xs text-slate-300 select-none">¶</div>
                <Textarea
                  value={p}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  onBlur={() => handleParagraphBlur(idx)}
                  rows={3}
                  className="rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-sm leading-relaxed min-h-25 resize-none"
                  placeholder="Start writing..."
                />
              </div>
            ))}
            {paragraphs.length === 0 && (
                <div 
                    onClick={addParagraph}
                    className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-medium"
                >
                    Click to add the first paragraph
                </div>
            )}
          </div>
        </section>

        <div className="h-px bg-slate-100 w-full" />

        {/* Section: Visual Moments */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Moments</h2>
              <p className="text-[11px] text-slate-500 font-medium">Group photos by events.</p>
            </div>
            <Button size="sm" onClick={handleAddSlotClick} className="h-8 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium">
              Add Moment
            </Button>
          </div>

          <div className="space-y-6">
            {slots.map((s, idx) => {
              const canAddMore = (s.images?.length || 0) < 4

              return (
                <div
                  key={s.id}
                  className="group relative bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Заголовок момента */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                        Title
                      </Label>
                      <Input
                        value={s.label}
                        onChange={(e) => updateSlotLabel(idx, e.target.value)}
                        className="border-transparent hover:border-slate-200 focus:border-slate-300 px-0 h-auto py-1 text-sm font-semibold shadow-none bg-transparent placeholder:text-slate-300 rounded-md transition-colors"
                        placeholder="Event name..."
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveSlotClick(idx)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-7 w-7 p-0 rounded-full"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Фото 2×2 */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {(s.images || []).map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-4/3 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 group/image"
                      >
                        <img
                          src={img}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          alt=""
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageFromSlot(idx, i)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-white/90 text-slate-500 hover:text-red-500 p-1 opacity-0 group-hover/image:opacity-100 transition-all shadow-sm"
                          aria-label="Remove photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Кнопка добавить фото — только если меньше 4 */}
                    {canAddMore && (
                      <button
                        onClick={() => handleAddImageClick(idx)}
                        className="flex flex-col items-center justify-center aspect-4/3 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                        <span className="text-[10px] font-medium">Add Photo</span>
                      </button>
                    )}
                  </div>

                  {/* Подпись */}
                  <div className="pt-2 border-t border-slate-100">
                    <Input
                      value={s.caption || ''}
                      onChange={(e) => handleSlotCaptionChange(idx, e.target.value)}
                      className="border-none bg-transparent shadow-none text-xs text-slate-600 placeholder:text-slate-300 px-0 h-auto focus-visible:ring-0"
                      placeholder="Add a caption for this moment..."
                    />
                  </div>
                </div>
              )
            })}

            {slots.length === 0 && (
              <div className="text-center py-10 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-xs font-medium">
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