'use client'

import { Layers, Paintbrush, Sparkles, LayoutTemplate } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileBottomNavProps {
  activeTab: 'sections' | 'theme' | 'decorations' | 'design'
  onTabChange: (tab: 'sections' | 'theme' | 'decorations' | 'design') => void
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const tabs = [
    { id: 'sections' as const, icon: Layers, label: 'Sections' },
    { id: 'theme' as const, icon: Paintbrush, label: 'Theme' },
    { id: 'decorations' as const, icon: Sparkles, label: 'Decor' },
    { id: 'design' as const, icon: LayoutTemplate, label: 'Design' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-2 md:hidden">
      <div className="bg-card/75 backdrop-blur-xl border border-foreground/20 rounded-2xl shadow-[0_-4px_24px_0_hsl(var(--foreground)/0.08)]">
        <div className="grid grid-cols-4 h-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
      </div>
    </div>
  )
}
