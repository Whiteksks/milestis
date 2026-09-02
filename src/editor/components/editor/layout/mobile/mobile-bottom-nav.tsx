'use client'

import { Layers, Paintbrush, Sparkles, LayoutTemplate } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import type { MobileEditorTab } from '@/editor/lib/config/editor-tabs'
import { useCanvasScrollContainer } from '@/editor/components/editor/canvas-scroll-context'
import { useScrollAtBottom } from '@/editor/hooks/use-scroll-at-bottom'

type NavTab = MobileEditorTab

interface MobileBottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const t = useTranslations('editor.layout.mobile')
  const scrollRef = useCanvasScrollContainer()
  const atBottom = useScrollAtBottom(scrollRef ?? { current: null }, 8)

  const tabs: { id: NavTab; icon: React.ElementType; label: string }[] = [
    { id: 'sections', icon: Layers, label: t('sections') },
    { id: 'background', icon: Paintbrush, label: t('background') },
    { id: 'decorations', icon: Sparkles, label: t('decorations') },
    { id: 'design', icon: LayoutTemplate, label: t('design') },
  ]

  return (
    // Static container — no layout properties animated
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none">
      <motion.div
        className={cn(
          'bg-card/75 backdrop-blur-xl border border-foreground/20 pointer-events-auto',
        )}
        // Start already in floating position — prevents docked→floating animation on mount
        initial={{ y: -8, borderRadius: '16px', marginLeft: 16, marginRight: 16 }}
        animate={{
          y: atBottom ? 0 : -8,
          // When docked, toolbar sits above — nav becomes a flat slab so together they look
          // like one unified element with the toolbar rounding the top.
          borderRadius: atBottom ? '16px 16px 0px 0px' : '16px',
          marginLeft: atBottom ? 0 : 16,
          marginRight: atBottom ? 0 : 16,
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 350, 
          damping: 35 
        }}
      >
        <div className="grid grid-cols-4 h-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              aria-label={tab.label}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={(e) => {
                // blur() — workaround для iOS: убирает focus-ring после тапа,
                // иначе кнопка остаётся выделенной до следующего касания экрана
                e.currentTarget.blur()
                onTabChange(tab.id)
              }}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <tab.icon className="w-[16px] h-[16px]" aria-hidden="true" />
              <span className="text-[12px] font-medium tracking-tight">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        {/* Safe area spacer for iOS home indicator */}
        <div className="h-safe-b" />
      </motion.div>
    </div>
  )
}
