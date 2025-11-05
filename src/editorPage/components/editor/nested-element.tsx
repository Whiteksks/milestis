"use client"

import { motion } from "framer-motion"
import { Trash2, Edit2 } from "lucide-react"
import type { NestedElement } from "@/editorPage/lib/block-types"

interface NestedElementProps {
  element: NestedElement
  onEdit: () => void
  onDelete: () => void
  isEditing?: boolean
}

export function NestedElementComponent({ element, onEdit, onDelete, isEditing = false }: NestedElementProps) {
  const renderElement = () => {
    switch (element.type) {
      case "button":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
          >
            {element.content}
          </button>
        )
      case "heading":
        return (
          <h3
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="text-xl font-bold cursor-pointer hover:opacity-70 transition-opacity"
          >
            {element.content}
          </h3>
        )
      case "text":
        return (
          <p
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="text-sm cursor-pointer hover:opacity-70 transition-opacity"
          >
            {element.content}
          </p>
        )
      case "input":
        return (
          <input
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            type="text"
            placeholder={element.content}
            className="px-3 py-2 border border-border rounded text-sm cursor-pointer"
            readOnly
          />
        )
      case "divider":
        return <div className="h-px bg-border my-2" />
      default:
        return <div className="text-xs text-muted-foreground">{element.type}</div>
    }
  }

  return (
    <motion.div
      className={`group relative p-2 rounded transition-colors ${
        isEditing ? "bg-indigo-50 border border-indigo-200" : "hover:bg-muted"
      }`}
      whileHover={{ y: -1 }}
    >
      {renderElement()}
      <motion.div
        className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1 }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground"
        >
          <Edit2 size={14} strokeWidth={1.5} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1 hover:bg-background rounded text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={14} strokeWidth={1.5} />
        </button>
      </motion.div>
    </motion.div>
  )
}
