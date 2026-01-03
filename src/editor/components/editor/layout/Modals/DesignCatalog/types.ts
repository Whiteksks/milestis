export type DesignCatalogSection = 'templates' | 'themes' | 'decorations'

export type TagMeta = {
  availableTags: string[]
  counts: Map<string, number>
}
