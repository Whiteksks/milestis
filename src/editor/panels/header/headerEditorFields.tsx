'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Eye, Settings2, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useEditorStore } from '@/editor/state/useEditorStore'

export const HeaderTools = () => {
  const { activeDevice, setActiveDevice } = useEditorStore()

  return (
    <section className="bg-card/85 backdrop-blur sticky top-[48px] z-40">
      <div className="relative flex items-center h-12 px-4 sm:px-6 border-b">
        {/* Левая часть */}
        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-foreground">
          <span>Выбран компонент:</span>
          <span className="text-primary">HeroSection</span>
        </div>

        {/* Центр — переключатели устройств */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <Button
            variant={activeDevice === 'desktop' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            title="ПК"
            onClick={() => setActiveDevice('desktop')}
          >
            <Monitor className="size-4" />
          </Button>

          <Button
            variant={activeDevice === 'tablet' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            title="Планшет"
            onClick={() => setActiveDevice('tablet')}
          >
            <Tablet className="size-4" />
          </Button>

          <Button
            variant={activeDevice === 'mobile' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            title="Телефон"
            onClick={() => setActiveDevice('mobile')}
          >
            <Smartphone className="size-4" />
          </Button>
        </div>

        {/* Правая часть */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Предпросмотр">
            <Eye className="size-4" />
          </Button>

          <Separator orientation="vertical" className="h-5" />

          <Button variant="ghost" size="icon" className="h-8 w-8" title="Настройки">
            <Settings2 className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
