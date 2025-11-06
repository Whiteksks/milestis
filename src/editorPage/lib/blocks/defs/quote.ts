import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const QuoteSettingsSchema = BaseSettingsSchema.extend({
  quoteText: z.string(),
  quoteAuthor: z.string().optional(),
  quoteRole: z.string().optional(),
})

export type QuoteSettings = z.infer<typeof QuoteSettingsSchema>

const def: BlockDefinition<"quote", QuoteSettings> = {
  id: "quote-1",
  type: "quote",
  title: "Quote Block",
  description: "Highlight inspirational or key quotes",
  preview: "/quote-testimonial-design.jpg",
  settings: QuoteSettingsSchema.parse({
    background: "bg-slate-100",
    textColor: "text-slate-900",
    padding: "medium",
    animation: "fade",
    preset: "centered",
    quoteText: "This product has transformed the way we work. Highly recommended!",
    quoteAuthor: "John Doe",
    quoteRole: "CEO, Company Inc.",
  }),
  settingsSchema: QuoteSettingsSchema,
}

registerBlock(def)

export default def
