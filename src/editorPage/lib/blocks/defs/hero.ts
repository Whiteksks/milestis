import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const HeroSettingsSchema = BaseSettingsSchema.extend({
  heroTitle: z.string(),
  heroSubtitle: z.string().optional(),
  heroButtons: z
    .array(
      z.object({
        text: z.string(),
        href: z.string(),
        variant: z.enum(["primary", "secondary"]),
      })
    )
    .default([]),
  heroImage: z.string().optional(),
})

export type HeroSettings = z.infer<typeof HeroSettingsSchema>

const def: BlockDefinition<"hero", HeroSettings> = {
  id: "hero-1",
  type: "hero",
  title: "Hero Section",
  description: "Impressive hero banner with headline and CTA",
  preview: "/gradient-hero.png",
  settings: HeroSettingsSchema.parse({
    background: "bg-gradient-to-r from-indigo-500 to-purple-600",
    textColor: "text-card",
    padding: "large",
    animation: "fade",
    preset: "centered",
    heroTitle: "Build Your Dream Website",
    heroSubtitle: "Create stunning websites with our easy-to-use drag and drop editor",
    heroButtons: [
      { text: "Get Started", href: "#", variant: "primary" },
      { text: "Learn More", href: "#", variant: "secondary" },
    ],
    heroImage: "/placeholder.svg?height=400&width=600",
  }),
  settingsSchema: HeroSettingsSchema,
}

registerBlock(def)

export default def
