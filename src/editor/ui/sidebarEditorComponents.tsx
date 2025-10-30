"use client";

import { SidebarDropdown } from "../layout/sidebarDropdown";
import { SidebarIsland } from "../layout/sidebarIsland";
import { SidebarSettings } from "../layout/sidebarSettings";
import { DraggableBlock } from "../hooks/DraggableBlock";
import { HeaderBlock, TestComponentA, TestComponentB } from "../components";
import { Draggable } from "../hooks";

export function SidebarEditorComponents() {
  const blocks = [
    { id: "HeaderBlock", component: <HeaderBlock /> },
    { id: "TestComponentA", component: <TestComponentA /> },
    { id: "TestComponentB", component: <TestComponentB /> },
  ];

  return (
    <div className="fixed h-full p-4 z-50">
      <div className="absolute top-28">
        <SidebarDropdown />
      </div>

      <div className="absolute top-1/2 transform -translate-y-1/2">
        <SidebarIsland title="Блоки">
          <Draggable />
          {/* <div className="flex flex-col gap-2">
            {blocks.map((block) => (
              <DraggableBlock key={block.id} id={block.id}>
                {block.component}
              </DraggableBlock>
            ))}
          </div> */}
        </SidebarIsland>
      </div>

      <div className="absolute bottom-4">
        <SidebarSettings />
      </div>
    </div>
  );
}
