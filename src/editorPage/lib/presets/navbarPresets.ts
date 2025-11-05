export const NAVBAR_PRESETS = {
  centered: {
    name: "Centered Logo",
    description: "Logo in center with nav items on sides",
    container: "mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6",
    navWrapper: "text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16",
    navLink: "hover:text-primary max-md:hidden",
    logoPosition: "center", // Logo in the middle of nav items
    actions: "flex items-center gap-6",
  },
  leftAligned: {
    name: "Left Aligned",
    description: "Logo on left, nav items on right",
    container: "mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-6 sm:px-6",
    navWrapper: "flex items-center gap-8 font-medium",
    navLink: "hover:text-primary text-muted-foreground",
    logoPosition: "left",
    actions: "flex items-center gap-6",
  },
  minimal: {
    name: "Minimal",
    description: "Clean minimal design with subtle styling",
    container: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5",
    navWrapper: "flex items-center gap-6 text-sm font-medium",
    navLink: "hover:text-foreground text-muted-foreground transition-colors",
    logoPosition: "left",
    actions: "flex items-center gap-4",
  },
  bold: {
    name: "Bold",
    description: "Strong visual presence with larger elements",
    container: "mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-8 sm:px-8",
    navWrapper: "flex items-center gap-10 text-base font-semibold",
    navLink: "hover:text-primary text-foreground",
    logoPosition: "left",
    actions: "flex items-center gap-8",
  },
} as const

export type NavbarPresetKey = keyof typeof NAVBAR_PRESETS
