"use client"

import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentStore, useUiStore } from '@/editor/lib/store'
import { ImagePicker } from '@/editor/components/editor/section-settings/ui/image-picker'
import { Separator } from '@/components/ui/separator'

export function PhotobookCoverSettings() {
  const { photobookSectionContent, updatePhotobookSection } = useContentStore()
  const { toggleMediaPicker } = useUiStore()

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal
        onSelectImage={(url) =>
          updatePhotobookSection('cover', {
            images: {
              id: photobookSectionContent.cover.images?.id || 'cover-main',
              image: url,
              caption: photobookSectionContent.cover.images?.caption || '',
              imageSettings:
                photobookSectionContent.cover.images?.imageSettings?.length
                  ? photobookSectionContent.cover.images.imageSettings
                  : [{ aspectRatio: 'landscape', frameStyle: 'soft' }],
            },
          })
        }
      />

      <div className="p-6 max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Cover Settings
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Customize the main cover of your photobook.</p>
        </div>

        {/* Секция 1: Текстовый контент обложки */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Text Content</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Main Title</Label>
              <Input
                value={photobookSectionContent.cover.title}
                onChange={(e) => updatePhotobookSection('cover', { title: e.target.value })}
                placeholder="Photobook Title"
                className="h-10 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-sm font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Subtitle</Label>
              <Input
                value={photobookSectionContent.cover.subtitle || ''}
                onChange={(e) => updatePhotobookSection('cover', { subtitle: e.target.value })}
                placeholder="Short description"
                className={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Tagline / Quote</Label>
              <Input
                value={photobookSectionContent.cover.tagline || ''}
                onChange={(e) =>
                  updatePhotobookSection('cover', { tagline: e.target.value })
                }
                placeholder="A short phrase on the cover"
                className={`${inputStyle} italic`}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Секция 2: Метаданные */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Metadata</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Date</Label>
              <Input
                value={photobookSectionContent.cover.date || ''}
                onChange={(e) =>
                  updatePhotobookSection('cover', { date: e.target.value })
                }
                placeholder="August 12, 2024"
                className={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Location</Label>
              <Input
                value={photobookSectionContent.cover.location || ''}
                onChange={(e) =>
                  updatePhotobookSection('cover', { location: e.target.value })
                }
                placeholder="New York, NY"
                className={inputStyle}
              />
            </div>
          </div>
        </div>
        
        <Separator className="bg-slate-100" />

        {/* Секция 3: Изображение обложки */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Cover Image</h4>
          <ImagePicker
            label=""
            value={photobookSectionContent.cover.images}
            onChange={(next) =>
              updatePhotobookSection('cover', { images: next })
            }
            onOpenMediaPicker={toggleMediaPicker}
          />
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookCoverSettings