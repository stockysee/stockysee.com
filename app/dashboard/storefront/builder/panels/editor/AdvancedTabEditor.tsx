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

export function AdvancedTabEditor({ props, activeElement }: { props: EditorPanelProps, activeElement: any }) {
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
      {activeElement.type !== 'COLUMN' && activeElement.type !== 'CATEGORY_LIST' && activeElement.type !== 'PRODUCT_LIST' && activeEditorTab === 'advanced' && (
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
    </>
  );
}
