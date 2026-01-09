"use client"

import { VideoHeaderPanel, VideoUrlPanel } from "./video-panels"

export function VideoSettings() {
  return (
    <div className="px-6 py-5 space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Video</h3>
        <p className="text-xs text-muted-foreground">Embed your YouTube video</p>
      </div>

      <div className="space-y-7">
        <VideoHeaderPanel />
        <VideoUrlPanel />
      </div>
    </div>
  )
}