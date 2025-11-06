// Importing definitions registers them in the central registry
import "./defs/navbar"
import "./defs/hero"
import "./defs/gallery"
import "./defs/text"
import "./defs/quote"
import "./defs/contact"
import "./defs/cta"
import "./defs/features"
import "./defs/testimonials"

export { buildBlockLibraryForLegacy, getAllBlocks, getBlocksByType, findDefinitionForCanvasBlock } from "./registry"
export type { BlockType, BlockData, CanvasBlock, NestedElement } from "./registry"
