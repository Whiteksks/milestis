"use client"

import { useUiSelector } from '@/editor/lib/store'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Layers, Paintbrush, Sparkles, PanelRightOpen, PanelLeftClose } from 'lucide-react'

import { SectionsTab } from '@/editor/components/editor/section-settings/ui/sections-tab'
import { ThemeTab } from '@/editor/components/editor/section-settings/ui/theme-tab'
import { DecorationsTab } from '@/editor/components/editor/section-settings/ui/decorations-tab'

export type DesktopEditorTab = 'sections' | 'theme' | 'decorations'

export function SectionsSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: DesktopEditorTab
  onTabChange: (tab: DesktopEditorTab) => void
}) {
  const { isSidebarCollapsed, toggleSidebar, editorMode, setSelectedDecorationId } = useUiSelector((state) => ({
    isSidebarCollapsed: state.isSidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
    editorMode: state.editorMode,
    setSelectedDecorationId: state.setSelectedDecorationId,
  }))

  const handleTabChange = (tab: 'sections' | 'theme' | 'decorations') => {
    onTabChange(tab)
    setSelectedDecorationId(null)
  }

  return (
    <>
      {/*
        Two-layer approach:
        1. A CSS-only spacer div reserves flex space so the canvas shifts — layout
           reflow is unavoidable here, but it's driven by the CSS engine (one pass
           per frame) rather than a JS RAF callback.
        2. The visible panel is absolutely positioned and animates with translateX
           only — pure compositor, zero layout cost for the actual rendering.
      */}

      {/* Layer 1: layout spacer — hidden md:block, no paint */}
      <div
        className="hidden md:block shrink-0 h-full"
        style={{
          width: isSidebarCollapsed ? 0 : 380,
          transition: 'width 0.22s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />

      {/* Layer 2: visual panel — GPU translateX, no shadow */}
      <motion.div
        className="hidden md:flex flex-col absolute right-0 top-0 h-full w-[380px] border-l border-border/60 bg-card/80 z-20 overflow-visible will-change-transform transform-gpu"
        initial={false}
        animate={{ x: isSidebarCollapsed ? 380 : 0 }}
        transition={{
          type: 'tween',
          duration: 0.3,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            'group absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 z-30',
            'hidden md:flex items-center justify-center',
            'w-12 h-16 rounded-l-xl',
            'bg-card/95 border border-border/60 border-r-0',
            'hover:bg-muted/60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'transition-colors duration-200',
          )}
        >
          <span
            className="transition-transform duration-200"
            style={{ transform: isSidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            {isSidebarCollapsed ? (
              <PanelRightOpen className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <PanelLeftClose className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </span>
        </button>

        {/* Content — always mounted, opacity fade only */}
        <div
          className="flex flex-col h-full w-full transition-opacity duration-150"
          style={{
            opacity: isSidebarCollapsed ? 0 : 1,
            pointerEvents: isSidebarCollapsed ? 'none' : 'auto',
          }}
        >
          {/* Tabs */}
          <div className="border-b border-border/40">
            <div className="flex justify-center gap-1 px-4 pt-1">
              {[
                { id: 'sections' as const, icon: Layers, label: editorMode === 'portfolio' ? 'Sections' : 'Content' },
                { id: 'theme' as const, icon: Paintbrush, label: 'Theme' },
                { id: 'decorations' as const, icon: Sparkles, label: 'Decorations' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-3 text-sm transition-all',
                    activeTab === id
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground font-normal'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                  {activeTab === id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'sections' ? <SectionsTab /> : activeTab === 'theme' ? <ThemeTab /> : <DecorationsTab />}
        </div>
      </motion.div>
    </>
  )
}
