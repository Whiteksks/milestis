"use client"

import { HeroDescriptionPanel, HeroTitlePanel, HeroImagePanel } from './hero-panels'

export function HeroSettings() {
  return (
    <div className="space-y-6">
      <HeroTitlePanel />
      <HeroDescriptionPanel />
      <HeroImagePanel />
    </div>
  )
}
