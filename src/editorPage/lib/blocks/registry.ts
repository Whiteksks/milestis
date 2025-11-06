import { z } from "zod"

// Core block primitives
export type BlockType =
  | "navbar"
  | "hero"
  | "gallery"
  | "text"
  | "quote"
  | "contact"
  | "cta"
  | "features"
  | "testimonials"

export interface NestedElement {
  id: string
  type: "button" | "heading" | "text" | "image" | "divider" | "input"
  content: string
  style?: {
    color?: string
    size?: "small" | "medium" | "large"
    align?: "left" | "center" | "right"
    [key: string]: any
  }
}

// Common settings shared by all blocks
export const BaseSettingsSchema = z.object({
  background: z.string(),
  textColor: z.string(),
  padding: z.enum(["small", "medium", "large"]),
  animation: z.enum(["none", "fade", "slide", "scale"]),
  preset: z.string().optional(),
})
export type BaseSettings = z.infer<typeof BaseSettingsSchema>

export interface BlockDefinition<TType extends BlockType, TSettings extends BaseSettings> {
  id: string // unique within library, e.g. "hero-1"
  type: TType
  title: string
  description: string
  preview: string
  // strict settings type for this block
  settings: TSettings
  // zod schema to enable validation and future auto-forms
  settingsSchema: z.ZodType<TSettings>
  // optional initial children
  children?: NestedElement[]
}

export type AnyBlockDefinition = BlockDefinition<BlockType, BaseSettings & Record<string, any>>

// Canvas model used by the editor while editing
export interface CanvasBlock<TSettings extends BaseSettings = BaseSettings> extends BlockDefinition<BlockType, TSettings> {
  order: number
}

// In-memory registry to collect block definitions from feature modules
const registry = new Map<BlockType, AnyBlockDefinition[]>()

export function registerBlock<TType extends BlockType, TSettings extends BaseSettings>(def: BlockDefinition<TType, TSettings>) {
  const list = registry.get(def.type) ?? []
  // ensure unique id per type
  if (list.some((d) => d.id === def.id)) {
    throw new Error(`Block with id "${def.id}" already registered for type "${def.type}"`)
  }
  list.push(def as AnyBlockDefinition)
  registry.set(def.type, list)
}

export function getAllBlocks(): AnyBlockDefinition[] {
  return Array.from(registry.values()).flat()
}

export function getBlocksByType(type: BlockType): AnyBlockDefinition[] {
  return registry.get(type) ?? []
}

export function findDefinitionForCanvasBlock(block: { type: BlockType; settings?: Partial<BaseSettings> & Record<string, any> }) {
  const candidates = getBlocksByType(block.type)
  if (!candidates.length) return undefined
  // try preset match first
  const preset = block.settings?.preset
  if (preset) {
    const m = candidates.find((d) => (d.settings as any).preset === preset)
    if (m) return m
  }
  return candidates[0]
}

// Helper to materialize the legacy BLOCK_LIBRARY shape
export function buildBlockLibraryForLegacy(): AnyBlockDefinition[] {
  return getAllBlocks()
}

// Convenience re-exports used by legacy code
export type { AnyBlockDefinition as BlockData }
