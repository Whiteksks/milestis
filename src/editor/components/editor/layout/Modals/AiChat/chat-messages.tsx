'use client'

import { useRef, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { Message } from './types'
import { UserAvatar } from '@/components/shared/user-avatar'

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
  greeting?: string
  quickPrompts?: string[]
  onQuickPromptSelect?: (prompt: string) => void
  loadingCaption?: string
  onOpenSection?: (sectionId: string) => void
}

function TypingGreeting({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    setDisplayed('')
    let i = 0
    // Small initial delay before typing starts
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
      }, 20)
      return () => clearInterval(interval)
    }, 450)
    return () => clearTimeout(startTimer)
  }, [text])

  // Blink cursor while typing, hide when done
  useEffect(() => {
    if (displayed.length >= text.length) {
      setShowCursor(false)
      return
    }
    const blink = setInterval(() => setShowCursor((v) => !v), 500)
    return () => clearInterval(blink)
  }, [displayed.length, text.length])

  return (
    <div className="flex gap-2.5 justify-start">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted border border-border mt-0.5">
        <Sparkles className="h-3.5 w-3.5 text-foreground/60" />
      </div>
      <div className="bg-muted border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%]">
        {displayed || <span className="opacity-0">_</span>}
        {showCursor && <span className="ml-0.5 inline-block w-0.5 h-3.5 bg-foreground/60 align-middle animate-pulse" />}
      </div>
    </div>
  )
}

export function ChatMessages({ messages, isLoading, greeting, quickPrompts, onQuickPromptSelect, loadingCaption, onOpenSection }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('editor.layout.aiChat')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="pt-2 space-y-3">
          {greeting ? (
            <TypingGreeting key={greeting} text={greeting} />
          ) : null}
          {quickPrompts && quickPrompts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pl-9">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onQuickPromptSelect?.(prompt)}
                  className="text-xs rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        messages.map((msg, i) => (
          <div
            key={i}
            className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted border border-border mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-foreground/60" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] flex flex-col gap-1.5',
                msg.role === 'user' && 'items-end',
              )}
            >
              {msg.photos && msg.photos.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {msg.photos.map((url, pi) => (
                    <div
                      key={pi}
                      className="relative h-16 w-16 rounded-xl overflow-hidden border border-border"
                    >
                      <Image src={url} alt="" fill unoptimized sizes="64px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {msg.content && (
                <div
                  className={cn(
                    'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-foreground text-background rounded-br-sm'
                      : msg.isError
                        ? 'bg-destructive/10 border border-destructive/30 text-destructive rounded-bl-sm'
                        : 'bg-muted border border-border rounded-bl-sm',
                  )}
                >
                  {msg.content}
                </div>
              )}
              {msg.role === 'assistant' && msg.sectionsToOpen && msg.sectionsToOpen.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.sectionsToOpen.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => onOpenSection?.(section.id)}
                      className="inline-flex items-center gap-1.5 text-xs rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors"
                    >
                      <PenLine className="h-3 w-3" />
                      {t('openSectionCta', { name: section.name })}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="shrink-0 h-7 w-7 rounded-full overflow-hidden mt-0.5">
                <UserAvatar size="xs" shape="circle" />
              </div>
            )}
          </div>
        ))
      )}

      {/* Typing indicator while AI is working */}
      {isLoading && (
        <div className="flex gap-2.5 justify-start">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted border border-border mt-0.5">
            <Sparkles className="h-3.5 w-3.5 text-foreground/60" />
          </div>
          <div className="bg-muted border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-2">
            <span className="flex items-center gap-1 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
            </span>
            {loadingCaption && (
              <span className="text-xs text-muted-foreground">{loadingCaption}</span>
            )}
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
