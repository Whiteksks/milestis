'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Images, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  input: string
  canSend: boolean
  isLoading: boolean
  isPickerOpen: boolean
  selectedCount: number
  onInputChange: (value: string) => void
  onSend: () => void
  onPhotoButton: () => void
}

export function ChatInput({
  input,
  canSend,
  isLoading,
  isPickerOpen,
  selectedCount,
  onInputChange,
  onSend,
  onPhotoButton,
}: ChatInputProps) {
  const t = useTranslations('editor.layout.aiChat')

  return (
    <div className="shrink-0 border-t border-border p-3">
      <div className="flex gap-2 items-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onPhotoButton}
          title={t('attachPhotos')}            disabled={isLoading}          className={cn(
            'h-10 w-10 rounded-xl shrink-0 transition-colors',
            isPickerOpen || selectedCount > 0
              ? 'text-foreground bg-muted'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <div className="relative">
            <Images className="h-4 w-4" />
            {selectedCount > 0 && !isPickerOpen && (
              <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-foreground text-background text-[9px] font-bold flex items-center justify-center leading-none">
                {selectedCount}
              </span>
            )}
          </div>
        </Button>
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
          placeholder={t('inputPlaceholder')}
          disabled={isLoading}
          rows={2}
          className="flex-1 resize-none rounded-xl text-sm min-h-[44px] max-h-[120px]"
        />
        <Button
          onClick={onSend}
          disabled={!canSend || isLoading}
          size="icon"
          className="h-10 w-10 rounded-xl shrink-0 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
