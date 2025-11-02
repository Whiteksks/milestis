"use client";

import { SidebarDropdown } from "../layout/desktop/sidebarDropdown";
import { SidebarIsland } from "../layout/desktop/sidebarIsland";
import { SidebarSettings } from "../layout/desktop/sidebarSettings";
import { HeaderBlock, TestComponentA, TestComponentB } from "../components";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import DraggablePreview from "../layout/DraggablePreview"

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
