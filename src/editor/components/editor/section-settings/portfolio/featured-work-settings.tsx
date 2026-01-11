"use client"

import { FeaturedWorkHeaderPanel } from "./featured-work-panels"
import { FeaturedWorkProjectsPanel } from "./featured-work-panels"

export function FeaturedWorkSettings() {

  return (
    <div className="px-6 py-5 space-y-6">

      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Featured Work</h3>
        <p className="text-xs text-muted-foreground">Showcase your best projects</p>
      </div>

      <div className="space-y-7">
        <FeaturedWorkHeaderPanel />
        <FeaturedWorkProjectsPanel  />
      </div>
    </div>
  )
}
