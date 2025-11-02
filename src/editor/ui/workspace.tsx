"use client";

import React from "react";
import { useEditorStore } from "@/hooks/store/useEditorStore";
import WorkspaceDnD, { EditorBlock } from "../dnd/WorkspaceDnDInternal";

interface WorkspaceProps {
  isDropped: boolean;
  items?: EditorBlock[];
  overId?: string | null;
}

export const Workspace: React.FC<WorkspaceProps> = ({ isDropped, items = [] }) => {
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
    <div className="flex-1 flex justify-center p-4 overflow-y-auto transition-all duration-300">
      <div
        className={`
          w-full rounded-xl shadow-xl outline-none
          p-8 ring-2 ring-transparent
          focus:ring-accent transition-all duration-300
          relative group
          ${getWidthClass()}
        `}
      >
  {/* DnD logic is moved to WorkspaceDnD to keep this file minimal and scalable */}
      <WorkspaceDnD items={items} />
      </div>
    </div>
  );
};
