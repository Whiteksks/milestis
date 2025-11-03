'use client';

import React from 'react';
import SortableItem from '../dnd/SortableItem';
import { FloatingToolbar } from './FloatingToolbar';
import { Hint } from './Hint';
import { EditorBlock } from '../dnd/WorkspaceDnDInternal';

interface DraggableBlockProps {
  block: EditorBlock;
  isSelected: boolean;
  overId?: string | null;
  onClick: (e: React.MouseEvent) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  isSelected,
  overId,
  onClick,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
}) => (
  <div key={block.id} className="relative group" onClick={onClick}>
    {overId === block.id && <Hint />}

    {isSelected && (
      <FloatingToolbar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    )}

    <SortableItem id={block.id}>
      <div
        className={`
          border-l border-r bg-card shadow-sm
          hover:shadow-md transition-all duration-150
          ${isSelected ? 'border-accent' : 'border-popover'}
        `}
      >
        {block.component}
      </div>
    </SortableItem>
  </div>
);
