import { useDraggable } from "@dnd-kit/core";
import { BlockThumbnail } from "@/editor/panels/thumbnails/block-thumbnail";
import { createBlockElement } from "@/editor/blocks/block-library";

export default function DraggablePreview({
  id,
  componentName,
  title,
  description,
}: {
  id: string;
  componentName: string;
  title: string;
  description: string;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  const preview = createBlockElement(componentName);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-grab select-none active:cursor-grabbing"
    >
      <BlockThumbnail
        title={title}
        description={description}
        preview={preview ?? <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">Preview</div>}
        className="active:cursor-grabbing"
      />
    </div>
  );
}
