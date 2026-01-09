"use client"

import { BioAchievementsPanel, BioBiographyPanel, BioPhotoPanel, BioTitlePanel } from './bio-panels'

export function BioSettings() {
  return (
    <div className="px-6 py-5 space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Bio</h3>
        <p className="text-xs text-muted-foreground">About you, profile photo, and highlights</p>
      </div>

      <div className="space-y-7">
        <BioTitlePanel />
        <BioPhotoPanel />
        <BioBiographyPanel />
        <BioAchievementsPanel />
      </div>
    </div>
  )
}
