export interface ContactPreset {
  name: string
  description: string
  layout: "simple" | "split" | "centered" | "sidebar"
  hasMap: boolean
  hasInfo: boolean
  formPosition: "left" | "right" | "center"
}

export const CONTACT_PRESETS: Record<string, ContactPreset> = {
  simple: {
    name: "Simple Form",
    description: "Clean vertical form layout",
    layout: "simple",
    hasMap: false,
    hasInfo: false,
    formPosition: "center",
  },
  split: {
    name: "Split Layout",
    description: "Form on left, contact info on right",
    layout: "split",
    hasMap: false,
    hasInfo: true,
    formPosition: "left",
  },
  centered: {
    name: "Centered",
    description: "Centered form with contact details below",
    layout: "centered",
    hasMap: false,
    hasInfo: true,
    formPosition: "center",
  },
  sidebar: {
    name: "With Map",
    description: "Form with embedded map on the side",
    layout: "sidebar",
    hasMap: true,
    hasInfo: true,
    formPosition: "left",
  },
}
