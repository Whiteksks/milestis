"use client";

import { motion } from "framer-motion";
import { Settings, Edit3, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarSettings() {
  const iconButtons = [
    { id: "edit", Icon: Edit3, label: "Редактировать" },
    { id: "file", Icon: Settings, label: "Файл" },
    { id: "layers", Icon: Layers, label: "Слои" },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: 48, height: iconButtons.length * 48 + 16 }}
      transition={{ type: "spring", stiffness: 220, damping: 25 }}
      className="bg-popover border-b shadow-xl rounded-2xl overflow-hidden flex flex-col items-center p-1 space-y-1"
    >
      {iconButtons.map(({ id, Icon, label }) => (
        <button
          key={id}
          title={label}
          className={cn(
            "w-full flex items-center justify-center p-2 h-12 hover:bg-accent rounded-xl transition cursor-default select-none"
          )}
        >
          <Icon className="w-4 h-4 text-popover-foreground" />
        </button>
      ))}
    </motion.div>
  );
}
