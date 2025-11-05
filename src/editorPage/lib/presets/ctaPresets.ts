export interface CtaPreset {
  name: string
  description: string
  layout: "centered" | "split" | "banner" | "card"
  hasImage: boolean
  buttonCount: 1 | 2
  style: "bold" | "subtle" | "gradient"
}

export const CTA_PRESETS: Record<string, CtaPreset> = {
  centered: {
    name: "Centered CTA",
    description: "Bold centered call-to-action",
    layout: "centered",
    hasImage: false,
    buttonCount: 1,
    style: "bold",
  },
  split: {
    name: "Split Layout",
    description: "Text on one side, image on the other",
    layout: "split",
    hasImage: true,
    buttonCount: 2,
    style: "subtle",
  },
  banner: {
    name: "Banner",
    description: "Full-width banner with background image",
    layout: "banner",
    hasImage: true,
    buttonCount: 1,
    style: "gradient",
  },
  card: {
    name: "Card Style",
    description: "Contained card with subtle styling",
    layout: "card",
    hasImage: false,
    buttonCount: 1,
    style: "subtle",
  },
}
