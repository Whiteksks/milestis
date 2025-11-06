import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const GallerySettingsSchema = BaseSettingsSchema.extend({
  galleryImages: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        caption: z.string(),
      })
    )
    .default([]),
})

export type GallerySettings = z.infer<typeof GallerySettingsSchema>

const def: BlockDefinition<"gallery", GallerySettings> = {
  id: "gallery-1",
  type: "gallery",
  title: "Image Gallery",
  description: "Showcase images in a beautiful grid layout",
  preview: "/image-gallery-grid-layout.jpg",
  settings: GallerySettingsSchema.parse({
    background: "bg-slate-50",
    textColor: "text-slate-900",
    padding: "medium",
    animation: "scale",
    preset: "grid",
    galleryImages: [
      { id: "1", url: "/placeholder.svg?height=300&width=400", caption: "Image 1" },
      { id: "2", url: "/placeholder.svg?height=300&width=400", caption: "Image 2" },
      { id: "3", url: "/placeholder.svg?height=300&width=400", caption: "Image 3" },
      { id: "4", url: "/placeholder.svg?height=300&width=400", caption: "Image 4" },
      { id: "5", url: "/placeholder.svg?height=300&width=400", caption: "Image 5" },
      { id: "6", url: "/placeholder.svg?height=300&width=400", caption: "Image 6" },
    ],
  }),
  settingsSchema: GallerySettingsSchema,
}

registerBlock(def)

export default def
