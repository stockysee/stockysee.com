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
  Maximize2, Table, Strikethrough, HelpCircle, Eraser, Quote, Minus, Move
} from "lucide-react";
import { EditorPanelProps } from "../EditorPanel";
import { RichTextEditor } from "../../components/RichTextEditor";
import { UnitControl } from "../../components/UnitControl";
import { DraggableReorderItem } from "../../components/DraggableReorderItem";
import { MoveControls } from "../../components/MoveControls";
import { POPULAR_FONTS } from "../../constants";
import { ELEMENT_TYPE_MAP } from "@/components/storefront/sections/BuilderSection";

export function ColumnEditor({ props, activeElement }: { props: EditorPanelProps, activeElement: any }) {
  const { state, isFloatingNavigatorOpen, setIsFloatingNavigatorOpen } = props;
  const {
    activeEditorTab, editingSection,
    handleUpdateElement, editorCollapse, setEditorCollapse,
    showImageUrlInput, setShowImageUrlInput,
    handleUploadImage, isUploading,
    categories, products,
    updateLocalSection,
    handleDeleteElementCtx, handleDuplicateElementCtx, handleCopyElementCtx, handlePasteElementCtx,
    btnStyleMode, setBtnStyleMode, setBtnPaddingLink, btnPaddingLink,
    borderRadiusLink, setBorderRadiusLink, borderWidthLink, setBorderWidthLink,
    bgBorderRadiusLink, setBgBorderRadiusLink, bgBorderWidthLink, setBgBorderWidthLink,
    marginLink, setMarginLink, paddingLink, setPaddingLink,
    client, sections,
    setTempHeight, setTempWidth,
    tempHeight, tempWidth,
    activeDragId, setActiveDragId, handleSaveElementOrder,
    handleSelectStructure, isStructureModalOpen, setIsStructureModalOpen,
    moveInArray, swapInArray,
    addingBlockToId, setAddingBlockToId,
    activeElementId, setActiveElementId,
    imageResolutionMode, setImageResolutionMode,
    allCustomPages, customPage,
    handleUpdateColumnChild, handleDeleteColumnChild, handleAddColumnChild,
    contextMenu, setContextMenu
  } = state;

  return (
    <>
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
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Tipe Layout</span>
                                              <select
                                                value={editingSection.config.layout === 'grid' ? 'grid' : 'horizontal'}
                                                onChange={(e) => {
                                                  updateLocalSection({ ...editingSection, config: { ...editingSection.config, layout: e.target.value } });
                                                  console.log('[Editor Debug] Tipe Layout SECTION diubah ke:', e.target.value);
                                                }}
                                                className="w-36 p-1.5 rounded text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 font-medium focus:border-zinc-700 outline-none cursor-pointer"
                                              >
                                                <option value="horizontal">Flexbox</option>
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
                                              value={activeElement.config.width}
                                              defaultValue={1000}
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
                                              value={activeElement.config.minHeight}
                                              defaultValue={0}
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
                                                <div className="flex justify-between items-center py-1.5">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Direksi</span>
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-[144px] shrink-0">
                                                    {[
                                                      { v: 'horizontal', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>, title: 'Row (Horizontal)' },
                                                      { v: 'vertical', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>, title: 'Column (Vertikal)' },
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
                                                        className={`flex-1 h-7 flex items-center justify-center rounded transition-all ${(activeElement.config.layout || 'vertical') === opt.v
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
                                                        className={`flex-1 h-7 flex items-center justify-center rounded transition-all ${(activeElement.config.justifyContent || 'flex-start') === opt.v
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
                                                <div className="flex justify-between items-center py-1.5">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Items</span>
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-[144px] shrink-0">
                                                    {[
                                                      { v: 'flex-start', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="4" x2="22" y2="4"/><rect x="4" y="7" width="6" height="13" rx="1"/><rect x="14" y="7" width="6" height="9" rx="1"/></svg>, t: 'Start' },
                                                      { v: 'center', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><rect x="4" y="5" width="6" height="14" rx="1"/><rect x="14" y="7" width="6" height="10" rx="1"/></svg>, t: 'Center' },
                                                      { v: 'flex-end', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="20" x2="22" y2="20"/><rect x="4" y="4" width="6" height="16" rx="1"/><rect x="14" y="8" width="6" height="12" rx="1"/></svg>, t: 'End' },
                                                      { v: 'stretch', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="4" x2="22" y2="4"/><line x1="2" y1="20" x2="22" y2="20"/><rect x="4" y="4" width="6" height="16" rx="1"/><rect x="14" y="4" width="6" height="16" rx="1"/></svg>, t: 'Stretch' },
                                                    ].map(opt => (
                                                      <button
                                                        key={opt.v}
                                                        type="button"
                                                        title={opt.t}
                                                        onClick={() => {
                                                          handleUpdateElement(editingSection.id, activeElement.id, { alignItems: opt.v });
                                                          console.log('[Editor] Align Items COLUMN diubah ke:', opt.v);
                                                        }}
                                                        className={`flex-1 h-7 flex items-center justify-center rounded transition-all ${(activeElement.config.alignItems || 'stretch') === opt.v
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

                            {/* TAB 2: GAYA (KOLOM) */}
                                  {activeEditorTab === 'style' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                      {/* Accordion: Latar */}
                                      <div className="space-y-3">
                                        <button
                                          type="button"
                                          onClick={() => setEditorCollapse(prev => ({ ...prev, latarBelakangSection: !prev.latarBelakangSection }))}
                                          className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                        >
                                          {(editorCollapse.latarBelakangSection ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span>Latar</span>
                                        </button>
      
                                        {(editorCollapse.latarBelakangSection ?? true) && (
                                          <div className="space-y-4 animate-in fade-in duration-200">
                                            {/* Tabs Normal / Sorotan */}
                                            <div className="flex bg-[#2c2d32] rounded-md p-0.5 border border-zinc-800">
                                              <button
                                                type="button"
                                                onClick={() => setEditorCollapse(prev => ({ ...prev, secLatarTab: 'normal' }))}
                                                className={`flex-1 text-center py-1.5 text-xs font-semibold rounded transition-all ${(editorCollapse.secLatarTab || 'normal') === 'normal' ? 'text-white bg-[#42444b] shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
                                                Normal
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => setEditorCollapse(prev => ({ ...prev, secLatarTab: 'hover' }))}
                                                className={`flex-1 text-center py-1.5 text-xs font-semibold rounded transition-all ${(editorCollapse.secLatarTab || 'normal') === 'hover' ? 'text-white bg-[#42444b] shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
                                                Sorotan
                                              </button>
                                            </div>
      
                                            {(editorCollapse.secLatarTab || 'normal') === 'normal' ? (<>
                                            <div className="flex items-center justify-between py-1">
                                              <span className="text-xs text-zinc-300 font-medium">Background Type</span>
                                              <div className="flex gap-0.5 bg-[#25262b] rounded p-0.5 border border-zinc-800">
                                                <button 
                                                  type="button"
                                                  onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgType: 'classic' }
)}
                                                  className={`p-1.5 rounded shadow-sm transition-colors ${(activeElement.config.bgType || 'classic') === 'classic' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                                                  title="Klasik"
                                                >
                                                  <Paintbrush className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                  type="button"
                                                  onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgType: 'gradient' }
)}
                                                  className={`p-1.5 rounded shadow-sm transition-colors ${(activeElement.config.bgType || 'classic') === 'gradient' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                                                  title="Gradien"
                                                >
                                                  <div className="w-3.5 h-3.5 rounded-[1px] bg-gradient-to-br from-zinc-300 to-zinc-600"></div>
                                                </button>
                                              </div>
                                            </div>
      
                                            {/* Conditional Content based on bgType */}
                                            {(activeElement.config.bgType || 'classic') === 'classic' && (
                                              <>
                                                {/* Warna */}
                                                <div className="flex items-center justify-between py-1">
                                                  <span className="text-xs text-zinc-300 font-medium">Warna</span>
                                                  <div className="flex border border-zinc-700 rounded overflow-hidden">
                                                    {activeElement.config.bgColor && activeElement.config.bgColor !== 'transparent' && (
                                                      <button 
                                                        type="button" 
                                                        onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgColor: 'transparent' }
)}
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
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgColor: e.target.value }
)} 
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
      
                                                {/* Gambar */}
                                                <div className="space-y-2 py-1">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                      <span className="text-xs text-zinc-300 font-medium">Gambar</span>
                                                      <Monitor className="w-3 h-3 text-zinc-400" />
                                                    </div>
                                                    <Sparkles className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-200 cursor-pointer" />
                                                  </div>
      
                                                  <div className="relative w-full aspect-[2/1] rounded-sm overflow-hidden bg-[#3a3b40] transition-all group cursor-pointer border border-transparent hover:border-zinc-500">
                                                    <input 
                                                      type="file" 
                                                      id="hidden-bg-file-sec-latar" 
                                                      accept="image/*" 
                                                      className="hidden" 
                                                      disabled={isUploading} 
                                                      onChange={async (e) => { 
                                                        const f = e.target.files?.[0]; 
                                                        if (!f) return; 
                                                        const url = await handleUploadImage(f); 
                                                        if (url) handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgImageUrl: url }
); 
                                                        e.target.value = ''; 
                                                      }} 
                                                    />
                                                    {activeElement.config.bgImageUrl ? (
                                                      <img src={activeElement.config.bgImageUrl} alt="BG" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                                    ) : (
                                                      <div className="w-full h-full flex items-center justify-center hover:bg-[#4a4c52] transition-colors" onClick={() => { openMediaModal((url) => { handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgImageUrl: url }
); }, "image"); }}>
                                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#3a3b40] shadow-sm">
                                                          <Plus className="w-4 h-4 font-black" />
                                                        </div>
                                                      </div>
                                                    )}
                                                    
                                                    {activeElement.config.bgImageUrl && (
                                                      <div className="absolute inset-x-0 bottom-0 bg-black/85 p-2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all duration-200 z-20">
                                                        <button type="button" onClick={() => { openMediaModal((url) => { handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgImageUrl: url }
); }, "image"); }} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">
                                                          <ImageIcon className="w-3 h-3 text-zinc-400" />
                                                          <span>Buka media</span>
                                                        </button>
                                                        <label htmlFor="hidden-bg-file-sec-latar" className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">
                                                          <Upload className="w-3 h-3 text-zinc-400" />
                                                          <span>Upload</span>
                                                        </label>
                                                      </div>
                                                    )}
                                                    {activeElement.config.bgImageUrl && (
                                                      <button type="button" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await handleDeleteImage(activeElement.config.bgImageUrl); handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgImageUrl: '' }
); }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 cursor-pointer" title="Hapus gambar latar">
                                                        <Trash2 className="w-3 h-3" />
                                                      </button>
                                                    )}
                                                  </div>
      
                                                  {activeElement.config.bgImageUrl && (
                                                    <div className="space-y-3 pt-2">
                                                      {/* Opacity */}
                                                      <div className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                          <span className="text-xs text-zinc-300 font-medium">Opacity</span>
                                                        </div>
                                                        <div className="flex gap-3 items-center">
                                                          <input 
                                                            type="range" 
                                                            min="0" 
                                                            max="100" 
                                                            value={activeElement.config.bgImageOpacity ?? 100}
                                                            onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgImageOpacity: Number(e.target.value) }
)}
                                                            className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                                          />
                                                          <input 
                                                            type="number" 
                                                            value={activeElement.config.bgImageOpacity ?? 100}
                                                            onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgImageOpacity: Number(e.target.value) }
)}
                                                            className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                                          />
                                                        </div>
                                                      </div>
      
                                                      {/* Blur */}
                                                      <div className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                          <span className="text-xs text-zinc-300 font-medium">Blur</span>
                                                        </div>
                                                        <div className="flex gap-3 items-center">
                                                          <input 
                                                            type="range" 
                                                            min="0" 
                                                            max="100" 
                                                            value={activeElement.config.bgImageBlur ?? 0}
                                                            onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgImageBlur: Number(e.target.value) }
)}
                                                            className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                                          />
                                                          <input 
                                                            type="number" 
                                                            value={activeElement.config.bgImageBlur ?? 0}
                                                            onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgImageBlur: Number(e.target.value) }
)}
                                                            className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </>
                                            )}
      
                                            {activeElement.config.bgType === 'gradient' && (
                                              <div className="space-y-4 pt-2">
                                                {/* Info Box */}
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
                                                        onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientColor1: 'transparent' }
)}
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
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientColor1: e.target.value }
)} 
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
                                                      type="range" 
                                                      min="0" 
                                                      max="100" 
                                                      value={activeElement.config.bgGradientLoc1 ?? 0}
                                                      onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientLoc1: Number(e.target.value) }
)}
                                                      className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                                    />
                                                    <input 
                                                      type="number" 
                                                      value={activeElement.config.bgGradientLoc1 ?? 0}
                                                      onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientLoc1: Number(e.target.value) }
)}
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
                                                        onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientColor2: 'transparent' }
)}
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
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientColor2: e.target.value }
)} 
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
                                                      type="range" 
                                                      min="0" 
                                                      max="100" 
                                                      value={activeElement.config.bgGradientLoc2 ?? 100}
                                                      onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientLoc2: Number(e.target.value) }
)}
                                                      className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                                    />
                                                    <input 
                                                      type="number" 
                                                      value={activeElement.config.bgGradientLoc2 ?? 100}
                                                      onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientLoc2: Number(e.target.value) }
)}
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
                                                      onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientType: e.target.value }
)}
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
                                                        type="range" 
                                                        min="0" 
                                                        max="360" 
                                                        value={activeElement.config.bgGradientAngle ?? 180}
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientAngle: Number(e.target.value) }
)}
                                                        className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                                      />
                                                      <input 
                                                        type="number" 
                                                        value={activeElement.config.bgGradientAngle ?? 180}
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientAngle: Number(e.target.value) }
)}
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
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, bgGradientRadialPos: e.target.value }
)}
                                                        className="appearance-none w-[140px] bg-[#1e1f23] border border-zinc-700 text-zinc-300 text-xs font-medium rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:border-zinc-500"
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
                                                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            </>) : (<>
                                              {/* Sorotan: Warna BG Hover */}
                                              <div className="flex items-center justify-between py-1">
                                                <span className="text-xs text-zinc-300 font-medium">Warna Latar</span>
                                                <div className="flex border border-zinc-700 rounded overflow-hidden">
                                                  {activeElement.config.hoverBgColor && activeElement.config.hoverBgColor !== 'transparent' && (
                                                    <button type="button" onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverBgColor: 'transparent' }
)} className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors" title="Reset">
                                                      <RotateCcw className="w-3.5 h-3.5" />
                                                    </button>
                                                  )}
                                                  <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                    <input type="color" value={activeElement.config.hoverBgColor && activeElement.config.hoverBgColor !== 'transparent' ? activeElement.config.hoverBgColor : '#ffffff'} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverBgColor: e.target.value }
)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                    {(!activeElement.config.hoverBgColor || activeElement.config.hoverBgColor === 'transparent') ? (
                                                      <div className="absolute inset-0 flex items-center justify-center"><div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center" /></div>
                                                    ) : (
                                                      <div className="absolute inset-0" style={{ backgroundColor: activeElement.config.hoverBgColor }} />
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                              {/* Durasi Transisi */}
                                              <div className="space-y-2 pt-1">
                                                <span className="text-xs text-zinc-300 font-semibold">Durasi Transisi (s)</span>
                                                <div className="flex items-center gap-3">
                                                  <input type="range" min="0" max="3" step="0.1" value={activeElement.config.hoverTransitionDuration ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverTransitionDuration: Number(e.target.value) }
)} className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" />
                                                  <input type="number" min="0" max="3" step="0.1" value={activeElement.config.hoverTransitionDuration ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverTransitionDuration: Math.max(0, Math.min(3, Number(e.target.value))) }
)} className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" />
                                                </div>
                                              </div>
                                            </>)}
      
                                          </div>
                                        )}
                                      </div>
      
                                      {/* Accordion: Batas & Bayangan */}
                                      <div className="space-y-3 mt-4">
                                        <button
                                          type="button"
                                          onClick={() => setEditorCollapse(prev => ({ ...prev, batasBayanganSection: !prev.batasBayanganSection }))}
                                          className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
                                        >
                                          {(editorCollapse.batasBayanganSection ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span>Batas & Bayangan</span>
                                        </button>
      
                                        {(editorCollapse.batasBayanganSection ?? true) && (
                                          <div className="space-y-4 animate-in fade-in duration-200">
                                            {/* Tabs Normal / Sorotan */}
                                            <div className="flex bg-[#2c2d32] rounded-md p-0.5 border border-zinc-800">
                                              <button 
                                                type="button"
                                                onClick={() => setBtnStyleMode('normal')}
                                                className={`flex-1 text-center py-1.5 text-xs font-semibold transition-colors rounded ${btnStyleMode === 'normal' ? 'text-white bg-[#42444b] shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                                              >
                                                Normal
                                              </button>
                                              <button 
                                                type="button"
                                                onClick={() => setBtnStyleMode('hover')}
                                                className={`flex-1 text-center py-1.5 text-xs font-semibold transition-colors rounded ${btnStyleMode === 'hover' ? 'text-white bg-[#42444b] shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                                              >
                                                Sorotan
                                              </button>
                                            </div>
      
                                            {btnStyleMode === 'normal' ? (<>
                                            {/* Border Type */}
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs text-zinc-300 font-semibold">Border Type</span>
                                              <select
                                                value={activeElement.config.borderType || 'Asali'}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, borderType: val }
);
                                                }}
                                                className="px-2 py-1 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none cursor-pointer font-medium focus:border-zinc-700 min-w-[120px]"
                                              >
                                                <option value="Asali">Asali</option>
                                                <option value="solid">Solid</option>
                                                <option value="double">Double</option>
                                                <option value="dotted">Dotted</option>
                                                <option value="dashed">Dotted</option>
                                                <option value="groove">Groove</option>
                                                <option value="ridge">Ridge</option>
                                                <option value="none">None</option>
                                              </select>
                                            </div>
      
                                            {/* Lebar Batas & Warna Batas - muncul saat border type aktif */}
                                            {activeElement.config.borderType && activeElement.config.borderType !== 'Asali' && activeElement.config.borderType !== 'none' && (
                                              <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {/* Lebar Batas */}
                                                <div className="space-y-1.5 pt-2">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                      <span className="text-xs text-zinc-300 font-semibold">Lebar Batas</span>
                                                      <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none cursor-pointer">px ▾</div>
                                                  </div>
      
                                                  <div className="flex gap-1 items-start mt-1">
                                                    <div className="flex-1 flex flex-col">
                                                      <div className="flex rounded-[4px] border border-zinc-800 bg-[#141417] divide-x divide-zinc-800 overflow-hidden h-8">
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
                                                                if (activeElement.config.borderWidthLinked ?? true) {
                                                                  handleUpdateElement(
  editingSection.id,
  activeElement.id,
  {
                                                                    ...activeElement.config, borderWidth: numVal,
                                                                    borderWidthTop: numVal,
                                                                    borderWidthRight: numVal,
                                                                    borderWidthBottom: numVal,
                                                                    borderWidthLeft: numVal
                                                                  }
);
                                                                } else {
                                                                  handleUpdateElement(
  editingSection.id,
  activeElement.id,
  {
                                                                    ...activeElement.config, [side.key]: numVal
                                                                  }
);
                                                                }
                                                              }}
                                                              className="flex-1 min-w-0 w-full text-center bg-transparent border-0 outline-none text-xs text-zinc-100 font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/10"
                                                            />
                                                          );
                                                        })}
                                                      </div>
      
                                                      <div className="flex pr-9 text-center text-[9px] text-zinc-500 font-bold select-none mt-1">
                                                        <span className="flex-1">Atas</span>
                                                        <span className="flex-1">Kanan</span>
                                                        <span className="flex-1">Bawah</span>
                                                        <span className="flex-1">Kiri</span>
                                                      </div>
                                                    </div>
      
                                                    {/* Link Button */}
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        const isLinked = !(activeElement.config.borderWidthLinked ?? true);
                                                        const updates: any = { borderWidthLinked: isLinked };
                                                        if (isLinked) {
                                                          const topVal = activeElement.config.borderWidthTop ?? activeElement.config.borderWidth ?? 1;
                                                          updates.borderWidth = topVal;
                                                          updates.borderWidthTop = topVal;
                                                          updates.borderWidthRight = topVal;
                                                          updates.borderWidthBottom = topVal;
                                                          updates.borderWidthLeft = topVal;
                                                        }
                                                        handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, ...updates }
);
                                                      }}
                                                      className={`h-8 w-8 rounded-[4px] shrink-0 flex items-center justify-center transition-all ${
                                                        (activeElement.config.borderWidthLinked ?? true)
                                                        ? 'bg-[#3b3d42] text-white border border-[#4a4c52]'
                                                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800'
                                                      }`}
                                                      title={(activeElement.config.borderWidthLinked ?? true) ? "Putuskan tautan lebar" : "Tautkan semua sisi"}
                                                    >
                                                      <LinkIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                  </div>
                                                </div>
      
                                                {/* Warna Batas */}
                                                <div className="flex items-center justify-between pt-1">
                                                  <span className="text-xs text-zinc-300 font-semibold">Warna Batas</span>
                                                  <div className="flex items-center border border-zinc-700 rounded overflow-hidden shadow-sm bg-zinc-900">
                                                    {((btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor) && (btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor) !== 'transparent') && (
                                                      <button 
                                                        type="button" 
                                                        onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, [btnStyleMode === 'hover' ? 'hoverBorderColor' : 'borderColor']: 'transparent' }
)}
                                                        className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                        title="Reset Warna"
                                                      >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                      </button>
                                                    )}
                                                    <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                      <input 
                                                        type="color" 
                                                        value={((btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor) && (btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor) !== 'transparent') ? (btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor) : '#000000'} 
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, [btnStyleMode === 'hover' ? 'hoverBorderColor' : 'borderColor']: e.target.value }
)} 
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                      />
                                                      {(!(btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor) || (btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor) === 'transparent') ? (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                          <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                        </div>
                                                      ) : (
                                                        <div className="absolute inset-0" style={{ backgroundColor: btnStyleMode === 'hover' ? activeElement.config.hoverBorderColor : activeElement.config.borderColor }}></div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
      
                                            {/* Radius Batas */}
                                            <div className="space-y-1.5 py-1.5">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                                                  <span>Radius Batas</span>
                                                </div>
                                                
                                                {/* Unit Dropdown for Radius Batas */}
                                                <div className="relative">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      if (activeDropdown?.field === 'secBorderRadius') {
                                                        setActiveDropdown(null);
                                                      } else {
                                                        setActiveDropdown({ field: 'secBorderRadius', elementId: editingSection.id });
                                                      }
                                                    }}
                                                    className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-white font-black bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 transition-all select-none cursor-pointer"
                                                  >
                                                    <span>{parseUnitAndValue(activeElement.config.borderRadiusTop ?? activeElement.config.borderRadius ?? 0).unit === 'custom' ? '✏️ Custom' : parseUnitAndValue(activeElement.config.borderRadiusTop ?? activeElement.config.borderRadius ?? 0).unit}</span>
                                                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                                                  </button>
      
                                                  {activeDropdown?.field === 'secBorderRadius' && activeDropdown?.elementId === editingSection.id && (
                                                    <div className="absolute right-0 mt-1 w-24 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden py-1 z-[1000] animate-in fade-in slide-in-from-top-1 duration-150">
                                                      {(['px', 'vw', '%'] as const).map((u) => (
                                                        <button
                                                          key={u}
                                                          type="button"
                                                          onClick={() => {
                                                            setActiveDropdown(null);
                                                            const updates: any = { ...activeElement.config };
                                                            ['borderRadiusTop', 'borderRadiusRight', 'borderRadiusBottom', 'borderRadiusLeft'].forEach(k => {
                                                              const oldVal = parseUnitAndValue(activeElement.config[k] ?? activeElement.config.borderRadius ?? 0).val;
                                                              updates[k] = u === 'px' ? oldVal : `${oldVal}${u}`;
                                                            });
                                                            updateLocalSection({ ...editingSection, config: updates });
                                                          }}
                                                          className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-between ${parseUnitAndValue(activeElement.config.borderRadiusTop ?? activeElement.config.borderRadius ?? 0).unit === u ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                        >
                                                          <span>{u}</span>
                                                          {parseUnitAndValue(activeElement.config.borderRadiusTop ?? activeElement.config.borderRadius ?? 0).unit === u && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                                                        </button>
                                                      ))}
                                                      <div className="h-px bg-zinc-800 my-1" />
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setActiveDropdown(null);
                                                          const updates: any = { ...activeElement.config };
                                                          ['borderRadiusTop', 'borderRadiusRight', 'borderRadiusBottom', 'borderRadiusLeft'].forEach(k => {
                                                            updates[k] = parseUnitAndValue(activeElement.config[k] ?? activeElement.config.borderRadius ?? 0).isCustom ? parseUnitAndValue(activeElement.config[k] ?? activeElement.config.borderRadius ?? 0).customStr : '0px';
                                                          });
                                                          updateLocalSection({ ...editingSection, config: updates });
                                                        }}
                                                        className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-between ${parseUnitAndValue(activeElement.config.borderRadiusTop ?? activeElement.config.borderRadius ?? 0).unit === 'custom' ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                                                      >
                                                        <span>✏️ Custom</span>
                                                        {parseUnitAndValue(activeElement.config.borderRadiusTop ?? activeElement.config.borderRadius ?? 0).unit === 'custom' && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                                                      </button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                              
                                              <div className="flex gap-1 items-start mt-1">
                                                <div className="flex-1 flex flex-col">
                                                  <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                                    {[
                                                      { k: 'borderRadiusTop', isLast: false },
                                                      { k: 'borderRadiusRight', isLast: false },
                                                      { k: 'borderRadiusBottom', isLast: false },
                                                      { k: 'borderRadiusLeft', isLast: true }
                                                    ].map((m) => (
                                                      <input
                                                        key={m.k}
                                                        type={parseUnitAndValue(activeElement.config[m.k] ?? activeElement.config.borderRadius ?? 0).isCustom ? "text" : "number"}
                                                        value={parseUnitAndValue(activeElement.config[m.k] ?? activeElement.config.borderRadius ?? 0).isCustom 
                                                          ? parseUnitAndValue(activeElement.config[m.k] ?? activeElement.config.borderRadius ?? 0).customStr
                                                          : parseUnitAndValue(activeElement.config[m.k] ?? activeElement.config.borderRadius ?? 0).val}
                                                        onChange={(e) => {
                                                          const isCustom = parseUnitAndValue(activeElement.config[m.k] ?? activeElement.config.borderRadius ?? 0).isCustom;
                                                          const unit = parseUnitAndValue(activeElement.config[m.k] ?? activeElement.config.borderRadius ?? 0).unit;
                                                          const rawVal = e.target.value;
                                                          let finalVal: any;
                                                          
                                                          if (isCustom) {
                                                            finalVal = rawVal;
                                                          } else {
                                                            const numVal = Number(rawVal);
                                                            finalVal = unit === 'px' ? numVal : `${numVal}${unit}`;
                                                          }
      
                                                          const updates: any = { [m.k]: finalVal };
                                                          if (activeElement.config.borderRadiusLinked ?? true) {
                                                            updates.borderRadiusTop = finalVal;
                                                            updates.borderRadiusRight = finalVal;
                                                            updates.borderRadiusBottom = finalVal;
                                                            updates.borderRadiusLeft = finalVal;
                                                            updates.borderRadius = finalVal;
                                                          }
                                                          handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, ...updates }
);
                                                        }}
                                                        placeholder="-"
                                                        className={`w-full h-full text-center text-xs font-bold bg-transparent text-zinc-100 outline-none ${!m.isLast ? 'border-r border-zinc-800' : ''} ${parseUnitAndValue(activeElement.config[m.k] ?? activeElement.config.borderRadius ?? 0).isCustom ? 'px-1' : ''}`}
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
                                                  onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, borderRadiusLinked: !(activeElement.config.borderRadiusLinked ?? true) }
)}
                                                  className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${(activeElement.config.borderRadiusLinked ?? true)
                                                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                                    : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                                    }`}
                                                >
                                                  <LinkIcon className="w-3.5 h-3.5" />
                                                </button>
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
                                                        handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, boxShadowType: 'none', boxShadow: 'none' }
);
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
                                                      setActivePopover(activePopover === 'sectionBoxShadow' ? null : 'sectionBoxShadow');
                                                    }}
                                                    className={`p-1 rounded transition-colors ${activePopover === 'sectionBoxShadow' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                  >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </div>
      
                                              {/* Popover Box Shadow */}
                                              {activePopover === 'sectionBoxShadow' && (
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
                                                          handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, boxShadowType: 'none', boxShadow: 'none' }
);
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
                                                          handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowColor: e.target.value, boxShadowType: 'custom' }
);
                                                        }}
                                                        className="w-10 h-7 rounded bg-zinc-950 border border-zinc-855 cursor-pointer p-0.5"
                                                      />
                                                      <input
                                                        type="text"
                                                        value={activeElement.config.shadowColor || 'rgba(0,0,0,0.5)'}
                                                        onChange={(e) => {
                                                          handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowColor: e.target.value, boxShadowType: 'custom' }
);
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
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowOffsetX: Number(e.target.value), boxShadowType: 'custom' }
)}
                                                        className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                      />
                                                      <div className="relative flex items-center justify-end">
                                                        <input
                                                          type="number"
                                                          min="-50"
                                                          max="50"
                                                          value={activeElement.config.shadowOffsetX !== undefined ? activeElement.config.shadowOffsetX : 0}
                                                          onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowOffsetX: Math.max(-50, Math.min(50, Number(e.target.value))), boxShadowType: 'custom' }
)}
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
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowOffsetY: Number(e.target.value), boxShadowType: 'custom' }
)}
                                                        className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                      />
                                                      <div className="relative flex items-center justify-end">
                                                        <input
                                                          type="number"
                                                          min="-50"
                                                          max="50"
                                                          value={activeElement.config.shadowOffsetY !== undefined ? activeElement.config.shadowOffsetY : 0}
                                                          onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowOffsetY: Math.max(-50, Math.min(50, Number(e.target.value))), boxShadowType: 'custom' }
)}
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
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowBlur: Number(e.target.value), boxShadowType: 'custom' }
)}
                                                        className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                      />
                                                      <div className="relative flex items-center justify-end">
                                                        <input
                                                          type="number"
                                                          min="0"
                                                          max="100"
                                                          value={activeElement.config.shadowBlur !== undefined ? activeElement.config.shadowBlur : 10}
                                                          onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowBlur: Math.max(0, Math.min(100, Number(e.target.value))), boxShadowType: 'custom' }
)}
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
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowSpread: Number(e.target.value), boxShadowType: 'custom' }
)}
                                                        className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                      />
                                                      <div className="relative flex items-center justify-end">
                                                        <input
                                                          type="number"
                                                          min="-50"
                                                          max="50"
                                                          value={activeElement.config.shadowSpread !== undefined ? activeElement.config.shadowSpread : 0}
                                                          onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, shadowSpread: Math.max(-50, Math.min(50, Number(e.target.value))), boxShadowType: 'custom' }
)}
                                                          className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold"
                                                        />
                                                        <span className="absolute right-1 text-[8px] text-zinc-655 font-bold select-none">px</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            </>) : (<>
                                            {/* ===== SOROTAN (HOVER) CONTENT ===== */}
      
                                            {/* Border Type (Sorotan) */}
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs text-zinc-300 font-semibold">Border Type</span>
                                              <select
                                                value={activeElement.config.hoverBorderType || activeElement.config.borderType || 'Asali'}
                                                onChange={(e) => {
                                                  handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverBorderType: e.target.value }
);
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
      
                                            {/* Lebar Batas & Warna Batas (Sorotan) */}
                                            {(() => { const bt = activeElement.config.hoverBorderType || activeElement.config.borderType; return bt && bt !== 'Asali' && bt !== 'none'; })() && (
                                              <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {/* Lebar Batas (Sorotan) */}
                                                <div className="space-y-1.5 pt-2">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                      <span className="text-xs text-zinc-300 font-semibold">Lebar Batas</span>
                                                      <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none cursor-pointer">px ▾</div>
                                                  </div>
                                                  <div className="flex gap-1 items-start mt-1">
                                                    <div className="flex-1 flex flex-col">
                                                      <div className="flex rounded-[4px] border border-zinc-800 bg-[#141417] divide-x divide-zinc-800 overflow-hidden h-8">
                                                        {[
                                                          { key: 'hoverBorderWidthTop' },
                                                          { key: 'hoverBorderWidthRight' },
                                                          { key: 'hoverBorderWidthBottom' },
                                                          { key: 'hoverBorderWidthLeft' }
                                                        ].map((side) => {
                                                          const val = activeElement.config[side.key] !== undefined
                                                            ? activeElement.config[side.key]
                                                            : (activeElement.config.hoverBorderWidth ?? activeElement.config.borderWidth ?? 1);
                                                          return (
                                                            <input
                                                              key={side.key}
                                                              type="number"
                                                              min="0"
                                                              value={val}
                                                              onChange={(e) => {
                                                                const numVal = Math.max(0, Number(e.target.value));
                                                                if (activeElement.config.hoverBorderWidthLinked ?? true) {
                                                                  handleUpdateElement(
  editingSection.id,
  activeElement.id,
  {
                                                                    ...activeElement.config, hoverBorderWidth: numVal,
                                                                    hoverBorderWidthTop: numVal,
                                                                    hoverBorderWidthRight: numVal,
                                                                    hoverBorderWidthBottom: numVal,
                                                                    hoverBorderWidthLeft: numVal
                                                                  }
);
                                                                } else {
                                                                  handleUpdateElement(
  editingSection.id,
  activeElement.id,
  {
                                                                    ...activeElement.config, [side.key]: numVal
                                                                  }
);
                                                                }
                                                              }}
                                                              className="flex-1 min-w-0 w-full text-center bg-transparent border-0 outline-none text-xs text-zinc-100 font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/10"
                                                            />
                                                          );
                                                        })}
                                                      </div>
                                                      <div className="flex pr-9 text-center text-[9px] text-zinc-500 font-bold select-none mt-1">
                                                        <span className="flex-1">Atas</span>
                                                        <span className="flex-1">Kanan</span>
                                                        <span className="flex-1">Bawah</span>
                                                        <span className="flex-1">Kiri</span>
                                                      </div>
                                                    </div>
                                                    {/* Link Button */}
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        const isLinked = !(activeElement.config.hoverBorderWidthLinked ?? true);
                                                        const updates: any = { hoverBorderWidthLinked: isLinked };
                                                        if (isLinked) {
                                                          const topVal = activeElement.config.hoverBorderWidthTop ?? activeElement.config.hoverBorderWidth ?? activeElement.config.borderWidth ?? 1;
                                                          updates.hoverBorderWidth = topVal;
                                                          updates.hoverBorderWidthTop = topVal;
                                                          updates.hoverBorderWidthRight = topVal;
                                                          updates.hoverBorderWidthBottom = topVal;
                                                          updates.hoverBorderWidthLeft = topVal;
                                                        }
                                                        handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, ...updates }
);
                                                      }}
                                                      className={`h-8 w-8 rounded-[4px] shrink-0 flex items-center justify-center transition-all ${
                                                        (activeElement.config.hoverBorderWidthLinked ?? true)
                                                        ? 'bg-[#3b3d42] text-white border border-[#4a4c52]'
                                                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800'
                                                      }`}
                                                      title={(activeElement.config.hoverBorderWidthLinked ?? true) ? "Putuskan tautan lebar" : "Tautkan semua sisi"}
                                                    >
                                                      <LinkIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                  </div>
                                                </div>
      
                                                {/* Warna Batas (Sorotan) */}
                                                <div className="flex items-center justify-between pt-1">
                                                  <span className="text-xs text-zinc-300 font-semibold">Warna Batas</span>
                                                  <div className="flex items-center border border-zinc-700 rounded overflow-hidden shadow-sm bg-zinc-900">
                                                    {activeElement.config.hoverBorderColor && activeElement.config.hoverBorderColor !== 'transparent' && (
                                                      <button 
                                                        type="button" 
                                                        onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverBorderColor: 'transparent' }
)}
                                                        className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                        title="Reset Warna"
                                                      >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                      </button>
                                                    )}
                                                    <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                      <input 
                                                        type="color" 
                                                        value={activeElement.config.hoverBorderColor && activeElement.config.hoverBorderColor !== 'transparent' ? activeElement.config.hoverBorderColor : '#000000'} 
                                                        onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverBorderColor: e.target.value }
)} 
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                      />
                                                      {(!activeElement.config.hoverBorderColor || activeElement.config.hoverBorderColor === 'transparent') ? (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                          <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                        </div>
                                                      ) : (
                                                        <div className="absolute inset-0" style={{ backgroundColor: activeElement.config.hoverBorderColor }}></div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
      
                                            {/* Radius Batas (Sorotan) */}
                                            <div className="space-y-1.5 py-1.5">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                                                  <span>Radius Batas</span>
                                                  <Monitor className="w-3 h-3 text-zinc-500" />
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-bold bg-transparent select-none cursor-pointer">px ▾</div>
                                              </div>
                                              <div className="flex gap-1 items-start mt-1">
                                                <div className="flex-1 flex flex-col">
                                                  <div className="bg-zinc-950 rounded border border-zinc-800 flex items-center overflow-hidden h-8">
                                                    {[
                                                      { k: 'hoverBorderRadiusTop', isLast: false },
                                                      { k: 'hoverBorderRadiusRight', isLast: false },
                                                      { k: 'hoverBorderRadiusBottom', isLast: false },
                                                      { k: 'hoverBorderRadiusLeft', isLast: true }
                                                    ].map((m) => (
                                                      <input
                                                        key={m.k}
                                                        type="number"
                                                        min="0"
                                                        value={activeElement.config[m.k] !== undefined ? activeElement.config[m.k] : (activeElement.config.hoverBorderRadius ?? activeElement.config.borderRadius ?? 0)}
                                                        onChange={(e) => {
                                                          const numVal = Number(e.target.value);
                                                          if (activeElement.config.hoverBorderRadiusLinked ?? true) {
                                                            handleUpdateElement(
  editingSection.id,
  activeElement.id,
  {
                                                              ...activeElement.config, hoverBorderRadius: numVal,
                                                              hoverBorderRadiusTop: numVal,
                                                              hoverBorderRadiusRight: numVal,
                                                              hoverBorderRadiusBottom: numVal,
                                                              hoverBorderRadiusLeft: numVal
                                                            }
);
                                                          } else {
                                                            handleUpdateElement(
  editingSection.id,
  activeElement.id,
  {
                                                              ...activeElement.config, [m.k]: numVal
                                                            }
);
                                                          }
                                                        }}
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
                                                  onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverBorderRadiusLinked: !(activeElement.config.hoverBorderRadiusLinked ?? true) }
)}
                                                  className={`h-8 w-8 rounded border transition-all flex items-center justify-center ${(activeElement.config.hoverBorderRadiusLinked ?? true)
                                                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                                                    : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-900'
                                                    }`}
                                                >
                                                  <LinkIcon className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>
      
                                            {/* Box Shadow (Sorotan) */}
                                            <div className="relative space-y-2">
                                              <div className="flex items-center justify-between">
                                                <span className="text-xs text-zinc-300 font-semibold">Box Shadow</span>
                                                <div className="flex items-center gap-1.5">
                                                  {activeElement.config.hoverBoxShadowType === 'custom' && (
                                                    <button
                                                      type="button"
                                                      onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverBoxShadowType: 'none', hoverBoxShadow: 'none' }
)}
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
                                                      setActivePopover(activePopover === 'sectionBoxShadowHover' ? null : 'sectionBoxShadowHover');
                                                    }}
                                                    className={`p-1 rounded transition-colors ${activePopover === 'sectionBoxShadowHover' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                  >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </div>
      
                                              {/* Popover Box Shadow (Sorotan) */}
                                              {activePopover === 'sectionBoxShadowHover' && (
                                                <div 
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="absolute right-0 top-full mt-2 w-64 bg-[#141417] border border-zinc-800 rounded-xl p-4 shadow-2xl z-50 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200 after:content-[''] after:absolute after:bottom-full after:right-4 after:border-8 after:border-transparent after:border-b-[#141417] before:content-[''] before:absolute before:bottom-full before:right-[15px] before:border-[9px] before:border-transparent before:border-b-zinc-800/80 before:-z-10"
                                                >
                                                  {/* Header Popover */}
                                                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                                                    <span className="text-xs font-bold text-zinc-300">Box Shadow (Sorotan)</span>
                                                    <div className="flex items-center gap-1.5">
                                                      <button type="button" onClick={() => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverBoxShadowType: 'none', hoverBoxShadow: 'none' }
)} className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors">
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                      </button>
                                                      <button type="button" onClick={() => setActivePopover(null)} className="p-1 rounded bg-zinc-800 text-zinc-100 transition-colors">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                      </button>
                                                    </div>
                                                  </div>
      
                                                  {/* Shadow Color */}
                                                  <div className="space-y-1.5">
                                                    <span className="text-[10px] font-bold uppercase text-zinc-500">Warna</span>
                                                    <div className="flex gap-2">
                                                      <input type="color" value={activeElement.config.hoverShadowColor ? (activeElement.config.hoverShadowColor.startsWith('rgba') ? '#000000' : activeElement.config.hoverShadowColor) : '#000000'} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowColor: e.target.value, hoverBoxShadowType: 'custom' }
)} className="w-10 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5" />
                                                      <input type="text" value={activeElement.config.hoverShadowColor || 'rgba(0,0,0,0.5)'} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowColor: e.target.value, hoverBoxShadowType: 'custom' }
)} placeholder="rgba(0,0,0,0.5)" className="flex-1 px-2 h-7 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold" />
                                                    </div>
                                                  </div>
      
                                                  {/* Offset X */}
                                                  <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase text-zinc-500">Mendatar</span>
                                                    <div className="flex items-center gap-2">
                                                      <input type="range" min="-50" max="50" value={activeElement.config.hoverShadowOffsetX ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowOffsetX: Number(e.target.value), hoverBoxShadowType: 'custom' }
)} className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none" />
                                                      <div className="relative flex items-center justify-end">
                                                        <input type="number" min="-50" max="50" value={activeElement.config.hoverShadowOffsetX ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowOffsetX: Math.max(-50, Math.min(50, Number(e.target.value))), hoverBoxShadowType: 'custom' }
)} className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold" />
                                                        <span className="absolute right-1 text-[8px] text-zinc-500 font-bold select-none">px</span>
                                                      </div>
                                                    </div>
                                                  </div>
      
                                                  {/* Offset Y */}
                                                  <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase text-zinc-500">Vertikal</span>
                                                    <div className="flex items-center gap-2">
                                                      <input type="range" min="-50" max="50" value={activeElement.config.hoverShadowOffsetY ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowOffsetY: Number(e.target.value), hoverBoxShadowType: 'custom' }
)} className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none" />
                                                      <div className="relative flex items-center justify-end">
                                                        <input type="number" min="-50" max="50" value={activeElement.config.hoverShadowOffsetY ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowOffsetY: Math.max(-50, Math.min(50, Number(e.target.value))), hoverBoxShadowType: 'custom' }
)} className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold" />
                                                        <span className="absolute right-1 text-[8px] text-zinc-500 font-bold select-none">px</span>
                                                      </div>
                                                    </div>
                                                  </div>
      
                                                  {/* Blur */}
                                                  <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase text-zinc-500">Buram</span>
                                                    <div className="flex items-center gap-2">
                                                      <input type="range" min="0" max="100" value={activeElement.config.hoverShadowBlur ?? 10} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowBlur: Number(e.target.value), hoverBoxShadowType: 'custom' }
)} className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none" />
                                                      <div className="relative flex items-center justify-end">
                                                        <input type="number" min="0" max="100" value={activeElement.config.hoverShadowBlur ?? 10} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowBlur: Math.max(0, Math.min(100, Number(e.target.value))), hoverBoxShadowType: 'custom' }
)} className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold" />
                                                        <span className="absolute right-1 text-[8px] text-zinc-500 font-bold select-none">px</span>
                                                      </div>
                                                    </div>
                                                  </div>
      
                                                  {/* Spread */}
                                                  <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase text-zinc-500">Menyebar</span>
                                                    <div className="flex items-center gap-2">
                                                      <input type="range" min="-50" max="50" value={activeElement.config.hoverShadowSpread ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowSpread: Number(e.target.value), hoverBoxShadowType: 'custom' }
)} className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none" />
                                                      <div className="relative flex items-center justify-end">
                                                        <input type="number" min="-50" max="50" value={activeElement.config.hoverShadowSpread ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverShadowSpread: Math.max(-50, Math.min(50, Number(e.target.value))), hoverBoxShadowType: 'custom' }
)} className="w-12 h-6 pr-4 text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-zinc-700 outline-none text-right rounded font-bold" />
                                                        <span className="absolute right-1 text-[8px] text-zinc-500 font-bold select-none">px</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
      
                                            {/* Durasi Transisi */}
                                            <div className="space-y-2 pt-1">
                                              <span className="text-xs text-zinc-300 font-semibold">Durasi Transisi (s)</span>
                                              <div className="flex items-center gap-3">
                                                <input type="range" min="0" max="3" step="0.1" value={activeElement.config.hoverTransitionDuration ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverTransitionDuration: Number(e.target.value) }
)} className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" />
                                                <input type="number" min="0" max="3" step="0.1" value={activeElement.config.hoverTransitionDuration ?? 0} onChange={(e) => handleUpdateElement(
  editingSection.id,
  activeElement.id,
  { ...activeElement.config, hoverTransitionDuration: Math.max(0, Math.min(3, Number(e.target.value))) }
)} className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" />
                                              </div>
                                            </div>
                                            </>)}
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
                                    {Object.entries(ELEMENT_TYPE_MAP).map(([type, metaAny]) => {
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
    </>
  );
}

