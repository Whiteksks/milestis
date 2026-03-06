"use client"

import { Filter, LayoutTemplate, Palette, Sparkles, WandSparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { DesignCatalogSection, TagMeta } from './types'

type Props = {
  section: DesignCatalogSection
  onSectionChange: (section: DesignCatalogSection) => void

  tagMeta: TagMeta
  activeTag: string
  onTagChange: (tag: string) => void
  activeTagLabel: string

  totalCount: number
  visibleCount: number
}

export function DesignCatalogSidebar({
  section,
  onSectionChange,
  tagMeta,
  activeTag,
  onTagChange,
  activeTagLabel,
  totalCount,
  visibleCount,
}: Props) {
  return (
    <aside className="w-full md:w-60  md:border-r border-border bg-sidebar p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Milestis Design</h2>
      </div>
      <p className="hidden md:block text-sm text-muted-foreground mt-1 leading-relaxed">
        Choose template, theme and background
      </p>

      <div className="flex md:flex-col gap-1 mt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onSectionChange('templates')}
          className={cn(
            'w-full justify-start',
            section === 'templates' && 'bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground'
          )}
        >
          <LayoutTemplate className="h-4 w-4" />
          Templates
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onSectionChange('themes')}
          className={cn(
            'w-full justify-start',
            section === 'themes' && 'bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground'
          )}
        >
          <Palette className="h-4 w-4" />
          Themes
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onSectionChange('backgrounds')}
          className={cn(
            'w-full justify-start',
            section === 'backgrounds' && 'bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground'
          )}
        >
          <WandSparkles className="h-4 w-4" />
          Background
        </Button>
      </div>

      {tagMeta.availableTags.length > 0 ? (
        <>
          <div className="md:hidden mt-5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between bg-background">
                  <span className="flex items-center gap-2 min-w-0">
                    <Filter className="h-4 w-4" />
                    <span className="truncate">{activeTagLabel}</span>
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">{visibleCount}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 p-2">
                <div className="max-h-72 overflow-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onTagChange('all')}
                    className={cn(
                      'w-full justify-start',
                      activeTag === 'all' && 'bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground'
                    )}
                  >
                    All
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground/70">{totalCount}</span>
                  </Button>

                  {tagMeta.availableTags.map((tag) => {
                    const isActive = activeTag === tag
                    const count = tagMeta.counts.get(tag) ?? 0
                    return (
                      <Button
                        key={tag}
                        type="button"
                        variant="ghost"
                        onClick={() => onTagChange(tag)}
                        className={cn(
                          'w-full justify-start',
                          isActive && 'bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground'
                        )}
                      >
                        <span className="truncate">{tag}</span>
                        <span className="ml-auto text-xs tabular-nums text-muted-foreground/70">{count}</span>
                      </Button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="hidden md:block mt-4">
            <Separator className="mb-3" />
            <p className="text-xs font-medium text-muted-foreground/70 mb-1 px-1">Filter</p>
            <nav className="flex flex-col gap-0.5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onTagChange('all')}
                className={cn(
                  'w-full justify-start',
                  activeTag === 'all' && 'bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground'
                )}
              >
                All
                <span className="ml-auto text-xs tabular-nums text-muted-foreground/70">{totalCount}</span>
              </Button>
                
              {tagMeta.availableTags.map((tag) => {
                const isActive = activeTag === tag
                const count = tagMeta.counts.get(tag) ?? 0
                return (
                  <Button
                    key={tag}
                    type="button"
                    variant="ghost"
                    onClick={() => onTagChange(tag)}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground'
                    )}
                  >
                    <span className="truncate">{tag}</span>
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground/70">{count}</span>
                  </Button>
                )
              })}
            </nav>
          </div>
        </>
      ) : null}
    </aside>
  )
}
