export interface TextPreset {
  name: string
  description: string
  layout: "single" | "two-column" | "centered" | "sidebar"
  hasHeading: boolean
  hasSubheading: boolean
  alignment: "left" | "center" | "justify"
}

export const TEXT_PRESETS: Record<string, TextPreset> = {
  single: {
    name: "Single Column",
    description: "Traditional single column text layout",
    layout: "single",
    hasHeading: true,
    hasSubheading: true,
    alignment: "left",
  },
  twoColumn: {
    name: "Two Column",
    description: "Text split into two columns for easier reading",
    layout: "two-column",
    hasHeading: true,
    hasSubheading: false,
    alignment: "left",
  },
  centered: {
    name: "Centered",
    description: "Center-aligned text for emphasis",
    layout: "centered",
    hasHeading: true,
    hasSubheading: true,
    alignment: "center",
  },
  sidebar: {
    name: "With Sidebar",
    description: "Main content with sidebar for additional info",
    layout: "sidebar",
    hasHeading: true,
    hasSubheading: false,
    alignment: "left",
  },
}
