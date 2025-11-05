export interface TestimonialsPreset {
  name: string
  description: string
  layout: "carousel" | "grid" | "single" | "masonry"
  columns: 1 | 2 | 3
  hasAvatar: boolean
  hasRating: boolean
}

export const TESTIMONIALS_PRESETS: Record<string, TestimonialsPreset> = {
  carousel: {
    name: "Carousel",
    description: "Slideshow of testimonials with navigation",
    layout: "carousel",
    columns: 1,
    hasAvatar: true,
    hasRating: true,
  },
  grid: {
    name: "Grid Layout",
    description: "Testimonials in a clean grid",
    layout: "grid",
    columns: 3,
    hasAvatar: true,
    hasRating: true,
  },
  single: {
    name: "Featured",
    description: "One large featured testimonial",
    layout: "single",
    columns: 1,
    hasAvatar: true,
    hasRating: true,
  },
  masonry: {
    name: "Masonry",
    description: "Variable height testimonial cards",
    layout: "masonry",
    columns: 2,
    hasAvatar: true,
    hasRating: false,
  },
}
