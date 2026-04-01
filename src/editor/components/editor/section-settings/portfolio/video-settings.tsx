"use client"

import { VideoHeaderPanel, VideoUrlPanel } from "./video-panels"

export function VideoSettings() {
  return (
    <div className="space-y-6">
      <VideoHeaderPanel />
      <VideoUrlPanel />
    </div>
  )
}