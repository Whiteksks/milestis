import type { ProjectImageDoc } from '@/editor/hooks/use-project-images'

// Deterministic "smart" photo placement — runs before the AI ever sees the photos, so the
// model only has to review/override a handful of single-photo slots instead of placing everything.

interface RankedPhoto {
  id: string
  aspect: number // width/height — >1 landscape, <1 portrait
  area: number
  order: number
}

function rankPhotos(ids: string[], idToDoc: Map<string, ProjectImageDoc>): RankedPhoto[] {
  return ids.map((id, order) => {
    const w = idToDoc.get(id)?.meta?.width ?? 0
    const h = idToDoc.get(id)?.meta?.height ?? 0
    return { id, aspect: h > 0 ? w / h : 1, area: w * h, order }
  })
}

// Picks and removes the best match for the given orientation from the pool (falls back to
// the pool's best-resolution photo if none match the preferred orientation).
function takeBest(pool: RankedPhoto[], prefer: 'landscape' | 'portrait' | 'any'): RankedPhoto | undefined {
  if (pool.length === 0) return undefined
  const matches =
    prefer === 'landscape' ? pool.filter((p) => p.aspect > 1.15) :
    prefer === 'portrait'  ? pool.filter((p) => p.aspect < 0.85) :
    pool
  const candidates = matches.length > 0 ? matches : pool
  const best = candidates.reduce((a, b) => (b.area > a.area ? b : a))
  pool.splice(pool.indexOf(best), 1)
  return best
}

export type PhotobookSingleSlot = 'cover' | 'introduction' | 'highlight' | 'ending'

export interface PhotobookDefaultPlacement {
  singles: Partial<Record<PhotobookSingleSlot, string>>
  story: string[]
  gallery: string[]
}

// Only fills slots listed in `emptySlots`; every other new id lands in gallery/story, split
// so both fill up evenly, in the order the photos were attached.
export function computePhotobookDefaults(
  newIds: string[],
  idToDoc: Map<string, ProjectImageDoc>,
  emptySlots: Set<PhotobookSingleSlot>,
): PhotobookDefaultPlacement {
  const pool = rankPhotos(newIds, idToDoc)
  const singles: PhotobookDefaultPlacement['singles'] = {}

  // Priority order matches the model's own slot semantics: the strongest shot up front,
  // a fitting farewell shot, then one meaningful photo each for intro/highlight.
  if (emptySlots.has('cover')) {
    const p = takeBest(pool, 'landscape')
    if (p) singles.cover = p.id
  }
  if (emptySlots.has('ending')) {
    const p = takeBest(pool, 'landscape')
    if (p) singles.ending = p.id
  }
  if (emptySlots.has('introduction')) {
    // earliest-attached remaining photo sets the scene
    const earliest = pool.reduce((a, b) => (b.order < a.order ? b : a), pool[0])
    if (earliest) {
      pool.splice(pool.indexOf(earliest), 1)
      singles.introduction = earliest.id
    }
  }
  if (emptySlots.has('highlight')) {
    const p = takeBest(pool, 'any')
    if (p) singles.highlight = p.id
  }

  pool.sort((a, b) => a.order - b.order)
  const story: string[] = []
  const gallery: string[] = []
  pool.forEach((p, i) => (i % 2 === 0 ? gallery : story).push(p.id))

  return { singles, story, gallery }
}

export type PortfolioSingleSlot = 'hero' | 'bio'

export interface PortfolioDefaultPlacement {
  hero?: string
  bio?: string
}

// hero/bio only — featuredWork cards carry their own text and stay fully AI-authored.
export function computePortfolioDefaults(
  newIds: string[],
  idToDoc: Map<string, ProjectImageDoc>,
  emptySlots: Set<PortfolioSingleSlot>,
): PortfolioDefaultPlacement {
  const pool = rankPhotos(newIds, idToDoc)
  const result: PortfolioDefaultPlacement = {}
  if (emptySlots.has('hero')) {
    const p = takeBest(pool, 'landscape')
    if (p) result.hero = p.id
  }
  if (emptySlots.has('bio')) {
    const p = takeBest(pool, 'portrait')
    if (p) result.bio = p.id
  }
  return result
}
