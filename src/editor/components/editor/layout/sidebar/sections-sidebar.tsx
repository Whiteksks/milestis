"use client"

import { useUiSelector } from '@/editor/lib/store'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Layers, Paintbrush, Sparkles, PanelRightOpen, PanelLeftClose } from 'lucide-react'

import { SectionsTab } from '@/editor/components/editor/section-settings/ui/sections-tab'
import { ThemeTab } from '@/editor/components/editor/section-settings/ui/theme-tab'
import { DecorationsTab } from '@/editor/components/editor/section-settings/ui/decorations-tab'

export function SectionsSidebar() {
  const { isSidebarCollapsed, toggleSidebar, editorMode } = useUiSelector((state) => ({
    isSidebarCollapsed: state.isSidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
    editorMode: state.editorMode,
  }))

  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'decorations'>('sections')

  return (
    <>
      {/* Toggle sidebar */}
      <motion.button
        onClick={toggleSidebar}
        initial={false}
        animate={{
          y: '-50%'
        }}
        //whileHover={{ x: isSidebarCollapsed ? -4 : -10 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          'hidden md:flex md:absolute md:right-0 md:top-1/2 z-20',
          'w-10 h-18 items-center justify-center',
          'rounded-l-xl',
          'bg-background/70 backdrop-blur-xl',
          'border border-border/60 border-r-0',
          'shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)]',
          'hover:bg-background/90 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)]',
          'transition-all duration-200 ease-out group'
        )}
      >
        <motion.div
          animate={{ rotate: isSidebarCollapsed ? 0 : 180 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          {isSidebarCollapsed ? (
            <PanelRightOpen className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </motion.div>

        {/* subtle hover glow */}
        <span className="pointer-events-none absolute inset-0 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="absolute inset-0 rounded-l-xl bg-linear-to-l from-primary/10 to-transparent" />
        </span>
      </motion.button>


      {/* Sidebar */}
      <motion.div
        className={cn(
          'hidden md:flex flex-col border-l border-slate-200 bg-white shadow-2xl relative'
        )}
        initial={false}
        animate={{
          width: isSidebarCollapsed ? 0 : 380,
          opacity: isSidebarCollapsed ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Tabs */}
              <div className="border-b border-border/50"> {/* Легкая, приглушенная граница */}
                <div className="flex px-4 pt-2"> {/* Добавляем немного отступа сверху */}
                  {/* Секция "Page Sections" / "Content" */}
                  <motion.button
                    key="sections-tab"
                    onClick={() => setActiveTab('sections')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors relative group',
                      'border-b-2 -mb-px', // -mb-px гарантирует, что активная граница перекрывает нижнюю границу контейнера
                      activeTab === 'sections'
                        ? 'text-primary border-primary' // Активный: акцентный цвет и жирная линия
                        : 'text-muted-foreground border-transparent hover:text-foreground' // Неактивный: приглушенный цвет, прозрачная граница
                    )}
                    initial={false}
                    animate={{ 
                        color: activeTab === 'sections' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                        borderColor: activeTab === 'sections' ? 'hsl(var(--primary))' : 'transparent',
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <Layers className="w-4 h-4" /> {/* Иконка для раздела */}
                    {editorMode === 'portfolio' ? 'Sections' : 'Content'}
                  </motion.button>

                  {/* Секция "Theme Settings" */}
                  <motion.button
                    key="theme-tab"
                    onClick={() => setActiveTab('theme')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors relative group',
                      'border-b-2 -mb-px',
                      activeTab === 'theme'
                        ? 'text-primary border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    )}
                    initial={false}
                    animate={{ 
                        color: activeTab === 'theme' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                        borderColor: activeTab === 'theme' ? 'hsl(var(--primary))' : 'transparent',
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <Paintbrush className="w-4 h-4" /> {/* Иконка для темы */}
                    Theme
                  </motion.button>

                  {/* Decorations */}
                  <motion.button
                    key="decorations-tab"
                    onClick={() => setActiveTab('decorations')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors relative group',
                      'border-b-2 -mb-px',
                      activeTab === 'decorations'
                        ? 'text-primary border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    )}
                    initial={false}
                    animate={{
                      color: activeTab === 'decorations' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                      borderColor: activeTab === 'decorations' ? 'hsl(var(--primary))' : 'transparent',
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Decorations
                  </motion.button>
                </div>
              </div>

              {/* Sections / Theme Tabs content */}
              {activeTab === 'sections' ? <SectionsTab /> : activeTab === 'theme' ? <ThemeTab /> : <DecorationsTab />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
