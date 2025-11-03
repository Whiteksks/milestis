"use client"

import React from "react"
import InternalSortable, { type InternalSortableItem } from "@/editor/dnd/InternalSortable"

const headerItems: InternalSortableItem[] = [
  {
    id: "title",
    content: (
      <div className="space-y-1 text-left">
        <p className="text-xs uppercase tracking-wide text-blue-500">Заголовок</p>
        <h3 className="text-lg font-semibold text-slate-900">Приветствие раздела</h3>
        <p className="text-sm text-slate-600">Добавьте эмоциональный слоган или короткое описание.</p>
      </div>
    ),
  },
  {
    id: "cta",
    content: (
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors">
          Начать
        </button>
        <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white/60 transition-colors">
          Подробнее
        </button>
      </div>
    ),
  },
  {
    id: "meta",
    content: (
      <div className="text-left space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Контакты</p>
        <p className="text-sm text-slate-600">Email: hello@studio.com</p>
        <p className="text-sm text-slate-600">Телефон: +7 (900) 000-00-00</p>
      </div>
    ),
  },
]

export const HeaderBlock: React.FC = () => {
  return (
    <div className="w-full min-h-screen p-6 bg-blue-100">
      <div className="max-w-7xl mx-auto text-2xl font-bold text-center text-slate-900">Заголовок блока</div>

      <div className="max-w-4xl mx-auto mt-8">
        <InternalSortable
          items={headerItems}
          containerClassName="space-y-4"
          itemClassName="bg-white/90 border border-slate-200 rounded-xl p-5 shadow-sm"
          handleClassName="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  )
}
