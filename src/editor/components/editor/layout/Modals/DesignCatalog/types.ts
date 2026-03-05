export type DesignCatalogSection = 'templates' | 'themes' | 'backgrounds'

export type TagMeta = {
  availableTags: string[]
  counts: Map<string, number>
}
