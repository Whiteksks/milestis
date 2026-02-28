"use client"

import { HeroDescriptionPanel, HeroTitlePanel, HeroImagePanel } from './hero-panels'

export function HeroSettings() {
  return (
    <div className="px-6 py-5 space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Hero</h3>
        <p className="text-xs text-muted-foreground">Main headline and introduction</p>
      </div>

      <div className="space-y-6">
        <HeroTitlePanel />
        <HeroDescriptionPanel />
        <HeroImagePanel />
      </div>
    </div>
  )
}
