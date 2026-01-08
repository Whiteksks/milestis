"use client"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { ImagePicker } from '@/editor/components/editor/section-settings/ui/image-picker'
import { Separator } from '@/components/ui/separator'

export function PhotobookHighlightSettings() {
  const { highlight, updatePhotobookSection } = useContentSelector((state) => ({
    highlight: state.photobookSectionContent.highlight,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const { toggleMediaPicker } = useUiSelector((state) => ({
    toggleMediaPicker: state.toggleMediaPicker,
  }))

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal
        onSelectImage={(url) =>
          updatePhotobookSection('highlight', {
            images: {
              id: highlight.images?.id || 'highlight-main',
              image: url,
              caption: highlight.images?.caption || '',
              imageSettings:
                highlight.images?.imageSettings?.length
                  ? highlight.images.imageSettings
                  : [{ aspectRatio: 'landscape', frameStyle: 'film' }],
            },
          })
        }
      />
      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Highlight</h3>
          <p className="text-xs text-muted-foreground">Feature a special moment</p>
        </div>

        <div className="space-y-7">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Text</Label>
            <Input
              value={highlight.title || ''}
              onChange={(e) => updatePhotobookSection('highlight', { title: e.target.value })}
              placeholder="Title"
              className="h-9 text-xs"
            />

            <Textarea
              value={highlight.description || ''}
              onChange={(e) => updatePhotobookSection('highlight', { description: e.target.value })}
              placeholder="Tell the story of this moment..."
              rows={5}
              className="text-xs resize-none"
            />

            <Input
              value={highlight.quote || ''}
              onChange={(e) => updatePhotobookSection('highlight', { quote: e.target.value })}
              placeholder="Quote (optional)"
              className="h-9 text-xs italic"
            />
          </div>

          <Separator className="bg-border/40" />

          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Image</Label>
            <ImagePicker
              label=""
              value={highlight.images}
              onChange={(next) => updatePhotobookSection('highlight', { images: next })}
              onOpenMediaPicker={toggleMediaPicker}
              showCaption={false}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookHighlightSettings