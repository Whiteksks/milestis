"use client"

import { useThemeSelector } from "@/editor/lib/store"
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from "@/editor/components/editor/layout/background-layers/registry"
import { MOOD_OPTIONS, TEXTURE_OPTIONS } from "@/editor/components/editor/layout/background-layers/overlays/registry"
import type {
  DepthEffect,
  RayEffect,
  TextureEffect,
  BackgroundLayersTheme,
  BackgroundScrollMode,
  PhotobookMood,
  PhotobookTexture,
} from "@/editor/lib/types"

/**
 * Shared logic for the Portfolio background toolbar.
 * Used by both the desktop pill and the mobile sheet.
 */
export function usePortfolioThemeToolbar() {
  const { themeCustomizations, updateThemeCustomization } = useThemeSelector((s) => ({
    themeCustomizations: s.themeCustomizations,
    updateThemeCustomization: s.updateThemeCustomization,
  }))

  const {
    depthEffect: depth = "none",
    raysEffect: rays = "none",
    textureEffect: texture = "none",
    backgroundLayersTheme: layersTheme = "dark",
    backgroundScrollMode: scrollMode = "fixed",
  } = themeCustomizations

  const isDark = layersTheme === "dark"
  const isFixed = scrollMode === "fixed"

  const handleReset = () =>
    updateThemeCustomization({
      depthEffect: "none",
      raysEffect: "none",
      textureEffect: "none",
      backgroundLayersTheme: "dark",
      backgroundScrollMode: "fixed",
    })

  const toggleDarkLight = () =>
    updateThemeCustomization({
      backgroundLayersTheme: (isDark ? "light" : "dark") as BackgroundLayersTheme,
    })

  const toggleScrollMode = () =>
    updateThemeCustomization({
      backgroundScrollMode: (isFixed ? "scroll" : "fixed") as BackgroundScrollMode,
    })

  const setDepth = (v: string) =>
    updateThemeCustomization({ depthEffect: v as DepthEffect })

  const setRays = (v: string) =>
    updateThemeCustomization({ raysEffect: v as RayEffect })

  const setTexture = (v: string) =>
    updateThemeCustomization({ textureEffect: v as TextureEffect })

  const canReset = depth !== "none" || rays !== "none" || texture !== "none"

  return {
    depth,
    rays,
    texture,
    isDark,
    isFixed,
    canReset,
    handleReset,
    toggleDarkLight,
    toggleScrollMode,
    setDepth,
    setRays,
    setTexture,
    depthOptions: [{ id: "none", label: "None" }, ...DEPTH_EFFECTS],
    raysOptions: [{ id: "none", label: "None" }, ...RAYS_EFFECTS],
    textureOptions: [{ id: "none", label: "None" }, ...TEXTURE_EFFECTS],
  }
}

/**
 * Shared logic for the Photobook background toolbar.
 * Used by both the desktop pill and the mobile sheet.
 */
export function usePhotobookThemeToolbar() {
  const { themeCustomizations, updateThemeCustomization } = useThemeSelector((s) => ({
    themeCustomizations: s.themeCustomizations,
    updateThemeCustomization: s.updateThemeCustomization,
  }))

  const mood = themeCustomizations.photobookMood ?? "none"
  const texture = themeCustomizations.photobookTexture ?? "none"

  const handleReset = () =>
    updateThemeCustomization({ photobookMood: "none", photobookTexture: "none" })

  const setMood = (v: string) =>
    updateThemeCustomization({ photobookMood: v as PhotobookMood })

  const setTexture = (v: string) =>
    updateThemeCustomization({ photobookTexture: v as PhotobookTexture })

  const canReset = mood !== "none" || texture !== "none"

  return {
    mood,
    texture,
    canReset,
    handleReset,
    setMood,
    setTexture,
    moodOptions: MOOD_OPTIONS,
    textureOptions: TEXTURE_OPTIONS,
  }
}
