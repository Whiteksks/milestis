"use client"

import { useUiSelector } from '@/editor/lib/store'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
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
      {/* Sidebar */}
      <motion.div
        className={cn(
          'hidden md:flex flex-col border-l border-border/40 bg-sidebar/10 shadow-lg relative overflow-visible'
        )}
        initial={false}
        animate={{
          width: isSidebarCollapsed ? 0 : 380,
        }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      >
        <motion.button
          onClick={toggleSidebar}
          initial={false}
          whileTap={{ scale: 0.96 }}
          className={cn(
            'group absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 z-30',
            'hidden md:flex items-center justify-center',
            'w-12 h-16',
            'rounded-l-xl',
            'bg-sidebar backdrop-blur-sm',
            'border border-border/60 border-r-0',
            'shadow-md',
            'hover:bg-muted/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'transition-colors duration-200'
          )}
        >
          <motion.div
            animate={{ rotate: isSidebarCollapsed ? 0 : 180 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            {isSidebarCollapsed ? (
              <PanelRightOpen className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <PanelLeftClose className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex flex-col h-full"
            >
              {/* Tabs */}
              <div className="border-b border-border/40">
                <div className="flex gap-1 px-3 pt-3">
                  {/* Sections Tab */}
                  <button
                    onClick={() => handleTabChange('sections')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all relative',
                      activeTab === 'sections'
                        ? 'text-foreground bg-muted/50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    )}
                  >
                    <Layers className="w-4 h-4" />
                    {editorMode === 'portfolio' ? 'Sections' : 'Content'}
                    {activeTab === 'sections' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </button>

                  {/* Theme Tab */}
                  <button
                    onClick={() => handleTabChange('theme')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all relative',
                      activeTab === 'theme'
                        ? 'text-foreground bg-muted/50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    )}
                  >
                    <Paintbrush className="w-4 h-4" />
                    Theme
                    {activeTab === 'theme' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </button>

                  {/* Decorations Tab */}
                  <button
                    onClick={() => handleTabChange('decorations')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all relative',
                      activeTab === 'decorations'
                        ? 'text-foreground bg-muted/50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                    Decorations
                    {activeTab === 'decorations' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Tabs content */}
              {activeTab === 'sections' ? <SectionsTab /> : activeTab === 'theme' ? <ThemeTab /> : <DecorationsTab />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
