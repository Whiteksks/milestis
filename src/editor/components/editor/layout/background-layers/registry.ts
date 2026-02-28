/**
 * Background layer effect registry.
 *
 * To add a new effect:
 *  1. Create a file in effects/depth|rays|texture|decorative/
 *  2. Export a `LayerEffectDef` object from it
 *  3. Import it here and add it to the correct array
 *
 * The panel and BackgroundLayers component both read from this file,
 * so the new effect automatically appears everywhere.
 */

import type { LayerEffectDef } from './types'
import type { DepthEffect, RayEffect, TextureEffect } from '@/editor/lib/types'

// ── Depth ─────────────────────────────────────────────────────────────────
import { radialGlow }      from './effects/depth/radial-glow'
import { vignette }        from './effects/depth/vignette'
import { ambientBlobs }    from './effects/depth/ambient-blobs'
import { asymmetricLight } from './effects/depth/asymmetric-light'
import { aurora }          from './effects/depth/aurora'
import { horizon }         from './effects/depth/horizon'

// ── Rays ──────────────────────────────────────────────────────────────────
import { diagonalRays } from './effects/rays/diagonal-rays'
import { conicRays }    from './effects/rays/conic-rays'
import { softStreaks }  from './effects/rays/soft-streaks'
import { lensFlare }   from './effects/rays/lens-flare'
import { caustics }    from './effects/rays/caustics'
import { godRays }     from './effects/rays/god-rays'
import { prism }       from './effects/rays/prism'

// ── Texture ───────────────────────────────────────────────────────────────
import { grain }       from './effects/texture/grain'
import { dots }        from './effects/texture/dots'
import { lines }       from './effects/texture/lines'
import { grid }        from './effects/texture/grid'
import { halftone }    from './effects/texture/halftone'
import { scanlines }   from './effects/texture/scanlines'
import { diamondGrid } from './effects/texture/diamond-grid'
import { woven }       from './effects/texture/woven'

// ── Exports ───────────────────────────────────────────────────────────────

export const DEPTH_EFFECTS: LayerEffectDef<DepthEffect>[] = [
  radialGlow,
  vignette,
  ambientBlobs,
  asymmetricLight,
  aurora,
  horizon,
]

export const RAYS_EFFECTS: LayerEffectDef<RayEffect>[] = [
  diagonalRays,
  conicRays,
  softStreaks,
  lensFlare,
  caustics,
  godRays,
  prism,
]

export const TEXTURE_EFFECTS: LayerEffectDef<TextureEffect>[] = [
  grain,
  dots,
  lines,
  grid,
  halftone,
  scanlines,
  diamondGrid,
  woven,
]


