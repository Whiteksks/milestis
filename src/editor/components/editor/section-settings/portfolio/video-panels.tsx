"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"

export function VideoHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { video, updateSectionContent } = useContentSelector((state) => ({
    video: state.sectionContent.video,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Header</PanelLabel>}
      <div className={ps.grid2(dense)}>
        <Input
          className={ps.input}
          value={video.title}
          onChange={(e) => updateSectionContent("video", { title: e.target.value })}
          placeholder="Title"
        />
        <Input
          className={ps.input}
          value={video.subtitle || ""}
          onChange={(e) => updateSectionContent("video", { subtitle: e.target.value })}
          placeholder="Subtitle"
        />
      </div>
      {!dense && (
        <Textarea
          className={ps.textarea(dense)}
          value={video.description}
          onChange={(e) => updateSectionContent("video", { description: e.target.value })}
          placeholder="Description..."
        />
      )}
    </div>
  )
}

export function VideoUrlPanel({ dense = false }: { dense?: boolean }) {
  const { video, updateSectionContent } = useContentSelector((state) => ({
    video: state.sectionContent.video,
    updateSectionContent: state.updateSectionContent,
  }))

  const handleVideoUrlChange = (rawUrl: string) => {
    let url = rawUrl.trim()
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

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>YouTube URL</PanelLabel>}
      <Input
        className={ps.input}
        placeholder="https://www.youtube.com/watch?v=..."
        value={video.videoUrl}
        onChange={(e) => handleVideoUrlChange(e.target.value)}
      />
      {!dense && (
        <p className="text-[11px] text-muted-foreground/60">Supports standard YouTube links and youtu.be</p>
      )}
    </div>
  )
}
