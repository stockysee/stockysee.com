import { SectionElement } from "@/components/storefront/sections/BuilderSection";
import { useDragControls } from "framer-motion";
import { useBuilderState } from "./useBuilderState";
import React from "react";

export interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export interface Section {
    id: string;
    type: string;
    config: any;
    elements?: SectionElement[];
    order: number;
    isActive: boolean;
}

export interface DraggableReorderItemProps {
    value: any;
    onDragStart?: (itemId: string) => void;
    onDragEnd?: () => void;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    children: (dragControls: ReturnType<typeof useDragControls>) => React.ReactNode;
}

export interface MoveControlsProps {
    canMoveUp: boolean;
    canMoveDown: boolean;
    onMoveUp: (e: React.MouseEvent) => void;
    onMoveDown: (e: React.MouseEvent) => void;
}

export interface UnitControlProps {
    label: string;
    value: any;
    onChange: (val: any) => void;
    min?: number;
    max?: number;
    defaultValue?: number;
    fieldKey: string;
    activeDropdown: { field: string; elementId?: string } | null;
    setActiveDropdown: (state: { field: string; elementId?: string } | null) => void;
    elementId?: string;
}

export interface BuilderSidebarProps {
    state: ReturnType<typeof useBuilderState>;
    activeCanvas: 'homepage' | 'header' | 'footer';
}
