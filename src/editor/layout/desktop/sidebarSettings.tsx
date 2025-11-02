'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Edit3, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import useEditorDnDStore, { EditorBlock } from '../../store/useEditorDnDStore';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';

function SortableItem({ block }: { block: EditorBlock }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-primary rounded-md border shadow-sm cursor-grab mb-2"
    >
      <div className="text-xs text-muted-foreground mb-1">{block.id}</div>
      <div className="bg-white p-2 rounded" style={{ height: '50px', overflow: 'hidden' }}>
        <div
          style={{
            width: '250%',
            height: '250%',
            transform: 'scale(0.4)',
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          {block.component}
        </div>
      </div>
    </div>
  );
}

export function SidebarSettings() {
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const { blocks, moveBlock } = useEditorDnDStore();

  const iconButtons = [
    { id: 'edit', Icon: Edit3, label: 'Редактировать' },
    { id: 'file', Icon: Settings, label: 'Файл' },
    {
      id: 'layers',
      Icon: Layers,
      label: 'Слои',
      onClick: () => setIsLayersOpen((prev) => !prev),
    },
  ];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      moveBlock(oldIndex, newIndex);
    }
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: isLayersOpen ? 260 : 56,
        height: isLayersOpen ? 420 : iconButtons.length * 56 + 20,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="bg-popover border shadow-lg rounded-2xl overflow-hidden flex flex-col items-center p-2"
    >
      <AnimatePresence mode="wait">
        {!isLayersOpen && (
          <motion.div
            key="icons"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col items-center space-y-2"
          >
            {iconButtons.map(({ id, Icon, label, onClick }) => (
              <button
                key={id}
                title={label}
                onClick={onClick}
                className={cn(
                  'w-full flex items-center justify-center h-12 rounded-xl hover:bg-accent transition-colors'
                )}
              >
                <Icon className="w-5 h-5 text-popover-foreground" />
              </button>
            ))}
          </motion.div>
        )}

        {isLayersOpen && (
          <motion.div
            key="layers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-1 p-2 overflow-y-auto"
          >
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
              <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
                {blocks.map((block) => (
                  <SortableItem key={block.id} block={block} />
                ))}
              </SortableContext>
            </DndContext>

            <button
              onClick={() => setIsLayersOpen(false)}
              className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Свернуть
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
