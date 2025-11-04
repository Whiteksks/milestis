'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Eye, Settings2, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useEditorStore } from '@/editor/state/useEditorStore'
import { TextControls } from './controls/TextControls'
import { ImageControls } from './controls/ImageControls'
import { GenericControls } from './controls/GenericControls'

export const HeaderTools = () => {
  const { activeDevice, setActiveDevice, selectedBlock } = useEditorStore()

  // Prevent click events from bubbling up to parent (prevents deselection)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Determine which controls to show based on selected block type
  const renderContextualControls = () => {
    if (!selectedBlock) {
      return null
    }

    switch (selectedBlock.type) {
      case 'text':
        return <TextControls />
      case 'image':
        return <ImageControls />
      case 'header':
        return <GenericControls />
      case 'generic':
      default:
        return <GenericControls />
    }
  }

  return (
    <section 
      className="bg-card/85 backdrop-blur sticky top-[48px] z-40"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      data-header-toolbar="true"
    >
      <div className="relative flex items-center h-12 px-4 sm:px-6 border-b border-border">
        {/* Левая часть - Contextual Controls or Selected Component Name */}
        <div className="flex items-center gap-3">
          {selectedBlock ? (
            <>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="text-muted-foreground">Выбрано:</span>
                <span className="text-primary">
                  {selectedBlock.componentName || selectedBlock.type || 'Блок'}
                </span>
              </div>
              <Separator orientation="vertical" className="h-5" />
              <div className="hidden lg:flex">
                {renderContextualControls()}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Выберите элемент для редактирования</span>
            </div>
          )}
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
