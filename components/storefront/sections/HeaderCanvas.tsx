"use client";

import { useRef, useState, useEffect } from "react";
import { SectionElement } from "./BuilderSection";
import { BuilderSection } from "./BuilderSection";

interface HeaderCanvasProps {
  headerSection: {
    id: string;
    config: any;
    elements?: SectionElement[];
  };
  editingSection: any;
  activeElementId: string | null;
  activeSubFocus: string | null;
  setEditingSection: (s: any) => void;
  setActiveElementId: (id: string | null) => void;
  setActivePanel: (panel: any) => void;
  setActiveSubFocus: (f: string | null) => void;
  setIsLeftPanelOpen: (open: boolean) => void;
  handleDeleteElement: (sectionId: string, elementId: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  handleCanvasAddElementClick: (parentId: string, isColumn: boolean) => void;
  newlyAddedElementId: string | null;
  handleDropWidget: (targetId: string, widgetType: string) => void;
  isDraggingWidget: boolean;
  isLeftPanelOpen: boolean;
  setContextMenu: (menu: any) => void;
  panelWidth?: number;
}

export default function HeaderCanvas({
  headerSection,
  editingSection,
  activeElementId,
  activeSubFocus,
  setEditingSection,
  setActiveElementId,
  setActivePanel,
  setActiveSubFocus,
  setIsLeftPanelOpen,
  handleDeleteElement,
  handleDeleteSection,
  handleCanvasAddElementClick,
  newlyAddedElementId,
  handleDropWidget,
  isDraggingWidget,
  isLeftPanelOpen,
  setContextMenu,
  panelWidth,
}: HeaderCanvasProps) {
  // Di canvas builder, TIDAK pakai ResizeObserver/spacer — tidak ada fixed layout di canvas.
  const pos = headerSection.config?.position;
  const isFixed = pos === 'fixed';
  const isSticky = pos === 'sticky' || headerSection.config?.sticky === true;

  // Label indikator posisi untuk feedback visual di canvas
  const posLabel = isFixed ? 'Fixed' : isSticky ? 'Sticky' : pos === 'absolute' ? 'Absolute' : null;

  // elements: dari root (setelah builder map) atau dari config.elements (Prisma raw)
  const headerElements = headerSection.elements || (headerSection.config?.elements as SectionElement[] | undefined) || [];

  console.log("[HeaderCanvas] Render - pos:", pos, "elements:", headerElements.length, "isLeftPanelOpen:", isLeftPanelOpen, "panelWidth:", panelWidth);

  return (
    <div className="w-full">
      {/* Indikator posisi — tampil jika header di-set fixed/sticky/absolute */}
      {posLabel && (
        <div className="flex items-center justify-end px-3 py-1 bg-amber-50 border-b border-amber-200">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
            ⚓ Posisi di storefront: <span className="text-amber-800">{posLabel}</span> · Di canvas ditampilkan sebagai relative
          </span>
        </div>
      )}
      {/*
        PENTING: Di canvas builder, outer wrapper SELALU position: relative.
        Jangan terapkan fixed/sticky/absolute dari config — itu akan menyebabkan
        header "terbang" ke browser viewport, bukan ke area canvas.
        Efek scroll (fixed/sticky) hanya berlaku di storefront sebenarnya.
      */}
      <div
        className="w-full transition-all duration-300 relative"
        style={{
          borderRadius: `${headerSection.config?.borderRadius ?? 0}px`,
        }}
      >
        <BuilderSection
          id={headerSection.id}
          config={headerSection.config}
          elements={headerElements}
          activeElementId={editingSection?.id === headerSection.id ? activeElementId : null}
          activeSubFocus={activeSubFocus}
          onElementSelect={(elementId, subFocus) => {
            setEditingSection(headerSection);
            setActiveElementId(elementId);
            setActivePanel('editor');
            setActiveSubFocus(subFocus || null);
            console.log("[HeaderCanvas] Element terpilih:", elementId);
          }}
          onElementSelectOnly={(elementId) => {
            setEditingSection(headerSection);
            setActiveElementId(elementId);
            console.log("[HeaderCanvas] Element tersorot:", elementId);
          }}
          onElementEdit={(elementId) => {
            setEditingSection(headerSection);
            setActiveElementId(elementId);
            setIsLeftPanelOpen(true);
            setActivePanel('editor');
            console.log("[HeaderCanvas] Edit element:", elementId);
          }}
          onDeleteElement={(elementId) => {
            handleDeleteElement(headerSection.id, elementId);
          }}
          onSectionSelect={() => {
            setEditingSection(headerSection);
            setIsLeftPanelOpen(true);
            setActivePanel('editor');
            setActiveElementId(null);
          }}
          onSectionSelectOnly={() => {
            setEditingSection(headerSection);
            setActiveElementId(null);
          }}
          onDeleteSection={(sectionId) => handleDeleteSection(sectionId)}
          isActive={editingSection?.id === headerSection.id && !activeElementId}
          onAddElement={() => {
            setEditingSection(headerSection);
            setActivePanel('library');
          }}
          onElementContextMenu={(elementId, x, y) => {
            setContextMenu({ x, y, section: headerSection, elementId });
          }}
          onAddElementClick={handleCanvasAddElementClick}
          newlyAddedElementId={newlyAddedElementId}
          onDropWidget={handleDropWidget}
          isDraggingWidget={isDraggingWidget}
          isLeftPanelOpen={isLeftPanelOpen}
          panelWidth={panelWidth}
          onOpenEditPanel={(elementId) => {
            setEditingSection(headerSection);
            setActiveElementId(elementId);
            setIsLeftPanelOpen(true);
            setActivePanel('editor');
          }}
        />
      </div>
    </div>
  );
}
