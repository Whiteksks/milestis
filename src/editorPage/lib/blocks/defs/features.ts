import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const FeaturesSettingsSchema = BaseSettingsSchema.extend({
  featuresTitle: z.string().optional(),
  featuresItems: z
    .array(
      z.object({
        id: z.string(),
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .default([]),
})

export type FeaturesSettings = z.infer<typeof FeaturesSettingsSchema>

const def: BlockDefinition<"features", FeaturesSettings> = {
  id: "features-1",
  type: "features",
  title: "Features Showcase",
  description: "Display key features with icons and descriptions",
  preview: "/features-showcase-with-icons.jpg",
  settings: FeaturesSettingsSchema.parse({
    background: "bg-primary",
    textColor: "text-slate-900",
    padding: "large",
    animation: "slide",
    preset: "grid",
    featuresTitle: "Why Choose Us",
    featuresItems: [
      {
        id: "1",
        icon: "⚡",
        title: "Lightning Fast",
        description: "Optimized performance ensures your application runs at peak speed with minimal latency.",
      },
      {
        id: "2",
        icon: "🔒",
        title: "Secure by Default",
        description: "Enterprise-grade security features protect your data with industry-leading encryption.",
      },
      {
        id: "3",
        icon: "🎨",
        title: "Beautiful Design",
        description: "Stunning UI components that are fully customizable to match your brand identity.",
      },
      {
        id: "4",
        icon: "📱",
        title: "Responsive",
        description: "Works seamlessly across all devices, from mobile phones to desktop computers.",
      },
      {
        id: "5",
        icon: "🚀",
        title: "Easy to Deploy",
        description: "Deploy your application in minutes with our streamlined deployment process.",
      },
      {
        id: "6",
        icon: "💡",
        title: "Smart Analytics",
        description: "Gain valuable insights with built-in analytics and reporting tools.",
      },
    ],
  }),
  settingsSchema: FeaturesSettingsSchema,
}

registerBlock(def)

export default def
