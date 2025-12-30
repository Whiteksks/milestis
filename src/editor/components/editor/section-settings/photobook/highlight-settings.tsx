"use client"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentStore, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { ImagePicker } from '@/editor/components/editor/section-settings/ui/image-picker'
import { Separator } from '@/components/ui/separator'

export function PhotobookHighlightSettings() {
  const { photobookSectionContent, updatePhotobookSection } = useContentStore()
  const { toggleMediaPicker } = useUiStore()

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"
  const textareaStyle = "rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs resize-none"

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal
        onSelectImage={(url) =>
          updatePhotobookSection('highlight', {
            images: {
              id: photobookSectionContent.highlight.images?.id || 'highlight-main',
              image: url,
              caption: photobookSectionContent.highlight.images?.caption || '',
              imageSettings:
                photobookSectionContent.highlight.images?.imageSettings?.length
                  ? photobookSectionContent.highlight.images.imageSettings
                  : [{ aspectRatio: 'landscape', frameStyle: 'film' }],
            },
          })
        }
      />
      <div className="p-6 max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Highlight
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Feature a special moment.</p>
        </div>

        {/* Секция 1: Текстовый контент */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Text Content</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Title</Label>
              <Input
                value={photobookSectionContent.highlight.title || ''}
                onChange={(e) => updatePhotobookSection('highlight', { title: e.target.value })}
                placeholder="Main Title"
                className={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Description / Story</Label>
              <Textarea
                value={photobookSectionContent.highlight.description || ''}
                onChange={(e) => updatePhotobookSection('highlight', { description: e.target.value })}
                placeholder="Tell the story of this moment..."
                rows={5}
                className={textareaStyle}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Quote</Label>
              <Input
                value={photobookSectionContent.highlight.quote || ''}
                onChange={(e) =>
                  updatePhotobookSection('highlight', { quote: e.target.value })
                }
                placeholder="Short quote or thought"
                className={`${inputStyle} italic`}
              />
            </div>
          </div>
        </div>
        
        <Separator className="bg-slate-100" />

        {/* Секция 2: Изображение */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Image</h4>
          <ImagePicker
            label=""
            value={photobookSectionContent.highlight.images}
            onChange={(next) =>
              updatePhotobookSection('highlight', { images: next })
            }
            onOpenMediaPicker={toggleMediaPicker}
            showCaption={false}
          />
        </div>

      </div>
    </ScrollArea>
  )
}

export default PhotobookHighlightSettings