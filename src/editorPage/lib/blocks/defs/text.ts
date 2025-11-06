import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const TextSettingsSchema = BaseSettingsSchema.extend({
  textHeading: z.string().optional(),
  textContent: z.string().optional(),
})

export type TextSettings = z.infer<typeof TextSettingsSchema>

const def: BlockDefinition<"text", TextSettings> = {
  id: "text-1",
  type: "text",
  title: "Text Block",
  description: "Rich text content with formatting options",
  preview: "/text-block-with-content.jpg",
  settings: TextSettingsSchema.parse({
    background: "bg-card",
    textColor: "text-slate-900",
    padding: "medium",
    animation: "none",
    preset: "standard",
    textHeading: "About Our Company",
    textContent:
      "We are dedicated to providing the best service to our customers. Our team of experts works tirelessly to ensure your satisfaction.",
  }),
  settingsSchema: TextSettingsSchema,
}

registerBlock(def)

export default def
