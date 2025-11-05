export interface HeroPreset {
  name: string
  description: string
  layout: "centered" | "left" | "split" | "minimal"
  hasImage: boolean
  hasSubtitle: boolean
  buttonCount: 1 | 2
}

export const HERO_PRESETS: Record<string, HeroPreset> = {
  centered: {
    name: "Centered Hero",
    description: "Classic centered layout with title, subtitle, and CTA",
    layout: "centered",
    hasImage: true,
    hasSubtitle: true,
    buttonCount: 2,
  },
  left: {
    name: "Left Aligned",
    description: "Content aligned to the left with image on right",
    layout: "left",
    hasImage: true,
    hasSubtitle: true,
    buttonCount: 2,
  },
  split: {
    name: "Split Screen",
    description: "50/50 split with content and full-height image",
    layout: "split",
    hasImage: true,
    hasSubtitle: true,
    buttonCount: 1,
  },
  minimal: {
    name: "Minimal",
    description: "Clean and simple with just title and one CTA",
    layout: "minimal",
    hasImage: false,
    hasSubtitle: false,
    buttonCount: 1,
  },
}
