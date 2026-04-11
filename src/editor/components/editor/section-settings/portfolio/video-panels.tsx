"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ps, LIMITS, editorialInput, editorialLabel, CharCounter } from "@/editor/components/editor/section-settings/ui/panel-ui"

export function VideoHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { video, updateSectionContent } = useContentSelector((state) => ({
    video: state.sectionContent.video,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <div className={ps.grid2(true)}>
          <Input className={ps.input} value={video.title} onChange={(e) => updateSectionContent("video", { title: e.target.value })} placeholder="Title" maxLength={LIMITS.title} />
          <Input className={ps.input} value={video.subtitle || ""} onChange={(e) => updateSectionContent("video", { subtitle: e.target.value })} placeholder="Subtitle" maxLength={LIMITS.subtitle} />
        </div>
        <Textarea className={ps.textarea(true)} value={video.description} onChange={(e) => updateSectionContent("video", { description: e.target.value })} placeholder="Description..." maxLength={LIMITS.description} />
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 divide-x divide-border/30 border-b border-border/30 pb-6">
        <div className="space-y-1 pr-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>Title</label>
            <CharCounter value={video.title} limit={LIMITS.title} />
          </div>
          <Input
            className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
            value={video.title}
            onChange={(e) => updateSectionContent("video", { title: e.target.value })}
            placeholder="Video title"
            maxLength={LIMITS.title}
          />
        </div>
        <div className="space-y-1 pl-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>Subtitle</label>
            <CharCounter value={video.subtitle || ""} limit={LIMITS.subtitle} />
          </div>
          <Input
            className={cn(editorialInput, "text-base text-muted-foreground")}
            value={video.subtitle || ""}
            onChange={(e) => updateSectionContent("video", { subtitle: e.target.value })}
            placeholder="Subtitle text"
            maxLength={LIMITS.subtitle}
          />
        </div>
      </div>
      <div className="py-6 border-b border-border/30 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <label className={editorialLabel}>Description</label>
          <CharCounter value={video.description} limit={LIMITS.description} />
        </div>
        <Textarea
          className={cn(editorialInput, "text-base leading-relaxed min-h-[100px] w-full max-w-full resize-none block overflow-x-hidden break-words")}
          value={video.description}
          onChange={(e) => updateSectionContent("video", { description: e.target.value })}
          placeholder="Describe the video..."
          maxLength={LIMITS.description}
        />
      </div>
    </div>
  )
}

export function VideoUrlPanel({ dense = false }: { dense?: boolean }) {
  const { video, updateSectionContent } = useContentSelector((state) => ({
    video: state.sectionContent.video,
    updateSectionContent: state.updateSectionContent,
  }))

  const handleVideoUrlChange = (rawUrl: string) => {
    const url = rawUrl.trim()
    if (url.includes("/embed/")) {
      updateSectionContent("video", { videoUrl: url })
      return
    }

    try {
      const parsed = new URL(url)

      if (parsed.hostname === "youtu.be") {
        const id = parsed.pathname.replace("/", "")
        updateSectionContent("video", { videoUrl: `https://www.youtube.com/embed/${id}` })
        return
      }

      if (parsed.hostname.includes("youtube.com")) {
        const v = parsed.searchParams.get("v")
        if (v) {
          updateSectionContent("video", { videoUrl: `https://www.youtube.com/embed/${v}` })
          return
        }

        if (parsed.pathname.startsWith("/embed/")) {
          updateSectionContent("video", { videoUrl: url })
          return
        }
      }

      updateSectionContent("video", { videoUrl: url })
    } catch {
      updateSectionContent("video", { videoUrl: url })
    }
  }

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <Input
          className={ps.input}
          placeholder="https://www.youtube.com/watch?v=..."
          value={video.videoUrl}
          onChange={(e) => handleVideoUrlChange(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="py-6 space-y-3">
      <label className={editorialLabel}>YouTube URL</label>
      <Input
        className={cn(editorialInput, "text-base text-foreground")}
        placeholder="https://www.youtube.com/watch?v=..."
        value={video.videoUrl}
        onChange={(e) => handleVideoUrlChange(e.target.value)}
      />
      <p className="text-[11px] text-muted-foreground/50">Supports standard YouTube links and youtu.be</p>
    </div>
  )
}
