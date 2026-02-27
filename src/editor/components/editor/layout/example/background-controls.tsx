"use client"

import { cn } from "@/lib/utils"
import type { DepthEffect, TextureEffect, RayEffect } from "./background-layers"

interface BackgroundControlsProps {
  depth: DepthEffect
  texture: TextureEffect
  rays: RayEffect
  theme: "dark" | "light"
  onDepthChange: (v: DepthEffect) => void
  onTextureChange: (v: TextureEffect) => void
  onRaysChange: (v: RayEffect) => void
  onThemeChange: (v: "dark" | "light") => void
}

const depthOptions: { id: DepthEffect; label: string }[] = [
  { id: "none", label: "None" },
  { id: "radial-glow", label: "Glow" },
  { id: "vignette", label: "Vignette" },
  { id: "ambient-blobs", label: "Blobs" },
  { id: "asymmetric-light", label: "Asymmetric" },
]

const textureOptions: { id: TextureEffect; label: string }[] = [
  { id: "none", label: "None" },
  { id: "grain", label: "Grain" },
  { id: "dots", label: "Dots" },
  { id: "lines", label: "Lines" },
  { id: "grid", label: "Grid" },
]

const rayOptions: { id: RayEffect; label: string }[] = [
  { id: "none", label: "None" },
  { id: "diagonal-rays", label: "Diagonal" },
  { id: "conic-rays", label: "Conic" },
  { id: "soft-streaks", label: "Streaks" },
]

function OptionRow<T extends string>({
  label,
  options,
  active,
  onChange,
}: {
  label: string
  options: { id: T; label: string }[]
  active: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/50">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "px-3 py-1.5 text-[11px] font-medium tracking-wider rounded-md transition-all duration-200",
              active === opt.id
                ? "bg-foreground/15 text-foreground border border-foreground/20"
                : "text-foreground/40 hover:text-foreground/70 border border-transparent"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function BackgroundControls({
  depth,
  texture,
  rays,
  theme,
  onDepthChange,
  onTextureChange,
  onRaysChange,
  onThemeChange,
}: BackgroundControlsProps) {
  return (
    <div className="fixed top-6 right-6 z-50 w-72">
      <div className="rounded-2xl bg-card/70 backdrop-blur-2xl border border-border/50 p-5 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground/70">
            Background
          </h3>
          <button
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-medium tracking-wider uppercase rounded-full border border-border/50 text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                theme === "dark" ? "bg-foreground/30" : "bg-accent"
              )}
            />
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <OptionRow
            label="Depth"
            options={depthOptions}
            active={depth}
            onChange={onDepthChange}
          />
          <div className="h-px bg-border/30" />
          <OptionRow
            label="Rays"
            options={rayOptions}
            active={rays}
            onChange={onRaysChange}
          />
          <div className="h-px bg-border/30" />
          <OptionRow
            label="Texture"
            options={textureOptions}
            active={texture}
            onChange={onTextureChange}
          />
        </div>
      </div>
    </div>
  )
}
