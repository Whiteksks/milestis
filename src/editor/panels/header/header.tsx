'use client'

import { Redo2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import ZoomButtons from '../../navigation/zoomButtons'
import BreadcrumbNavigation from '../../navigation/breadCrumb'
import { useEditorDnDStore } from '@/editor/state/useEditorDnDStore'


export const HeaderApp = () => {
  // History actions from store
  const undo = useEditorDnDStore((state) => state.undo)
  const redo = useEditorDnDStore((state) => state.redo)
  const canUndo = useEditorDnDStore((state) => state.canUndo())
  const canRedo = useEditorDnDStore((state) => state.canRedo())

  // Prevent click events from deselecting blocks
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleUndo = (e: React.MouseEvent) => {
    e.stopPropagation()
    undo()
  }

  const handleRedo = (e: React.MouseEvent) => {
    e.stopPropagation()
    redo()
  }

  return (
    <header 
      className="bg-card/10 dark:bg-card/50 sticky top-0 z-50"
      data-header-toolbar="true"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between h-12 px-2 sm:px-4">
        {/* LEFT: Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground">
          <BreadcrumbNavigation />
        </div>

        {/* CENTER: Title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h2 className="text-sm sm:text-base font-semibold text-foreground"></h2>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <ZoomButtons />

          <Separator orientation="vertical" className="mx-1 h-4" />

          {/* Undo/Redo */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            title="Отменить (Ctrl+Z)"
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <Undo2 className="size-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            title="Повторить (Ctrl+Shift+Z)"
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <Redo2 className="size-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-4" />

          {/* Avatar */}
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
            <Avatar className="h-8 w-8 rounded-md">
              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>

          {/* Publish */}
          <Button variant="default" size="sm" className="ml-1 h-8 px-3">
            Опубликовать
          </Button>
        </div>
      </div>
    </header>
  )
}
