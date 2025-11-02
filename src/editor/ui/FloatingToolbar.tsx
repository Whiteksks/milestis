'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface FloatingToolbarProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onMoveUp,
  onMoveDown,
  onDelete,
}) => (
  <div
    className="
      absolute -left-14 top-3
      flex flex-col gap-1
      bg-popover border rounded-xl shadow-md
      p-1 z-50
      animate-in fade-in zoom-in-95
    "
    onClick={(e) => e.stopPropagation()}
  >
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7"
      onClick={onMoveUp}
      title="Переместить вверх"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7"
      onClick={onMoveDown}
      title="Переместить вниз"
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 text-red-500 hover:text-red-600"
      onClick={onDelete}
      title="Удалить"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);
