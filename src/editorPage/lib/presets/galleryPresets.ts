export interface GalleryPreset {
  name: string
  description: string
  layout: "grid" | "masonry" | "carousel" | "featured"
  columns: 2 | 3 | 4
  hasCaption: boolean
  spacing: "tight" | "normal" | "loose"
}

export const GALLERY_PRESETS: Record<string, GalleryPreset> = {
  grid: {
    name: "Grid Gallery",
    description: "Classic grid layout with equal-sized images",
    layout: "grid",
    columns: 3,
    hasCaption: true,
    spacing: "normal",
  },
  masonry: {
    name: "Masonry",
    description: "Pinterest-style layout with variable heights",
    layout: "masonry",
    columns: 3,
    hasCaption: true,
    spacing: "normal",
  },
  carousel: {
    name: "Carousel",
    description: "Slideshow with navigation arrows",
    layout: "carousel",
    columns: 1,
    hasCaption: true,
    spacing: "normal",
  },
  featured: {
    name: "Featured Grid",
    description: "One large image with smaller thumbnails",
    layout: "featured",
    columns: 4,
    hasCaption: false,
    spacing: "tight",
  },
}
