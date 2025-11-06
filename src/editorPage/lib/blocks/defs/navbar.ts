import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const NavbarSettingsSchema = BaseSettingsSchema.extend({
  navItems: z
    .array(
      z.object({
        title: z.string(),
        href: z.string(),
      })
    )
    .default([]),
})

export type NavbarSettings = z.infer<typeof NavbarSettingsSchema>

const def: BlockDefinition<"navbar", NavbarSettings> = {
  id: "navbar-1",
  type: "navbar",
  title: "Navigation Bar",
  description: "Responsive navigation with multiple preset designs",
  preview: "/placeholder.svg?height=100&width=800",
  settings: NavbarSettingsSchema.parse({
    background: "bg-background",
    textColor: "text-foreground",
    padding: "medium",
    animation: "none",
    preset: "centered",
    navItems: [
      { title: "Home", href: "#" },
      { title: "Products", href: "#" },
      { title: "About Us", href: "#" },
      { title: "Contacts", href: "#" },
    ],
  }),
  settingsSchema: NavbarSettingsSchema,
}

registerBlock(def)

export default def
