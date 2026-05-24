// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { motion, Reorder, AnimatePresence, useDragControls } from "framer-motion";

// Import pembungkus/state dan types
import { useBuilderState } from "./useBuilderState";
import { SectionElement, ELEMENT_TYPE_MAP } from "@/components/storefront/sections/BuilderSection";
import { BuilderSidebarProps, Section } from "./types";
import { POPULAR_FONTS } from "./constants";
import { SECTION_STRUCTURE_TEMPLATES } from "./templates";
import { sanitizeSections, parseUnitAndValue } from "./utils";
import { RichTextEditor } from "./components/RichTextEditor";
import { DraggableReorderItem } from "./components/DraggableReorderItem";
import { MoveControls } from "./components/MoveControls";
import { UnitControl } from "./components/UnitControl";
import { LibraryPanel } from "./panels/LibraryPanel";
import { EditorPanel } from "./panels/EditorPanel";

// Extract helper components and constants from top_declarations

export default function BuilderSidebar({ state, activeCanvas }: BuilderSidebarProps) {
  console.log("[FRONTEND] BuilderSidebar refactored into modular panels successfully.");
  // Destructuring all variables from state for local usage in UI
  const {
    CLICK_SUPPRESS_MS,
    activeDragId,
    activeDropdown,
    activeEditorTab,
    activeElementId,
    activeLibraryTab,
    activePanel,
    activePopover,
    activeSubFocus,
    addingBlockToId,
    allCustomPages,
    bgBorderRadiusLink,
    bgBorderWidthLink,
    borderRadiusLink,
    borderWidthLink,
    btnBorderRadiusLink,
    btnPaddingLink,
    btnStyleMode,
    categories,
    client,
    closeMediaModal,
    contextMenu,
    copiedElementData,
    copiedSection,
    customPage,
    dragIntentRef,
    dragReleaseTimeoutRef,
    draggedWidgetType,
    editingSection,
    editorCollapse,
    expandedSections,
    findChildrenList,
    future,
    handleAddColumnChild,
    handleAddElement,
    handleAddSection,
    handleCanvasAddElementClick,
    handleContainerClickCapture,
    handleCopyElementCtx,
    handleCopySection,
    handleCustomWidgetClick,
    handleDeleteColumnChild,
    handleDeleteElement,
    handleDeleteElementCtx,
    handleDeleteImage,
    handleDeleteSection,
    handleDragEnd,
    handleDragStart,
    handleDropWidget,
    handleDuplicateElementCtx,
    handleDuplicateSection,
    handleGripPointerDown,
    handleInsertFeaturesTemplate,
    handleInsertHeroTemplate,
    handleMediaSelect,
    handleMediaSelectMultiple,
    handlePasteElementCtx,
    handlePasteSection,
    handlePreview,
    handlePublish,
    handleRedo,
    handleResizeStart,
    handleSave,
    handleSaveElementOrder,
    handleSaveOrder,
    handleSelectStructure,
    handleSvgUpload,
    handleUndo,
    handleUpdateColumnChild,
    handleUpdateElement,
    handleUploadImage,
    handleWidgetClick,
    handleWidgetDragEnd,
    handleWidgetDragStart,
    hasChanges,
    hasInitialized,
    imageResolutionMode,
    initialSections,
    isDraggingRef,
    isDraggingWidget,
    isLeftPanelOpen,
    isLoading,
    isMediaModalOpen,
    isResizing,
    isSaving,
    isStructureModalOpen,
    isUploading,
    lastDragTimeRef,
    loadingPage,
    loadingSections,
    marginLink,
    mediaModalCallback,
    mediaModalInitialSelected,
    mediaModalMaxSelect,
    mediaModalMode,
    mediaModalMultiple,
    moveElement,
    moveInArray,
    moveSection,
    newlyAddedElementId,
    openMediaModal,
    openMediaSvgModal,
    paddingLink,
    pageId,
    panelWidth,
    past,
    prevEditingSectionIdRef,
    previewMode,
    products,
    refreshPage,
    refreshSections,
    renderElementTree,
    router,
    saveHistory,
    searchParams,
    sections,
    setActiveDragId,
    setActiveDropdown,
    setActiveEditorTab,
    setActiveElementId,
    setActiveLibraryTab,
    setActivePanel,
    setActivePopover,
    setActiveSubFocus,
    setAddingBlockToId,
    setBgBorderRadiusLink,
    setBgBorderWidthLink,
    setBorderRadiusLink,
    setBorderWidthLink,
    setBtnBorderRadiusLink,
    setBtnPaddingLink,
    setBtnStyleMode,
    setContextMenu,
    setCopiedElementData,
    setCopiedSection,
    setDraggedWidgetType,
    setEditingSection,
    setEditorCollapse,
    setExpandedSections,
    setFuture,
    setHasChanges,
    setImageResolutionMode,
    setIsDraggingWidget,
    setIsLeftPanelOpen,
    setIsMediaModalOpen,
    setIsSaving,
    setIsStructureModalOpen,
    setIsUploading,
    setMarginLink,
    setMediaModalCallback,
    setMediaModalMode,
    setNewlyAddedElementId,
    setPaddingLink,
    setPanelWidth,
    setPast,
    setPreviewMode,
    setSections,
    setShowImageUrlInput,
    setTempHeight,
    setTempWidth,
    setTheme,
    shouldSuppressClick,
    showConfirm,
    showImageUrlInput,
    showToast,
    swapInArray,
    tempHeight,
    tempWidth,
    theme,
    updateLocalSection
  } = state;

  // ── Floating Navigator Panel state (kanan atas) ──
  const [isFloatingNavigatorOpen, setIsFloatingNavigatorOpen] = useState(false);

  useEffect(() => {
    console.log('[BuilderSidebar] Loaded - card wrappers removed and group spaces & line separators (pt-8 !mt-8) added to Category & Product List editors.');
  }, []);

  // Listen for toggle event dari BuilderSection (tombol Move hijau) — legacy
  useEffect(() => {
    const handler = () => {
      setIsFloatingNavigatorOpen(prev => {
        const next = !prev;
        window.dispatchEvent(new CustomEvent(next ? 'builder:navigatorPanelOpened' : 'builder:navigatorPanelClosed'));
        return next;
      });
    };
    window.addEventListener('builder:toggleNavigatorPanel', handler);
    return () => window.removeEventListener('builder:toggleNavigatorPanel', handler);
  }, []);

  // Listen for openNavigatorPanel — aktifkan element/section lalu buka panel
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const { elementId, sectionId } = detail;
      
      console.log("[Builder Navigator Event Debug] Menerima event builder:openNavigatorPanel dengan detail:", detail);

      let targetSection = null;
      if (sectionId) {
        targetSection = sections.find(s => s.id === sectionId);
      }
      
      // Fallback rekursif jika targetSection belum ditemukan tapi ada elementId
      if (!targetSection && elementId) {
        const findElementRecursively = (elementsList: any[], targetId: string): boolean => {
          for (const el of elementsList) {
            if (el.id === targetId) return true;
            if (el.children && findElementRecursively(el.children, targetId)) return true;
          }
          return false;
        };
        targetSection = sections.find(s => s.elements && findElementRecursively(s.elements, elementId));
      }

      if (targetSection) {
        console.log("[Builder Navigator Event Debug] Berhasil menemukan section. Mengeset editingSection ke:", targetSection.id);
        setEditingSection(targetSection);
      } else {
        console.warn("[Builder Navigator Event Debug] Warning: Tidak menemukan section yang cocok untuk detail:", detail);
      }

      // Aktifkan element jika ada, atau clear jika section
      if (elementId) {
        console.log("[Builder Navigator Event Debug] Mengeset activeElementId ke:", elementId);
        setActiveElementId(elementId);
      } else if (sectionId !== undefined) {
        console.log("[Builder Navigator Event Debug] Mengeset activeElementId ke null karena event fokus ke section");
        setActiveElementId(null);
      }

      // Selalu buka panel (bukan toggle)
      setIsFloatingNavigatorOpen(true);
      window.dispatchEvent(new CustomEvent('builder:navigatorPanelOpened'));
    };
    window.addEventListener('builder:openNavigatorPanel', handler);
    return () => window.removeEventListener('builder:openNavigatorPanel', handler);
  }, [setActiveElementId, setEditingSection, sections]);

  return (
    <>
        <aside
          className={`bg-[#131316] border-r border-zinc-800 flex flex-col shrink-0 transition-[width] duration-300 relative`}
          style={{
            width: isLeftPanelOpen ? `${panelWidth}px` : 0,
            minWidth: isLeftPanelOpen ? '320px' : 0
          }}
        >


          <div className={`${!isLeftPanelOpen ? "opacity-0 invisible pointer-events-none" : "opacity-100"} transition-all duration-300 flex flex-col h-full overflow-hidden`} style={{ width: `${panelWidth}px` }}>
            <AnimatePresence mode="wait">
              
                      {activePanel === 'library' ? (
                        <LibraryPanel state={state} activeCanvas={activeCanvas} isFloatingNavigatorOpen={isFloatingNavigatorOpen} setIsFloatingNavigatorOpen={setIsFloatingNavigatorOpen} />
                      ) : activePanel === 'editor' && editingSection ? (
                        <EditorPanel state={state} isFloatingNavigatorOpen={isFloatingNavigatorOpen} setIsFloatingNavigatorOpen={setIsFloatingNavigatorOpen} />
                      ) : (
                        null
                      )}

            </AnimatePresence>

            {/* Unified Sidebar Footer Panel */}
            <div className="shrink-0 border-t border-zinc-800 bg-[#131316] px-3 py-2 flex items-center justify-between z-30">
              {/* Left spacer to keep center aligned */}
              <div className="w-8 h-8 invisible" />

              {/* Center action: Status/Info (only shown when editor is active) */}
              {activePanel === 'editor' && editingSection ? (
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest animate-in fade-in duration-200">
                  {activeElementId ? 'Elemen Terpilih' : 'Section Terpilih'}
                </span>
              ) : (
                <div className="flex-1" />
              )}

              {/* Right action: Collapse Panel */}
              <button
                type="button"
                onClick={() => {
                  console.log('[Editor] Meng-collapse left panel via bottom button');
                  setIsLeftPanelOpen(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer animate-pulse"
                title="Collapse Panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Resize Handle */}
          {isLeftPanelOpen && (
            <div
              onMouseDown={handleResizeStart}
              className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-[70] group"
            >
              <div className="w-full h-full transition-colors group-hover:bg-blue-500/30 group-active:bg-blue-500/50" />
            </div>
          )}
        </aside>

      {/* ═══ FLOATING NAVIGATOR POSISI PANEL (Kanan Atas) ═══ */}
      <AnimatePresence>
        {isFloatingNavigatorOpen && editingSection && (() => {
          // ── Logic sama persis dengan Navigator Posisi di panel kiri ──
          const findRecursivelyFN = (elements: any[], id: string): any | null => {
            for (const el of elements) {
              if (el.id === id) return el;
              if (el.children) {
                const found = findRecursivelyFN(el.children, id);
                if (found) return found;
              }
            }
            return null;
          };

          const findElementSiblingsFN = (elements: any[], targetId: string, currentParentId: string | null = null): { siblings: any[]; parentId: string | null } | null => {
            const idx = elements.findIndex((el: any) => el.id === targetId);
            if (idx !== -1) return { siblings: [...elements].sort((a: any, b: any) => a.order - b.order), parentId: currentParentId };
            for (const el of elements) {
              if (el.children) {
                const found = findElementSiblingsFN(el.children, targetId, el.id);
                if (found) return found;
              }
            }
            return null;
          };

          const getColsFN = (): number => {
            if (!activeElementId) return 1;
            const res = findElementSiblingsFN(editingSection.elements || [], activeElementId);
            if (!res) return 1;
            const { parentId } = res;
            if (!parentId) {
              const sectLayout = editingSection.config.layout || 'vertical';
              if (sectLayout === 'vertical') return 1;
              return editingSection.config.columns || 3;
            }
            const parentElement = findRecursivelyFN(editingSection.elements || [], parentId);
            if (parentElement?.config) {
              const pLayout = parentElement.config.layout || 'vertical';
              const pContainerLayout = parentElement.config.containerLayout || 'flex';
              if (pLayout !== 'vertical' || pContainerLayout === 'grid') return parentElement.config.columns || 2;
            }
            return 1;
          };

          const cols = getColsFN();
          const isGridFlow = cols > 1;

          let canMoveUp = false, canMoveDown = false, canMoveLeft = false, canMoveRight = false;
          let moveAction: (dir: 'up' | 'down' | 'left' | 'right') => void = () => {};

          if (!activeElementId) {
            const sectionItems = sections.filter((s: any) => s.type === "SECTION").sort((a: any, b: any) => a.order - b.order);
            const idx = sectionItems.findIndex((s: any) => s.id === editingSection.id);
            if (idx !== -1) { canMoveUp = idx > 0; canMoveDown = idx < sectionItems.length - 1; }
            moveAction = (dir) => moveSection(editingSection.id, dir === 'up' ? 'up' : 'down');
          } else {
            const res = findElementSiblingsFN(editingSection.elements || [], activeElementId);
            if (res) {
              const { siblings, parentId } = res;
              const idx = siblings.findIndex((el: any) => el.id === activeElementId);
              const L = siblings.length;
              if (idx !== -1) {
                if (isGridFlow) {
                  const row = Math.floor(idx / cols); const col = idx % cols;
                  canMoveUp = row > 0 && (idx - cols) >= 0;
                  canMoveDown = (idx + cols) < L;
                  canMoveLeft = col > 0 && (idx - 1) >= 0;
                  canMoveRight = col < cols - 1 && (idx + 1) < L;
                } else {
                  canMoveUp = idx > 0; canMoveDown = idx < L - 1;
                }
              }
              moveAction = (dir) => moveElement(editingSection.id, activeElementId, dir, res.parentId, true);
            }
          }

          const posLabel = (() => {
            if (!activeElementId) {
              const sectionItems = sections.filter((s: any) => s.type === "SECTION").sort((a: any, b: any) => a.order - b.order);
              const idx = sectionItems.findIndex((s: any) => s.id === editingSection.id);
              return idx !== -1 ? `${idx + 1}/${sectionItems.length}` : 'SEC';
            } else {
              const res = findElementSiblingsFN(editingSection.elements || [], activeElementId);
              if (res) {
                const idx = res.siblings.findIndex((el: any) => el.id === activeElementId);
                return idx !== -1 ? `${idx + 1}/${res.siblings.length}` : 'EL';
              }
              return 'EL';
            }
          })();

          return (
            <motion.div
              key="floating-navigator"
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 right-4 z-[99999] w-52 bg-[#18181b]/95 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden pointer-events-auto"
              style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.6)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800 bg-[#131316]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center">
                    <Move className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-200">Navigator Posisi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">
                    {activeElementId ? "Elemen" : "Section"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFloatingNavigatorOpen(false);
                      window.dispatchEvent(new CustomEvent('builder:navigatorPanelClosed'));
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                    title="Tutup"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* D-Pad */}
              <div className="flex items-center justify-center py-4 px-3">
                <div className="grid grid-cols-3 gap-1.5 w-36 justify-center items-center">
                  {/* Row 1 */}
                  <div />
                  <button
                    type="button"
                    disabled={!canMoveUp}
                    onClick={() => moveAction("up")}
                    title="Pindahkan Ke Atas"
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${canMoveUp
                      ? 'bg-zinc-800 text-white border border-zinc-700 hover:bg-emerald-700/60 hover:border-emerald-600 hover:scale-105 active:scale-95 shadow-md shadow-black/40'
                      : 'bg-zinc-900/40 text-zinc-700 border border-zinc-900/60 cursor-not-allowed'
                    }`}
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <div />

                  {/* Row 2 */}
                  <button
                    type="button"
                    disabled={!canMoveLeft}
                    onClick={() => moveAction("left")}
                    title="Pindahkan Ke Kiri"
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${canMoveLeft
                      ? 'bg-zinc-800 text-white border border-zinc-700 hover:bg-emerald-700/60 hover:border-emerald-600 hover:scale-105 active:scale-95 shadow-md shadow-black/40'
                      : 'bg-zinc-900/40 text-zinc-700 border border-zinc-900/60 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col items-center justify-center text-[10px] font-black text-zinc-400 bg-zinc-950 border border-emerald-900/40 rounded-xl h-11 w-11 shadow-inner select-none">
                    {posLabel}
                  </div>

                  <button
                    type="button"
                    disabled={!canMoveRight}
                    onClick={() => moveAction("right")}
                    title="Pindahkan Ke Kanan"
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${canMoveRight
                      ? 'bg-zinc-800 text-white border border-zinc-700 hover:bg-emerald-700/60 hover:border-emerald-600 hover:scale-105 active:scale-95 shadow-md shadow-black/40'
                      : 'bg-zinc-900/40 text-zinc-700 border border-zinc-900/60 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Row 3 */}
                  <div />
                  <button
                    type="button"
                    disabled={!canMoveDown}
                    onClick={() => moveAction("down")}
                    title="Pindahkan Ke Bawah"
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${canMoveDown
                      ? 'bg-zinc-800 text-white border border-zinc-700 hover:bg-emerald-700/60 hover:border-emerald-600 hover:scale-105 active:scale-95 shadow-md shadow-black/40'
                      : 'bg-zinc-900/40 text-zinc-700 border border-zinc-900/60 cursor-not-allowed'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <div />
                </div>
              </div>

              {/* Footer hint */}
              <div className="px-3.5 pb-3 text-[8px] text-zinc-600 font-bold text-center leading-relaxed">
                {!activeElementId
                  ? "Section: perpindahan vertikal (Atas/Bawah)"
                  : `Mode: ${isGridFlow ? `GRID (${cols} Kolom)` : "DAFTAR VERTIKAL"}`}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
