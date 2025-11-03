"use client"

import React from "react"
import { DndContext, PointerSensor, type DragEndEvent, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export type InternalSortableItem = {
  id: string
  content: React.ReactNode
  className?: string
  wrapperClassName?: string
}

type InternalSortableProps = {
  items?: InternalSortableItem[]
  children?: React.ReactNode
  onReorder?: (items: InternalSortableItem[]) => void
  containerClassName?: string
  itemClassName?: string
  handleClassName?: string
}

export const InternalSortable: React.FC<InternalSortableProps> = ({
  items,
  children,
  onReorder,
  containerClassName = "space-y-3",
  itemClassName = "bg-card/80 border border-border/30 rounded-lg p-4 shadow-sm backdrop-blur-sm",
  handleClassName = "w-8 h-8 flex items-center justify-center rounded-md border border-border/40 bg-background/80 text-muted-foreground cursor-grab active:cursor-grabbing",
}) => {
  const initialItems = React.useMemo(() => {
    if (items?.length) {
      return items
    }
    if (children) {
      return React.Children.toArray(children).map((child, index) => ({
        id: getChildKey(child, index, "sortable"),
        content: child,
      }))
    }
    return []
  }, [items, children])

  const [currentItems, setCurrentItems] = React.useState<InternalSortableItem[]>(initialItems)

  React.useEffect(() => {
    if (items) {
      setCurrentItems(items)
    }
  }, [items])

  React.useEffect(() => {
    if (!items && children !== undefined) {
      setCurrentItems(
        React.Children.toArray(children).map((child, index) => ({
          id: getChildKey(child, index, "sortable"),
          content: child,
        })),
      )
    }
  }, [items, children])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      setCurrentItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id)
        const newIndex = prev.findIndex((item) => item.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return prev
        const nextItems = arrayMove(prev, oldIndex, newIndex)
        onReorder?.(nextItems)
        return nextItems
      })
    },
    [onReorder],
  )

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={currentItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className={containerClassName}>
          {currentItems.map((item) => (
            <InnerSortableItem
              key={item.id}
              id={item.id}
              wrapperClassName={item.wrapperClassName}
              className={item.className ? `${itemClassName} ${item.className}`.trim() : itemClassName}
              handleClassName={handleClassName}
            >
              {item.content}
            </InnerSortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

type InnerSortableItemProps = {
  id: string
  className: string
  handleClassName: string
  wrapperClassName?: string
  children: React.ReactNode
}

const InnerSortableItem: React.FC<InnerSortableItemProps> = ({
  id,
  className,
  handleClassName,
  wrapperClassName,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.94 : 1,
    zIndex: isDragging ? 40 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative flex gap-3 ${wrapperClassName ?? ""}`.trim()}>
      <button
        type="button"
        className={handleClassName}
        aria-label="Move block"
        {...attributes}
        {...listeners}
      >
        ≡
      </button>
      <div className={`flex-1 ${className}`.trim()}>{children}</div>
    </div>
  )
}

const getChildKey = (child: React.ReactNode, index: number, prefix: string) => {
  if (React.isValidElement(child) && child.key != null) {
    return String(child.key)
  }
  return `${prefix}-${index}`
}

export default InternalSortable
