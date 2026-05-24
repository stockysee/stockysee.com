// @ts-nocheck

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
  Maximize2, Table, Strikethrough, HelpCircle, Eraser, Quote, Minus, Move, Video
} from "lucide-react";
import { BuilderSidebarProps, Section } from "../types";
import { SectionElement } from "@/components/storefront/sections/BuilderSection";
import { TextStylingGroup } from "./TextStylingGroup";
import { BackgroundStylingGroup } from "./BackgroundStylingGroup";
import { POPULAR_FONTS } from "../constants";
import { SECTION_STRUCTURE_TEMPLATES } from "../templates";
import { sanitizeSections, parseUnitAndValue } from "../utils";
import { RichTextEditor } from "../components/RichTextEditor";
import { renderStyleTabContent } from "./StyleTabContent";
import { DraggableReorderItem } from "../components/DraggableReorderItem";
import { MoveControls } from "../components/MoveControls";
import { UnitControl } from "../components/UnitControl";
import { ELEMENT_TYPE_MAP } from "@/components/storefront/sections/BuilderSection";

export interface EditorPanelProps extends BuilderSidebarProps {
  isFloatingNavigatorOpen: boolean;
  setIsFloatingNavigatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditorPanel(props: EditorPanelProps) {
  const { state, isFloatingNavigatorOpen, setIsFloatingNavigatorOpen } = props;
  const [sectionBgTab, setSectionBgTab] = React.useState<'normal'|'hover'>('normal');
  const [sectionBorderTab, setSectionBorderTab] = React.useState<'normal'|'hover'>('normal');
  const [showSectionShadowEditor, setShowSectionShadowEditor] = React.useState(false);
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

  if (!editingSection) return null;

  return (
    (
                (() => {
                  const findRecursively = (elements: SectionElement[], id: string): SectionElement | null => {
                    for (const el of elements) {
                      if (el.id === id) return el;
                      if (el.children) {
                        const found = findRecursively(el.children, id);
                        if (found) return found;
                      }
                    }
                    return null;
                  };
                  const activeElement = activeElementId ? findRecursively(editingSection.elements || [], activeElementId) : null;

                  return (
                    <motion.div
                      key={`editor-${editingSection.id}-${activeElementId || 'section'}`}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col h-full overflow-hidden bg-[#131316]"
                    >
                      {/* Header Panel Kustom premium gelap pekat */}
                      <div className="px-3 py-2.5 border-b border-zinc-800 bg-[#18181b] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-100 truncate max-w-[200px]">
                            {activeElementId ? (activeElement?.type === 'COLUMN' ? 'Sunting Kontainer' : 'Sunting Elemen') : `Sunting ${editingSection.type}`}
                          </span>
                        </div>

                        {/* Right actions: Back Hirarkis (ArrowLeft), Delete, & Close (X) */}
                        <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                          {/* Tombol Back Hirarkis (ArrowLeft) */}
                          {activeElementId && (
                            <button
                              type="button"
                              onClick={() => {
                                const findParentIdOfElement = (elements: SectionElement[], targetId: string, currentParentId: string | null = null): string | null => {
                                  const idx = elements.findIndex(el => el.id === targetId);
                                  if (idx !== -1) {
                                    return currentParentId;
                                  }
                                  for (const el of elements) {
                                    if (el.children) {
                                      const found = findParentIdOfElement(el.children, targetId, el.id);
                                      if (found) return found;
                                    }
                                  }
                                  return null;
                                };
                                const parentId = findParentIdOfElement(editingSection.elements || [], activeElementId);
                                console.log(`[Navigation] Kembali 1 kelas dari elemen ${activeElementId} ke parent: "${parentId}"`);
                                setActiveElementId(parentId);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer animate-in slide-in-from-left duration-250"
                              title="Class sebelumnya"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Tombol Hapus (sampah) */}
                          {editingSection.id !== 'global-header' && (
                            <button
                              type="button"
                              onClick={() => {
                                const findRecursively = (elements: SectionElement[], id: string): SectionElement | null => {
                                  for (const el of elements) {
                                    if (el.id === id) return el;
                                    if (el.children) {
                                      const found = findRecursively(el.children, id);
                                      if (found) return found;
                                    }
                                  }
                                  return null;
                                };
                                const activeElement = activeElementId ? findRecursively(editingSection.elements || [], activeElementId) : null;
                                if (activeElementId && activeElement) {
                                  console.log('[Editor] Menghapus element via header:', activeElement.id);
                                  handleDeleteElement(editingSection.id, activeElement.id);
                                } else {
                                  console.log('[Editor] Menghapus section via header:', editingSection.id);
                                  handleDeleteSection(editingSection.id);
                                }
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-950/30 text-red-500 border border-red-900/30 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                              title={activeElementId ? "Hapus Elemen" : "Hapus Section"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Tombol Tutup Panel Editor (X) */}
                          <button
                            type="button"
                            onClick={() => {
                              console.log('[Editor] Menutup panel properti kanan via header X');
                              setEditingSection(null);
                              setActiveElementId(null);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
                            title="Tutup Panel Editor"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* STICKY TAB HEADER GLOBAL */}
                      {editingSection && (
                        <div className="sticky top-0 z-20 bg-[#18181b] border-b border-zinc-800 px-3 py-1.5 flex gap-1 shrink-0">
                          {[
                            { id: 'layout', label: (activeElement && activeElement.type !== 'COLUMN') ? 'Konten' : 'Tata Letak', icon: Columns },
                            { id: 'style', label: 'Gaya', icon: Palette },
                            { id: 'advanced', label: 'Lanjutan', icon: Settings2 },
                          ].map((tab) => {
                            const TabIcon = tab.icon;
                            const isTabActive = activeEditorTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  setActiveEditorTab(tab.id as any);
                                  setActiveSubFocus(null);
                                  console.log('[EditorTab] Tab sticky global diubah ke:', tab.id, 'dan activeSubFocus di-reset.');
                                }}
                                className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold uppercase transition-all rounded-lg ${isTabActive
                                  ? 'bg-zinc-900 text-white shadow-sm border border-zinc-800 relative after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-white'
                                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                                  }`}
                              >
                                <TabIcon className="w-3.5 h-3.5" />
                                {tab.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 premium-scrollbar pb-40 bg-[#131316]">
                        {activeElement ? (
                          <div className="space-y-4">
                            {/* TATA LETAK TAB - ELEMEN KECIL */}
                            {activeElement.type !== 'COLUMN' && activeEditorTab === 'layout' && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* HEADING (Title) Editor Konten */}
                                {activeElement.type === 'HEADING' && (
                                  <div className="space-y-4">
                                    {/* Judul Input */}
                                    <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-300 font-semibold">Judul</span>
                                        <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                                      </div>
                                      <textarea
                                        value={activeElement.config.text || ''}
                                        onChange={(e) => {
                                          console.log('[Editor HEADING] Judul diubah');
                                          handleUpdateElement(editingSection.id, activeElement.id, { text: e.target.value });
                                        }}
                                        className="w-full p-2 bg-[#1a1a1f] border border-zinc-800 rounded-[4px] text-xs text-zinc-100 outline-none resize-none font-medium placeholder-zinc-700/60 min-h-[80px]"
                                        placeholder="Tambahkan Teks Tajuk Anda Di Sini"
                                        rows={3}
                                      />
                                    </div>

                                    {/* Tautan Input */}
                                    <div className="flex flex-col gap-1.5">
                                      <span className="text-xs text-zinc-300 font-semibold">Tautan</span>
                                      <input
                                        type="text"
                                        value={activeElement.config.link || ''}
                                        onChange={(e) => {
                                          console.log('[Editor HEADING] Tautan diubah');
                                          handleUpdateElement(editingSection.id, activeElement.id, { link: e.target.value, url: e.target.value });
                                        }}
                                        className="w-full px-2.5 h-8 bg-[#1a1a1f] border border-zinc-800 rounded-[4px] text-xs text-zinc-100 outline-none font-medium placeholder-zinc-700/60"
                                        placeholder="Type or paste your URL"
                                      />
                                    </div>

                                    {/* Tag HTML */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-zinc-300 font-semibold">Tag HTML</span>
                                      <select
                                        value={activeElement.config.tag || 'h2'}
                                        onChange={(e) => {
                                          console.log('[Editor HEADING] Tag HTML diubah ke:', e.target.value);
                                          handleUpdateElement(editingSection.id, activeElement.id, { tag: e.target.value });
                                        }}
                                        className="w-24 px-2 h-8 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none font-semibold cursor-pointer text-center uppercase"
                                      >
                                        <option value="h1">H1</option>
                                        <option value="h2">H2</option>
                                        <option value="h3">H3</option>
                                        <option value="h4">H4</option>
                                        <option value="h5">H5</option>
                                        <option value="h6">H6</option>
                                        <option value="div">div</option>
                                        <option value="span">span</option>
                                        <option value="p">p</option>
                                      </select>
                                    </div>
                                  </div>
                                )}

                                {/* TEXT, BADGE Content Input */}
                                {['TEXT', 'BADGE'].includes(activeElement.type) && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <Type className="w-3 h-3 text-zinc-400" />
                                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">Konten</span>
                                    </div>
                                    {activeElement.type === 'TEXT' ? (
                                      <RichTextEditor
                                        value={activeElement.config.text || ''}
                                        onChange={(val) => {
                                          console.log('[Editor TEXT] RichTextEditor teks diubah');
                                          handleUpdateElement(editingSection.id, activeElement.id, { text: val });
                                        }}
                                      />
                                    ) : (
                                      <input type="text" value={activeElement.config.text || ''} onChange={(e) => {
                                        console.log(`[Editor ${activeElement.type}] Teks diubah`);
                                        handleUpdateElement(editingSection.id, activeElement.id, { text: e.target.value });
                                      }} className="w-full p-3 rounded-xl text-sm border bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none font-bold" />
                                    )}
                                  </div>
                                )}

                                {/* Typography Sizing & Font Family (BADGE) */}
                                {activeElement.type === 'BADGE' && (
                                  <>
                                    <div className="space-y-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">
                                        Ukuran Font: {activeElement.config.fontSize ?? 20}px
                                      </span>
                                      <input
                                        type="range"
                                        min="10"
                                        max="80"
                                        value={activeElement.config.fontSize ?? 20}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          console.log(`[Editor BADGE] Ukuran font diubah ke: ${val}px`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { fontSize: val });
                                        }}
                                        className="w-full accent-blue-600 cursor-pointer"
                                      />
                                    </div>

                                    <div className="space-y-1.5">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">Font Family</span>
                                      <select
                                        value={activeElement.config.fontFamily || 'inherit'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          console.log(`[Editor BADGE] Font family diubah ke: "${val}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { fontFamily: val });
                                        }}
                                        className="w-full p-2.5 rounded-xl text-xs border bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none cursor-pointer premium-scrollbar font-bold"
                                      >
                                        <option value="inherit" className="bg-zinc-950 text-zinc-400">Default System</option>
                                        {POPULAR_FONTS.map((group) => (
                                          <optgroup key={group.category} label={group.category} className="bg-zinc-950 text-zinc-400 font-sans">
                                            {group.fonts.map((f) => (
                                              <option key={f.value} value={f.value} className="bg-zinc-950 text-zinc-100" style={{ fontFamily: f.value }}>
                                                {f.label}
                                              </option>
                                            ))}
                                          </optgroup>
                                        ))}
                                      </select>
                                    </div>
                                  </>
                                )}

                                 {/* Drop Cap, Kolom & Jarak Kolom (TEXT) */}
                                 {activeElement.type === 'TEXT' && (
                                   <div className="space-y-4">
                                     {/* Drop Cap */}
                                     <div className="flex items-center justify-between py-1">
                                       <span className="text-xs text-zinc-300 font-semibold">Drop Cap</span>
                                       <div className="flex items-center gap-2">
                                         <button
                                           type="button"
                                           onClick={() => {
                                             const current = activeElement.config.dropCap || false;
                                             console.log(`[Editor TEXT] Drop Cap diubah ke:`, !current);
                                             handleUpdateElement(editingSection.id, activeElement.id, { dropCap: !current });
                                           }}
                                           className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-zinc-800 transition-colors duration-250 ease-in-out focus:outline-none p-0.5 ${
                                             activeElement.config.dropCap ? 'bg-blue-600' : 'bg-zinc-900'
                                           }`}
                                         >
                                           <span
                                             className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white transition duration-250 ease-in-out ${
                                               activeElement.config.dropCap ? 'translate-x-5' : 'translate-x-0'
                                             }`}
                                           />
                                         </button>
                                         <span className="text-xs text-zinc-400 font-bold min-w-[55px]">
                                           {activeElement.config.dropCap ? 'Aktif' : 'Nonaktif'}
                                         </span>
                                       </div>
                                     </div>

                                     {/* Divider */}
                                     <div className="border-t border-zinc-800/80 my-1" />

                                     {/* Kolom */}
                                     <div className="flex items-center justify-between py-1">
                                       <div className="flex items-center gap-1.5">
                                         <span className="text-xs text-zinc-300 font-semibold">Kolom</span>
                                         <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                       </div>
                                       <select
                                         value={activeElement.config.columns || '1'}
                                         onChange={(e) => {
                                           const val = e.target.value;
                                           console.log(`[Editor TEXT] Kolom diubah ke: "${val}"`);
                                           handleUpdateElement(editingSection.id, activeElement.id, { columns: val });
                                         }}
                                         className="w-48 px-2.5 h-8 rounded-[4px] text-xs bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none font-bold"
                                       >
                                         <option value="1">Asali</option>
                                         <option value="2">2 Kolom</option>
                                         <option value="3">3 Kolom</option>
                                         <option value="4">4 Kolom</option>
                                       </select>
                                     </div>

                                     {/* Jarak Kolom */}
                                     <div className="space-y-2 py-1">
                                       <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-1.5">
                                           <span className="text-xs text-zinc-300 font-semibold">Jarak Kolom</span>
                                           <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                         </div>
                                         
                                         {/* Unit Selector */}
                                         <div className="relative flex items-center pr-1.5">
                                           <select
                                             value={parseUnitAndValue(activeElement.config.columnGap ?? '24px').unit}
                                             onChange={(e) => {
                                               const newUnit = e.target.value;
                                               const currentVal = parseUnitAndValue(activeElement.config.columnGap ?? '24px').val;
                                               const finalVal = `${currentVal}${newUnit}`;
                                               console.log(`[Editor TEXT] Unit Jarak Kolom diubah ke: ${newUnit}`);
                                               handleUpdateElement(editingSection.id, activeElement.id, { columnGap: finalVal });
                                             }}
                                             className="text-[10px] bg-transparent border-0 outline-none text-zinc-400 font-bold pr-3 cursor-pointer appearance-none text-right focus:ring-0"
                                           >
                                             <option value="px" className="bg-[#1a1a1f] text-zinc-300">px</option>
                                             <option value="em" className="bg-[#1a1a1f] text-zinc-300">em</option>
                                             <option value="rem" className="bg-[#1a1a1f] text-zinc-300">rem</option>
                                             <option value="%" className="bg-[#1a1a1f] text-zinc-300">%</option>
                                           </select>
                                           <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                                         </div>
                                       </div>
                                       
                                       {/* Slider & Input Row */}
                                       <div className="flex items-center gap-3">
                                         <input
                                           type="range"
                                           min="0"
                                           max={parseUnitAndValue(activeElement.config.columnGap ?? '24px').unit === 'px' ? 100 : 10}
                                           step={parseUnitAndValue(activeElement.config.columnGap ?? '24px').unit === 'px' ? 1 : 0.1}
                                           value={parseUnitAndValue(activeElement.config.columnGap ?? '24px').val}
                                           onChange={(e) => {
                                             const val = Number(e.target.value);
                                             const unit = parseUnitAndValue(activeElement.config.columnGap ?? '24px').unit;
                                             console.log(`[Editor TEXT] Jarak Kolom diubah ke: ${val}${unit}`);
                                             handleUpdateElement(editingSection.id, activeElement.id, { columnGap: `${val}${unit}` });
                                           }}
                                           className="flex-1 accent-blue-600 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                         />
                                         <input
                                           type="text"
                                           value={parseUnitAndValue(activeElement.config.columnGap ?? '24px').val}
                                           onChange={(e) => {
                                             const val = e.target.value.replace(/[^0-9.]/g, '');
                                             const unit = parseUnitAndValue(activeElement.config.columnGap ?? '24px').unit;
                                             console.log(`[Editor TEXT] Input Jarak Kolom diubah ke: ${val}${unit}`);
                                             handleUpdateElement(editingSection.id, activeElement.id, { columnGap: `${val}${unit}` });
                                           }}
                                           className="w-16 h-8 text-center text-xs font-bold bg-[#1a1a1f] text-zinc-150 border border-zinc-800 rounded focus:border-zinc-700 outline-none"
                                         />
                                       </div>
                                     </div>
                                   </div>
                                 )}

                                {/* Perataan Teks/Element (Non-BUTTON, Non-IMAGE, Non-HEADING) */}
                                {activeElement.config.align !== undefined && activeElement.type !== 'BUTTON' && activeElement.type !== 'CART' && activeElement.type !== 'IMAGE' && activeElement.type !== 'HEADING' && (
                                  <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">Alignment</span>
                                    <div className="flex gap-2">
                                      {['left', 'center', 'right'].map(a => (
                                        <button key={a} type="button" onClick={() => {
                                          console.log(`[Editor ${activeElement.type}] Alignment diubah ke: ${a}`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { align: a });
                                        }}
                                          className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${activeElement.config.align === a ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-900'}`}
                                        >{a === 'left' ? 'Kiri' : a === 'center' ? 'Tengah' : 'Kanan'}</button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* BUTTON Tata Letak */}
                                {activeElement.type === 'BUTTON' && (
                                  <div className="space-y-4 text-zinc-300">
                                    
                                    {/* Baris Jenis */}
                                    <div className="flex items-center justify-between gap-3 min-h-[36px]">
                                      <span className="text-xs font-semibold text-zinc-300">Jenis</span>
                                      <select
                                        value={activeElement.config.buttonType || 'Asali'}
                                        onChange={(e) => {
                                          console.log(`[Editor BUTTON Debug] Jenis tombol diubah ke: "${e.target.value}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { buttonType: e.target.value });
                                        }}
                                        className="w-[180px] p-2 bg-zinc-950/80 border border-zinc-800 text-white rounded-lg outline-none cursor-pointer text-xs focus:border-zinc-700"
                                      >
                                        <option value="Asali">Asali</option>
                                        <option value="database">Database Bind</option>
                                        <option value="whatsapp">WhatsApp Checkout</option>
                                      </select>
                                    </div>

                                    {/* Baris Teks */}
                                    <div className="flex items-center justify-between gap-3 min-h-[36px]">
                                      <span className="flex items-center gap-1 text-xs font-semibold text-zinc-300">
                                        Teks <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                                      </span>
                                      <input
                                        type="text"
                                        value={activeElement.config.text || ''}
                                        onChange={(e) => {
                                          console.log(`[Editor BUTTON Debug] Teks tombol diubah ke: "${e.target.value}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { text: e.target.value });
                                        }}
                                        placeholder="Klik di sini"
                                        className="w-[180px] p-2 bg-zinc-950/80 border border-zinc-800 text-white rounded-lg outline-none text-xs focus:border-zinc-700"
                                      />
                                    </div>

                                    {/* Baris Tautan */}
                                    <div className="space-y-1.5">
                                      <span className="text-xs font-semibold text-zinc-300">Tautan</span>
                                      <input
                                        type="text"
                                        value={activeElement.config.url || activeElement.config.link || ''}
                                        onChange={(e) => {
                                          console.log(`[Editor BUTTON Debug] Tautan diubah ke: "${e.target.value}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { url: e.target.value, link: e.target.value });
                                        }}
                                        placeholder="Type or paste your URL"
                                        className="w-full p-2 bg-zinc-950/80 border border-zinc-800 text-white rounded-lg outline-none text-xs focus:border-zinc-700"
                                      />
                                    </div>

                                    {/* Baris Ikon */}
                                    <div className="flex items-center justify-between gap-3 min-h-[36px]">
                                      <span className="text-xs font-semibold text-zinc-300">Ikon</span>
                                      <div className="flex items-center gap-1.5">
                                        {/* Segmented Control */}
                                        <div className="flex border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/80">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              console.log('[Editor BUTTON Debug] Ikon dinonaktifkan');
                                              handleUpdateElement(editingSection.id, activeElement.id, { iconType: 'none', customIconSvg: '', icon: '' });
                                            }}
                                            className={`p-2 transition-all ${
                                              (activeElement.config.iconType || 'none') === 'none'
                                                ? 'bg-zinc-800 text-white'
                                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                            }`}
                                          >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                              <circle cx="12" cy="12" r="10" />
                                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                            </svg>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              console.log('[Editor BUTTON Debug] Membuka Media Library mode SVG untuk ikon custom');
                                              handleUpdateElement(editingSection.id, activeElement.id, { iconType: 'custom' });

                                              openMediaSvgModal((svgXml: string) => {
                                                console.log('[Editor BUTTON Debug] SVG XML terpilih dari media library');
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  customIconSvg: svgXml,
                                                  icon: svgXml,
                                                  iconType: 'custom'
                                                });
                                              });
                                            }}
                                            className={`p-2 border-l border-zinc-800 transition-all ${
                                              activeElement.config.iconType === 'custom'
                                                ? 'bg-zinc-800 text-white'
                                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                            }`}
                                          >
                                            <Upload className="w-3.5 h-3.5" />
                                          </button>
                                        </div>

                                        {/* Preview Ikon SVG */}
                                        {(activeElement.config.customIconSvg || activeElement.config.icon) && (
                                          <div className="flex items-center justify-center p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 w-8 h-8 shrink-0">
                                            <img
                                              src={activeElement.config.customIconSvg || activeElement.config.icon}
                                              alt="icon preview"
className="w-4 h-4 object-contain"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Baris Posisi Ikon */}
                                    <div className="flex items-center justify-between gap-3 min-h-[36px]">
                                      <span className="text-xs font-semibold text-zinc-300">Posisi Ikon</span>
                                      <div className="flex border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/80">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            console.log('[Editor BUTTON Debug] Posisi ikon diset ke Sebelum Teks');
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconPosition: 'before' });
                                          }}
                                          className={`p-2 transition-all ${
                                            (activeElement.config.iconPosition || 'before') === 'before'
                                              ? 'bg-zinc-800 text-white'
                                              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="4" y1="4" x2="4" y2="20" />
                                            <path d="M20 12H8" />
                                            <path d="M12 8l-4 4 4 4" />
                                          </svg>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            console.log('[Editor BUTTON Debug] Posisi ikon diset ke Sesudah Teks');
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconPosition: 'after' });
                                          }}
                                          className={`p-2 border-l border-zinc-800 transition-all ${
                                            activeElement.config.iconPosition === 'after'
                                              ? 'bg-zinc-800 text-white'
                                              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="20" y1="4" x2="20" y2="20" />
                                            <path d="M4 12h12" />
                                            <path d="M12 8l4 4-4 4" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>

                                    {/* Baris Spasi Ikon */}
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-zinc-300">Spasi Ikon</span>
                                        <select
                                          value={activeElement.config.iconSpaceUnit || 'px'}
                                          onChange={(e) => {
                                            console.log(`[Editor BUTTON Debug] Unit spasi ikon diubah ke: "${e.target.value}"`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconSpaceUnit: e.target.value });
                                          }}
                                          className="bg-transparent text-[10px] text-zinc-500 border-none outline-none cursor-pointer font-bold focus:ring-0"
                                        >
                                          <option value="px" className="bg-zinc-950 text-zinc-300">px</option>
                                          <option value="rem" className="bg-zinc-950 text-zinc-300">rem</option>
                                        </select>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <input
                                          type="range"
                                          min="0"
                                          max="40"
                                          value={activeElement.config.iconSpacing ?? 4}
                                          onChange={(e) => {
                                            console.log(`[Editor BUTTON Debug] Spasi ikon diubah ke: ${e.target.value}`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconSpacing: Number(e.target.value) });
                                          }}
                                          className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                        />
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={activeElement.config.iconSpacing ?? 4}
                                          onChange={(e) => {
                                            console.log(`[Editor BUTTON Debug] Input manual spasi ikon diubah ke: ${e.target.value}`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconSpacing: Number(e.target.value) });
                                          }}
                                          className="w-[60px] p-1.5 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded-lg outline-none text-xs font-bold"
                                        />
                                      </div>
                                    </div>

                                    {/* Baris Warna Ikon */}
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-zinc-300 font-semibold">Warna Ikon</span>
                                      <div className="flex items-center gap-1">
                                        {activeElement.config.iconColor && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              console.log(`[Editor BUTTON Debug] Warna ikon direset`);
                                              handleUpdateElement(editingSection.id, activeElement.id, { iconColor: undefined });
                                            }}
                                            className="p-1 rounded hover:bg-zinc-800 transition-colors"
                                            title="Reset Warna Ikon"
                                          >
                                            <RotateCcw className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                                          </button>
                                        )}
                                        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-7">
                                          <div className="relative w-8 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
                                            {activeElement.config.iconColor ? (
                                              <div className="w-full h-full rounded-md border border-zinc-800/80" style={{ backgroundColor: activeElement.config.iconColor }} />
                                            ) : (
                                              <div className="w-full h-full rounded-md border border-zinc-800/80 relative overflow-hidden bg-zinc-950">
                                                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, transparent 47%, #ef4444 47%, #ef4444 53%, transparent 53%)' }} />
                                              </div>
                                            )}
                                            <input
                                              type="color"
                                              value={activeElement.config.iconColor || '#ffffff'}
                                              onChange={(e) => {
                                                console.log(`[Editor BUTTON Debug] Warna ikon diubah ke: ${e.target.value}`);
                                                handleUpdateElement(editingSection.id, activeElement.id, { iconColor: e.target.value });
                                              }}
                                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Baris Ukuran Ikon */}
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Ukuran Ikon: {activeElement.config.iconSize || 20}px</span>
                                      <div className="flex items-center gap-3">
                                        <input
                                          type="range"
                                          min="8"
                                          max="64"
                                          value={activeElement.config.iconSize || 20}
                                          onChange={(e) => {
                                            console.log(`[Editor BUTTON Debug] Ukuran ikon diubah ke: ${e.target.value}px`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconSize: Number(e.target.value) });
                                          }}
                                          className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                        />
                                        <input
                                          type="number"
                                          min="8"
                                          max="128"
                                          value={activeElement.config.iconSize || 20}
                                          onChange={(e) => {
                                            console.log(`[Editor BUTTON Debug] Input manual ukuran ikon diubah ke: ${e.target.value}px`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconSize: Number(e.target.value) });
                                          }}
                                          className="w-[60px] p-1.5 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded-lg outline-none text-xs font-bold"
                                        />
                                      </div>
                                    </div>

                                    {/* Baris ID Tombol */}
                                    <div className="flex items-center justify-between gap-3 min-h-[36px]">
                                      <span className="text-xs font-semibold text-zinc-300">ID Tombol</span>
                                      <input
                                        type="text"
                                        value={activeElement.config.elementId || ''}
                                        onChange={(e) => {
                                          console.log(`[Editor BUTTON Debug] ID Tombol diubah ke: "${e.target.value}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { elementId: e.target.value });
                                        }}
                                        placeholder="button_id"
                                        className="w-[180px] p-2 bg-zinc-950/80 border border-zinc-800 text-white rounded-lg outline-none text-xs focus:border-zinc-700"
                                      />
                                    </div>
                                    <p className="text-[10px] text-zinc-500 italic mt-1 leading-normal">
                                      Please make sure the ID is unique and not used elsewhere on the page. This field allows A-z 0-9 & underscore chars without spaces.
                                    </p>
                                  </div>
                                )}

                                {/* IMAGE Konten Tab */}
                                {activeElement.type === 'IMAGE' && (
                                  <div className="space-y-5">
                                    {/* Pilih Gambar */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-300 font-semibold">Pilih Gambar</span>
                                        <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                                      </div>
                                      <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-zinc-800/80 bg-[#1a1a1f] transition-all group">
                                        <input
                                          type="file"
                                          id="hidden-file-input"
                                          accept="image/*"
                                          className="hidden"
                                          disabled={isUploading}
                                          onChange={async (e) => {
                                            const f = e.target.files?.[0]; if (!f) return;
                                            console.log("[Editor IMAGE] Mulai mengunggah gambar...");
                                            const url = await handleUploadImage(f);
                                            if (url) {
                                              console.log("[Editor IMAGE] Unggah berhasil, URL:", url);
                                              handleUpdateElement(editingSection.id, activeElement.id, { url });
                                            }
                                            e.target.value = '';
                                          }}
                                        />
                                        <img
                                          src={activeElement.config.url || '/placeholder-gambar.png'}
                                          alt="Pilih Gambar"
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Hover Overlay Layer Hitam di Bagian Bawah */}
                                        <div className="absolute inset-x-0 bottom-0 bg-black/85 border-t border-zinc-850 p-2 opacity-0 group-hover:opacity-100 flex items-center justify-between transition-all duration-200 z-20">
                                          {isUploading ? (
                                            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
                                              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                                              <span>Uploading...</span>
                                            </div>
                                          ) : (
                                            <>
                                              {/* Kiri: Buka media & Upload */}
                                              <div className="flex items-center gap-1.5">
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log("[Editor IMAGE] Buka Media diklik, membuka modal media");
                                                    openMediaModal((url) => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { url });
                                                    }, "image");
                                                  }}
                                                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                >
                                                  <ImageIcon className="w-3 h-3 text-zinc-400" />
                                                  <span>Buka media</span>
                                                </button>

                                                <label
                                                  htmlFor="hidden-file-input"
                                                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                >
                                                  <Upload className="w-3 h-3 text-zinc-400" />
                                                  <span>Upload</span>
                                                </label>
                                              </div>

                                              {/* Kanan: Icon Link */}
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  console.log("[Editor IMAGE] Toggle input URL gambar:", !showImageUrlInput);
                                                  setShowImageUrlInput(!showImageUrlInput);
                                                }}
                                                className={`p-1.5 rounded-md border transition-all cursor-pointer ${showImageUrlInput ? 'bg-blue-600 border-blue-750 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-white'}`}
                                                title="Input URL Gambar"
                                              >
                                                <LinkIcon className="w-3 h-3" />
                                              </button>
                                            </>
                                          )}
                                        </div>
                                        {activeElement.config.url && (
                                          <button
                                            type="button"
                                            onClick={async (e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              console.log("[Editor IMAGE] Hapus gambar:", activeElement.config.url);
                                              await handleDeleteImage(activeElement.config.url);
                                              handleUpdateElement(editingSection.id, activeElement.id, { url: '' });
                                            }}
                                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
                                            title="Hapus gambar"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>

                                      {/* Kolom URL Gambar di bawahnya */}
                                      {showImageUrlInput && (
                                        <div className="mt-2 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">URL Gambar</span>
                                          </div>
                                          <input
                                            type="text"
                                            value={activeElement.config.url || ''}
                                            onChange={(e) => {
                                              console.log("[Editor IMAGE] URL gambar di-update via kolom input:", e.target.value);
                                              handleUpdateElement(editingSection.id, activeElement.id, { url: e.target.value });
                                            }}
                                            placeholder="https://example.com/gambar.png"
                                            className="w-full px-3 py-2 rounded-md text-xs bg-[#1a1a1f] border border-zinc-800/80 text-zinc-100 focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-600/60 focus:ring-1 focus:ring-zinc-700 font-semibold"
                                          />
                                        </div>
                                      )}
                                    </div>



                                    {/* Image Resolution */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-300 font-semibold">Image Resolution</span>
                                        <select
                                          value={imageResolutionMode}
                                          onChange={(e) => {
                                            const mode = e.target.value as "auto" | "custom";
                                            console.log("[Editor IMAGE] Image Resolution mode diubah ke:", mode);
                                            setImageResolutionMode(mode);
                                            if (mode === 'auto') {
                                              handleUpdateElement(editingSection.id, activeElement.id, { width: 'auto', height: 'auto' });
                                            }
                                          }}
                                          className="px-2 py-1 rounded-md text-xs bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold focus:border-zinc-700 transition-all"
                                        >
                                          <option value="auto">Auto</option>
                                          <option value="custom">Khusus</option>
                                        </select>
                                      </div>

                                      {imageResolutionMode === 'custom' && (
                                        <div className="space-y-2.5 animate-in fade-in duration-200">
                                          <p className="text-[11px] text-zinc-400 italic leading-relaxed">
                                            Anda dapat memangkas ukuran gambar asli ke sebarang ukuran. Anda juga dapat mengatur nilai untuk tinggi atau lebar dalam rangka menyesuaikan dengan rasio ukuran asli.
                                          </p>

                                          <div className="flex items-start gap-2.5">
                                            <div className="flex flex-col items-center gap-1">
                                              <input
                                                type="text"
                                                value={tempWidth}
                                                onChange={(e) => setTempWidth(e.target.value)}
                                                className="w-14 h-7 text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded-md font-bold"
                                              />
                                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Lebar</span>
                                            </div>

                                            <span className="text-zinc-500 text-xs font-bold pt-1.5 font-mono">x</span>

                                            <div className="flex flex-col items-center gap-1">
                                              <input
                                                type="text"
                                                value={tempHeight}
                                                onChange={(e) => setTempHeight(e.target.value)}
                                                className="w-14 h-7 text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded-md font-bold"
                                              />
                                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Tinggi</span>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                console.log("[Editor IMAGE] Terapkan dimensi kustom:", tempWidth, tempHeight);
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  width: tempWidth || 'auto',
                                                  height: tempHeight || 'auto'
                                                });
                                              }}
                                              className="h-7 px-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-100 rounded-md text-[10px] font-bold transition-all border border-zinc-700 cursor-pointer ml-auto"
                                            >
                                              Terapkan
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Garis Pemisah Minimalis */}
                                    <div className="h-px bg-zinc-800/80 my-3" />

                                    {/* Link Direct pada Gambar */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-300 font-semibold">Tautan Langsung Gambar</span>
                                        <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                                      </div>
                                      <input
                                        type="text"
                                        value={activeElement.config.linkDirect || ''}
                                        onChange={(e) => {
                                          console.log("[Editor IMAGE] Tautan langsung gambar diperbarui ke:", e.target.value);
                                          handleUpdateElement(editingSection.id, activeElement.id, { linkDirect: e.target.value });
                                        }}
                                        placeholder="https://example.com/halaman-tujuan"
                                        className="w-full px-3 py-2 rounded-md text-xs bg-[#1a1a1f] border border-zinc-850 text-zinc-100 focus:border-zinc-700 outline-none font-bold transition-all placeholder:text-zinc-600/60 focus:ring-1 focus:ring-zinc-700"
                                      />
                                    </div>
                                  </div>
                                )}

                                {activeElement.type === 'SPACER' && (
                                  <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">Tinggi: {activeElement.config.height || 32}px</span>
                                    <input type="range" min="8" max="200" value={activeElement.config.height || 32} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { height: Number(e.target.value) })} className="w-full accent-blue-600 cursor-pointer" />
                                  </div>
                                )}

                                {/* DIVIDER */}
                                {activeElement.type === 'DIVIDER' && (
                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-400">Ketebalan: {activeElement.config.thickness || 1}px</span>
                                      <input type="range" min="1" max="8" value={activeElement.config.thickness || 1} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { thickness: Number(e.target.value) })} className="w-full accent-blue-600 cursor-pointer" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-400">Style</span>
                                      <div className="flex gap-1">
                                        {['solid', 'dashed', 'dotted'].map(s => (
                                          <button key={s} type="button" onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { style: s })}
                                            className={`flex-1 py-1.5 rounded-lg text-[8px] font-bold uppercase transition-all ${(activeElement.config.style || 'solid') === s ? 'bg-blue-600 text-white shadow-sm border-transparent' : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-900'}`}
                                          >{s === 'solid' ? 'Garis' : s === 'dashed' ? 'Putus' : 'Titik'}</button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* GALLERY */}
                                {activeElement.type === 'GALLERY' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">

                                    {/* Gambar Management */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-300 font-semibold">Gambar ({(activeElement.config.images || []).length}/10)</span>
                                      </div>
                                      
                                      {/* Thumbnail Grid Gallery */}
                                      <div className="flex flex-wrap gap-1.5">
                                        {(activeElement.config.images || []).map((url: string, i: number) => (
                                          <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-[#1a1a1f] group/thumb">
                                            {url ? (
                                              <img src={url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-zinc-600" /></div>
                                            )}
                                            <button type="button" onClick={() => { const imgs = [...(activeElement.config.images || [])]; imgs.splice(i, 1); handleUpdateElement(editingSection.id, activeElement.id, { images: imgs }); }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all cursor-pointer">
                                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                            </button>
                                          </div>
                                        ))}
                                        {(activeElement.config.images || []).length < 10 && (
                                          <div className="w-14 h-14 rounded-lg border border-dashed border-zinc-700 bg-[#1a1a1f] flex items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900 transition-all" onClick={() => { const currentImgs = activeElement.config.images || []; openMediaModal(() => {}, "image", true, 10, currentImgs, (urls) => { handleUpdateElement(editingSection.id, activeElement.id, { images: urls.slice(0, 10) }); }); }}>
                                            <Plus className="w-4 h-4 text-zinc-500" />
                                          </div>
                                        )}
                                      </div>

                                      {/* Pustaka & Upload Gambar */}
                                      {(activeElement.config.images || []).length < 10 && (
                                        <div className="flex gap-1.5 mt-1.5">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const currentImgs = activeElement.config.images || [];
                                              openMediaModal(
                                                () => {}, 
                                                "image",
                                                true, 
                                                10, 
                                                currentImgs, 
                                                (urls) => {
                                                  handleUpdateElement(editingSection.id, activeElement.id, { images: urls.slice(0, 10) });
                                                }
                                              );
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all text-[11px] font-bold bg-[#1d1d22] border border-zinc-800 text-zinc-300 hover:bg-[#25252b] hover:text-white"
                                          >
                                            <Folder className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>Pustaka Media</span>
                                          </button>

                                          <label className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded cursor-pointer transition-all text-[11px] font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 shadow-sm ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                            <span>{isUploading ? 'Mengupload...' : 'Upload'}</span>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              multiple
                                              className="hidden"
                                              disabled={isUploading}
                                              onChange={async (e) => {
                                                const files = e.target.files;
                                                if (!files || files.length === 0) return;
                                                const currentImages = activeElement.config.images || [];
                                                const slotsAvailable = 10 - currentImages.length;
                                                const filesToUpload = Array.from(files).slice(0, slotsAvailable);
                                                
                                                console.log('[Editor GALLERY] Memulai batch upload:', filesToUpload.length, 'gambar');
                                                setIsUploading(true);
                                                
                                                try {
                                                  const uploadPromises = filesToUpload.map(f => handleUploadImage(f));
                                                  const results = await Promise.all(uploadPromises);
                                                  const successUrls = results.filter(Boolean) as string[];
                                                  
                                                  if (successUrls.length > 0) {
                                                    handleUpdateElement(editingSection.id, activeElement.id, {
                                                      images: [...currentImages, ...successUrls]
                                                    });
                                                    console.log('[Editor GALLERY] Batch upload sukses. Jumlah berhasil:', successUrls.length);
                                                  }
                                                } catch (err) {
                                                  console.error('[Editor GALLERY] Batch upload error:', err);
                                                } finally {
                                                  setIsUploading(false);
                                                }
                                                
                                                e.target.value = '';
                                              }}
                                            />
                                          </label>
                                        </div>
                                      )}

                                      {(activeElement.config.images || []).length >= 10 && (
                                        <p className="text-[9px] text-amber-400/80 italic text-center">Maksimum 10 gambar tercapai</p>
                                      )}
                                    </div>

                                    <div className="h-px bg-zinc-800/80 my-1" />

                                    {/* Kolom */}
                                    <div className="space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-300 font-semibold">Kolom</span>
                                        <select
                                          value={activeElement.config.columns || 3}
                                          onChange={(e) => {
                                            const cols = Number(e.target.value);
                                            console.log('[Editor GALLERY] Kolom diubah ke:', cols);
                                            handleUpdateElement(editingSection.id, activeElement.id, { columns: cols, gridLayout: 'auto' });
                                          }}
                                          className="px-2 py-1 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-medium focus:border-zinc-700 min-w-[80px]"
                                        >
                                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <option key={n} value={n}>{n}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    {/* Grid Layout (muncul jika kolom >= 4) */}
                                    {(activeElement.config.columns || 3) >= 4 && (
                                      <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-zinc-300 font-semibold">Grid Layout</span>
                                          <select
                                            value={activeElement.config.gridLayout || 'auto'}
                                            onChange={(e) => {
                                              const layout = e.target.value;
                                              console.log('[Editor GALLERY] Grid Layout diubah ke:', layout);
                                              handleUpdateElement(editingSection.id, activeElement.id, { gridLayout: layout });
                                            }}
                                            className="px-2 py-1 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-medium focus:border-zinc-700 min-w-[100px]"
                                          >
                                            <option value="auto">Auto</option>
                                            {(() => {
                                              const cols = activeElement.config.columns || 3;
                                              const layouts: string[] = [];
                                              for (let c = 2; c <= Math.min(cols, 6); c++) {
                                                for (let r = 2; r <= Math.min(Math.ceil(cols / c) + 1, 5); r++) {
                                                  if (c * r >= cols && !layouts.includes(`${c}x${r}`)) {
                                                    layouts.push(`${c}x${r}`);
                                                  }
                                                }
                                              }
                                              return layouts.map(l => <option key={l} value={l}>{l}</option>);
                                            })()}
                                          </select>
                                        </div>
                                      </div>
                                    )}

                                    <div className="h-px bg-zinc-800/80 my-1" />

                                    {/* Image Resolution */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-300 font-semibold">Image Resolution</span>
                                        <select
                                          value={activeElement.config.resolutionMode || 'auto'}
                                          onChange={(e) => {
                                            const mode = e.target.value;
                                            console.log('[Editor GALLERY] Resolution Mode diubah ke:', mode);
                                            handleUpdateElement(editingSection.id, activeElement.id, { resolutionMode: mode });
                                          }}
                                          className="px-2 py-1 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-medium focus:border-zinc-700 min-w-[100px]"
                                        >
                                          <option value="auto">Auto</option>
                                          <option value="khusus">Khusus</option>
                                        </select>
                                      </div>

                                      {activeElement.config.resolutionMode === 'khusus' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                          <div className="flex gap-2">
                                            <div className="flex-1">
                                              <label className="text-[9px] font-bold uppercase text-zinc-500 mb-1 block">Lebar</label>
                                              <div className="flex items-center gap-1">
                                                <input
                                                  type="number"
                                                  min="50"
                                                  max="2000"
                                                  value={activeElement.config.imageWidth || 400}
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { imageWidth: Number(e.target.value) })}
                                                  className="w-full h-7 text-xs bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded font-bold"
                                                />
                                                <span className="text-[9px] text-zinc-500 font-bold">px</span>
                                              </div>
                                            </div>
                                            <div className="flex-1">
                                              <label className="text-[9px] font-bold uppercase text-zinc-500 mb-1 block">Tinggi</label>
                                              <div className="flex items-center gap-1">
                                                <input
                                                  type="number"
                                                  min="50"
                                                  max="2000"
                                                  value={activeElement.config.imageHeight || 300}
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { imageHeight: Number(e.target.value) })}
                                                  className="w-full h-7 text-xs bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded font-bold"
                                                />
                                                <span className="text-[9px] text-zinc-500 font-bold">px</span>
                                              </div>
                                            </div>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              console.log('[Editor GALLERY] Resolusi Khusus diterapkan:', activeElement.config.imageWidth, 'x', activeElement.config.imageHeight);
                                            }}
                                            className="w-full py-1.5 rounded text-[10px] font-bold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-700/40 transition-all"
                                          >
                                            ✓ Terapkan
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* COLUMN editor */}
                            {activeElement.type === 'COLUMN' && (
                              <div className="space-y-4">
                                {/* TAB CONTENT */}
                                <div className="space-y-4 pt-1">
                                  {activeEditorTab === 'layout' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                      {/* Accordion: Kontainer */}
                                      <div className="space-y-3">
                                        <button
                                          type="button"
                                          onClick={() => setEditorCollapse(prev => ({ ...prev, kontainer: !prev.kontainer }))}
                                          className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                        >
                                          {editorCollapse.kontainer ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span>Kontainer</span>
                                        </button>

                                        {editorCollapse.kontainer && (
                                          <div className="space-y-3.5 animate-in fade-in duration-200">
                                            {/* Container Layout */}
                                            <div className="flex justify-between items-center py-1">
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Container Layout</span>
                                              <select
                                                value={activeElement.config.containerLayout || 'flex'}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { containerLayout: e.target.value })}
                                                className="w-36 p-1.5 rounded text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 font-medium focus:border-zinc-700 outline-none"
                                              >
                                                <option value="flex">Flexbox</option>
                                                <option value="grid">Grid</option>
                                              </select>
                                            </div>

                                            {/* Lebar Konten */}
                                            <div className="flex justify-between items-center py-1">
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Lebar Konten</span>
                                              <select
                                                value={activeElement.config.contentWidth || 'boxed'}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { contentWidth: e.target.value })}
                                                className="w-36 p-1.5 rounded text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 font-medium focus:border-zinc-700 outline-none"
                                              >
                                                <option value="boxed">Dalam kotak</option>
                                                <option value="full">Lebar penuh</option>
                                              </select>
                                            </div>

                                            {/* Lebar Slider */}
                                            <UnitControl
                                              label="Lebar"
                                              value={activeElement.config.width ?? 1000}
                                              onChange={(val) => handleUpdateElement(editingSection.id, activeElement.id, { width: val })}
                                              min={200}
                                              max={1600}
                                              fieldKey="colWidth"
                                              activeDropdown={activeDropdown}
                                              setActiveDropdown={setActiveDropdown}
                                              elementId={activeElement.id}
                                            />

                                            {/* Tinggi Minimal */}
                                            <UnitControl
                                              label="Tinggi Minimal"
                                              value={activeElement.config.minHeight ?? 0}
                                              onChange={(val) => handleUpdateElement(editingSection.id, activeElement.id, { minHeight: val })}
                                              min={0}
                                              max={1000}
                                              fieldKey="colMinHeight"
                                              activeDropdown={activeDropdown}
                                              setActiveDropdown={setActiveDropdown}
                                              elementId={activeElement.id}
                                            />
                                            <p className="text-[9px] text-zinc-500 italic mt-1">Untuk mencapai ketinggian penuh, gunakan Kontainer 100vh.</p>
                                          </div>
                                        )}
                                      </div>

                                      <div className="h-px bg-zinc-800/80 my-3" />

                                      {/* Accordion: Item */}
                                      <div className="space-y-3">
                                        <button
                                          type="button"
                                          onClick={() => setEditorCollapse(prev => ({ ...prev, item: !prev.item }))}
                                          className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                        >
                                          {editorCollapse.item ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span>Item</span>
                                        </button>

                                        {editorCollapse.item && (
                                          <div className="space-y-3.5 animate-in fade-in duration-200">
                                            {activeElement.config.containerLayout !== 'grid' ? (
                                              <>
                                                {/* Direksi */}
                                                <div className="flex flex-col items-stretch py-1.5 gap-1">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Direksi</span>
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">
                                                    {[
                                                      { v: 'horizontal', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>, title: 'Row' },
                                                      { v: 'vertical', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>, title: 'Column' },
                                                      { v: 'row-reverse', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>, title: 'Row Reverse' },
                                                      { v: 'col-reverse', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>, title: 'Column Reverse' },
                                                    ].map(opt => (
                                                      <button
                                                        key={opt.v}
                                                        type="button"
                                                        title={opt.title}
                                                        onClick={() => {
                                                          handleUpdateElement(editingSection.id, activeElement.id, { layout: opt.v as any });
                                                          console.log('[Editor] Direksi COLUMN diubah ke:', opt.v);
                                                        }}
                                                        className={`flex-1 h-7 flex items-center justify-center rounded text-xs font-bold transition-all ${(activeElement.config.layout || 'vertical') === opt.v
                                                          ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                          : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                          }`}
                                                      >
                                                        {opt.icon}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>

                                                {/* Justify Content */}
                                                <div className="flex flex-col items-stretch py-1.5 gap-1">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Justify Content</span>
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">
                                                    {[
                                                      { v: 'flex-start', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M4 7h10M4 17h14" /></svg>, t: 'Start' },
                                                      { v: 'center', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M7 7h10M5 17h14" /></svg>, t: 'Center' },
                                                      { v: 'flex-end', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 2v20M10 7h10M6 17h10" /></svg>, t: 'End' },
                                                      { v: 'space-between', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M20 2v20M4 7h16M4 17h16" /></svg>, t: 'Space Between' },
                                                      { v: 'space-around', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M20 2v20" strokeOpacity="0.4" /><path d="M7 6h10M9 18h6" /></svg>, t: 'Space Around' },
                                                      { v: 'space-evenly', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M20 2v20" strokeOpacity="0.4" strokeDasharray="2 2" /><path d="M8 6h8M8 18h8" /></svg>, t: 'Space Evenly' },
                                                    ].map(opt => (
                                                      <button
                                                        key={opt.v}
                                                        type="button"
                                                        title={opt.t}
                                                        onClick={() => {
                                                          handleUpdateElement(editingSection.id, activeElement.id, { justifyContent: opt.v });
                                                          console.log('[Editor] Justify Content COLUMN diubah ke:', opt.v);
                                                        }}
                                                        className={`flex-1 h-7 flex items-center justify-center transition-all rounded ${(activeElement.config.justifyContent || 'flex-start') === opt.v
                                                          ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                          : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                          }`}
                                                      >
                                                        {opt.icon}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>

                                                {/* Align Items */}
                                                <div className="flex flex-col items-stretch py-1.5 gap-1">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Items</span>
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">
                                                    {[
                                                      { v: 'flex-start', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M4 7h10M4 17h14" /></svg>, t: 'Start' },
                                                      { v: 'center', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M7 7h10M5 17h14" /></svg>, t: 'Center' },
                                                      { v: 'flex-end', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 2v20M10 7h10M6 17h10" /></svg>, t: 'End' },
                                                      { v: 'stretch', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M20 2v20M4 7h16M4 17h16" /></svg>, t: 'Stretch' },
                                                    ].map(opt => (
                                                      <button
                                                        key={opt.v}
                                                        type="button"
                                                        title={opt.t}
                                                        onClick={() => {
                                                          handleUpdateElement(editingSection.id, activeElement.id, { alignItems: opt.v });
                                                          console.log('[Editor] Align Items COLUMN diubah ke:', opt.v);
                                                        }}
                                                        className={`flex-1 h-7 flex items-center justify-center transition-all rounded ${(activeElement.config.alignItems || 'stretch') === opt.v
                                                          ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                          : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                          }`}
                                                      >
                                                        {opt.icon}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>

                                                <div className="h-px bg-zinc-800/80 my-3" />

                                                {/* Jarak (Gap) */}
                                                <div className="space-y-2 py-1">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                                                      <span>Jarak</span>

                                                    </div>
                                                    <div className="flex items-center gap-0.5 text-[9px] text-zinc-500 font-bold">
                                                      <span>px</span>
                                                      <ChevronDown className="w-3 h-3" />
                                                    </div>
                                                  </div>
                                                  <div className="flex gap-1.5 items-start">
                                                    <div className="flex-1 flex flex-col">
                                                      <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                                        <input
                                                          type="number"
                                                          value={activeElement.config.columnGap ?? activeElement.config.gap ?? 16}
                                                          onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            const updates: any = { columnGap: val };
                                                            if (activeElement.config.gapLinked ?? true) {
                                                              updates.rowGap = val;
                                                              updates.gap = val;
                                                            }
                                                            handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                            console.log('[Editor] columnGap COLUMN diubah ke:', val);
                                                          }}
                                                          className="w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none border-r border-zinc-800"
                                                        />
                                                        <input
                                                          type="number"
                                                          value={activeElement.config.rowGap ?? activeElement.config.gap ?? 16}
                                                          onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            const updates: any = { rowGap: val };
                                                            if (activeElement.config.gapLinked ?? true) {
                                                              updates.columnGap = val;
                                                              updates.gap = val;
                                                            }
                                                            handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                            console.log('[Editor] rowGap COLUMN diubah ke:', val);
                                                          }}
                                                          className="w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none"
                                                        />
                                                      </div>
                                                      <div className="grid grid-cols-2 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                                        <span>Kolom</span>
                                                        <span>Baris</span>
                                                      </div>
                                                    </div>
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        const newVal = !(activeElement.config.gapLinked ?? true);
                                                        handleUpdateElement(editingSection.id, activeElement.id, { gapLinked: newVal });
                                                        console.log('[Editor] gapLinked COLUMN diubah ke:', newVal);
                                                      }}
                                                      className={`h-8 w-8 rounded flex items-center justify-center border transition-all shrink-0 ${(activeElement.config.gapLinked ?? true)
                                                        ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                                        : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                                        }`}
                                                    >
                                                      <LinkIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              /* Grid columns */
                                              <div className="flex flex-col items-stretch py-1.5 gap-1">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Grid Columns</span>
                                                  <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                </div>
                                                <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">
                                                  {[1, 2, 3, 4, 6].map(n => (
                                                    <button
                                                      key={n}
                                                      type="button"
                                                      onClick={() => {
                                                        handleUpdateElement(editingSection.id, activeElement.id, { columns: n });
                                                        console.log('[Editor] Grid Columns COLUMN diubah ke:', n);
                                                      }}
                                                      className={`flex-1 h-7 flex items-center justify-center rounded text-xs font-bold transition-all ${(activeElement.config.columns ?? 2) === n
                                                        ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                        : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                        }`}
                                                    >
                                                      {n}
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {activeEditorTab === 'style' && (
                                    ((editingSection, updateLocalSection) => (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Accordion: Latar Belakang */}
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setEditorCollapse(prev => ({ ...prev, latarBelakangSection: !prev.latarBelakangSection }))}
                                    className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                  >
                                    {(editorCollapse.latarBelakangSection ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                    <span>Latar Belakang</span>
                                  </button>

                                  {(editorCollapse.latarBelakangSection ?? true) && (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                      {/* Normal / Sorotan Tabs */}
                                      <div className="bg-[#25262b] rounded-md p-1 border border-zinc-800 flex mt-1">
                                        <button
                                          type="button"
                                          onClick={() => setSectionBgTab('normal')}
                                          className={`flex-1 text-center text-[11px] font-medium py-1.5 rounded transition-all ${
                                            sectionBgTab === 'normal' ? 'bg-[#3b3d42] text-white shadow' : 'text-zinc-400 hover:text-zinc-300'
                                          }`}
                                        >
                                          Normal
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSectionBgTab('hover')}
                                          className={`flex-1 text-center text-[11px] font-medium py-1.5 rounded transition-all ${
                                            sectionBgTab === 'hover' ? 'bg-[#3b3d42] text-white shadow' : 'text-zinc-400 hover:text-zinc-300'
                                          }`}
                                        >
                                          Sorotan
                                        </button>
                                      </div>

                                      {/* Background Type */}
                                      <div className="flex items-center justify-between py-1 mt-2">
                                        <span className="text-[11px] text-zinc-300 font-medium">Background Type</span>
                                        <div className="flex gap-0.5 bg-transparent border border-zinc-800 rounded p-0.5">
                                          <button 
                                            type="button"
                                            onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType']: 'classic' } })}
                                            className={`p-1.5 rounded shadow-sm transition-colors ${(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'classic' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                                            title="Solid"
                                          >
                                            <Paintbrush className="w-3.5 h-3.5" />
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType']: 'gradient' } })}
                                            className={`p-1.5 rounded shadow-sm transition-colors ${(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'gradient' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                                            title="Gradien"
                                          >
                                            <div className="w-3.5 h-3.5 rounded-[1px] bg-gradient-to-br from-zinc-300 to-zinc-600"></div>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Warna Latar & Gambar Latar (Classic) */}
                                      {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'classic' && (
                                        <div className="space-y-4 pt-2">
                                          {/* Warna */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-zinc-300 font-medium">Warna</span>
                                            <div className="flex border border-zinc-700 rounded overflow-hidden">
                                              {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] !== 'transparent' && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor']: 'transparent' } })}
                                                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                <input 
                                                  type="color" 
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] : '#ffffff'} 
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor']: e.target.value } })} 
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] === 'transparent') ? (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] }}></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Gambar */}
                                          <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                              <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-zinc-300 font-medium">Gambar</span>
                                                <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                              </div>
                                              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                                            </div>
                                            
                                            <div 
                                              className="relative w-full aspect-[2/1] rounded bg-[#32343a] border border-zinc-700 hover:border-zinc-500 transition-colors group cursor-pointer overflow-hidden flex items-center justify-center"
                                              onClick={(e) => {
                                                // Prevent click if clicking on the inner buttons
                                                if ((e.target as HTMLElement).closest('button')) return;
                                                openMediaModal((url) => { 
                                                  updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: url } }); 
                                                }, "image");
                                              }}
                                            >
                                              {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] ? (
                                                <img src={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']} alt="BG" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                              ) : (
                                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center pointer-events-none">
                                                  <Plus className="w-4 h-4 text-zinc-800" strokeWidth={3} />
                                                </div>
                                              )}
                                              
                                              {/* Upload overlays for when image exists */}
                                              {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                                                <div className="absolute inset-x-0 bottom-0 bg-black/85 p-2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all duration-200 z-20">
                                                  <button type="button" onClick={() => { openMediaModal((url) => { updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: url } }); }, "image"); }} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">
                                                    <ImageIcon className="w-3 h-3 text-zinc-400" />
                                                    <span>Media</span>
                                                  </button>
                                                </div>
                                              )}
                                              {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                                                <button type="button" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await handleDeleteImage(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']); updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: '' } }); }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 cursor-pointer" title="Hapus">
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              )}
                                            </div>
                                            {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                                              <div className="space-y-2 mt-2 p-2 bg-zinc-950 rounded border border-zinc-800">
                                                <div className="flex justify-between items-center">
                                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Overlay</span>
                                                  <span className="text-xs font-bold text-zinc-300">{Math.round((editingSection.config[sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay'] ?? 0.3) * 100)}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={Math.round((editingSection.config[sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay'] ?? 0.3) * 100)} onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay']: Number(e.target.value) / 100 } })} className="w-full accent-zinc-100 bg-zinc-900 h-1 rounded-lg cursor-pointer" />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Gradien Latar (Gradient) */}
                                      {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'gradient' && (
                                        <div className="space-y-4 pt-2">
                                          <div className="border-l-2 border-amber-600 bg-[#281a0b] p-3 rounded-r">
                                            <p className="text-[11px] text-amber-500/90 italic font-medium leading-relaxed">
                                              Set locations and angle for each breakpoint to ensure the gradient adapts to different screen sizes.
                                            </p>
                                          </div>

                                          {/* Warna 1 */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[11px] text-zinc-300 font-medium">Warna</span>
                                              <div className="flex border border-zinc-700 rounded overflow-hidden">
                                                {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] !== 'transparent' && (
                                                  <button 
                                                    type="button" 
                                                    onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1']: 'transparent' } })}
                                                    className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                    title="Reset Warna"
                                                  >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                  </button>
                                                )}
                                                <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                  <input 
                                                    type="color" 
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] : '#ffffff'} 
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1']: e.target.value } })} 
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                  />
                                                  {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] === 'transparent') ? (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                      <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] }}></div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Lokasi 1 */}
                                            <div className="space-y-1">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-[11px] text-zinc-300 font-medium">Lokasi</span>
                                                  <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                                </div>
                                                <div className="flex items-center gap-0.5 cursor-pointer group">
                                                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">%</span>
                                                  <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range"
                                                  min="0"
                                                  max="100"
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1'] ?? 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1']: Number(e.target.value) } })}
                                                  className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1'] ?? 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1']: Number(e.target.value) } })}
                                                  className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          {/* Warna 2 */}
                                          <div className="space-y-2 pt-1">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[11px] text-zinc-300 font-medium">Second Color</span>
                                              <div className="flex border border-zinc-700 rounded overflow-hidden">
                                                {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] !== 'transparent' && (
                                                  <button 
                                                    type="button" 
                                                    onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2']: 'transparent' } })}
                                                    className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                    title="Reset Warna"
                                                  >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                  </button>
                                                )}
                                                <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                  <input 
                                                    type="color" 
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] : '#ff0000'} 
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2']: e.target.value } })} 
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                  />
                                                  {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] === 'transparent') ? (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                      <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] }}></div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Lokasi 2 */}
                                            <div className="space-y-1">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-[11px] text-zinc-300 font-medium">Lokasi</span>
                                                  <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                                </div>
                                                <div className="flex items-center gap-0.5 cursor-pointer group">
                                                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">%</span>
                                                  <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range"
                                                  min="0"
                                                  max="100"
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2'] ?? 100}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2']: Number(e.target.value) } })}
                                                  className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2'] ?? 100}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2']: Number(e.target.value) } })}
                                                  className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          {/* Tipe & Sudut */}
                                          <div className="space-y-4 pt-1">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[11px] text-zinc-300 font-medium">Tipe</span>
                                              <div className="relative w-32">
                                                <select
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType'] || 'linear'}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType']: e.target.value } })}
                                                  className="w-full h-8 bg-zinc-950/50 border border-zinc-800 rounded text-[11px] text-zinc-200 pl-3 pr-8 appearance-none focus:border-zinc-700 outline-none cursor-pointer"
                                                >
                                                  <option value="linear">Linier</option>
                                                  <option value="radial">Radial</option>
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                              </div>
                                            </div>

                                            {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType'] || 'linear') === 'linear' ? (
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[11px] text-zinc-300 font-medium">Sudut</span>
                                                    <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                                  </div>
                                                  <div className="flex items-center gap-0.5 cursor-pointer group">
                                                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">deg</span>
                                                    <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="360"
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle'] ?? 180}
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle']: Number(e.target.value) } })}
                                                    className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                                                  />
                                                  <input
                                                    type="number"
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle'] ?? 180}
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle']: Number(e.target.value) } })}
                                                    className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-zinc-300 font-medium">Posisi</span>
                                                <div className="relative w-32">
                                                  <select
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientRadialPos' : 'bgGradientRadialPos'] || 'center center'}
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientRadialPos' : 'bgGradientRadialPos']: e.target.value } })}
                                                    className="w-full h-8 bg-zinc-950/50 border border-zinc-800 rounded text-[11px] text-zinc-200 pl-3 pr-8 appearance-none focus:border-zinc-700 outline-none cursor-pointer"
                                                  >
                                                    <option value="center center">Tengah Tengah</option>
                                                    <option value="left center">Tengah Kiri</option>
                                                    <option value="right center">Tengah Kanan</option>
                                                    <option value="center top">Tengah Atas</option>
                                                    <option value="left top">Kiri Atas</option>
                                                    <option value="right top">Kanan atas</option>
                                                    <option value="center bottom">Tengah bawah</option>
                                                    <option value="left bottom">Kiri bawah</option>
                                                    <option value="right bottom">Kanan bawah</option>
                                                  </select>
                                                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                    </div>
                                  )}

                                  {/* Durasi Transisi (Khusus Sorotan) */}
                                  {sectionBgTab === 'hover' && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800">
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="text-[11px] text-zinc-300 font-medium">Durasi Transisi (s)</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <input
                                          type="range"
                                          min="0"
                                          max="5"
                                          step="0.1"
                                          value={editingSection.config.hoverTransitionDuration ?? 0.3}
                                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, hoverTransitionDuration: Number(e.target.value) } })}
                                          className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                                        />
                                        <input
                                          type="number"
                                          min="0"
                                          max="5"
                                          step="0.1"
                                          value={editingSection.config.hoverTransitionDuration ?? 0.3}
                                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, hoverTransitionDuration: Number(e.target.value) } })}
                                          className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="h-px bg-zinc-800/80 my-3" />

                                {/* Accordion: Batas */}
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setEditorCollapse(prev => ({ ...prev, perbatasanSection: !prev.perbatasanSection }))}
                                    className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[13px] tracking-wide text-left hover:text-white transition-colors"
                                  >
                                    {(editorCollapse.perbatasanSection ?? true) ? <ChevronDown className="w-4 h-4 text-zinc-100 shrink-0" /> : <ChevronRight className="w-4 h-4 text-zinc-100 shrink-0" />}
                                    <span>Batas</span>
                                  </button>

                                  {(editorCollapse.perbatasanSection ?? true) && (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                      
                                      {/* Tab Switcher Normal/Sorotan */}
                                      <div className="flex bg-[#25262b] rounded-[4px] border border-zinc-800 p-[2px] h-9">
                                        <button
                                          type="button"
                                          onClick={() => setSectionBorderTab('normal')}
                                          className={`flex-1 text-[12px] font-semibold rounded-[3px] transition-all ${
                                            sectionBorderTab === 'normal'
                                              ? 'bg-[#3b3c41] text-zinc-100 shadow-sm'
                                              : 'text-zinc-400 hover:text-zinc-300 hover:bg-[#3b3c41]/50'
                                          }`}
                                        >
                                          Normal
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSectionBorderTab('hover')}
                                          className={`flex-1 text-[12px] font-semibold rounded-[3px] transition-all ${
                                            sectionBorderTab === 'hover'
                                              ? 'bg-[#3b3c41] text-zinc-100 shadow-sm'
                                              : 'text-zinc-400 hover:text-zinc-300 hover:bg-[#3b3c41]/50'
                                          }`}
                                        >
                                          Sorotan
                                        </button>
                                      </div>

                                      {/* Border Type */}
                                      <div className="flex justify-between items-center py-0.5">
                                        <span className="text-[12px] text-zinc-200 font-medium">Border Type</span>
                                        <select
                                          value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] || 'none'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const newConfig = { ...editingSection.config };
                                            newConfig[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] = val;
                                            if (val === 'none') {
                                              if (sectionBorderTab === 'hover') {
                                                delete newConfig.hoverBorderColor;
                                                delete newConfig.hoverBorderWidth;
                                                delete newConfig.hoverBorderWidthTop;
                                                delete newConfig.hoverBorderWidthRight;
                                                delete newConfig.hoverBorderWidthBottom;
                                                delete newConfig.hoverBorderWidthLeft;
                                              } else {
                                                delete newConfig.borderColor;
                                                delete newConfig.borderWidth;
                                                delete newConfig.borderWidthTop;
                                                delete newConfig.borderWidthRight;
                                                delete newConfig.borderWidthBottom;
                                                delete newConfig.borderWidthLeft;
                                              }
                                            }
                                            updateLocalSection({ ...editingSection, config: newConfig });
                                          }}
                                          className="px-2.5 py-1.5 bg-[#25262b] border border-zinc-700 rounded-[4px] text-[12px] text-zinc-200 font-medium outline-none cursor-pointer focus:border-zinc-600 w-36 [&>option]:bg-[#25262b] [&>option]:text-zinc-200"
                                        >
                                          <option value="none">Asali</option>
                                          <option value="solid">Solid</option>
                                          <option value="dashed">Dashed</option>
                                          <option value="dotted">Dotted</option>
                                          <option value="double">Double</option>
                                        </select>
                                      </div>

                                      {/* Lebar Batas & Warna Batas (hanya muncul jika Border Type selain Asali) */}
                                      {(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] && editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] !== 'none') && (
                                        <>
                                          {/* Lebar Batas */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <span className="text-[12px] text-zinc-200 font-medium">Lebar Batas</span>
                                                <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                              </div>
                                              
                                              <select
                                                value="px"
                                                disabled
                                                className="px-1 py-0.5 rounded text-[11px] bg-transparent text-zinc-300 hover:text-zinc-100 outline-none font-medium border-0 focus:ring-0 appearance-none opacity-80"
                                              >
                                                <option value="px">px ˅</option>
                                              </select>
                                            </div>

                                            <div>
                                              <div className="flex rounded-[4px] border border-zinc-700 bg-transparent divide-x divide-zinc-700 overflow-hidden h-9">
                                                {[
                                                  { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                                                  { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                                                  { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                                                  { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 }
                                                ].map((corner) => {
                                                  const val = editingSection.config[corner.key] !== undefined ? editingSection.config[corner.key] : corner.fallback;
                                                  return (
                                                    <input
                                                      key={corner.key}
                                                      type="number"
                                                      min="0"
                                                      value={val === 0 ? '' : val}
                                                      onChange={(e) => {
                                                        const numVal = Math.max(0, Number(e.target.value));
                                                        if (bgBorderWidthLink) {
                                                          updateLocalSection({
                                                            ...editingSection,
                                                            config: {
                                                              ...editingSection.config,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth']: numVal,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop']: numVal,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight']: numVal,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom']: numVal,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft']: numVal,
                                                            }
                                                          });
                                                        } else {
                                                          updateLocalSection({
                                                            ...editingSection,
                                                            config: {
                                                              ...editingSection.config,
                                                              [corner.key]: numVal
                                                            }
                                                          });
                                                        }
                                                      }}
                                                      className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-[12px] text-zinc-300 font-medium p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/50"
                                                    />
                                                  );
                                                })}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setBgBorderWidthLink(!bgBorderWidthLink);
                                                    if (!bgBorderWidthLink) {
                                                      const topVal = editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop'] ?? editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0;
                                                      updateLocalSection({
                                                        ...editingSection,
                                                        config: {
                                                          ...editingSection.config,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth']: topVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop']: topVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight']: topVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom']: topVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft']: topVal,
                                                        }
                                                      });
                                                    }
                                                  }}
                                                  className={`w-[42px] shrink-0 flex items-center justify-center transition-all ${
                                                    bgBorderWidthLink 
                                                      ? 'bg-[#3b3c41] text-zinc-100' 
                                                      : 'bg-[#25262b] text-zinc-400 hover:text-zinc-200'
                                                  }`}
                                                >
                                                  <Link2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                              <div className="flex pr-[42px] text-center text-[10px] text-zinc-500 font-medium select-none mt-1.5">
                                                <span className="flex-1">Atas</span>
                                                <span className="flex-1">Kanan</span>
                                                <span className="flex-1">Bawah</span>
                                                <span className="flex-1">Kiri</span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Warna Batas */}
                                          <div className="flex justify-between items-center pt-1 pb-2">
                                            <span className="text-[12px] text-zinc-200 font-medium">Warna Batas</span>
                                            <div className="flex rounded-[4px] border border-zinc-700 bg-transparent overflow-hidden h-9 w-[70px]">
                                              {editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => {
                                                    const newConfig = { ...editingSection.config };
                                                    delete newConfig[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'];
                                                    updateLocalSection({ ...editingSection, config: newConfig });
                                                  }}
                                                  className="w-[34px] flex items-center justify-center border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors bg-[#25262b]"
                                                  title="Reset Warna Batas"
                                                >
                                                  <RotateCcw className="w-4 h-4" />
                                                </button>
                                              )}
                                              <div className="relative flex-1 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwsLCABWAK4ZqRDYKqB2W/QEAA4YIA7y8H8IAAAAASUVORK5CYII=')] overflow-hidden">
                                                {!(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor']) && (
                                                  <div className="absolute inset-0 z-10 pointer-events-none">
                                                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                                      <line x1="0" y1="100%" x2="100%" y2="0" stroke="#ef4444" strokeWidth="2" />
                                                    </svg>
                                                  </div>
                                                )}
                                                <input
                                                  type="color"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] || '#000000'}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor']: e.target.value } })}
                                                  className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                                                />
                                                <div 
                                                  className="w-full h-full pointer-events-none" 
                                                  style={{ backgroundColor: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] || 'transparent' }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      {/* Radius Batas */}
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[12px] text-zinc-200 font-medium">Radius Batas</span>
                                            <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                          </div>
                                          
                                          <select
                                            value={editingSection.config.borderRadiusUnit || 'px'}
                                            onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, borderRadiusUnit: e.target.value } })}
                                            className="px-1 py-0.5 rounded text-[11px] bg-transparent text-zinc-300 hover:text-zinc-100 outline-none cursor-pointer font-medium border-0 focus:ring-0 appearance-none"
                                          >
                                            <option value="px">px ˅</option>
                                            <option value="%">% ˅</option>
                                          </select>
                                        </div>

                                        <div>
                                          <div className="flex rounded-[4px] border border-zinc-700 bg-transparent divide-x divide-zinc-700 overflow-hidden h-9">
                                            {[
                                              { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                                              { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                                              { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                                              { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 }
                                            ].map((corner) => {
                                              const val = editingSection.config[corner.key] !== undefined ? editingSection.config[corner.key] : corner.fallback;
                                              return (
                                                <input
                                                  key={corner.key}
                                                  type="number"
                                                  min="0"
                                                  value={val === 0 ? '' : val}
                                                  onChange={(e) => {
                                                    const numVal = Math.max(0, Number(e.target.value));
                                                    if (bgBorderRadiusLink) {
                                                      updateLocalSection({
                                                        ...editingSection,
                                                        config: {
                                                          ...editingSection.config,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius']: numVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop']: numVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight']: numVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom']: numVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft']: numVal,
                                                        }
                                                      });
                                                    } else {
                                                      updateLocalSection({
                                                        ...editingSection,
                                                        config: {
                                                          ...editingSection.config,
                                                          [corner.key]: numVal
                                                        }
                                                      });
                                                    }
                                                  }}
                                                  className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-[12px] text-zinc-300 font-medium p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/50"
                                                />
                                              );
                                            })}
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setBgBorderRadiusLink(!bgBorderRadiusLink);
                                                if (!bgBorderRadiusLink) {
                                                  const topVal = editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop'] ?? editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0;
                                                  updateLocalSection({
                                                    ...editingSection,
                                                    config: {
                                                      ...editingSection.config,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius']: topVal,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop']: topVal,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight']: topVal,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom']: topVal,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft']: topVal,
                                                    }
                                                  });
                                                }
                                              }}
                                              className={`w-[42px] shrink-0 flex items-center justify-center transition-all ${
                                                bgBorderRadiusLink 
                                                  ? 'bg-[#3b3c41] text-zinc-100' 
                                                  : 'bg-[#25262b] text-zinc-400 hover:text-zinc-200'
                                              }`}
                                              title={bgBorderRadiusLink ? "Putuskan tautan sudut" : "Tautkan semua sudut"}
                                            >
                                              <Link2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                          <div className="flex pr-[42px] text-center text-[10px] text-zinc-500 font-medium select-none mt-1.5">
                                            <span className="flex-1">Atas</span>
                                            <span className="flex-1">Kanan</span>
                                            <span className="flex-1">Bawah</span>
                                            <span className="flex-1">Kiri</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Box Shadow */}
                                      <div className="space-y-2 pt-2 relative">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[12px] text-zinc-200 font-medium">Box Shadow</span>
                                          <div className="flex items-center gap-1.5">
                                            {(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType'] === 'custom' || editingSection.config[sectionBorderTab === 'hover' ? 'hoverBoxShadow' : 'boxShadow']) && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const newConfig = { ...editingSection.config };
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverBoxShadow' : 'boxShadow'];
                                                  updateLocalSection({ ...editingSection, config: newConfig });
                                                }}
                                                className="w-[34px] h-[34px] rounded-[4px] bg-transparent text-zinc-400 hover:text-white transition-all flex items-center justify-center"
                                              >
                                                <RotateCcw className="w-4 h-4" />
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const target = activePopover === 'sectionBoxShadow' ? null : 'sectionBoxShadow';
                                                setActivePopover(target);
                                              }}
                                              className={`w-[42px] h-[34px] rounded-[4px] border transition-all flex items-center justify-center ${activePopover === 'sectionBoxShadow' ? 'bg-[#3b3c41] border-zinc-500 text-white' : 'bg-transparent border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white'}`}
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>

                                        {activePopover === 'sectionBoxShadow' && (
                                          <div 
                                            className="absolute right-0 top-10 z-50 w-[260px] p-4 bg-[#1e1f23] border border-zinc-800 rounded-[8px] shadow-2xl space-y-4 animate-in fade-in duration-150"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {/* Warna */}
                                            <div className="flex justify-between items-center">
                                              <span className="text-[12px] text-zinc-200 font-medium">Warna</span>
                                              <div className="relative w-8 h-8 rounded-[4px] border border-zinc-700 overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwsLCABWAK4ZqRDYKqB2W/QEAA4YIA7y8H8IAAAAASUVORK5CYII=')]">
                                                <input
                                                  type="color"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'] || '#000000'}
                                                  onChange={(e) => {
                                                    updateLocalSection({ ...editingSection, config: { 
                                                      ...editingSection.config, 
                                                      [sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor']: e.target.value,
                                                      [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' 
                                                    } });
                                                  }}
                                                  className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                                                />
                                                <div 
                                                  className="w-full h-full pointer-events-none" 
                                                  style={{ backgroundColor: editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'] || 'transparent' }}
                                                />
                                              </div>
                                            </div>

                                            {/* Mendatar */}
                                            <div className="space-y-2">
                                              <span className="text-[12px] text-zinc-200 font-medium">Mendatar</span>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range" min="-100" max="100"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Vertikal */}
                                            <div className="space-y-2">
                                              <span className="text-[12px] text-zinc-200 font-medium">Vertikal</span>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range" min="-100" max="100"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Buram */}
                                            <div className="space-y-2">
                                              <span className="text-[12px] text-zinc-200 font-medium">Buram</span>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range" min="0" max="100"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number" min="0"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Menyebar */}
                                            <div className="space-y-2">
                                              <span className="text-[12px] text-zinc-200 font-medium">Menyebar</span>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range" min="-100" max="100"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Posisi */}
                                            <div className="flex justify-between items-center pt-1">
                                              <span className="text-[12px] text-zinc-200 font-medium">Posisi</span>
                                              <select
                                                value="Outline"
                                                className="px-2.5 py-1.5 bg-transparent border border-zinc-700 rounded-[4px] text-[12px] text-zinc-200 font-medium outline-none cursor-pointer focus:border-zinc-600 w-[100px] [&>option]:bg-[#1e1f23] [&>option]:text-zinc-200"
                                              >
                                                <option value="Outline">Outline</option>
                                              </select>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                    </div>
                                  )}
                                </div>
                              </div>
                                    ))(
                                      { ...editingSection, config: activeElement.config || {} },
                                      (nextSection: { config?: Record<string, any> }) => {
                                        const nextConfig = nextSection?.config || {};
                                        const currentConfig = activeElement.config || {};
                                        const patch: Record<string, any> = {};
                                        const keys = new Set([...Object.keys(currentConfig), ...Object.keys(nextConfig)]);
                                        keys.forEach((k) => {
                                          if (currentConfig[k] !== nextConfig[k]) patch[k] = nextConfig[k];
                                        });
                                        if (Object.keys(patch).length > 0) {
                                          handleUpdateElement(editingSection.id, activeElement.id, patch);
                                        }
                                      }
                                    )
                                  )}
                                  {activeEditorTab === 'advanced' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                      {/* Accordion: Tata Letak */}
                                      <div className="space-y-3">
                                        <button
                                          type="button"
                                          onClick={() => setEditorCollapse(prev => ({ ...prev, tataLetak: !prev.tataLetak }))}
                                          className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                        >
                                          {editorCollapse.tataLetak ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span>Tata Letak</span>
                                        </button>

                                        {editorCollapse.tataLetak && (
                                          <div className="space-y-4 animate-in fade-in duration-200">
                                            {/* Margin */}
                                            <div className="space-y-1.5 py-1.5">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                                                  <span>Margin</span>
                                                </div>

                                                {/* Unit Dropdown for Column Margin */}
                                                <div className="relative">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      if (activeDropdown?.field === 'colMargin') {
                                                        setActiveDropdown(null);
                                                      } else {
                                                        setActiveDropdown({ field: 'colMargin', elementId: activeElement.id });
                                                      }
                                                    }}
                                                    className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-white font-black bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 transition-all select-none cursor-pointer"
                                                  >
                                                    <span>{parseUnitAndValue(activeElement.config.marginTop ?? 0).unit === 'custom' ? '✏️ Custom' : parseUnitAndValue(activeElement.config.marginTop ?? 0).unit}</span>
                                                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                                                  </button>

                                                  {activeDropdown?.field === 'colMargin' && activeDropdown?.elementId === activeElement.id && (
                                                    <div className="absolute right-0 mt-1 w-24 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden py-1 z-[1000] animate-in fade-in slide-in-from-top-1 duration-150">
                                                      {(['px', 'vw', '%'] as const).map((u) => (
                                                        <button
                                                          key={u}
                                                          type="button"
                                                          onClick={() => {
                                                            setActiveDropdown(null);
                                                            const updates: any = {};
                                                            ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(k => {
                                                              const oldVal = parseUnitAndValue(activeElement.config[k] ?? 0).val;
                                                              updates[k] = u === 'px' ? oldVal : `${oldVal}${u}`;
                                                            });
                                                            handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                          }}
                                                          className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-between ${parseUnitAndValue(activeElement.config.marginTop ?? 0).unit === u ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                        >
                                                          <span>{u}</span>
                                                          {parseUnitAndValue(activeElement.config.marginTop ?? 0).unit === u && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                                                        </button>
                                                      ))}
                                                      <div className="h-px bg-zinc-800 my-1" />
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setActiveDropdown(null);
                                                          const updates: any = {};
                                                          ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(k => {
                                                            updates[k] = parseUnitAndValue(activeElement.config[k] ?? 0).isCustom ? parseUnitAndValue(activeElement.config[k] ?? 0).customStr : '0px';
                                                          });
                                                          handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                        }}
                                                        className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-1.5 ${parseUnitAndValue(activeElement.config.marginTop ?? 0).unit === 'custom' ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                      >
                                                        <Pencil className="w-2.5 h-2.5" />
                                                        <span>Custom</span>
                                                        {parseUnitAndValue(activeElement.config.marginTop ?? 0).unit === 'custom' && <span className="ml-auto w-1 h-1 rounded-full bg-blue-400" />}
                                                      </button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {parseUnitAndValue(activeElement.config.marginTop ?? 0).unit === 'custom' ? (
                                                <div className="flex gap-2">
                                                  <input
                                                    type="text"
                                                    value={activeElement.config.marginTop ?? ''}
                                                    placeholder="Contoh: 10px 20px, 5vw"
                                                    onChange={(e) => {
                                                      const val = e.target.value;
                                                      handleUpdateElement(editingSection.id, activeElement.id, {
                                                        marginTop: val,
                                                        marginRight: val,
                                                        marginBottom: val,
                                                        marginLeft: val
                                                      });
                                                    }}
                                                    className="flex-1 h-8 text-xs px-2.5 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none placeholder:text-zinc-700 font-bold"
                                                  />
                                                </div>
                                              ) : (
                                                <div className="flex gap-1 items-start">
                                                  <div className="flex-1 flex flex-col">
                                                    <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                                      {[
                                                        { k: 'marginTop', isLast: false },
                                                        { k: 'marginRight', isLast: false },
                                                        { k: 'marginBottom', isLast: false },
                                                        { k: 'marginLeft', isLast: true }
                                                      ].map((m) => (
                                                        <input
                                                          key={m.k}
                                                          type="number"
                                                          value={parseUnitAndValue(activeElement.config[m.k] ?? 0).val}
                                                          onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            const newVal = parseUnitAndValue(activeElement.config[m.k] ?? 0).unit === 'px' ? val : `${val}${parseUnitAndValue(activeElement.config[m.k] ?? 0).unit}`;
                                                            const updates: any = { [m.k]: newVal };
                                                            if (activeElement.config.marginLinked ?? true) {
                                                              updates.marginTop = newVal;
                                                              updates.marginRight = newVal;
                                                              updates.marginBottom = newVal;
                                                              updates.marginLeft = newVal;
                                                            }
                                                            handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                          }}
                                                          placeholder="-"
                                                          className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!m.isLast ? 'border-r border-zinc-800' : ''}`}
                                                        />
                                                      ))}
                                                    </div>
                                                    <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                                      <span>Atas</span>
                                                      <span>Kanan</span>
                                                      <span>Bawah</span>
                                                      <span>Kiri</span>
                                                    </div>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { marginLinked: !(activeElement.config.marginLinked ?? true) })}
                                                    className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${(activeElement.config.marginLinked ?? true)
                                                      ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                                      : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                                      }`}
                                                  >
                                                    <LinkIcon className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              )}
                                            </div>

                                            {/* Padding */}
                                            <div className="space-y-1.5 py-1.5">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                                                  <span>Padding</span>
                                                </div>

                                                {/* Unit Dropdown for Column Padding */}
                                                <div className="relative">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      if (activeDropdown?.field === 'colPadding') {
                                                        setActiveDropdown(null);
                                                      } else {
                                                        setActiveDropdown({ field: 'colPadding', elementId: activeElement.id });
                                                      }
                                                    }}
                                                    className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-white font-black bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 transition-all select-none cursor-pointer"
                                                  >
                                                    <span>{parseUnitAndValue(activeElement.config.paddingTop ?? 16).unit === 'custom' ? '✏️ Custom' : parseUnitAndValue(activeElement.config.paddingTop ?? 16).unit}</span>
                                                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                                                  </button>

                                                  {activeDropdown?.field === 'colPadding' && activeDropdown?.elementId === activeElement.id && (
                                                    <div className="absolute right-0 mt-1 w-24 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden py-1 z-[1000] animate-in fade-in slide-in-from-top-1 duration-150">
                                                      {(['px', 'vw', '%'] as const).map((u) => (
                                                        <button
                                                          key={u}
                                                          type="button"
                                                          onClick={() => {
                                                            setActiveDropdown(null);
                                                            const updates: any = {};
                                                            ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(k => {
                                                              const oldVal = parseUnitAndValue(activeElement.config[k] ?? 16).val;
                                                              updates[k] = u === 'px' ? oldVal : `${oldVal}${u}`;
                                                            });
                                                            handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                          }}
                                                          className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-between ${parseUnitAndValue(activeElement.config.paddingTop ?? 16).unit === u ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                        >
                                                          <span>{u}</span>
                                                          {parseUnitAndValue(activeElement.config.paddingTop ?? 16).unit === u && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                                                        </button>
                                                      ))}
                                                      <div className="h-px bg-zinc-800 my-1" />
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setActiveDropdown(null);
                                                          const updates: any = {};
                                                          ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(k => {
                                                            updates[k] = parseUnitAndValue(activeElement.config[k] ?? 16).isCustom ? parseUnitAndValue(activeElement.config[k] ?? 16).customStr : '16px';
                                                          });
                                                          handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                        }}
                                                        className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-1.5 ${parseUnitAndValue(activeElement.config.paddingTop ?? 16).unit === 'custom' ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                      >
                                                        <Pencil className="w-2.5 h-2.5" />
                                                        <span>Custom</span>
                                                        {parseUnitAndValue(activeElement.config.paddingTop ?? 16).unit === 'custom' && <span className="ml-auto w-1 h-1 rounded-full bg-blue-400" />}
                                                      </button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {parseUnitAndValue(activeElement.config.paddingTop ?? 16).unit === 'custom' ? (
                                                <div className="flex gap-2">
                                                  <input
                                                    type="text"
                                                    value={activeElement.config.paddingTop ?? ''}
                                                    placeholder="Contoh: 16px 20px, 2vw"
                                                    onChange={(e) => {
                                                      const val = e.target.value;
                                                      handleUpdateElement(editingSection.id, activeElement.id, {
                                                        paddingTop: val,
                                                        paddingRight: val,
                                                        paddingBottom: val,
                                                        paddingLeft: val
                                                      });
                                                    }}
                                                    className="flex-1 h-8 text-xs px-2.5 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none placeholder:text-zinc-700 font-bold"
                                                  />
                                                </div>
                                              ) : (
                                                <div className="flex gap-1 items-start">
                                                  <div className="flex-1 flex flex-col">
                                                    <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                                      {[
                                                        { k: 'paddingTop', isLast: false },
                                                        { k: 'paddingRight', isLast: false },
                                                        { k: 'paddingBottom', isLast: false },
                                                        { k: 'paddingLeft', isLast: true }
                                                      ].map((p) => (
                                                        <input
                                                          key={p.k}
                                                          type="number"
                                                          value={parseUnitAndValue(activeElement.config[p.k] ?? 16).val}
                                                          onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            const newVal = parseUnitAndValue(activeElement.config[p.k] ?? 16).unit === 'px' ? val : `${val}${parseUnitAndValue(activeElement.config[p.k] ?? 16).unit}`;
                                                            const updates: any = { [p.k]: newVal };
                                                            if (activeElement.config.paddingLinked ?? true) {
                                                              updates.paddingTop = newVal;
                                                              updates.paddingRight = newVal;
                                                              updates.paddingBottom = newVal;
                                                              updates.paddingLeft = newVal;
                                                            }
                                                            handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                          }}
                                                          placeholder="-"
                                                          className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!p.isLast ? 'border-r border-zinc-800' : ''}`}
                                                        />
                                                      ))}
                                                    </div>
                                                    <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                                      <span>Atas</span>
                                                      <span>Kanan</span>
                                                      <span>Bawah</span>
                                                      <span>Kiri</span>
                                                    </div>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { paddingLinked: !(activeElement.config.paddingLinked ?? true) })}
                                                    className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${(activeElement.config.paddingLinked ?? true)
                                                      ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                                      : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                                      }`}
                                                  >
                                                    <LinkIcon className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              )}
                                            </div>

                                            <div className="h-px bg-zinc-800/80 my-3" />

                                            {/* Align Self */}
                                            {/* Align Self */}
                                            <div className="flex flex-col items-stretch py-1.5 gap-1">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Self</span>
                                                <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                              </div>
                                              <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">
                                                {[
                                                  { v: 'auto', label: 'Auto' },
                                                  { v: 'flex-start', label: '┳' },
                                                  { v: 'center', label: '╋' },
                                                  { v: 'flex-end', label: '┻' },
                                                  { v: 'stretch', label: '┫┣' },
                                                ].map(opt => (
                                                  <button
                                                    key={opt.v}
                                                    type="button"
                                                    onClick={() => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { alignSelf: opt.v });
                                                      console.log('[Editor] Align Self COLUMN diubah ke:', opt.v);
                                                    }}
                                                    className={`flex-1 h-7 flex items-center justify-center text-xs font-bold transition-all rounded ${(activeElement.config.alignSelf || 'auto') === opt.v
                                                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                      : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                      }`}
                                                  >
                                                    {opt.label}
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                            <p className="text-[9px] text-zinc-500 italic -mt-2">This control will affect contained elements only.</p>

                                            {/* Urutan */}
                                            <div className="flex flex-col items-stretch py-1.5 gap-1">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Urutan</span>
                                                <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                              </div>
                                              <div className="flex gap-1.5 w-full">
                                                <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 flex-1">
                                                  {[
                                                    { v: 'start', label: '|←', title: 'Start' },
                                                    { v: 'end', label: '→|', title: 'End' },
                                                    { v: 'custom', label: '⁝', title: 'Custom' },
                                                  ].map(opt => (
                                                    <button
                                                      key={opt.v}
                                                      type="button"
                                                      title={opt.title}
                                                      onClick={() => {
                                                        handleUpdateElement(editingSection.id, activeElement.id, { order: opt.v });
                                                        console.log('[Editor] Urutan COLUMN diubah ke:', opt.v);
                                                      }}
                                                      className={`flex-1 h-7 flex items-center justify-center text-xs font-bold transition-all rounded ${(activeElement.config.order || 'default') === opt.v
                                                        ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                        : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                        }`}
                                                    >
                                                      {opt.label}
                                                    </button>
                                                  ))}
                                                </div>
                                                {activeElement.config.order === 'custom' && (
                                                  <input
                                                    type="number"
                                                    value={activeElement.config.customOrder ?? 0}
                                                    onChange={(e) => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { customOrder: Number(e.target.value) });
                                                      console.log('[Editor] Custom Order COLUMN diubah ke:', e.target.value);
                                                    }}
                                                    className="w-12 h-8 text-center text-xs font-bold bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none"
                                                  />
                                                )}
                                              </div>
                                            </div>
                                            <p className="text-[9px] text-zinc-500 italic -mt-2">This control will affect contained elements only.</p>

                                            {/* Ukuran (Sizing) */}
                                            <div className="flex flex-col items-stretch py-1.5 gap-1">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Ukuran</span>
                                                <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                              </div>
                                              <div className="flex gap-1.5 w-full">
                                                <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 flex-1">
                                                  {[
                                                    { v: 'default', label: '🚫', title: 'Auto' },
                                                    { v: 'full', label: '↔', title: 'Full' },
                                                    { v: 'fit', label: '↕', title: 'Fit' },
                                                    { v: 'custom', label: '⁝', title: 'Custom' },
                                                  ].map(opt => (
                                                    <button
                                                      key={opt.v}
                                                      type="button"
                                                      title={opt.title}
                                                      onClick={() => {
                                                        handleUpdateElement(editingSection.id, activeElement.id, { sizing: opt.v });
                                                        console.log('[Editor] Ukuran COLUMN diubah ke:', opt.v);
                                                      }}
                                                      className={`flex-1 h-7 flex items-center justify-center text-xs font-bold transition-all rounded ${(activeElement.config.sizing || 'default') === opt.v
                                                        ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                        : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                        }`}
                                                    >
                                                      {opt.label}
                                                    </button>
                                                  ))}
                                                </div>
                                                {activeElement.config.sizing === 'custom' && (
                                                  <input
                                                    type="number"
                                                    value={activeElement.config.customWidth ?? 100}
                                                    onChange={(e) => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { customWidth: Number(e.target.value) });
                                                      console.log('[Editor] Custom Width COLUMN diubah ke:', e.target.value);
                                                    }}
                                                    placeholder="Width"
                                                    className="w-14 h-8 text-center text-xs font-bold bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none"
                                                  />
                                                )}
                                              </div>
                                            </div>

                                            {/* Posisi */}
                                            <div className="flex justify-between items-center py-1">
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Posisi</span>
                                              <select
                                                value={activeElement.config.position || 'relative'}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { position: e.target.value })}
                                                className="w-36 p-1.5 rounded text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 font-medium focus:border-zinc-700 outline-none"
                                              >
                                                <option value="relative">Asali</option>
                                                <option value="absolute">Absolut</option>
                                                <option value="fixed">Tetap</option>
                                                <option value="static">Statis</option>
                                              </select>
                                            </div>

                                            {/* Z-Index */}
                                            <div className="flex justify-between items-center py-1">
                                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                                                <span>Z-Index</span>

                                              </div>
                                              <input
                                                type="number"
                                                value={activeElement.config.zIndex ?? ''}
                                                placeholder=""
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { zIndex: e.target.value ? Number(e.target.value) : undefined })}
                                                className="w-16 h-7 text-center text-xs font-bold bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none font-medium"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* ── Column Children ── */}
                                <div className="border-t pt-4 border-zinc-800">
                                  <span className={`text-[10px] font-black uppercase tracking-widest text-zinc-200 flex items-center gap-1.5`}><Layers className="w-3.5 h-3.5 text-zinc-500" /><span>Isi Kontainer Kolom</span></span>

                                  {/* Existing children list */}
                                  {(activeElement.children || []).length === 0 ? (
                                    <p className="text-[9px] text-zinc-500 italic text-center py-2 bg-zinc-950 rounded-lg mt-1.5 border border-dashed border-zinc-800">Tidak ada elemen di dalam kolom ini.</p>
                                  ) : (
                                    (activeElement.children || []).sort((a, b) => a.order - b.order).map(child => {
                                      const childMeta = ELEMENT_TYPE_MAP[child.type];
                                      const ChildIcon = childMeta?.icon || Type;
                                      return (
                                        <div key={child.id} className="flex items-center gap-2 px-2 py-2 rounded-lg mt-1.5 bg-zinc-950 border border-zinc-800 text-zinc-100">
                                          <ChildIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                          <span className="text-[9px] font-bold flex-1 truncate text-zinc-200">{childMeta?.label || child.type}</span>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteColumnChild(editingSection.id, activeElement.id, child.id)}
                                            className="text-red-400 hover:text-red-500 transition-colors p-1 hover:bg-red-950 rounded animate-all"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      );
                                    })
                                  )}

                                  {/* Add child element grid */}
                                  <div className="grid grid-cols-4 gap-1 mt-3">
                                    {Object.entries(ELEMENT_TYPE_MAP).filter(([type]) => !['BRANDING', 'CART', 'MENU', 'COLUMN'].includes(type)).map(([type, metaAny]) => {
                                      const meta = metaAny as any;
                                      const Icon = meta.icon;
                                      return (
                                        <button
                                          key={type}
                                          type="button"
                                          onClick={() => handleAddColumnChild(editingSection.id, activeElement.id, type)}
                                          className="flex flex-col items-center gap-1.5 py-2 rounded-lg transition-all text-[8px] font-bold bg-zinc-950 text-zinc-400 hover:bg-blue-950/40 hover:text-blue-400 border border-zinc-800"
                                        >
                                          <Icon className="w-4 h-4" />
                                          {meta.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* BRANDING editor */}
                            {activeEditorTab === 'layout' && activeElement.type === 'BRANDING' && (
                              <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Styling Branding Toko</span>

                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Ukuran Font: {activeElement.config.fontSize ?? 30}px</span>
                                  <input type="range" min="12" max="32" value={activeElement.config.fontSize ?? 30} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontSize: Number(e.target.value) })} className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none" />
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Warna Nama Toko</span>
                                  <input type="color" value={activeElement.config.textColor || '#18181B'} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textColor: e.target.value })} className="w-full h-8 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5" />
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Perataan Visual</span>
                                  <div className="flex gap-1">
                                    {(['left', 'center', 'right'] as const).map(a => (
                                      <button key={a} onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { align: a })}
                                        className={`flex-1 py-1.5 rounded-lg text-[8px] font-bold uppercase transition-all ${(activeElement.config.align || 'left') === a ? 'bg-blue-600 text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:bg-zinc-900'}`}
                                      >{a === 'left' ? 'Kiri' : a === 'center' ? 'Tengah' : 'Kanan'}</button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* MENU editor */}
                            {activeEditorTab === 'layout' && activeElement.type === 'MENU' && (
                              <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Styling Menu Navigasi</span>

                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Ukuran Font: {activeElement.config.fontSize ?? 20}px</span>
                                  <input type="range" min="10" max="24" value={activeElement.config.fontSize ?? 20} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontSize: Number(e.target.value) })} className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none" />
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Warna Font Navigasi</span>
                                  <input type="color" value={activeElement.config.textColor || '#18181B'} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textColor: e.target.value })} className="w-full h-8 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5" />
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Model Font (Font Family)</span>
                                  <select
                                    value={activeElement.config.fontFamily || 'inherit'}
                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontFamily: e.target.value })}
                                    className="w-full p-2 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-blue-500 outline-none"
                                  >
                                    <option value="inherit">Default System</option>
                                    {POPULAR_FONTS.map(cat => (
                                      <optgroup key={cat.category} label={cat.category} className="bg-zinc-950 text-zinc-300 font-bold">
                                        {cat.fonts.map(f => (
                                          <option key={f.value} value={f.value} className="bg-zinc-900 text-zinc-100 font-normal">{f.label}</option>
                                        ))}
                                      </optgroup>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Ketebalan Teks (Font Weight)</span>
                                  <select
                                    value={activeElement.config.fontWeight || '600'}
                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontWeight: e.target.value })}
                                    className="w-full p-2 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-blue-500 outline-none"
                                  >
                                    <option value="300">Light (300)</option>
                                    <option value="400">Regular (400)</option>
                                    <option value="500">Medium (500)</option>
                                    <option value="600">Semibold (600)</option>
                                    <option value="700">Bold (700)</option>
                                    <option value="900">Black (900)</option>
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Perataan Menu</span>
                                  <div className="flex gap-1">
                                    {(['left', 'center', 'right'] as const).map(a => (
                                      <button key={a} onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { align: a })}
                                        className={`flex-1 py-1.5 rounded-lg text-[8px] font-bold uppercase transition-all ${(activeElement.config.align || 'center') === a ? 'bg-blue-600 text-white border-transparent' : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:bg-zinc-900'}`}
                                      >{a === 'left' ? 'Kiri' : a === 'center' ? 'Tengah' : 'Kanan'}</button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2 border-t pt-3 border-zinc-800">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Sembunyikan Halaman dari Menu</span>
                                  <div className="space-y-1.5">
                                    {(() => {
                                      const defaultTabs = [
                                        { id: 'catalog', label: 'Katalog' },
                                        { id: 'categories', label: 'Kategori' }
                                      ];
                                      const customTabs = ((allCustomPages as any)?.pages || []).map((p: any) => ({
                                        id: p.slug || p.id,
                                        label: p.title
                                      }));
                                      const allTabs = [...defaultTabs, ...customTabs];
                                      const hidden = activeElement.config.hiddenMenus || [];

                                      return allTabs.map(tab => {
                                        const isHidden = hidden.includes(tab.id);
                                        return (
                                          <label key={tab.id} className="flex items-center gap-2 text-[11px] font-medium text-zinc-300 hover:text-white cursor-pointer transition-all">
                                            <input
                                              type="checkbox"
                                              checked={isHidden}
                                              onChange={(e) => {
                                                const nextHidden = e.target.checked
                                                  ? [...hidden, tab.id]
                                                  : hidden.filter((id: string) => id !== tab.id);
                                                handleUpdateElement(editingSection.id, activeElement.id, { hiddenMenus: nextHidden });
                                              }}
                                              className="rounded text-blue-600 bg-zinc-950 border-zinc-800 focus:ring-blue-500 focus:ring-offset-zinc-900 h-3.5 w-3.5 cursor-pointer"
                                            />
                                            {tab.label}
                                          </label>
                                        );
                                      });
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* CART editor (mirip BUTTON tanpa Jenis & Tautan) */}
                            {activeEditorTab === 'layout' && activeElement.type === 'CART' && (
                              <div className="space-y-4 text-zinc-300">

                                {/* Baris Teks */}
                                <div className="flex items-center justify-between gap-3 min-h-[36px]">
                                  <span className="flex items-center gap-1 text-xs font-semibold text-zinc-300">
                                    Teks <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                                  </span>
                                  <input
                                    type="text"
                                    value={activeElement.config.text || ''}
                                    onChange={(e) => {
                                      console.log(`[Editor CART Debug] Teks tombol diubah ke: "${e.target.value}"`);
                                      handleUpdateElement(editingSection.id, activeElement.id, { text: e.target.value });
                                    }}
                                    placeholder="Keranjang"
                                    className="w-[180px] p-2 bg-zinc-950/80 border border-zinc-800 text-white rounded-lg outline-none text-xs focus:border-zinc-700"
                                  />
                                </div>

                                {/* Baris Ikon */}
                                <div className="flex items-center justify-between gap-3 min-h-[36px]">
                                  <span className="text-xs font-semibold text-zinc-300">Ikon</span>
                                  <div className="flex items-center gap-1.5">
                                    {/* Segmented Control */}
                                    <div className="flex border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/80">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          console.log('[Editor CART Debug] Ikon dinonaktifkan');
                                          handleUpdateElement(editingSection.id, activeElement.id, { iconType: 'none', customIconSvg: '', icon: '' });
                                        }}
                                        className={`p-2 transition-all ${
                                          (activeElement.config.iconType || 'none') === 'none'
                                            ? 'bg-zinc-800 text-white'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                        }`}
                                      >
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <circle cx="12" cy="12" r="10" />
                                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          console.log('[Editor CART Debug] Membuka Media Library mode SVG untuk ikon custom');
                                          handleUpdateElement(editingSection.id, activeElement.id, { iconType: 'custom' });

                                          openMediaSvgModal((svgXml: string) => {
                                            console.log('[Editor CART Debug] SVG XML terpilih dari media library');
                                            handleUpdateElement(editingSection.id, activeElement.id, {
                                              customIconSvg: svgXml,
                                              icon: svgXml,
                                              iconType: 'custom'
                                            });
                                          });
                                        }}
                                        className={`p-2 border-l border-zinc-800 transition-all ${
                                          activeElement.config.iconType === 'custom'
                                            ? 'bg-zinc-800 text-white'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                        }`}
                                      >
                                        <Upload className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Preview Ikon SVG */}
                                    {(activeElement.config.customIconSvg || activeElement.config.icon) && (
                                      <div className="flex items-center justify-center p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 w-8 h-8 shrink-0">
                                        <img
                                          src={activeElement.config.customIconSvg || activeElement.config.icon}
                                          alt="icon preview"
                                          className="w-4 h-4 object-contain"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Baris Posisi Ikon */}
                                <div className="flex items-center justify-between gap-3 min-h-[36px]">
                                  <span className="text-xs font-semibold text-zinc-300">Posisi Ikon</span>
                                  <div className="flex border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/80">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        console.log('[Editor CART Debug] Posisi ikon diset ke Sebelum Teks');
                                        handleUpdateElement(editingSection.id, activeElement.id, { iconPosition: 'before' });
                                      }}
                                      className={`p-2 transition-all ${
                                        (activeElement.config.iconPosition || 'before') === 'before'
                                          ? 'bg-zinc-800 text-white'
                                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                      }`}
                                    >
                                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="4" y1="4" x2="4" y2="20" />
                                        <path d="M20 12H8" />
                                        <path d="M12 8l-4 4 4 4" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        console.log('[Editor CART Debug] Posisi ikon diset ke Sesudah Teks');
                                        handleUpdateElement(editingSection.id, activeElement.id, { iconPosition: 'after' });
                                      }}
                                      className={`p-2 border-l border-zinc-800 transition-all ${
                                        activeElement.config.iconPosition === 'after'
                                          ? 'bg-zinc-800 text-white'
                                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                      }`}
                                    >
                                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="20" y1="4" x2="20" y2="20" />
                                        <path d="M4 12h12" />
                                        <path d="M12 8l4 4-4 4" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>

                                {/* Baris Spasi Ikon */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-zinc-300">Spasi Ikon</span>
                                    <select
                                      value={activeElement.config.iconSpaceUnit || 'px'}
                                      onChange={(e) => {
                                        console.log(`[Editor CART Debug] Unit spasi ikon diubah ke: "${e.target.value}"`);
                                        handleUpdateElement(editingSection.id, activeElement.id, { iconSpaceUnit: e.target.value });
                                      }}
                                      className="bg-transparent text-[10px] text-zinc-500 border-none outline-none cursor-pointer font-bold focus:ring-0"
                                    >
                                      <option value="px" className="bg-zinc-950 text-zinc-300">px</option>
                                      <option value="rem" className="bg-zinc-950 text-zinc-300">rem</option>
                                    </select>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="range"
                                      min="0"
                                      max="40"
                                      value={activeElement.config.iconSpacing ?? 4}
                                      onChange={(e) => {
                                        console.log(`[Editor CART Debug] Spasi ikon diubah ke: ${e.target.value}`);
                                        handleUpdateElement(editingSection.id, activeElement.id, { iconSpacing: Number(e.target.value) });
                                      }}
                                      className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={activeElement.config.iconSpacing ?? 4}
                                      onChange={(e) => {
                                        console.log(`[Editor CART Debug] Input manual spasi ikon diubah ke: ${e.target.value}`);
                                        handleUpdateElement(editingSection.id, activeElement.id, { iconSpacing: Number(e.target.value) });
                                      }}
                                      className="w-[60px] p-1.5 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded-lg outline-none text-xs font-bold"
                                    />
                                  </div>
                                </div>

                                {/* Baris Warna Ikon */}
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-zinc-300 font-semibold">Warna Ikon</span>
                                  <div className="flex items-center gap-1">
                                    {activeElement.config.iconColor && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          console.log(`[Editor CART Debug] Warna ikon direset`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { iconColor: undefined });
                                        }}
                                        className="p-1 rounded hover:bg-zinc-800 transition-colors"
                                        title="Reset Warna Ikon"
                                      >
                                        <RotateCcw className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                                      </button>
                                    )}
                                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-7">
                                      <div className="relative w-8 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
                                        {activeElement.config.iconColor ? (
                                          <div className="w-full h-full rounded-md border border-zinc-800/80" style={{ backgroundColor: activeElement.config.iconColor }} />
                                        ) : (
                                          <div className="w-full h-full rounded-md border border-zinc-800/80 relative overflow-hidden bg-zinc-950">
                                            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, transparent 47%, #ef4444 47%, #ef4444 53%, transparent 53%)' }} />
                                          </div>
                                        )}
                                        <input
                                          type="color"
                                          value={activeElement.config.iconColor || '#ffffff'}
                                          onChange={(e) => {
                                            console.log(`[Editor CART Debug] Warna ikon diubah ke: ${e.target.value}`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconColor: e.target.value });
                                          }}
                                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Baris Ukuran Ikon */}
                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold uppercase text-zinc-500">Ukuran Ikon: {activeElement.config.iconSize || 20}px</span>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="range"
                                      min="8"
                                      max="64"
                                      value={activeElement.config.iconSize || 20}
                                      onChange={(e) => {
                                        console.log(`[Editor CART Debug] Ukuran ikon diubah ke: ${e.target.value}px`);
                                        handleUpdateElement(editingSection.id, activeElement.id, { iconSize: Number(e.target.value) });
                                      }}
                                      className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                    />
                                    <input
                                      type="number"
                                      min="8"
                                      max="128"
                                      value={activeElement.config.iconSize || 20}
                                      onChange={(e) => {
                                        console.log(`[Editor CART Debug] Input manual ukuran ikon diubah ke: ${e.target.value}px`);
                                        handleUpdateElement(editingSection.id, activeElement.id, { iconSize: Number(e.target.value) });
                                      }}
                                      className="w-[60px] p-1.5 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded-lg outline-none text-xs font-bold"
                                    />
                                  </div>
                                </div>

                              </div>
                            )}

                            {/* CATEGORY_LIST editor */}
                            {activeEditorTab === 'layout' && activeElement.type === 'CATEGORY_LIST' && (
                              <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Styling Daftar Kategori</span>

                                {activeSubFocus === 'header_title' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor CATEGORY_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Judul Seksi</span>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Judul Kategori</span>
                                      <input
                                        type="text"
                                        value={activeElement.config.title || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          console.log(`[Editor CATEGORY_LIST] Mengubah judul daftar kategori ke: "${val}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { title: val });
                                        }}
                                        className="w-full p-2.5 rounded-lg text-[11px] font-bold bg-zinc-950 text-white border border-zinc-800 focus:border-blue-500 outline-none"
                                      />
                                    </div>

                                    <TextStylingGroup
                                      prefix="title"
                                      label="Judul Seksi"
                                      defaultFontSize={22}
                                      activeElement={activeElement}
                                      editingSection={editingSection}
                                      handleUpdateElement={handleUpdateElement}
                                      activeDropdown={activeDropdown}
                                      setActiveDropdown={setActiveDropdown}
                                    />
                                  </div>
                                )}

                                {activeSubFocus === 'layout' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor CATEGORY_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Tata Letak & Kolom</span>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Tata Letak</span>
                                      <select
                                        value={activeElement.config.layout || 'slider'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          console.log(`[Editor CATEGORY_LIST] Mengubah layout daftar kategori ke: "${val}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { layout: val });
                                        }}
                                        className="w-full p-2.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-blue-500 outline-none cursor-pointer font-bold"
                                      >
                                        <option value="slider">Slider (Horizontal Scroll)</option>
                                        <option value="grid">Grid (Kolom Statis)</option>
                                      </select>
                                    </div>

                                    {(activeElement.config.layout || 'slider') === 'grid' && (
                                      <div className="space-y-1">
                                        <span className="text-[8px] font-bold uppercase text-zinc-500 flex justify-between">
                                          <span>Kolom Grid</span>
                                          <span className="text-blue-400 font-extrabold">{activeElement.config.columns ?? 5} Kolom</span>
                                        </span>
                                        <input
                                          type="range"
                                          min="2"
                                          max="8"
                                          value={activeElement.config.columns ?? 5}
                                          onChange={(e) => {
                                            const val = Number(e.target.value);
                                            console.log(`[Editor CATEGORY_LIST] Mengubah jumlah kolom grid kategori ke: ${val}`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { columns: val });
                                          }}
                                          className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {activeSubFocus === 'image' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor CATEGORY_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Gambar Ikon</span>

                                    <div className="space-y-1.5">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Bentuk Sudut Gambar</span>
                                      <select
                                        value={activeElement.config.borderRadius !== undefined ? activeElement.config.borderRadius : 9999}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          console.log(`[Editor CATEGORY_LIST] Mengubah border-radius gambar kategori ke: ${val}`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { borderRadius: val });
                                        }}
                                        className="w-full p-2.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-blue-500 outline-none cursor-pointer font-bold"
                                      >
                                        <option value={9999}>Bulat Penuh (Lingkaran)</option>
                                        <option value={16}>Sudut Halus (Rounded)</option>
                                        <option value={0}>Kotak Tajam (Sharp)</option>
                                      </select>
                                    </div>
                                  </div>
                                )}

                                {activeSubFocus === 'title' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor CATEGORY_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Teks Kategori</span>

                                    <TextStylingGroup
                                      prefix=""
                                      label="Judul Grid"
                                              defaultFontSize={14}
                                      activeElement={activeElement}
                                      editingSection={editingSection}
                                      handleUpdateElement={handleUpdateElement}
                                      activeDropdown={activeDropdown}
                                      setActiveDropdown={setActiveDropdown}
                                    />
                                  </div>
                                )}

                                {activeSubFocus === null && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 space-y-1">
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block">Fokus Sunting Elemen</span>
                                      <span className="text-[9px] text-zinc-400 block leading-relaxed font-medium">
                                        Klik area di kanvas atau pilih salah satu menu di bawah ini untuk menyunting detail elemen secara spesifik:
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('header_title');
                                          console.log('[Editor CATEGORY_LIST] Memilih sub-focus: header_title');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <AlignLeft className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Judul Utama</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('layout');
                                          console.log('[Editor CATEGORY_LIST] Memilih sub-focus: layout');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <Sliders className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Tata Letak</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('image');
                                          console.log('[Editor CATEGORY_LIST] Memilih sub-focus: image');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <ImageIcon className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Gambar Ikon</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('title');
                                          console.log('[Editor CATEGORY_LIST] Memilih sub-focus: title');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <Type className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Teks Nama</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* PRODUCT_LIST editor */}
                            {activeEditorTab === 'layout' && activeElement.type === 'PRODUCT_LIST' && (
                              <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Styling Daftar Produk</span>

                                {activeSubFocus === 'header_title' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor PRODUCT_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Judul Grid</span>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Judul Grid</span>
                                      <input
                                        type="text"
                                        value={activeElement.config.title || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          console.log(`[Editor PRODUCT_LIST] Mengubah judul grid ke: "${val}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { title: val });
                                        }}
                                        className="w-full p-2.5 rounded-lg text-[11px] font-bold bg-zinc-950 text-white border border-zinc-800 focus:border-blue-500 outline-none"
                                      />
                                    </div>

                                    <TextStylingGroup
                                      prefix="title"
                                      label="Judul Seksi"
                                      defaultFontSize={22}
                                      activeElement={activeElement}
                                      editingSection={editingSection}
                                      handleUpdateElement={handleUpdateElement}
                                      activeDropdown={activeDropdown}
                                      setActiveDropdown={setActiveDropdown}
                                    />
                                  </div>
                                )}

                                {activeSubFocus === 'layout' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor PRODUCT_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Tata Letak & Sumber Data</span>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Tata Letak Produk</span>
                                      <select
                                        value={activeElement.config.layout || 'grid'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          console.log(`[Editor PRODUCT_LIST] Mengubah layout ke: "${val}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { layout: val });
                                        }}
                                        className="w-full p-2.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-blue-500 outline-none cursor-pointer font-bold"
                                      >
                                        <option value="grid">Grid Statis (Baris x Kolom)</option>
                                        <option value="slider">Slider (Horizontal Scroll)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Sumber Data Produk</span>
                                      <select
                                        value={activeElement.config.source || 'ALL'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          console.log(`[Editor PRODUCT_LIST] Mengubah sumber data ke: "${val}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { source: val });
                                        }}
                                        className="w-full p-2.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-blue-500 outline-none cursor-pointer font-bold"
                                      >
                                        <option value="ALL">Semua Produk</option>
                                        <option value="CATEGORY">Berdasarkan Kategori</option>
                                        <option value="DISCOUNT">Hanya Produk Diskon</option>
                                      </select>
                                    </div>

                                    {(activeElement.config.source || 'ALL') === 'CATEGORY' && (
                                      <div className="space-y-1">
                                        <span className="text-[8px] font-bold uppercase text-zinc-500">Pilih Kategori Toko</span>
                                        <select
                                          value={activeElement.config.categoryId || ''}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            console.log(`[Editor PRODUCT_LIST] Mengubah kategori ke ID: "${val}"`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { categoryId: val });
                                          }}
                                          className="w-full p-2.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-blue-500 outline-none cursor-pointer font-bold"
                                        >
                                          <option value="">-- Pilih Kategori --</option>
                                          {(categories || []).map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                          ))}
                                        </select>
                                      </div>
                                    )}

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500 flex justify-between">
                                        <span>Batasi Jumlah Tampil</span>
                                        <span className="text-blue-400 font-extrabold">{activeElement.config.limit ?? 4} Item</span>
                                      </span>
                                      <input
                                        type="range"
                                        min="2"
                                        max="10"
                                        value={activeElement.config.limit ?? 4}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          console.log(`[Editor PRODUCT_LIST] Mengubah limit ke: ${val}`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { limit: val });
                                        }}
                                        className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                      />
                                    </div>
                                  </div>
                                )}

                                {activeSubFocus === 'card' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor PRODUCT_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Kartu Wadah</span>

                                    <BackgroundStylingGroup
                                      activeElement={activeElement}
                                      editingSection={editingSection}
                                      handleUpdateElement={handleUpdateElement}
                                      prefix="card"
                                    />

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500 flex justify-between">
                                        <span>Radius Sudut Kartu</span>
                                        <span className="text-blue-400 font-extrabold">{activeElement.config.cardBorderRadius ?? 16}px</span>
                                      </span>
                                      <input
                                        type="range"
                                        min="0"
                                        max="32"
                                        value={activeElement.config.cardBorderRadius ?? 16}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          console.log(`[Editor PRODUCT_LIST] Mengubah cardBorderRadius ke: ${val}`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { cardBorderRadius: val });
                                        }}
                                        className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Warna Border Kartu</span>
                                      <div className="flex gap-2">
                                        <input
                                          type="color"
                                          value={activeElement.config.cardBorderColor || '#f4f4f5'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            console.log(`[Editor PRODUCT_LIST] Mengubah cardBorderColor ke: "${val}"`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { cardBorderColor: val });
                                          }}
                                          className="w-10 h-8 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                        />
                                        <input
                                          type="text"
                                          value={activeElement.config.cardBorderColor || '#f4f4f5'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            handleUpdateElement(editingSection.id, activeElement.id, { cardBorderColor: val });
                                          }}
                                          className="flex-1 px-2.5 h-8 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Bayangan Kartu</span>
                                      <select
                                        value={activeElement.config.cardBoxShadow || 'soft'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          console.log(`[Editor PRODUCT_LIST] Mengubah cardBoxShadow ke: "${val}"`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { cardBoxShadow: val });
                                        }}
                                        className="w-full p-2.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-blue-500 outline-none cursor-pointer font-bold"
                                      >
                                        <option value="none">Tanpa Bayangan (Flat)</option>
                                        <option value="soft">Bayangan Lembut (Soft)</option>
                                        <option value="premium">Bayangan Mewah (Premium)</option>
                                        <option value="bold">Bayangan Tegas (Bold)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500 flex justify-between">
                                        <span>Padding Dalam Kartu</span>
                                        <span className="text-blue-400 font-extrabold">{activeElement.config.cardPadding ?? 14}px</span>
                                      </span>
                                      <input
                                        type="range"
                                        min="4"
                                        max="24"
                                        value={activeElement.config.cardPadding ?? 14}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          console.log(`[Editor PRODUCT_LIST] Mengubah cardPadding ke: ${val}`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { cardPadding: val });
                                        }}
                                        className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                      />
                                    </div>
                                  </div>
                                )}

                                {activeSubFocus === 'image' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor PRODUCT_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Gambar Produk</span>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500 flex justify-between">
                                        <span>Radius Sudut Gambar</span>
                                        <span className="text-blue-400 font-extrabold">{activeElement.config.imageBorderRadius ?? 16}px</span>
                                      </span>
                                      <input
                                        type="range"
                                        min="0"
                                        max="32"
                                        value={activeElement.config.imageBorderRadius ?? 16}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          console.log(`[Editor PRODUCT_LIST] Mengubah imageBorderRadius ke: ${val}`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { imageBorderRadius: val });
                                        }}
                                        className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500 flex justify-between">
                                        <span>Jarak Dalam Gambar (Padding)</span>
                                        <span className="text-blue-400 font-extrabold">{activeElement.config.imagePadding ?? 0}px</span>
                                      </span>
                                      <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        value={activeElement.config.imagePadding ?? 0}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          console.log(`[Editor PRODUCT_LIST] Mengubah imagePadding ke: ${val}`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { imagePadding: val });
                                        }}
                                        className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Latar Belakang Gambar</span>
                                      <div className="flex gap-2">
                                        <input
                                          type="color"
                                          value={activeElement.config.imageBgColor || '#F5F4F2'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            console.log(`[Editor PRODUCT_LIST] Mengubah imageBgColor ke: "${val}"`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { imageBgColor: val });
                                          }}
                                          className="w-10 h-8 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                        />
                                        <input
                                          type="text"
                                          value={activeElement.config.imageBgColor || '#F5F4F2'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            handleUpdateElement(editingSection.id, activeElement.id, { imageBgColor: val });
                                          }}
                                          className="flex-1 px-2.5 h-8 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {activeSubFocus === 'title' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor PRODUCT_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Nama Produk</span>

                                    <TextStylingGroup
                                      prefix="productName"
                                      label="Nama Produk"
                                              defaultFontSize={17}
                                      activeElement={activeElement}
                                      editingSection={editingSection}
                                      handleUpdateElement={handleUpdateElement}
                                      activeDropdown={activeDropdown}
                                      setActiveDropdown={setActiveDropdown}
                                    />
                                  </div>
                                )}

                                {activeSubFocus === 'price' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveSubFocus(null);
                                        console.log('[Editor PRODUCT_LIST] Kembali ke menu utama');
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-3 transition-colors duration-150"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Kembali ke Menu Utama</span>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">Sunting: Harga & Stok</span>

                                    <TextStylingGroup
                                      prefix="price"
                                      label="Harga Utama"
                                      defaultFontSize={14}
                                      activeElement={activeElement}
                                      editingSection={editingSection}
                                      handleUpdateElement={handleUpdateElement}
                                      activeDropdown={activeDropdown}
                                      setActiveDropdown={setActiveDropdown}
                                    />

                                    <TextStylingGroup
                                      prefix="discountPrice"
                                      label="Harga Coret"
                                      defaultFontSize={10}
                                      activeElement={activeElement}
                                      editingSection={editingSection}
                                      handleUpdateElement={handleUpdateElement}
                                      activeDropdown={activeDropdown}
                                      setActiveDropdown={setActiveDropdown}
                                    />

                                    <div className="flex items-center justify-between py-1 pt-2 border-t border-zinc-900/50 mt-1">
                                      <span className="text-[8px] font-bold uppercase text-zinc-500">Tampilkan Label Stok</span>
                                      <input
                                        type="checkbox"
                                        checked={activeElement.config.showStock !== false}
                                        onChange={(e) => {
                                          const val = e.target.checked;
                                          console.log(`[Editor PRODUCT_LIST] Mengubah showStock ke: ${val}`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { showStock: val });
                                        }}
                                        className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-zinc-950 border-zinc-800 cursor-pointer"
                                      />
                                    </div>

                                    {(activeElement.config.showStock !== false) && (
                                      <div className="space-y-4 pt-1.5 animate-in fade-in duration-200">
                                        <TextStylingGroup
                                          prefix="stock"
                                          label="Label Stok"
                                          defaultFontSize={9}
                                          activeElement={activeElement}
                                          editingSection={editingSection}
                                          handleUpdateElement={handleUpdateElement}
                                          activeDropdown={activeDropdown}
                                          setActiveDropdown={setActiveDropdown}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {activeSubFocus === null && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 space-y-1">
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block">Fokus Sunting Elemen</span>
                                      <span className="text-[9px] text-zinc-400 block leading-relaxed font-medium">
                                        Klik area di kanvas atau pilih salah satu menu di bawah ini untuk menyunting detail elemen secara spesifik:
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('header_title');
                                          console.log('[Editor PRODUCT_LIST] Memilih sub-focus: header_title');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <AlignLeft className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Judul Utama</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('layout');
                                          console.log('[Editor PRODUCT_LIST] Memilih sub-focus: layout');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <Sliders className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Tata Letak</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('card');
                                          console.log('[Editor PRODUCT_LIST] Memilih sub-focus: card');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <Box className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Kartu Wadah</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('image');
                                          console.log('[Editor PRODUCT_LIST] Memilih sub-focus: image');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <ImageIcon className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Gambar</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('title');
                                          console.log('[Editor PRODUCT_LIST] Memilih sub-focus: title');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <Type className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Nama Teks</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveSubFocus('price');
                                          console.log('[Editor PRODUCT_LIST] Memilih sub-focus: price');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 group"
                                      >
                                        <ShoppingBag className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Harga & Stok</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* UNIFIED GAYA TAB FOR SMALL ELEMENTS */}
                            {activeElement.type !== 'COLUMN' && activeEditorTab === 'style' && (
                              <div className="space-y-4 animate-in fade-in duration-200">
                                {activeElement.type === 'IMAGE' && (
                                  <div className="space-y-4">
                                    <div
                                      onClick={() => setEditorCollapse(prev => ({ ...prev, gambar: !(editorCollapse.gambar ?? true) }))}
                                      className="flex items-center justify-between border-b border-zinc-800 pb-2 cursor-pointer select-none"
                                    >
                                      <div className="flex items-center gap-1.5">
                                        {(editorCollapse.gambar ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Gambar</span>
                                      </div>
                                    </div>

                                    {(editorCollapse.gambar ?? true) && (
                                      <div className="space-y-4 animate-in fade-in duration-200">
                                        {/* Perataan */}
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-zinc-300 font-semibold">Perataan</span>
                                            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                          </div>
                                          <div className="flex border border-zinc-800 rounded-md overflow-hidden bg-zinc-950/20">
                                            {['left', 'center', 'right'].map((a, idx) => {
                                              const isActive = (activeElement.config.align || 'center') === a;
                                              const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : AlignRight;
                                              return (
                                                <button
                                                  key={a}
                                                  type="button"
                                                  onClick={() => {
                                                    console.log("[Editor IMAGE] Perataan gambar diperbarui ke:", a);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { align: a });
                                                  }}
                                                  className={`p-2 transition-all flex items-center justify-center cursor-pointer ${idx !== 2 ? 'border-r border-zinc-800' : ''
                                                    } ${isActive
                                                      ? 'bg-zinc-800 text-zinc-100'
                                                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20'
                                                    }`}
                                                >
                                                  <Icon className="w-4 h-4" />
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>

                                        {/* Lebar */}
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs text-zinc-300 font-semibold">Lebar</span>
                                              <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            <select
                                              value={String(activeElement.config.width || '100%').endsWith('px') ? 'px' : '%'}
                                              onChange={(e) => {
                                                const unit = e.target.value;
                                                const currentVal = parseInt(String(activeElement.config.width || '100')) || 100;
                                                const newVal = unit === '%' ? Math.min(currentVal, 100) : currentVal;
                                                console.log("[Editor IMAGE] Lebar unit diubah ke:", unit);
                                                handleUpdateElement(editingSection.id, activeElement.id, { width: `${newVal}${unit}` });
                                              }}
                                              className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold focus:border-zinc-700"
                                            >
                                              <option value="%">%</option>
                                              <option value="px">px</option>
                                            </select>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <input
                                              type="range"
                                              min="0"
                                              max={String(activeElement.config.width || '100%').endsWith('px') ? 1200 : 100}
                                              value={parseInt(String(activeElement.config.width || '100')) || 100}
                                              onChange={(e) => {
                                                const unit = String(activeElement.config.width || '100%').endsWith('px') ? 'px' : '%';
                                                handleUpdateElement(editingSection.id, activeElement.id, { width: `${e.target.value}${unit}` });
                                              }}
                                              className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                            />
                                            <input
                                              type="number"
                                              value={parseInt(String(activeElement.config.width || '100')) || 100}
                                              onChange={(e) => {
                                                const unit = String(activeElement.config.width || '100%').endsWith('px') ? 'px' : '%';
                                                handleUpdateElement(editingSection.id, activeElement.id, { width: `${e.target.value}${unit}` });
                                              }}
                                              className="w-14 h-7 text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded-md font-bold"
                                            />
                                          </div>
                                        </div>

                                        {/* Lebar Maksimum */}
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs text-zinc-300 font-semibold">Lebar Maksimum</span>
                                              <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            <select
                                              value={String(activeElement.config.maxWidth || '100%').endsWith('px') ? 'px' : '%'}
                                              onChange={(e) => {
                                                const unit = e.target.value;
                                                const currentVal = parseInt(String(activeElement.config.maxWidth || '100')) || 100;
                                                const newVal = unit === '%' ? Math.min(currentVal, 100) : currentVal;
                                                console.log("[Editor IMAGE] Lebar Maksimum unit diubah ke:", unit);
                                                handleUpdateElement(editingSection.id, activeElement.id, { maxWidth: `${newVal}${unit}` });
                                              }}
                                              className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold focus:border-zinc-700"
                                            >
                                              <option value="%">%</option>
                                              <option value="px">px</option>
                                            </select>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <input
                                              type="range"
                                              min="0"
                                              max={String(activeElement.config.maxWidth || '100%').endsWith('px') ? 1200 : 100}
                                              value={parseInt(String(activeElement.config.maxWidth || '100')) || 100}
                                              onChange={(e) => {
                                                const unit = String(activeElement.config.maxWidth || '100%').endsWith('px') ? 'px' : '%';
                                                handleUpdateElement(editingSection.id, activeElement.id, { maxWidth: `${e.target.value}${unit}` });
                                              }}
                                              className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                            />
                                            <input
                                              type="number"
                                              value={parseInt(String(activeElement.config.maxWidth || '100')) || 100}
                                              onChange={(e) => {
                                                const unit = String(activeElement.config.maxWidth || '100%').endsWith('px') ? 'px' : '%';
                                                handleUpdateElement(editingSection.id, activeElement.id, { maxWidth: `${e.target.value}${unit}` });
                                              }}
                                              className="w-14 h-7 text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded-md font-bold"
                                            />
                                          </div>
                                        </div>

                                        {/* Tinggi */}
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs text-zinc-300 font-semibold">Tinggi</span>
                                              <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            <select
                                              value={String(activeElement.config.height || 'auto') === 'auto' ? 'px' : (String(activeElement.config.height).endsWith('%') ? '%' : 'px')}
                                              onChange={(e) => {
                                                const unit = e.target.value;
                                                const currentVal = parseInt(String(activeElement.config.height || '300')) || 300;
                                                const newVal = unit === '%' ? Math.min(currentVal, 100) : currentVal;
                                                console.log("[Editor IMAGE] Tinggi unit diubah ke:", unit);
                                                handleUpdateElement(editingSection.id, activeElement.id, { height: `${newVal}${unit}` });
                                              }}
                                              className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold focus:border-zinc-700"
                                            >
                                              <option value="px">px</option>
                                              <option value="%">%</option>
                                            </select>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <input
                                              type="range"
                                              min="0"
                                              max={String(activeElement.config.height || 'auto').endsWith('%') ? 100 : 1000}
                                              value={String(activeElement.config.height || 'auto') === 'auto' ? 0 : (parseInt(String(activeElement.config.height)) || 300)}
                                              onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const unit = String(activeElement.config.height || 'auto').endsWith('%') ? '%' : 'px';
                                                handleUpdateElement(editingSection.id, activeElement.id, { height: val === 0 ? 'auto' : `${val}${unit}` });
                                              }}
                                              className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                            />
                                            <div className="flex items-center gap-1.5">
                                              {String(activeElement.config.height || 'auto') === 'auto' ? (
                                                <div className="w-14 h-7 flex items-center justify-center text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-400 rounded-md font-bold uppercase tracking-wider">
                                                  auto
                                                </div>
                                              ) : (
                                                <input
                                                  type="number"
                                                  value={parseInt(String(activeElement.config.height)) || 300}
                                                  onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    const unit = String(activeElement.config.height || 'auto').endsWith('%') ? '%' : 'px';
                                                    handleUpdateElement(editingSection.id, activeElement.id, { height: val === 0 ? 'auto' : `${val}${unit}` });
                                                  }}
                                                  className="w-14 h-7 text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded-md font-bold"
                                                />
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Keburaman */}
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-300 font-semibold">Keburaman</span>
                                            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <input
                                              type="range"
                                              min="0"
                                              max="100"
                                              value={activeElement.config.opacity !== undefined ? activeElement.config.opacity : 100}
                                              onChange={(e) => {
                                                handleUpdateElement(editingSection.id, activeElement.id, { opacity: Number(e.target.value) });
                                              }}
                                              className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                            />
                                            <div className="relative flex items-center justify-end">
                                              <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={activeElement.config.opacity !== undefined ? activeElement.config.opacity : 100}
                                                onChange={(e) => {
                                                  const val = Math.max(0, Math.min(100, Number(e.target.value)));
                                                  handleUpdateElement(editingSection.id, activeElement.id, { opacity: val });
                                                }}
                                                className="w-14 h-7 pr-4 text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-right rounded-md font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                              />
                                              <span className="absolute right-1.5 text-[10px] text-zinc-500 font-bold select-none">%</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* CSS Filters */}
                                        <div className="relative space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-300 font-semibold">CSS Filters</span>
                                            <div className="flex items-center gap-1.5">
                                              {/* Reset Button */}
                                              {((activeElement.config.blur !== undefined && activeElement.config.blur > 0) ||
                                                (activeElement.config.brightness !== undefined && activeElement.config.brightness !== 100) ||
                                                (activeElement.config.contrast !== undefined && activeElement.config.contrast !== 100) ||
                                                (activeElement.config.saturate !== undefined && activeElement.config.saturate !== 100) ||
                                                (activeElement.config.hueRotate !== undefined && activeElement.config.hueRotate > 0)) && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log("[Editor IMAGE] Reset CSS Filters");
                                                    handleUpdateElement(editingSection.id, activeElement.id, {
                                                      blur: 0,
                                                      brightness: 100,
                                                      contrast: 100,
                                                      saturate: 100,
                                                      hueRotate: 0
                                                    });
                                                  }}
                                                  className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                                                  title="Reset CSS Filters"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActivePopover(activePopover === 'cssFilters' ? null : 'cssFilters');
                                                }}
                                                className={`p-1 rounded transition-colors ${activePopover === 'cssFilters' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Popover CSS Filters */}
                                          {activePopover === 'cssFilters' && (
                                            <div 
                                              onClick={(e) => e.stopPropagation()}
                                              className="absolute right-0 top-full mt-2 w-64 bg-[#141417] border border-zinc-800 rounded-xl p-4 shadow-2xl z-50 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200 after:content-[''] after:absolute after:bottom-full after:right-4 after:border-8 after:border-transparent after:border-b-[#141417] before:content-[''] before:absolute before:bottom-full before:right-[15px] before:border-[9px] before:border-transparent before:border-b-zinc-800/80 before:-z-10"
                                            >
                                              {/* Header Popover */}
                                              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                                                <span className="text-xs font-bold text-zinc-300">CSS Filters</span>
                                                <div className="flex items-center gap-1.5">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, {
                                                        blur: 0,
                                                        brightness: 100,
                                                        contrast: 100,
                                                        saturate: 100,
                                                        hueRotate: 0
                                                      });
                                                    }}
                                                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                                                  >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => setActivePopover(null)}
                                                    className="p-1 rounded bg-zinc-805 text-zinc-100 transition-colors"
                                                  >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Blur */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Buram</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="20"
                                                    value={activeElement.config.blur !== undefined ? activeElement.config.blur : 0}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { blur: Number(e.target.value) })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="20"
                                                      value={activeElement.config.blur !== undefined ? activeElement.config.blur : 0}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { blur: Math.max(0, Math.min(20, Number(e.target.value))) })}
                                                      className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-650 font-bold select-none">px</span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Brightness */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Kecerahan</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="200"
                                                    value={activeElement.config.brightness !== undefined ? activeElement.config.brightness : 100}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { brightness: Number(e.target.value) })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="200"
                                                      value={activeElement.config.brightness !== undefined ? activeElement.config.brightness : 100}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { brightness: Math.max(0, Math.min(200, Number(e.target.value))) })}
                                                      className="w-12 h-6 pr-3 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-650 font-bold select-none">%</span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Contrast */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Kontras</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="200"
                                                    value={activeElement.config.contrast !== undefined ? activeElement.config.contrast : 100}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { contrast: Number(e.target.value) })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="200"
                                                      value={activeElement.config.contrast !== undefined ? activeElement.config.contrast : 100}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { contrast: Math.max(0, Math.min(200, Number(e.target.value))) })}
                                                      className="w-12 h-6 pr-3 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-650 font-bold select-none">%</span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Saturate */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Saturasi</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="200"
                                                    value={activeElement.config.saturate !== undefined ? activeElement.config.saturate : 100}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { saturate: Number(e.target.value) })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="200"
                                                      value={activeElement.config.saturate !== undefined ? activeElement.config.saturate : 100}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { saturate: Math.max(0, Math.min(200, Number(e.target.value))) })}
                                                      className="w-12 h-6 pr-3 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-650 font-bold select-none">%</span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Hue */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Hue</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="360"
                                                    value={activeElement.config.hueRotate !== undefined ? activeElement.config.hueRotate : 0}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { hueRotate: Number(e.target.value) })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="360"
                                                      value={activeElement.config.hueRotate !== undefined ? activeElement.config.hueRotate : 0}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { hueRotate: Math.max(0, Math.min(360, Number(e.target.value))) })}
                                                      className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-650 font-bold select-none">°</span>
                                                 </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Border Type */}
                                        <div className="relative space-y-2">
                                          <span className="text-xs text-zinc-300 font-semibold">Border Type</span>
                                          
                                          {/* Dropdown pemicu */}
                                          <div 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveDropdown(activeDropdown?.field === 'borderType' ? null : { field: 'borderType' });
                                            }}
                                            className="w-full p-2 rounded-xl text-xs bg-[#1a1a1f] text-zinc-150 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 select-none font-bold"
                                          >
                                            <span>
                                              {activeElement.config.borderStyle === 'none' || !activeElement.config.borderStyle ? 'Asali' : 
                                               activeElement.config.borderStyle === 'solid' ? 'Solid' :
                                               activeElement.config.borderStyle === 'double' ? 'Ganda' :
                                               activeElement.config.borderStyle === 'dotted' ? 'Titik' :
                                               activeElement.config.borderStyle === 'dashed' ? 'Garis' :
                                               activeElement.config.borderStyle === 'groove' ? 'Groove' : 'Asali'}
                                            </span>
                                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                          </div>

                                          {/* Menu Dropdown list (seperti Gambar 5) */}
                                          {activeDropdown?.field === 'borderType' && (
                                            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#141417] border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                                              {[
                                                { label: 'Asali', value: 'none' },
                                                { label: 'Tidak Ada', value: 'none_explicit' },
                                                { label: 'Solid', value: 'solid' },
                                                { label: 'Ganda', value: 'double' },
                                                { label: 'Titik', value: 'dotted' },
                                                { label: 'Garis', value: 'dashed' },
                                                { label: 'Groove', value: 'groove' }
                                              ].map((opt) => {
                                                const currentVal = activeElement.config.borderStyle || 'none';
                                                const isSelected = opt.value === 'none_explicit' ? currentVal === 'none' : currentVal === opt.value;
                                                return (
                                                  <div
                                                    key={opt.label}
                                                    onClick={() => {
                                                      const styleVal = opt.value === 'none_explicit' ? 'none' : opt.value;
                                                      console.log("[Editor IMAGE] Border style diperbarui ke:", styleVal);
                                                      handleUpdateElement(editingSection.id, activeElement.id, { borderStyle: styleVal });
                                                      setActiveDropdown(null);
                                                    }}
                                                    className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                                                      isSelected 
                                                        ? 'bg-blue-600/90 text-white font-bold' 
                                                        : 'text-zinc-300 hover:bg-zinc-800/40'
                                                    }`}
                                                  >
                                                    {opt.label}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                        {activeElement.config.borderStyle && activeElement.config.borderStyle !== 'none' && (
                                          <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
                                            {/* Lebar Batas */}
                                            <div className="space-y-1.5">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-xs text-zinc-300 font-semibold">Lebar Batas</span>
                                                  <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                                </div>
                                                <select
                                                  value={activeElement.config.borderWidthUnit || 'px'}
                                                  onChange={(e) => {
                                                    console.log("[Editor IMAGE] Lebar Batas unit diperbarui ke:", e.target.value);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { borderWidthUnit: e.target.value });
                                                  }}
                                                  className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold focus:border-zinc-700"
                                                >
                                                  <option value="px">px</option>
                                                  <option value="em">em</option>
                                                </select>
                                              </div>

                                              <div>
                                                <div className="flex rounded-[4px] border border-zinc-800 bg-transparent divide-x divide-zinc-800 overflow-hidden h-8">
                                                  {[
                                                    { key: 'borderWidthTop', legacyFallback: activeElement.config.borderWidth ?? 0 },
                                                    { key: 'borderWidthRight', legacyFallback: activeElement.config.borderWidth ?? 0 },
                                                    { key: 'borderWidthBottom', legacyFallback: activeElement.config.borderWidth ?? 0 },
                                                    { key: 'borderWidthLeft', legacyFallback: activeElement.config.borderWidth ?? 0 }
                                                  ].map((side) => {
                                                    const val = activeElement.config[side.key] !== undefined 
                                                      ? activeElement.config[side.key] 
                                                      : side.legacyFallback;
                                                    return (
                                                      <input
                                                        key={side.key}
                                                        type="number"
                                                        min="0"
                                                        value={val}
                                                        onChange={(e) => {
                                                          const numVal = Math.max(0, Number(e.target.value));
                                                          if (borderWidthLink) {
                                                            handleUpdateElement(editingSection.id, activeElement.id, {
                                                              borderWidth: numVal,
                                                              borderWidthTop: numVal,
                                                              borderWidthRight: numVal,
                                                              borderWidthBottom: numVal,
                                                              borderWidthLeft: numVal,
                                                              borderWidthType: 'custom'
                                                            });
                                                          } else {
                                                            handleUpdateElement(editingSection.id, activeElement.id, {
                                                              [side.key]: numVal,
                                                              borderWidthType: 'custom'
                                                            });
                                                          }
                                                        }}
                                                        className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-xs text-zinc-150 font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/10"
                                                      />
                                                    );
                                                  })}

                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setBorderWidthLink(!borderWidthLink);
                                                      if (!borderWidthLink) {
                                                        const topVal = activeElement.config.borderWidthTop ?? activeElement.config.borderWidth ?? 0;
                                                        handleUpdateElement(editingSection.id, activeElement.id, {
                                                          borderWidth: topVal,
                                                          borderWidthTop: topVal,
                                                          borderWidthRight: topVal,
                                                          borderWidthBottom: topVal,
                                                          borderWidthLeft: topVal
                                                        });
                                                      }
                                                    }}
                                                    className={`w-9 shrink-0 flex items-center justify-center transition-all ${
                                                      borderWidthLink 
                                                        ? 'bg-blue-600/10 text-blue-400' 
                                                        : 'bg-zinc-800/30 text-zinc-500 hover:text-zinc-300'
                                                    }`}
                                                    title={borderWidthLink ? "Putuskan tautan sisi" : "Tautkan semua sisi"}
                                                  >
                                                    <Link2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>

                                                <div className="flex pr-9 text-center text-[9px] text-zinc-555 font-bold select-none mt-1">
                                                  <span className="flex-1">Atas</span>
                                                  <span className="flex-1">Kanan</span>
                                                  <span className="flex-1">Bawah</span>
                                                  <span className="flex-1">Kiri</span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Warna Batas */}
                                            <div className="space-y-2">
                                              <span className="text-xs text-zinc-300 font-semibold">Warna Batas</span>
                                              <div className="flex items-center gap-2">
                                                <div className="flex flex-1 gap-1.5 items-center">
                                                  <input
                                                    type="color"
                                                    value={activeElement.config.borderColor || '#000000'}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { borderColor: e.target.value })}
                                                    className="w-8 h-8 rounded-[4px] bg-[#1a1a1f] border border-zinc-800 cursor-pointer p-0.5"
                                                  />
                                                  <input
                                                    type="text"
                                                    value={activeElement.config.borderColor || ''}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { borderColor: e.target.value })}
                                                    placeholder="#000000"
                                                    className="flex-1 px-2.5 h-8 rounded-[4px] text-xs bg-[#1a1a1f] text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Radius Batas */}
                                        <div className="space-y-1.5">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs text-zinc-300 font-semibold">Radius Batas</span>
                                              <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            
                                            {/* Dropdown unit px / % */}
                                            <select
                                              value={activeElement.config.borderRadiusUnit || 'px'}
                                              onChange={(e) => {
                                                const unit = e.target.value;
                                                console.log("[Editor IMAGE] Radius Batas unit diperbarui ke:", unit);
                                                handleUpdateElement(editingSection.id, activeElement.id, { borderRadiusUnit: unit });
                                              }}
                                              className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold focus:border-zinc-700"
                                            >
                                              <option value="px">px</option>
                                              <option value="%">%</option>
                                            </select>
                                          </div>

                                          {/* 4 Kotak input rapat horizontal dengan tombol rantai */}
                                          <div>
                                            <div className="flex rounded-[4px] border border-zinc-800 bg-transparent divide-x divide-zinc-800 overflow-hidden h-8">
                                              {[
                                                { key: 'borderRadiusTop', legacyFallback: activeElement.config.borderRadius ?? 0 },
                                                { key: 'borderRadiusRight', legacyFallback: activeElement.config.borderRadius ?? 0 },
                                                { key: 'borderRadiusBottom', legacyFallback: activeElement.config.borderRadius ?? 0 },
                                                { key: 'borderRadiusLeft', legacyFallback: activeElement.config.borderRadius ?? 0 }
                                              ].map((corner) => {
                                                const val = activeElement.config[corner.key] !== undefined 
                                                  ? activeElement.config[corner.key] 
                                                  : corner.legacyFallback;
                                                return (
                                                  <input
                                                    key={corner.key}
                                                    type="number"
                                                    min="0"
                                                    value={val}
                                                    onChange={(e) => {
                                                      const numVal = Math.max(0, Number(e.target.value));
                                                      if (borderRadiusLink) {
                                                        handleUpdateElement(editingSection.id, activeElement.id, {
                                                          borderRadius: numVal,
                                                          borderRadiusTop: numVal,
                                                          borderRadiusRight: numVal,
                                                          borderRadiusBottom: numVal,
                                                          borderRadiusLeft: numVal,
                                                          borderRadiusType: 'custom'
                                                        });
                                                      } else {
                                                        handleUpdateElement(editingSection.id, activeElement.id, {
                                                          [corner.key]: numVal,
                                                          borderRadiusType: 'custom'
                                                        });
                                                      }
                                                    }}
                                                    className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-xs text-zinc-150 font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/10"
                                                  />
                                                );
                                              })}

                                              {/* Link Button */}
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setBorderRadiusLink(!borderRadiusLink);
                                                  if (!borderRadiusLink) {
                                                    const topVal = activeElement.config.borderRadiusTop ?? activeElement.config.borderRadius ?? 0;
                                                    handleUpdateElement(editingSection.id, activeElement.id, {
                                                      borderRadius: topVal,
                                                      borderRadiusTop: topVal,
                                                      borderRadiusRight: topVal,
                                                      borderRadiusBottom: topVal,
                                                      borderRadiusLeft: topVal
                                                    });
                                                  }
                                                }}
                                                className={`w-9 shrink-0 flex items-center justify-center transition-all ${
                                                  borderRadiusLink 
                                                    ? 'bg-blue-600/10 text-blue-400' 
                                                    : 'bg-zinc-800/30 text-zinc-500 hover:text-zinc-300'
                                                }`}
                                                title={borderRadiusLink ? "Putuskan tautan sudut" : "Tautkan semua sudut"}
                                              >
                                                <Link2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>

                                            <div className="flex pr-9 text-center text-[9px] text-zinc-555 font-bold select-none mt-1">
                                              <span className="flex-1">Atas</span>
                                              <span className="flex-1">Kanan</span>
                                              <span className="flex-1">Bawah</span>
                                              <span className="flex-1">Kiri</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Box Shadow */}
                                        <div className="relative space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-300 font-semibold">Box Shadow</span>
                                            <div className="flex items-center gap-1.5">
                                              {/* Reset Button */}
                                              {activeElement.config.boxShadowType === 'custom' && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log("[Editor IMAGE] Reset Box Shadow");
                                                    handleUpdateElement(editingSection.id, activeElement.id, {
                                                      boxShadowType: 'none',
                                                      boxShadow: 'none'
                                                    });
                                                  }}
                                                  className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                                                  title="Reset Box Shadow"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActivePopover(activePopover === 'boxShadow' ? null : 'boxShadow');
                                                }}
                                                className={`p-1 rounded transition-colors ${activePopover === 'boxShadow' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Popover Box Shadow */}
                                          {activePopover === 'boxShadow' && (
                                            <div 
                                              onClick={(e) => e.stopPropagation()}
                                              className="absolute right-0 top-full mt-2 w-64 bg-[#141417] border border-zinc-800 rounded-xl p-4 shadow-2xl z-50 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200 after:content-[''] after:absolute after:bottom-full after:right-4 after:border-8 after:border-transparent after:border-b-[#141417] before:content-[''] before:absolute before:bottom-full before:right-[15px] before:border-[9px] before:border-transparent before:border-b-zinc-800/80 before:-z-10"
                                            >
                                              {/* Header Popover */}
                                              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                                                <span className="text-xs font-bold text-zinc-300">Box Shadow</span>
                                                <div className="flex items-center gap-1.5">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, {
                                                        boxShadowType: 'none',
                                                        boxShadow: 'none'
                                                      });
                                                    }}
                                                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                                                  >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => setActivePopover(null)}
                                                    className="p-1 rounded bg-zinc-800 text-zinc-100 transition-colors"
                                                  >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Shadow Color */}
                                              <div className="space-y-1.5">
                                                <span className="text-[10px] font-bold uppercase text-zinc-500">Warna</span>
                                                <div className="flex gap-2">
                                                  <input
                                                    type="color"
                                                    value={activeElement.config.shadowColor ? (activeElement.config.shadowColor.startsWith('rgba') ? '#000000' : activeElement.config.shadowColor) : '#000000'}
                                                    onChange={(e) => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { 
                                                        shadowColor: e.target.value,
                                                        boxShadowType: 'custom'
                                                      });
                                                    }}
                                                    className="w-10 h-7 rounded bg-zinc-950 border border-zinc-855 cursor-pointer p-0.5"
                                                  />
                                                  <input
                                                    type="text"
                                                    value={activeElement.config.shadowColor || 'rgba(0,0,0,0.5)'}
                                                    onChange={(e) => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { 
                                                        shadowColor: e.target.value,
                                                        boxShadowType: 'custom'
                                                      });
                                                    }}
                                                    placeholder="rgba(0,0,0,0.5)"
                                                    className="flex-1 px-2 h-7 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-850 focus:border-zinc-700 outline-none font-bold"
                                                  />
                                                </div>
                                              </div>

                                              {/* Offset X (Mendatar) */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Mendatar</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="-50"
                                                    max="50"
                                                    value={activeElement.config.shadowOffsetX !== undefined ? activeElement.config.shadowOffsetX : 0}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { shadowOffsetX: Number(e.target.value), boxShadowType: 'custom' })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="-50"
                                                      max="50"
                                                      value={activeElement.config.shadowOffsetX !== undefined ? activeElement.config.shadowOffsetX : 0}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { shadowOffsetX: Math.max(-50, Math.min(50, Number(e.target.value))), boxShadowType: 'custom' })}
                                                      className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-655 font-bold select-none">px</span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Offset Y (Vertikal) */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Vertikal</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="-50"
                                                    max="50"
                                                    value={activeElement.config.shadowOffsetY !== undefined ? activeElement.config.shadowOffsetY : 0}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { shadowOffsetY: Number(e.target.value), boxShadowType: 'custom' })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="-50"
                                                      max="50"
                                                      value={activeElement.config.shadowOffsetY !== undefined ? activeElement.config.shadowOffsetY : 0}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { shadowOffsetY: Math.max(-50, Math.min(50, Number(e.target.value))), boxShadowType: 'custom' })}
                                                      className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-655 font-bold select-none">px</span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Blur */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Buram</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={activeElement.config.shadowBlur !== undefined ? activeElement.config.shadowBlur : 10}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { shadowBlur: Number(e.target.value), boxShadowType: 'custom' })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="100"
                                                      value={activeElement.config.shadowBlur !== undefined ? activeElement.config.shadowBlur : 10}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { shadowBlur: Math.max(0, Math.min(100, Number(e.target.value))), boxShadowType: 'custom' })}
                                                      className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-655 font-bold select-none">px</span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Spread */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                  <span>Menyebar</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="range"
                                                    min="-50"
                                                    max="50"
                                                    value={activeElement.config.shadowSpread !== undefined ? activeElement.config.shadowSpread : 0}
                                                    onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { shadowSpread: Number(e.target.value), boxShadowType: 'custom' })}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <div className="relative flex items-center justify-end">
                                                    <input
                                                      type="number"
                                                      min="-50"
                                                      max="50"
                                                      value={activeElement.config.shadowSpread !== undefined ? activeElement.config.shadowSpread : 0}
                                                      onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { shadowSpread: Math.max(-50, Math.min(50, Number(e.target.value))), boxShadowType: 'custom' })}
                                                      className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                    />
                                                    <span className="absolute right-1 text-[8px] text-zinc-655 font-bold select-none">px</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* GALLERY STYLE EDITOR */}
                                  {activeElement.type === 'GALLERY' && (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                      <div
                                        onClick={() => setEditorCollapse(prev => ({ ...prev, galleryGambar: !(editorCollapse.galleryGambar ?? true) }))}
                                        className="flex items-center justify-between border-b border-zinc-800 pb-2 cursor-pointer select-none"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          {(editorCollapse.galleryGambar ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Gambar</span>
                                        </div>
                                      </div>

                                      {(editorCollapse.galleryGambar ?? true) && (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                          {/* Jarak */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs text-zinc-300 font-semibold">Jarak</span>
                                              <select
                                                value={activeElement.config.gapMode || 'asali'}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  console.log('[Editor GALLERY] Jarak mode diubah ke:', val);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { gapMode: val });
                                                }}
                                                className="px-2 py-1 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-medium focus:border-zinc-700 min-w-[120px]"
                                              >
                                                <option value="asali">Asali</option>
                                                <option value="khusus">Khusus</option>
                                              </select>
                                            </div>

                                            {activeElement.config.gapMode === 'khusus' && (
                                              <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-450 uppercase">
                                                  <span>Custom Gap</span>
                                                  <select
                                                    value="px"
                                                    disabled
                                                    className="px-1 py-0.5 rounded text-[10px] bg-[#1a1a1f] text-zinc-450 border border-zinc-800 outline-none cursor-not-allowed font-bold"
                                                  >
                                                    <option value="px">px</option>
                                                  </select>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={activeElement.config.gap !== undefined ? activeElement.config.gap : 15}
                                                    onChange={(e) => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { gap: Number(e.target.value) });
                                                    }}
                                                    className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                  <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={activeElement.config.gap !== undefined ? activeElement.config.gap : 15}
                                                    onChange={(e) => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { gap: Math.max(0, Math.min(100, Number(e.target.value))) });
                                                    }}
                                                    className="w-14 h-7 text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded-md font-bold"
                                                  />
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                          <div className="h-px bg-zinc-800/80 my-2" />

                                          {/* Border Type */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-300 font-semibold">Border Type</span>
                                            <select
                                              value={activeElement.config.borderStyle || 'Asali'}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                console.log('[Editor GALLERY] Border Type diubah ke:', val);
                                                handleUpdateElement(editingSection.id, activeElement.id, { borderStyle: val });
                                              }}
                                              className="px-2 py-1 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-medium focus:border-zinc-700 min-w-[120px]"
                                            >
                                              <option value="Asali">Asali</option>
                                              <option value="solid">Solid</option>
                                              <option value="double">Double</option>
                                              <option value="dotted">Dotted</option>
                                              <option value="dashed">Dashed</option>
                                              <option value="groove">Groove</option>
                                              <option value="ridge">Ridge</option>
                                              <option value="none">None</option>
                                            </select>
                                          </div>

                                          {/* Lebar Batas - muncul saat border type aktif */}
                                          {activeElement.config.borderStyle && activeElement.config.borderStyle !== 'Asali' && activeElement.config.borderStyle !== 'none' && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                                              {/* Lebar Batas */}
                                              <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-xs text-zinc-300 font-semibold">Lebar Batas</span>
                                                    <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                                  </div>
                                                  <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none">px ▾</div>
                                                </div>

                                                <div className="flex gap-1 items-start">
                                                  <div className="flex-1 flex flex-col">
                                                    <div className="flex rounded-[4px] border border-zinc-800 bg-transparent divide-x divide-zinc-800 overflow-hidden h-8">
                                                      {[
                                                        { key: 'borderWidthTop', label: 'Atas' },
                                                        { key: 'borderWidthRight', label: 'Kanan' },
                                                        { key: 'borderWidthBottom', label: 'Bawah' },
                                                        { key: 'borderWidthLeft', label: 'Kiri' }
                                                      ].map((side) => {
                                                        const val = activeElement.config[side.key] !== undefined
                                                          ? activeElement.config[side.key]
                                                          : (activeElement.config.borderWidth ?? 1);
                                                        return (
                                                          <input
                                                            key={side.key}
                                                            type="number"
                                                            min="0"
                                                            value={val}
                                                            onChange={(e) => {
                                                              const numVal = Math.max(0, Number(e.target.value));
                                                              console.log(`[Editor GALLERY] ${side.key} diubah ke: ${numVal}`);
                                                              if (borderWidthLink) {
                                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                                  borderWidth: numVal,
                                                                  borderWidthTop: numVal,
                                                                  borderWidthRight: numVal,
                                                                  borderWidthBottom: numVal,
                                                                  borderWidthLeft: numVal
                                                                });
                                                              } else {
                                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                                  [side.key]: numVal
                                                                });
                                                              }
                                                            }}
                                                            className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-xs text-zinc-100 font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/10"
                                                          />
                                                        );
                                                      })}

                                                      {/* Link Button */}
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setBorderWidthLink(!borderWidthLink);
                                                          if (!borderWidthLink) {
                                                            const topVal = activeElement.config.borderWidthTop ?? activeElement.config.borderWidth ?? 1;
                                                            handleUpdateElement(editingSection.id, activeElement.id, {
                                                              borderWidth: topVal,
                                                              borderWidthTop: topVal,
                                                              borderWidthRight: topVal,
                                                              borderWidthBottom: topVal,
                                                              borderWidthLeft: topVal
                                                            });
                                                          }
                                                        }}
                                                        className={borderWidthLink
                                                          ? "w-9 shrink-0 flex items-center justify-center transition-all bg-blue-600/10 text-blue-400"
                                                          : "w-9 shrink-0 flex items-center justify-center transition-all bg-zinc-800/30 text-zinc-500 hover:text-zinc-300"}
                                                        title={borderWidthLink ? "Putuskan tautan lebar" : "Tautkan semua sisi"}
                                                      >
                                                        <Link2 className="w-3.5 h-3.5" />
                                                      </button>
                                                    </div>

                                                    <div className="flex pr-9 text-center text-[9px] text-zinc-500 font-bold select-none mt-1">
                                                      <span className="flex-1">Atas</span>
                                                      <span className="flex-1">Kanan</span>
                                                      <span className="flex-1">Bawah</span>
                                                      <span className="flex-1">Kiri</span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Warna Batas */}
                                              <div className="flex justify-between items-center">
                                                <span className="text-xs text-zinc-300 font-semibold">Warna Batas</span>
                                                <div className="flex items-center gap-1.5">
                                                  <div className="relative w-7 h-7 rounded-md border border-zinc-800 overflow-hidden cursor-pointer hover:border-zinc-600 transition-colors">
                                                    <div
                                                      className="w-full h-full"
                                                      style={{ backgroundColor: activeElement.config.borderColor || '#000000' }}
                                                    />
                                                    <input
                                                      type="color"
                                                      value={activeElement.config.borderColor || '#000000'}
                                                      onChange={(e) => {
                                                        console.log('[Editor GALLERY] Warna Batas diubah ke:', e.target.value);
                                                        handleUpdateElement(editingSection.id, activeElement.id, { borderColor: e.target.value });
                                                      }}
                                                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { borderColor: '' });
                                                      console.log('[Editor GALLERY] Warna Batas direset');
                                                    }}
                                                    className="w-7 h-7 rounded-md border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:border-red-800/40 transition-colors"
                                                    title="Hapus warna batas"
                                                  >
                                                    <Eraser className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {/* Radius Batas */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-300 font-semibold">Radius Batas</span>
                                                <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                              </div>
                                              
                                              {/* Dropdown unit px / % */}
                                              <select
                                                value={activeElement.config.borderRadiusUnit || 'px'}
                                                onChange={(e) => {
                                                  const unit = e.target.value;
                                                  console.log("[Editor GALLERY] Radius Batas unit diperbarui ke:", unit);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { borderRadiusUnit: unit });
                                                }}
                                                className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold focus:border-zinc-700"
                                              >
                                                <option value="px">px</option>
                                                <option value="%">%</option>
                                              </select>
                                            </div>

                                            {/* 4 Kotak input rapat horizontal dengan tombol rantai */}
                                            <div>
                                              <div className="flex rounded-[4px] border border-zinc-800 bg-transparent divide-x divide-zinc-800 overflow-hidden h-8">
                                                {[
                                                  { key: 'borderRadiusTop', legacyFallback: activeElement.config.borderRadius ?? 8, label: 'Atas' },
                                                  { key: 'borderRadiusRight', legacyFallback: activeElement.config.borderRadius ?? 8, label: 'Kanan' },
                                                  { key: 'borderRadiusBottom', legacyFallback: activeElement.config.borderRadius ?? 8, label: 'Bawah' },
                                                  { key: 'borderRadiusLeft', legacyFallback: activeElement.config.borderRadius ?? 8, label: 'Kiri' }
                                                ].map((corner) => {
                                                  const val = activeElement.config[corner.key] !== undefined 
                                                    ? activeElement.config[corner.key] 
                                                    : corner.legacyFallback;
                                                  return (
                                                    <input
                                                      key={corner.key}
                                                      type="number"
                                                      min="0"
                                                      value={val}
                                                      onChange={(e) => {
                                                        const numVal = Math.max(0, Number(e.target.value));
                                                        if (borderRadiusLink) {
                                                          handleUpdateElement(editingSection.id, activeElement.id, {
                                                            borderRadius: numVal,
                                                            borderRadiusTop: numVal,
                                                            borderRadiusRight: numVal,
                                                            borderRadiusBottom: numVal,
                                                            borderRadiusLeft: numVal,
                                                            borderRadiusType: 'custom'
                                                          });
                                                        } else {
                                                          handleUpdateElement(editingSection.id, activeElement.id, {
                                                            [corner.key]: numVal,
                                                            borderRadiusType: 'custom'
                                                          });
                                                        }
                                                      }}
                                                      className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-xs text-zinc-150 font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/10"
                                                    />
                                                  );
                                                })}

                                                {/* Link Button */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setBorderRadiusLink(!borderRadiusLink);
                                                    if (!borderRadiusLink) {
                                                      const topVal = activeElement.config.borderRadiusTop ?? activeElement.config.borderRadius ?? 8;
                                                      handleUpdateElement(editingSection.id, activeElement.id, {
                                                        borderRadius: topVal,
                                                        borderRadiusTop: topVal,
                                                        borderRadiusRight: topVal,
                                                        borderRadiusBottom: topVal,
                                                        borderRadiusLeft: topVal
                                                      });
                                                    }
                                                  }}
                                                  className={borderRadiusLink 
                                                    ? "w-9 shrink-0 flex items-center justify-center transition-all bg-blue-600/10 text-blue-400" 
                                                    : "w-9 shrink-0 flex items-center justify-center transition-all bg-zinc-800/30 text-zinc-500 hover:text-zinc-300"}
                                                  title={borderRadiusLink ? "Putuskan tautan sudut" : "Tautkan semua sudut"}
                                                >
                                                  <Link2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>

                                              <div className="flex pr-9 text-center text-[9px] text-zinc-500 font-bold select-none mt-1">
                                                <span className="flex-1">Atas</span>
                                                <span className="flex-1">Kanan</span>
                                                <span className="flex-1">Bawah</span>
                                                <span className="flex-1">Kiri</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Accordion: Desain & Tampilan (PARAGRAPH/TEXT) */}
                                  {activeElement.type === 'TEXT' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    {/* Perataan */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-zinc-300 font-semibold">Perataan</span>
                                        <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                      </div>
                                      <div className="flex border border-zinc-800 rounded-[4px] overflow-hidden bg-zinc-950/20">
                                        {['left', 'center', 'right', 'justify'].map((a, idx) => {
                                          const isActive = (activeElement.config.align || 'left') === a;
                                          const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : a === 'right' ? AlignRight : AlignJustify;
                                          return (
                                            <button
                                              key={a}
                                              type="button"
                                              onClick={() => {
                                                console.log("[Editor TEXT] Perataan diperbarui ke:", a);
                                                handleUpdateElement(editingSection.id, activeElement.id, { align: a });
                                              }}
                                              className={`p-2 transition-all flex items-center justify-center cursor-pointer ${idx !== 3 ? 'border-r border-zinc-800' : ''
                                                } ${isActive
                                                  ? 'bg-zinc-800 text-zinc-100'
                                                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20'
                                                }`}
                                            >
                                              <Icon className="w-3.5 h-3.5" />
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Penulisan (Typography) */}
                                    <div className="flex items-center justify-between relative">
                                      <span className="text-xs text-zinc-300 font-semibold">Penulisan</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log("[Editor TEXT] Toggle popover penulisan");
                                          setActiveDropdown(activeDropdown?.field === 'text_penulisan' ? null : { field: 'text_penulisan' });
                                        }}
                                        className={`w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center transition-all ${
                                          activeDropdown?.field === 'text_penulisan' 
                                            ? 'bg-zinc-800 text-white' 
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                                        }`}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      
                                      {/* Popover Penulisan */}
                                      {activeDropdown?.field === 'text_penulisan' && (
                                        <div 
                                          onClick={(e) => e.stopPropagation()}
                                          className="absolute right-0 top-full mt-2 w-[280px] bg-[#18181b] border border-zinc-800 rounded-[4px] p-3 z-50 shadow-2xl space-y-3.5 text-left animate-in fade-in slide-in-from-top-2 duration-150"
                                        >
                                          {/* Popover Header */}
                                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                            <span className="text-xs font-bold text-zinc-200">Penulisan</span>
                                            <div className="flex items-center gap-2">
                                              <button 
                                                type="button" 
                                                onClick={() => {
                                                  console.log("[Editor TEXT] Reset typography");
                                                  handleUpdateElement(editingSection.id, activeElement.id, {
                                                    fontFamily: 'Inter',
                                                    fontSize: '16px',
                                                    fontWeight: 'normal',
                                                    lineHeight: '1.6px',
                                                    letterSpacing: '0px',
                                                    textTransform: 'none',
                                                    fontStyle: 'normal',
                                                    textDecoration: 'none',
                                                    wordSpacing: '0px'
                                                  });
                                                }}
                                                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                                title="Reset Penulisan"
                                              >
                                                <RotateCcw className="w-3 h-3" />
                                              </button>
                                              <button 
                                                type="button" 
                                                onClick={() => {
                                                  console.log("[Editor TEXT] Add style option");
                                                }}
                                                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                              >
                                                <Plus className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Family */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Family</span>
                                            <select
                                              value={activeElement.config.fontFamily || 'Inter'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontFamily: e.target.value })}
                                              className="w-36 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="inherit" className="bg-zinc-900 text-zinc-150 font-normal">Asali (Inherit)</option>
                                              {POPULAR_FONTS.map(cat => (
                                                <optgroup key={cat.category} label={cat.category} className="bg-zinc-950 text-zinc-300 font-bold">
                                                  {cat.fonts.map(f => (
                                                    <option key={f.value} value={f.value} className="bg-zinc-900 text-zinc-100 font-normal">{f.label}</option>
                                                  ))}
                                                </optgroup>
                                              ))}
                                            </select>
                                          </div>

                                          {/* Ukuran */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Ukuran</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <select
                                                value={String(activeElement.config.fontSize || '30px').replace(/[0-9.]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseInt(String(activeElement.config.fontSize || '30')) || 16;
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: `${num}${e.target.value}` });
                                                }}
                                                className="px-1 py-0.5 rounded-[4px] text-[10px] bg-zinc-900 text-zinc-150 border border-zinc-800 outline-none cursor-pointer font-bold"
                                              >
                                                <option value="px">px</option>
                                                <option value="em">em</option>
                                                <option value="rem">rem</option>
                                                <option value="vw">vw</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="8"
                                                max="120"
                                                value={parseInt(String(activeElement.config.fontSize || '30')) || 16}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.fontSize || '30px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={parseInt(String(activeElement.config.fontSize || '30')) || 16}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.fontSize || '30px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: `${e.target.value}${unit}` });
                                                }}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Ketebalan */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Ketebalan</span>
                                            <select
                                              value={activeElement.config.fontWeight || '400'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontWeight: e.target.value })}
                                              className="w-40 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="100">100 (Thin)</option>
                                              <option value="200">200 (Extra Light)</option>
                                              <option value="300">300 (Light)</option>
                                              <option value="400">400 (Normal)</option>
                                              <option value="500">500 (Medium)</option>
                                              <option value="600">600 (Semi Bold)</option>
                                              <option value="700">700 (Bold)</option>
                                              <option value="800">800 (Extra Bold)</option>
                                              <option value="900">900 (Black)</option>
                                            </select>
                                          </div>

                                          {/* Transformasi */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Transformasi</span>
                                            <select
                                              value={activeElement.config.textTransform || 'none'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textTransform: e.target.value })}
                                              className="w-36 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="none">Asali</option>
                                              <option value="uppercase">KAPITAL</option>
                                              <option value="lowercase">huruf kecil</option>
                                              <option value="capitalize">Kapitalisasi</option>
                                            </select>
                                          </div>

                                          {/* Gaya */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Gaya</span>
                                            <select
                                              value={activeElement.config.fontStyle || 'normal'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontStyle: e.target.value })}
                                              className="w-36 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="normal">Asali</option>
                                              <option value="italic">Miring</option>
                                              <option value="oblique">Oblique</option>
                                            </select>
                                          </div>

                                          {/* Dekorasi */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Dekorasi</span>
                                            <select
                                              value={activeElement.config.textDecoration || 'none'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textDecoration: e.target.value })}
                                              className="w-36 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="none">Asali</option>
                                              <option value="underline">Garis Bawah</option>
                                              <option value="overline">Garis Atas</option>
                                              <option value="line-through">Coret</option>
                                            </select>
                                          </div>

                                          {/* Line Height */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Line Height</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <select
                                                value={String(activeElement.config.lineHeight || '1.6px').replace(/[0-9.]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseFloat(String(activeElement.config.lineHeight || '1.6')) || 1.6;
                                                  handleUpdateElement(editingSection.id, activeElement.id, { lineHeight: `${num}${e.target.value}` });
                                                }}
                                                className="px-1 py-0.5 rounded-[4px] text-[10px] bg-zinc-900 text-zinc-150 border border-zinc-800 outline-none cursor-pointer font-bold"
                                              >
                                                <option value="px">px</option>
                                                <option value="em">em</option>
                                                <option value="rem">rem</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="0.5"
                                                max="5"
                                                step="0.1"
                                                value={parseFloat(String(activeElement.config.lineHeight || '1.6')) || 1.6}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.lineHeight || '1.6px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { lineHeight: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                step="0.1"
                                                value={parseFloat(String(activeElement.config.lineHeight || '1.6')) || 1.6}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.lineHeight || '1.6px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { lineHeight: `${e.target.value}${unit}` });
                                                }}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Letter Spacing */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Letter Spacing</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <select
                                                value={String(activeElement.config.letterSpacing || '0px').replace(/[-0-9]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseInt(String(activeElement.config.letterSpacing || '0')) || 0;
                                                  handleUpdateElement(editingSection.id, activeElement.id, { letterSpacing: `${num}${e.target.value}` });
                                                }}
                                                className="px-1 py-0.5 rounded-[4px] text-[10px] bg-zinc-900 text-zinc-150 border border-zinc-800 outline-none cursor-pointer font-bold"
                                              >
                                                <option value="px">px</option>
                                                <option value="em">em</option>
                                                <option value="rem">rem</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="-5"
                                                max="20"
                                                value={parseInt(String(activeElement.config.letterSpacing || '0')) || 0}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.letterSpacing || '0px').replace(/[-0-9]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { letterSpacing: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={parseInt(String(activeElement.config.letterSpacing || '0')) || 0}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.letterSpacing || '0px').replace(/[-0-9]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { letterSpacing: `${e.target.value}${unit}` });
                                                }}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Spasi Kata */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Spasi Kata</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <select
                                                value={String(activeElement.config.wordSpacing || '0px').replace(/[-0-9]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseInt(String(activeElement.config.wordSpacing || '0')) || 0;
                                                  handleUpdateElement(editingSection.id, activeElement.id, { wordSpacing: `${num}${e.target.value}` });
                                                }}
                                                className="px-1 py-0.5 rounded-[4px] text-[10px] bg-zinc-900 text-zinc-150 border border-zinc-800 outline-none cursor-pointer font-bold"
                                              >
                                                <option value="px">px</option>
                                                <option value="em">em</option>
                                                <option value="rem">rem</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="-5"
                                                max="30"
                                                value={parseInt(String(activeElement.config.wordSpacing || '0')) || 0}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.wordSpacing || '0px').replace(/[-0-9]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { wordSpacing: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={parseInt(String(activeElement.config.wordSpacing || '0')) || 0}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.wordSpacing || '0px').replace(/[-0-9]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { wordSpacing: `${e.target.value}${unit}` });
                                                }}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Text Shadow */}
                                    <div className="flex items-center justify-between relative">
                                      <span className="text-xs text-zinc-300 font-semibold">Text Shadow</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log("[Editor TEXT] Toggle popover text shadow");
                                          setActiveDropdown(activeDropdown?.field === 'text_shadow' ? null : { field: 'text_shadow' });
                                        }}
                                        className={`w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center transition-all ${
                                          activeDropdown?.field === 'text_shadow' 
                                            ? 'bg-zinc-800 text-white' 
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                                        }`}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      
                                      {/* Popover Text Shadow */}
                                      {activeDropdown?.field === 'text_shadow' && (
                                        <div 
                                          onClick={(e) => e.stopPropagation()}
                                          className="absolute right-0 top-full mt-2 w-[280px] bg-[#18181b] border border-zinc-800 rounded-[4px] p-3 z-50 shadow-2xl space-y-3.5 text-left animate-in fade-in slide-in-from-top-2 duration-150"
                                        >
                                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                            <span className="text-xs font-bold text-zinc-200">Text Shadow</span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                console.log("[Editor TEXT] Reset text shadow");
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  textShadowColor: 'transparent',
                                                  textShadowBlur: 0,
                                                  textShadowOffsetX: 0,
                                                  textShadowOffsetY: 0
                                                });
                                              }}
                                              className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                              title="Reset Text Shadow"
                                            >
                                              <RotateCcw className="w-3 h-3" />
                                            </button>
                                          </div>

                                          {/* Warna Shadow */}
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs text-zinc-400">Warna</span>
                                            <input
                                              type="color"
                                              value={activeElement.config.textShadowColor || '#000000'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowColor: e.target.value })}
                                              className="w-6 h-6 rounded cursor-pointer border border-zinc-800 bg-transparent p-0"
                                            />
                                          </div>

                                          {/* Blur */}
                                          <div className="space-y-1">
                                            <span className="text-xs text-zinc-400">Blur</span>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={activeElement.config.textShadowBlur !== undefined ? activeElement.config.textShadowBlur : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowBlur: Number(e.target.value) })}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={activeElement.config.textShadowBlur !== undefined ? activeElement.config.textShadowBlur : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowBlur: Number(e.target.value) })}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Mendatar (OffsetX) */}
                                          <div className="space-y-1">
                                            <span className="text-xs text-zinc-400">Mendatar</span>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="-50"
                                                max="50"
                                                value={activeElement.config.textShadowOffsetX !== undefined ? activeElement.config.textShadowOffsetX : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowOffsetX: Number(e.target.value) })}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={activeElement.config.textShadowOffsetX !== undefined ? activeElement.config.textShadowOffsetX : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowOffsetX: Number(e.target.value) })}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Vertikal (OffsetY) */}
                                          <div className="space-y-1">
                                            <span className="text-xs text-zinc-400">Vertikal</span>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="-50"
                                                max="50"
                                                value={activeElement.config.textShadowOffsetY !== undefined ? activeElement.config.textShadowOffsetY : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowOffsetY: Number(e.target.value) })}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={activeElement.config.textShadowOffsetY !== undefined ? activeElement.config.textShadowOffsetY : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowOffsetY: Number(e.target.value) })}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Spasi Paragraf */}
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-300 font-semibold">Spasi Paragraf</span>
                                        <div className="relative flex items-center justify-end">
                                          <input
                                            type="number"
                                            value={activeElement.config.paragraphSpacing ?? 16}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { paragraphSpacing: Number(e.target.value) })}
                                            className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                          />
                                          <span className="absolute right-1 text-[8px] text-zinc-650 font-bold select-none">px</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="range"
                                          min="0"
                                          max="100"
                                          value={activeElement.config.paragraphSpacing ?? 16}
                                          onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { paragraphSpacing: Number(e.target.value) })}
                                          className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                        />
                                      </div>
                                    </div>

                                    {/* Normal | Sorotan */}
                                    <div className="flex bg-zinc-950 border border-zinc-800 rounded p-0.5 mt-2">
                                      <button
                                        type="button"
                                        onClick={() => setBtnStyleMode('normal')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${btnStyleMode === 'normal' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                      >
                                        Normal
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setBtnStyleMode('hover')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${btnStyleMode === 'hover' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                      >
                                        Sorotan
                                      </button>
                                    </div>
                                     {btnStyleMode === 'normal' ? (
                                       <>
                                          {/* Warna Teks */}
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs text-zinc-300 font-semibold">Warna Teks</span>
                                            <div className="flex items-center gap-1">
                                              {activeElement.config.textColor && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log('[Editor BUTTON Debug] Warna teks direset');
                                                    handleUpdateElement(editingSection.id, activeElement.id, { textColor: undefined });
                                                  }}
                                                  className="p-1 rounded hover:bg-zinc-800 transition-colors"
                                                  title="Reset Warna Teks"
                                                >
                                                  <RotateCcw className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                                                </button>
                                              )}
                                              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-7">
                                                <div className="relative w-8 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
                                                  <div 
                                                    className="w-full h-full rounded-md border border-zinc-800/80" 
                                                    style={{ backgroundColor: activeElement.config.textColor || '#4b5563' }}
                                                  />
                                                  <input
                                                    type="color"
                                                    value={activeElement.config.textColor || '#4b5563'}
                                                    onChange={(e) => {
                                                      handleUpdateElement(editingSection.id, activeElement.id, { textColor: e.target.value });
                                                    }}
                                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                         {/* Warna Tautan */}
                                         <div className="flex justify-between items-center">
                                           <span className="text-xs text-zinc-300 font-semibold">Warna Tautan</span>
                                           <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-7">
                                             <div className="relative w-8 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
                                               <div 
                                                 className="w-full h-full rounded-md border border-zinc-800/80" 
                                                 style={{ backgroundColor: activeElement.config.linkColor || '#2563eb' }}
                                               />
                                               <input
                                                 type="color"
                                                 value={activeElement.config.linkColor || '#2563eb'}
                                                 onChange={(e) => {
                                                   handleUpdateElement(editingSection.id, activeElement.id, { linkColor: e.target.value });
                                                 }}
                                                 className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                               />
                                             </div>
                                           </div>
                                         </div>
                                       </>
                                     ) : (
                                       <div className="space-y-4">
                                         {/* Warna Tautan Hover */}
                                         <div className="flex justify-between items-center">
                                           <span className="text-xs text-zinc-300 font-semibold">Warna Tautan</span>
                                           <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-8">
                                             <button
                                               type="button"
                                               className="h-full px-2 border-r border-zinc-800 flex items-center justify-center hover:bg-zinc-900 transition-colors"
                                               title="Global Colors"
                                             >
                                               <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                             </button>
                                             <div className="relative w-10 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
                                               {activeElement.config.hoverLinkColor ? (
                                                 <div 
                                                   className="w-full h-full rounded border border-zinc-800/80" 
                                                   style={{ backgroundColor: activeElement.config.hoverLinkColor }}
                                                 />
                                               ) : (
                                                 <div className="w-full h-full rounded border border-zinc-800/80 bg-zinc-900/50 relative overflow-hidden flex items-center justify-center">
                                                   <div className="absolute w-[150%] h-[1.5px] bg-red-500 rotate-[35deg] transform origin-center" />
                                                 </div>
                                               )}
                                               <input
                                                 type="color"
                                                 value={activeElement.config.hoverLinkColor || '#2563eb'}
                                                 onChange={(e) => {
                                                   console.log(`[Editor TEXT] Hover Link Color diubah ke:`, e.target.value);
                                                   handleUpdateElement(editingSection.id, activeElement.id, { hoverLinkColor: e.target.value });
                                                 }}
                                                 className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                               />
                                             </div>
                                           </div>
                                         </div>

                                         {/* Durasi Transisi */}
                                         <div className="space-y-2 py-1">
                                           <div className="flex items-center justify-between">
                                             <span className="text-xs text-zinc-300 font-semibold">Durasi Transisi</span>
                                             <div className="relative flex items-center pr-1.5">
                                               <select
                                                 value="s"
                                                 disabled
                                                 className="text-[10px] bg-transparent border-0 outline-none text-zinc-400 font-bold pr-3 appearance-none text-right cursor-not-allowed"
                                               >
                                                 <option value="s">s</option>
                                               </select>
                                               <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                                             </div>
                                           </div>
                                           
                                           <div className="flex items-center gap-3">
                                             <input
                                               type="range"
                                               min="0"
                                               max="2"
                                               step="0.05"
                                               value={activeElement.config.transitionDuration ?? 0.3}
                                               onChange={(e) => {
                                                 const val = Number(e.target.value);
                                                 console.log(`[Editor TEXT] transitionDuration diubah ke: ${val}s`);
                                                 handleUpdateElement(editingSection.id, activeElement.id, { transitionDuration: val });
                                               }}
                                               className="flex-1 accent-blue-600 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                             />
                                             <input
                                               type="text"
                                               value={activeElement.config.transitionDuration ?? 0.3}
                                               onChange={(e) => {
                                                 const val = e.target.value.replace(/[^0-9.]/g, '');
                                                 console.log(`[Editor TEXT] Input transitionDuration diubah ke: ${val}`);
                                                 handleUpdateElement(editingSection.id, activeElement.id, { transitionDuration: Number(val) });
                                               }}
                                               className="w-16 h-8 text-center text-xs font-bold bg-[#1a1a1f] text-zinc-150 border border-zinc-800 rounded focus:border-zinc-700 outline-none"
                                             />
                                           </div>
                                         </div>
                                       </div>
                                      )}
                                    </div>
                                  )}
                                {/* Accordion: Desain & Tampilan */}
                                {activeElement.type === 'HEADING' && (
                                  <div className="space-y-4 animate-in fade-in duration-200">
                                    {/* Perataan */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-zinc-300 font-semibold">Perataan</span>
                                        <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                      </div>
                                      <div className="flex border border-zinc-800 rounded-[4px] overflow-hidden bg-zinc-950/20">
                                        {['left', 'center', 'right', 'justify'].map((a, idx) => {
                                          const isActive = (activeElement.config.align || 'left') === a;
                                          const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : a === 'right' ? AlignRight : AlignJustify;
                                          return (
                                            <button
                                              key={a}
                                              type="button"
                                              onClick={() => {
                                                console.log("[Editor HEADING] Perataan diperbarui ke:", a);
                                                handleUpdateElement(editingSection.id, activeElement.id, { align: a });
                                              }}
                                              className={`p-2 transition-all flex items-center justify-center cursor-pointer ${idx !== 3 ? 'border-r border-zinc-800' : ''
                                                } ${isActive
                                                  ? 'bg-zinc-800 text-zinc-100'
                                                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20'
                                                }`}
                                            >
                                              <Icon className="w-3.5 h-3.5" />
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Penulisan (Typography) */}
                                    <div className="flex items-center justify-between relative">
                                      <span className="text-xs text-zinc-300 font-semibold">Penulisan</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log("[Editor HEADING] Toggle popover penulisan");
                                          setActiveDropdown(activeDropdown?.field === 'penulisan' ? null : { field: 'penulisan' });
                                        }}
                                        className={`w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center transition-all ${
                                          activeDropdown?.field === 'penulisan' 
                                            ? 'bg-zinc-800 text-white' 
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                                        }`}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      
                                      {/* Popover Penulisan */}
                                      {activeDropdown?.field === 'penulisan' && (
                                        <div 
                                          onClick={(e) => e.stopPropagation()}
                                          className="absolute right-0 top-full mt-2 w-[280px] bg-[#18181b] border border-zinc-800 rounded-[4px] p-3 z-50 shadow-2xl space-y-3.5 text-left animate-in fade-in slide-in-from-top-2 duration-150"
                                        >
                                          {/* Popover Header */}
                                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                            <span className="text-xs font-bold text-zinc-200">Penulisan</span>
                                            <div className="flex items-center gap-2">
                                              <button 
                                                type="button" 
                                                onClick={() => {
                                                  console.log("[Editor HEADING] Reset penulisan");
                                                  handleUpdateElement(editingSection.id, activeElement.id, {
                                                    fontFamily: 'Roboto',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    textTransform: 'none',
                                                    fontStyle: 'normal',
                                                    textDecoration: 'none',
                                                    lineHeight: '1.2px',
                                                    letterSpacing: '0px',
                                                    wordSpacing: '0px'
                                                  });
                                                }}
                                                className="text-zinc-500 hover:text-zinc-300 font-bold"
                                              >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                              </button>
                                              <button type="button" className="text-zinc-500 hover:text-zinc-300">
                                                <Plus className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Family */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Family</span>
                                            <select
                                              value={activeElement.config.fontFamily || 'Roboto'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontFamily: e.target.value })}
                                              className="w-36 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              {POPULAR_FONTS.map(cat => (
                                                <optgroup key={cat.category} label={cat.category} className="bg-zinc-950 text-zinc-300 font-bold">
                                                  {cat.fonts.map(f => (
                                                    <option key={f.value} value={f.value} className="bg-zinc-900 text-zinc-100 font-normal">{f.label}</option>
                                                  ))}
                                                </optgroup>
                                              ))}
                                            </select>
                                          </div>

                                          {/* Ukuran */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Ukuran</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <select
                                                value={String(activeElement.config.fontSize || '30px').replace(/[0-9.]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseInt(String(activeElement.config.fontSize || '30')) || 16;
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: `${num}${e.target.value}` });
                                                }}
                                                className="px-1 py-0.5 rounded-[4px] text-[10px] bg-zinc-900 text-zinc-150 border border-zinc-800 outline-none cursor-pointer font-bold"
                                              >
                                                <option value="px">px</option>
                                                <option value="em">em</option>
                                                <option value="rem">rem</option>
                                                <option value="vw">vw</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="8"
                                                max="120"
                                                value={parseInt(String(activeElement.config.fontSize || '30')) || 16}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.fontSize || '30px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={parseInt(String(activeElement.config.fontSize || '30')) || 16}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.fontSize || '30px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: `${e.target.value}${unit}` });
                                                }}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Ketebalan */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Ketebalan</span>
                                            <select
                                              value={activeElement.config.fontWeight || '600'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontWeight: e.target.value })}
                                              className="w-40 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="100">100 (Thin)</option>
                                              <option value="200">200 (Extra Light)</option>
                                              <option value="300">300 (Light)</option>
                                              <option value="400">400 (Normal)</option>
                                              <option value="500">500 (Medium)</option>
                                              <option value="600">600 (Semi Bold)</option>
                                              <option value="700">700 (Bold)</option>
                                              <option value="800">800 (Extra Bold)</option>
                                              <option value="900">900 (Black)</option>
                                            </select>
                                          </div>

                                          {/* Transformasi */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Transformasi</span>
                                            <select
                                              value={activeElement.config.textTransform || 'none'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textTransform: e.target.value })}
                                              className="w-36 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="none">Asali</option>
                                              <option value="uppercase">KAPITAL</option>
                                              <option value="lowercase">huruf kecil</option>
                                              <option value="capitalize">Kapitalisasi</option>
                                            </select>
                                          </div>

                                          {/* Gaya */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Gaya</span>
                                            <select
                                              value={activeElement.config.fontStyle || 'normal'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontStyle: e.target.value })}
                                              className="w-36 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="normal">Asali</option>
                                              <option value="italic">Miring</option>
                                              <option value="oblique">Oblique</option>
                                            </select>
                                          </div>

                                          {/* Dekorasi */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Dekorasi</span>
                                            <select
                                              value={activeElement.config.textDecoration || 'none'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textDecoration: e.target.value })}
                                              className="w-36 px-2 h-7 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-bold"
                                            >
                                              <option value="none">Asali</option>
                                              <option value="underline">Garis Bawah</option>
                                              <option value="overline">Garis Atas</option>
                                              <option value="line-through">Coret</option>
                                            </select>
                                          </div>

                                          {/* Line Height */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Line Height</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <select
                                                value={String(activeElement.config.lineHeight || '1.2px').replace(/[0-9.]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseFloat(String(activeElement.config.lineHeight || '1.2')) || 1.2;
                                                  handleUpdateElement(editingSection.id, activeElement.id, { lineHeight: `${num}${e.target.value}` });
                                                }}
                                                className="px-1 py-0.5 rounded-[4px] text-[10px] bg-zinc-900 text-zinc-150 border border-zinc-800 outline-none cursor-pointer font-bold"
                                              >
                                                <option value="px">px</option>
                                                <option value="em">em</option>
                                                <option value="rem">rem</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="0.5"
                                                max="5"
                                                step="0.1"
                                                value={parseFloat(String(activeElement.config.lineHeight || '1.2')) || 1.2}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.lineHeight || '1.2px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { lineHeight: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                step="0.1"
                                                value={parseFloat(String(activeElement.config.lineHeight || '1.2')) || 1.2}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.lineHeight || '1.2px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { lineHeight: `${e.target.value}${unit}` });
                                                }}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Letter Spacing */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Letter Spacing</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <select
                                                value={String(activeElement.config.letterSpacing || '0px').replace(/[-0-9]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseInt(String(activeElement.config.letterSpacing || '0')) || 0;
                                                  handleUpdateElement(editingSection.id, activeElement.id, { letterSpacing: `${num}${e.target.value}` });
                                                }}
                                                className="px-1 py-0.5 rounded-[4px] text-[10px] bg-zinc-900 text-zinc-150 border border-zinc-800 outline-none cursor-pointer font-bold"
                                              >
                                                <option value="px">px</option>
                                                <option value="em">em</option>
                                                <option value="rem">rem</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="-5"
                                                max="20"
                                                value={parseInt(String(activeElement.config.letterSpacing || '0')) || 0}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.letterSpacing || '0px').replace(/[-0-9]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { letterSpacing: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={parseInt(String(activeElement.config.letterSpacing || '0')) || 0}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.letterSpacing || '0px').replace(/[-0-9]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { letterSpacing: `${e.target.value}${unit}` });
                                                }}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Spasi Kata */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Spasi Kata</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <select
                                                value={String(activeElement.config.wordSpacing || '0px').replace(/[-0-9]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseInt(String(activeElement.config.wordSpacing || '0')) || 0;
                                                  handleUpdateElement(editingSection.id, activeElement.id, { wordSpacing: `${num}${e.target.value}` });
                                                }}
                                                className="px-1 py-0.5 rounded-[4px] text-[10px] bg-zinc-900 text-zinc-150 border border-zinc-800 outline-none cursor-pointer font-bold"
                                              >
                                                <option value="px">px</option>
                                                <option value="em">em</option>
                                                <option value="rem">rem</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="-5"
                                                max="30"
                                                value={parseInt(String(activeElement.config.wordSpacing || '0')) || 0}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.wordSpacing || '0px').replace(/[-0-9]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { wordSpacing: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={parseInt(String(activeElement.config.wordSpacing || '0')) || 0}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.wordSpacing || '0px').replace(/[-0-9]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { wordSpacing: `${e.target.value}${unit}` });
                                                }}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Stroke Teks */}
                                    <div className="flex items-center justify-between relative">
                                      <span className="text-xs text-zinc-300 font-semibold">Stroke Teks</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log("[Editor HEADING] Toggle popover stroke teks");
                                          setActiveDropdown(activeDropdown?.field === 'strokeTeks' ? null : { field: 'strokeTeks' });
                                        }}
                                        className={`w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center transition-all ${
                                          activeDropdown?.field === 'strokeTeks' 
                                            ? 'bg-zinc-800 text-white' 
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                                        }`}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Popover Stroke Teks */}
                                      {activeDropdown?.field === 'strokeTeks' && (
                                        <div 
                                          onClick={(e) => e.stopPropagation()}
                                          className="absolute right-0 top-full mt-2 w-[240px] bg-[#18181b] border border-zinc-800 rounded-[4px] p-3 z-50 shadow-2xl space-y-3.5 text-left animate-in fade-in slide-in-from-top-2 duration-150"
                                        >
                                          {/* Popover Header */}
                                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                            <span className="text-xs font-bold text-zinc-200">Stroke Teks</span>
                                            <button 
                                              type="button" 
                                              onClick={() => {
                                                console.log("[Editor HEADING] Reset stroke teks");
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  textStrokeWidth: 0,
                                                  textStrokeColor: '#000000'
                                                });
                                              }}
                                              className="text-zinc-500 hover:text-zinc-300 font-bold"
                                            >
                                              <RotateCcw className="w-3.5 h-3.5" />
                                            </button>
                                          </div>

                                          {/* Stroke Width Slider */}
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-400">Stroke Teks</span>
                                                <Monitor className="w-3 h-3 text-zinc-500" />
                                              </div>
                                              <span className="text-[10px] text-zinc-400 font-semibold">px</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                value={activeElement.config.textStrokeWidth || 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textStrokeWidth: Number(e.target.value) })}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={activeElement.config.textStrokeWidth || 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textStrokeWidth: Number(e.target.value) })}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Warna Stroke */}
                                          <div className="flex items-center justify-between pt-1">
                                            <span className="text-xs text-zinc-400">Warna Stroke</span>
                                            <div className="flex items-center gap-1">
                                              <input
                                                type="color"
                                                value={activeElement.config.textStrokeColor || '#000000'}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textStrokeColor: e.target.value })}
                                                className="w-8 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                              />
                                              <input
                                                type="text"
                                                value={activeElement.config.textStrokeColor || '#000000'}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textStrokeColor: e.target.value })}
                                                className="w-20 px-1.5 h-7 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-bold animate-none"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Text Shadow */}
                                    <div className="flex items-center justify-between relative">
                                      <span className="text-xs text-zinc-300 font-semibold">Text Shadow</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log("[Editor HEADING] Toggle popover text shadow");
                                          setActiveDropdown(activeDropdown?.field === 'textShadow' ? null : { field: 'textShadow' });
                                        }}
                                        className={`w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center transition-all ${
                                          activeDropdown?.field === 'textShadow' 
                                            ? 'bg-zinc-800 text-white' 
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                                        }`}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Popover Text Shadow */}
                                      {activeDropdown?.field === 'textShadow' && (
                                        <div 
                                          onClick={(e) => e.stopPropagation()}
                                          className="absolute right-0 top-full mt-2 w-[240px] bg-[#18181b] border border-zinc-800 rounded-[4px] p-3 z-50 shadow-2xl space-y-3.5 text-left animate-in fade-in slide-in-from-top-2 duration-150"
                                        >
                                          {/* Popover Header */}
                                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                            <span className="text-xs font-bold text-zinc-200">Text Shadow</span>
                                            <button 
                                              type="button" 
                                              onClick={() => {
                                                console.log("[Editor HEADING] Reset text shadow");
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  textShadowColor: 'rgba(0,0,0,0.5)',
                                                  textShadowBlur: 10,
                                                  textShadowOffsetX: 0,
                                                  textShadowOffsetY: 0
                                                });
                                              }}
                                              className="text-zinc-500 hover:text-zinc-300 font-bold"
                                            >
                                              <RotateCcw className="w-3.5 h-3.5" />
                                            </button>
                                          </div>

                                          {/* Warna Shadow */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Warna</span>
                                            <div className="flex items-center gap-1">
                                              <input
                                                type="color"
                                                value={activeElement.config.textShadowColor?.startsWith('rgba') ? '#000000' : (activeElement.config.textShadowColor || '#000000')}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowColor: e.target.value })}
                                                className="w-8 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                              />
                                              <input
                                                type="text"
                                                value={activeElement.config.textShadowColor || 'rgba(0,0,0,0.5)'}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowColor: e.target.value })}
                                                className="w-24 px-1.5 h-7 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Buram (Blur) */}
                                          <div className="space-y-1">
                                            <span className="text-xs text-zinc-400">Buram</span>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={activeElement.config.textShadowBlur !== undefined ? activeElement.config.textShadowBlur : 10}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowBlur: Number(e.target.value) })}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={activeElement.config.textShadowBlur !== undefined ? activeElement.config.textShadowBlur : 10}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowBlur: Number(e.target.value) })}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Mendatar (Offset X) */}
                                          <div className="space-y-1">
                                            <span className="text-xs text-zinc-400">Mendatar</span>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="-50"
                                                max="50"
                                                value={activeElement.config.textShadowOffsetX !== undefined ? activeElement.config.textShadowOffsetX : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowOffsetX: Number(e.target.value) })}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={activeElement.config.textShadowOffsetX !== undefined ? activeElement.config.textShadowOffsetX : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowOffsetX: Number(e.target.value) })}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>

                                          {/* Vertikal (Offset Y) */}
                                          <div className="space-y-1">
                                            <span className="text-xs text-zinc-400">Vertikal</span>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="range"
                                                min="-50"
                                                max="50"
                                                value={activeElement.config.textShadowOffsetY !== undefined ? activeElement.config.textShadowOffsetY : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowOffsetY: Number(e.target.value) })}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={activeElement.config.textShadowOffsetY !== undefined ? activeElement.config.textShadowOffsetY : 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textShadowOffsetY: Number(e.target.value) })}
                                                className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Warna Teks */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-zinc-300 font-semibold">Warna Teks</span>
                                      
                                      {/* Kotak Swatch Warna Kustom */}
                                      <div className="relative w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center bg-[#1a1a1f] hover:bg-zinc-800/30 cursor-pointer overflow-hidden">
                                        <input
                                          type="color"
                                          value={activeElement.config.textColor || '#000000'}
                                          onChange={(e) => {
                                            console.log("[Editor HEADING] Warna Teks diperbarui ke:", e.target.value);
                                            handleUpdateElement(editingSection.id, activeElement.id, { textColor: e.target.value, color: e.target.value });
                                          }}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {/* Preview warna solid atau garis diagonal merah jika default */}
                                        {activeElement.config.textColor && activeElement.config.textColor !== 'transparent' ? (
                                          <div 
                                            className="w-4 h-4 rounded-[2px] border border-zinc-700" 
                                            style={{ backgroundColor: activeElement.config.textColor }}
                                          />
                                        ) : (
                                          <div className="w-4 h-4 rounded-[2px] border border-zinc-700 relative overflow-hidden bg-zinc-950">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ef4444] to-transparent" style={{ backgroundImage: 'linear-gradient(45deg, transparent 47%, #ef4444 47%, #ef4444 53%, transparent 53%)' }} />
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Mode Paduan */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-zinc-300 font-semibold">Mode Paduan</span>
                                      <select
                                        value={activeElement.config.mixBlendMode || 'normal'}
                                        onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { mixBlendMode: e.target.value })}
                                        className="w-32 px-2 h-8 rounded-[4px] text-xs bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none font-semibold cursor-pointer text-center"
                                      >
                                        <option value="normal">Normal</option>
                                        <option value="multiply">Multiply</option>
                                        <option value="screen">Screen</option>
                                        <option value="overlay">Overlay</option>
                                        <option value="darken">Darken</option>
                                        <option value="lighten">Lighten</option>
                                        <option value="color-dodge">Color Dodge</option>
                                        <option value="color-burn">Color Burn</option>
                                        <option value="hard-light">Hard Light</option>
                                        <option value="soft-light">Soft Light</option>
                                        <option value="difference">Difference</option>
                                        <option value="exclusion">Exclusion</option>
                                        <option value="hue">Hue</option>
                                        <option value="saturation">Saturation</option>
                                        <option value="color">Color</option>
                                        <option value="luminosity">Luminosity</option>
                                      </select>
                                    </div>

                                    {/* Line Pembatas */}
                                    <div className="border-t border-zinc-800/50 my-4" />

                                    {/* Warna Latar */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-zinc-300 font-semibold">Warna Latar</span>
                                      
                                      {/* Kotak Swatch Warna Latar Kustom */}
                                      <div className="relative w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center bg-[#1a1a1f] hover:bg-zinc-800/30 cursor-pointer overflow-hidden">
                                        <input
                                          type="color"
                                          value={activeElement.config.bgColor || '#000000'}
                                          onChange={(e) => {
                                            console.log("[Editor HEADING] Warna Latar diperbarui ke:", e.target.value);
                                            handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value });
                                          }}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {/* Preview warna solid atau garis diagonal merah jika default */}
                                        {activeElement.config.bgColor && activeElement.config.bgColor !== 'transparent' ? (
                                          <div 
                                            className="w-4 h-4 rounded-[2px] border border-zinc-700" 
                                            style={{ backgroundColor: activeElement.config.bgColor }}
                                          />
                                        ) : (
                                          <div className="w-4 h-4 rounded-[2px] border border-zinc-700 relative overflow-hidden bg-zinc-950">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ef4444] to-transparent" style={{ backgroundImage: 'linear-gradient(45deg, transparent 47%, #ef4444 47%, #ef4444 53%, transparent 53%)' }} />
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Lebar Latar */}
                                    <div className="flex items-center justify-between mt-3">
                                      <span className="text-xs text-zinc-300 font-semibold">Lebar Latar</span>
                                      <div className="flex border border-zinc-800 rounded-[4px] overflow-hidden bg-zinc-950/20 divide-x divide-zinc-800 h-8">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            console.log("[Editor HEADING] Lebar Latar: Penuh (full)");
                                            handleUpdateElement(editingSection.id, activeElement.id, { bgWidth: 'full' });
                                          }}
                                          className={`px-3 text-[10px] font-bold transition-all cursor-pointer ${
                                            (activeElement.config.bgWidth || 'full') === 'full'
                                              ? 'bg-white text-black'
                                              : 'text-zinc-400 hover:text-zinc-200'
                                          }`}
                                        >
                                          Penuh
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            console.log("[Editor HEADING] Lebar Latar: Sesuai Teks (fit)");
                                            handleUpdateElement(editingSection.id, activeElement.id, { bgWidth: 'fit' });
                                          }}
                                          className={`px-3 text-[10px] font-bold transition-all cursor-pointer ${
                                            activeElement.config.bgWidth === 'fit'
                                              ? 'bg-white text-black'
                                              : 'text-zinc-400 hover:text-zinc-200'
                                          }`}
                                        >
                                          Sesuai Teks
                                        </button>
                                      </div>
                                    </div>

                                    {/* Border Type */}
                                    <div className="space-y-1.5 mt-3">
                                      <span className="text-xs text-zinc-300 font-semibold">Border Type</span>
                                      <select
                                        value={activeElement.config.bgBorderType || 'none'}
                                        onChange={(e) => {
                                          console.log("[Editor HEADING] bgBorderType diperbarui ke:", e.target.value);
                                          handleUpdateElement(editingSection.id, activeElement.id, { bgBorderType: e.target.value });
                                        }}
                                        className="w-full p-2 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                      >
                                        <option value="none">Asali</option>
                                        <option value="solid">Solid (Garis)</option>
                                        <option value="double">Double</option>
                                        <option value="dotted">Dotted (Titik)</option>
                                        <option value="dashed">Dashed (Putus)</option>
                                        <option value="groove">Groove</option>
                                        <option value="ridge">Ridge</option>
                                        <option value="inset">Inset</option>
                                        <option value="outset">Outset</option>
                                      </select>
                                    </div>

                                    {/* Detail Border Color & Width */}
                                    {activeElement.config.bgBorderType && activeElement.config.bgBorderType !== 'none' && (
                                      <div className="space-y-3 mt-3 animate-in fade-in duration-200">
                                        {/* Lebar Batas */}
                                        <div className="space-y-1.5">
                                          <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                              <span>Lebar Batas</span>
                                              <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 h-6">
                                              <span className="text-[10px] text-zinc-400 font-bold">px</span>
                                              <ChevronDown className="w-3 h-3 text-zinc-500" />
                                            </div>
                                          </div>

                                          <div className="flex gap-1 items-start">
                                            <div className="flex-1 flex flex-col">
                                              <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                                {[
                                                  { k: 'bgBorderWidthTop', label: 'Atas', isLast: false },
                                                  { k: 'bgBorderWidthRight', label: 'Kanan', isLast: false },
                                                  { k: 'bgBorderWidthBottom', label: 'Bawah', isLast: false },
                                                  { k: 'bgBorderWidthLeft', label: 'Kiri', isLast: true }
                                                ].map((r) => (
                                                  <input
                                                    key={r.k}
                                                    type="number"
                                                    value={activeElement.config[r.k] !== undefined ? activeElement.config[r.k] : (activeElement.config.bgBorderWidth ?? 0)}
                                                    onChange={(e) => {
                                                      const val = Number(e.target.value);
                                                      console.log(`[Editor HEADING] Mengubah lebar border ${r.k} ke: ${val}`);
                                                      const updates: any = { [r.k]: val };
                                                      if (bgBorderWidthLink) {
                                                        updates.bgBorderWidthTop = val;
                                                        updates.bgBorderWidthRight = val;
                                                        updates.bgBorderWidthBottom = val;
                                                        updates.bgBorderWidthLeft = val;
                                                        updates.bgBorderWidth = val;
                                                      }
                                                      handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                    }}
                                                    placeholder="0"
                                                    className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!r.isLast ? 'border-r border-zinc-800' : ''}`}
                                                  />
                                                ))}
                                              </div>
                                              <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                                <span>Atas</span>
                                                <span>Kanan</span>
                                                <span>Bawah</span>
                                                <span>Kiri</span>
                                              </div>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newVal = !bgBorderWidthLink;
                                                setBgBorderWidthLink(newVal);
                                                console.log(`[Editor HEADING] Status tautan link lebar batas ke: ${newVal}`);
                                              }}
                                              className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${bgBorderWidthLink
                                                ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                                : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                                }`}
                                            >
                                              <Link2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Warna Batas */}
                                        <div className="space-y-1.5">
                                          <span className="text-xs text-zinc-300 font-semibold">Warna Batas</span>
                                          <div className="flex gap-1.5 items-center">
                                            <div className="relative w-8 h-8 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0">
                                              <input
                                                type="color"
                                                value={activeElement.config.bgBorderColor || '#000000'}
                                                onChange={(e) => {
                                                  console.log("[Editor HEADING] bgBorderColor diperbarui ke:", e.target.value);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { bgBorderColor: e.target.value });
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                              />
                                              {activeElement.config.bgBorderColor ? (
                                                <div 
                                                  className="w-4 h-4 rounded-[2px] border border-zinc-700" 
                                                  style={{ backgroundColor: activeElement.config.bgBorderColor }}
                                                />
                                              ) : (
                                                <div className="w-4 h-4 rounded-[2px] border border-zinc-700 relative overflow-hidden bg-zinc-950">
                                                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ef4444] to-transparent" style={{ backgroundImage: 'linear-gradient(45deg, transparent 47%, #ef4444 47%, #ef4444 53%, transparent 53%)' }} />
                                                </div>
                                              )}
                                            </div>
                                            <input
                                              type="text"
                                              value={activeElement.config.bgBorderColor || ''}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgBorderColor: e.target.value })}
                                              placeholder="#000000"
                                              className="flex-1 px-3 h-8 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Radius Batas */}
                                    <div className="space-y-1.5 mt-3">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                          <span>Radius Batas</span>
                                          <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none">
                                          px v
                                        </div>
                                      </div>

                                      <div className="flex gap-1 items-start">
                                        <div className="flex-1 flex flex-col">
                                          <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                            {[
                                              { k: 'bgBorderRadiusTopLeft', label: 'Atas', isLast: false },
                                              { k: 'bgBorderRadiusTopRight', label: 'Kanan', isLast: false },
                                              { k: 'bgBorderRadiusBottomRight', label: 'Bawah', isLast: false },
                                              { k: 'bgBorderRadiusBottomLeft', label: 'Kiri', isLast: true }
                                            ].map((r) => (
                                              <input
                                                key={r.k}
                                                type="number"
                                                value={activeElement.config[r.k] !== undefined ? activeElement.config[r.k] : (activeElement.config.bgBorderRadius ?? 0)}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor HEADING] Mengubah ${r.k} ke: ${val}`);
                                                  const updates: any = { [r.k]: val };
                                                  if (bgBorderRadiusLink) {
                                                    updates.bgBorderRadiusTopLeft = val;
                                                    updates.bgBorderRadiusTopRight = val;
                                                    updates.bgBorderRadiusBottomRight = val;
                                                    updates.bgBorderRadiusBottomLeft = val;
                                                    updates.bgBorderRadius = val;
                                                  }
                                                  handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                }}
                                                placeholder="0"
                                                className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!r.isLast ? 'border-r border-zinc-800' : ''}`}
                                              />
                                            ))}
                                          </div>
                                          <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                            <span>Atas</span>
                                            <span>Kanan</span>
                                            <span>Bawah</span>
                                            <span>Kiri</span>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newVal = !bgBorderRadiusLink;
                                            setBgBorderRadiusLink(newVal);
                                            console.log(`[Editor HEADING] Status tautan link radius batas ke: ${newVal}`);
                                          }}
                                          className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${bgBorderRadiusLink
                                            ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                            : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                            }`}
                                        >
                                          <Link2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Padding Latar */}
                                    <div className="space-y-1.5 mt-3">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                          <span>Padding Latar</span>
                                          <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none">
                                          px v
                                        </div>
                                      </div>

                                      <div className="flex gap-1 items-start">
                                        <div className="flex-1 flex flex-col">
                                          <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                            {[
                                              { k: 'bgPaddingTop', label: 'Atas', isLast: false },
                                              { k: 'bgPaddingRight', label: 'Kanan', isLast: false },
                                              { k: 'bgPaddingBottom', label: 'Bawah', isLast: false },
                                              { k: 'bgPaddingLeft', label: 'Kiri', isLast: true }
                                            ].map((p) => (
                                              <input
                                                key={p.k}
                                                type="number"
                                                value={activeElement.config[p.k] !== undefined ? activeElement.config[p.k] : (p.k.includes('Left') || p.k.includes('Right') ? (activeElement.config.bgPaddingX ?? 0) : (activeElement.config.bgPaddingY ?? 0))}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor HEADING] Mengubah ${p.k} ke: ${val}`);
                                                  const updates: any = { [p.k]: val };
                                                  if (paddingLink) {
                                                    updates.bgPaddingTop = val;
                                                    updates.bgPaddingRight = val;
                                                    updates.bgPaddingBottom = val;
                                                    updates.bgPaddingLeft = val;
                                                    updates.bgPaddingY = val;
                                                    updates.bgPaddingX = val;
                                                  }
                                                  handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                }}
                                                placeholder="0"
                                                className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!p.isLast ? 'border-r border-zinc-800' : ''}`}
                                              />
                                            ))}
                                          </div>
                                          <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                            <span>Atas</span>
                                            <span>Kanan</span>
                                            <span>Bawah</span>
                                            <span>Kiri</span>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newVal = !paddingLink;
                                            setPaddingLink(newVal);
                                            console.log(`[Editor HEADING] Status tautan link padding latar ke: ${newVal}`);
                                          }}
                                          className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${paddingLink
                                            ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                            : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                            }`}
                                        >
                                          <Link2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Box Shadow */}
                                    <div className="space-y-1.5 mt-3 relative">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-300 font-semibold">Box Shadow</span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const target = activePopover === 'bgBoxShadow' ? null : 'bgBoxShadow';
                                            setActivePopover(target);
                                            console.log("[Editor HEADING] Toggle popover bgBoxShadow:", target);
                                          }}
                                          className={`w-6 h-6 rounded flex items-center justify-center transition-all cursor-pointer ${
                                            activePopover === 'bgBoxShadow'
                                              ? 'bg-white text-black'
                                              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800'
                                          }`}
                                        >
                                          <Pencil className="w-3 h-3" />
                                        </button>
                                      </div>

                                      {/* Tampilkan nilai ringkas Box Shadow saat ini */}
                                      {activeElement.config.bgBoxShadow && (
                                        <div className="text-[10px] text-zinc-400 bg-zinc-950/40 border border-zinc-900 rounded p-1.5 font-mono truncate max-w-full">
                                          {activeElement.config.bgBoxShadow}
                                        </div>
                                      )}

                                      {/* Popover Box Shadow */}
                                      {activePopover === 'bgBoxShadow' && (
                                        <div 
                                          className="absolute right-0 top-8 z-50 w-64 p-3 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl space-y-3 animate-in fade-in duration-150"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider pb-1 border-b border-zinc-800">
                                            Kustom Bayangan Latar
                                          </div>
                                          
                                          {/* Preset Bayangan */}
                                          <div className="space-y-1">
                                            <span className="text-[9px] text-zinc-500 font-bold uppercase">Preset</span>
                                            <div className="grid grid-cols-2 gap-1">
                                              {[
                                                { label: 'Tanpa Bayangan', value: '' },
                                                { label: 'Halus (sm)', value: '0 2px 10px rgba(0, 0, 0, 0.05)' },
                                                { label: 'Sedang (md)', value: '0 4px 20px rgba(0, 0, 0, 0.08)' },
                                                { label: 'Tegas (lg)', value: '0 10px 30px rgba(0, 0, 0, 0.12)' },
                                                { label: 'Glow Biru', value: '0 0 15px rgba(59, 130, 246, 0.5)' },
                                                { label: 'Neon Glow', value: '0 0 20px rgba(168, 85, 247, 0.6)' }
                                              ].map((preset) => (
                                                <button
                                                  key={preset.label}
                                                  type="button"
                                                  onClick={() => {
                                                    console.log("[Editor HEADING] Bayangan kustom preset:", preset.value);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { bgBoxShadow: preset.value });
                                                  }}
                                                  className={`p-1.5 rounded text-[9px] font-bold text-center border transition-all cursor-pointer ${
                                                    activeElement.config.bgBoxShadow === preset.value
                                                      ? 'bg-white text-black border-white'
                                                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                                                  }`}
                                                >
                                                  {preset.label}
                                                </button>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Custom Shadow Input CSS */}
                                          <div className="space-y-1">
                                            <span className="text-[9px] text-zinc-500 font-bold uppercase">Manual CSS Shadow</span>
                                            <input
                                              type="text"
                                              value={activeElement.config.bgBoxShadow || ''}
                                              onChange={(e) => {
                                                handleUpdateElement(editingSection.id, activeElement.id, { bgBoxShadow: e.target.value });
                                              }}
                                              placeholder="e.g. 0 4px 6px rgba(0,0,0,0.1)"
                                              className="w-full p-1.5 rounded text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-100 outline-none"
                                            />
                                          </div>

                                          <div className="flex justify-end pt-1">
                                            <button
                                              type="button"
                                              onClick={() => setActivePopover(null)}
                                              className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-200 text-[10px] font-bold hover:bg-zinc-700 cursor-pointer"
                                            >
                                              Selesai
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {['BUTTON', 'CART'].includes(activeElement.type) && (
                                  <div className="space-y-4">
                                    {/* 1. Posisi */}
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                        <span>Posisi</span>
                                        <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                      </div>
                                      <div className="flex bg-zinc-950 border border-zinc-800 rounded p-0.5">
                                        {[
                                          { a: 'left', label: '|←' },
                                          { a: 'center', label: '-+-' },
                                          { a: 'right', label: '→|' },
                                          { a: 'full', label: '←→' }
                                        ].map((item) => {
                                          const isSelected = item.a === 'full' 
                                            ? activeElement.config.fullWidth === true
                                            : (activeElement.config.align || 'center') === item.a && !activeElement.config.fullWidth;
                                          return (
                                            <button
                                              key={item.a}
                                              type="button"
                                              onClick={() => {
                                                console.log(`[Editor ${activeElement.type}] Posisi diubah ke:`, item.a);
                                                if (item.a === 'full') {
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fullWidth: true });
                                                } else {
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fullWidth: false, align: item.a });
                                                }
                                              }}
                                              className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${isSelected ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                              {item.label}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                     {/* 2. Penulisan */}
                                     <div className="flex justify-between items-center relative">
                                       <span className="text-xs text-zinc-300 font-semibold">Penulisan</span>
                                       <div className="flex gap-1.5 items-center">
                                         <button
                                           type="button"
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             setActivePopover(activePopover === 'btnTypography' ? null : 'btnTypography');
                                           }}
                                           className={`p-1 rounded transition-colors ${activePopover === 'btnTypography' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
                                         >
                                           <Pencil className="w-3.5 h-3.5" />
                                         </button>

                                         {activePopover === 'btnTypography' && (
                                           <div className="absolute right-0 top-7 z-50 bg-[#18181b] border border-zinc-800 rounded-xl p-3.5 shadow-2xl w-72 space-y-3.5 text-xs text-zinc-300" onClick={(e) => e.stopPropagation()}>
                                             {/* Header */}
                                             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
                                               <span>Penulisan</span>
                                               <div className="flex items-center gap-2">
                                                 <button
                                                   type="button"
                                                   title="Reset Penulisan"
                                                   onClick={() => {
                                                     console.log('[Editor BUTTON] Reset penulisan');
                                                     handleUpdateElement(editingSection.id, activeElement.id, {
                                                       fontFamily: 'inherit',
                                                       fontSize: 16,
                                                       fontSizeUnit: 'px',
                                                       fontWeight: '600',
                                                       textTransform: 'none',
                                                       fontStyle: 'normal',
                                                       textDecoration: 'none',
                                                       lineHeight: 1.2,
                                                       lineHeightUnit: 'em',
                                                       letterSpacing: 0,
                                                       letterSpacingUnit: 'px',
                                                       wordSpacing: 0,
                                                       wordSpacingUnit: 'px'
                                                     });
                                                   }}
                                                   className="text-zinc-500 hover:text-white transition-colors"
                                                 >
                                                   <RotateCcw className="w-3 h-3" />
                                                 </button>
                                                 <Plus className="w-3 h-3 text-zinc-500" />
                                               </div>
                                             </div>
                                             
                                             {/* Family */}
                                             <div className="flex items-center justify-between gap-2">
                                               <span className="text-zinc-400 font-semibold text-[11px]">Family</span>
                                               <select
                                                 value={activeElement.config.fontFamily || 'Inter'}
                                                 onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontFamily: e.target.value })}
                                                 className="w-[140px] p-1.5 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-medium"
                                               >
                                                 <option value="inherit">Inherit</option>
                                                 {POPULAR_FONTS.map(cat => (
                                                   <optgroup key={cat.category} label={cat.category} className="bg-zinc-950 text-zinc-300 font-bold">
                                                     {cat.fonts.map(f => (
                                                       <option key={f.value} value={f.value} className="bg-zinc-900 text-zinc-100 font-normal">{f.label}</option>
                                                     ))}
                                                   </optgroup>
                                                 ))}
                                               </select>
                                             </div>

                                             {/* Ukuran */}
                                             <div className="space-y-1">
                                               <div className="flex justify-between items-center">
                                                 <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
                                                   <span>Ukuran</span>
                                                   <Monitor className="w-3 h-3 text-zinc-500" />
                                                 </div>
                                                 <select
                                                   value={activeElement.config.fontSizeUnit || 'px'}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontSizeUnit: e.target.value })}
                                                   className="bg-zinc-950 border border-zinc-850 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 outline-none font-bold focus:ring-0 cursor-pointer"
                                                 >
                                                   <option value="px" className="bg-zinc-950 text-zinc-300">px</option>
                                                   <option value="rem" className="bg-zinc-950 text-zinc-300">rem</option>
                                                 </select>
                                               </div>
                                               <div className="flex items-center gap-3">
                                                 <input
                                                   type="range"
                                                   min="8"
                                                   max="64"
                                                   value={activeElement.config.fontSize ?? 30}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontSize: Number(e.target.value) })}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="8"
                                                   max="100"
                                                   value={activeElement.config.fontSize ?? 30}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontSize: Number(e.target.value) })}
                                                   className="w-[45px] p-1 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded outline-none text-[11px] font-bold"
                                                 />
                                               </div>
                                             </div>

                                             {/* Ketebalan */}
                                             <div className="flex items-center justify-between gap-2">
                                               <span className="text-zinc-400 font-semibold text-[11px]">Ketebalan</span>
                                               <select
                                                 value={activeElement.config.fontWeight || '600'}
                                                 onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontWeight: e.target.value })}
                                                 className="w-[140px] p-1.5 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-medium"
                                               >
                                                 <option value="100">100 (Thin)</option>
                                                 <option value="200">200 (Extra Light)</option>
                                                 <option value="300">300 (Light)</option>
                                                 <option value="400">400 (Regular)</option>
                                                 <option value="500">500 (Medium)</option>
                                                 <option value="600">600 (Semi Bold)</option>
                                                 <option value="700">700 (Bold)</option>
                                                 <option value="800">800 (Extra Bold)</option>
                                                 <option value="900">900 (Black)</option>
                                               </select>
                                             </div>

                                             {/* Transformasi */}
                                             <div className="flex items-center justify-between gap-2">
                                               <span className="text-zinc-400 font-semibold text-[11px]">Transformasi</span>
                                               <select
                                                 value={activeElement.config.textTransform || 'none'}
                                                 onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textTransform: e.target.value })}
                                                 className="w-[140px] p-1.5 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-medium"
                                               >
                                                 <option value="none">Asali</option>
                                                 <option value="uppercase">KAPITAL</option>
                                                 <option value="lowercase">huruf kecil</option>
                                                 <option value="capitalize">Huruf Besar Di Awal</option>
                                               </select>
                                             </div>

                                             {/* Gaya */}
                                             <div className="flex items-center justify-between gap-2">
                                               <span className="text-zinc-400 font-semibold text-[11px]">Gaya</span>
                                               <select
                                                 value={activeElement.config.fontStyle || 'normal'}
                                                 onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontStyle: e.target.value })}
                                                 className="w-[140px] p-1.5 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-medium"
                                               >
                                                 <option value="normal">Asali</option>
                                                 <option value="italic">Miring</option>
                                               </select>
                                             </div>

                                             {/* Dekorasi */}
                                             <div className="flex items-center justify-between gap-2">
                                               <span className="text-zinc-400 font-semibold text-[11px]">Dekorasi</span>
                                               <select
                                                 value={activeElement.config.textDecoration || 'none'}
                                                 onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textDecoration: e.target.value })}
                                                 className="w-[140px] p-1.5 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-medium"
                                               >
                                                 <option value="none">Asali</option>
                                                 <option value="underline">Garis Bawah</option>
                                                 <option value="line-through">Coret</option>
                                               </select>
                                             </div>

                                             {/* Line Height */}
                                             <div className="space-y-1">
                                               <div className="flex justify-between items-center">
                                                 <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
                                                   <span>Line Height</span>
                                                   <Monitor className="w-3 h-3 text-zinc-500" />
                                                 </div>
                                                 <select
                                                   value={activeElement.config.lineHeightUnit || 'em'}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { lineHeightUnit: e.target.value })}
                                                   className="bg-zinc-950 border border-zinc-855 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 outline-none font-bold focus:ring-0 cursor-pointer"
                                                 >
                                                   <option value="px">px</option>
                                                   <option value="em">em</option>
                                                   <option value="rem">rem</option>
                                                 </select>
                                               </div>
                                               <div className="flex items-center gap-3">
                                                 <input
                                                   type="range"
                                                   min="0"
                                                   max="100"
                                                   step="0.1"
                                                   value={activeElement.config.lineHeight ?? 1.2}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { lineHeight: Number(e.target.value) })}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="0"
                                                   max="200"
                                                   step="0.1"
                                                   value={activeElement.config.lineHeight ?? 1.2}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { lineHeight: Number(e.target.value) })}
                                                   className="w-[45px] p-1 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded outline-none text-[11px] font-bold"
                                                 />
                                               </div>
                                             </div>

                                             {/* Letter Spacing */}
                                             <div className="space-y-1">
                                               <div className="flex justify-between items-center">
                                                 <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
                                                   <span>Letter Spacing</span>
                                                   <Monitor className="w-3 h-3 text-zinc-500" />
                                                 </div>
                                                 <select
                                                   value={activeElement.config.letterSpacingUnit || 'px'}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { letterSpacingUnit: e.target.value })}
                                                   className="bg-zinc-950 border border-zinc-860 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 outline-none font-bold focus:ring-0 cursor-pointer"
                                                 >
                                                   <option value="px">px</option>
                                                   <option value="rem">rem</option>
                                                 </select>
                                               </div>
                                               <div className="flex items-center gap-3">
                                                 <input
                                                   type="range"
                                                   min="-5"
                                                   max="20"
                                                   value={activeElement.config.letterSpacing ?? 0}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { letterSpacing: Number(e.target.value) })}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="-20"
                                                   max="100"
                                                   value={activeElement.config.letterSpacing ?? 0}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { letterSpacing: Number(e.target.value) })}
                                                   className="w-[45px] p-1 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded outline-none text-[11px] font-bold"
                                                 />
                                               </div>
                                             </div>

                                             {/* Spasi Kata */}
                                             <div className="space-y-1">
                                               <div className="flex justify-between items-center">
                                                 <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
                                                   <span>Spasi Kata</span>
                                                   <Monitor className="w-3 h-3 text-zinc-500" />
                                                 </div>
                                                 <select
                                                   value={activeElement.config.wordSpacingUnit || 'px'}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { wordSpacingUnit: e.target.value })}
                                                   className="bg-zinc-950 border border-zinc-865 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 outline-none font-bold focus:ring-0 cursor-pointer"
                                                 >
                                                   <option value="px">px</option>
                                                   <option value="rem">rem</option>
                                                 </select>
                                               </div>
                                               <div className="flex items-center gap-3">
                                                 <input
                                                   type="range"
                                                   min="-5"
                                                   max="40"
                                                   value={activeElement.config.wordSpacing ?? 0}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { wordSpacing: Number(e.target.value) })}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="-20"
                                                   max="100"
                                                   value={activeElement.config.wordSpacing ?? 0}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { wordSpacing: Number(e.target.value) })}
                                                   className="w-[45px] p-1 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded outline-none text-[11px] font-bold"
                                                 />
                                               </div>
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                      </div>

                                       {/* 3. Text Shadow */}
                                      <div className="flex justify-between items-center relative">
                                       <span className="text-xs text-zinc-300 font-semibold">Text Shadow</span>
                                       <div className="flex gap-1.5 items-center">
                                         <button
                                           type="button"
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             setActivePopover(activePopover === 'btnTextShadow' ? null : 'btnTextShadow');
                                           }}
                                           className={`p-1 rounded transition-colors ${activePopover === 'btnTextShadow' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
                                         >
                                           <Pencil className="w-3.5 h-3.5" />
                                         </button>

                                         {activePopover === 'btnTextShadow' && (
                                           <div className="absolute right-0 top-7 z-50 bg-[#18181b] border border-zinc-800 rounded-xl p-3.5 shadow-2xl w-64 space-y-3.5" onClick={(e) => e.stopPropagation()}>
                                             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-1.5">
                                               <span>Text Shadow</span>
                                               <button
                                                 type="button"
                                                 title="Reset Text Shadow"
                                                 onClick={() => {
                                                   console.log('[Editor BUTTON] Reset text shadow');
                                                   handleUpdateElement(editingSection.id, activeElement.id, {
                                                     textShadowOffsetX: 0,
                                                     textShadowOffsetY: 0,
                                                     textShadowBlur: 10,
                                                     textShadowColor: 'rgba(0,0,0,0.5)'
                                                   });
                                                 }}
                                                 className="text-zinc-500 hover:text-white transition-colors"
                                               >
                                                 <RotateCcw className="w-3.5 h-3.5" />
                                               </button>
                                             </div>
                                             
                                             {/* Warna */}
                                             <div className="flex items-center justify-between gap-2">
                                               <span className="text-xs text-zinc-400 font-semibold">Warna</span>
                                               <div className="flex gap-1.5 items-center w-[140px]">
                                                 <input
                                                   type="color"
                                                   value={
                                                     (btnStyleMode === 'hover' 
                                                       ? activeElement.config.hoverTextShadowColor 
                                                       : activeElement.config.textShadowColor) && 
                                                     (btnStyleMode === 'hover' 
                                                       ? activeElement.config.hoverTextShadowColor 
                                                       : activeElement.config.textShadowColor).startsWith('#')
                                                       ? (btnStyleMode === 'hover' ? activeElement.config.hoverTextShadowColor : activeElement.config.textShadowColor)
                                                       : '#000000'
                                                   }
                                                   onChange={(e) => {
                                                     handleUpdateElement(editingSection.id, activeElement.id, 
                                                       btnStyleMode === 'hover' ? { hoverTextShadowColor: e.target.value } : { textShadowColor: e.target.value }
                                                     );
                                                   }}
                                                   className="w-8 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5 shrink-0"
                                                 />
                                                 <input
                                                   type="text"
                                                   value={btnStyleMode === 'hover' ? (activeElement.config.hoverTextShadowColor || 'rgba(0,0,0,0.5)') : (activeElement.config.textShadowColor || 'rgba(0,0,0,0.5)')}
                                                   onChange={(e) => {
                                                     handleUpdateElement(editingSection.id, activeElement.id, 
                                                       btnStyleMode === 'hover' ? { hoverTextShadowColor: e.target.value } : { textShadowColor: e.target.value }
                                                     );
                                                   }}
                                                   placeholder="rgba(0,0,0,0.5)"
                                                   className="flex-1 px-1.5 py-1 h-7 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none w-0"
                                                 />
                                               </div>
                                             </div>

                                             {/* Buram */}
                                             <div className="space-y-1">
                                               <span className="text-zinc-400 font-semibold text-[11px] block">Buram</span>
                                               <div className="flex items-center gap-3">
                                                 <input
                                                   type="range"
                                                   min="0"
                                                   max="40"
                                                   value={btnStyleMode === 'hover' ? (activeElement.config.hoverTextShadowBlur ?? 10) : (activeElement.config.textShadowBlur ?? 10)}
                                                   onChange={(e) => {
                                                     const val = Number(e.target.value);
                                                     handleUpdateElement(editingSection.id, activeElement.id, 
                                                       btnStyleMode === 'hover' ? { hoverTextShadowBlur: val } : { textShadowBlur: val }
                                                     );
                                                   }}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="0"
                                                   max="100"
                                                   value={btnStyleMode === 'hover' ? (activeElement.config.hoverTextShadowBlur ?? 10) : (activeElement.config.textShadowBlur ?? 10)}
                                                   onChange={(e) => {
                                                     const val = Number(e.target.value);
                                                     handleUpdateElement(editingSection.id, activeElement.id, 
                                                       btnStyleMode === 'hover' ? { hoverTextShadowBlur: val } : { textShadowBlur: val }
                                                     );
                                                   }}
                                                   className="w-[45px] p-1 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded outline-none text-[11px] font-bold"
                                                 />
                                               </div>
                                             </div>

                                             {/* Mendatar */}
                                             <div className="space-y-1">
                                               <span className="text-zinc-400 font-semibold text-[11px] block">Mendatar</span>
                                               <div className="flex items-center gap-3">
                                                 <input
                                                   type="range"
                                                   min="-20"
                                                   max="20"
                                                   value={btnStyleMode === 'hover' ? (activeElement.config.hoverTextShadowOffsetX ?? 0) : (activeElement.config.textShadowOffsetX ?? 0)}
                                                   onChange={(e) => {
                                                     const val = Number(e.target.value);
                                                     handleUpdateElement(editingSection.id, activeElement.id, 
                                                       btnStyleMode === 'hover' ? { hoverTextShadowOffsetX: val } : { textShadowOffsetX: val }
                                                     );
                                                   }}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="-100"
                                                   max="100"
                                                   value={btnStyleMode === 'hover' ? (activeElement.config.hoverTextShadowOffsetX ?? 0) : (activeElement.config.textShadowOffsetX ?? 0)}
                                                   onChange={(e) => {
                                                     const val = Number(e.target.value);
                                                     handleUpdateElement(editingSection.id, activeElement.id, 
                                                       btnStyleMode === 'hover' ? { hoverTextShadowOffsetX: val } : { textShadowOffsetX: val }
                                                     );
                                                   }}
                                                   className="w-[45px] p-1 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded outline-none text-[11px] font-bold"
                                                 />
                                               </div>
                                             </div>

                                             {/* Vertikal */}
                                             <div className="space-y-1">
                                               <span className="text-zinc-400 font-semibold text-[11px] block">Vertikal</span>
                                               <div className="flex items-center gap-3">
                                                 <input
                                                   type="range"
                                                   min="-20"
                                                   max="20"
                                                   value={btnStyleMode === 'hover' ? (activeElement.config.hoverTextShadowOffsetY ?? 0) : (activeElement.config.textShadowOffsetY ?? 0)}
                                                   onChange={(e) => {
                                                     const val = Number(e.target.value);
                                                     handleUpdateElement(editingSection.id, activeElement.id, 
                                                       btnStyleMode === 'hover' ? { hoverTextShadowOffsetY: val } : { textShadowOffsetY: val }
                                                     );
                                                   }}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="-100"
                                                   max="100"
                                                   value={btnStyleMode === 'hover' ? (activeElement.config.hoverTextShadowOffsetY ?? 0) : (activeElement.config.textShadowOffsetY ?? 0)}
                                                   onChange={(e) => {
                                                     const val = Number(e.target.value);
                                                     handleUpdateElement(editingSection.id, activeElement.id, 
                                                       btnStyleMode === 'hover' ? { hoverTextShadowOffsetY: val } : { textShadowOffsetY: val }
                                                     );
                                                   }}
                                                   className="w-[45px] p-1 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded outline-none text-[11px] font-bold"
                                                 />
                                               </div>
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                     </div>

                                     {/* Stroke Teks */}
                                     <div className="flex justify-between items-center relative">
                                       <span className="text-xs text-zinc-300 font-semibold">Stroke Teks</span>
                                       <div className="flex gap-1.5 items-center">
                                         <button
                                           type="button"
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             setActivePopover(activePopover === 'btnTextStroke' ? null : 'btnTextStroke');
                                           }}
                                           className={`p-1 rounded transition-colors ${activePopover === 'btnTextStroke' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
                                         >
                                           <Pencil className="w-3.5 h-3.5" />
                                         </button>

                                         {activePopover === 'btnTextStroke' && (
                                           <div className="absolute right-0 top-7 z-50 bg-[#18181b] border border-zinc-800 rounded-xl p-3.5 shadow-2xl w-64 space-y-3.5" onClick={(e) => e.stopPropagation()}>
                                             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-1.5">
                                               <span>Stroke Teks</span>
                                               <button
                                                 type="button"
                                                 title="Reset Stroke"
                                                 onClick={() => {
                                                   console.log('[Editor BUTTON] Reset stroke teks');
                                                   handleUpdateElement(editingSection.id, activeElement.id, {
                                                     textStrokeWidth: 0,
                                                     textStrokeWidthUnit: 'px',
                                                     textStrokeColor: '#000000'
                                                   });
                                                 }}
                                                 className="text-zinc-500 hover:text-white transition-colors"
                                               >
                                                 <RotateCcw className="w-3 h-3" />
                                               </button>
                                             </div>
                                             
                                             {/* Stroke Teks Width */}
                                             <div className="space-y-1.5">
                                               <div className="flex justify-between items-center">
                                                 <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
                                                   <span>Stroke Teks</span>
                                                   <Monitor className="w-3 h-3 text-zinc-500" />
                                                 </div>
                                                 <select
                                                   value={activeElement.config.textStrokeWidthUnit || 'px'}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textStrokeWidthUnit: e.target.value })}
                                                   className="bg-zinc-950 border border-zinc-850 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 outline-none font-bold focus:ring-0 cursor-pointer"
                                                 >
                                                   <option value="px" className="bg-zinc-950 text-zinc-300">px</option>
                                                   <option value="rem" className="bg-zinc-950 text-zinc-300">rem</option>
                                                 </select>
                                               </div>
                                               <div className="flex items-center gap-3">
                                                 <input
                                                   type="range"
                                                   min="0"
                                                   max="10"
                                                   step="0.5"
                                                   value={activeElement.config.textStrokeWidth ?? 0}
                                                   onChange={(e) => {
                                                     handleUpdateElement(editingSection.id, activeElement.id, { textStrokeWidth: Number(e.target.value) });
                                                   }}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="0"
                                                   max="20"
                                                   step="0.5"
                                                   value={activeElement.config.textStrokeWidth ?? 0}
                                                   onChange={(e) => {
                                                     handleUpdateElement(editingSection.id, activeElement.id, { textStrokeWidth: Number(e.target.value) });
                                                   }}
                                                   className="w-[45px] p-1 bg-zinc-950/80 border border-zinc-800 text-white text-center rounded outline-none text-[11px] font-bold"
                                                 />
                                               </div>
                                             </div>

                                             {/* Warna Stroke */}
                                             <div className="space-y-1.5">
                                               <span className="text-[11px] font-semibold text-zinc-400 block">Warna Stroke</span>
                                               <div className="flex gap-2">
                                                 <input
                                                   type="color"
                                                   value={activeElement.config.textStrokeColor || '#000000'}
                                                   onChange={(e) => {
                                                     handleUpdateElement(editingSection.id, activeElement.id, { textStrokeColor: e.target.value });
                                                   }}
                                                   className="w-8 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5 shrink-0"
                                                 />
                                                 <input
                                                   type="text"
                                                   value={activeElement.config.textStrokeColor || '#000000'}
                                                   onChange={(e) => {
                                                     handleUpdateElement(editingSection.id, activeElement.id, { textStrokeColor: e.target.value });
                                                   }}
                                                   placeholder="#000000"
                                                   className="flex-1 px-1.5 h-7 rounded text-[11px] bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none w-0"
                                                 />
                                               </div>
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                     </div>

                                      {/* 4. Normal | Sorotan Segmented Control */}
                                      <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 w-full">
                                        <button
                                          type="button"
                                          onClick={() => setBtnStyleMode('normal')}
                                          className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${btnStyleMode === 'normal' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                          Normal
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setBtnStyleMode('hover')}
                                          className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${btnStyleMode === 'hover' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                          Sorotan
                                        </button>
                                      </div>

                                     {/* Background Type */}
                                     <div className="flex justify-between items-center">
                                       <span className="text-xs text-zinc-300 font-semibold">Background Type</span>
                                       <div className="flex bg-zinc-950 border border-zinc-800 rounded p-0.5">
                                         {[
                                           { type: 'solid', label: 'solid' },
                                           { type: 'gradient', label: 'gradient' }
                                         ].map((item) => {
                                           const currentType = btnStyleMode === 'hover' 
                                             ? (activeElement.config.hoverBgType || 'solid') 
                                             : (activeElement.config.bgType || 'solid');
                                           const isSelected = currentType === item.type;
                                           return (
                                             <button
                                               key={item.type}
                                               type="button"
                                               onClick={() => {
                                                 console.log(`[Editor BUTTON] hover/normal bgType diubah ke:`, item.type);
                                                 handleUpdateElement(editingSection.id, activeElement.id, 
                                                   btnStyleMode === 'hover' ? { hoverBgType: item.type } : { bgType: item.type }
                                                 );
                                               }}
                                               className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${isSelected ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                                             >
                                               {item.type === 'solid' ? (
                                                 <Paintbrush className="w-3.5 h-3.5" />
                                               ) : (
                                                 <Layers className="w-3.5 h-3.5" />
                                               )}
                                             </button>
                                           );
                                         })}
                                       </div>
                                     </div>
                                     {/* Warna / Gradien */}
                                     {((btnStyleMode === 'hover' ? (activeElement.config.hoverBgType || 'solid') : (activeElement.config.bgType || 'solid')) === 'solid') ? (
                                       <div className="flex justify-between items-center">
                                          <span className="text-xs text-zinc-300 font-semibold">Warna Latar</span>
                                         <div className="flex items-center gap-1">
                                           {(btnStyleMode === 'hover' ? activeElement.config.hoverBgColor : activeElement.config.bgColor) && (
                                             <button
                                               type="button"
                                               onClick={() => {
                                                 handleUpdateElement(editingSection.id, activeElement.id,
                                                   btnStyleMode === 'hover' ? { hoverBgColor: undefined } : { bgColor: undefined }
                                                 );
                                               }}
                                               className="p-1 rounded hover:bg-zinc-800 transition-colors"
                                               title="Reset Warna"
                                             >
                                               <RotateCcw className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                                             </button>
                                           )}
                                           <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-7">
                                             <div className="relative w-8 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
                                               <div 
                                                 className="w-full h-full rounded-md border border-zinc-800/80" 
                                                 style={{ backgroundColor: btnStyleMode === 'hover' ? (activeElement.config.hoverBgColor || '#2563eb') : (activeElement.config.bgColor || '#2563eb') }}
                                               />
                                               <input
                                                 type="color"
                                                 value={btnStyleMode === 'hover' ? (activeElement.config.hoverBgColor || '#2563eb') : (activeElement.config.bgColor || '#2563eb')}
                                                 onChange={(e) => {
                                                   handleUpdateElement(editingSection.id, activeElement.id, 
                                                     btnStyleMode === 'hover' ? { hoverBgColor: e.target.value } : { bgColor: e.target.value }
                                                   );
                                                 }}
                                                 className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                               />
                                             </div>
                                           </div>
                                         </div>
                                       </div>
                                    ) : (
                                      <div className="space-y-2 p-2 bg-[#18181b]/40 border border-zinc-800 rounded-lg">
                                        {/* Awal */}
                                        <div className="flex justify-between items-center">
                                          <span className="text-[10px] text-zinc-400 font-semibold">Gradien Awal</span>
                                          <input
                                            type="color"
                                            value={btnStyleMode === 'hover' ? (activeElement.config.hoverGradientStart || '#3b82f6') : (activeElement.config.gradientStart || '#3b82f6')}
                                            onChange={(e) => {
                                              handleUpdateElement(editingSection.id, activeElement.id, 
                                                btnStyleMode === 'hover' ? { hoverGradientStart: e.target.value } : { gradientStart: e.target.value }
                                              );
                                            }}
                                            className="w-6 h-6 rounded cursor-pointer border border-zinc-800 bg-transparent p-0"
                                          />
                                        </div>
                                        {/* Akhir */}
                                        <div className="flex justify-between items-center">
                                          <span className="text-[10px] text-zinc-400 font-semibold">Gradien Akhir</span>
                                          <input
                                            type="color"
                                            value={btnStyleMode === 'hover' ? (activeElement.config.hoverGradientEnd || '#8b5cf6') : (activeElement.config.gradientEnd || '#8b5cf6')}
                                            onChange={(e) => {
                                              handleUpdateElement(editingSection.id, activeElement.id, 
                                                btnStyleMode === 'hover' ? { hoverGradientEnd: e.target.value } : { gradientEnd: e.target.value }
                                              );
                                            }}
                                            className="w-6 h-6 rounded cursor-pointer border border-zinc-800 bg-transparent p-0"
                                          />
                                        </div>
                                        {/* Arah */}
                                        <div className="flex justify-between items-center">
                                          <span className="text-[10px] text-zinc-400 font-semibold">Arah</span>
                                          <select
                                            value={btnStyleMode === 'hover' ? (activeElement.config.hoverGradientAngle || 'to right') : (activeElement.config.gradientAngle || 'to right')}
                                            onChange={(e) => {
                                              handleUpdateElement(editingSection.id, activeElement.id, 
                                                btnStyleMode === 'hover' ? { hoverGradientAngle: e.target.value } : { gradientAngle: e.target.value }
                                              );
                                            }}
                                            className="p-1 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-semibold"
                                          >
                                            <option value="to right">Kanan (→)</option>
                                            <option value="to left">Kiri (←)</option>
                                            <option value="to bottom">Bawah (↓)</option>
                                            <option value="to top">Atas (↑)</option>
                                            <option value="to bottom right">Kanan Bawah (↘)</option>
                                            <option value="to top right">Kanan Atas (↗)</option>
                                          </select>
                                        </div>
                                      </div>
                                    )}

                                     {/* 5. Warna Teks */}
                                     <div className="flex justify-between items-center">
                                       <span className="text-xs text-zinc-300 font-semibold">Warna Teks</span>
                                       <div className="flex items-center gap-1">
                                         {(btnStyleMode === 'hover' ? activeElement.config.hoverTextColor : activeElement.config.textColor) && (
                                           <button
                                             type="button"
                                             onClick={() => {
                                               handleUpdateElement(editingSection.id, activeElement.id,
                                                 btnStyleMode === 'hover' ? { hoverTextColor: undefined } : { textColor: undefined }
                                               );
                                             }}
                                             className="p-1 rounded hover:bg-zinc-800 transition-colors"
                                             title="Reset Warna Teks"
                                           >
                                             <RotateCcw className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                                           </button>
                                         )}
                                         <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-7">
                                           <div className="relative w-8 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
                                             <div
                                               className="w-full h-full rounded-md border border-zinc-800/80"
                                               style={{ backgroundColor: btnStyleMode === 'hover' ? (activeElement.config.hoverTextColor || '#ffffff') : (activeElement.config.textColor || '#ffffff') }}
                                             />
                                             <input
                                               type="color"
                                               value={btnStyleMode === 'hover' ? (activeElement.config.hoverTextColor || '#ffffff') : (activeElement.config.textColor || '#ffffff')}
                                               onChange={(e) => {
                                                 handleUpdateElement(editingSection.id, activeElement.id,
                                                   btnStyleMode === 'hover' ? { hoverTextColor: e.target.value } : { textColor: e.target.value }
                                                 );
                                               }}
                                               className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                             />
                                           </div>
                                         </div>
                                       </div>
                                     </div>

                                     {/* Box Shadow */}
                                     <div className="flex justify-between items-center relative">
                                      <span className="text-xs text-zinc-300 font-semibold">Box Shadow</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActivePopover(activePopover === 'btnBoxShadow' ? null : 'btnBoxShadow');
                                        }}
                                        className={`p-1 rounded transition-colors ${activePopover === 'btnBoxShadow' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>

                                      {activePopover === 'btnBoxShadow' && (
                                        <div className="absolute right-0 top-7 z-50 bg-[#18181b] border border-zinc-800 rounded-xl p-3.5 shadow-2xl w-56 space-y-3" onClick={(e) => e.stopPropagation()}>
                                          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-1.5">
                                            Bayangan Tombol {btnStyleMode === 'hover' ? '(Sorotan)' : '(Normal)'}
                                          </div>
                                          
                                          {/* Offset X */}
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase">
                                              <span>Offset X</span>
                                              <span className="text-blue-400">
                                                {btnStyleMode === 'hover' ? (activeElement.config.hoverBoxShadowOffsetX ?? 0) : (activeElement.config.boxShadowOffsetX ?? 0)}px
                                              </span>
                                            </div>
                                            <input
                                              type="range"
                                              min="-20"
                                              max="20"
                                              value={btnStyleMode === 'hover' ? (activeElement.config.hoverBoxShadowOffsetX ?? 0) : (activeElement.config.boxShadowOffsetX ?? 0)}
                                              onChange={(e) => {
                                                const val = Number(e.target.value);
                                                handleUpdateElement(editingSection.id, activeElement.id, 
                                                  btnStyleMode === 'hover' ? { hoverBoxShadowOffsetX: val } : { boxShadowOffsetX: val }
                                                );
                                              }}
                                              className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                                            />
                                          </div>

                                          {/* Offset Y */}
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase">
                                              <span>Offset Y</span>
                                              <span className="text-blue-400">
                                                {btnStyleMode === 'hover' ? (activeElement.config.hoverBoxShadowOffsetY ?? 0) : (activeElement.config.boxShadowOffsetY ?? 0)}px
                                              </span>
                                            </div>
                                            <input
                                              type="range"
                                              min="-20"
                                              max="20"
                                              value={btnStyleMode === 'hover' ? (activeElement.config.hoverBoxShadowOffsetY ?? 0) : (activeElement.config.boxShadowOffsetY ?? 0)}
                                              onChange={(e) => {
                                                const val = Number(e.target.value);
                                                handleUpdateElement(editingSection.id, activeElement.id, 
                                                  btnStyleMode === 'hover' ? { hoverBoxShadowOffsetY: val } : { boxShadowOffsetY: val }
                                                );
                                              }}
                                              className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                                            />
                                          </div>

                                          {/* Blur */}
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase">
                                              <span>Blur</span>
                                              <span className="text-blue-400">
                                                {btnStyleMode === 'hover' ? (activeElement.config.hoverBoxShadowBlur ?? 0) : (activeElement.config.boxShadowBlur ?? 0)}px
                                              </span>
                                            </div>
                                            <input
                                              type="range"
                                              min="0"
                                              max="40"
                                              value={btnStyleMode === 'hover' ? (activeElement.config.hoverBoxShadowBlur ?? 0) : (activeElement.config.boxShadowBlur ?? 0)}
                                              onChange={(e) => {
                                                const val = Number(e.target.value);
                                                handleUpdateElement(editingSection.id, activeElement.id, 
                                                  btnStyleMode === 'hover' ? { hoverBoxShadowBlur: val } : { boxShadowBlur: val }
                                                );
                                              }}
                                              className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                                            />
                                          </div>

                                          {/* Warna */}
                                          <div className="space-y-1">
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase">Warna Bayangan</span>
                                            <div className="flex gap-2">
                                              <input
                                                type="color"
                                                value={btnStyleMode === 'hover' ? (activeElement.config.hoverBoxShadowColor || 'rgba(0,0,0,0.15)') : (activeElement.config.boxShadowColor || 'rgba(0,0,0,0.15)')}
                                                onChange={(e) => {
                                                  handleUpdateElement(editingSection.id, activeElement.id, 
                                                    btnStyleMode === 'hover' ? { hoverBoxShadowColor: e.target.value } : { boxShadowColor: e.target.value }
                                                  );
                                                }}
                                                className="w-8 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                              />
                                              <input
                                                type="text"
                                                value={btnStyleMode === 'hover' ? (activeElement.config.hoverBoxShadowColor || '') : (activeElement.config.boxShadowColor || '')}
                                                onChange={(e) => {
                                                  handleUpdateElement(editingSection.id, activeElement.id, 
                                                    btnStyleMode === 'hover' ? { hoverBoxShadowColor: e.target.value } : { boxShadowColor: e.target.value }
                                                  );
                                                }}
                                                placeholder="rgba(0,0,0,0.15)"
                                                className="flex-1 px-2 h-7 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none"
                                              />
                                            </div>
                                          </div>

                                          <div className="flex justify-end pt-1">
                                            <button
                                              type="button"
                                              onClick={() => setActivePopover(null)}
                                              className="px-2 py-1 rounded bg-zinc-800 text-zinc-200 text-[10px] font-bold hover:bg-zinc-700"
                                            >
                                              Selesai
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Durasi Transisi & Animasi Sorotan (Hanya Muncul saat Sorotan/Hover Aktif) */}
                                    {btnStyleMode === 'hover' && (
                                      <>
                                        {/* Durasi Transisi */}
                                        <div className="space-y-1">
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs text-zinc-300 font-semibold">Durasi Transisi</span>
                                            <span className="text-[10px] text-blue-400 font-extrabold">{activeElement.config.transitionDuration ?? 0.2}s</span>
                                          </div>
                                          <input
                                            type="range"
                                            min="0"
                                            max="2"
                                            step="0.1"
                                            value={activeElement.config.transitionDuration ?? 0.2}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log("[Editor BUTTON] transitionDuration diubah ke:", val);
                                              handleUpdateElement(editingSection.id, activeElement.id, { transitionDuration: val });
                                            }}
                                            className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                          />
                                        </div>

                                        {/* Animasi Sorotan */}
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-zinc-300 font-semibold">Animasi Sorotan</span>
                                          <select
                                            value={activeElement.config.hoverAnimation || 'none'}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              console.log("[Editor BUTTON] hoverAnimation diubah ke:", val);
                                              handleUpdateElement(editingSection.id, activeElement.id, { hoverAnimation: val });
                                            }}
                                            className="p-1 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 font-semibold focus:border-zinc-700 outline-none w-32"
                                          >
                                            <option value="none">None</option>
                                            <option value="grow">Grow</option>
                                            <option value="shrink">Shrink</option>
                                            <option value="shift-up">Shift Up</option>
                                            <option value="shift-down">Shift Down</option>
                                            <option value="rotate">Rotate</option>
                                            <option value="pulse">Pulse</option>
                                            <option value="glow">Glow</option>
                                          </select>
                                        </div>
                                      </>
                                    )}

                                    {/* Divider */}
                                    <hr className="border-zinc-800/80" />

                                    {/* Border Type */}
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-zinc-300 font-semibold">Border Type</span>
                                      <select
                                        value={activeElement.config.borderStyle || 'none'}
                                        onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { borderStyle: e.target.value })}
                                        className="p-1 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 font-semibold focus:border-zinc-700 outline-none w-32"
                                      >
                                        <option value="none">Asali (None)</option>
                                        <option value="solid">Solid (Garis)</option>
                                        <option value="dashed">Dashed (Putus)</option>
                                        <option value="dotted">Dotted (Titik)</option>
                                      </select>
                                    </div>

                                    {activeElement.config.borderStyle && activeElement.config.borderStyle !== 'none' && (
                                      <>
                                        {/* Lebar/Ketebalan Batas */}
                                        <div className="space-y-1">
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs text-zinc-300 font-semibold">Ketebalan Batas</span>
                                            <span className="text-[10px] text-blue-400 font-extrabold">{activeElement.config.borderWidth ?? 0}px</span>
                                          </div>
                                          <input
                                            type="range"
                                            min="0"
                                            max="15"
                                            value={activeElement.config.borderWidth ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log("[Editor BUTTON] borderWidth diubah ke:", val);
                                              handleUpdateElement(editingSection.id, activeElement.id, { borderWidth: val });
                                            }}
                                            className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                          />
                                        </div>

                                        {/* Warna Batas */}
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-zinc-300 font-semibold">Warna Batas</span>
                                          <div className="flex items-center gap-1">
                                            {(btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor) && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  console.log('[Editor BUTTON Debug] Warna batas direset');
                                                  handleUpdateElement(editingSection.id, activeElement.id,
                                                    btnStyleMode === 'hover' ? { hoverBorderColor: undefined } : { borderColor: undefined }
                                                  );
                                                }}
                                                className="p-1 rounded hover:bg-zinc-800 transition-colors"
                                                title="Reset Warna Batas"
                                              >
                                                <RotateCcw className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                                              </button>
                                            )}
                                            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-7">
                                              <div className="relative w-8 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
                                                <div 
                                                  className="w-full h-full rounded-md border border-zinc-800/80" 
                                                  style={{ backgroundColor: btnStyleMode === 'hover' ? (activeElement.config.hoverBorderColor || '#2563eb') : (activeElement.config.borderColor || '#2563eb') }}
                                                />
                                                <input
                                                  type="color"
                                                  value={btnStyleMode === 'hover' ? (activeElement.config.hoverBorderColor || '#2563eb') : (activeElement.config.borderColor || '#2563eb')}
                                                  onChange={(e) => {
                                                    handleUpdateElement(editingSection.id, activeElement.id, 
                                                      btnStyleMode === 'hover' ? { hoverBorderColor: e.target.value } : { borderColor: e.target.value }
                                                    );
                                                  }}
                                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}


                                    {/* Radius Batas */}
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                          <span>Radius Batas</span>
                                          <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none">
                                          px v
                                        </div>
                                      </div>

                                      <div className="flex gap-1 items-start">
                                        <div className="flex-1 flex flex-col">
                                          <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                            {[
                                              { k: 'borderRadiusTopLeft', label: 'Atas', isLast: false },
                                              { k: 'borderRadiusTopRight', label: 'Kanan', isLast: false },
                                              { k: 'borderRadiusBottomRight', label: 'Bawah', isLast: false },
                                              { k: 'borderRadiusBottomLeft', label: 'Kiri', isLast: true }
                                            ].map((r) => (
                                              <input
                                                key={r.k}
                                                type="number"
                                                value={activeElement.config[r.k] !== undefined ? activeElement.config[r.k] : (activeElement.config.borderRadius ?? 8)}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor BUTTON] Mengubah ${r.k} ke: ${val}`);
                                                  const updates = { [r.k]: val };
                                                  if (btnBorderRadiusLink) {
                                                    updates.borderRadiusTopLeft = val;
                                                    updates.borderRadiusTopRight = val;
                                                    updates.borderRadiusBottomRight = val;
                                                    updates.borderRadiusBottomLeft = val;
                                                    updates.borderRadius = val;
                                                  }
                                                  handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                }}
                                                placeholder="0"
                                                className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!r.isLast ? 'border-r border-zinc-800' : ''}`}
                                              />
                                            ))}
                                          </div>
                                          <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                            <span>Atas</span>
                                            <span>Kanan</span>
                                            <span>Bawah</span>
                                            <span>Kiri</span>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newVal = !btnBorderRadiusLink;
                                            setBtnBorderRadiusLink(newVal);
                                            console.log(`[Editor BUTTON] Status tautan link radius batas ke: ${newVal}`);
                                          }}
                                          className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${btnBorderRadiusLink
                                            ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                            : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                            }`}
                                        >
                                          <Link2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Padding */}
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                          <span>Padding</span>
                                          <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none">
                                          px v
                                        </div>
                                      </div>

                                      <div className="flex gap-1 items-start">
                                        <div className="flex-1 flex flex-col">
                                          <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                            {[
                                              { k: 'paddingTop', label: 'Atas', isLast: false },
                                              { k: 'paddingRight', label: 'Kanan', isLast: false },
                                              { k: 'paddingBottom', label: 'Bawah', isLast: false },
                                              { k: 'paddingLeft', label: 'Kiri', isLast: true }
                                            ].map((p) => (
                                              <input
                                                key={p.k}
                                                type="number"
                                                value={activeElement.config[p.k] !== undefined ? activeElement.config[p.k] : (p.k.includes('Left') || p.k.includes('Right') ? (activeElement.config.paddingX ?? 24) : (activeElement.config.paddingY ?? 12))}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor BUTTON] Mengubah ${p.k} ke: ${val}`);
                                                  const updates = { [p.k]: val };
                                                  if (btnPaddingLink) {
                                                    updates.paddingTop = val;
                                                    updates.paddingRight = val;
                                                    updates.paddingBottom = val;
                                                    updates.paddingLeft = val;
                                                    updates.paddingY = val;
                                                    updates.paddingX = val;
                                                  }
                                                  handleUpdateElement(editingSection.id, activeElement.id, updates);
                                                }}
                                                placeholder="0"
                                                className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!p.isLast ? 'border-r border-zinc-800' : ''}`}
                                              />
                                            ))}
                                          </div>
                                          <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                            <span>Atas</span>
                                            <span>Kanan</span>
                                            <span>Bawah</span>
                                            <span>Kiri</span>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newVal = !btnPaddingLink;
                                            setBtnPaddingLink(newVal);
                                            console.log(`[Editor BUTTON] Status tautan link padding ke: ${newVal}`);
                                          }}
                                          className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${btnPaddingLink
                                            ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                            : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                            }`}
                                        >
                                          <Link2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {activeElement.type === 'CATEGORY_LIST' || activeElement.type === 'PRODUCT_LIST' ? (
                                  renderStyleTabContent(
                                    { ...editingSection, config: activeElement.config || {} },
                                    (nextSection: { config?: Record<string, any> }) => {
                                      const nextConfig = nextSection?.config || {};
                                      const currentConfig = activeElement.config || {};
                                      const patch: Record<string, any> = {};
                                      const keys = new Set([...Object.keys(currentConfig), ...Object.keys(nextConfig)]);
                                      keys.forEach((k) => { if (currentConfig[k] !== nextConfig[k]) patch[k] = nextConfig[k]; });
                                      if (Object.keys(patch).length > 0) {
                                        handleUpdateElement(editingSection.id, activeElement.id, patch);
                                      }
                                    },
                                    { editorCollapse, setEditorCollapse, sectionBgTab, setSectionBgTab, sectionBorderTab, setSectionBorderTab, activePopover, setActivePopover, bgBorderWidthLink, setBgBorderWidthLink, bgBorderRadiusLink, setBgBorderRadiusLink, openMediaModal, handleDeleteImage }
                                  )
                                ) : activeElement.type !== 'IMAGE' && activeElement.type !== 'HEADING' && activeElement.type !== 'BUTTON' && activeElement.type !== 'CART' && activeElement.type !== 'TEXT' && activeElement.type !== 'GALLERY' && (
                                  <div className="space-y-3">
                                    <div className="bg-[#18181b]/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-4">
                                      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                                        <Palette className="w-3.5 h-3.5 text-zinc-400" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Desain & Warna</span>
                                      </div>

                                      {/* Background Type */}
                                      <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-zinc-300 font-medium">Background Type</span>
                                        <div className="flex gap-0.5 bg-[#25262b] rounded p-0.5 border border-zinc-800">
                                          <button 
                                            type="button"
                                            onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgType: 'classic' })}
                                            className={`p-1.5 rounded shadow-sm transition-colors ${(activeElement.config.bgType || 'classic') === 'classic' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                                            title="Klasik"
                                          >
                                            <Paintbrush className="w-3.5 h-3.5" />
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgType: 'gradient' })}
                                            className={`p-1.5 rounded shadow-sm transition-colors ${(activeElement.config.bgType || 'classic') === 'gradient' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                                            title="Gradien"
                                          >
                                            <div className="w-3.5 h-3.5 rounded-[1px] bg-gradient-to-br from-zinc-300 to-zinc-600"></div>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Conditional Content based on bgType */}
                                      {(activeElement.config.bgType || 'classic') === 'classic' && (
                                          <div className="flex items-center justify-between py-1">
                                            <span className="text-xs text-zinc-300 font-medium">Warna</span>
                                            <div className="flex border border-zinc-700 rounded overflow-hidden">
                                              {activeElement.config.bgColor && activeElement.config.bgColor !== 'transparent' && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: 'transparent' })}
                                                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                <input 
                                                  type="color" 
                                                  value={activeElement.config.bgColor && activeElement.config.bgColor !== 'transparent' ? activeElement.config.bgColor : '#ffffff'} 
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value })} 
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                {(!activeElement.config.bgColor || activeElement.config.bgColor === 'transparent') ? (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0" style={{ backgroundColor: activeElement.config.bgColor }}></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                      )}

                                      {activeElement.config.bgType === 'gradient' && (
                                        <div className="space-y-4 pt-2">
                                          <div className="border-l-2 border-orange-500 bg-[#321c0c] p-3 text-[11px] text-orange-200/90 italic font-medium leading-relaxed">
                                            Set locations and angle for each breakpoint to ensure the gradient adapts to different screen sizes.
                                          </div>

                                          {/* Warna 1 */}
                                          <div className="flex items-center justify-between py-1">
                                            <span className="text-xs text-zinc-300 font-medium">Warna</span>
                                            <div className="flex border border-zinc-700 rounded overflow-hidden">
                                              {activeElement.config.bgGradientColor1 && activeElement.config.bgGradientColor1 !== 'transparent' && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientColor1: 'transparent' })}
                                                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                <input 
                                                  type="color" 
                                                  value={activeElement.config.bgGradientColor1 && activeElement.config.bgGradientColor1 !== 'transparent' ? activeElement.config.bgGradientColor1 : '#ffffff'} 
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientColor1: e.target.value })} 
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                {(!activeElement.config.bgGradientColor1 || activeElement.config.bgGradientColor1 === 'transparent') ? (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0" style={{ backgroundColor: activeElement.config.bgGradientColor1 }}></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Lokasi 1 */}
                                          <div className="space-y-2 py-1">
                                            <div className="flex justify-between items-center">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-300 font-medium">Lokasi</span>
                                                <Monitor className="w-3 h-3 text-zinc-400" />
                                              </div>
                                              <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                                                <span>%</span>
                                                <ChevronDown className="w-2.5 h-2.5" />
                                              </div>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                              <input 
                                                type="range" min="0" max="100" 
                                                value={activeElement.config.bgGradientLoc1 ?? 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientLoc1: Number(e.target.value) })}
                                                className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                              />
                                              <input 
                                                type="number" 
                                                value={activeElement.config.bgGradientLoc1 ?? 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientLoc1: Number(e.target.value) })}
                                                className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                              />
                                            </div>
                                          </div>

                                          {/* Second Color */}
                                          <div className="flex items-center justify-between py-1">
                                            <span className="text-xs text-zinc-300 font-medium">Second Color</span>
                                            <div className="flex border border-zinc-700 rounded overflow-hidden">
                                              {activeElement.config.bgGradientColor2 && activeElement.config.bgGradientColor2 !== 'transparent' && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientColor2: 'transparent' })}
                                                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                <input 
                                                  type="color" 
                                                  value={activeElement.config.bgGradientColor2 && activeElement.config.bgGradientColor2 !== 'transparent' ? activeElement.config.bgGradientColor2 : '#e83a65'} 
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientColor2: e.target.value })} 
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                {(!activeElement.config.bgGradientColor2 || activeElement.config.bgGradientColor2 === 'transparent') ? (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0" style={{ backgroundColor: activeElement.config.bgGradientColor2 || '#e83a65' }}></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Lokasi 2 */}
                                          <div className="space-y-2 py-1">
                                            <div className="flex justify-between items-center">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-300 font-medium">Lokasi</span>
                                                <Monitor className="w-3 h-3 text-zinc-400" />
                                              </div>
                                              <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                                                <span>%</span>
                                                <ChevronDown className="w-3 h-3" />
                                              </div>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                              <input 
                                                type="range" min="0" max="100" 
                                                value={activeElement.config.bgGradientLoc2 ?? 100}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientLoc2: Number(e.target.value) })}
                                                className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                              />
                                              <input 
                                                type="number" 
                                                value={activeElement.config.bgGradientLoc2 ?? 100}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientLoc2: Number(e.target.value) })}
                                                className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                              />
                                            </div>
                                          </div>

                                          {/* Tipe */}
                                          <div className="flex items-center justify-between py-1">
                                            <span className="text-xs text-zinc-300 font-medium">Tipe</span>
                                            <div className="relative">
                                              <select 
                                                value={activeElement.config.bgGradientType || 'linear'}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientType: e.target.value })}
                                                className="appearance-none w-[140px] bg-[#1e1f23] border border-zinc-700 text-zinc-300 text-xs font-medium rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:border-zinc-500"
                                              >
                                                <option value="linear">Linier</option>
                                                <option value="radial">Radial</option>
                                              </select>
                                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                                            </div>
                                          </div>

                                          {/* Sudut */}
                                          {(!activeElement.config.bgGradientType || activeElement.config.bgGradientType === 'linear') && (
                                            <div className="space-y-2 py-1">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-xs text-zinc-300 font-medium">Sudut</span>
                                                  <Monitor className="w-3 h-3 text-zinc-400" />
                                                </div>
                                                <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                                                  <span>deg</span>
                                                  <ChevronDown className="w-3 h-3" />
                                                </div>
                                              </div>
                                              <div className="flex gap-3 items-center">
                                                <input 
                                                  type="range" min="0" max="360" 
                                                  value={activeElement.config.bgGradientAngle ?? 180}
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientAngle: Number(e.target.value) })}
                                                  className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                                />
                                                <input 
                                                  type="number" 
                                                  value={activeElement.config.bgGradientAngle ?? 180}
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientAngle: Number(e.target.value) })}
                                                  className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {/* Posisi Gradien Radial */}
                                          {activeElement.config.bgGradientType === 'radial' && (
                                            <div className="flex items-center justify-between py-1">
                                              <span className="text-xs text-zinc-300 font-medium">Posisi</span>
                                              <div className="relative">
                                                <select 
                                                  value={activeElement.config.bgGradientRadialPos || 'center center'}
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientRadialPos: e.target.value })}
                                                  className="appearance-none w-[140px] bg-[#1e1f23] border border-zinc-700 text-zinc-300 text-xs font-medium rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:border-zinc-500"
                                                >
                                                  <option value="center center">Tengah Tengah</option>
                                                  <option value="left center">Tengah Kiri</option>
                                                  <option value="right center">Tengah Kanan</option>
                                                  <option value="center top">Tengah Atas</option>
                                                  <option value="center bottom">Tengah Bawah</option>
                                                  <option value="left top">Kiri Atas</option>
                                                  <option value="left bottom">Kiri Bawah</option>
                                                  <option value="right top">Kanan Atas</option>
                                                  <option value="right bottom">Kanan Bawah</option>
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Warna Teks */}
                                      <div className="space-y-1.5">
                                        <span className="text-[8px] font-bold uppercase text-zinc-500">Warna Teks / Konten</span>
                                        <div className="flex gap-2">
                                          <input
                                            type="color"
                                            value={activeElement.config.textColor || '#18181B'}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textColor: e.target.value })}
                                            className="w-10 h-8 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                          />
                                          <input
                                            type="text"
                                            value={activeElement.config.textColor || ''}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textColor: e.target.value })}
                                            placeholder="e.g. #ffffff"
                                            className="flex-1 px-2.5 h-8 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-[#18181b]/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-4">
                                      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                                        <Box className="w-3.5 h-3.5 text-zinc-400" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Batas & Sudut</span>
                                      </div>

                                      {/* Radius */}
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[8px] font-bold uppercase text-zinc-500">Radius Sudut (Border Radius)</span>
                                          <span className="text-[9px] text-blue-400 font-extrabold">{activeElement.config.borderRadius ?? 0}px</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="50"
                                          value={activeElement.config.borderRadius ?? 0}
                                          onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { borderRadius: Number(e.target.value) })}
                                          className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                        />
                                      </div>

                                      {/* Border Width */}
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[8px] font-bold uppercase text-zinc-500">Lebar Batas (Border Width)</span>
                                          <span className="text-[9px] text-blue-400 font-extrabold">{activeElement.config.borderWidth ?? 0}px</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="10"
                                          value={activeElement.config.borderWidth ?? 0}
                                          onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { borderWidth: Number(e.target.value) })}
                                          className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                        />
                                      </div>

                                      {/* Border Style & Color */}
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                          <span className="text-[8px] font-bold uppercase text-zinc-500">Model Batas</span>
                                          <select
                                            value={activeElement.config.borderStyle || 'none'}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { borderStyle: e.target.value })}
                                            className="w-full p-1.5 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 font-medium focus:border-zinc-700 outline-none"
                                          >
                                            <option value="none">Tanpa Batas</option>
                                            <option value="solid">Solid (Garis)</option>
                                            <option value="dashed">Dashed (Putus)</option>
                                            <option value="dotted">Dotted (Titik)</option>
                                          </select>
                                        </div>

                                        <div className="space-y-1">
                                          <span className="text-[8px] font-bold uppercase text-zinc-500">Warna Batas</span>
                                          <div className="flex gap-1">
                                            <input
                                              type="color"
                                              value={activeElement.config.borderColor || '#000000'}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { borderColor: e.target.value })}
                                              className="w-8 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                            />
                                            <input
                                              type="text"
                                              value={activeElement.config.borderColor || ''}
                                              onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { borderColor: e.target.value })}
                                              placeholder="#000"
                                              className="flex-1 px-1 h-7 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Shadow */}
                                    <div className="bg-[#18181b]/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-3.5">
                                      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Efek Bayangan</span>
                                      </div>

                                      <div className="space-y-1">
                                        <select
                                          value={activeElement.config.boxShadow || 'none'}
                                          onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { boxShadow: e.target.value })}
                                          className="w-full p-2 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none"
                                        >
                                          <option value="none">Tanpa Bayangan (None)</option>
                                          <option value="sm">Halus (Small)</option>
                                          <option value="md">Sedang (Medium)</option>
                                          <option value="lg">Tegas (Large)</option>
                                          <option value="hover-glow">Glow saat Diarahkan (Hover Glow)</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* UNIFIED LANJUTAN TAB FOR SMALL ELEMENTS */}
                            {activeElement.type !== 'COLUMN' && activeEditorTab === 'advanced' && (
                              <div className="space-y-4 animate-in fade-in duration-200">
                                {/* Accordion: Tata Letak */}
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setEditorCollapse(prev => ({ ...prev, tataLetakElement: !(prev.tataLetakElement ?? true) }))}
                                    className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-xs hover:text-white transition-colors"
                                  >
                                    {(editorCollapse.tataLetakElement ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                    <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Tata Letak</span>
                                  </button>

                                  {(editorCollapse.tataLetakElement ?? true) && (
                                    <div className="space-y-4 animate-in fade-in duration-200 px-0.5 pb-2">
                                      {/* Margin */}
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                            <span>Margin</span>
                                            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                          </div>
                                          <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none">
                                            px v
                                          </div>
                                        </div>

                                        <div className="flex items-center bg-[#1a1a1f] border border-zinc-800 rounded-[4px] overflow-hidden h-8">
                                          <input
                                            type="number"
                                            value={activeElement.config.marginTop ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log(`[Margin] Mengubah marginTop ke: ${val}`);
                                              if (marginLink) {
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  marginTop: val,
                                                  marginRight: val,
                                                  marginBottom: val,
                                                  marginLeft: val
                                                });
                                              } else {
                                                handleUpdateElement(editingSection.id, activeElement.id, { marginTop: val });
                                              }
                                            }}
                                            placeholder="0"
                                            className="w-full text-center text-xs text-zinc-100 bg-transparent outline-none font-bold placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <div className="w-px h-4 bg-zinc-800/80 shrink-0" />
                                          <input
                                            type="number"
                                            value={activeElement.config.marginRight ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log(`[Margin] Mengubah marginRight ke: ${val}`);
                                              if (marginLink) {
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  marginTop: val,
                                                  marginRight: val,
                                                  marginBottom: val,
                                                  marginLeft: val
                                                });
                                              } else {
                                                handleUpdateElement(editingSection.id, activeElement.id, { marginRight: val });
                                              }
                                            }}
                                            placeholder="0"
                                            className="w-full text-center text-xs text-zinc-100 bg-transparent outline-none font-bold placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <div className="w-px h-4 bg-zinc-800/80 shrink-0" />
                                          <input
                                            type="number"
                                            value={activeElement.config.marginBottom ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log(`[Margin] Mengubah marginBottom ke: ${val}`);
                                              if (marginLink) {
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  marginTop: val,
                                                  marginRight: val,
                                                  marginBottom: val,
                                                  marginLeft: val
                                                });
                                              } else {
                                                handleUpdateElement(editingSection.id, activeElement.id, { marginBottom: val });
                                              }
                                            }}
                                            placeholder="0"
                                            className="w-full text-center text-xs text-zinc-100 bg-transparent outline-none font-bold placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <div className="w-px h-4 bg-zinc-800/80 shrink-0" />
                                          <input
                                            type="number"
                                            value={activeElement.config.marginLeft ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log(`[Margin] Mengubah marginLeft ke: ${val}`);
                                              if (marginLink) {
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  marginTop: val,
                                                  marginRight: val,
                                                  marginBottom: val,
                                                  marginLeft: val
                                                });
                                              } else {
                                                handleUpdateElement(editingSection.id, activeElement.id, { marginLeft: val });
                                              }
                                            }}
                                            placeholder="0"
                                            className="w-full text-center text-xs text-zinc-100 bg-transparent outline-none font-bold placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newVal = !marginLink;
                                              setMarginLink(newVal);
                                              console.log(`[Margin Link] Mengubah status tautan link margin ke: ${newVal}`);
                                            }}
                                            className={`w-9 h-full flex items-center justify-center border-l border-zinc-800 transition-colors shrink-0 ${
                                              marginLink ? 'text-zinc-200 hover:text-white bg-zinc-800/40' : 'text-zinc-600 hover:text-zinc-400 bg-transparent'
                                            }`}
                                          >
                                            <Link2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-4 pr-9 text-center text-[9px] text-zinc-500 font-bold select-none">
                                          <span>Atas</span>
                                          <span>Kanan</span>
                                          <span>Bawah</span>
                                          <span>Kiri</span>
                                        </div>
                                      </div>

                                      {/* Padding */}
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                            <span>Padding</span>
                                            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                          </div>
                                          <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none">
                                            px v
                                          </div>
                                        </div>

                                        <div className="flex items-center bg-[#1a1a1f] border border-zinc-800 rounded-[4px] overflow-hidden h-8">
                                          <input
                                            type="number"
                                            value={activeElement.config.paddingTop ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log(`[Padding] Mengubah paddingTop ke: ${val}`);
                                              if (paddingLink) {
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  paddingTop: val,
                                                  paddingRight: val,
                                                  paddingBottom: val,
                                                  paddingLeft: val
                                                });
                                              } else {
                                                handleUpdateElement(editingSection.id, activeElement.id, { paddingTop: val });
                                              }
                                            }}
                                            placeholder="0"
                                            className="w-full text-center text-xs text-zinc-100 bg-transparent outline-none font-bold placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <div className="w-px h-4 bg-zinc-800/80 shrink-0" />
                                          <input
                                            type="number"
                                            value={activeElement.config.paddingRight ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log(`[Padding] Mengubah paddingRight ke: ${val}`);
                                              if (paddingLink) {
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  paddingTop: val,
                                                  paddingRight: val,
                                                  paddingBottom: val,
                                                  paddingLeft: val
                                                });
                                              } else {
                                                handleUpdateElement(editingSection.id, activeElement.id, { paddingRight: val });
                                              }
                                            }}
                                            placeholder="0"
                                            className="w-full text-center text-xs text-zinc-100 bg-transparent outline-none font-bold placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <div className="w-px h-4 bg-zinc-800/80 shrink-0" />
                                          <input
                                            type="number"
                                            value={activeElement.config.paddingBottom ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log(`[Padding] Mengubah paddingBottom ke: ${val}`);
                                              if (paddingLink) {
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  paddingTop: val,
                                                  paddingRight: val,
                                                  paddingBottom: val,
                                                  paddingLeft: val
                                                });
                                              } else {
                                                handleUpdateElement(editingSection.id, activeElement.id, { paddingBottom: val });
                                              }
                                            }}
                                            placeholder="0"
                                            className="w-full text-center text-xs text-zinc-100 bg-transparent outline-none font-bold placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <div className="w-px h-4 bg-zinc-800/80 shrink-0" />
                                          <input
                                            type="number"
                                            value={activeElement.config.paddingLeft ?? 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              console.log(`[Padding] Mengubah paddingLeft ke: ${val}`);
                                              if (paddingLink) {
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  paddingTop: val,
                                                  paddingRight: val,
                                                  paddingBottom: val,
                                                  paddingLeft: val
                                                });
                                              } else {
                                                handleUpdateElement(editingSection.id, activeElement.id, { paddingLeft: val });
                                              }
                                            }}
                                            placeholder="0"
                                            className="w-full text-center text-xs text-zinc-100 bg-transparent outline-none font-bold placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newVal = !paddingLink;
                                              setPaddingLink(newVal);
                                              console.log(`[Padding Link] Mengubah status tautan link padding ke: ${newVal}`);
                                            }}
                                            className={`w-9 h-full flex items-center justify-center border-l border-zinc-800 transition-colors shrink-0 ${
                                              paddingLink ? 'text-zinc-200 hover:text-white bg-zinc-800/40' : 'text-zinc-600 hover:text-zinc-400 bg-transparent'
                                            }`}
                                          >
                                            <Link2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-4 pr-9 text-center text-[9px] text-zinc-500 font-bold select-none">
                                          <span>Atas</span>
                                          <span>Kanan</span>
                                          <span>Bawah</span>
                                          <span>Kiri</span>
                                        </div>
                                      </div>

                                      {/* Lebar */}
                                      <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                          <span>Lebar</span>
                                          <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <select
                                          value={activeElement.config.widthType || 'auto'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            console.log(`[Lebar] Mengubah tipe lebar ke: ${val}`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { widthType: val });
                                          }}
                                          className="w-48 px-2.5 h-8 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none font-semibold cursor-pointer text-center"
                                        >
                                          <option value="auto">Asali</option>
                                          <option value="full">Lebar Penuh (100%)</option>
                                          <option value="custom">Khusus</option>
                                        </select>
                                      </div>
                                      {activeElement.config.widthType === 'custom' && (
                                        <div className="space-y-2.5 animate-in fade-in duration-200 mt-2">
                                          {/* Row 1: Lebar Khusus Label & Unit Selector */}
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                              <span>Lebar Khusus</span>
                                              <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            <select
                                              value={activeElement.config.customWidthUnit || 'px'}
                                              onChange={(e) => {
                                                const unit = e.target.value;
                                                const val = activeElement.config.customWidthVal ?? 300;
                                                console.log(`[Lebar Kustom] Mengubah unit ke: ${unit}`);
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  customWidthUnit: unit,
                                                  customWidth: `${val}${unit}`
                                                });
                                              }}
                                              className="p-1 px-1.5 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 font-bold outline-none cursor-pointer"
                                            >
                                              <option value="px">px</option>
                                              <option value="%">%</option>
                                              <option value="vw">vw</option>
                                            </select>
                                          </div>

                                          {/* Row 2: Slider & Input box */}
                                          <div className="flex items-center gap-3">
                                            <input
                                              type="range"
                                              min="0"
                                              max={(activeElement.config.customWidthUnit || 'px') === 'px' ? 1200 : 100}
                                              step="1"
                                              value={activeElement.config.customWidthVal ?? 300}
                                              onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const unit = activeElement.config.customWidthUnit || 'px';
                                                console.log(`[Lebar Kustom] Mengubah nilai slider ke: ${val}`);
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  customWidthVal: val,
                                                  customWidth: `${val}${unit}`
                                                });
                                              }}
                                              className="flex-1 accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                            />
                                            <input
                                              type="number"
                                              value={activeElement.config.customWidthVal ?? 300}
                                              onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const unit = activeElement.config.customWidthUnit || 'px';
                                                console.log(`[Lebar Kustom] Mengubah nilai input ke: ${val}`);
                                                handleUpdateElement(editingSection.id, activeElement.id, {
                                                  customWidthVal: val,
                                                  customWidth: `${val}${unit}`
                                                });
                                              }}
                                              className="w-14 px-1.5 h-7 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none text-center font-bold"
                                            />
                                          </div>
                                        </div>
                                      )}

                                      <div className="h-px bg-zinc-800/60 my-4" />

                                      {/* Align Self */}
                                      <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                            <span>Align Self</span>
                                            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                          </div>
                                          <div className="flex bg-[#1a1a1f] border border-zinc-800 rounded-[4px] p-0.5">
                                            {[
                                              {
                                                v: 'flex-start',
                                                title: 'Start',
                                                icon: (
                                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="4" y1="2" x2="4" y2="22" />
                                                    <rect x="8" y="6" width="10" height="12" rx="1.5" fill="currentColor" fillOpacity="0.25" />
                                                  </svg>
                                                )
                                              },
                                              {
                                                v: 'center',
                                                title: 'Center',
                                                icon: (
                                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="3 3" />
                                                    <rect x="7" y="6" width="10" height="12" rx="1.5" fill="currentColor" fillOpacity="0.25" />
                                                  </svg>
                                                )
                                              },
                                              {
                                                v: 'flex-end',
                                                title: 'End',
                                                icon: (
                                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="20" y1="2" x2="20" y2="22" />
                                                    <rect x="6" y="6" width="10" height="12" rx="1.5" fill="currentColor" fillOpacity="0.25" />
                                                  </svg>
                                                )
                                              },
                                              {
                                                v: 'stretch',
                                                title: 'Stretch',
                                                icon: (
                                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="4" y1="2" x2="4" y2="22" />
                                                    <line x1="20" y1="2" x2="20" y2="22" />
                                                    <rect x="8" y="6" width="8" height="12" rx="1" fill="currentColor" fillOpacity="0.25" />
                                                  </svg>
                                                )
                                              }
                                            ].map(opt => {
                                              const isSel = (activeElement.config.alignSelf || 'auto') === opt.v;
                                              return (
                                                <button
                                                  key={opt.v}
                                                  type="button"
                                                  title={opt.title}
                                                  onClick={() => {
                                                    console.log(`[Align Self] Mengubah ke: ${opt.v}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { alignSelf: opt.v });
                                                  }}
                                                  className={`w-9 h-7 flex items-center justify-center rounded-[3px] transition-all ${
                                                    isSel
                                                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                                                  }`}
                                                >
                                                  {opt.icon}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 italic font-medium tracking-wide">
                                          This control will affect contained elements only.
                                        </p>
                                      </div>

                                      {/* Urutan */}
                                      <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                            <span>Urutan</span>
                                            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                          </div>
                                          <div className="flex bg-[#1a1a1f] border border-zinc-800 rounded-[4px] p-0.5">
                                            {[
                                              {
                                                v: '-9999',
                                                title: 'Awal',
                                                icon: (
                                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="4" y1="4" x2="20" y2="4" />
                                                    <path d="M12 20V8M12 8L8 12M12 8L16 12" />
                                                  </svg>
                                                )
                                              },
                                              {
                                                v: '9999',
                                                title: 'Akhir',
                                                icon: (
                                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="4" y1="20" x2="20" y2="20" />
                                                    <path d="M12 4v12M12 16l-4-4M12 16l4-4" />
                                                  </svg>
                                                )
                                              },
                                              {
                                                v: 'custom',
                                                title: 'Kustom',
                                                icon: (
                                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                                                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                                    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                                                  </svg>
                                                )
                                              }
                                            ].map(opt => {
                                              const currentVal = activeElement.config.order !== undefined ? String(activeElement.config.order) : '0';
                                              const isSel = opt.v === 'custom'
                                                ? (currentVal !== '-9999' && currentVal !== '9999' && activeElement.config.order !== undefined)
                                                : currentVal === opt.v;
                                              return (
                                                <button
                                                  key={opt.v}
                                                  type="button"
                                                  title={opt.title}
                                                  onClick={() => {
                                                    if (opt.v === 'custom') {
                                                      console.log('[Urutan] Mengaktifkan urutan kustom');
                                                      handleUpdateElement(editingSection.id, activeElement.id, { order: 1 });
                                                    } else {
                                                      const numVal = Number(opt.v);
                                                      console.log(`[Urutan] Mengubah urutan ke preset: ${numVal}`);
                                                      handleUpdateElement(editingSection.id, activeElement.id, { order: numVal });
                                                    }
                                                  }}
                                                  className={`w-9 h-7 flex items-center justify-center rounded-[3px] transition-all ${
                                                    isSel
                                                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                                                  }`}
                                                >
                                                  {opt.icon}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                        {activeElement.config.order !== undefined &&
                                          String(activeElement.config.order) !== '-9999' &&
                                          String(activeElement.config.order) !== '9999' && (
                                            <div className="flex justify-end animate-in fade-in duration-200">
                                              <input
                                                type="number"
                                                value={activeElement.config.order}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { order: Number(e.target.value) })}
                                                placeholder="1"
                                                className="w-48 px-2.5 h-8 rounded-[4px] text-xs bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none font-bold"
                                              />
                                            </div>
                                          )}
                                        <p className="text-[10px] text-zinc-500 italic font-medium tracking-wide">
                                          This control will affect contained elements only.
                                        </p>
                                      </div>

                                      {/* Ukuran */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                          <span>Ukuran</span>
                                          <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <div className="flex bg-[#1a1a1f] border border-zinc-800 rounded-[4px] p-0.5">
                                          {[
                                            {
                                              v: 'default',
                                              title: 'Bawaan',
                                              icon: (
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                  <circle cx="12" cy="12" r="8" />
                                                  <line x1="6.3" y1="6.3" x2="17.7" y2="17.7" />
                                                </svg>
                                              )
                                            },
                                            {
                                              v: 'full',
                                              title: 'Lebar Penuh',
                                              icon: (
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                  <path d="M18 12H6M6 12l4-4M6 12l4 4M18 12l-4-4M18 12l4 4" />
                                                </svg>
                                              )
                                            },
                                            {
                                              v: 'fit',
                                              title: 'Pas',
                                              icon: (
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                  <path d="M4 12h6M10 12l-3-3M10 12l-3 3M20 12h-6M14 12l3-3M14 12l3 3" />
                                                </svg>
                                              )
                                            },
                                            {
                                              v: 'custom',
                                              title: 'Kustom',
                                              icon: (
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                  <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                                                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                                  <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                                                </svg>
                                              )
                                            }
                                          ].map(opt => {
                                            const isSel = (activeElement.config.sizing || 'default') === opt.v;
                                            return (
                                              <button
                                                key={opt.v}
                                                type="button"
                                                title={opt.title}
                                                onClick={() => {
                                                  console.log(`[Sizing/Ukuran] Mengubah ke: ${opt.v}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { sizing: opt.v });
                                                }}
                                                className={`w-9 h-7 flex items-center justify-center rounded-[3px] transition-all ${
                                                  isSel
                                                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                                                }`}
                                              >
                                                {opt.icon}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                      {activeElement.config.sizing === 'custom' && (
                                        <div className="flex justify-end animate-in fade-in duration-200">
                                          <input
                                            type="text"
                                            value={activeElement.config.flex || ''}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { flex: e.target.value })}
                                            placeholder="e.g. 1 1 auto atau 2 1 0%"
                                            className="w-48 px-2.5 h-8 rounded-[4px] text-xs bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none font-bold"
                                          />
                                        </div>
                                      )}

                                      <div className="h-px bg-zinc-800/60 my-4" />

                                      {/* Posisi */}
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-300 font-semibold">Posisi</span>
                                        <select
                                          value={activeElement.config.position || 'relative'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            console.log(`[Posisi] Mengubah ke: ${val}`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { position: val });
                                          }}
                                          className="w-48 px-2.5 h-8 rounded-[4px] text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none font-semibold cursor-pointer text-center"
                                        >
                                          <option value="relative">Asali</option>
                                          <option value="absolute">Absolut</option>
                                          <option value="fixed">Tetap</option>
                                          <option value="static">Statis</option>
                                        </select>
                                      </div>

                                      {/* Z-Index */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                                          <span>Z-Index</span>
                                          <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <input
                                          type="number"
                                          value={activeElement.config.zIndex ?? ''}
                                          onChange={(e) => {
                                            const val = e.target.value === '' ? undefined : Number(e.target.value);
                                            console.log(`[Z-Index] Mengubah ke: ${val}`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { zIndex: val });
                                          }}
                                          placeholder="0"
                                          className="w-20 px-2.5 h-8 rounded-[4px] text-xs bg-[#1a1a1f] text-zinc-100 border border-zinc-800 outline-none font-bold text-center"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                          </div>
                        ) : (
                          /* ── SECTION / HEADER / FOOTER EDITOR ── */
                          <div className="space-y-5">
                            {/* TAB 1: TATA LETAK */}
                            {activeEditorTab === 'layout' && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Accordion: Struktur */}
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setEditorCollapse(prev => ({ ...prev, strukturSection: !prev.strukturSection }))}
                                    className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                  >
                                    {(editorCollapse.strukturSection ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                    <span>Struktur</span>
                                  </button>

                                  {(editorCollapse.strukturSection ?? true) && (
                                    <div className="space-y-3.5 animate-in fade-in duration-200">
                                      {/* Tipe Layout */}
                                      <div className="flex justify-between items-center py-1">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Tipe Layout</span>
                                        <select
                                          value={editingSection.config.layout || 'flexbox'}
                                          onChange={(e) => {
                                            updateLocalSection({ ...editingSection, config: { ...editingSection.config, layout: e.target.value } });
                                            console.log('[Editor] Tipe Layout SECTION diubah ke:', e.target.value);
                                          }}
                                          className="w-36 p-1.5 rounded text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 font-medium focus:border-zinc-700 outline-none"
                                        >
                                          <option value="flexbox">Flexbox</option>
                                          <option value="grid">Grid</option>
                                        </select>
                                      </div>

                                      {/* Lebar Konten */}
                                      <div className="flex flex-col gap-1.5 py-1">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Lebar Konten</span>
                                          <select
                                            value={
                                              editingSection.config.maxWidth === '100%' || String(editingSection.config.maxWidth).endsWith('%')
                                                ? '100%'
                                                : '1200px'
                                            }
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              const defaultVal = val === '100%' ? '100%' : '1200px';
                                              updateLocalSection({ ...editingSection, config: { ...editingSection.config, maxWidth: defaultVal } });
                                              console.log('[Editor] Lebar Konten SECTION diubah ke:', val);
                                            }}
                                            className="w-36 p-1.5 rounded text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 font-medium focus:border-zinc-700 outline-none cursor-pointer"
                                          >
                                            <option value="1200px">Dalam kotak</option>
                                            <option value="100%">Lebar penuh</option>
                                          </select>
                                        </div>

                                        {/* Pengatur Lebar Slider & Number Input (Setara dengan UI Elementor) */}
                                        {(() => {
                                          const isBoxed = editingSection.config.maxWidth !== '100%' && !String(editingSection.config.maxWidth).endsWith('%');
                                          
                                          // Helper parser maxWidth
                                          const parseMaxWidth = (val: string | undefined | null) => {
                                            if (!val) return { value: 1200, unit: 'px' };
                                            const str = String(val).trim();
                                            const num = parseInt(str, 10);
                                            if (isNaN(num)) {
                                              return { value: str.endsWith('%') ? 100 : 1200, unit: str.endsWith('%') ? '%' : 'px' };
                                            }
                                            const unit = str.endsWith('%') ? '%' : 'px';
                                            return { value: num, unit };
                                          };

                                          const { value: rawVal, unit } = parseMaxWidth(editingSection.config.maxWidth);
                                          const min = isBoxed ? 300 : 50;
                                          const max = isBoxed ? 1600 : 100;
                                          const defaultVal = isBoxed ? 1200 : 100;
                                          const val = editingSection.config.maxWidth !== undefined ? rawVal : defaultVal;

                                          return (
                                            <div className="space-y-1.5 py-1.5 animate-in fade-in duration-150">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-xs text-zinc-300 font-semibold">Lebar</span>
                                                  <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                                </div>
                                                <select
                                                  value={unit}
                                                  disabled
                                                  className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1f] text-zinc-400 border border-zinc-800 outline-none cursor-not-allowed font-bold"
                                                >
                                                  <option value="px">px</option>
                                                  <option value="%">%</option>
                                                </select>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range"
                                                  min={min}
                                                  max={max}
                                                  value={val}
                                                  onChange={(e) => {
                                                    const newNum = Number(e.target.value);
                                                    const newStr = newNum + unit;
                                                    console.log('[Editor] Lebar Section diubah via slider ke:', newStr);
                                                    updateLocalSection({
                                                      ...editingSection,
                                                      config: { ...editingSection.config, maxWidth: newStr }
                                                    });
                                                  }}
                                                  className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number"
                                                  min={min}
                                                  max={max}
                                                  value={val}
                                                  onChange={(e) => {
                                                    const newNum = Math.max(min, Math.min(max, Number(e.target.value)));
                                                    const newStr = newNum + unit;
                                                    console.log('[Editor] Lebar Section diubah via input ke:', newStr);
                                                    updateLocalSection({
                                                      ...editingSection,
                                                      config: { ...editingSection.config, maxWidth: newStr }
                                                    });
                                                  }}
                                                  className="w-14 h-7 text-xs bg-[#1a1a1f] border border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none text-center rounded-md font-bold"
                                                />
                                              </div>
                                            </div>
                                          );
                                        })()}
                                      </div>

                                      {/* Tinggi Minimal */}
                                      <UnitControl
                                        label="Tinggi Minimal"
                                        value={editingSection.config.minHeight ?? 0}
                                        onChange={(val) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, minHeight: val } })}
                                        min={0}
                                        max={1000}
                                        fieldKey="secMinHeight"
                                        activeDropdown={activeDropdown}
                                        setActiveDropdown={setActiveDropdown}
                                        elementId={editingSection.id}
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="h-px bg-zinc-800/80 my-3" />

                                {/* Accordion: Penyelarasan */}
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setEditorCollapse(prev => ({ ...prev, penyelarasanSection: !prev.penyelarasanSection }))}
                                    className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                  >
                                    {(editorCollapse.penyelarasanSection ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                    <span>Penyelarasan</span>
                                  </button>

                                  {(editorCollapse.penyelarasanSection ?? true) && (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                      {/* Jumlah Kolom Grid (Grid mode) */}
                                      {editingSection.config.layout === 'grid' && (
                                        <div className="flex flex-col items-stretch py-1.5 gap-1">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Grid Columns</span>
                                            <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                          </div>
                                          <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">
                                            {[1, 2, 3, 4, 6].map(n => (
                                              <button
                                                key={n}
                                                type="button"
                                                onClick={() => {
                                                  updateLocalSection({ ...editingSection, config: { ...editingSection.config, columns: n } });
                                                  console.log('[Editor] Grid Columns SECTION diubah ke:', n);
                                                }}
                                                className={`flex-1 h-7 flex items-center justify-center text-xs font-bold transition-all rounded ${(editingSection.config.columns ?? 2) === n
                                                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                  : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                  }`}
                                              >
                                                {n}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Direksi (jika flexbox) */}
                                      {editingSection.config.layout !== 'grid' && (
                                        <div className="flex justify-between items-center py-1.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Direksi</span>
                                            <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                          </div>
                                          <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-[144px] shrink-0">
                                            {[
                                              { v: 'row', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>, title: 'Row (Horizontal)' },
                                              { v: 'col', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>, title: 'Column (Vertikal)' },
                                              { v: 'row-reverse', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>, title: 'Row Reverse' },
                                              { v: 'col-reverse', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>, title: 'Column Reverse' },
                                            ].map(opt => (
                                              <button
                                                key={opt.v}
                                                type="button"
                                                title={opt.title}
                                                onClick={() => {
                                                  updateLocalSection({ ...editingSection, config: { ...editingSection.config, direction: opt.v } });
                                                  console.log('[Editor] Direksi SECTION diubah ke:', opt.v);
                                                }}
                                                className={`flex-1 h-7 flex items-center justify-center rounded text-xs font-bold transition-all ${(editingSection.config.direction || 'col') === opt.v
                                                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                  : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                  }`}
                                              >
                                                {opt.icon}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Justify Content */}
                                      <div className="flex flex-col items-stretch py-1.5 gap-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Justify Content</span>
                                          <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                        </div>
                                        <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">
                                          {[
                                            { v: 'start', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M4 7h10M4 17h14" /></svg>, t: 'Start' },
                                            { v: 'center', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M7 7h10M5 17h14" /></svg>, t: 'Center' },
                                            { v: 'end', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 2v20M10 7h10M6 17h10" /></svg>, t: 'End' },
                                            { v: 'between', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M20 2v20M4 7h16M4 17h16" /></svg>, t: 'Between' },
                                            { v: 'around', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M20 2v20" strokeOpacity="0.4" /><path d="M7 6h10M9 18h6" /></svg>, t: 'Around' },
                                            { v: 'evenly', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M20 2v20" strokeOpacity="0.4" strokeDasharray="2 2" /><path d="M8 6h8M8 18h8" /></svg>, t: 'Evenly' }
                                          ].map(j => (
                                            <button
                                              key={j.v}
                                              type="button"
                                              title={j.t}
                                              onClick={() => {
                                                console.log("[Editor] Section Justify Content diubah ke:", j.v);
                                                updateLocalSection({ ...editingSection, config: { ...editingSection.config, justify: j.v } });
                                              }}
                                              className={`flex-1 h-7 flex items-center justify-center rounded transition-all ${(editingSection.config.justify || 'start') === j.v
                                                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                }`}
                                            >
                                              {j.icon}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Align Items */}
                                      <div className="flex justify-between items-center py-1.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Items</span>
                                          <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                        </div>
                                        <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-[144px] shrink-0">
                                          {[
                                            { v: 'start', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M4 7h10M4 17h14" /></svg>, t: 'Start' },
                                            { v: 'center', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M7 7h10M5 17h14" /></svg>, t: 'Center' },
                                            { v: 'end', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 2v20M10 7h10M6 17h10" /></svg>, t: 'End' },
                                            { v: 'stretch', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20M20 2v20M4 7h16M4 17h16" /></svg>, t: 'Stretch' }
                                          ].map(a => (
                                            <button
                                              key={a.v}
                                              type="button"
                                              title={a.t}
                                              onClick={() => {
                                                console.log("[Editor] Section Align Items diubah ke:", a.v);
                                                updateLocalSection({ ...editingSection, config: { ...editingSection.config, align: a.v } });
                                              }}
                                              className={`flex-1 h-7 flex items-center justify-center rounded transition-all ${(editingSection.config.align || 'stretch') === a.v
                                                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                                : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                                }`}
                                            >
                                              {a.icon}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Jarak (Gap) - 2 input Kolom/Baris + link icon */}
                                      <div className="space-y-1.5 py-1">
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Jarak</span>
                                            {/* Monitor icon */}
                                            <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                          </div>
                                          <div className="flex items-center gap-0.5 text-[9px] text-zinc-500 font-bold cursor-pointer hover:text-zinc-300 transition-colors">
                                            <span>px</span>
                                            <ChevronDown className="w-3 h-3" />
                                          </div>
                                        </div>
                                        <div className="flex gap-1.5 items-start">
                                          <div className="flex-1 flex flex-col">
                                            <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                              {/* Input Kolom */}
                                              <input
                                                type="number"
                                                value={editingSection.config.columnGap ?? editingSection.config.gap ?? 16}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  const updates: any = { columnGap: val };
                                                  if (editingSection.config.gapLinked !== false) {
                                                    updates.rowGap = val;
                                                    updates.gap = val;
                                                  }
                                                  updateLocalSection({ ...editingSection, config: { ...editingSection.config, ...updates } });
                                                  console.log('[Editor] columnGap SECTION diubah ke:', val);
                                                }}
                                                className="w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none border-r border-zinc-800"
                                              />
                                              {/* Input Baris */}
                                              <input
                                                type="number"
                                                value={editingSection.config.rowGap ?? editingSection.config.gap ?? 16}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  const updates: any = { rowGap: val };
                                                  if (editingSection.config.gapLinked !== false) {
                                                    updates.columnGap = val;
                                                    updates.gap = val;
                                                  }
                                                  updateLocalSection({ ...editingSection, config: { ...editingSection.config, ...updates } });
                                                  console.log('[Editor] rowGap SECTION diubah ke:', val);
                                                }}
                                                className="w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none"
                                              />
                                            </div>
                                            <div className="grid grid-cols-2 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                              <span>Kolom</span>
                                              <span>Baris</span>
                                            </div>
                                          </div>
                                          {/* Tombol Link/Unlink */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newVal = editingSection.config.gapLinked === false ? true : false;
                                              updateLocalSection({ ...editingSection, config: { ...editingSection.config, gapLinked: newVal } });
                                              console.log('[Editor] gapLinked SECTION diubah ke:', newVal);
                                            }}
                                            className={`h-8 w-8 rounded flex items-center justify-center border transition-all shrink-0 ${editingSection.config.gapLinked !== false
                                              ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                              : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                              }`}
                                          >
                                            <LinkIcon className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Bungkus (Flex Wrap) */}
                                      <div className="flex justify-between items-center py-1.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Bungkus</span>
                                          <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                        </div>
                                        <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 shrink-0">
                                          {/* Tombol No Wrap */}
                                          <button
                                            type="button"
                                            title="No Wrap — elemen tetap satu baris"
                                            onClick={() => {
                                              updateLocalSection({ ...editingSection, config: { ...editingSection.config, flexWrap: 'nowrap' } });
                                              console.log('[Editor] flexWrap SECTION diubah ke: nowrap');
                                            }}
                                            className={`h-7 w-8 flex items-center justify-center rounded transition-all ${(editingSection.config.flexWrap || 'nowrap') === 'nowrap'
                                              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                              : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                              }`}
                                          >
                                            {/* Ikon No Wrap: panah ke kanan menyentuh batas */}
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M3 6h18M3 12h14l3 0M3 18h18" />
                                              <path d="M17 9l4 3-4 3" />
                                            </svg>
                                          </button>
                                          {/* Tombol Wrap */}
                                          <button
                                            type="button"
                                            title="Wrap — elemen turun ke baris berikutnya jika penuh"
                                            onClick={() => {
                                              updateLocalSection({ ...editingSection, config: { ...editingSection.config, flexWrap: 'wrap' } });
                                              console.log('[Editor] flexWrap SECTION diubah ke: wrap');
                                            }}
                                            className={`h-7 w-8 flex items-center justify-center rounded transition-all ${(editingSection.config.flexWrap || 'nowrap') === 'wrap'
                                              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                              : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
                                              }`}
                                          >
                                            {/* Ikon Wrap: garis turun ke baris baru */}
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M3 6h18M3 12h11" />
                                              <path d="M14 9l4 3-4 3" />
                                              <path d="M3 18h9" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                      {/* Deskripsi Bungkus */}
                                      <p className="text-[10px] text-zinc-500 italic leading-snug -mt-1 pb-1">
                                        Items within the container can stay in a single line (No wrap), or break into multiple lines (Wrap).
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* TAB 2: GAYA */}
                            {activeEditorTab === 'style' && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Accordion: Latar Belakang */}
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setEditorCollapse(prev => ({ ...prev, latarBelakangSection: !prev.latarBelakangSection }))}
                                    className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                  >
                                    {(editorCollapse.latarBelakangSection ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                    <span>Latar Belakang</span>
                                  </button>

                                  {(editorCollapse.latarBelakangSection ?? true) && (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                      {/* Normal / Sorotan Tabs */}
                                      <div className="bg-[#25262b] rounded-md p-1 border border-zinc-800 flex mt-1">
                                        <button
                                          type="button"
                                          onClick={() => setSectionBgTab('normal')}
                                          className={`flex-1 text-center text-[11px] font-medium py-1.5 rounded transition-all ${
                                            sectionBgTab === 'normal' ? 'bg-[#3b3d42] text-white shadow' : 'text-zinc-400 hover:text-zinc-300'
                                          }`}
                                        >
                                          Normal
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSectionBgTab('hover')}
                                          className={`flex-1 text-center text-[11px] font-medium py-1.5 rounded transition-all ${
                                            sectionBgTab === 'hover' ? 'bg-[#3b3d42] text-white shadow' : 'text-zinc-400 hover:text-zinc-300'
                                          }`}
                                        >
                                          Sorotan
                                        </button>
                                      </div>

                                      {/* Background Type */}
                                      <div className="flex items-center justify-between py-1 mt-2">
                                        <span className="text-[11px] text-zinc-300 font-medium">Background Type</span>
                                        <div className="flex gap-0.5 bg-transparent border border-zinc-800 rounded p-0.5">
                                          <button 
                                            type="button"
                                            onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType']: 'classic' } })}
                                            className={`p-1.5 rounded shadow-sm transition-colors ${(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'classic' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                                            title="Solid"
                                          >
                                            <Paintbrush className="w-3.5 h-3.5" />
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType']: 'gradient' } })}
                                            className={`p-1.5 rounded shadow-sm transition-colors ${(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'gradient' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                                            title="Gradien"
                                          >
                                            <div className="w-3.5 h-3.5 rounded-[1px] bg-gradient-to-br from-zinc-300 to-zinc-600"></div>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Warna Latar & Gambar Latar (Classic) */}
                                      {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'classic' && (
                                        <div className="space-y-4 pt-2">
                                          {/* Warna */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-zinc-300 font-medium">Warna</span>
                                            <div className="flex border border-zinc-700 rounded overflow-hidden">
                                              {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] !== 'transparent' && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor']: 'transparent' } })}
                                                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                <input 
                                                  type="color" 
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] : '#ffffff'} 
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor']: e.target.value } })} 
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] === 'transparent') ? (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] }}></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Gambar */}
                                          <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                              <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-zinc-300 font-medium">Gambar</span>
                                                <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                              </div>
                                              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                                            </div>
                                            
                                            <div 
                                              className="relative w-full aspect-[2/1] rounded bg-[#32343a] border border-zinc-700 hover:border-zinc-500 transition-colors group cursor-pointer overflow-hidden flex items-center justify-center"
                                              onClick={(e) => {
                                                // Prevent click if clicking on the inner buttons
                                                if ((e.target as HTMLElement).closest('button')) return;
                                                openMediaModal((url) => { 
                                                  updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: url } }); 
                                                }, "image");
                                              }}
                                            >
                                              {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] ? (
                                                <img src={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']} alt="BG" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                              ) : (
                                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center pointer-events-none">
                                                  <Plus className="w-4 h-4 text-zinc-800" strokeWidth={3} />
                                                </div>
                                              )}
                                              
                                              {/* Upload overlays for when image exists */}
                                              {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                                                <div className="absolute inset-x-0 bottom-0 bg-black/85 p-2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all duration-200 z-20">
                                                  <button type="button" onClick={() => { openMediaModal((url) => { updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: url } }); }, "image"); }} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">
                                                    <ImageIcon className="w-3 h-3 text-zinc-400" />
                                                    <span>Media</span>
                                                  </button>
                                                </div>
                                              )}
                                              {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                                                <button type="button" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await handleDeleteImage(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']); updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: '' } }); }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 cursor-pointer" title="Hapus">
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              )}
                                            </div>
                                            {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                                              <div className="space-y-2 mt-2 p-2 bg-zinc-950 rounded border border-zinc-800">
                                                <div className="flex justify-between items-center">
                                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Overlay</span>
                                                  <span className="text-xs font-bold text-zinc-300">{Math.round((editingSection.config[sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay'] ?? 0.3) * 100)}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={Math.round((editingSection.config[sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay'] ?? 0.3) * 100)} onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay']: Number(e.target.value) / 100 } })} className="w-full accent-zinc-100 bg-zinc-900 h-1 rounded-lg cursor-pointer" />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Gradien Latar (Gradient) */}
                                      {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'gradient' && (
                                        <div className="space-y-4 pt-2">
                                          <div className="border-l-2 border-amber-600 bg-[#281a0b] p-3 rounded-r">
                                            <p className="text-[11px] text-amber-500/90 italic font-medium leading-relaxed">
                                              Set locations and angle for each breakpoint to ensure the gradient adapts to different screen sizes.
                                            </p>
                                          </div>

                                          {/* Warna 1 */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[11px] text-zinc-300 font-medium">Warna</span>
                                              <div className="flex border border-zinc-700 rounded overflow-hidden">
                                                {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] !== 'transparent' && (
                                                  <button 
                                                    type="button" 
                                                    onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1']: 'transparent' } })}
                                                    className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                    title="Reset Warna"
                                                  >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                  </button>
                                                )}
                                                <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                  <input 
                                                    type="color" 
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] : '#ffffff'} 
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1']: e.target.value } })} 
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                  />
                                                  {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] === 'transparent') ? (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                      <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] }}></div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Lokasi 1 */}
                                            <div className="space-y-1">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-[11px] text-zinc-300 font-medium">Lokasi</span>
                                                  <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                                </div>
                                                <div className="flex items-center gap-0.5 cursor-pointer group">
                                                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">%</span>
                                                  <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range"
                                                  min="0"
                                                  max="100"
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1'] ?? 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1']: Number(e.target.value) } })}
                                                  className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1'] ?? 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1']: Number(e.target.value) } })}
                                                  className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          {/* Warna 2 */}
                                          <div className="space-y-2 pt-1">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[11px] text-zinc-300 font-medium">Second Color</span>
                                              <div className="flex border border-zinc-700 rounded overflow-hidden">
                                                {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] !== 'transparent' && (
                                                  <button 
                                                    type="button" 
                                                    onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2']: 'transparent' } })}
                                                    className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                    title="Reset Warna"
                                                  >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                  </button>
                                                )}
                                                <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                  <input 
                                                    type="color" 
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] : '#ff0000'} 
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2']: e.target.value } })} 
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                  />
                                                  {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] === 'transparent') ? (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                      <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] }}></div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Lokasi 2 */}
                                            <div className="space-y-1">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-[11px] text-zinc-300 font-medium">Lokasi</span>
                                                  <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                                </div>
                                                <div className="flex items-center gap-0.5 cursor-pointer group">
                                                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">%</span>
                                                  <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range"
                                                  min="0"
                                                  max="100"
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2'] ?? 100}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2']: Number(e.target.value) } })}
                                                  className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2'] ?? 100}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2']: Number(e.target.value) } })}
                                                  className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          {/* Tipe & Sudut */}
                                          <div className="space-y-4 pt-1">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[11px] text-zinc-300 font-medium">Tipe</span>
                                              <div className="relative w-32">
                                                <select
                                                  value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType'] || 'linear'}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType']: e.target.value } })}
                                                  className="w-full h-8 bg-zinc-950/50 border border-zinc-800 rounded text-[11px] text-zinc-200 pl-3 pr-8 appearance-none focus:border-zinc-700 outline-none cursor-pointer"
                                                >
                                                  <option value="linear">Linier</option>
                                                  <option value="radial">Radial</option>
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                              </div>
                                            </div>

                                            {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType'] || 'linear') === 'linear' ? (
                                              <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[11px] text-zinc-300 font-medium">Sudut</span>
                                                    <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                                  </div>
                                                  <div className="flex items-center gap-0.5 cursor-pointer group">
                                                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">deg</span>
                                                    <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="360"
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle'] ?? 180}
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle']: Number(e.target.value) } })}
                                                    className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                                                  />
                                                  <input
                                                    type="number"
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle'] ?? 180}
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle']: Number(e.target.value) } })}
                                                    className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-zinc-300 font-medium">Posisi</span>
                                                <div className="relative w-32">
                                                  <select
                                                    value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientRadialPos' : 'bgGradientRadialPos'] || 'center center'}
                                                    onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientRadialPos' : 'bgGradientRadialPos']: e.target.value } })}
                                                    className="w-full h-8 bg-zinc-950/50 border border-zinc-800 rounded text-[11px] text-zinc-200 pl-3 pr-8 appearance-none focus:border-zinc-700 outline-none cursor-pointer"
                                                  >
                                                    <option value="center center">Tengah Tengah</option>
                                                    <option value="left center">Tengah Kiri</option>
                                                    <option value="right center">Tengah Kanan</option>
                                                    <option value="center top">Tengah Atas</option>
                                                    <option value="left top">Kiri Atas</option>
                                                    <option value="right top">Kanan atas</option>
                                                    <option value="center bottom">Tengah bawah</option>
                                                    <option value="left bottom">Kiri bawah</option>
                                                    <option value="right bottom">Kanan bawah</option>
                                                  </select>
                                                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                    </div>
                                  )}

                                  {/* Durasi Transisi (Khusus Sorotan) */}
                                  {sectionBgTab === 'hover' && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800">
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="text-[11px] text-zinc-300 font-medium">Durasi Transisi (s)</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <input
                                          type="range"
                                          min="0"
                                          max="5"
                                          step="0.1"
                                          value={editingSection.config.hoverTransitionDuration ?? 0.3}
                                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, hoverTransitionDuration: Number(e.target.value) } })}
                                          className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                                        />
                                        <input
                                          type="number"
                                          min="0"
                                          max="5"
                                          step="0.1"
                                          value={editingSection.config.hoverTransitionDuration ?? 0.3}
                                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, hoverTransitionDuration: Number(e.target.value) } })}
                                          className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="h-px bg-zinc-800/80 my-3" />

                                {/* Accordion: Batas */}
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setEditorCollapse(prev => ({ ...prev, perbatasanSection: !prev.perbatasanSection }))}
                                    className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[13px] tracking-wide text-left hover:text-white transition-colors"
                                  >
                                    {(editorCollapse.perbatasanSection ?? true) ? <ChevronDown className="w-4 h-4 text-zinc-100 shrink-0" /> : <ChevronRight className="w-4 h-4 text-zinc-100 shrink-0" />}
                                    <span>Batas</span>
                                  </button>

                                  {(editorCollapse.perbatasanSection ?? true) && (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                      
                                      {/* Tab Switcher Normal/Sorotan */}
                                      <div className="flex bg-[#25262b] rounded-[4px] border border-zinc-800 p-[2px] h-9">
                                        <button
                                          type="button"
                                          onClick={() => setSectionBorderTab('normal')}
                                          className={`flex-1 text-[12px] font-semibold rounded-[3px] transition-all ${
                                            sectionBorderTab === 'normal'
                                              ? 'bg-[#3b3c41] text-zinc-100 shadow-sm'
                                              : 'text-zinc-400 hover:text-zinc-300 hover:bg-[#3b3c41]/50'
                                          }`}
                                        >
                                          Normal
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSectionBorderTab('hover')}
                                          className={`flex-1 text-[12px] font-semibold rounded-[3px] transition-all ${
                                            sectionBorderTab === 'hover'
                                              ? 'bg-[#3b3c41] text-zinc-100 shadow-sm'
                                              : 'text-zinc-400 hover:text-zinc-300 hover:bg-[#3b3c41]/50'
                                          }`}
                                        >
                                          Sorotan
                                        </button>
                                      </div>

                                      {/* Border Type */}
                                      <div className="flex justify-between items-center py-0.5">
                                        <span className="text-[12px] text-zinc-200 font-medium">Border Type</span>
                                        <select
                                          value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] || 'none'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const newConfig = { ...editingSection.config };
                                            newConfig[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] = val;
                                            if (val === 'none') {
                                              if (sectionBorderTab === 'hover') {
                                                delete newConfig.hoverBorderColor;
                                                delete newConfig.hoverBorderWidth;
                                                delete newConfig.hoverBorderWidthTop;
                                                delete newConfig.hoverBorderWidthRight;
                                                delete newConfig.hoverBorderWidthBottom;
                                                delete newConfig.hoverBorderWidthLeft;
                                              } else {
                                                delete newConfig.borderColor;
                                                delete newConfig.borderWidth;
                                                delete newConfig.borderWidthTop;
                                                delete newConfig.borderWidthRight;
                                                delete newConfig.borderWidthBottom;
                                                delete newConfig.borderWidthLeft;
                                              }
                                            }
                                            updateLocalSection({ ...editingSection, config: newConfig });
                                          }}
                                          className="px-2.5 py-1.5 bg-[#25262b] border border-zinc-700 rounded-[4px] text-[12px] text-zinc-200 font-medium outline-none cursor-pointer focus:border-zinc-600 w-36 [&>option]:bg-[#25262b] [&>option]:text-zinc-200"
                                        >
                                          <option value="none">Asali</option>
                                          <option value="solid">Solid</option>
                                          <option value="dashed">Dashed</option>
                                          <option value="dotted">Dotted</option>
                                          <option value="double">Double</option>
                                        </select>
                                      </div>

                                      {/* Lebar Batas & Warna Batas (hanya muncul jika Border Type selain Asali) */}
                                      {(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] && editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] !== 'none') && (
                                        <>
                                          {/* Lebar Batas */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <span className="text-[12px] text-zinc-200 font-medium">Lebar Batas</span>
                                                <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                              </div>
                                              
                                              <select
                                                value="px"
                                                disabled
                                                className="px-1 py-0.5 rounded text-[11px] bg-transparent text-zinc-300 hover:text-zinc-100 outline-none font-medium border-0 focus:ring-0 appearance-none opacity-80"
                                              >
                                                <option value="px">px ˅</option>
                                              </select>
                                            </div>

                                            <div>
                                              <div className="flex rounded-[4px] border border-zinc-700 bg-transparent divide-x divide-zinc-700 overflow-hidden h-9">
                                                {[
                                                  { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                                                  { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                                                  { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                                                  { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 }
                                                ].map((corner) => {
                                                  const val = editingSection.config[corner.key] !== undefined ? editingSection.config[corner.key] : corner.fallback;
                                                  return (
                                                    <input
                                                      key={corner.key}
                                                      type="number"
                                                      min="0"
                                                      value={val === 0 ? '' : val}
                                                      onChange={(e) => {
                                                        const numVal = Math.max(0, Number(e.target.value));
                                                        if (bgBorderWidthLink) {
                                                          updateLocalSection({
                                                            ...editingSection,
                                                            config: {
                                                              ...editingSection.config,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth']: numVal,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop']: numVal,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight']: numVal,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom']: numVal,
                                                              [sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft']: numVal,
                                                            }
                                                          });
                                                        } else {
                                                          updateLocalSection({
                                                            ...editingSection,
                                                            config: {
                                                              ...editingSection.config,
                                                              [corner.key]: numVal
                                                            }
                                                          });
                                                        }
                                                      }}
                                                      className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-[12px] text-zinc-300 font-medium p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/50"
                                                    />
                                                  );
                                                })}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setBgBorderWidthLink(!bgBorderWidthLink);
                                                    if (!bgBorderWidthLink) {
                                                      const topVal = editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop'] ?? editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0;
                                                      updateLocalSection({
                                                        ...editingSection,
                                                        config: {
                                                          ...editingSection.config,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth']: topVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop']: topVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight']: topVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom']: topVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft']: topVal,
                                                        }
                                                      });
                                                    }
                                                  }}
                                                  className={`w-[42px] shrink-0 flex items-center justify-center transition-all ${
                                                    bgBorderWidthLink 
                                                      ? 'bg-[#3b3c41] text-zinc-100' 
                                                      : 'bg-[#25262b] text-zinc-400 hover:text-zinc-200'
                                                  }`}
                                                >
                                                  <Link2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                              <div className="flex pr-[42px] text-center text-[10px] text-zinc-500 font-medium select-none mt-1.5">
                                                <span className="flex-1">Atas</span>
                                                <span className="flex-1">Kanan</span>
                                                <span className="flex-1">Bawah</span>
                                                <span className="flex-1">Kiri</span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Warna Batas */}
                                          <div className="flex justify-between items-center pt-1 pb-2">
                                            <span className="text-[12px] text-zinc-200 font-medium">Warna Batas</span>
                                            <div className="flex rounded-[4px] border border-zinc-700 bg-transparent overflow-hidden h-9 w-[70px]">
                                              {editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => {
                                                    const newConfig = { ...editingSection.config };
                                                    delete newConfig[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'];
                                                    updateLocalSection({ ...editingSection, config: newConfig });
                                                  }}
                                                  className="w-[34px] flex items-center justify-center border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors bg-[#25262b]"
                                                  title="Reset Warna Batas"
                                                >
                                                  <RotateCcw className="w-4 h-4" />
                                                </button>
                                              )}
                                              <div className="relative flex-1 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwsLCABWAK4ZqRDYKqB2W/QEAA4YIA7y8H8IAAAAASUVORK5CYII=')] overflow-hidden">
                                                {!(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor']) && (
                                                  <div className="absolute inset-0 z-10 pointer-events-none">
                                                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                                      <line x1="0" y1="100%" x2="100%" y2="0" stroke="#ef4444" strokeWidth="2" />
                                                    </svg>
                                                  </div>
                                                )}
                                                <input
                                                  type="color"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] || '#000000'}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor']: e.target.value } })}
                                                  className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                                                />
                                                <div 
                                                  className="w-full h-full pointer-events-none" 
                                                  style={{ backgroundColor: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] || 'transparent' }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      {/* Radius Batas */}
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[12px] text-zinc-200 font-medium">Radius Batas</span>
                                            <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                          </div>
                                          
                                          <select
                                            value={editingSection.config.borderRadiusUnit || 'px'}
                                            onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, borderRadiusUnit: e.target.value } })}
                                            className="px-1 py-0.5 rounded text-[11px] bg-transparent text-zinc-300 hover:text-zinc-100 outline-none cursor-pointer font-medium border-0 focus:ring-0 appearance-none"
                                          >
                                            <option value="px">px ˅</option>
                                            <option value="%">% ˅</option>
                                          </select>
                                        </div>

                                        <div>
                                          <div className="flex rounded-[4px] border border-zinc-700 bg-transparent divide-x divide-zinc-700 overflow-hidden h-9">
                                            {[
                                              { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                                              { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                                              { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                                              { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 }
                                            ].map((corner) => {
                                              const val = editingSection.config[corner.key] !== undefined ? editingSection.config[corner.key] : corner.fallback;
                                              return (
                                                <input
                                                  key={corner.key}
                                                  type="number"
                                                  min="0"
                                                  value={val === 0 ? '' : val}
                                                  onChange={(e) => {
                                                    const numVal = Math.max(0, Number(e.target.value));
                                                    if (bgBorderRadiusLink) {
                                                      updateLocalSection({
                                                        ...editingSection,
                                                        config: {
                                                          ...editingSection.config,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius']: numVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop']: numVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight']: numVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom']: numVal,
                                                          [sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft']: numVal,
                                                        }
                                                      });
                                                    } else {
                                                      updateLocalSection({
                                                        ...editingSection,
                                                        config: {
                                                          ...editingSection.config,
                                                          [corner.key]: numVal
                                                        }
                                                      });
                                                    }
                                                  }}
                                                  className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-[12px] text-zinc-300 font-medium p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/50"
                                                />
                                              );
                                            })}
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setBgBorderRadiusLink(!bgBorderRadiusLink);
                                                if (!bgBorderRadiusLink) {
                                                  const topVal = editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop'] ?? editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0;
                                                  updateLocalSection({
                                                    ...editingSection,
                                                    config: {
                                                      ...editingSection.config,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius']: topVal,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop']: topVal,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight']: topVal,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom']: topVal,
                                                      [sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft']: topVal,
                                                    }
                                                  });
                                                }
                                              }}
                                              className={`w-[42px] shrink-0 flex items-center justify-center transition-all ${
                                                bgBorderRadiusLink 
                                                  ? 'bg-[#3b3c41] text-zinc-100' 
                                                  : 'bg-[#25262b] text-zinc-400 hover:text-zinc-200'
                                              }`}
                                              title={bgBorderRadiusLink ? "Putuskan tautan sudut" : "Tautkan semua sudut"}
                                            >
                                              <Link2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                          <div className="flex pr-[42px] text-center text-[10px] text-zinc-500 font-medium select-none mt-1.5">
                                            <span className="flex-1">Atas</span>
                                            <span className="flex-1">Kanan</span>
                                            <span className="flex-1">Bawah</span>
                                            <span className="flex-1">Kiri</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Box Shadow */}
                                      <div className="space-y-2 pt-2 relative">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[12px] text-zinc-200 font-medium">Box Shadow</span>
                                          <div className="flex items-center gap-1.5">
                                            {(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType'] === 'custom' || editingSection.config[sectionBorderTab === 'hover' ? 'hoverBoxShadow' : 'boxShadow']) && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const newConfig = { ...editingSection.config };
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'];
                                                  delete newConfig[sectionBorderTab === 'hover' ? 'hoverBoxShadow' : 'boxShadow'];
                                                  updateLocalSection({ ...editingSection, config: newConfig });
                                                }}
                                                className="w-[34px] h-[34px] rounded-[4px] bg-transparent text-zinc-400 hover:text-white transition-all flex items-center justify-center"
                                              >
                                                <RotateCcw className="w-4 h-4" />
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const target = activePopover === 'sectionBoxShadow' ? null : 'sectionBoxShadow';
                                                setActivePopover(target);
                                              }}
                                              className={`w-[42px] h-[34px] rounded-[4px] border transition-all flex items-center justify-center ${activePopover === 'sectionBoxShadow' ? 'bg-[#3b3c41] border-zinc-500 text-white' : 'bg-transparent border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white'}`}
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>

                                        {activePopover === 'sectionBoxShadow' && (
                                          <div 
                                            className="absolute right-0 top-10 z-50 w-[260px] p-4 bg-[#1e1f23] border border-zinc-800 rounded-[8px] shadow-2xl space-y-4 animate-in fade-in duration-150"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {/* Warna */}
                                            <div className="flex justify-between items-center">
                                              <span className="text-[12px] text-zinc-200 font-medium">Warna</span>
                                              <div className="relative w-8 h-8 rounded-[4px] border border-zinc-700 overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwsLCABWAK4ZqRDYKqB2W/QEAA4YIA7y8H8IAAAAASUVORK5CYII=')]">
                                                <input
                                                  type="color"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'] || '#000000'}
                                                  onChange={(e) => {
                                                    updateLocalSection({ ...editingSection, config: { 
                                                      ...editingSection.config, 
                                                      [sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor']: e.target.value,
                                                      [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' 
                                                    } });
                                                  }}
                                                  className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                                                />
                                                <div 
                                                  className="w-full h-full pointer-events-none" 
                                                  style={{ backgroundColor: editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'] || 'transparent' }}
                                                />
                                              </div>
                                            </div>

                                            {/* Mendatar */}
                                            <div className="space-y-2">
                                              <span className="text-[12px] text-zinc-200 font-medium">Mendatar</span>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range" min="-100" max="100"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Vertikal */}
                                            <div className="space-y-2">
                                              <span className="text-[12px] text-zinc-200 font-medium">Vertikal</span>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range" min="-100" max="100"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Buram */}
                                            <div className="space-y-2">
                                              <span className="text-[12px] text-zinc-200 font-medium">Buram</span>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range" min="0" max="100"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number" min="0"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Menyebar */}
                                            <div className="space-y-2">
                                              <span className="text-[12px] text-zinc-200 font-medium">Menyebar</span>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  type="range" min="-100" max="100"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                                                />
                                                <input
                                                  type="number"
                                                  value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'] || 0}
                                                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                                                  className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Posisi */}
                                            <div className="flex justify-between items-center pt-1">
                                              <span className="text-[12px] text-zinc-200 font-medium">Posisi</span>
                                              <select
                                                value="Outline"
                                                className="px-2.5 py-1.5 bg-transparent border border-zinc-700 rounded-[4px] text-[12px] text-zinc-200 font-medium outline-none cursor-pointer focus:border-zinc-600 w-[100px] [&>option]:bg-[#1e1f23] [&>option]:text-zinc-200"
                                              >
                                                <option value="Outline">Outline</option>
                                              </select>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* TAB 3: LANJUTAN */}
                            {activeEditorTab === 'advanced' && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Accordion: Tata Letak */}
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setEditorCollapse(prev => ({ ...prev, tataLetakSection: !prev.tataLetakSection }))}
                                    className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                  >
                                    {(editorCollapse.tataLetakSection ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                    <span>Tata Letak</span>
                                  </button>

                                  {(editorCollapse.tataLetakSection ?? true) && (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                      {/* Margin */}
                                      <div className="space-y-1.5 py-1.5">
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                                            <span>Margin</span>
                                          </div>

                                          {/* Unit Dropdown for Section Margin */}
                                          <div className="relative">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (activeDropdown?.field === 'secMargin') {
                                                  setActiveDropdown(null);
                                                } else {
                                                  setActiveDropdown({ field: 'secMargin', elementId: editingSection.id });
                                                }
                                              }}
                                              className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-white font-black bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 transition-all select-none cursor-pointer"
                                            >
                                              <span>{parseUnitAndValue(editingSection.config.marginTop ?? 0).unit === 'custom' ? '✏️ Custom' : parseUnitAndValue(editingSection.config.marginTop ?? 0).unit}</span>
                                              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                                            </button>

                                            {activeDropdown?.field === 'secMargin' && activeDropdown?.elementId === editingSection.id && (
                                              <div className="absolute right-0 mt-1 w-24 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden py-1 z-[1000] animate-in fade-in slide-in-from-top-1 duration-150">
                                                {(['px', 'vw', '%'] as const).map((u) => (
                                                  <button
                                                    key={u}
                                                    type="button"
                                                    onClick={() => {
                                                      setActiveDropdown(null);
                                                      const updates: any = { ...editingSection.config };
                                                      ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(k => {
                                                        const oldVal = parseUnitAndValue(editingSection.config[k] ?? 0).val;
                                                        updates[k] = u === 'px' ? oldVal : `${oldVal}${u}`;
                                                      });
                                                      updateLocalSection({ ...editingSection, config: updates });
                                                    }}
                                                    className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-between ${parseUnitAndValue(editingSection.config.marginTop ?? 0).unit === u ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                  >
                                                    <span>{u}</span>
                                                    {parseUnitAndValue(editingSection.config.marginTop ?? 0).unit === u && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                                                  </button>
                                                ))}
                                                <div className="h-px bg-zinc-800 my-1" />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setActiveDropdown(null);
                                                    const updates: any = { ...editingSection.config };
                                                    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(k => {
                                                      updates[k] = parseUnitAndValue(editingSection.config[k] ?? 0).isCustom ? parseUnitAndValue(editingSection.config[k] ?? 0).customStr : '0px';
                                                    });
                                                    updateLocalSection({ ...editingSection, config: updates });
                                                  }}
                                                  className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-1.5 ${parseUnitAndValue(editingSection.config.marginTop ?? 0).unit === 'custom' ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                >
                                                  <Pencil className="w-2.5 h-2.5" />
                                                  <span>Custom</span>
                                                  {parseUnitAndValue(editingSection.config.marginTop ?? 0).unit === 'custom' && <span className="ml-auto w-1 h-1 rounded-full bg-blue-400" />}
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {parseUnitAndValue(editingSection.config.marginTop ?? 0).unit === 'custom' ? (
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              value={editingSection.config.marginTop ?? ''}
                                              placeholder="Contoh: 10px 20px, 5vw"
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                updateLocalSection({
                                                  ...editingSection,
                                                  config: {
                                                    ...editingSection.config,
                                                    marginTop: val,
                                                    marginRight: val,
                                                    marginBottom: val,
                                                    marginLeft: val
                                                  }
                                                });
                                              }}
                                              className="flex-1 h-8 text-xs px-2.5 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none placeholder:text-zinc-700 font-bold"
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex gap-1 items-start">
                                            <div className="flex-1 flex flex-col">
                                              <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                                {[
                                                  { k: 'marginTop', isLast: false },
                                                  { k: 'marginRight', isLast: false },
                                                  { k: 'marginBottom', isLast: false },
                                                  { k: 'marginLeft', isLast: true }
                                                ].map((m) => (
                                                  <input
                                                    key={m.k}
                                                    type="number"
                                                    value={parseUnitAndValue(editingSection.config[m.k] ?? 0).val}
                                                    onChange={(e) => {
                                                      const val = Number(e.target.value);
                                                      const newVal = parseUnitAndValue(editingSection.config[m.k] ?? 0).unit === 'px' ? val : `${val}${parseUnitAndValue(editingSection.config[m.k] ?? 0).unit}`;
                                                      const updates: any = { ...editingSection.config, [m.k]: newVal };
                                                      if (editingSection.config.marginLinked ?? true) {
                                                        updates.marginTop = newVal;
                                                        updates.marginRight = newVal;
                                                        updates.marginBottom = newVal;
                                                        updates.marginLeft = newVal;
                                                      }
                                                      updateLocalSection({ ...editingSection, config: updates });
                                                    }}
                                                    placeholder="-"
                                                    className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!m.isLast ? 'border-r border-zinc-800' : ''}`}
                                                  />
                                                ))}
                                              </div>
                                              <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                                <span>Atas</span>
                                                <span>Kanan</span>
                                                <span>Bawah</span>
                                                <span>Kiri</span>
                                              </div>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, marginLinked: !(editingSection.config.marginLinked ?? true) } })}
                                              className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${(editingSection.config.marginLinked ?? true)
                                                ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                                : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                                }`}
                                            >
                                              <LinkIcon className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {/* Padding */}
                                      <div className="space-y-1.5 py-1.5">
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                                            <span>Padding</span>
                                          </div>

                                          {/* Unit Dropdown for Section Padding */}
                                          <div className="relative">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (activeDropdown?.field === 'secPadding') {
                                                  setActiveDropdown(null);
                                                } else {
                                                  setActiveDropdown({ field: 'secPadding', elementId: editingSection.id });
                                                }
                                              }}
                                              className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-white font-black bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 transition-all select-none cursor-pointer"
                                            >
                                              <span>{parseUnitAndValue(editingSection.config.paddingTop ?? 40).unit === 'custom' ? '✏️ Custom' : parseUnitAndValue(editingSection.config.paddingTop ?? 40).unit}</span>
                                              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                                            </button>

                                            {activeDropdown?.field === 'secPadding' && activeDropdown?.elementId === editingSection.id && (
                                              <div className="absolute right-0 mt-1 w-24 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden py-1 z-[1000] animate-in fade-in slide-in-from-top-1 duration-150">
                                                {(['px', 'vw', '%'] as const).map((u) => (
                                                  <button
                                                    key={u}
                                                    type="button"
                                                    onClick={() => {
                                                      setActiveDropdown(null);
                                                      const updates: any = { ...editingSection.config };
                                                      ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(k => {
                                                        const oldVal = parseUnitAndValue(editingSection.config[k] ?? 40).val;
                                                        updates[k] = u === 'px' ? oldVal : `${oldVal}${u}`;
                                                      });
                                                      updateLocalSection({ ...editingSection, config: updates });
                                                    }}
                                                    className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-between ${parseUnitAndValue(editingSection.config.paddingTop ?? 40).unit === u ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                  >
                                                    <span>{u}</span>
                                                    {parseUnitAndValue(editingSection.config.paddingTop ?? 40).unit === u && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                                                  </button>
                                                ))}
                                                <div className="h-px bg-zinc-800 my-1" />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setActiveDropdown(null);
                                                    const updates: any = { ...editingSection.config };
                                                    ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(k => {
                                                      updates[k] = parseUnitAndValue(editingSection.config[k] ?? 40).isCustom ? parseUnitAndValue(editingSection.config[k] ?? 40).customStr : '40px';
                                                    });
                                                    updateLocalSection({ ...editingSection, config: updates });
                                                  }}
                                                  className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-1.5 ${parseUnitAndValue(editingSection.config.paddingTop ?? 40).unit === 'custom' ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                >
                                                  <Pencil className="w-2.5 h-2.5" />
                                                  <span>Custom</span>
                                                  {parseUnitAndValue(editingSection.config.paddingTop ?? 40).unit === 'custom' && <span className="ml-auto w-1 h-1 rounded-full bg-blue-400" />}
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {parseUnitAndValue(editingSection.config.paddingTop ?? 40).unit === 'custom' ? (
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              value={editingSection.config.paddingTop ?? ''}
                                              placeholder="Contoh: 40px 20px, 2vw"
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                updateLocalSection({
                                                  ...editingSection,
                                                  config: {
                                                    ...editingSection.config,
                                                    paddingTop: val,
                                                    paddingRight: val,
                                                    paddingBottom: val,
                                                    paddingLeft: val
                                                  }
                                                });
                                              }}
                                              className="flex-1 h-8 text-xs px-2.5 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none placeholder:text-zinc-700 font-bold"
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex gap-1 items-start">
                                            <div className="flex-1 flex flex-col">
                                              <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                                {[
                                                  { k: 'paddingTop', isLast: false },
                                                  { k: 'paddingRight', isLast: false },
                                                  { k: 'paddingBottom', isLast: false },
                                                  { k: 'paddingLeft', isLast: true }
                                                ].map((p) => (
                                                  <input
                                                    key={p.k}
                                                    type="number"
                                                    value={parseUnitAndValue(editingSection.config[p.k] ?? 40).val}
                                                    onChange={(e) => {
                                                      const val = Number(e.target.value);
                                                      const newVal = parseUnitAndValue(editingSection.config[p.k] ?? 40).unit === 'px' ? val : `${val}${parseUnitAndValue(editingSection.config[p.k] ?? 40).unit}`;
                                                      const updates: any = { ...editingSection.config, [p.k]: newVal };
                                                      if (editingSection.config.paddingLinked ?? true) {
                                                        updates.paddingTop = newVal;
                                                        updates.paddingRight = newVal;
                                                        updates.paddingBottom = newVal;
                                                        updates.paddingLeft = newVal;
                                                      }
                                                      updateLocalSection({ ...editingSection, config: updates });
                                                    }}
                                                    placeholder="-"
                                                    className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!p.isLast ? 'border-r border-zinc-800' : ''}`}
                                                  />
                                                ))}
                                              </div>
                                              <div className="grid grid-cols-4 mt-1 text-center text-[9px] font-semibold text-zinc-500 tracking-tight">
                                                <span>Atas</span>
                                                <span>Kanan</span>
                                                <span>Bawah</span>
                                                <span>Kiri</span>
                                              </div>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, paddingLinked: !(editingSection.config.paddingLinked ?? true) } })}
                                              className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${(editingSection.config.paddingLinked ?? true)
                                                ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                                : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                                }`}
                                            >
                                              <LinkIcon className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      <div className="h-px bg-zinc-800/80 my-3" />

                                      {/* Sticky Toggle khusus HEADER */}
                                      {editingSection.type === 'HEADER' && (
                                        <div className="flex items-center justify-between py-1 bg-zinc-950 rounded-lg border border-zinc-800 p-2">
                                          <span className="text-[10px] font-bold uppercase text-zinc-300 font-bold">Sticky Header</span>
                                          <button
                                            type="button"
                                            onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, sticky: !editingSection.config.sticky } })}
                                            className={`px-3 py-1.5 rounded text-[9px] font-black uppercase transition-all ${editingSection.config.sticky
                                              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                                              : 'bg-zinc-950 text-zinc-500 hover:text-zinc-200'
                                              }`}
                                          >
                                            {editingSection.config.sticky ? 'ON' : 'OFF'}
                                          </button>
                                        </div>
                                      )}

                                      {/* Posisi */}
                                      <div className="flex justify-between items-center py-1">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Posisi</span>
                                        <select
                                          value={editingSection.config.position || 'relative'}
                                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, position: e.target.value } })}
                                          className="w-36 p-1.5 rounded text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 font-medium focus:border-zinc-700 outline-none"
                                        >
                                          <option value="relative">Asali</option>
                                          <option value="absolute">Absolut</option>
                                          <option value="fixed">Tetap</option>
                                          <option value="static">Statis</option>
                                        </select>
                                      </div>

                                      {/* Z-Index */}
                                      <div className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                                          <span>Z-Index</span>

                                        </div>
                                        <input
                                          type="number"
                                          value={editingSection.config.zIndex ?? 10}
                                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, zIndex: Number(e.target.value) } })}
                                          className="w-16 h-7 text-center text-xs font-bold bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none font-medium"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Daftar Elemen (Visual Global Tree list inside section) */}
                            {(editingSection.elements || []).length > 0 && (
                              <div className="space-y-2 border border-zinc-800 rounded-xl p-3 bg-zinc-900/30">
                                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between pb-1.5 border-b border-zinc-800 mb-1.5">
                                  <span>Daftar Elemen ({(editingSection.elements || []).length})</span>
                                  <Layers className="w-3 h-3 text-zinc-500" />
                                </span>
                                <div className="space-y-1.5 max-h-[180px] overflow-y-auto premium-scrollbar">
                                  {(editingSection.elements || []).sort((a: SectionElement, b: SectionElement) => a.order - b.order).map((el: SectionElement) => {
                                    const meta = ELEMENT_TYPE_MAP[el.type];
                                    const Icon = meta?.icon || Type;
                                    return (
                                      <div
                                        key={el.id}
                                        onClick={() => setActiveElementId(el.id)}
                                        className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-all border ${activeElementId === el.id
                                          ? 'bg-zinc-800 border-zinc-700 text-white shadow-sm'
                                          : 'bg-zinc-950/40 border-zinc-900 text-zinc-300 hover:bg-zinc-900/30'
                                          }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Icon className="w-3.5 h-3.5 text-zinc-400" />
                                          <span className="text-[10px] font-black tracking-wide uppercase">{meta?.label || el.type}</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteElement(editingSection.id, el.id);
                                          }}
                                          className="text-red-400 hover:text-red-500 p-1"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>


                    </motion.div>
                  );
                })()
              )
  );
}

