const fs = require('fs');
const path = require('path');

const topDecl = fs.readFileSync(path.join(__dirname, 'top_declarations.txt'), 'utf8');
const logicContent = fs.readFileSync(path.join(__dirname, 'logic_content.txt'), 'utf8');
const uiContent = fs.readFileSync(path.join(__dirname, 'ui_content.txt'), 'utf8');
const bottomWrapper = fs.readFileSync(path.join(__dirname, 'bottom_wrapper.txt'), 'utf8');
const variablesList = JSON.parse(fs.readFileSync(path.join(__dirname, 'variables_list.json'), 'utf8'));

// Tambahkan variabel destructuring yang tidak terdeteksi oleh regex
const manualVariables = [
  "initialSections",
  "loadingSections",
  "refreshSections",
  "customPage",
  "loadingPage",
  "refreshPage",
  "allCustomPages",
  "client",
  "products",
  "categories",
  "showConfirm",
  "showToast"
];

// Gabungkan semua variabel yang perlu di-return dari hook
const allVariables = Array.from(new Set([...variablesList, ...manualVariables])).sort();

// Ambil deklarasi-deklarasi pembantu dari topDecl yang dibutuhkan di useBuilderState
// Terutama DraggableReorderItem, MoveControls, dan SECTION_STRUCTURE_TEMPLATES
const topDeclLines = topDecl.split('\n');

const startTemplatesIdx = topDeclLines.findIndex(l => l.includes('const SECTION_STRUCTURE_TEMPLATES =') || l.includes('export const SECTION_STRUCTURE_TEMPLATES ='));
const startReorderIdx = topDeclLines.findIndex(l => l.includes('interface DraggableReorderItemProps'));

if (startTemplatesIdx === -1 || startReorderIdx === -1) {
  console.error("Templates or Reorder declaration not found in topDecl!");
  process.exit(1);
}

// Ekstrak SECTION_STRUCTURE_TEMPLATES dari topDecl
let endTemplatesIdx = startTemplatesIdx;
let bracketCount = 0;
let started = false;
for (let i = startTemplatesIdx; i < topDeclLines.length; i++) {
  const line = topDeclLines[i];
  if (line.includes('[')) {
    bracketCount += (line.split('[').length - 1);
    started = true;
  }
  if (line.includes(']')) {
    bracketCount -= (line.split(']').length - 1);
  }
  if (started && bracketCount === 0) {
    endTemplatesIdx = i;
    break;
  }
}
let templatesContent = topDeclLines.slice(startTemplatesIdx, endTemplatesIdx + 1).join('\n');
if (templatesContent.includes('const SECTION_STRUCTURE_TEMPLATES =') && !templatesContent.includes('export const SECTION_STRUCTURE_TEMPLATES =')) {
  templatesContent = templatesContent.replace('const SECTION_STRUCTURE_TEMPLATES =', 'export const SECTION_STRUCTURE_TEMPLATES =');
}

// Ekstrak DraggableReorderItem dan MoveControls sampai sebelum parseUnitAndValue
const startParseUnitIdx = topDeclLines.findIndex(l => l.includes('const parseUnitAndValue ='));
const reorderAndMoveControlsContent = topDeclLines.slice(startReorderIdx, startParseUnitIdx).join('\n');


