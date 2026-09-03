'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'

interface ChatInputProps {
  input: string
  canSend: boolean
  isLoading: boolean
  onInputChange: (value: string) => void
  onSend: () => void
}

export function ChatInput({
  input,
  canSend,
  isLoading,
  onInputChange,
  onSend,
}: ChatInputProps) {
  const t = useTranslations('editor.layout.aiChat')

  return (
    <div className="shrink-0 border-t border-border p-3">
      <div className="flex gap-2 items-end">
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
      <p className="mt-2 text-center text-[11px] text-muted-foreground/70">{t('disclaimer')}</p>
    </div>
  )
}
