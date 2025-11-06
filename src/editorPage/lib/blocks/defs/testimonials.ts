import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const TestimonialsSettingsSchema = BaseSettingsSchema.extend({
  testimonialsTitle: z.string().optional(),
  testimonialsItems: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        role: z.string(),
        content: z.string(),
        avatar: z.string(),
      })
    )
    .default([]),
})

export type TestimonialsSettings = z.infer<typeof TestimonialsSettingsSchema>

const def: BlockDefinition<"testimonials", TestimonialsSettings> = {
  id: "testimonials-1",
  type: "testimonials",
  title: "Testimonials",
  description: "Customer reviews and success stories",
  preview: "/testimonials-carousel-design.jpg",
  settings: TestimonialsSettingsSchema.parse({
    background: "bg-slate-50",
    textColor: "text-slate-900",
    padding: "medium",
    animation: "fade",
    preset: "cards",
    testimonialsTitle: "What Our Customers Say",
    testimonialsItems: [
      {
        id: "1",
        name: "Sarah Johnson",
        role: "Marketing Director",
        content: "This platform has revolutionized our workflow. Highly recommended!",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "2",
        name: "Michael Chen",
        role: "Product Manager",
        content: "The best investment we've made for our business this year.",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "3",
        name: "Emily Davis",
        role: "Designer",
        content: "Intuitive, powerful, and beautiful. Everything we needed.",
        avatar: "/placeholder.svg?height=80&width=80",
      },
    ],
  }),
  settingsSchema: TestimonialsSettingsSchema,
}

registerBlock(def)

export default def
