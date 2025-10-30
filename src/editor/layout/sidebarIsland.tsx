"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutTemplate, Image, Type, Heart } from "lucide-react";
import { cn } from "@/lib/utils"; 

interface SidebarIslandProps {
  title?: string;
  children?: React.ReactNode;
}

const iconButtons = [
  { 
    id: "template", 
    Icon: LayoutTemplate,
    label: "Шаблон" 
  },
  { 
    id: "image", 
    Icon: Image,
    label: "Картинка" 
  },
  { 
    id: "text", 
    Icon: Type,
    label: "Текст" 
  },
  { 
    id: "favorite", 
    Icon: Heart,
    label: "Избранное" 
  },
];

export function SidebarIsland({ title = "Блоки", children }: SidebarIslandProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Состояние для активной кнопки (если нужно выделять ее)

  const handleIconClick = (id: string) => {
    setIsOpen(true); 
    console.log(`Выбрана иконка: ${id}`);
  };

  return (
    <motion.div
      initial={false}
      // Увеличиваем высоту закрытого состояния, чтобы поместить иконки
      animate={{ width: isOpen ? 260 : 48, height: isOpen ? 420 : 
        // Высота закрытого состояния теперь зависит от количества иконок
        // 56px (высота одной иконки) * 4 иконки + 16px (примерный отступ)
        iconButtons.length * 48 + 16
      }} 
      transition={{ type: "spring", stiffness: 220, damping: 25 }}
      className="bg-popover border-b shadow-xl rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Верхняя панель / Набор иконок */}
      <div className={cn(
        "flex", 
        // Если открыто - верхняя панель (строка), если закрыто - столбец иконок
        isOpen ? "items-center justify-between px-3 py-2 border-b bg-popover" : "flex-col p-1 space-y-1"
      )}>
        
        {/* Состояние ЗАКРЫТО: Отображаем массив кнопок-иконок */}
        {!isOpen ? (
          iconButtons.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => handleIconClick(id)}
              title={label}
              className={cn(
                "w-full flex items-center justify-center p-2 h-12 hover:bg-accent rounded-xl transition",
              )}
            >
              <Icon className="w-4 h-4" /> 
            </button>
          ))
        ) : (
          /* Состояние ОТКРЫТО: Отображаем заголовок и кнопку закрытия */
          <div className="flex w-full items-center justify-between">
            <span className="font-medium text-popover-foreground">{title}</span>
            <button
              onClick={() => {
                setIsOpen(false);
                // setActiveIcon(null); // Сбросить активную иконку при закрытии, если нужно
              }}
              className="p-1 hover:bg-accent rounded-md"
            >
              <X className="w-4 h-4 text-popover-foreground" />
            </button>
          </div>
        )}
      </div>
      
      {/* --- Контент --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 overflow-auto p-4"
          >
            {children || <div className="text-muted-foreground">Выберите элемент или блок.</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}