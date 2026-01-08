"use client"

import { useContentSelector } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function VideoSettings() {
  const { video, updateSectionContent } = useContentSelector((state) => ({
    video: state.sectionContent.video,
    updateSectionContent: state.updateSectionContent,
  }))

  const handleVideoUrlChange = (rawUrl: string) => {
    let url = rawUrl.trim()
    if (url.includes('/embed/')) {
      updateSectionContent('video', { videoUrl: url })
      return
    }

    try {
      const parsed = new URL(url)

      if (parsed.hostname === 'youtu.be') {
        const id = parsed.pathname.replace('/', '')
        updateSectionContent('video', { videoUrl: `https://www.youtube.com/embed/${id}` })
        return
      }

      if (parsed.hostname.includes('youtube.com')) {
        const v = parsed.searchParams.get('v')
        if (v) {
          updateSectionContent('video', { videoUrl: `https://www.youtube.com/embed/${v}` })
          return
        }

        if (parsed.pathname.startsWith('/embed/')) {
          updateSectionContent('video', { videoUrl: url })
          return
        }
      }

      updateSectionContent('video', { videoUrl: url })
    } catch {
      updateSectionContent('video', { videoUrl: url })
    }
  }

  return (
    <div className="px-6 py-5 space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Video</h3>
        <p className="text-xs text-muted-foreground">Configure your video player (YouTube)</p>
      </div>

      <div className="space-y-7">
        <div className="space-y-3">
          <Label className="text-xs font-medium text-muted-foreground">Header</Label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              className="h-9 text-xs"
              value={video.title}
              onChange={(e) => updateSectionContent('video', { title: e.target.value })}
              placeholder="Title"
            />
            <Input
              className="h-9 text-xs"
              value={video.subtitle || ''}
              onChange={(e) => updateSectionContent('video', { subtitle: e.target.value })}
              placeholder="Subtitle"
            />
          </div>
          <Textarea
            className="min-h-22.5 text-xs resize-none"
            value={video.description}
            onChange={(e) => updateSectionContent('video', { description: e.target.value })}
            placeholder="Description..."
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">YouTube URL</Label>
          <Input
            className="h-9 text-xs"
            placeholder="https://www.youtube.com/watch?v=..."
            value={video.videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            Supports standard YouTube links and youtu.be
          </p>
        </div>
      </div>
    </div>
  )
}