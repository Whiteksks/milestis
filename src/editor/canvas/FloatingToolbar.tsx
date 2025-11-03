'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingToolbarProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  className?: string;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  className,
}) => (
  <div
    className={cn(
      'absolute -left-14 top-3 flex flex-col gap-1',
      'rounded-xl border bg-background shadow-sm p-1 z-50',
      'backdrop-blur-sm supports-[backdrop-filter]:bg-background/80',
      'animate-in fade-in zoom-in-95',
      className
    )}
    onClick={(e) => e.stopPropagation()}
  >
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 rounded-md hover:bg-accent"
      onClick={onMoveUp}
      title="Переместить вверх"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>

    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 rounded-md hover:bg-accent"
      onClick={onMoveDown}
      title="Переместить вниз"
    >
      <ArrowDown className="h-4 w-4" />
    </Button>

    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 rounded-md hover:bg-accent"
      onClick={onDuplicate}
      title="Дублировать"
    >
      <Copy className="h-4 w-4" />
    </Button>

    <div className="h-px bg-border my-0.5" />

    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 rounded-md hover:bg-destructive/10"
      onClick={onDelete}
      title="Удалить"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);
