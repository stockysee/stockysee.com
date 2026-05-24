
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
import { BuilderSidebarProps, Section } from "../types";
import { SectionElement } from "@/components/storefront/sections/BuilderSection";
import { POPULAR_FONTS } from "../constants";
import { SECTION_STRUCTURE_TEMPLATES } from "../templates";
import { sanitizeSections, parseUnitAndValue } from "../utils";
import { RichTextEditor } from "../components/RichTextEditor";
import { DraggableReorderItem } from "../components/DraggableReorderItem";
import { MoveControls } from "../components/MoveControls";
import { UnitControl } from "../components/UnitControl";
import { ELEMENT_TYPE_MAP } from "@/components/storefront/sections/BuilderSection";

export interface LibraryPanelProps extends BuilderSidebarProps {
  isFloatingNavigatorOpen: boolean;
  setIsFloatingNavigatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LibraryPanel(props: LibraryPanelProps) {
  const { state, activeCanvas, isFloatingNavigatorOpen, setIsFloatingNavigatorOpen } = props;
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
    (
                <motion.div key="library" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full overflow-hidden">

                  {/* Header Panel Kiri Premium */}
                  <div className="px-4 py-3 border-b border-zinc-800 bg-[#18181b] flex items-center justify-between shrink-0">
                    <span className="text-[12px] font-black uppercase tracking-wider text-white">DESAIN EDITOR</span>
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  </div>

                  {/* Tab Selector */}
                  <div className="flex border-b border-zinc-800 bg-[#131316] shrink-0">
                    <button
                      onClick={() => {
                        setActiveLibraryTab('widget');
                        console.log("[Tab Click] Beralih ke tab: widget");
                      }}
                      className={`flex-1 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider transition-all relative ${activeLibraryTab === 'widget'
                        ? 'text-white border-b-2 border-white bg-zinc-900/30 font-black'
                        : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                      Widget
                    </button>
                    <button
                      onClick={() => {
                        setActiveLibraryTab('global');
                        console.log("[Tab Click] Beralih ke tab: global");
                      }}
                      className={`flex-1 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider transition-all relative ${activeLibraryTab === 'global'
                        ? 'text-white border-b-2 border-white bg-zinc-900/30 font-black'
                        : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                      Layer
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto premium-scrollbar bg-[#131316]">
                    {activeLibraryTab === 'widget' ? (
                      /* ═══ TAB WIDGET ═══ */
                      (() => {
                        const isHeaderMode = props.activeCanvas === 'header';
                        return (
                        <div className="p-4 space-y-5">

                        {isHeaderMode ? (
                          /* ═══ HEADER MODE: Satu grup Dasar ═══ */
                          <>
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block px-1">Dasar</span>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { type: 'COLUMN', icon: Columns, label: 'Kontainer', desc: 'Layout Vertikal', color: 'text-blue-400 group-hover:text-blue-300' },
                                { type: 'GRID', icon: LayoutGrid, label: 'Grid', desc: 'Layout Horizontal', color: 'text-blue-400 group-hover:text-blue-300' },
                                { type: 'HEADING', icon: Type, label: 'Title', desc: 'Heading Teks', color: 'text-zinc-400 group-hover:text-white' },
                                { type: 'BUTTON', icon: MousePointerClick, label: 'Tombol', desc: 'Aksi & Tautan', color: 'text-zinc-400 group-hover:text-white' },
                                { type: 'BADGE', icon: Award, label: 'Icon', desc: 'Badge & Label', color: 'text-zinc-400 group-hover:text-white' },
                                { type: 'BRANDING', icon: Award, label: 'Nama & Logo', desc: 'Branding Toko', color: 'text-amber-400 group-hover:text-amber-300' },
                                { type: 'MENU', icon: AlignLeft, label: 'Menu Navigasi', desc: 'Tautan Halaman', color: 'text-zinc-400 group-hover:text-white' },
                              ].map(({ type, icon: Icon, label, desc, color }) => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    if (type === 'GRID') {
                                      const gridElId = `el-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                                      const newElement: SectionElement = {
                                        id: gridElId, type: 'COLUMN',
                                        config: { layout: 'horizontal', gap: 16, align: 'center' },
                                        order: 0, children: []
                                      };
                                      handleCustomWidgetClick(newElement, 'Grid');
                                    } else {
                                      handleWidgetClick(type);
                                    }
                                  }}
                                  draggable="true"
                                  onDragStart={(e) => handleWidgetDragStart(e, type)}
                                  onDragEnd={handleWidgetDragEnd}
                                  className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                                    <Icon className={'w-4 h-4 ' + color} />
                                  </div>
                                  <span className="text-[11px] font-bold text-center leading-tight">{label}</span>
                                  <span className="text-[8px] text-zinc-500 leading-none font-medium">{desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Template Bawaan */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block px-1">Template Bawaan</span>
                            <div className="space-y-2">
                              <button onClick={() => handleInsertHeroTemplate()} className="w-full p-3 bg-gradient-to-r from-zinc-900 to-zinc-950 hover:from-zinc-850 hover:to-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center gap-3 transition-all text-zinc-100 hover:-translate-y-[2.5px] shadow-sm group/btn">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-[12px] shadow-inner flex items-center justify-center shrink-0">HERO</div>
                                <div className="text-left leading-tight">
                                  <p className="text-[11px] font-bold text-zinc-100 group-hover/btn:text-blue-400">Hero Premium</p>
                                  <p className="text-[8px] text-zinc-500">Judul besar, deskripsi, dan tombol aksi ganda.</p>
                                </div>
                              </button>
                              <button onClick={() => handleInsertFeaturesTemplate()} className="w-full p-3 bg-gradient-to-r from-zinc-900 to-zinc-950 hover:from-zinc-850 hover:to-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center gap-3 transition-all text-zinc-100 hover:-translate-y-[2.5px] shadow-sm group/btn">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-[12px] shadow-inner flex items-center justify-center shrink-0">GRID</div>
                                <div className="text-left leading-tight">
                                  <p className="text-[11px] font-bold text-zinc-100 group-hover/btn:text-emerald-400">Feature Showcase</p>
                                  <p className="text-[8px] text-zinc-500">Tampilan grid 3 kolom fitur premium.</p>
                                </div>
                              </button>
                            </div>
                          </div>
                          </>
                        ) : (
                          /* ═══ HOMEPAGE MODE: Grup asli tanpa Header ═══ */
                          <>
                          {/* Tata Letak */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block px-1">Tata Letak</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => handleWidgetClick('COLUMN')} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'COLUMN')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><Columns className="w-4 h-4 text-blue-400 group-hover:text-blue-300" /></div>
                                <span className="text-[11px] font-bold">Kontainer</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Layout Vertikal</span>
                              </button>
                              <button onClick={() => { const gridElId = `el-${Date.now()}-${Math.random().toString(36).substring(7)}`; const newElement: SectionElement = { id: gridElId, type: 'COLUMN', config: { layout: 'horizontal', gap: 16, align: 'center' }, order: 0, children: [] }; handleCustomWidgetClick(newElement, 'Grid'); }} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'GRID')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><LayoutGrid className="w-4 h-4 text-blue-400 group-hover:text-blue-300" /></div>
                                <span className="text-[11px] font-bold">Grid</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Layout Horizontal</span>
                              </button>
                            </div>
                          </div>

                          {/* Dasar */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block px-1">Dasar</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => handleWidgetClick('HEADING')} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'HEADING')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><Type className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold">Title</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Heading Teks</span>
                              </button>
                              <button onClick={() => handleWidgetClick('TEXT')} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'TEXT')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><AlignLeft className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold">Subtitle</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Paragraf Deskripsi</span>
                              </button>
                              <button onClick={() => handleWidgetClick('IMAGE')} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'IMAGE')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><ImageIcon className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold">Gambar</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Foto / Media</span>
                              </button>
                              <button onClick={() => handleWidgetClick('BUTTON')} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'BUTTON')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><MousePointerClick className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold">Tombol</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Aksi & Tautan</span>
                              </button>
                              <button onClick={() => handleWidgetClick('DIVIDER')} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'DIVIDER')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><SeparatorHorizontal className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold">Pembatas</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Garis Pemisah</span>
                              </button>
                              <button onClick={() => handleWidgetClick('BADGE')} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'BADGE')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><Award className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold">Icon</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Badge & Label</span>
                              </button>
                              <button onClick={() => handleWidgetClick('GALLERY')} draggable="true" onDragStart={(e) => handleWidgetDragStart(e, 'GALLERY')} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><LayoutGrid className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold">Gallery</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Multi Gambar</span>
                              </button>
                            </div>
                          </div>

                          {/* E-Commerce Dinamis */}
                          <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block px-1">E-Commerce Dinamis</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => { console.log("[Sidebar] Clicked CATEGORY_LIST widget button"); handleWidgetClick('CATEGORY_LIST'); }} draggable="true" onDragStart={(e) => { console.log("[Sidebar] Drag started CATEGORY_LIST widget"); handleWidgetDragStart(e, 'CATEGORY_LIST'); }} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><Folder className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold text-center leading-tight">Daftar Kategori</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Scroll / Grid</span>
                              </button>
                              <button onClick={() => { console.log("[Sidebar] Clicked PRODUCT_LIST widget button"); handleWidgetClick('PRODUCT_LIST'); }} draggable="true" onDragStart={(e) => { console.log("[Sidebar] Drag started PRODUCT_LIST widget"); handleWidgetDragStart(e, 'PRODUCT_LIST'); }} onDragEnd={handleWidgetDragEnd} className="p-3 bg-[#18181b] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center gap-1.5 transition-all text-zinc-100 hover:text-white hover:-translate-y-[2px] shadow-sm active:scale-95 group cursor-grab">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"><ShoppingBag className="w-4 h-4 text-zinc-400 group-hover:text-white" /></div>
                                <span className="text-[11px] font-bold text-center leading-tight">Grid Produk</span>
                                <span className="text-[8px] text-zinc-500 leading-none font-medium">Dinamis DB</span>
                              </button>
                            </div>
                          </div>

                          {/* Template Bawaan */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block px-1">Template Bawaan</span>
                            <div className="space-y-2">
                              <button onClick={() => handleInsertHeroTemplate()} className="w-full p-3 bg-gradient-to-r from-zinc-900 to-zinc-950 hover:from-zinc-850 hover:to-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center gap-3 transition-all text-zinc-100 hover:-translate-y-[2.5px] shadow-sm group/btn">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-[12px] shadow-inner flex items-center justify-center shrink-0">HERO</div>
                                <div className="text-left leading-tight">
                                  <p className="text-[11px] font-bold text-zinc-100 group-hover/btn:text-blue-400">Hero Premium</p>
                                  <p className="text-[8px] text-zinc-500">Judul besar, deskripsi, dan tombol aksi ganda.</p>
                                </div>
                              </button>
                              <button onClick={() => handleInsertFeaturesTemplate()} className="w-full p-3 bg-gradient-to-r from-zinc-900 to-zinc-950 hover:from-zinc-850 hover:to-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center gap-3 transition-all text-zinc-100 hover:-translate-y-[2.5px] shadow-sm group/btn">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-[12px] shadow-inner flex items-center justify-center shrink-0">GRID</div>
                                <div className="text-left leading-tight">
                                  <p className="text-[11px] font-bold text-zinc-100 group-hover/btn:text-emerald-400">Feature Showcase</p>
                                  <p className="text-[8px] text-zinc-500">Tampilan grid 3 kolom fitur premium.</p>
                                </div>
                              </button>
                            </div>
                          </div>
                          </>
                        )}

                        </div>
                        );
                      })()
                    ) : (
                      /* ═══ TAB GLOBAL (Accordion Visual Hirarki) ═══ */
                      <div className="flex-1 bg-[#131316]">

                        {/* ═══ HEADER GROUP ═══ */}
                        <div className="px-4 py-3 border-b border-zinc-800 bg-[#18181b]/30">
                          <span className="text-[13px] font-bold text-zinc-100">Header</span>
                        </div>
                        {(() => {
                          const headerSection = sections.find(s => s.type === 'HEADER');
                          if (!headerSection) return null;
                          const isExpanded = expandedSections[headerSection.id] ?? true;
                          const isActiveH = editingSection?.id === headerSection.id;
                          const hElements: SectionElement[] = headerSection.elements || [];
                          return (
                            <div className="border-b border-zinc-800 bg-[#131316]">
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer transition-colors group ${isActiveH && !activeElementId ? 'bg-zinc-900/40 border-l border-blue-400 pl-2' : 'hover:bg-zinc-900/30 text-zinc-300'}`}>
                                <button onClick={(e) => { e.stopPropagation(); setExpandedSections(prev => ({ ...prev, [headerSection.id]: !isExpanded })); }} className="p-0.5 rounded transition-colors text-zinc-500 hover:text-zinc-300">
                                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                </button>
                                <div onClick={() => { if (shouldSuppressClick()) return; setEditingSection(headerSection); setActiveElementId(null); setActivePanel('editor'); }} className="flex-1 flex items-center gap-2 min-w-0">
                                  <Layers className="w-4 h-4 text-zinc-400 shrink-0" />
                                  <span className={`text-[13px] truncate ${isActiveH ? 'text-blue-400 font-semibold' : 'text-zinc-300'}`}>Header (Template Tetap)</span>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setEditingSection(headerSection); setActiveElementId(null); setActivePanel('editor'); }} className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-zinc-300">
                                  <Settings2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {isExpanded && (
                                <div className="pb-1 bg-[#131316]">
                                  <Reorder.Group axis="y" values={hElements.sort((a, b) => a.order - b.order)} onReorder={(newOrder) => handleSaveElementOrder(headerSection.id, null, newOrder)} className="w-full" onClickCapture={handleContainerClickCapture}>
                                    {hElements.sort((a, b) => a.order - b.order).map((el, elIndex) =>
                                      renderElementTree(el, 0, null, headerSection, hElements.sort((a, b) => a.order - b.order), elIndex)
                                    )}
                                  </Reorder.Group>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* ═══ CONTENT / SECTIONS GROUP ═══ */}
                        <div className="px-4 py-3 border-b border-zinc-800 bg-[#18181b]/30">
                          <span className="text-[13px] font-bold text-zinc-100">Content</span>
                        </div>

                        <Reorder.Group axis="y" values={sections.filter(s => s.type === 'SECTION')} onReorder={handleSaveOrder} className="w-full bg-[#131316]" onClickCapture={handleContainerClickCapture}>
                          {sections.filter(s => s.type === 'SECTION').map((section, idx) => {
                            const isExpanded = expandedSections[section.id] ?? true;
                            const isActive = editingSection?.id === section.id;
                            const elements: SectionElement[] = section.elements || [];
                            return (
                              <DraggableReorderItem
                                key={section.id}
                                value={section}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                className="border-b border-zinc-800 bg-[#131316]"
                              >
                                {(dragControls) => (
                                  <div className="relative">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer transition-colors group ${isActive && !activeElementId ? 'bg-zinc-900/40 border-l border-blue-400 pl-2' : 'hover:bg-zinc-900/30 text-zinc-300'}`}>
                                      <MoveControls
                                        canMoveUp={idx > 0}
                                        canMoveDown={idx < sections.filter(s => s.type === 'SECTION').length - 1}
                                        onMoveUp={(e) => { e.stopPropagation(); e.preventDefault(); moveSection(section.id, "up"); }}
                                        onMoveDown={(e) => { e.stopPropagation(); e.preventDefault(); moveSection(section.id, "down"); }}
                                      />
                                      <button onClick={(e) => { e.stopPropagation(); setExpandedSections(prev => ({ ...prev, [section.id]: !isExpanded })); }} className="p-0.5 rounded transition-colors text-zinc-500 hover:text-zinc-300">
                                        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                      </button>
                                      <div onClick={() => { if (shouldSuppressClick()) return; setEditingSection(section); setActiveElementId(null); setActivePanel('editor'); }} className="flex-1 flex items-center gap-2 min-w-0">
                                        <Box className="w-4 h-4 text-zinc-400 shrink-0" />
                                        <span className={`text-[13px] truncate ${isActive ? 'text-blue-400 font-semibold' : 'text-zinc-300'}`}>Section {idx + 1}</span>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          console.log("[Global Tree] Menargetkan Section untuk penambahan elemen. ID:", section.id);
                                          setAddingBlockToId(section.id);
                                          setActiveLibraryTab('widget');
                                          setIsLeftPanelOpen(true);
                                          setActivePanel('library');
                                        }}
                                        className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all text-blue-400 hover:text-blue-300 mr-1"
                                        title="Tambah Elemen ke Section"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); setEditingSection(section); setActiveElementId(null); setActivePanel('editor'); }} className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-zinc-300">
                                        <Settings2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                    {isExpanded && (
                                      <div className="pb-1 bg-[#131316]">
                                        <Reorder.Group axis="y" values={elements.sort((a, b) => a.order - b.order)} onReorder={(newOrder) => handleSaveElementOrder(section.id, null, newOrder)} className="w-full" onClickCapture={handleContainerClickCapture}>
                                          {elements.sort((a, b) => a.order - b.order).map((el, elIndex) =>
                                            renderElementTree(el, 0, null, section, elements.sort((a, b) => a.order - b.order), elIndex)
                                          )}
                                        </Reorder.Group>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DraggableReorderItem>
                            );
                          })}
                        </Reorder.Group>

                        {/* Add Section (Content only) */}
                        <div className="border-b border-zinc-800 bg-[#131316]">
                          <button onClick={handleAddSection} className="w-full flex items-center gap-2 px-4 py-3 transition-colors text-blue-400 hover:text-blue-300 font-semibold">
                            <PlusCircle className="w-4 h-4" /><span className="text-[13px]">tambah section</span>
                          </button>
                        </div>

                        {/* ═══ FOOTER GROUP ═══ */}
                        <div className="px-4 py-3 border-b border-zinc-800 bg-[#18181b]/30">
                          <span className="text-[13px] font-bold text-zinc-100">Footer</span>
                        </div>
                        {(() => {
                          let footerSection = sections.find(s => s.type === 'FOOTER');
                          if (!footerSection) {
                            return (
                              <button
                                onClick={() => {
                                  const newFooter: Section = { id: 'global-footer', type: 'FOOTER', config: { bgColor: '#18181B', paddingTop: 40, paddingBottom: 40, paddingLeft: 40, paddingRight: 40, layout: 'vertical', gap: 12, align: 'center' }, elements: [], order: 9999, isActive: true };
                                  saveHistory([...sections, newFooter]);
                                  setEditingSection(newFooter);
                                  setActivePanel('editor');
                                  setExpandedSections(prev => ({ ...prev, ['__footer']: true }));
                                  console.log('[Builder] Footer created');
                                }}
                                className="w-full flex items-center gap-2 pl-10 pr-4 py-3 transition-colors text-blue-400 hover:text-blue-300 font-semibold"
                              >
                                <PlusCircle className="w-4 h-4" /><span className="text-[13px]">Tambah Footer</span>
                              </button>
                            );
                          }
                          const isExpF = expandedSections['__footer'] ?? true;
                          const isActiveF = editingSection?.id === footerSection.id;
                          const fElements: SectionElement[] = footerSection.elements || [];
                          return (
                            <div className="border-b border-zinc-800 bg-[#131316]">
                              <div className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors group ${isActiveF && !activeElementId ? 'bg-zinc-900/40 border-l border-blue-400 pl-2' : 'hover:bg-zinc-900/30 text-zinc-300'}`}>
                                <button onClick={(e) => { e.stopPropagation(); setExpandedSections(prev => ({ ...prev, ['__footer']: !isExpF })); }} className="p-0.5 rounded transition-colors text-zinc-500 hover:text-zinc-300">
                                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpF ? 'rotate-90' : ''}`} />
                                </button>
                                <div onClick={() => { if (shouldSuppressClick()) return; setEditingSection(footerSection!); setActiveElementId(null); setActivePanel('editor'); }} className="flex-1 flex items-center gap-2 min-w-0">
                                  <Layers className="w-4 h-4 text-zinc-400 shrink-0" />
                                  <span className={`text-[13px] truncate ${isActiveF ? 'text-blue-400 font-semibold' : 'text-zinc-300'}`}>Footer</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log("[Global Tree] Menargetkan Footer untuk penambahan elemen. ID:", footerSection!.id);
                                    setAddingBlockToId(footerSection!.id);
                                    setActiveLibraryTab('widget');
                                    setIsLeftPanelOpen(true);
                                    setActivePanel('library');
                                  }}
                                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all text-blue-400 hover:text-blue-300 mr-1"
                                  title="Tambah Elemen ke Footer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setEditingSection(footerSection!); setActiveElementId(null); setActivePanel('editor'); }} className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-zinc-300">
                                  <Settings2 className="w-3 h-3" />
                                </button>
                              </div>
                              {isExpF && (
                                <div className="pb-1 bg-[#131316]">
                                  <Reorder.Group axis="y" values={fElements.sort((a, b) => a.order - b.order)} onReorder={(newOrder) => handleSaveElementOrder(footerSection!.id, null, newOrder)} className="w-full" onClickCapture={handleContainerClickCapture}>
                                    {fElements.sort((a, b) => a.order - b.order).map((el, elIndex) =>
                                      renderElementTree(el, 0, null, footerSection!, fElements.sort((a, b) => a.order - b.order), elIndex)
                                    )}
                                  </Reorder.Group>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
  );
}
