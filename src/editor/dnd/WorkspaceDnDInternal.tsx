'use client';

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditorStore } from '@/editor/state/useEditorStore';
import { DraggableBlock } from '../canvas/DraggableBlock';
import { getBlockType } from '../utils/blockTypeDetector';

export interface EditorBlock {
  id: string;
  component: React.ReactNode;
  type?: 'text' | 'image' | 'header' | 'generic';
  componentName?: string;
}

const WorkspaceDnDInternal: React.FC<{
  items: EditorBlock[];
  overId?: string | null;
  onDelete?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}> = ({ items, overId = null, onDelete, onMoveUp, onMoveDown, onDuplicate }) => {
  const { selectedBlock, setSelectedBlock } = useEditorStore();

  const handleBlockClick = (block: EditorBlock) => {
    // Determine block type if not already set
    const blockType = block.type || getBlockType(block.componentName);
    
    // Set the selected block with type information
    setSelectedBlock({
      id: block.id,
      type: blockType,
      componentName: block.componentName,
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/50 backdrop-blur-sm px-6 py-8 flex justify-center">
      <div className="w-full space-y-0">
        <SortableContext items={items.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {items.map((block) => (
            <DraggableBlock
              key={block.id}
              block={block}
              isSelected={selectedBlock?.id === block.id}
              overId={overId}
              onClick={(e) => {
                e.stopPropagation();
                handleBlockClick(block);
              }}
              onMoveUp={() => onMoveUp?.(block.id)}
              onMoveDown={() => onMoveDown?.(block.id)}
              onDelete={() => {
                if (selectedBlock?.id === block.id) {
                  setSelectedBlock(null);
                }
                onDelete?.(block.id);
              }}
              onDuplicate={() => onDuplicate?.(block.id)}
            />
          ))}

          {overId === null && items.length > 0 && (
            <div className="flex justify-center pt-4">
              <div className="w-3/4 h-0.5 bg-accent/40 rounded-full" />
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default WorkspaceDnDInternal;
