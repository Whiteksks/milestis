"use client";

import React from "react";
import { useEditorStore } from "@/editor/state/useEditorStore";
import WorkspaceDnD, { EditorBlock } from "../dnd/WorkspaceDnDInternal";

interface WorkspaceProps {
  isDropped: boolean;
  items?: EditorBlock[];
  overId?: string | null;
  onDeleteBlock?: (id: string) => void;
  onMoveBlockUp?: (id: string) => void;
  onMoveBlockDown?: (id: string) => void;
  onDuplicateBlock?: (id: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  isDropped: _isDropped,
  items = [],
  overId,
  onDeleteBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onDuplicateBlock,
}) => {
  const { activeDevice } = useEditorStore();

  const getWidthClass = () => {
    switch (activeDevice) {
      case "tablet":
        return "max-w-3xl scale-[0.9]";
      case "mobile":
        return "max-w-sm scale-[0.85]";
      default:
        return "max-w-7xl scale-100";
    }
  };

  return (
    <div className="flex-1 flex justify-center overflow-y-auto transition-all duration-300">
      <div
        className={`
          w-full outline-none
          p-8 ring-2 ring-transparent
          focus:ring-accent transition-all duration-300
          relative group
          ${getWidthClass()}
        `}
      >
        <div className="text-center mt-20">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Start Creating</h2>
          <p className="text-muted-foreground">Click the buttons on the left to add content to your canvas</p>
        </div>
        {/* DnD logic is moved to WorkspaceDnD to keep this file minimal and scalable */}
        <WorkspaceDnD
          items={items}
          overId={overId}
          onDelete={onDeleteBlock}
          onMoveUp={onMoveBlockUp}
          onMoveDown={onMoveBlockDown}
          onDuplicate={onDuplicateBlock}
        />
      </div>
    </div>
  );
};
