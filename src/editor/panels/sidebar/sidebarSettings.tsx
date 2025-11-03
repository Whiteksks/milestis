'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings, Edit3, Layers, Eye, EyeOff, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarSettings() {
  const iconButtons = [
    { id: 'edit', Icon: Edit3, label: 'Редактировать' },
    { id: 'file', Icon: Settings, label: 'Файл' },
    { id: 'layers', Icon: Layers, label: 'Слои' },
  ];

  const renderPopoverContent = (id: string) => {
    switch (id) {
      case 'edit':
        return (
          <div className="space-y-2">
            <div className="font-medium text-sm">Редактирование</div>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Изменить текст
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Изменить изображение
            </Button>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <div className="font-medium text-sm">Файл</div>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Сохранить проект
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Экспортировать
            </Button>
          </div>
        );

      case 'layers':
        return (
          <div className="space-y-2">
            <div className="font-medium text-sm mb-1">Слои</div>
            <div className="flex flex-col gap-1">
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span>Фон</span>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span>Фото</span>
                <EyeOff className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span>Текст</span>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">Нет данных для отображения.</div>
        );
    }
  };

  return (
    <div className="bg-popover shadow-lg rounded-2xl flex flex-col items-center p-2 w-12 space-y-2">
      {iconButtons.map(({ id, Icon, label }) => (
        <Popover key={id}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors'
              )}
              title={label}
            >
              <Icon className="w-5 h-5 text-popover-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" sideOffset={8} className="w-56">
            {renderPopoverContent(id)}
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
