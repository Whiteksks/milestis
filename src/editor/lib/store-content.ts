import { create } from 'zustand'
import { createPortfolioSlice, type PortfolioSlice } from './store-content-portfolio'
import { createPhotobookSlice, type PhotobookSlice } from './store-content-photobook'

/** Full content store — union of all mode slices.
 *  To add a new mode: create store-content-<mode>.ts and spread its creator here. */
export type ContentStore = PortfolioSlice & PhotobookSlice

export const useContentStore = create<ContentStore>()((...a) => ({
  ...createPortfolioSlice(...a),
  ...createPhotobookSlice(...a),
}))
