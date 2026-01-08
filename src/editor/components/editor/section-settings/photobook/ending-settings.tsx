"use client"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { ImagePicker } from '@/editor/components/editor/section-settings/ui/image-picker'
import { Separator } from '@/components/ui/separator'

export function PhotobookEndingSettings() {
  const { ending, updatePhotobookSection } = useContentSelector((state) => ({
    ending: state.photobookSectionContent.ending,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const { toggleMediaPicker } = useUiSelector((state) => ({
    toggleMediaPicker: state.toggleMediaPicker,
  }))

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal
        onSelectImage={(url) =>
          updatePhotobookSection('ending', {
            images: {
              id: ending.images?.id || 'ending-detail',
              image: url,
              caption: ending.images?.caption || '',
              imageSettings:
                ending.images?.imageSettings?.length
                  ? ending.images.imageSettings
                  : [{ aspectRatio: 'square', frameStyle: 'soft' }],
            },
          })
        }
      />

      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Ending</h3>
          <p className="text-xs text-muted-foreground">A final thought or signature</p>
        </div>

        <div className="space-y-7">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Message</Label>
            <Textarea
              value={ending.text || ''}
              onChange={(e) => updatePhotobookSection('ending', { text: e.target.value })}
              placeholder="Thank you for watching..."
              rows={4}
              className="text-xs resize-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                value={ending.signature || ''}
                onChange={(e) => updatePhotobookSection('ending', { signature: e.target.value })}
                placeholder="Signature"
                className="h-9 text-xs italic"
              />
              <Input
                value={ending.date || ''}
                onChange={(e) => updatePhotobookSection('ending', { date: e.target.value })}
                placeholder="Date"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <Separator className="bg-border/40" />

          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Decorative Image</Label>
            <ImagePicker
              label=""
              value={ending.images}
              onChange={(next) => updatePhotobookSection('ending', { images: next })}
              onOpenMediaPicker={toggleMediaPicker}
              showCaption={false}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookEndingSettings