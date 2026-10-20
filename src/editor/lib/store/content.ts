import { createMenuSlice, type MenuSlice } from '@/editor/modes/menu/store-slice'
import { create, type StateCreator } from 'zustand'
import { createPortfolioSlice, type PortfolioSlice } from '@/editor/modes/portfolio/store-slice'
import { createPhotobookSlice, type PhotobookSlice } from '@/editor/modes/photobook/store-slice'
import { createEventSlice, type EventSlice } from '@/editor/modes/event/store-slice'

export type ContentStore = PortfolioSlice & PhotobookSlice & EventSlice & MenuSlice

type ContentStoreSliceCreator = StateCreator<ContentStore, [], [], Partial<ContentStore>>

const ALL_SLICE_CREATORS: readonly ContentStoreSliceCreator[] = [createPortfolioSlice, createPhotobookSlice, createEventSlice, createMenuSlice]

export const useContentStore = create<ContentStore>()((...a) =>
  ALL_SLICE_CREATORS.reduce((acc, creator) => ({ ...acc, ...creator(...a) }), {} as ContentStore)
)
