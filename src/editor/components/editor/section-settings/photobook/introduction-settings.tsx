"use client"

import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { ImagePicker } from '@/editor/components/editor/section-settings/ui/image-picker'
import { Separator } from '@/components/ui/separator'

export function PhotobookIntroductionSettings() {
  const { introduction, updatePhotobookSection } = useContentSelector((state) => ({
    introduction: state.photobookSectionContent.introduction,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const { toggleMediaPicker } = useUiSelector((state) => ({
    toggleMediaPicker: state.toggleMediaPicker,
  }))

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal
        onSelectImage={(url) =>
          updatePhotobookSection('introduction', {
            images: {
              id: introduction.images?.id || 'intro-main',
              image: url,
              caption: introduction.images?.caption || '',
              imageSettings:
                introduction.images?.imageSettings?.length
                  ? introduction.images.imageSettings
                  : [{ aspectRatio: 'portrait', frameStyle: 'soft' }],
            },
          })
        }
      />

      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Introduction</h3>
          <p className="text-xs text-muted-foreground">Set the tone for your photobook</p>
        </div>

        <div className="space-y-7">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Text</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={introduction.title}
                onChange={(e) => updatePhotobookSection('introduction', { title: e.target.value })}
                placeholder="Page title"
                className="h-9 text-xs"
              />
              <Input
                value={introduction.quote || ''}
                onChange={(e) => updatePhotobookSection('introduction', { quote: e.target.value })}
                placeholder="Quote"
                className="h-9 text-xs"
              />
            </div>
            <Textarea
              value={introduction.dedication || ''}
              onChange={(e) => updatePhotobookSection('introduction', { dedication: e.target.value })}
              placeholder="Dedication..."
              rows={4}
              className="text-xs resize-none"
            />
          </div>

          <Separator className="bg-border/40" />

          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Main Image</Label>
            <ImagePicker
              label=""
              value={introduction.images}
              onChange={(next) => updatePhotobookSection('introduction', { images: next })}
              onOpenMediaPicker={toggleMediaPicker}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookIntroductionSettings