"use client";

import { SidebarDropdown } from "../layout/sidebarDropdown";
import { SidebarIsland } from "../layout/sidebarIsland";
import { SidebarSettings } from "../layout/sidebarSettings";
import { HeaderBlock, TestComponentA, TestComponentB } from "../components";
import React from "react";
import { useDraggable } from "@dnd-kit/core";

type SidebarBlock = { id: string; label: string; componentName: string };

export function SidebarEditorComponents() {
  const blocks: SidebarBlock[] = [
    { id: "HeaderBlock", label: "Header", componentName: "HeaderBlock" },
    { id: "TestComponentA", label: "Text A", componentName: "TestComponentA" },
    { id: "TestComponentB", label: "Text B", componentName: "TestComponentB" },
  ];

  return (
    <div className="fixed h-full p-4 z-50">
      <div className="absolute top-28">
        <SidebarDropdown />
      </div>

      <div className="absolute top-1/2 transform -translate-y-1/2">
        <SidebarIsland title="Блоки">
          <div className="flex flex-col gap-2">
            {blocks.map((b) => (
              <DraggablePreview key={b.id} id={`new:${b.componentName}`} label={b.label} componentName={b.componentName} />
            ))}
          </div>
        </SidebarIsland>
      </div>

      <div className="absolute bottom-4">
        <SidebarSettings />
      </div>
    </div>
  );
}

function DraggablePreview({ id, label, componentName }: { id: string; label: string; componentName: string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  const compMap: Record<string, React.ReactNode> = {
    HeaderBlock: <HeaderBlock />,
    TestComponentA: <TestComponentA className="p-2" />,
    TestComponentB: <TestComponentB className="p-2" />,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-2 bg-primary rounded-md border shadow-sm cursor-grab"
    >
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="bg-white p-2 rounded">
        {compMap[componentName] ?? <div className="text-sm text-muted-foreground">Preview</div>}
      </div>
    </div>
  );
}
