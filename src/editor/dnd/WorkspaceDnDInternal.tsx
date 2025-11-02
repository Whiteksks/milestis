'use client';

import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { useEditorStore } from "@/hooks/store/useEditorStore";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";

export interface EditorBlock {
  id: string;
  component: React.ReactNode;
}

const WorkspaceDnD: React.FC<{
  items: EditorBlock[];
  overId?: string | null;
  onDelete?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}> = ({ items, overId = null, onDelete, onMoveUp, onMoveDown }) => {
  const { selectedBlock, setSelectedBlock } = useEditorStore();

  return (
    <div
      className="
        fixed top-0 left-0 right-0
        bg-background/50 backdrop-blur-sm
        px-6 py-8
        flex justify-center
      "
    >
      <div className="w-full space-y-0">
        <SortableContext items={items.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {items.map((block, index) => {
            const isSelected = selectedBlock?.id === block.id;

            return (
              <div
                key={block.id}
                className="relative group"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlock(block);
                }}
              >
                {/* Подсказка при наведении */}
                {overId === block.id && (
                  <div
                    className="
                      absolute -top-3 left-0 right-0 flex justify-center
                      pointer-events-none
                    "
                    aria-hidden
                  >
                    <div className="w-3/4 h-0.5 bg-accent rounded-full shadow-sm transition-all" />
                  </div>
                )}

                {/* Плавающая панель */}
                {isSelected && (
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
                      onClick={() => onMoveUp?.(block.id)}
                      title="Переместить вверх"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => onMoveDown?.(block.id)}
                      title="Переместить вниз"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      onClick={() => onDelete?.(block.id)}
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <SortableItem id={block.id}>
                  <div
                    className={`
                      border bg-card shadow-sm
                      hover:shadow-md transition-all duration-150
                      ${isSelected ? 'border-2 border-accent' : 'border-border'}
                    `}
                  >
                    {block.component}
                  </div>
                </SortableItem>
              </div>
            );
          })}

          {/* Подсказка внизу списка */}
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

export default WorkspaceDnD;
