"use client";

import { HeaderApp } from "@/editor/ui/header";
import { HeaderTools } from "@/editor/ui/headerEditorFields";
import { SidebarEditorComponents } from "@/editor/ui/sidebarEditorComponents";
import { Workspace } from "@/editor/ui/workspace";
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import SimpleBlockA from "@/editor/components/SimpleBlockA";
import SimpleBlockB from "@/editor/components/SimpleBlockB";
import { HeaderBlock, TestComponentA, TestComponentB } from "@/editor/components";
import useEditorDnDStore from "@/editor/store/useEditorDnDStore";
import React from "react";
import { useEditorStore } from "@/hooks/store/useEditorStore";
import { SidebarRightDnD } from "@/editor/layout/desktop/InspectorDnD";
import { MobileEditorNavigation } from "@/editor/layout/mobile/MobileEditorNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Page() {
  const [isDropped, setIsDropped] = React.useState(false);
  // Editor-level dnd sensors. Initialized here so sidebar and workspace share the same context.
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Blocks state is stored in zustand so it's shared across editor components
  const setBlocks = useEditorDnDStore((s) => s.setBlocks);
  const blocks = useEditorDnDStore((s) => s.blocks);
  const moveBlock = useEditorDnDStore((s) => s.moveBlock);

  // Drag over id for UX (insertion indicator)
  const [overId, setOverId] = React.useState<string | null>(null);
  // active drag id for overlay preview
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const { setSelectedBlock } = useEditorStore();
  const isMobile = useIsMobile();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Проверяем, содержит ли элемент кликнутый target атрибут "data-block"
    const isInsideBlock = (e.target as HTMLElement).closest("[data-block]");
    if (!isInsideBlock) {
      setSelectedBlock(null);
    }
  };
  // Initialize default blocks on mount if store is empty
  React.useEffect(() => {
    if (blocks.length === 0) {
      setBlocks([
        { id: "block-a", component: <SimpleBlockA /> },
        { id: "block-b", component: <SimpleBlockB /> },
        { id: "block-a-2", component: <SimpleBlockA /> },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    // If dragging from sidebar (new item), active.id will be like `new:HeaderBlock`
    const activeId = String(active.id ?? "");
    const overId = String(over.id ?? "");

    if (activeId.startsWith("new:")) {
      const type = activeId.split(":")[1];
      const newId = `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const compMap: Record<string, React.ReactNode> = {
        HeaderBlock: <HeaderBlock />,
        TestComponentA: <TestComponentA />,
        TestComponentB: <TestComponentB />,
        SimpleBlockA: <SimpleBlockA />,
        SimpleBlockB: <SimpleBlockB />,
      };

      const newBlock = { id: newId, component: compMap[type] ?? <div /> };

      // If dropped on an existing block, insert before it, otherwise append
      const targetIndex = blocks.findIndex((b) => b.id === overId);
      if (targetIndex === -1) {
        setBlocks([...blocks, newBlock]);
      } else {
        const next = [...blocks];
        next.splice(targetIndex, 0, newBlock);
        setBlocks(next);
      }
      return;
    }

    if (activeId !== overId) {
      const oldIndex = blocks.findIndex((b) => b.id === activeId);
      const newIndex = blocks.findIndex((b) => b.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        moveBlock(oldIndex, newIndex);
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active?.id ? String(event.active.id) : null;
    setActiveId(id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event?.over?.id ? String(event.over.id) : null;
    setOverId(overId);
  };

  return (
    
    <div className={cn(
      "flex flex-col h-screen bg-background overflow-hidden",
      isMobile ? "pb-24" : ""
    )} onClick={handleClick}>
      <div>
        <HeaderApp />
        <HeaderTools />
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={(e) => {
          handleDragEnd(e);
          setOverId(null);
          setActiveId(null);
        }}
      >
        {!isMobile && (
          <div className="hidden lg:block">
            <SidebarEditorComponents />
          </div>
        )}
        <Workspace isDropped={isDropped} items={blocks} overId={overId} />
        {!isMobile && (
          <div className="hidden lg:block">
            <SidebarRightDnD />
          </div>
        )}
        {isMobile && <MobileEditorNavigation />}

        <DragOverlay>
          {activeId ? (
            String(activeId).startsWith("new:") ? (
              // preview for new item from sidebar
              (() => {
                const type = String(activeId).split(":")[1];
                const compMap: Record<string, React.ReactNode> = {
                  HeaderBlock: <HeaderBlock />,
                  TestComponentA: <TestComponentA />,
                  TestComponentB: <TestComponentB />,
                  SimpleBlockA: <SimpleBlockA />,
                  SimpleBlockB: <SimpleBlockB />,
                };
                return (
                  <div className="pointer-events-none w-80">
                    {compMap[type] ?? <div className="p-4 bg-muted/10 rounded">Preview</div>}
                  </div>
                );
              })()
            ) : (
              // preview when dragging existing workspace item
              (() => {
                const found = blocks.find((b) => b.id === String(activeId));
                return <div className="pointer-events-none w-80">{found?.component ?? null}</div>;
              })()
            )
          ) : null}
        </DragOverlay>
      </DndContext>

    </div>
  );
}
