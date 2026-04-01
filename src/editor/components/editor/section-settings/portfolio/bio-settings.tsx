"use client"

import { BioAchievementsPanel, BioBiographyPanel, BioPhotoPanel, BioTitlePanel } from './bio-panels'

export function BioSettings() {
  return (
    <div className="space-y-6">
        <BioTitlePanel />
        <BioPhotoPanel />
        <BioBiographyPanel />
        <BioAchievementsPanel />
    </div>
  )
}
