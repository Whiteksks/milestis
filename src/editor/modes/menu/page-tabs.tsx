'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Home, Plus, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useContentSelector, useUiStore } from '@/editor/lib/store'
import { useActiveMenuPage } from './use-active-menu-page'
import { MenuPageDialog } from './page-dialog'
import { PAGE_LIMITS } from '../../../../functions/src/domain/pages'

export function MenuPageTabs({ onSelect }: { onSelect: () => void }) {
  const t = useTranslations('editor.menu.pages')
  const { pages, homePageId } = useContentSelector((s) => ({ pages: s.menuContent.pages, homePageId: s.menuContent.homePageId }))
  const activePage = useActiveMenuPage()
  const [dialog, setDialog] = useState<'new' | 'edit' | null>(null)
  const list = useRef<HTMLDivElement>(null)

  function select(id: string) {
    const ui = useUiStore.getState()
    ui.setActiveMenuPageId(id)
    ui.setActiveSectionId('menu')
    ui.closeMediaPicker()
    onSelect()
  }

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activePage.id])

  return <div className="flex min-w-0 shrink-0 items-center gap-1 border-b bg-editor-workspace px-2 pt-2">
    <div ref={list} role="tablist" aria-label={t('title')} className="flex min-w-0 flex-1 items-end gap-1 overflow-x-auto">
      {pages.map((page, index) => <button type="button" key={page.id} role="tab" id={`menu-page-tab-${page.id}`}
        aria-selected={activePage.id === page.id} aria-controls="menu-page-panel" tabIndex={activePage.id === page.id ? 0 : -1}
        title={page.path} onClick={() => select(page.id)}
        onKeyDown={(event) => {
          let next: number
          if (event.key === 'ArrowRight') next = (index + 1) % pages.length
          else if (event.key === 'ArrowLeft') next = (index - 1 + pages.length) % pages.length
          else if (event.key === 'Home') next = 0
          else if (event.key === 'End') next = pages.length - 1
          else return
          event.preventDefault()
          select(pages[next].id)
          document.getElementById(`menu-page-tab-${pages[next].id}`)?.focus()
        }}
        className={cn('flex h-10 max-w-48 shrink-0 items-center gap-2 rounded-t-lg border border-b-0 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
          activePage.id === page.id ? 'border-border bg-background font-medium text-foreground' : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground')}>
        {page.id === homePageId && <Home className="size-3.5 shrink-0" aria-label={t('home')} />}
        <span className="truncate">{page.name || t(page.id === homePageId ? 'home' : 'untitled')}</span>
      </button>)}
    </div>
    <Button type="button" variant="ghost" size="icon" className="mb-1 shrink-0" disabled={pages.length >= PAGE_LIMITS.pages}
      title={pages.length >= PAGE_LIMITS.pages ? t('limit', { count: PAGE_LIMITS.pages }) : t('add')} aria-label={t('add')} onClick={() => setDialog('new')}><Plus className="size-4" /></Button>
    <Button type="button" variant="ghost" size="icon" className="mb-1 shrink-0" title={t('settings')} aria-label={t('settings')} onClick={() => setDialog('edit')}><Settings2 className="size-4" /></Button>
    {dialog && <MenuPageDialog key={dialog === 'edit' ? activePage.id : 'new'} page={dialog === 'edit' ? activePage : undefined}
      onSelect={select} onClose={() => setDialog(null)} />}
  </div>
}
