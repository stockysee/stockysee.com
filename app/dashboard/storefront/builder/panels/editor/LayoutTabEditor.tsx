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

export function LayoutTabEditor({ props, activeElement }: { props: EditorPanelProps, activeElement: any }) {
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
                                        Ukuran Font: {activeElement.config.fontSize ?? 9}px
                                      </span>
                                      <input
                                        type="range"
                                        min="10"
                                        max="80"
                                        value={activeElement.config.fontSize ?? 9}
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
                                {activeElement.config.align !== undefined && activeElement.type !== 'BUTTON' && activeElement.type !== 'IMAGE' && activeElement.type !== 'HEADING' && (
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
                                          value={activeElement.config.iconSpacing ?? 8}
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
                                          value={activeElement.config.iconSpacing ?? 8}
                                          onChange={(e) => {
                                            console.log(`[Editor BUTTON Debug] Input manual spasi ikon diubah ke: ${e.target.value}`);
                                            handleUpdateElement(editingSection.id, activeElement.id, { iconSpacing: Number(e.target.value) });
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
    </>
  );
}

