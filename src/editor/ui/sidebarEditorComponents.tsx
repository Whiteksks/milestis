"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

export function SidebarEditorComponents() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 260 : 56, height: isOpen ? 420 : 56 }}
        transition={{ type: "spring", stiffness: 220, damping: 25 }}
        className="bg-white border shadow-xl rounded-2xl overflow-hidden flex flex-col"
      >
        {/* --- Верхняя панель кнопок --- */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-gray-700">Блоки</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        {/* --- Контент панели (Puck.Components) --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-auto p-3"
            >
              <div>
                Lorem ipsum dolor sit amet.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
