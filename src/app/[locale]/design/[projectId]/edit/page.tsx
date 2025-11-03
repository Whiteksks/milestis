"use client";

import { HeaderApp } from "@/editor/panels/header/header";
import { HeaderTools } from "@/editor/panels/header/headerEditorFields";
import { SidebarEditorComponents } from "@/editor/panels/sidebar/sidebarEditorComponents";
import { Workspace } from "@/editor/canvas/workspace";
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import SimpleBlockA from "@/editor/components/SimpleBlockA";
import SimpleBlockB from "@/editor/components/SimpleBlockB";
import { HeaderBlock, SimpleBlockC, SimpleBlockD } from "@/editor/components";
import useEditorDnDStore from "@/editor/state/useEditorDnDStore";
import React from "react";
import { useEditorStore } from "@/editor/state/useEditorStore";
import { SidebarRightDnD } from "@/editor/panels/inspector/InspectorDnD";
import { MobileEditorNavigation } from "@/editor/navigation/mobile/MobileEditorNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { createBlockElement } from "@/editor/blocks/block-library";

export default function Page() {
  const [isDropped, setIsDropped] = React.useState(false);
  // Editor-level dnd sensors. Initialized here so sidebar and workspace share the same context.
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Blocks state is stored in zustand so it's shared across editor components
  const setBlocks = useEditorDnDStore((s) => s.setBlocks);
  const blocks = useEditorDnDStore((s) => s.blocks);
  const moveBlock = useEditorDnDStore((s) => s.moveBlock);
  const removeBlock = useEditorDnDStore((s) => s.removeBlock);

  // Drag over id for UX (insertion indicator)
  const [overId, setOverId] = React.useState<string | null>(null);
  // active drag id for overlay preview
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const { setSelectedBlock } = useEditorStore();
  const selectedBlock = useEditorStore((s) => s.selectedBlock);
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

      const component = createBlockElement(type) ?? <div />;
      const newBlock = { id: newId, component };

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

  const handleDeleteBlock = React.useCallback(
    (id: string) => {
      removeBlock(id);
      if (selectedBlock?.id === id) {
        setSelectedBlock(null);
      }
    },
    [removeBlock, selectedBlock?.id, setSelectedBlock]
  );

  const handleMoveBlockUp = React.useCallback(
    (id: string) => {
      const index = blocks.findIndex((block) => block.id === id);
      if (index > 0) {
        moveBlock(index, index - 1);
      }
    },
    [blocks, moveBlock]
  );

  const handleMoveBlockDown = React.useCallback(
    (id: string) => {
      const index = blocks.findIndex((block) => block.id === id);
      if (index !== -1 && index < blocks.length - 1) {
        moveBlock(index, index + 1);
      }
    },
    [blocks, moveBlock]
  );

  const handleDuplicateBlock = React.useCallback(
    (id: string) => {
      const index = blocks.findIndex((block) => block.id === id);
      if (index === -1) return;

      const original = blocks[index];
      const clonedId = `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const clonedComponent = React.isValidElement(original.component)
        ? React.cloneElement(original.component, { key: clonedId })
        : original.component;

      const clonedBlock = {
        id: clonedId,
        component: clonedComponent,
      };

      const next = [...blocks];
      next.splice(index + 1, 0, clonedBlock);
      setBlocks(next);
      setSelectedBlock(clonedBlock);
    },
    [blocks, setBlocks, setSelectedBlock]
  );

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
        <Workspace
          isDropped={isDropped}
          items={blocks}
          overId={overId}
          onDeleteBlock={handleDeleteBlock}
          onMoveBlockUp={handleMoveBlockUp}
          onMoveBlockDown={handleMoveBlockDown}
          onDuplicateBlock={handleDuplicateBlock}
        />
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
                  TestComponentA: <SimpleBlockC />,
                  TestComponentB: <SimpleBlockD />,
                  SimpleBlockA: <SimpleBlockA />,
                  SimpleBlockB: <SimpleBlockB />,
                };
                return (
                  <div className="pointer-events-none w-96 max-h-64 overflow-hidden rounded-md border bg-background/90 shadow-md p-2">
                    {compMap[type] ?? <div className="p-4 bg-muted/10 rounded">Preview</div>}
                  </div>
                );
              })()
            ) : (
              // preview when dragging existing workspace item
              (() => {
                const found = blocks.find((b) => b.id === String(activeId));
                return (
                  <div className="pointer-events-none w-96 max-h-64 overflow-hidden rounded-md border bg-background/90 shadow-md p-2">
                    {found?.component ?? null}
                  </div>
                );
              })()
            )
          ) : null}
        </DragOverlay>
      </DndContext>

    </div>
  );
}