console.log("Generating useBuilderState.tsx...");
// 1. BUAT useBuilderState.tsx (Menggunakan ekstensi .tsx agar support JSX helper)
const useBuilderStateContent = `// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCacheFetch } from "@/hooks/useCacheFetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useUI } from "@/components/ui/UIProvider";
import { Reorder, useDragControls } from "framer-motion";
import { 
  Plus, Trash2, ChevronRight, Pencil, Type, ChevronUp, ChevronDown 
} from "lucide-react";

// Import types & constants
import { SectionElement, ELEMENT_TYPE_MAP } from "@/components/storefront/sections/BuilderSection";

export interface Section {
  id: string;
  type: string;
  config: any;
  elements?: SectionElement[];
  order: number;
  isActive: boolean;
}

// Tambahkan subcomponents dan templates
${templatesContent}

${reorderAndMoveControlsContent}

// Tambahkan sanitizeSections di sini agar bisa diakses oleh hook
const sanitizeSections = (secs: Section[]): Section[] => {
  console.log("[Builder Debug] Memulai sanitasi data sections. Jumlah input:", secs.length);
  let sorted = [...secs].sort((a, b) => a.order - b.order);
  let headerIdx = sorted.findIndex(s => s.type === 'HEADER');

  let headerSection: Section;
  if (headerIdx === -1) {
    headerSection = {
      id: 'global-header',
      type: 'HEADER',
      config: {
        bgColor: 'rgba(255, 255, 255, 0.9)',
        textColor: '#18181B',
        layout: 'horizontal',
        gap: 16,
        align: 'center',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 40,
        paddingRight: 40
      },
      elements: [],
      order: -1,
      isActive: true
    };
    console.log("[Builder Debug] Header tidak ditemukan, menginjeksi header bawaan baru.");
  } else {
    headerSection = { ...sorted[headerIdx] };
    sorted.splice(headerIdx, 1);
  }

  // Pastikan BRANDING, MENU, CART ada dalam urutan kaku (branding, menu, cart)
  const elements = headerSection.elements || [];
  const branding = elements.find(el => el.type === 'BRANDING') || {
    id: 'h-el-branding',
    type: 'BRANDING',
    config: { fontSize: 16, textColor: '#18181B', align: 'left' },
    order: 0
  };
  const menu = elements.find(el => el.type === 'MENU') || {
    id: 'h-el-menu',
    type: 'MENU',
    config: { fontSize: 13, textColor: '#18181B', align: 'center', fontFamily: 'Inter', hiddenMenus: [] },
    order: 1
  };
  const cart = elements.find(el => el.type === 'CART') || {
    id: 'h-el-cart',
    type: 'CART',
    config: { text: 'Keranjang', bgColor: '#18181B', textColor: '#FFFFFF', borderRadius: 8, align: 'right' },
    order: 2
  };

  // Kunci field order & id
  branding.order = 0;
  menu.order = 1;
  cart.order = 2;

  headerSection.elements = [branding, menu, cart];
  headerSection.order = -1;

  console.log("[Builder Debug] Selesai melakukan sanitasi data sections. Header dikunci dengan 3 elemen kaku.");
  return [headerSection, ...sorted];
};

export function useBuilderState() {
${logicContent}

  // Return objek raksasa yang menampung semua state dan handlers
  return {
    ${allVariables.join(',\n    ')}
  };
}
`;

fs.writeFileSync(path.join(__dirname, '../app/dashboard/storefront/builder/useBuilderState.tsx'), useBuilderStateContent);
console.log("useBuilderState.tsx generated!");

// 2. BUAT BuilderSidebar.tsx
// Cari baris aside pembuka dan penutup di uiContent
const uiLines = uiContent.split('\n');
const asideStartLineIdx = uiLines.findIndex(l => l.trim().startsWith('<aside'));
const asideEndLineIdx = uiLines.findIndex(l => l.trim().startsWith('</aside>'));

if (asideStartLineIdx === -1 || asideEndLineIdx === -1) {
  console.error("Aside tags not found in uiContent!");
  process.exit(1);
}

console.log(`Aside blocks found: line ${asideStartLineIdx + 1} to ${asideEndLineIdx + 1}`);

const asideLines = uiLines.slice(asideStartLineIdx, asideEndLineIdx + 1);
const asideContentRaw = asideLines.join('\n');

// Kita butuh imports yang lengkap untuk BuilderSidebar.tsx
const sidebarImports = `// @ts-nocheck
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
  Maximize2, Table, Strikethrough, HelpCircle, Eraser, Quote, Minus 
} from "lucide-react";
import { motion, Reorder, AnimatePresence, useDragControls } from "framer-motion";

// Import pembungkus/state dan types
import { useBuilderState } from "./useBuilderState";
import { SectionElement, ELEMENT_TYPE_MAP } from "@/components/storefront/sections/BuilderSection";

// Extract helper components and constants from top_declarations
`;

