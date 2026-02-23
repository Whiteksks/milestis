'use client'

import { Layers, Paintbrush, Sparkles, LayoutTemplate } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useCanvasScrollContainer } from '@/editor/components/editor/canvas-scroll-context'
import { useScrollAtBottom } from '@/editor/hooks/use-scroll-at-bottom'

interface MobileBottomNavProps {
  activeTab: 'sections' | 'theme' | 'decorations' | 'design'
  onTabChange: (tab: 'sections' | 'theme' | 'decorations' | 'design') => void
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const scrollRef = useCanvasScrollContainer()
  const atBottom = useScrollAtBottom(scrollRef ?? { current: null }, 8)

  const tabs = [
    { id: 'sections' as const, icon: Layers, label: 'Sections' },
    { id: 'theme' as const, icon: Paintbrush, label: 'Theme' },
    { id: 'decorations' as const, icon: Sparkles, label: 'Decor' },
    { id: 'design' as const, icon: LayoutTemplate, label: 'Design' },
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
              onClick={(e) => {
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
              <tab.icon className="w-[16px] h-[16px]" />
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
