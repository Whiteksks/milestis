export type ImageSlotId =
  | 'menu.venue.logo'
  | 'menu.dish.photo'
  | 'photobook.cover.primary'
  | 'photobook.introduction.primary'
  | 'photobook.story.block'
  | 'photobook.gallery.item'
  | 'photobook.highlight.primary'
  | 'photobook.ending.primary'
  | 'portfolio.hero.primary'
  | 'portfolio.bio.primary'
  | 'portfolio.featured-work.item'

export type ImageSlotFamily = 'photobook' | 'portfolio' | 'menu'

export interface ImageSlotDefinition {
  id: ImageSlotId
  family: ImageSlotFamily
  label: string
  allowsCaption: boolean
  allowsDescription: boolean
}

export const IMAGE_SLOT_REGISTRY: Record<ImageSlotId, ImageSlotDefinition> = {
  'menu.venue.logo': { id: 'menu.venue.logo', family: 'menu', label: 'Restaurant logo', allowsCaption: false, allowsDescription: false },
  'menu.dish.photo': { id: 'menu.dish.photo', family: 'menu', label: 'Dish photo', allowsCaption: false, allowsDescription: false },
  'photobook.cover.primary': {
    id: 'photobook.cover.primary',
    family: 'photobook',
    label: 'Photobook cover image',
    allowsCaption: false,
    allowsDescription: false,
  },
  'photobook.introduction.primary': {
    id: 'photobook.introduction.primary',
    family: 'photobook',
    label: 'Photobook introduction image',
    allowsCaption: true,
    allowsDescription: true,
  },
  'photobook.story.block': {
    id: 'photobook.story.block',
    family: 'photobook',
    label: 'Photobook story block image',
    allowsCaption: true,
    allowsDescription: true,
  },
  'photobook.gallery.item': {
    id: 'photobook.gallery.item',
    family: 'photobook',
    label: 'Photobook gallery item',
    allowsCaption: true,
    allowsDescription: false,
  },
  'photobook.highlight.primary': {
    id: 'photobook.highlight.primary',
    family: 'photobook',
    label: 'Photobook highlight image',
    allowsCaption: false,
    allowsDescription: true,
  },
  'photobook.ending.primary': {
    id: 'photobook.ending.primary',
    family: 'photobook',
    label: 'Photobook ending image',
    allowsCaption: true,
    allowsDescription: true,
  },
  'portfolio.hero.primary': {
    id: 'portfolio.hero.primary',
    family: 'portfolio',
    label: 'Portfolio hero image',
    allowsCaption: false,
    allowsDescription: false,
  },
  'portfolio.bio.primary': {
    id: 'portfolio.bio.primary',
    family: 'portfolio',
    label: 'Portfolio bio image',
    allowsCaption: false,
    allowsDescription: false,
  },
  'portfolio.featured-work.item': {
    id: 'portfolio.featured-work.item',
    family: 'portfolio',
    label: 'Portfolio featured work image',
    allowsCaption: false,
    allowsDescription: true,
  },
}

export function getImageSlotDefinition(slotId: ImageSlotId): ImageSlotDefinition {
  return IMAGE_SLOT_REGISTRY[slotId]
}
