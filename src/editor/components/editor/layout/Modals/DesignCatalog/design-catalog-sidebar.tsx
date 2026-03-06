"use client"

import { Filter, LayoutTemplate, Palette, Sparkles, WandSparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
    <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-border bg-sidebar p-4 md:p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Design</h2>
      </div>
      <p className="hidden md:block text-sm text-muted-foreground mt-1 leading-relaxed">
        Choose template, theme and background
      </p>

      <div className="flex md:flex-col gap-1 mt-4">
        <button
          type="button"
          onClick={() => onSectionChange('templates')}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            section === 'templates'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          <LayoutTemplate className="h-4 w-4" />
          <span>Templates</span>
        </button>

        <button
          type="button"
          onClick={() => onSectionChange('themes')}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            section === 'themes'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          <Palette className="h-4 w-4" />
          <span>Themes</span>
        </button>

        <button
          type="button"
          onClick={() => onSectionChange('backgrounds')}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            section === 'backgrounds'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          <WandSparkles className="h-4 w-4" />
          <span>Background</span>
        </button>
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
                  <button
                    type="button"
                    onClick={() => onTagChange('all')}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      activeTag === 'all'
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>All</span>
                    <span
                      className={cn(
                        'ml-auto text-xs tabular-nums',
                        activeTag === 'all' ? 'text-accent-foreground/70' : 'text-muted-foreground/60'
                      )}
                    >
                      {totalCount}
                    </span>
                  </button>

                  {tagMeta.availableTags.map((tag) => {
                    const isActive = activeTag === tag
                    const count = tagMeta.counts.get(tag) ?? 0
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onTagChange(tag)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                      >
                        <span className="truncate">{tag}</span>
                        <span
                          className={cn(
                            'ml-auto text-xs tabular-nums',
                            isActive ? 'text-accent-foreground/70' : 'text-muted-foreground/60'
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <nav className="hidden md:flex md:flex-col gap-1 mt-5">
            <button
              type="button"
              onClick={() => onTagChange('all')}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTag === 'all'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span>All</span>
              <span
                className={cn(
                  'ml-auto text-xs tabular-nums',
                  activeTag === 'all' ? 'text-accent-foreground/70' : 'text-muted-foreground/60'
                )}
              >
                {totalCount}
              </span>
            </button>

            {tagMeta.availableTags.map((tag) => {
              const isActive = activeTag === tag
              const count = tagMeta.counts.get(tag) ?? 0
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagChange(tag)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  <span className="truncate">{tag}</span>
                  <span
                    className={cn(
                      'ml-auto text-xs tabular-nums',
                      isActive ? 'text-accent-foreground/70' : 'text-muted-foreground/60'
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </nav>
        </>
      ) : null}
    </aside>
  )
}
