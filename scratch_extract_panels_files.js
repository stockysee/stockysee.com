const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");
const fs = require("fs");

const project = new Project();
const dirPath = path.join(process.cwd(), "app/dashboard/storefront/builder");
const filePath = path.join(dirPath, "BuilderSidebar.tsx.recovered");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
const animatePresence = bs.getDescendantsOfKind(SyntaxKind.JsxElement).find(n => n.getOpeningElement().getTagNameNode().getText() === "AnimatePresence");

const expression = animatePresence.getJsxChildren().find(n => n.getKind() === SyntaxKind.JsxExpression);
let currentExpr = expression.getExpression();

let libraryExpr = null;
let editorExpr = null;
let defaultExpr = null;

while (currentExpr && currentExpr.getKind() === SyntaxKind.ConditionalExpression) {
  const condText = currentExpr.getCondition().getText();
  if (condText.includes("activePanel === 'library'")) {
    libraryExpr = currentExpr.getWhenTrue();
  } else if (condText.includes("activePanel === 'editor'")) {
    editorExpr = currentExpr.getWhenTrue();
  }
  currentExpr = currentExpr.getWhenFalse();
}

defaultExpr = currentExpr;

if (!libraryExpr || !editorExpr) {
  console.log("Could not find library or editor panel");
  process.exit(1);
}

const componentTemplate = (name, jsxText) => `
import React from 'react';
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Settings2, Sliders, Eye, Save, X, Layers, Box, LayoutTemplate, 
  Palette, Settings, Link as LinkIcon, ArrowLeft, ChevronLeft, ChevronRight, 
  ChevronDown, ChevronUp, Smartphone, Monitor, Type, Image as ImageIcon, 
  Paintbrush, Globe, Upload, Loader2, ShoppingBag, ShieldCheck, Copy, Clipboard, 
  CopyPlus, PlusCircle, Columns, Undo2, Redo2, LayoutGrid, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, MousePointerClick, SeparatorHorizontal, Award, Pencil, 
  Folder, Sparkles, Link2, RotateCcw, Bold, Italic, Underline, List, ListOrdered, 
  Maximize2, Table, Strikethrough, HelpCircle, Eraser, Quote, Minus, Move
} from "lucide-react";
import { BuilderSidebarProps } from "../types";
import { POPULAR_FONTS } from "../constants";
import { SECTION_STRUCTURE_TEMPLATES } from "../templates";
import { sanitizeSections, parseUnitAndValue } from "../utils";
import { RichTextEditor } from "../components/RichTextEditor";
import { DraggableReorderItem } from "../components/DraggableReorderItem";
import { MoveControls } from "../components/MoveControls";
import { UnitControl } from "../components/UnitControl";
import { ELEMENT_TYPE_MAP } from "@/components/storefront/sections/BuilderSection";

export interface ${name}Props extends BuilderSidebarProps {
  isFloatingNavigatorOpen: boolean;
  setIsFloatingNavigatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ${name}(props: ${name}Props) {
  const { state, isFloatingNavigatorOpen, setIsFloatingNavigatorOpen } = props;
  const {
    CLICK_SUPPRESS_MS, activeDragId, activeDropdown, activeEditorTab, activeElementId,
    activeLibraryTab, activePanel, activePopover, activeSubFocus, addingBlockToId,
    allCustomPages, bgBorderRadiusLink, bgBorderWidthLink, borderRadiusLink, borderWidthLink,
    btnBorderRadiusLink, btnPaddingLink, btnStyleMode, categories, client, closeMediaModal,
    contextMenu, copiedElementData, copiedSection, customPage, dragIntentRef, dragReleaseTimeoutRef,
    draggedWidgetType, editingSection, editorCollapse, expandedSections, findChildrenList, future,
    handleAddColumnChild, handleAddElement, handleAddSection, handleCanvasAddElementClick,
    handleContainerClickCapture, handleCopyElementCtx, handleCopySection, handleCustomWidgetClick,
    handleDeleteColumnChild, handleDeleteElement, handleDeleteElementCtx, handleDeleteImage,
    handleDeleteSection, handleDragEnd, handleDragStart, handleDropWidget, handleDuplicateElementCtx,
    handleDuplicateSection, handleGripPointerDown, handleInsertFeaturesTemplate, handleInsertHeroTemplate,
    handleMediaSelect, handleMediaSelectMultiple, handlePasteElementCtx, handlePasteSection,
    handlePreview, handlePublish, handleRedo, handleResizeStart, handleSave, handleSaveElementOrder,
    handleSaveOrder, handleSelectStructure, handleSvgUpload, handleUndo, handleUpdateColumnChild,
    handleUpdateElement, handleUploadImage, handleWidgetClick, handleWidgetDragEnd, handleWidgetDragStart,
    hasChanges, hasInitialized, imageResolutionMode, initialSections, isDraggingRef, isDraggingWidget,
    isLeftPanelOpen, isLoading, isMediaModalOpen, isResizing, isSaving, isStructureModalOpen, isUploading,
    lastDragTimeRef, loadingPage, loadingSections, marginLink, mediaModalCallback, mediaModalInitialSelected,
    mediaModalMaxSelect, mediaModalMode, mediaModalMultiple, moveElement, moveInArray, moveSection,
    newlyAddedElementId, openMediaModal, openMediaSvgModal, paddingLink, pageId, panelWidth, past,
    prevEditingSectionIdRef, previewMode, products, refreshPage, refreshSections, renderElementTree,
    router, saveHistory, searchParams, sections, setActiveDragId, setActiveDropdown, setActiveEditorTab,
    setActiveElementId, setActiveLibraryTab, setActivePanel, setActivePopover, setActiveSubFocus,
    setAddingBlockToId, setBgBorderRadiusLink, setBgBorderWidthLink, setBorderRadiusLink, setBorderWidthLink,
    setBtnBorderRadiusLink, setBtnPaddingLink, setBtnStyleMode, setContextMenu, setCopiedElementData,
    setCopiedSection, setDraggedWidgetType, setEditingSection, setEditorCollapse, setExpandedSections,
    setFuture, setHasChanges, setImageResolutionMode, setIsDraggingWidget, setIsLeftPanelOpen,
    setIsMediaModalOpen, setIsSaving, setIsStructureModalOpen, setIsUploading, setMarginLink,
    setMediaModalCallback, setMediaModalMode, setNewlyAddedElementId, setPaddingLink, setPanelWidth,
    setPast, setPreviewMode, setSections, setShowImageUrlInput, setTempHeight, setTempWidth, setTheme,
    shouldSuppressClick, showConfirm, showImageUrlInput, showToast, swapInArray, tempHeight, tempWidth,
    theme, updateLocalSection
  } = state;

  return (
    ${editorExpr.getText()}
  );
}
`;

fs.mkdirSync(path.join(dirPath, "panels"), { recursive: true });
fs.writeFileSync(path.join(dirPath, "panels/EditorPanel.tsx"), componentTemplate("EditorPanel", editorExpr.getText()));
console.log("Extraction successful!");
