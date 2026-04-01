"use client"

import { FeaturedWorkHeaderPanel, FeaturedWorkProjectsPanel } from "./featured-work-panels"

export function FeaturedWorkSettings() {
  return (
    <div className="space-y-6">
      <FeaturedWorkHeaderPanel />
      <FeaturedWorkProjectsPanel  />
    </div>
  )
}
