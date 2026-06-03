import { create } from 'zustand'
import { createPortfolioSlice, type PortfolioSlice } from '@/editor/modes/portfolio/store-slice'
import { createPhotobookSlice, type PhotobookSlice } from '@/editor/modes/photobook/store-slice'

/** Full content store — union of all mode slices.
 *  To add a new mode:
 *  1. Create modes/<name>/store-slice.ts exporting XxxSlice + createXxxSlice
 *  2. Add '& XxxSlice' to ContentStore below
 *  3. Add createXxxSlice to ALL_SLICE_CREATORS */
export type ContentStore = PortfolioSlice & PhotobookSlice

const ALL_SLICE_CREATORS = [createPortfolioSlice, createPhotobookSlice] as const

export const useContentStore = create<ContentStore>()((...a) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ALL_SLICE_CREATORS.reduce((acc, creator) => ({ ...acc, ...creator(...a) }), {} as ContentStore)
)
