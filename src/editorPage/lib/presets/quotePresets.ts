export interface QuotePreset {
  name: string
  description: string
  layout: "centered" | "left" | "card" | "minimal"
  hasAuthor: boolean
  hasImage: boolean
  style: "bold" | "elegant" | "modern"
}

export const QUOTE_PRESETS: Record<string, QuotePreset> = {
  centered: {
    name: "Centered Quote",
    description: "Classic centered quote with large text",
    layout: "centered",
    hasAuthor: true,
    hasImage: false,
    style: "elegant",
  },
  left: {
    name: "Left Aligned",
    description: "Quote aligned to the left with author info",
    layout: "left",
    hasAuthor: true,
    hasImage: true,
    style: "modern",
  },
  card: {
    name: "Card Style",
    description: "Quote in an elevated card",
    layout: "card",
    hasAuthor: true,
    hasImage: false,
    style: "modern",
  },
  minimal: {
    name: "Minimal",
    description: "Simple quote without extra styling",
    layout: "minimal",
    hasAuthor: false,
    hasImage: false,
    style: "bold",
  },
}
