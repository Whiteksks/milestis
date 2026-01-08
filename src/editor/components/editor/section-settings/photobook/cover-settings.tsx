"use client"

import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { ImagePicker } from '@/editor/components/editor/section-settings/ui/image-picker'
import { Separator } from '@/components/ui/separator'

export function PhotobookCoverSettings() {
  const { cover, updatePhotobookSection } = useContentSelector((state) => ({
    cover: state.photobookSectionContent.cover,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const { toggleMediaPicker } = useUiSelector((state) => ({
    toggleMediaPicker: state.toggleMediaPicker,
  }))

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal
        onSelectImage={(url) =>
          updatePhotobookSection('cover', {
            images: {
              id: cover.images?.id || 'cover-main',
              image: url,
              caption: cover.images?.caption || '',
              imageSettings:
                cover.images?.imageSettings?.length
                  ? cover.images.imageSettings
                  : [{ aspectRatio: 'landscape', frameStyle: 'soft' }],
            },
          })
        }
      />

      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Cover</h3>
          <p className="text-xs text-muted-foreground">Customize the main cover of your photobook</p>
        </div>

        <div className="space-y-7">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Text</Label>
            <div className="space-y-3">
              <Input
                value={cover.title}
                onChange={(e) => updatePhotobookSection('cover', { title: e.target.value })}
                placeholder="Photobook title"
                className="h-10 text-sm font-medium"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={cover.subtitle || ''}
                  onChange={(e) => updatePhotobookSection('cover', { subtitle: e.target.value })}
                  placeholder="Subtitle"
                  className="h-9 text-xs"
                />
                <Input
                  value={cover.tagline || ''}
                  onChange={(e) => updatePhotobookSection('cover', { tagline: e.target.value })}
                  placeholder="Tagline / quote"
                  className="h-9 text-xs italic"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-border/40" />

          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Metadata</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={cover.date || ''}
                onChange={(e) => updatePhotobookSection('cover', { date: e.target.value })}
                placeholder="Date"
                className="h-9 text-xs"
              />
              <Input
                value={cover.location || ''}
                onChange={(e) => updatePhotobookSection('cover', { location: e.target.value })}
                placeholder="Location"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <Separator className="bg-border/40" />

          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Cover Image</Label>
            <ImagePicker
              label=""
              value={cover.images}
              onChange={(next) => updatePhotobookSection('cover', { images: next })}
              onOpenMediaPicker={toggleMediaPicker}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookCoverSettings