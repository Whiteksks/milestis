"use client"

import { useMemo } from 'react'
import { useUiSelector } from '@/editor/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Layers, Paintbrush, Sparkles, PanelRightOpen, PanelLeftClose } from 'lucide-react'

import { SectionsTab } from '@/editor/components/editor/section-settings/ui/sections-tab'
import { ThemeTab } from '@/editor/components/editor/section-settings/ui/theme-tab'
import { DecorationsTab } from '@/editor/components/editor/section-settings/ui/decorations-tab'

export type DesktopEditorTab = 'sections' | 'theme' | 'decorations'

// Единая константа — spacer и панель анимируются на одно и то же значение
const SIDEBAR_WIDTH = 380
// Единая длительность — spacer (CSS) и панель (Framer Motion) синхронны
const SIDEBAR_DURATION = 0.3
const SIDEBAR_EASE = [0.32, 0.72, 0, 1] as const

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

  // Пересчитывается только при смене режима редактора
  const tabs = useMemo(
    () => [
      { id: 'sections' as const, icon: Layers, label: editorMode === 'portfolio' ? 'Sections' : 'Content' },
      { id: 'theme' as const, icon: Paintbrush, label: 'Theme' },
      { id: 'decorations' as const, icon: Sparkles, label: 'Decorations' },
    ],
    [editorMode],
  )

  const handleTabChange = (tab: DesktopEditorTab) => {
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
          width: isSidebarCollapsed ? 0 : SIDEBAR_WIDTH,
          transition: `width ${SIDEBAR_DURATION}s cubic-bezier(${SIDEBAR_EASE})`,
        }}
      />

      {/* Layer 2: visual panel — GPU translateX, no shadow */}
      <motion.div
        className="hidden md:flex flex-col absolute right-0 top-0 h-full border-l border-border/60 bg-card/80 z-20 overflow-visible will-change-transform transform-gpu"
        style={{ width: SIDEBAR_WIDTH }}
        initial={false}
        animate={{ x: isSidebarCollapsed ? SIDEBAR_WIDTH : 0 }}
        transition={{
          type: 'tween',
          duration: SIDEBAR_DURATION,
          ease: SIDEBAR_EASE,
        }}
      >
        {/* Toggle button */}
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'group absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 z-30',
            'hidden md:flex items-center justify-center',
            'w-12 h-16 rounded-none rounded-l-xl p-0',
            'bg-card/95 border border-border/60 border-r-0',
            'hover:bg-muted/60',
          )}
        >
          <span className={cn('transition-transform duration-200', isSidebarCollapsed ? 'rotate-0' : 'rotate-180')}>
            {isSidebarCollapsed ? (
              <PanelRightOpen className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <PanelLeftClose className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </span>
        </Button>

        {/* Content — always mounted, opacity fade only.
            inert исключает весь поддерев из tab-order и дерева доступности
            когда панель скрыта — фокус клавиатуры не проваливается внутрь. */}
        <div
          className="flex flex-col h-full w-full transition-opacity duration-150"
          style={{ opacity: isSidebarCollapsed ? 0 : 1 }}
          inert={isSidebarCollapsed || undefined}
        >
          {/* Tabs */}
          <div className="border-b border-border/40">
            <div className="flex justify-center gap-1 px-4 pt-1">
              {tabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-3 text-sm transition-all',
                    activeTab === id
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground font-normal'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
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
