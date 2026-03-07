"use client"

import { useId, useMemo, useState, useCallback } from "react"
import Image, { type ImageLoader } from "next/image"
import { ChevronLeft, ChevronRight, Plus, Trash2, Image as ImageIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"

import { useContentSelector, useUiSelector } from "@/editor/lib/store"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"

const passthroughLoader: ImageLoader = ({ src }) => src

// --- Shared Hooks & Utils ---

function useStoryData() {
  return useContentSelector((state) => ({
    story: state.photobookSectionContent.story,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
}

function useStoryMoments() {
  const { story, updatePhotobookSection } = useStoryData()
  const slots = story.images || []
  const [activeIndex, setActiveIndex] = useState<number>(() => (slots.length ? 0 : -1))

  const normalizedIndex = useMemo(() => {
    if (!slots.length) return -1
    return Math.min(Math.max(activeIndex, 0), slots.length - 1)
  }, [activeIndex, slots.length])

  const updateSlots = useCallback((nextSlots: any[]) => {
    updatePhotobookSection("story", { images: nextSlots })
  }, [updatePhotobookSection])

  const addSlot = () => {
    const next = [...slots, { id: `slot-${Date.now()}`, label: "New Moment", images: [], caption: "", imageSettings: [] }]
    updateSlots(next)
    setActiveIndex(next.length - 1)
  }

  const removeSlot = (idx: number) => {
    const next = slots.filter((_, i) => i !== idx)
    updateSlots(next)
    setActiveIndex(prev => Math.min(prev, next.length - 1))
  }

  const updateSlot = (idx: number, updates: any) => {
    const next = [...slots]
    next[idx] = { ...next[idx], ...updates }
    updateSlots(next)
  }

  const addImagesToSlot = (idx: number, urls: string[]) => {
    const slot = slots[idx]
    if (!slot) return
    const currentImgs = slot.images || []
    const toAdd = urls.slice(0, 4 - currentImgs.length)
    if (!toAdd.length) return

    updateSlot(idx, {
      images: [...currentImgs, ...toAdd],
      imageSettings: [...(slot.imageSettings || []), ...toAdd.map(() => ({ aspectRatio: "landscape", frameStyle: "soft" }))]
    })
  }

  return { slots, activeIndex: normalizedIndex, setActiveIndex, addSlot, removeSlot, updateSlot, addImagesToSlot }
}

// --- Shared Sub-components ---

function MomentNav({ slots, activeIndex, onChange, onRemove }: any) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onChange(activeIndex - 1)} disabled={activeIndex <= 0}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Select value={String(activeIndex)} onValueChange={(v) => onChange(parseInt(v, 10))}>
        <SelectTrigger className="h-8 text-xs rounded-xl w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {slots.map((s: any, i: number) => (
            <SelectItem key={s.id || i} value={String(i)} className="text-xs">
              {s.label?.trim() ? s.label : `Moment ${i + 1}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onChange(activeIndex + 1)} disabled={activeIndex >= slots.length - 1}>
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onRemove(activeIndex)} className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-xl">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

// --- Main Components ---

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

export function StoryMomentsPanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { slots, activeIndex, setActiveIndex, addSlot, removeSlot, updateSlot, addImagesToSlot } = useStoryMoments()
  const { openMediaPicker } = useUiSelector((s) => ({ openMediaPicker: s.openMediaPicker }))
  
  const activeSlot = slots[activeIndex]


  return (
    <section className="space-y-4">
      <MediaPickerModal ownerId={ownerId} onSelectImage={(u) => addImagesToSlot(activeIndex, [u])} onSelectImages={(us) => addImagesToSlot(activeIndex, us)} />
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Moments</h4>
          <p className="text-xs text-muted-foreground">Up to 4 photos per moment</p>
        </div>
        <Button size="sm" onClick={addSlot} className="h-8 text-xs"><Plus className="w-3.5 h-3.5 mr-2" /> Add</Button>
      </div>

      {slots.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Moment {activeIndex + 1} / {slots.length}</div>
            <MomentNav slots={slots} activeIndex={activeIndex} onChange={setActiveIndex} onRemove={removeSlot} />
          </div>
          {activeSlot && (
            <div className="rounded-xl bg-muted/30 p-3 space-y-4">
              <div className="space-y-1.5">
                <PanelLabel>Title</PanelLabel>
                <Input value={activeSlot.label} onChange={(e) => updateSlot(activeIndex, { label: e.target.value })} className={ps.pbInput} placeholder="Event name..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {activeSlot.images?.map((img: string, i: number) => (
                  <div key={i} className="relative aspect-4/3 overflow-hidden rounded-lg border group">
                    <Image loader={passthroughLoader} unoptimized src={img} alt="" fill className="object-cover" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateSlot(activeIndex, {
                        images: activeSlot.images.filter((_: any, idx: number) => idx !== i),
                        imageSettings: activeSlot.imageSettings.filter((_: any, idx: number) => idx !== i)
                      })}
                      className="absolute right-1.5 top-1.5 h-6 w-6 bg-background/90 rounded-md shadow-sm md:opacity-0 md:group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {activeSlot.images?.length < 4 && (
                  <Button
                    variant="ghost"
                    onClick={() => openMediaPicker(ownerId)}
                    className="flex flex-col h-auto items-center justify-center aspect-4/3 rounded-lg border border-dashed hover:bg-muted/30"
                  >
                    <ImageIcon className="w-5 h-5 mb-1 opacity-60" />
                    <span className="text-[10px] font-medium">Add Photo</span>
                  </Button>
                )}
              </div>
              <div className="space-y-1.5">
                <PanelLabel>Caption</PanelLabel>
                <Input value={activeSlot.caption || ""} onChange={(e) => updateSlot(activeIndex, { caption: e.target.value })} className={ps.pbInput} placeholder="Add a caption..." />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed px-4 py-10 text-center text-xs text-muted-foreground">No moments added yet</div>
      )}
    </section>
  )
}
