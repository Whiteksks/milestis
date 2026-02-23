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
          'hidden md:flex flex-col border-l border-border/60 bg-card/80 shadow-[-4px_0_24px_0_hsl(var(--foreground)/0.07)] relative overflow-visible'
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
            'bg-card/95 backdrop-blur-sm',
            'border border-border/60 border-r-0',
            'shadow-[-4px_2px_16px_0_hsl(var(--foreground)/0.08)]',
            'hover:bg-muted/60',
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

              {/* Tabs content */}
              {activeTab === 'sections' ? <SectionsTab /> : activeTab === 'theme' ? <ThemeTab /> : <DecorationsTab />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