// Mari ambil deklarasi sub-komponen dari topDecl
const startSubComponentIdx = topDeclLines.findIndex(l => l.includes('interface RichTextEditorProps'));

if (startSubComponentIdx === -1) {
  console.error("Subcomponents start not found in topDecl!");
  process.exit(1);
}

const subComponentsContent = topDeclLines.slice(startSubComponentIdx).join('\n');

// Sekarang kita susun isi BuilderSidebar.tsx
const builderSidebarContent = `${sidebarImports}
${subComponentsContent}

interface BuilderSidebarProps {
  state: ReturnType<typeof useBuilderState>;
}

export default function BuilderSidebar({ state }: BuilderSidebarProps) {
  // Destructuring all variables from state for local usage in UI
  const {
    ${allVariables.join(',\n    ')}
  } = state;

  return (
${asideContentRaw}
  );
}
`;

fs.writeFileSync(path.join(__dirname, '../app/dashboard/storefront/builder/BuilderSidebar.tsx'), builderSidebarContent);
console.log("BuilderSidebar.tsx generated!");

// 3. BUAT page.tsx BARU (MODIFIED)
// Ganti blok aside di uiContent dengan <BuilderSidebar state={state} />
const uiLinesModified = [...uiLines];
// Ganti baris pembuka aside sampai penutup aside dengan <BuilderSidebar state={state} />
uiLinesModified.splice(asideStartLineIdx, (asideEndLineIdx - asideStartLineIdx) + 1, '        <BuilderSidebar state={state} />');
const uiContentModified = uiLinesModified.join('\n');

const pageContent = `"use client";

import { Suspense } from "react";
import { 
  Plus, Trash2, Settings2, Sliders, Eye, Save, X, Layers, Box, LayoutTemplate, Palette, Settings, Link as LinkIcon, ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Smartphone, Monitor, Type, Image as ImageIcon, Paintbrush, Globe, Upload, Loader2, ShoppingBag, ShieldCheck, Copy, Clipboard, CopyPlus, PlusCircle, Columns, Undo2, Redo2, LayoutGrid, AlignLeft, AlignCenter, AlignRight, AlignJustify, MousePointerClick, SeparatorHorizontal, Award, Pencil, Folder, Sparkles, Link2, RotateCcw, Bold, Italic, Underline, List, ListOrdered, Maximize2, Table, Strikethrough, HelpCircle, Eraser, Quote, Minus 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontProvider } from "@/components/storefront/StorefrontProvider";
import { BuilderSection, SectionElement, ELEMENT_TYPE_MAP } from "@/components/storefront/sections/BuilderSection";
import { MediaLibraryModal } from "@/components/MediaLibraryModal";
import { LottiePanelTrigger } from "@/components/LottiePanelTrigger";

// Import custom hook, sidebar UI, dan template struktur section
import { useBuilderState, SECTION_STRUCTURE_TEMPLATES } from "./useBuilderState";
import BuilderSidebar from "./BuilderSidebar";

function BuilderContent() {
  const state = useBuilderState();
  const {
    ${allVariables.join(',\n    ')}
  } = state;

  if (isLoading && sections.length === 0) {
    return (
      <div className={\`fixed inset-0 \${theme === 'dark' ? 'bg-black' : 'bg-slate-50'} flex flex-col items-center justify-center space-y-8 z-[200]\`}>
        <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <h2 className={\`text-xl font-black \${theme === 'dark' ? 'text-white' : 'text-slate-950'} uppercase tracking-[0.4em] animate-pulse\`}>Initializing Canvas</h2>
          <p className={\`text-slate-500 text-[10px] font-bold uppercase tracking-widest\`}>Menyiapkan lingkungan desain visual...</p>
        </div>
      </div>
    );
  }

  // uiContentModified sudah memuat pembungkus return () dan penutup kurung kurawal BuilderContent
${uiContentModified}

${bottomWrapper}
`;

fs.writeFileSync(path.join(__dirname, '../app/dashboard/storefront/builder/page.tsx.new'), pageContent);
console.log("page.tsx.new generated successfully!");
