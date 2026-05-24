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

export function StyleTabEditor({ props, activeElement }: { props: EditorPanelProps, activeElement: any }) {
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
    contextMenu, setContextMenu, activePopover, setActivePopover, btnBorderRadiusLink, setBtnBorderRadiusLink
  } = state;

  return (
    <>
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
                                                value={String(activeElement.config.fontSize || '16px').replace(/[0-9.]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseInt(String(activeElement.config.fontSize || '16')) || 16;
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
                                                value={parseInt(String(activeElement.config.fontSize || '16')) || 16}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.fontSize || '16px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={parseInt(String(activeElement.config.fontSize || '16')) || 16}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.fontSize || '16px').replace(/[0-9.]/g, '') || 'px';
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
                                             {activeElement.config.hoverLinkColor && activeElement.config.hoverLinkColor !== 'transparent' && (
                                               <button
                                                 type="button"
                                                 onClick={() => {
                                                   console.log(`[Editor TEXT] Hover Link Color direset`);
                                                   handleUpdateElement(editingSection.id, activeElement.id, { hoverLinkColor: '' });
                                                 }}
                                                 className="h-full px-2 border-r border-zinc-800 flex items-center justify-center hover:bg-zinc-900 transition-colors"
                                                 title="Reset Warna"
                                               >
                                                 <RotateCcw className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                                               </button>
                                             )}
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
                                                value={String(activeElement.config.fontSize || '16px').replace(/[0-9.]/g, '') || 'px'}
                                                onChange={(e) => {
                                                  const num = parseInt(String(activeElement.config.fontSize || '16')) || 16;
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
                                                value={parseInt(String(activeElement.config.fontSize || '16')) || 16}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.fontSize || '16px').replace(/[0-9.]/g, '') || 'px';
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: `${e.target.value}${unit}` });
                                                }}
                                                className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                              <input
                                                type="number"
                                                value={parseInt(String(activeElement.config.fontSize || '16')) || 16}
                                                onChange={(e) => {
                                                  const unit = String(activeElement.config.fontSize || '16px').replace(/[0-9.]/g, '') || 'px';
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
                                {activeElement.type === 'BUTTON' && (
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
                                                console.log("[Editor BUTTON] Posisi diubah ke:", item.a);
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
                                                       lineHeightUnit: 'px',
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
                                                   value={activeElement.config.fontSize ?? 16}
                                                   onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontSize: Number(e.target.value) })}
                                                   className="flex-1 accent-zinc-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                                 />
                                                 <input
                                                   type="number"
                                                   min="8"
                                                   max="100"
                                                   value={activeElement.config.fontSize ?? 16}
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
                                                   value={activeElement.config.lineHeightUnit || 'px'}
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
                                        <span className="text-xs text-zinc-300 font-semibold">Warna</span>
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

                                    {/* Warna Batas */}
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-zinc-300 font-semibold">Warna Batas</span>
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
                                {activeElement.type !== 'IMAGE' && activeElement.type !== 'HEADING' && activeElement.type !== 'BUTTON' && activeElement.type !== 'TEXT' && activeElement.type !== 'GALLERY' && (
                                  <div className="space-y-3">
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                                        <Palette className="w-3.5 h-3.5 text-zinc-400" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Desain & Warna</span>
                                      </div>

                                      {/* Warna Latar */}
                                      <div className="space-y-1.5">
                                        <span className="text-[8px] font-bold uppercase text-zinc-500">Warna Latar Belakang</span>
                                        <div className="flex gap-2">
                                          <input
                                            type="color"
                                            value={activeElement.config.bgColor || '#transparent'}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value })}
                                            className="w-10 h-8 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                          />
                                          <input
                                            type="text"
                                            value={activeElement.config.bgColor || ''}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value })}
                                            placeholder="e.g. #ffffff, transparent"
                                            className="flex-1 px-2.5 h-8 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                          />
                                        </div>
                                      </div>

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

                                    <div className="space-y-4 border-t border-zinc-800/80 pt-8 !mt-8">
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
                                    <div className="space-y-3.5 border-t border-zinc-800/80 pt-8 !mt-8">
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

                                {activeElement.type === 'CATEGORY_LIST' && (
                                  <div className="space-y-4 border-t border-zinc-800/80 pt-8 !mt-8 animate-in fade-in duration-200">
                                    {/* 1. Gambar Ikon */}
                                    <div className="space-y-4">
                                      <div
                                        onClick={() => {
                                          const val = !(editorCollapse.kategoriGambar ?? true);
                                          console.log(`[Editor Collapse CATEGORY_LIST] Toggle kategoriGambar ke: ${val}`);
                                          setEditorCollapse(prev => ({ ...prev, kategoriGambar: val }));
                                        }}
                                        className="flex items-center justify-between border-b border-zinc-800 pb-2 cursor-pointer select-none"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          {(editorCollapse.kategoriGambar ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Gambar Ikon</span>
                                        </div>
                                      </div>

                                      {(editorCollapse.kategoriGambar ?? true) && (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                          <div className="space-y-3.5">
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Radius Batas (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.imageBorderRadius !== undefined ? activeElement.config.imageBorderRadius : 100)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={activeElement.config.imageBorderRadius !== undefined ? activeElement.config.imageBorderRadius : 100}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor CATEGORY_LIST] Mengubah imageBorderRadius ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { imageBorderRadius: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* 2. Teks Nama */}
                                    <div className="space-y-4 border-t border-zinc-800/80 pt-8 !mt-8">
                                      <div
                                        onClick={() => {
                                          const val = !(editorCollapse.kategoriTeks ?? true);
                                          console.log(`[Editor Collapse CATEGORY_LIST] Toggle kategoriTeks ke: ${val}`);
                                          setEditorCollapse(prev => ({ ...prev, kategoriTeks: val }));
                                        }}
                                        className="flex items-center justify-between border-b border-zinc-800 pb-2 cursor-pointer select-none"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          {(editorCollapse.kategoriTeks ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Teks Nama</span>
                                        </div>
                                      </div>

                                      {(editorCollapse.kategoriTeks ?? true) && (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                          <div className="space-y-3.5">
                                            {/* Warna Teks */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Warna Teks</span>
                                              <div className="flex gap-2 items-center">
                                                <input
                                                  type="color"
                                                  value={activeElement.config.textColor || '#18181B'}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor CATEGORY_LIST] Mengubah textColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { textColor: val });
                                                  }}
                                                  className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                                />
                                                <input
                                                  type="text"
                                                  value={activeElement.config.textColor || ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor CATEGORY_LIST] Mengubah textColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { textColor: val });
                                                  }}
                                                  placeholder="#18181B"
                                                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log(`[Editor CATEGORY_LIST] Reset textColor ke default`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { textColor: undefined });
                                                  }}
                                                  className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Ukuran Font */}
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Ukuran Teks (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.fontSize !== undefined ? activeElement.config.fontSize : 14)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="8"
                                                max="24"
                                                value={activeElement.config.fontSize !== undefined ? activeElement.config.fontSize : 14}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor CATEGORY_LIST] Mengubah fontSize ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { fontSize: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {activeElement.type === 'PRODUCT_LIST' && (
                                  <div className="space-y-4 border-t border-zinc-800/80 pt-8 !mt-8 animate-in fade-in duration-200">
                                    {/* 1. Kartu Wadah */}
                                    <div className="space-y-4">
                                      <div
                                        onClick={() => {
                                          const val = !(editorCollapse.produkKartu ?? true);
                                          console.log(`[Editor Collapse PRODUCT_LIST] Toggle produkKartu ke: ${val}`);
                                          setEditorCollapse(prev => ({ ...prev, produkKartu: val }));
                                        }}
                                        className="flex items-center justify-between border-b border-zinc-800 pb-2 cursor-pointer select-none"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          {(editorCollapse.produkKartu ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Kartu Wadah</span>
                                        </div>
                                      </div>

                                      {(editorCollapse.produkKartu ?? true) && (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                          <div className="space-y-3.5">
                                            {/* Warna Latar Kartu */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Warna Latar Kartu</span>
                                              <div className="flex gap-2 items-center">
                                                <input
                                                  type="color"
                                                  value={activeElement.config.cardBgColor || '#FFFFFF'}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah cardBgColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { cardBgColor: val });
                                                  }}
                                                  className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                                />
                                                <input
                                                  type="text"
                                                  value={activeElement.config.cardBgColor || ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah cardBgColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { cardBgColor: val });
                                                  }}
                                                  placeholder="#FFFFFF"
                                                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log(`[Editor PRODUCT_LIST] Reset cardBgColor ke default`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { cardBgColor: undefined });
                                                  }}
                                                  className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Radius Sudut Kartu */}
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Radius Sudut Kartu (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.cardBorderRadius !== undefined ? activeElement.config.cardBorderRadius : 8)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={activeElement.config.cardBorderRadius !== undefined ? activeElement.config.cardBorderRadius : 8}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah cardBorderRadius ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { cardBorderRadius: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>

                                            {/* Warna Border Kartu */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Warna Border Kartu</span>
                                              <div className="flex gap-2 items-center">
                                                <input
                                                  type="color"
                                                  value={activeElement.config.cardBorderColor || '#E4E4E7'}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah cardBorderColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { cardBorderColor: val });
                                                  }}
                                                  className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                                />
                                                <input
                                                  type="text"
                                                  value={activeElement.config.cardBorderColor || ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah cardBorderColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { cardBorderColor: val });
                                                  }}
                                                  placeholder="#E4E4E7"
                                                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log(`[Editor PRODUCT_LIST] Reset cardBorderColor ke default`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { cardBorderColor: undefined });
                                                  }}
                                                  className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Bayangan Kartu */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bayangan Kartu</span>
                                              <select
                                                value={activeElement.config.cardBoxShadow || 'none'}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah cardBoxShadow ke: "${val}"`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { cardBoxShadow: val });
                                                }}
                                                className="w-full p-2 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold text-center cursor-pointer"
                                              >
                                                <option value="none">Tanpa Bayangan (None)</option>
                                                <option value="sm">Halus (Small)</option>
                                                <option value="md">Sedang (Medium)</option>
                                                <option value="lg">Tegas (Large)</option>
                                                <option value="hover-glow">Glow saat Diarahkan (Hover Glow)</option>
                                              </select>
                                            </div>

                                            {/* Padding Kartu */}
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Padding Kartu (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.cardPadding !== undefined ? activeElement.config.cardPadding : 16)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={activeElement.config.cardPadding !== undefined ? activeElement.config.cardPadding : 16}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah cardPadding ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { cardPadding: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* 2. Gambar Produk */}
                                    <div className="space-y-4 border-t border-zinc-800/80 pt-8 !mt-8">
                                      <div
                                        onClick={() => {
                                          const val = !(editorCollapse.produkBambar ?? true);
                                          console.log(`[Editor Collapse PRODUCT_LIST] Toggle produkGambar ke: ${val}`);
                                          setEditorCollapse(prev => ({ ...prev, produkGambar: val }));
                                        }}
                                        className="flex items-center justify-between border-b border-zinc-800 pb-2 cursor-pointer select-none"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          {(editorCollapse.produkBambar ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Gambar Produk</span>
                                        </div>
                                      </div>

                                      {(editorCollapse.produkBambar ?? true) && (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                          <div className="space-y-3.5">
                                            {/* Radius Gambar */}
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Radius Gambar (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.imageBorderRadius !== undefined ? activeElement.config.imageBorderRadius : 4)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={activeElement.config.imageBorderRadius !== undefined ? activeElement.config.imageBorderRadius : 4}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah imageBorderRadius ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { imageBorderRadius: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>

                                            {/* Padding Gambar */}
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Padding Gambar (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.imagePadding !== undefined ? activeElement.config.imagePadding : 0)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={activeElement.config.imagePadding !== undefined ? activeElement.config.imagePadding : 0}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah imagePadding ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { imagePadding: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>

                                            {/* Warna Latar Gambar */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Warna Latar Gambar</span>
                                              <div className="flex gap-2 items-center">
                                                <input
                                                  type="color"
                                                  value={activeElement.config.imageBgColor || '#F4F4F5'}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah imageBgColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { imageBgColor: val });
                                                  }}
                                                  className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                                />
                                                <input
                                                  type="text"
                                                  value={activeElement.config.imageBgColor || ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah imageBgColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { imageBgColor: val });
                                                  }}
                                                  placeholder="#F4F4F5"
                                                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log(`[Editor PRODUCT_LIST] Reset imageBgColor ke default`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { imageBgColor: undefined });
                                                  }}
                                                  className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* 3. Teks Nama Produk */}
                                    <div className="space-y-4 border-t border-zinc-800/80 pt-8 !mt-8">
                                      <div
                                        onClick={() => {
                                          const val = !(editorCollapse.produkNama ?? true);
                                          console.log(`[Editor Collapse PRODUCT_LIST] Toggle produkNama ke: ${val}`);
                                          setEditorCollapse(prev => ({ ...prev, produkNama: val }));
                                        }}
                                        className="flex items-center justify-between border-b border-zinc-800 pb-2 cursor-pointer select-none"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          {(editorCollapse.produkNama ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Teks Nama</span>
                                        </div>
                                      </div>

                                      {(editorCollapse.produkNama ?? true) && (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                          <div className="space-y-3.5">
                                            {/* Warna Nama Produk */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Warna Nama Produk</span>
                                              <div className="flex gap-2 items-center">
                                                <input
                                                  type="color"
                                                  value={activeElement.config.productNameColor || '#18181B'}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah productNameColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { productNameColor: val });
                                                  }}
                                                  className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                                />
                                                <input
                                                  type="text"
                                                  value={activeElement.config.productNameColor || ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah productNameColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { productNameColor: val });
                                                  }}
                                                  placeholder="#18181B"
                                                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log(`[Editor PRODUCT_LIST] Reset productNameColor ke default`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { productNameColor: undefined });
                                                  }}
                                                  className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Ukuran Nama Produk */}
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Ukuran Nama Produk (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.productNameSize !== undefined ? activeElement.config.productNameSize : 14)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="8"
                                                max="24"
                                                value={activeElement.config.productNameSize !== undefined ? activeElement.config.productNameSize : 14}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah productNameSize ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { productNameSize: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>

                                            {/* Ketebalan Nama Produk */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Ketebalan Nama</span>
                                              <select
                                                value={activeElement.config.productNameWeight || 'font-semibold'}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah productNameWeight ke: "${val}"`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { productNameWeight: val });
                                                }}
                                                className="w-full p-2 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold text-center cursor-pointer"
                                              >
                                                <option value="font-normal">Normal</option>
                                                <option value="font-medium">Medium</option>
                                                <option value="font-semibold">Semi Bold</option>
                                                <option value="font-bold">Bold</option>
                                                <option value="font-extrabold">Extra Bold</option>
                                              </select>
                                            </div>

                                            {/* Perataan Nama Produk */}
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs text-zinc-300 font-semibold">Perataan</span>
                                              <div className="flex border border-zinc-800 rounded-md overflow-hidden bg-zinc-950/20">
                                                {['left', 'center', 'right'].map((a) => {
                                                  const isActive = (activeElement.config.productNameAlign || 'left') === a;
                                                  const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : AlignRight;
                                                  return (
                                                    <button
                                                      key={a}
                                                      type="button"
                                                      onClick={() => {
                                                        console.log(`[Editor PRODUCT_LIST] Mengubah productNameAlign ke: "${a}"`);
                                                        handleUpdateElement(editingSection.id, activeElement.id, { productNameAlign: a });
                                                      }}
                                                      className={`p-1.5 transition-colors ${isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
                                                      title={`Align ${a}`}
                                                    >
                                                      <Icon className="w-3.5 h-3.5" />
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* 4. Harga & Stok */}
                                    <div className="space-y-4 border-t border-zinc-800/80 pt-8 !mt-8">
                                      <div
                                        onClick={() => {
                                          const val = !(editorCollapse.produkHargaStok ?? true);
                                          console.log(`[Editor Collapse PRODUCT_LIST] Toggle produkHargaStok ke: ${val}`);
                                          setEditorCollapse(prev => ({ ...prev, produkHargaStok: val }));
                                        }}
                                        className="flex items-center justify-between border-b border-zinc-800 pb-2 cursor-pointer select-none"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          {(editorCollapse.produkHargaStok ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Harga & Stok</span>
                                        </div>
                                      </div>

                                      {(editorCollapse.produkHargaStok ?? true) && (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                          <div className="space-y-3.5">
                                            {/* Warna Harga Utama */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Warna Harga Utama</span>
                                              <div className="flex gap-2 items-center">
                                                <input
                                                  type="color"
                                                  value={activeElement.config.priceColor || '#18181B'}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah priceColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { priceColor: val });
                                                  }}
                                                  className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                                />
                                                <input
                                                  type="text"
                                                  value={activeElement.config.priceColor || ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah priceColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { priceColor: val });
                                                  }}
                                                  placeholder="#18181B"
                                                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log(`[Editor PRODUCT_LIST] Reset priceColor ke default`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { priceColor: undefined });
                                                  }}
                                                  className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Ukuran Harga Utama */}
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Ukuran Harga Utama (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.priceSize !== undefined ? activeElement.config.priceSize : 14)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="8"
                                                max="24"
                                                value={activeElement.config.priceSize !== undefined ? activeElement.config.priceSize : 14}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah priceSize ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { priceSize: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>

                                            {/* Ketebalan Harga Utama */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Ketebalan Harga</span>
                                              <select
                                                value={activeElement.config.priceWeight || 'font-bold'}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah priceWeight ke: "${val}"`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { priceWeight: val });
                                                }}
                                                className="w-full p-2 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold text-center cursor-pointer"
                                              >
                                                <option value="font-normal">Normal</option>
                                                <option value="font-medium">Medium</option>
                                                <option value="font-semibold">Semi Bold</option>
                                                <option value="font-bold">Bold</option>
                                              </select>
                                            </div>

                                            {/* Warna Harga Coret (Diskon) */}
                                            <div className="flex flex-col gap-1.5">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Warna Harga Coret</span>
                                              <div className="flex gap-2 items-center">
                                                <input
                                                  type="color"
                                                  value={activeElement.config.discountPriceColor || '#71717A'}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah discountPriceColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { discountPriceColor: val });
                                                  }}
                                                  className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                                />
                                                <input
                                                  type="text"
                                                  value={activeElement.config.discountPriceColor || ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah discountPriceColor ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { discountPriceColor: val });
                                                  }}
                                                  placeholder="#71717A"
                                                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    console.log(`[Editor PRODUCT_LIST] Reset discountPriceColor ke default`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { discountPriceColor: undefined });
                                                  }}
                                                  className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Ukuran Harga Coret */}
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                <span>Ukuran Harga Coret (px)</span>
                                                <span className="text-zinc-100 font-bold">{(activeElement.config.discountPriceSize !== undefined ? activeElement.config.discountPriceSize : 12)}px</span>
                                              </div>
                                              <input
                                                type="range"
                                                min="8"
                                                max="24"
                                                value={activeElement.config.discountPriceSize !== undefined ? activeElement.config.discountPriceSize : 12}
                                                onChange={(e) => {
                                                  const val = Number(e.target.value);
                                                  console.log(`[Editor PRODUCT_LIST] Mengubah discountPriceSize ke: ${val}`);
                                                  handleUpdateElement(editingSection.id, activeElement.id, { discountPriceSize: val });
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                              />
                                            </div>

                                            {/* Toggle Tampilkan Stok */}
                                            <div className="flex justify-between items-center py-1">
                                              <span className="text-xs text-zinc-300 font-semibold">Tampilkan Stok</span>
                                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                                <input
                                                  type="checkbox"
                                                  checked={activeElement.config.showStock !== undefined ? activeElement.config.showStock : true}
                                                  onChange={(e) => {
                                                    const val = e.target.checked;
                                                    console.log(`[Editor PRODUCT_LIST] Mengubah showStock ke: ${val}`);
                                                    handleUpdateElement(editingSection.id, activeElement.id, { showStock: val });
                                                  }}
                                                  className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                                              </label>
                                            </div>

                                            {/* Pengaturan Label Stok jika showStock true */}
                                            {(activeElement.config.showStock !== undefined ? activeElement.config.showStock : true) && (
                                              <div className="space-y-3.5 pt-2 border-t border-zinc-800/40 animate-in fade-in duration-200">
                                                {/* Warna Stok */}
                                                <div className="flex flex-col gap-1.5">
                                                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Warna Label Stok</span>
                                                  <div className="flex gap-2 items-center">
                                                    <input
                                                      type="color"
                                                      value={activeElement.config.stockColor || '#22C55E'}
                                                      onChange={(e) => {
                                                        const val = e.target.value;
                                                        console.log(`[Editor PRODUCT_LIST] Mengubah stockColor ke: ${val}`);
                                                        handleUpdateElement(editingSection.id, activeElement.id, { stockColor: val });
                                                      }}
                                                      className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                                    />
                                                    <input
                                                      type="text"
                                                      value={activeElement.config.stockColor || ''}
                                                      onChange={(e) => {
                                                        const val = e.target.value;
                                                        console.log(`[Editor PRODUCT_LIST] Mengubah stockColor ke: ${val}`);
                                                        handleUpdateElement(editingSection.id, activeElement.id, { stockColor: val });
                                                      }}
                                                      placeholder="#22C55E"
                                                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-semibold"
                                                    />
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        console.log(`[Editor PRODUCT_LIST] Reset stockColor ke default`);
                                                        handleUpdateElement(editingSection.id, activeElement.id, { stockColor: undefined });
                                                      }}
                                                      className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors"
                                                      title="Reset Warna"
                                                    >
                                                      <RotateCcw className="w-3.5 h-3.5" />
                                                    </button>
                                                  </div>
                                                </div>

                                                {/* Ukuran Font Stok */}
                                                <div className="flex flex-col gap-1.5">
                                                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                    <span>Ukuran Label Stok (px)</span>
                                                    <span className="text-zinc-100 font-bold">{(activeElement.config.stockSize !== undefined ? activeElement.config.stockSize : 11)}px</span>
                                                  </div>
                                                  <input
                                                    type="range"
                                                    min="8"
                                                    max="20"
                                                    value={activeElement.config.stockSize !== undefined ? activeElement.config.stockSize : 11}
                                                    onChange={(e) => {
                                                      const val = Number(e.target.value);
                                                      console.log(`[Editor PRODUCT_LIST] Mengubah stockSize ke: ${val}`);
                                                      handleUpdateElement(editingSection.id, activeElement.id, { stockSize: val });
                                                    }}
                                                    className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                                                  />
                                                </div>
                                              </div>
                                            )}
                                          </div>
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

