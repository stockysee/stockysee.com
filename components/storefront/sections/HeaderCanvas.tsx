"use client";

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
}: HeaderCanvasProps) {
  console.log("[HeaderCanvas] Rendering header canvas component cleanly without penanda bar");
  return (
    <div className="w-full">
      <BuilderSection
        id={headerSection.id}
        config={headerSection.config}
        elements={headerSection.elements || []}
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
        onOpenEditPanel={(elementId) => {
          setEditingSection(headerSection);
          setActiveElementId(elementId);
          setIsLeftPanelOpen(true);
          setActivePanel('editor');
        }}
      />
    </div>
  );
}