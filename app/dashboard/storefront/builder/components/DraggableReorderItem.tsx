// @ts-nocheck
import { Reorder, useDragControls } from "framer-motion";
import { DraggableReorderItemProps } from "../types";

export function DraggableReorderItem({ value, onDragStart, onDragEnd, className, onClick, children }: DraggableReorderItemProps) {
    const dragControls = useDragControls();
    return (
    <Reorder.Item
      value={value}
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      onDragStart={() => {
        console.log('[Builder Drag] Drag started for item:', value?.id || value);
        if (onDragStart) onDragStart(value?.id || String(value));
      }}
      onDragEnd={() => {
        console.log('[Builder Drag] Drag ended for item:', value?.id || value);
        if (onDragEnd) onDragEnd();
      }}
      className={className}
      onClick={onClick}
    >
      {children(dragControls)}
    </Reorder.Item>
    );
}

