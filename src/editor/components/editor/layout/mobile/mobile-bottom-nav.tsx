'use client'

import { Settings, Layers, Palette, Sticker } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface MobileBottomNavProps {
  activeTab: 'sections' | 'theme' | 'templates' | 'decorations'
  onTabChange: (tab: 'sections' | 'theme' | 'templates' | 'decorations') => void
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const tabs = [
    { id: 'sections' as const, icon: Settings, label: 'Sections' },
    { id: 'templates' as const, icon: Layers, label: 'Template' },
    { id: 'theme' as const, icon: Palette, label: 'Theme' },
    { id: 'decorations' as const, icon: Sticker, label: 'Decor' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg">
        <div className="grid grid-cols-4 h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 relative transition-colors",
                activeTab === tab.id
                  ? "text-slate-900"
                  : "text-slate-500"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-slate-100"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className={cn(
                "w-5 h-5 relative z-10",
                activeTab === tab.id && "text-slate-900"
              )} />
              <span className={cn(
                "text-xs font-medium relative z-10",
                activeTab === tab.id && "text-slate-900"
              )}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
