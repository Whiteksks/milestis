// New scalable block system re-export maintaining legacy surface
export type { BlockType, NestedElement, BlockData, CanvasBlock } from "./blocks"
import "./blocks" // register all blocks
import { buildBlockLibraryForLegacy } from "./blocks"

// Legacy constant kept for compatibility. Now built from registry.
export const BLOCK_LIBRARY = buildBlockLibraryForLegacy()
