"use client";

import { HeaderApp } from "@/editor/ui/header";
import { HeaderTools } from "@/editor/ui/headerEditorFields";
import { SidebarEditorComponents } from "@/editor/ui/sidebarEditorComponents";
import  {Workspace}  from "@/editor/ui/workspace";
import { DragDropProvider } from "@dnd-kit/react";
import React from "react";
import { HeaderBlock, TestComponentA, TestComponentB } from "@/editor/components";

export default function Page() {
  const [isDropped, setIsDropped] = React.useState(false);

  // catalog of available blocks that can be dragged from the sidebar
  const catalog = [
    { id: "HeaderBlock", component: <HeaderBlock /> },
    { id: "TestComponentA", component: <TestComponentA /> },
    { id: "TestComponentB", component: <TestComponentB /> },
  ];

  // blocks that were dropped into the workspace
  const [workspaceBlocks, setWorkspaceBlocks] = React.useState<typeof catalog>([]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div>
        <HeaderApp />
        <HeaderTools />
      </div>

      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;

          // try multiple paths to extract active id and target id (robust against API shape differences)
          const activeId = (event as any)?.active?.id ?? (event as any)?.operation?.active?.id ?? (event as any)?.operation?.item?.id ?? (event as any)?.operation?.itemId;
          const targetId = (event as any)?.over?.id ?? (event as any)?.operation?.target?.id;

          setIsDropped(targetId === "droppable");

          if (targetId === "droppable" && activeId) {
            // find the catalog block by id and append it to workspace
            const found = catalog.find((b) => b.id === activeId);
            if (found) {
              setWorkspaceBlocks((prev) => [...prev, found]);
            }
          }
        }}
      >
        <SidebarEditorComponents />
        <Workspace isDropped={isDropped} blocks={workspaceBlocks} />
      </DragDropProvider>

    </div>
  );
}
