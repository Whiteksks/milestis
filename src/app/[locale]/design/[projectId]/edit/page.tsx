"use client";

import { HeaderApp } from "@/editor/ui/header";
import { HeaderTools } from "@/editor/ui/headerEditorFields";
import { SidebarEditorComponents } from "@/editor/ui/sidebarEditorComponents";
import  {Workspace}  from "@/editor/ui/workspace";
import { DragDropProvider } from "@dnd-kit/react";
import React from "react";

export default function Page() {
  const [isDropped, setIsDropped] = React.useState(false);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div>
        <HeaderApp />
        <HeaderTools />
      </div>

      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;

          const { target } = event.operation;
          setIsDropped(target?.id === "droppable");
        }}
      >
        <SidebarEditorComponents />
        <Workspace isDropped={isDropped} />
      </DragDropProvider>

    </div>
  );
}
