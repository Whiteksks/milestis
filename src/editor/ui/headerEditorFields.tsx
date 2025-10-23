'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Eye, Settings2 } from 'lucide-react'

export const HeaderTools = () => {
  return (
    <section className="border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-[48px] z-40">
      <div className="flex items-center justify-between h-12 px-4 sm:px-6 border-b">
        {/* LEFT: Заголовок */}
        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-foreground">
          <span>Редактор полей блока</span>
        </div>

        {/* RIGHT: Контролы */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Показать / скрыть предпросмотр">
            <Eye className="size-4" />
          </Button>

          <Separator orientation="vertical" className="h-5" />

          <Button variant="ghost" size="icon" className="h-8 w-8" title="Настройки блока">
            <Settings2 className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
