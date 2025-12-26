'use client'

import { createContext, useContext } from 'react'
import type React from 'react'

type CanvasScrollRef = React.RefObject<HTMLDivElement | null>

const CanvasScrollContext = createContext<CanvasScrollRef | null>(null)

export function CanvasScrollProvider({
  value,
  children,
}: {
  value: CanvasScrollRef
  children: React.ReactNode
}) {
  return <CanvasScrollContext.Provider value={value}>{children}</CanvasScrollContext.Provider>
}

export function useCanvasScrollContainer() {
  return useContext(CanvasScrollContext)
}
