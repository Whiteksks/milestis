'use client'

import { Redo2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import ZoomButtons from '../layout/zoomButtons'
import BreadcrumbNavigation from '../layout/breadCrumb'

interface HeaderAppProps {
  title?: string
}

export const HeaderApp = ({ title = 'Lorem Ipsum' }: HeaderAppProps) => {
  return (
    <header className="border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-50">
      <div className="flex items-center justify-between h-12 px-2 sm:px-4">
        {/* LEFT: Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground">
          <BreadcrumbNavigation />
        </div>

        {/* CENTER: Title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h2 className="text-sm sm:text-base font-semibold text-foreground">{title}</h2>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <ZoomButtons />

          <Separator orientation="vertical" className="mx-1 h-4" />

          {/* Undo/Redo */}
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Отменить">
            <Undo2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Повторить">
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
