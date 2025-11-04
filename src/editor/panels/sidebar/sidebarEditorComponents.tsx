"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Settings as SettingsIcon, ChevronLeft, Heart, BookTemplate } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SidebarSettings } from "./sidebarSettings";
import DraggablePreview from "../../palette/DraggablePreview";
import { BLOCK_LIBRARY, type BlockLibraryItem } from "@/editor/blocks/block-library";

const PANEL_CONFIG = [
  { id: "blocks", label: "Блоки", icon: Layers },
  { id: "settings", label: "Настройки", icon: SettingsIcon },
  { id: "favorites", label: "Избранное", icon: Heart },
  { id: "templates", label: "Шаблоны", icon: BookTemplate },
] as const;

type PanelConfig = (typeof PANEL_CONFIG)[number];
type PanelId = PanelConfig["id"];

export function SidebarEditorComponents() {
  const [activePanel, setActivePanel] = React.useState<PanelId | null>("blocks");

  const blocks = React.useMemo(() => BLOCK_LIBRARY, []);

  const activePanelConfig = React.useMemo<PanelConfig | null>(
    () => PANEL_CONFIG.find((panel) => panel.id === activePanel) ?? null,
    [activePanel]
  );

  const panelContent = React.useMemo<Record<PanelId, React.ReactNode>>(
    () => ({
        blocks: <BlocksPanel blocks={blocks} />,
        settings: <SettingsPanel />,
        favorites: <FavoritesPanel />,
        templates: <LayoutTemplate />,
      }),
    [blocks]
  );

  const handleTogglePanel = React.useCallback((panelId: PanelId) => {
    setActivePanel((current) => (current === panelId ? null : panelId));
  }, []);

  return (
    <TooltipProvider>
      <FloatingPanelToggles
        panels={PANEL_CONFIG}
        activePanel={activePanel}
        onToggle={handleTogglePanel}
      />

      <AnimatePresence initial={false}>
        {activePanelConfig && activePanel && (
          <SidebarDrawer
            key={activePanel}
            panel={activePanelConfig}
            onClose={() => setActivePanel(null)}
          >
            {panelContent[activePanel]}
          </SidebarDrawer>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}

interface FloatingPanelTogglesProps {
  panels: readonly PanelConfig[];
  activePanel: PanelId | null;
  onToggle: (panelId: PanelId) => void;
}

function FloatingPanelToggles({ panels, activePanel, onToggle }: FloatingPanelTogglesProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div 
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40"
      data-header-toolbar="true"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1 bg-card border border-border rounded-r-2xl shadow-lg p-2">
        {panels.map(({ id, icon: Icon, label }) => (
          <Tooltip key={id} delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onToggle(id)}
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-xl transition-all duration-200 ${
                  activePanel === id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}


interface SidebarDrawerProps {
  panel: PanelConfig;
  onClose: () => void;
  children: React.ReactNode;
}

function SidebarDrawer({ panel, onClose, children }: SidebarDrawerProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <motion.aside
      className="fixed top-26 left-2 bottom-2 w-[min(30rem,calc(100vw-6rem))] 
                 bg-background border border-border z-30 flex flex-col 
                 shadow-lg rounded-2xl overflow-hidden"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      data-header-toolbar="true"
      onClick={handleClick}
    >
      {/* Заголовок панели */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Панель</p>
          <h2 className="text-base font-semibold text-foreground">{panel.label}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Прокручиваемая часть */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">{children}</div>
      </ScrollArea>
    </motion.aside>
  );
}


function BlocksPanel({ blocks }: { blocks: BlockLibraryItem[] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Библиотека блоков</p>
        <p className="text-sm text-muted-foreground">Перетащите компонент на холст для добавления.</p>
      </div>
      <div className="grid gap-3 grid-cols-2">
        {blocks.map((block) => (
          <DraggablePreview
            key={block.id}
            id={`new:${block.componentName}`}
            componentName={block.componentName}
            title={block.title}
            description={block.description}
          />
        ))}
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">Быстрые настройки</p>
      <div className="flex">
        <SidebarSettings />
      </div>
    </div>
  );
}

function FavoritesPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">Избранные блоки</p>
      <p className="text-sm text-muted-foreground">
        Здесь появятся ваши избранные элементы.
      </p>
    </div>
  );
}

function LayoutTemplate() {
  return (
    <div className="w-4 h-4 bg-foreground/20 rounded-sm relative">
      <div className="absolute top-1 left-1 w-2 h-1 bg-foreground rounded-sm" />
      <div className="absolute top-2 left-1 w-2 h-1 bg-foreground rounded-sm" />
      <div className="absolute top-3 left-1 w-2 h-1 bg-foreground rounded-sm" />
      <div className="absolute top-1 right-1 w-1 h-3 bg-foreground rounded-sm" />
    </div>
  );
}