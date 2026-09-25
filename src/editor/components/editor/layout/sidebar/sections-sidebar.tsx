"use client"

import { useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useUiSelector } from '@/editor/lib/store'
import { getModeUiConfig } from '@/editor/lib/modes'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { Layers, Sparkles, PanelRightOpen, PanelLeftClose, WandSparkles } from 'lucide-react'

import type { DesktopEditorTab } from '@/editor/lib/config/editor-tabs'
import { SectionsTab } from '@/editor/components/editor/section-settings/ui/sections-tab'
import { ThemeTab } from '@/editor/components/editor/section-settings/ui/theme-tab'
import { DecorationsTab } from '@/editor/components/editor/section-settings/ui/decorations-tab'
import { PersistentDrawer } from '@/components/ui/custom/persistent-drawer'

export type { DesktopEditorTab } from '@/editor/lib/config/editor-tabs'

const SIDEBAR_WIDTH = 380

export function SectionsSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: DesktopEditorTab
  onTabChange: (tab: DesktopEditorTab) => void
}) {
  const t = useTranslations('editor.layout')
  const translate = useTranslations()
  const { isSidebarCollapsed, toggleSidebar, editorMode, setSelectedDecorationId } = useUiSelector((state) => ({
    isSidebarCollapsed: state.isSidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
    editorMode: state.editorMode,
    setSelectedDecorationId: state.setSelectedDecorationId,
  }))

  const tabs = useMemo(
    () => {
      const cfg = getModeUiConfig(editorMode, translate)
      const all = [
        { id: 'sections' as const, icon: Layers, label: cfg.sectionsTabLabel },
        { id: 'background' as const, icon: WandSparkles, label: t('sidebar.background') },
        { id: 'decorations' as const, icon: Sparkles, label: t('sidebar.decorations') },
      ]
      return all.filter((tab) => !(cfg.hideSectionsTab && tab.id === 'sections') && !(cfg.hideDecorations && tab.id === 'decorations'))
    },
    [editorMode, t, translate],
  )

  // If the sections tab becomes hidden while it's active, redirect to background
  useEffect(() => {
    const cfg = getModeUiConfig(editorMode, translate)
    if ((cfg.hideSectionsTab && activeTab === 'sections') || (cfg.hideDecorations && activeTab === 'decorations')) {
      onTabChange('background')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode])

  const handleTabChange = (tab: DesktopEditorTab) => {
    onTabChange(tab)
    setSelectedDecorationId(null)
  }

  return (
    <>
      <PersistentDrawer 
        isOpen={!isSidebarCollapsed} 
        width={SIDEBAR_WIDTH} 
        className="hidden md:flex top-16 h-[calc(100%-4rem)]"
      >
        {/* Кнопка — вне inert-дива, едет вместе с панелью, всегда кликабельна */}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          className={cn(
            "group absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 z-10",
            "hidden md:flex items-center justify-center",
            "w-10 h-24 rounded-l-2xl border border-r-0 border-border/40",
            "bg-background/80 backdrop-blur-xl transition-all duration-300 ease-out",
            "hover:scale-x-110 hover:bg-background/90",
          )}
        >
          <div className="relative z-10 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            {isSidebarCollapsed ? (
              <PanelRightOpen className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.5} />
            )}
          </div>
          <div className={cn(
            "absolute left-[4px] top-1/2 -translate-y-1/2 rounded-full transition-all duration-300",
            "h-8 w-[1.5px] bg-muted-foreground/70 group-hover:bg-muted-foreground group-hover:h-12"
          )} />
        </button>

        <div
          className="flex flex-col h-full w-full transition-opacity duration-300"
          style={{ opacity: isSidebarCollapsed ? 0 : 1 }}
          inert={isSidebarCollapsed}
        >
          {/* Tabs */}
          <div className="border-b border-border/40">
            <div className="flex justify-center gap-1 px-4 pt-1">
              {tabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-3 text-sm transition-all',
                    activeTab === id
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[13px] tracking-tight">{label}</span>
                  {activeTab === id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-foreground"
                      transition={{ type: 'spring', bounce: 0.1, duration: 0.5 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === 'sections' ? (
              <SectionsTab />
            ) : activeTab === 'background' ? (
              <ThemeTab />
            ) : (
              getModeUiConfig(editorMode, translate).hideDecorations ? <ThemeTab /> : <DecorationsTab />
            )}
          </div>
        </div>
      </PersistentDrawer>
    </>
  )
}