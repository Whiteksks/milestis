import { useDraggable } from "@dnd-kit/core";
import { HeaderBlock, TestComponentA, TestComponentB } from "../components";

export default function DraggablePreview({
  id,
  label,
  componentName,
}: {
  id: string;
  label: string;
  componentName: string;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  const compMap: Record<string, React.ReactNode> = {
    HeaderBlock: <HeaderBlock />,
    TestComponentA: <TestComponentA />,
    TestComponentB: <TestComponentB />,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="group relative p-2 bg-card rounded-lg border border-border shadow-sm cursor-grab hover:bg-accent/40 hover:shadow-md transition-all duration-200"
    >
      {/* Верхняя панель с названием */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </div>

      {/* Превью содержимого */}
      <div className="bg-background rounded-md overflow-hidden border border-border/50" style={{ height: "80px" }}>
        <div
          style={{
            width: "250%",
            height: "250%",
            transform: "scale(0.4)",
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          {compMap[componentName] ?? (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              Preview
            </div>
          )}
        </div>
      </div>

      {/* Светлая подсветка при наведении */}
      <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
