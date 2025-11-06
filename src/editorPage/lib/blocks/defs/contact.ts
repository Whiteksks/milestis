import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const ContactSettingsSchema = BaseSettingsSchema.extend({
  contactTitle: z.string().optional(),
  contactDescription: z.string().optional(),
  contactEmail: z.string().email().optional(),
})

export type ContactSettings = z.infer<typeof ContactSettingsSchema>

const def: BlockDefinition<"contact", ContactSettings> = {
  id: "contact-1",
  type: "contact",
  title: "Contact Form",
  description: "Email capture and contact form section",
  preview: "/contact-form-with-fields.jpg",
  settings: ContactSettingsSchema.parse({
    background: "bg-card",
    textColor: "text-slate-900",
    padding: "medium",
    animation: "none",
    preset: "standard",
    contactTitle: "Get In Touch",
    contactDescription:
      "Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    contactEmail: "hello@example.com",
  }),
  settingsSchema: ContactSettingsSchema,
}

registerBlock(def)

export default def
