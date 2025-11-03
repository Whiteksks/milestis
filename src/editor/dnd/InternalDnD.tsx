"use client"

import React from "react"
import { DndContext, PointerSensor, type DragEndEvent, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export type InternalDnDItem = {
  id: string
  content: React.ReactNode
  wrapperClassName?: string
  className?: string
}

type InternalDnDProps = {
  items?: InternalDnDItem[]
  children?: React.ReactNode
  columns?: number
  gapClassName?: string
  itemClassName?: string
  containerClassName?: string
  handleClassName?: string
  onReorder?: (items: InternalDnDItem[]) => void
}

export const InternalDnD: React.FC<InternalDnDProps> = ({
  items,
  children,
  columns = 3,
  gapClassName = "gap-4",
  itemClassName = "bg-card/80 border border-border/30 rounded-xl p-5 shadow-sm backdrop-blur-sm",
  containerClassName = "grid",
  handleClassName = "absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md border border-border/40 bg-background/80 text-muted-foreground shadow-sm transition-transform hover:scale-105 focus:outline-none cursor-grab active:cursor-grabbing",
  onReorder,
}) => {
  const normalizedColumns = Math.max(1, columns)
  const initialItems = React.useMemo(() => {
    if (items?.length) {
      return items
    }
    if (children) {
      return React.Children.toArray(children).map((child, index) => ({
        id: getChildKey(child, index, "grid"),
        content: child,
      }))
    }
    return []
  }, [items, children])

  const [currentItems, setCurrentItems] = React.useState<InternalDnDItem[]>(initialItems)

  React.useEffect(() => {
    if (items) {
      setCurrentItems(items)
    }
  }, [items])

  React.useEffect(() => {
    if (!items && children !== undefined) {
      setCurrentItems(
        React.Children.toArray(children).map((child, index) => ({
          id: getChildKey(child, index, "grid"),
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
      <SortableContext items={currentItems.map((item) => item.id)} strategy={rectSortingStrategy}>
        <div
          className={`${containerClassName} ${gapClassName}`.trim()}
          style={{ gridTemplateColumns: `repeat(${normalizedColumns}, minmax(0, 1fr))` }}
        >
          {currentItems.map((item) => {
            const combinedClassName = item.className
              ? `${itemClassName} ${item.className}`.trim()
              : itemClassName

            return (
              <InternalDnDSortableItem
                key={item.id}
                id={item.id}
                wrapperClassName={item.wrapperClassName}
                className={combinedClassName}
                handleClassName={handleClassName}
              >
                {item.content}
              </InternalDnDSortableItem>
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
}

type InternalDnDSortableItemProps = {
  id: string
  className: string
  wrapperClassName?: string
  handleClassName: string
  children: React.ReactNode
}

const InternalDnDSortableItem: React.FC<InternalDnDSortableItemProps> = ({
  id,
  className,
  wrapperClassName,
  handleClassName,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.92 : 1,
    zIndex: isDragging ? 40 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${wrapperClassName ?? ""}`.trim()}
    >
      <button
        type="button"
        className={handleClassName}
        aria-label="Move block"
        {...attributes}
        {...listeners}
      >
        ≡
      </button>
      <div className={className}>{children}</div>
    </div>
  )
}

const getChildKey = (child: React.ReactNode, index: number, prefix: string) => {
  if (React.isValidElement(child) && child.key != null) {
    return String(child.key)
  }
  return `${prefix}-${index}`
}

export default InternalDnD
