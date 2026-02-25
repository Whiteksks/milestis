"use client"

import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image, { type ImageLoader } from "next/image"
import { ImageIcon, X } from "lucide-react"
import { useId } from "react"

const passthroughLoader: ImageLoader = ({ src }) => src

export function GalleryHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { gallery, updatePhotobookSection } = useContentSelector((state) => ({
    gallery: state.photobookSectionContent.gallery,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Header</Label>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          value={gallery.title || ""}
          onChange={(e) => updatePhotobookSection("gallery", { title: e.target.value })}
          placeholder="Title"
          className="h-9 text-xs"
        />
        <Input
          value={gallery.description || ""}
          onChange={(e) => updatePhotobookSection("gallery", { description: e.target.value })}
          placeholder="Description"
          className="h-9 text-xs"
        />
      </div>
    </div>
  )
}

export function GalleryImagesPanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { gallery, updatePhotobookSection } = useContentSelector((state) => ({
    gallery: state.photobookSectionContent.gallery,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const removeImage = (indexToRemove: number) => {
    const current = gallery.images || []
    const next = current.filter((_, i) => i !== indexToRemove)
    updatePhotobookSection("gallery", { images: next })
  }

  const handleSelectImages = (urls: string[]) => {
    const current = gallery.images || []

    const timestamp = Date.now()
    const nextNew = urls.map((url, index) => ({
      id: `gallery-${timestamp}-${index}`,
      image: url,
      caption: "",
      imageSettings: [{ aspectRatio: "landscape" as const, frameStyle: "soft" as const }],
    }))

    updatePhotobookSection("gallery", { images: [...current, ...nextNew] })
  }

  return (
    <div className="space-y-3">
      <MediaPickerModal ownerId={ownerId} onSelectImages={handleSelectImages} />

      {!dense && (
        <>
          <Separator className="bg-border/40" />
          <div className="flex items-center justify-between gap-3">
            <Label className="text-xs font-medium text-muted-foreground">Images</Label>
            <Button variant="outline" onClick={() => openMediaPicker(ownerId)} className="h-8 text-xs">
              <ImageIcon className="w-3.5 h-3.5 mr-2" /> Add
            </Button>
          </div>
        </>
      )}

      {dense && (
        <Button variant="outline" onClick={() => openMediaPicker(ownerId)} className="h-8 text-xs">
          <ImageIcon className="w-3.5 h-3.5 mr-2" /> Add images
        </Button>
      )}

      <div className="grid grid-cols-3 gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 p-2 min-h-21">
        {(gallery.images || []).map((block, index) => (
          <div
            key={block.id}
            className="relative group aspect-square overflow-hidden rounded-lg border border-border/40 bg-background"
          >
            <Image
              loader={passthroughLoader}
              unoptimized
              src={block.image}
              alt={`Gallery Image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 120px"
              className="object-cover"
            />
            <button
              type="button"
              className="absolute right-1.5 top-1.5 rounded-md bg-background/90 text-muted-foreground p-1 opacity-0 group-hover:opacity-100 transition-colors border border-border/60 hover:bg-muted hover:text-foreground"
              onClick={() => removeImage(index)}
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          className="aspect-square w-full rounded-lg border border-dashed border-border/60 bg-background flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          onClick={() => openMediaPicker(ownerId)}
        >
          <ImageIcon className="w-5 h-5 mb-1 opacity-60" />
          <span className="text-[10px] font-medium">Add</span>
        </button>
      </div>
    </div>
  )
}
