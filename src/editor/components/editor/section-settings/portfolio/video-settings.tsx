"use client"

import { useContentStore } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

export function VideoSettings() {
  const { sectionContent, updateSectionContent } = useContentStore()

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"
  const textareaStyle = "rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs resize-none"

  const handleVideoUrlChange = (rawUrl: string) => {
    let url = rawUrl.trim()

    // If it's already an embed URL, keep as is
    if (url.includes('/embed/')) {
      updateSectionContent('video', { videoUrl: url })
      return
    }

    // Support common YouTube URL formats and convert to embed URL
    try {
      const parsed = new URL(url)

      // youtu.be/VIDEO_ID
      if (parsed.hostname === 'youtu.be') {
        const id = parsed.pathname.replace('/', '')
        updateSectionContent('video', { videoUrl: `https://www.youtube.com/embed/${id}` })
        return
      }

      // youtube.com or www.youtube.com
      if (parsed.hostname.includes('youtube.com')) {
        // watch?v=VIDEO_ID
        const v = parsed.searchParams.get('v')
        if (v) {
          updateSectionContent('video', { videoUrl: `https://www.youtube.com/embed/${v}` })
          return
        }

        // already /embed/VIDEO_ID but maybe with extra params
        if (parsed.pathname.startsWith('/embed/')) {
          updateSectionContent('video', { videoUrl: url })
          return
        }
      }

      // Fallback: store as-is if not recognized
      updateSectionContent('video', { videoUrl: url })
    } catch {
      // Not a valid URL, just store raw (user can fix)
      updateSectionContent('video', { videoUrl: url })
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8">
      
      {/* Общий заголовок настроек */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Video Section
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">Configure your video player (YouTube).</p>
      </div>

      {/* Секция 1: Текстовый контент */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Content</h4>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Section Title</Label>
          <Input 
            className={inputStyle} 
            value={sectionContent.video.title} 
            onChange={(e) => updateSectionContent('video', { title: e.target.value })} 
            placeholder="Watch my latest video"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Subtitle</Label>
          <Input 
            className={inputStyle} 
            value={sectionContent.video.subtitle || ''} 
            onChange={(e) => updateSectionContent('video', { subtitle: e.target.value })} 
            placeholder="Motion"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Description</Label>
          <Textarea 
            className={textareaStyle} 
            rows={3} 
            value={sectionContent.video.description} 
            onChange={(e) => updateSectionContent('video', { description: e.target.value })} 
            placeholder="Brief description of the video..."
          />
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Секция 2: Видео URL */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Video Source</h4>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">YouTube URL</Label>
          <Input 
            className={`${inputStyle} h-10`} 
            placeholder="https://www.youtube.com/watch?v=..." 
            value={sectionContent.video.videoUrl} 
            onChange={(e) => handleVideoUrlChange(e.target.value)} 
          />
          <p className="text-[10px] text-slate-400 mt-1.5 ml-1 leading-relaxed">
            Supports standard YouTube links, short links (`youtu.be/...`), and embed links. The URL will be converted automatically.
          </p>
        </div>
      </div>

    </div>
  )
}