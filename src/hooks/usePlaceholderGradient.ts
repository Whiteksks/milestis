/**
 * Deterministic mesh-gradient placeholder generator.
 *
 * Same seed (e.g. project id) → always same gradient. No randomness at
 * render time, so SSR and client produce identical output — zero hydration
 * mismatch. Pass 'abc123' or any fixed string as a fallback seed.
 *
 * Palette is tuned for a nostalgic / memory theme: warm blush, rose,
 * amber, soft lavender, sage, dusty teal.
 */

// FNV-1a 32-bit hash — fast, deterministic, good distribution
function hashStr(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

// Hue ranges that feel nostalgic / warm
const HUE_RANGES: [number, number][] = [
  [330, 355], // rose / blush
  [20,  42],  // warm amber / peach
  [270, 295], // soft lavender
  [150, 170], // sage green
  [185, 205], // dusty teal
  [40,  60],  // warm gold / cream
]

function lerp(t: number, min: number, max: number): number {
  return min + (t / 0xffffffff) * (max - min)
}

export interface PlaceholderStyle {
  background: string
  /** Subtle text colour for "add image" labels placed on top */
  labelColor: string
}

/**
 * Pure function — safe to call on the server and client with identical results.
 * @param seed  Any stable string — project id, block id, 'abc123', etc.
 */
export function getPlaceholderGradient(seed: string): PlaceholderStyle {
  const h0 = hashStr(seed)
  const h1 = hashStr(seed + '\x01')
  const h2 = hashStr(seed + '\x02')
  const h3 = hashStr(seed + '\x03')

  const rangeA = HUE_RANGES[h0 % HUE_RANGES.length]
  const rangeB = HUE_RANGES[h1 % HUE_RANGES.length]
  const rangeC = HUE_RANGES[h2 % HUE_RANGES.length]

  const hueA = lerp(h0, rangeA[0], rangeA[1])
  const hueB = lerp(h1, rangeB[0], rangeB[1])
  const hueC = lerp(h2, rangeC[0], rangeC[1])

  // Radial gradient anchor positions (spread 20–80% range)
  const x1 = 15 + (h0 % 35)
  const y1 = 10 + (h1 % 35)
  const x2 = 50 + (h2 % 40)
  const y2 = 45 + (h3 % 40)

  const colorA = `hsl(${hueA.toFixed(1)}, 58%, 80%)`
  const colorB = `hsl(${hueB.toFixed(1)}, 46%, 87%)`
  const colorC = `hsl(${hueC.toFixed(1)}, 36%, 92%)`
  const base   = `hsl(${hueC.toFixed(1)}, 28%, 96%)`

  const background = [
    `radial-gradient(ellipse at ${x1}% ${y1}%, ${colorA} 0%, transparent 58%)`,
    `radial-gradient(ellipse at ${x2}% ${y2}%, ${colorB} 0%, transparent 52%)`,
    `radial-gradient(ellipse at 82% 92%, ${colorC} 0%, transparent 48%)`,
    base,
  ].join(', ')

  // Use a slightly deeper tint of the primary hue as label colour
  const labelColor = `hsl(${hueA.toFixed(1)}, 30%, 55%)`

  return { background, labelColor }
}

/**
 * React hook wrapper — accepts an optional seed and falls back to 'abc123'.
 */
export function usePlaceholderGradient(seed?: string): PlaceholderStyle {
  return getPlaceholderGradient(seed ?? 'abc123')
}
