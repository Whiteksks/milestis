"use client"

import { createContext, useCallback, useContext, useEffect, useRef } from "react"

export type SectionInfo = {
  id: string
  getRect: () => DOMRect | null
}

type RegistryValue = {
  register: (id: string, getRect: () => DOMRect | null) => void
  unregister: (id: string) => void
  getSections: () => SectionInfo[]
}

const SectionRegistryContext = createContext<RegistryValue | null>(null)

/**
 * Provides an explicit registry of canvas sections for the drag system.
 * Place this around the canvas content root so both DecorationsLayer
 * and template sections share the same registry instance.
 */
export function SectionRegistryProvider({ children }: { children: React.ReactNode }) {
  const mapRef = useRef(new Map<string, () => DOMRect | null>())

  const register = useCallback((id: string, getRect: () => DOMRect | null) => {
    mapRef.current.set(id, getRect)
  }, [])

  const unregister = useCallback((id: string) => {
    mapRef.current.delete(id)
  }, [])

  const getSections = useCallback(
    (): SectionInfo[] =>
      Array.from(mapRef.current.entries()).map(([id, getRect]) => ({ id, getRect })),
    [],
  )

  return (
    <SectionRegistryContext.Provider value={{ register, unregister, getSections }}>
      {children}
    </SectionRegistryContext.Provider>
  )
}

/**
 * Returns the section registry or null when called outside the editor
 * (e.g. published site render). Consumers must handle the null case.
 */
export function useSectionRegistry(): RegistryValue | null {
  return useContext(SectionRegistryContext)
}

/**
 * Registers a section as a drop target in the nearest SectionRegistryProvider.
 * Uses document.getElementById(id) to obtain the bounding rect at drop time —
 * no extra ref forwarding needed since SectionWrapper already sets id={id}.
 *
 * Silently no-ops when called outside a SectionRegistryProvider so templates
 * remain safe to render outside the editor context.
 */
export function useSectionRegistration(id: string): void {
  const registry = useSectionRegistry()

  useEffect(() => {
    if (!registry) return

    const getRect = (): DOMRect | null => {
      const el = document.getElementById(id)
      return el ? el.getBoundingClientRect() : null
    }

    registry.register(id, getRect)
    return () => registry.unregister(id)
  }, [id, registry])
}
