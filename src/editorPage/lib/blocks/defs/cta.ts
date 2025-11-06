import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const CtaSettingsSchema = BaseSettingsSchema.extend({
  ctaTitle: z.string(),
  ctaDescription: z.string().optional(),
  ctaButton: z
    .object({
      text: z.string(),
      href: z.string(),
    })
    .optional(),
})

export type CtaSettings = z.infer<typeof CtaSettingsSchema>

const def: BlockDefinition<"cta", CtaSettings> = {
  id: "cta-1",
  type: "cta",
  title: "Call to Action",
  description: "Convert visitors with a focused CTA section",
  preview: "/call-to-action-button-section.jpg",
  settings: CtaSettingsSchema.parse({
    background: "bg-indigo-600",
    textColor: "text-card",
    padding: "large",
    animation: "scale",
    preset: "centered",
    ctaTitle: "Ready to Get Started?",
    ctaDescription: "Join thousands of satisfied customers today",
    ctaButton: { text: "Sign Up Now", href: "#" },
  }),
  settingsSchema: CtaSettingsSchema,
}

registerBlock(def)

export default def
