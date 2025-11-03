"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SidebarDropdown() {
  const [open, setOpen] = useState(false);

  const items = [
    "Новый проект",
    "Импорт шаблона",
    "Настройки",
  ];

  return (
    <div className="relative mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 bg-popover border-b shadow-lg rounded-xl flex items-center justify-center hover:bg-accent transition"
      >
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-14 bg-popover border shadow-xl rounded-xl overflow-hidden w-48 z-50"
          >
            {items.map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-2 hover:bg-accent transition"
                onClick={() => setOpen(false)}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
