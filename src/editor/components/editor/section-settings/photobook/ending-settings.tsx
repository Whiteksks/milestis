"use client"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentStore, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/ui/media-picker-modal'
import { ImagePicker } from '@/editor/components/editor/section-settings/ui/image-picker'
import { Separator } from '@/components/ui/separator'

export function PhotobookEndingSettings() {
  const { photobookSectionContent, updatePhotobookSection } = useContentStore()
  const { toggleMediaPicker } = useUiStore()

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"
  const textareaStyle = "rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs resize-none"

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal
        onSelectImage={(url) =>
          updatePhotobookSection('ending', {
            images: {
              id: photobookSectionContent.ending.images?.id || 'ending-detail',
              image: url,
              caption: photobookSectionContent.ending.images?.caption || '',
              imageSettings:
                photobookSectionContent.ending.images?.imageSettings?.length
                  ? photobookSectionContent.ending.images.imageSettings
                  : [{ aspectRatio: 'square', frameStyle: 'soft' }],
            },
          })
        }
      />

      <div className="p-6 max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Ending
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">A final thought or signature.</p>
        </div>
        
        {/* Секция 1: Текст и подпись */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Text Content</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Message</Label>
              <Textarea
                value={photobookSectionContent.ending.text || ''}
                onChange={(e) =>
                  updatePhotobookSection('ending', { text: e.target.value })
                }
                placeholder="Thank you for watching..."
                rows={4}
                className={textareaStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Signature</Label>
                <Input
                  value={photobookSectionContent.ending.signature || ''}
                  onChange={(e) =>
                    updatePhotobookSection('ending', { signature: e.target.value })
                  }
                  placeholder="Your Name"
                  className={`${inputStyle} italic`}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Date</Label>
                <Input
                  value={photobookSectionContent.ending.date || ''}
                  onChange={(e) =>
                    updatePhotobookSection('ending', { date: e.target.value })
                  }
                  placeholder="December 2025"
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="bg-slate-100" />

        {/* Секция 2: Изображение */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Decorative Image</h4>
          <ImagePicker
            label=""
            value={photobookSectionContent.ending.images}
            onChange={(next) =>
                updatePhotobookSection('ending', { images: next })
            }
            onOpenMediaPicker={toggleMediaPicker}
            // В завершении подпись, скорее всего, не нужна
            showCaption={false} 
          />
        </div>

      </div>
    </ScrollArea>
  )
}

export default PhotobookEndingSettings