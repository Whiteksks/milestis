"use client"

import { useState, useEffect } from "react"

export function useDeviceType() {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null)

  useEffect(() => {
    // Use pointer: coarse media query to detect touchscreen devices
    const mediaQuery = window.matchMedia("(pointer: coarse)")
    const isTouch = mediaQuery.matches
    setIsTouchDevice(isTouch)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return { isTouchDevice: isTouchDevice ?? false }
}
