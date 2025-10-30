"use client";

import React from "react";
import { useEditorStore } from "@/hooks/store/useEditorStore";
// import { Sortable } from "../registerComponents";
import { HeaderBlock, TestComponentB, TestComponentA } from "../components";
// DragDropProvider is provided at a higher level so sidebar and workspace share the same DnD context
import { Draggable, Droppable } from "../hooks";


export interface EditorBlock {
  id: string;
  component: React.ReactNode;
}

interface WorkspaceProps {
  isDropped: boolean;
}

export const Workspace: React.FC<WorkspaceProps> = ({ isDropped }) => {
  const { activeDevice } = useEditorStore();
  // Все подключённые блоки
  const [blocks, setBlocks] = React.useState<EditorBlock[]>([
    { id: "header", component: <HeaderBlock /> },
    { id: "text", component: <TestComponentA /> },
    { id: "image", component: <TestComponentB /> },
  ]);

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
    <div className="flex-1 flex justify-center p-4 overflow-y-auto transition-all duration-300">
        <Droppable id="droppable">
          <div>
            {isDropped && <Draggable />}
          </div>
        </Droppable>
        {/* {blocks.map((block, index) => (
          <Sortable key={block.id} id={block.id} index={index}>
            {block.component}
          </Sortable>
        ))} */}
    </div>
  );
};
