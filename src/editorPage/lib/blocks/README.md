# Blocks registry

This folder contains the scalable blocks system used by the editor.

- `registry.ts` provides a central registry, shared types, and helpers.
- `defs/*` contains individual block definitions (schema + defaults).
- `index.ts` imports and registers all blocks.

## Add a new block

1. Create a new file in `defs/` (e.g. `pricing.ts`).
2. Define a settings schema by extending `BaseSettingsSchema` (zod) and provide default values.
3. Export a `BlockDefinition` and call `registerBlock(def)`.
4. Import your new file in `index.ts` (one line) to register it.

Example:

```ts
import { z } from "zod"
import { BaseSettingsSchema, registerBlock, type BlockDefinition } from "../registry"

const PricingSettingsSchema = BaseSettingsSchema.extend({
  plans: z.array(z.object({ id: z.string(), name: z.string(), price: z.string() })).default([]),
})

type PricingSettings = z.infer<typeof PricingSettingsSchema>

const def: BlockDefinition<"pricing", PricingSettings> = {
  id: "pricing-1",
  type: "pricing",
  title: "Pricing",
  description: "Plans with features",
  preview: "/pricing.jpg",
  settings: PricingSettingsSchema.parse({
    background: "bg-card",
    textColor: "text-foreground",
    padding: "large",
    animation: "none",
    preset: "cards",
    plans: [],
  }),
  settingsSchema: PricingSettingsSchema,
}

registerBlock(def)
```

## Add new settings to an existing block

- Update the corresponding schema in `defs/<block>.ts` and its default `settings`.
- The editor reads `BLOCK_LIBRARY` from `lib/block-types`, so your changes are available without touching other files.
