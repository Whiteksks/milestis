export interface FeaturesPreset {
  name: string
  description: string
  layout: "grid" | "list" | "cards" | "alternating"
  columns: 2 | 3 | 4
  hasIcons: boolean
  iconPosition: "top" | "left" | "inline"
}

export const FEATURES_PRESETS: Record<string, FeaturesPreset> = {
  grid: {
    name: "Grid Layout",
    description: "Features in a clean grid with icons on top",
    layout: "grid",
    columns: 3,
    hasIcons: true,
    iconPosition: "top",
  },
  list: {
    name: "List View",
    description: "Vertical list with icons on the left",
    layout: "list",
    columns: 2,
    hasIcons: true,
    iconPosition: "left",
  },
  cards: {
    name: "Feature Cards",
    description: "Elevated cards with centered content",
    layout: "cards",
    columns: 3,
    hasIcons: true,
    iconPosition: "top",
  },
  alternating: {
    name: "Alternating",
    description: "Features alternate between left and right",
    layout: "alternating",
    columns: 2,
    hasIcons: true,
    iconPosition: "inline",
  },
}
