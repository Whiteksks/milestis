"use client"

import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentStore, useUiStore } from '@/editor/lib/store'
import { ImagePicker } from '@/editor/components/editor/section-settings/ui/image-picker'
import { Separator } from '@/components/ui/separator'

export function PhotobookIntroductionSettings() {
  const { photobookSectionContent, updatePhotobookSection } = useContentStore()
  const { toggleMediaPicker } = useUiStore()

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"
  const textareaStyle = "rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs resize-none"

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal
        onSelectImage={(url) =>
          updatePhotobookSection('introduction', {
            images: {
              id: photobookSectionContent.introduction.images?.id || 'intro-main',
              image: url,
              caption: photobookSectionContent.introduction.images?.caption || '',
              imageSettings:
                photobookSectionContent.introduction.images?.imageSettings?.length
                  ? photobookSectionContent.introduction.images.imageSettings
                  : [{ aspectRatio: 'portrait', frameStyle: 'soft' }],
            },
          })
        }
      />

      <div className="p-6 max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Introduction
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Set the tone for your photobook.</p>
        </div>

        {/* Секция текстового контента */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Text Content</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Page Title</Label>
              <Input
                value={photobookSectionContent.introduction.title}
                onChange={(e) => updatePhotobookSection('introduction', { title: e.target.value })}
                placeholder="Introduction"
                className={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Quote</Label>
              <Input
                value={photobookSectionContent.introduction.quote || ''}
                onChange={(e) =>
                  updatePhotobookSection('introduction', { quote: e.target.value })
                }
                placeholder="A meaningful quote..."
                className={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Dedication</Label>
              <Textarea
                value={photobookSectionContent.introduction.dedication || ''}
                onChange={(e) =>
                  updatePhotobookSection('introduction', { dedication: e.target.value })
                }
                placeholder="Write a few words..."
                rows={4}
                className={textareaStyle}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Секция изображения */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Main Image</h4>
          <div className="rounded-xl overflow-hidden border border-dashed border-slate-200 p-1 bg-slate-50/50">
            <ImagePicker
              label=""
              value={photobookSectionContent.introduction.images}
              onChange={(next) =>
                updatePhotobookSection('introduction', { images: next })
              }
              onOpenMediaPicker={toggleMediaPicker}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookIntroductionSettings