// @ts-nocheck
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
export const SECTION_STRUCTURE_TEMPLATES = [
  {
    name: "1 Kolom Vertikal",
    desc: "Satu kolom penuh dengan arah susunan ke bawah (vertical flex)",
    iconHtml: (
      <div className="w-full h-11 flex items-center justify-center bg-[#DDE2E5] text-zinc-500 font-bold text-base transition-colors duration-200">
        ↓
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'vertical', direction: 'col', gap: 16, align: 'stretch' },
    columns: []
  },
  {
    name: "1 Kolom Horizontal",
    desc: "Satu kolom penuh dengan arah susunan ke samping (horizontal flex)",
    iconHtml: (
      <div className="w-full h-11 flex items-center justify-center bg-[#DDE2E5] text-zinc-500 font-bold text-base transition-colors duration-200">
        →
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'horizontal', direction: 'row', gap: 16, align: 'stretch' },
    columns: []
  },
  {
    name: "2 Kolom Sama Rata (50/50)",
    desc: "Dua kolom terbagi rata 50% berdampingan",
    iconHtml: (
      <div className="w-full h-11 grid grid-cols-2 divide-x divide-white bg-[#DDE2E5]">
        <div className="h-full"></div>
        <div className="h-full"></div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 2, rows: 1, gap: 16, align: 'stretch' },
    columns: []
  },
  {
    name: "3 Kolom Sama Rata (33/33/33)",
    desc: "Tiga kolom terbagi rata 33% berdampingan",
    iconHtml: (
      <div className="w-full h-11 grid grid-cols-3 divide-x divide-white bg-[#DDE2E5]">
        <div className="h-full"></div>
        <div className="h-full"></div>
        <div className="h-full"></div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 3, rows: 1, gap: 16, align: 'stretch' },
    columns: []
  },
  {
    name: "4 Kolom Sama Rata (25/25/25/25)",
    desc: "Empat kolom terbagi rata 25% berdampingan",
    iconHtml: (
      <div className="w-full h-11 grid grid-cols-4 divide-x divide-white bg-[#DDE2E5]">
        <div className="h-full"></div>
        <div className="h-full"></div>
        <div className="h-full"></div>
        <div className="h-full"></div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 4, rows: 1, gap: 16, align: 'stretch' },
    columns: []
  },
  {
    name: "3 Kolom (25/50/25)",
    desc: "Tiga kolom dengan kolom tengah dua kali lebih lebar",
    iconHtml: (
      <div className="w-full h-11 flex divide-x divide-white bg-[#DDE2E5]">
        <div className="w-[25%] h-full"></div>
        <div className="w-[50%] h-full"></div>
        <div className="w-[25%] h-full"></div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 3, rows: 1, gap: 16, align: 'stretch', customGridColumns: '1fr 2fr 1fr' },
    columns: []
  },
  {
    name: "Grid 2x2 (4 Kolom)",
    desc: "Struktur grid simetris 2 baris dengan masing-masing 2 kolom",
    iconHtml: (
      <div className="w-full h-11 flex flex-col divide-y divide-white bg-[#DDE2E5]">
        <div className="flex-1 grid grid-cols-2 divide-x divide-white">
          <div className="h-full"></div>
          <div className="h-full"></div>
        </div>
        <div className="flex-1 grid grid-cols-2 divide-x divide-white">
          <div className="h-full"></div>
          <div className="h-full"></div>
        </div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 2, rows: 2, gap: 16, align: 'stretch' },
    columns: []
  },
  {
    name: "2 Kolom (33/67)",
    desc: "Dua kolom dengan kolom kiri lebih sempit (seperti sidebar)",
    iconHtml: (
      <div className="w-full h-11 flex divide-x divide-white bg-[#DDE2E5]">
        <div className="w-[33.3%] h-full"></div>
        <div className="w-[66.7%] h-full"></div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 2, rows: 1, gap: 16, align: 'stretch', customGridColumns: '1fr 2fr' },
    columns: []
  },
  {
    name: "2 Kolom (67/33)",
    desc: "Dua kolom dengan kolom kanan lebih sempit (seperti sidebar)",
    iconHtml: (
      <div className="w-full h-11 flex divide-x divide-white bg-[#DDE2E5]">
        <div className="w-[66.7%] h-full"></div>
        <div className="w-[33.3%] h-full"></div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 2, rows: 1, gap: 16, align: 'stretch', customGridColumns: '2fr 1fr' },
    columns: []
  },
  {
    name: "Grid 3x2 (6 Kolom)",
    desc: "Struktur grid 2 baris dengan masing-masing 3 kolom",
    iconHtml: (
      <div className="w-full h-11 flex flex-col divide-y divide-white bg-[#DDE2E5]">
        <div className="flex-1 grid grid-cols-3 divide-x divide-white">
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
        </div>
        <div className="flex-1 grid grid-cols-3 divide-x divide-white">
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
        </div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 3, rows: 2, gap: 16, align: 'stretch' },
    columns: []
  },
  {
    name: "Row (50/50) + Row (100%)",
    desc: "Dua kolom di atas dan satu baris penuh di bawah",
    iconHtml: (
      <div className="w-full h-11 flex flex-col divide-y divide-white bg-[#DDE2E5]">
        <div className="flex-1 grid grid-cols-2 divide-x divide-white">
          <div className="h-full"></div>
          <div className="h-full"></div>
        </div>
        <div className="flex-1 h-full"></div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 2, rows: 2, gap: 16, align: 'stretch', customGridClass: '[&>*:nth-child(3)]:col-span-2', placeholderCount: 3 },
    columns: []
  },
  {
    name: "Row (100%) + Row (50/50)",
    desc: "Satu baris penuh di atas dan dua kolom di bawah",
    iconHtml: (
      <div className="w-full h-11 flex flex-col divide-y divide-white bg-[#DDE2E5]">
        <div className="flex-1 h-full"></div>
        <div className="flex-1 grid grid-cols-2 divide-x divide-white">
          <div className="h-full"></div>
          <div className="h-full"></div>
        </div>
      </div>
    ),
    sectionConfig: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'grid', columns: 2, rows: 2, gap: 16, align: 'stretch', customGridClass: '[&>*:nth-child(1)]:col-span-2', placeholderCount: 3 },
    columns: []
  }
];

interface DraggableReorderItemProps {
  value: any;
  onDragStart?: (itemId: string) => void;
  onDragEnd?: () => void;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: (dragControls: ReturnType<typeof useDragControls>) => React.ReactNode;
}

function DraggableReorderItem({ value, onDragStart, onDragEnd, className, onClick, children }: DraggableReorderItemProps) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      value={value}
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      onDragStart={() => {
        console.log('[Builder Drag] Drag started for item:', value?.id || value);
        if (onDragStart) onDragStart(value?.id || String(value));
      }}
      onDragEnd={() => {
        console.log('[Builder Drag] Drag ended for item:', value?.id || value);
        if (onDragEnd) onDragEnd();
      }}
      className={className}
      onClick={onClick}
    >
      {children(dragControls)}
    </Reorder.Item>
  );
}

interface MoveControlsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: (e: React.MouseEvent) => void;
  onMoveDown: (e: React.MouseEvent) => void;
}

function MoveControls({ canMoveUp, canMoveDown, onMoveUp, onMoveDown }: MoveControlsProps) {
  return (
    <div className="flex flex-col shrink-0 leading-none opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className={`p-0 rounded ${canMoveUp ? "text-slate-300 hover:text-slate-100" : "text-slate-700 cursor-not-allowed"}`}
      >
        <ChevronUp className="w-3 h-3" strokeWidth={2.25} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className={`p-0 rounded ${canMoveDown ? "text-slate-300 hover:text-slate-100" : "text-slate-700 cursor-not-allowed"}`}
      >
        <ChevronDown className="w-3 h-3" strokeWidth={2.25} />
      </button>
    </div>
  );
}


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
        paddingRight: 40,
        contentWidth: 'full' // FIX 1: Header harus selalu full-width
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
  
  // FIX 1: Pastikan header config selalu punya contentWidth: 'full'
  if (!headerSection.config) {
    headerSection.config = {};
  }
  if (!headerSection.config.contentWidth) {
    headerSection.config.contentWidth = 'full';
  }

  // Pastikan CART (Keranjang) wajib ada di header dan selalu di posisi terakhir
  let headerElements = headerSection.elements || [];
  const cartExists = headerElements.some(el => el.type === 'CART');
  if (!cartExists) {
    const cartElement: SectionElement = {
      id: 'h-el-cart',
      type: 'CART',
      config: { text: 'Keranjang', bgColor: '#18181B', textColor: '#FFFFFF', borderRadius: 8, buttonType: 'Asali', iconType: 'none', iconPosition: 'before', iconSpacing: 8 },
      order: headerElements.length
    };
    headerElements.push(cartElement);
  }

  // Urutkan: CART (Keranjang) selalu di posisi paling kanan/akhir
  const nonCart = headerElements.filter(el => el.type !== 'CART').map((el, i) => ({ ...el, order: i }));
  const cart = headerElements.find(el => el.type === 'CART');
  headerSection.elements = cart ? [...nonCart, { ...cart, order: nonCart.length }] : nonCart;
  headerSection.order = -1;

  console.log("[Builder Debug] Selesai melakukan sanitasi data sections. CART dipastikan ada di header.");
  return [headerSection, ...sorted];
};

export function useBuilderState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams?.get("pageId");

  const { data: initialSections, loading: loadingSections, refresh: refreshSections } = useCacheFetch<Section[]>(pageId ? null : "/api/storefront/sections", "storefront_sections", 300000);
  const { data: customPage, loading: loadingPage, refresh: refreshPage } = useCacheFetch<any>(pageId ? `/api/storefront/pages/${pageId}` : null, `storefront_page_${pageId}`, 0);
  const { data: allCustomPages } = useCacheFetch<any[]>("/api/storefront/pages", "storefront_pages_list", 300000);


  const { data: client } = useCacheFetch<any>("/api/profile", "client_profile", 300000);
  const { data: products } = useCacheFetch<any[]>("/api/products", "dashboard_products", 300000);
  const { data: categories } = useCacheFetch<any[]>("/api/categories", "dashboard_categories", 300000);
  const [sections, setSections] = useState<Section[]>([]);
  const hasInitialized = useRef(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [activeSubFocus, setActiveSubFocus] = useState<string | null>(null);

  useEffect(() => {
    if (!activeElementId) {
      setActiveSubFocus(null);
    }
  }, [activeElementId]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageResolutionMode, setImageResolutionMode] = useState<"auto" | "custom">("auto");
  const [tempWidth, setTempWidth] = useState("");
  const [tempHeight, setTempHeight] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (activeElementId && editingSection) {
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
      const activeEl = findRecursively(editingSection.elements || [], activeElementId);
      if (activeEl && activeEl.type === 'IMAGE') {
        const w = activeEl.config.width || '';
        const h = activeEl.config.height || '';
        const isCustom = (w && w !== 'auto') || (h && h !== 'auto');
        setImageResolutionMode(isCustom ? 'custom' : 'auto');
        setTempWidth(w === 'auto' ? '' : w);
        setTempHeight(h === 'auto' ? '' : h);
      }
    }
  }, [activeElementId, editingSection]);

  const [addingBlockToId, setAddingBlockToId] = useState<string | null>(null);
  const [activeLibraryTab, setActiveLibraryTab] = useState<'widget' | 'global'>('widget');
  const [newlyAddedElementId, setNewlyAddedElementId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<{ field: string; elementId?: string } | null>(null);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<'cssFilters' | 'boxShadow' | 'bgBoxShadow' | 'btnTypography' | 'btnTextShadow' | 'btnBoxShadow' | 'btnTextStroke' | null>(null);
  const [borderRadiusLink, setBorderRadiusLink] = useState(true);
  const [borderWidthLink, setBorderWidthLink] = useState(true);
  const [marginLink, setMarginLink] = useState(true);
  const [paddingLink, setPaddingLink] = useState(true);
  const [bgBorderRadiusLink, setBgBorderRadiusLink] = useState(true);
  const [bgBorderWidthLink, setBgBorderWidthLink] = useState(true);
  const [btnStyleMode, setBtnStyleMode] = useState<'normal' | 'hover'>('normal');
  const [btnBorderRadiusLink, setBtnBorderRadiusLink] = useState(true);
  const [btnPaddingLink, setBtnPaddingLink] = useState(true);

  // Media Library Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalMode, setMediaModalMode] = useState<"image" | "svg">("image");
  const [mediaModalCallback, setMediaModalCallback] = useState<((url: string) => void) | null>(null);
  const [mediaModalMultiple, setMediaModalMultiple] = useState(false);
  const [mediaModalMaxSelect, setMediaModalMaxSelect] = useState(10);
  const [mediaModalInitialSelected, setMediaModalInitialSelected] = useState<string[]>([]);
  const [mediaModalMultipleCallback, setMediaModalMultipleCallback] = useState<((urls: string[]) => void) | null>(null);

  useEffect(() => {
    const handleCloseDropdowns = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("click", handleCloseDropdowns);
    return () => window.removeEventListener("click", handleCloseDropdowns);
  }, [activeDropdown]);

  useEffect(() => {
    console.log("[BuilderContent] Render state update. LoadingSections:", loadingSections, "LoadingPage:", loadingPage, "SectionsCount:", sections.length, "ClientLoaded:", !!client);
  }, [loadingSections, loadingPage, sections, client]);

  // History State (Undo/Redo)
  const [past, setPast] = useState<Section[][]>([]);
  const [future, setFuture] = useState<Section[][]>([]);

  // Context Menu & Clipboard States
  const [copiedSection, setCopiedSection] = useState<Section | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; section: Section; elementId?: string } | null>(null);

  // Panel States
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'library' | 'editor'>('library');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeEditorTab, setActiveEditorTab] = useState<'layout' | 'style' | 'advanced'>('layout');
  const [editorCollapse, setEditorCollapse] = useState<Record<string, boolean>>({
    kontainer: true,
    item: true,
    tataLetak: true,
    latarBelakang: true,
    perbatasan: true,
    fleksibilitas: true,
  });

  useEffect(() => {
    console.log("[BUILDER] Tab editor kolom/kontainer aktif berubah menjadi:", activeEditorTab);
  }, [activeEditorTab]);

  // Sinkronisasi otomatis tab editor (activeEditorTab) berdasarkan elemen aktif dan subFocus
  useEffect(() => {
    if (!activeElementId || !editingSection) return;

    // Helper fungsi pencarian elemen secara rekursif
    const findElementRecursively = (elements: SectionElement[], targetId: string): SectionElement | null => {
      for (const el of elements) {
        if (el.id === targetId) return el;
        if (el.children) {
          const found = findElementRecursively(el.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const activeEl = findElementRecursively(editingSection.elements || [], activeElementId);
    if (activeEl) {
      // Jika tipe elemen adalah salah satu dari custom elements yang konfigurasinya hanya didukung di layout tab
      const isCustomWidgetOnlyLayout = false;
      console.log(`[EditorTab Sync Check] activeEl.type: "${activeEl.type}", isCustomWidgetOnlyLayout: ${isCustomWidgetOnlyLayout}, activeEditorTab: "${activeEditorTab}"`);

      if (activeSubFocus && !['BRANDING'].includes(activeEl.type)) {
        // Jika ada subFocus aktif pada elemen non-custom (misalnya category_title dll yang hanya ada di layout)
        if (activeEditorTab !== 'layout') {
          setActiveEditorTab('layout');
          console.log(`[EditorTab Sync] Mengubah otomatis activeEditorTab ke "layout" karena subFocus "${activeSubFocus}" aktif di storefront canvas.`);
        }
      }

      // Jika COLUMN terpilih
      if (activeEl.type === 'COLUMN') {
        console.log(`[EditorTab Sync] COLUMN aktif: "${activeEl.id}". Sinkronisasi tab editor saat ini: "${activeEditorTab}".`);
      }
    }
  }, [activeElementId, editingSection, activeSubFocus, activeEditorTab]);


  const [panelWidth, setPanelWidth] = useState(320);
  const isResizing = useRef(false);
  const isDraggingRef = useRef(false);
  const dragIntentRef = useRef(false);
  const lastDragTimeRef = useRef<number>(0);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isDraggingWidget, setIsDraggingWidget] = useState(false);
  const [draggedWidgetType, setDraggedWidgetType] = useState<string | null>(null);
  const dragReleaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const CLICK_SUPPRESS_MS = 200;

  const shouldSuppressClick = useCallback(() => {
    const timeSinceLastDrag = Date.now() - lastDragTimeRef.current;
    return isDraggingRef.current || dragIntentRef.current || activeDragId !== null || timeSinceLastDrag < CLICK_SUPPRESS_MS;
  }, [activeDragId]);

  const handleGripPointerDown = useCallback(
    (e: React.PointerEvent, dragControls: ReturnType<typeof useDragControls>) => {
      e.stopPropagation();
      dragIntentRef.current = true;
      lastDragTimeRef.current = Date.now();
      dragControls.start(e);
    },
    []
  );

  const handleDragStart = (itemId: string) => {
    if (dragReleaseTimeoutRef.current) {
      clearTimeout(dragReleaseTimeoutRef.current);
      dragReleaseTimeoutRef.current = null;
    }
    isDraggingRef.current = true;
    setActiveDragId(itemId);
    lastDragTimeRef.current = Date.now();
    console.log("[Builder] Dragging started - clicks temporarily suppressed for:", itemId);
  };
  const handleDragEnd = () => {
    console.log(`[Builder] Dragging ended - restoring click detection in ${CLICK_SUPPRESS_MS}ms`);
    lastDragTimeRef.current = Date.now();
    setActiveDragId(null);
    dragReleaseTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
      dragIntentRef.current = false;
      dragReleaseTimeoutRef.current = null;
      console.log("[Builder] Drag suppression released");
    }, CLICK_SUPPRESS_MS);
  };

  const handleContainerClickCapture = (e: React.MouseEvent) => {
    if (shouldSuppressClick()) {
      e.stopPropagation();
      e.preventDefault();
      console.log("[Builder] Captured and suppressed click during drag state or time buffer");
    }
  };

  useEffect(() => {
    return () => {
      if (dragReleaseTimeoutRef.current) {
        clearTimeout(dragReleaseTimeoutRef.current);
      }
    };
  }, []);

  // Panel Resize Handler
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startWidth = panelWidth;
    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const diff = ev.clientX - startX;
      const newWidth = Math.max(320, Math.min(500, startWidth + diff));
      setPanelWidth(newWidth);
      console.log('[Resize] Panel width resized to:', newWidth);
    };
    const onUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      console.log('[Resize] Panel resizing finished. Final width:', panelWidth);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [panelWidth]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("stockysee_theme") as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
    console.log("[Editor Mount] Visual editor loaded. Default left panel tab set to: widget. Active panel: library");
  }, []);

  const prevEditingSectionIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (editingSection) {
      console.log("[Editor State] Section sorot/terpilih diperbarui, mempertahankan tab panel aktif saat ini. ID:", editingSection.id);
      
      // Helper untuk memeriksa apakah elemen aktif berada di dalam section secara rekursif
      const isElementInSection = (elements: any[], targetId: string): boolean => {
        for (const el of elements) {
          if (el.id === targetId) return true;
          if (el.children && isElementInSection(el.children, targetId)) return true;
        }
        return false;
      };

      // Hanya reset activeElementId jika pindah ke section BERBEDA dan elemen aktif saat ini tidak ada di section baru
      if (prevEditingSectionIdRef.current && prevEditingSectionIdRef.current !== editingSection.id) {
        if (activeElementId) {
          const isFound = isElementInSection(editingSection.elements || [], activeElementId);
          console.log("[Editor State Debug] Berpindah section dari", prevEditingSectionIdRef.current, "ke", editingSection.id);
          console.log("[Editor State Debug] Memeriksa apakah elemen aktif", activeElementId, "ada di section baru:", isFound);
          if (!isFound) {
            console.log("[Editor State Debug] Elemen aktif tidak ditemukan di section baru. Mereset activeElementId ke null.");
            setActiveElementId(null);
          } else {
            console.log("[Editor State Debug] Elemen aktif ditemukan di section baru. Mempertahankan activeElementId.");
          }
        }
      }
      prevEditingSectionIdRef.current = editingSection.id;
    } else {
      console.log("[Editor State Debug] editingSection bernilai null. Mereset panel ke library dan activeElementId ke null.");
      setActivePanel('library');
      setActiveElementId(null);
      prevEditingSectionIdRef.current = null;
    }
  }, [editingSection, activeElementId]);

  const { showConfirm, showToast } = useUI();

  // ── Reusable Image Upload Handler (→ /api/upload, counted in Media) ──
  const handleUploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      showToast("Hanya file gambar yang diizinkan", "error");
      return null;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      showToast("Gambar berhasil diupload!", "success");
      console.log("[Builder] Image uploaded:", data.url);
      return data.url as string;
    } catch (err: any) {
      showToast(err.message || "Upload gagal", "error");
      console.error("[Builder] Upload error:", err);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [showToast]);

  // ── Media Library Modal Handlers ──
  const openMediaModal = useCallback((
    callback: (url: string) => void,
    mode: "image" | "svg" = "image",
    multiple: boolean = false,
    maxSelect: number = 10,
    initialSelected: string[] = [],
    multipleCallback: ((urls: string[]) => void) | null = null
  ) => {
    setMediaModalMode(mode);
    setMediaModalCallback(() => callback);
    setMediaModalMultiple(multiple);
    setMediaModalMaxSelect(maxSelect);
    setMediaModalInitialSelected(initialSelected);
    setMediaModalMultipleCallback(() => multipleCallback);
    setIsMediaModalOpen(true);
    console.log("[Builder] Media Library Modal opened. mode:", mode, "multiple:", multiple);
  }, []);

  const openMediaSvgModal = useCallback((callback: (url: string) => void) => {
    openMediaModal((url: string) => {
      callback(url);
    }, "svg");
  }, [openMediaModal]);

  const closeMediaModal = useCallback(() => {
    setIsMediaModalOpen(false);
    setMediaModalCallback(null);
    setMediaModalMultipleCallback(null);
    setMediaModalMultiple(false);
    setMediaModalInitialSelected([]);
    console.log("[Builder] Media Library Modal closed");
  }, []);

  const handleMediaSelect = useCallback((url: string) => {
    if (mediaModalCallback) {
      mediaModalCallback(url);
      console.log("[Builder] Media selected single:", url);
    }
    closeMediaModal();
  }, [mediaModalCallback, closeMediaModal]);

  const handleMediaSelectMultiple = useCallback((urls: string[]) => {
    if (mediaModalMultipleCallback) {
      mediaModalMultipleCallback(urls);
      console.log("[Builder] Media selected multiple:", urls);
    }
    closeMediaModal();
  }, [mediaModalMultipleCallback, closeMediaModal]);

  // ── Delete Image from Media/Storage ──
  const handleDeleteImage = useCallback(async (url: string): Promise<boolean> => {
    if (!url) return false;
    try {
      // Extract storage path from Supabase URL: .../storage/v1/object/public/assets/uploads/...
      const match = url.match(/\/storage\/v1\/object\/public\/assets\/(.+)$/);
      if (!match) {
        console.warn("[Builder] Cannot extract path from URL:", url);
        return false;
      }
      const path = match[1];
      const res = await fetch("/api/media", {
        method: "DELETE",
        body: JSON.stringify({ path }),
      });
      if (!res.ok) throw new Error("Gagal menghapus dari storage");
      showToast("Gambar dihapus dari media", "success");
      console.log("[Builder] Image deleted from storage:", path);
      return true;
    } catch (err: any) {
      showToast(err.message || "Gagal hapus gambar", "error");
      console.error("[Builder] Delete image error:", err);
      return false;
    }
  }, [showToast]);

  useEffect(() => {
    if (pageId && customPage && !hasInitialized.current) {
      if (customPage.page) {
        try {
          const parsedSections = customPage.page.content ? JSON.parse(customPage.page.content) : [];
          if (parsedSections.length === 0) {
            const defaults = [
              { id: 'def-section-1', type: 'SECTION', config: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'vertical', gap: 16, align: 'left' }, elements: [], order: 0, isActive: true },
            ];
            setSections(sanitizeSections(defaults));
          } else {
            setSections(sanitizeSections(parsedSections));
          }
        } catch (e) {
          console.error("Failed to parse page content", e);
          setSections(sanitizeSections([]));
        }
      }
      hasInitialized.current = true;
    } else if (!pageId && initialSections && !hasInitialized.current) {
      if (initialSections.length === 0) {
        // Mulai dengan Header + 1 section kosong (modular)
        const defaults: Section[] = [
          { id: 'def-section-1', type: 'SECTION', config: { bgColor: 'transparent', maxWidth: '1200px', contentWidth: 'boxed', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40, layout: 'vertical', gap: 16, align: 'left' }, elements: [], order: 0, isActive: true },
        ];
        setSections(sanitizeSections(defaults));
        console.log('[Builder] Init: Created default Header + Section');
      } else {
        const parsed = initialSections.map((s: any) => {
          const cfg = typeof s.config === 'string' ? JSON.parse(s.config) : s.config;
          return {
            ...s,
            config: cfg,
            elements: s.elements || cfg?.elements || []
          };
        });
        console.log("[Builder Init] Memuat global sections dari API. Hasil parsing dan pemetaan elements:", parsed);
        setSections(sanitizeSections(parsed));
      }
      hasInitialized.current = true;
    }
  }, [initialSections, customPage, pageId]);

  const saveHistory = (newSections: Section[]) => {
    const sanitized = sanitizeSections(newSections);
    setPast(prev => [...prev, sections].slice(-20)); // Limit to 20 states
    setFuture([]);
    setSections(sanitized);
    setHasChanges(true);
  };

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(prev => prev.slice(0, -1));
    setFuture(prev => [sections, ...prev]);
    setSections(previous);
    setHasChanges(true);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(prev => prev.slice(1));
    setPast(prev => [...prev, sections]);
    setSections(next);
    setHasChanges(true);
  };

  const updateLocalSection = (updated: Section) => {
    setEditingSection(updated);
    saveHistory(sections.map(s => s.id === updated.id ? updated : s));
  };

  // ── SECTION CRUD ──
  const handleAddSection = () => {
    console.log("[Builder] Buka Modal Pilihan Struktur Section");
    setIsStructureModalOpen(true);
  };

  const handleSelectStructure = (templateIndex: number) => {
    const template = SECTION_STRUCTURE_TEMPLATES[templateIndex];
    if (!template) return;

    console.log("[Builder] Membuat layout baru untuk template:", template.name);

    // Determine how many columns to create based on the grid layout
    let numColumnsToCreate = 0;
    if (template.sectionConfig.layout === 'grid') {
      numColumnsToCreate = template.sectionConfig.placeholderCount || ((template.sectionConfig.columns || 1) * (template.sectionConfig.rows || 1));
    }

    // Create column elements if it's a grid (minimal 2 columns)
    const columnElements = Array.from({ length: numColumnsToCreate }).map((_, idx) => {
      const colId = `el-${Date.now()}-${Math.random().toString(36).substring(7)}-${idx}`;
      return {
        id: colId,
        type: 'COLUMN' as const,
        config: {
          layout: 'vertical',
          gap: 16,
          align: 'left',
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          bgColor: 'transparent',
          borderRadius: 0,
          sizing: 'default',
        },
        children: [],
        order: idx
      };
    });

    const newSection: Section = {
      id: `new-${Math.random().toString(36).substring(7)}`,
      type: 'SECTION',
      config: {
        ...template.sectionConfig,
        bgColor: 'transparent',
      },
      elements: columnElements,
      order: sections.length,
      isActive: true
    };

    saveHistory([...sections, newSection]);
    setEditingSection(newSection);
    setActiveElementId(null);
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
    setIsStructureModalOpen(false);
    showToast(`Section baru dengan ${template.name} berhasil dibuat!`, "success");
    console.log("[Builder] Section baru berhasil diinjeksi:", newSection.id, "Struktur kolom:", template.name, "Jumlah kolom:", columnElements.length);
  };

  const handleDeleteSection = (id: string) => {
    if (id === 'global-header') {
      showToast("Komponen Header dilindungi dan tidak boleh dihapus!", "error");
      console.warn("[Gating] Dilarang keras menghapus Section HEADER global-header");
      return;
    }
    saveHistory(sections.filter(s => s.id !== id));
    if (editingSection?.id === id) { setEditingSection(null); setActiveElementId(null); }
    showToast("Section dihapus", "info");
    console.log("[Builder] Section Deleted:", id);
  };

  // ── CANVAS HOVER HOOKS & HELPERS ──
  const handleCanvasAddElementClick = useCallback((parentId: string, isColumn: boolean) => {
    console.log(`[Canvas Hover Click] Tombol + diklik pada ${isColumn ? 'Kolom' : 'Section'} ID:`, parentId);
    setAddingBlockToId(parentId);

    if (isColumn) {
      setActiveElementId(parentId);
      const sParent = sections.find(s => (s.elements || []).some(el => el.id === parentId || (el.children || []).some(ch => ch.id === parentId)));
      if (sParent) {
        setEditingSection(sParent);
      }
    } else {
      const sParent = sections.find(s => s.id === parentId);
      if (sParent) {
        setEditingSection(sParent);
        setActiveElementId(null);
      }
    }

    setIsLeftPanelOpen(true);
    setActivePanel('library');
    setActiveLibraryTab('widget');
  }, [sections]);

  const handleWidgetDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("text/plain", type);
    setIsDraggingWidget(true);
    setDraggedWidgetType(type);
    console.log("[Drag & Drop] Mulai drag widget tipe:", type);
  };

  const handleWidgetDragEnd = () => {
    setIsDraggingWidget(false);
    setDraggedWidgetType(null);
    console.log("[Drag & Drop] Selesai drag widget");
  };

  const handleDropWidget = (targetId: string, widgetType: string) => {
    console.log("[Drag & Drop] Drop widget:", widgetType, "ke target:", targetId);

    // Jika widget type adalah GRID (Layout Horizontal)
    if (widgetType === 'GRID') {
      const gridElId = `el-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const newElement: SectionElement = {
        id: gridElId,
        type: 'COLUMN',
        config: {
          layout: 'horizontal',
          gap: 16,
          align: 'center',
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          bgColor: 'transparent',
          borderRadius: 0
        },
        order: 0,
        children: []
      };

      let sectionToUpdate: Section | null = null;
      let found = false;

      const newSections = sections.map(s => {
        if (s.id === targetId) {
          found = true;
          newElement.order = (s.elements || []).length;
          const updatedS = { ...s, elements: [...(s.elements || []), newElement] };
          sectionToUpdate = updatedS;
          return updatedS;
        }

        if (!found && s.elements) {
          let insertedInThisSection = false;
          const insertRec = (els: SectionElement[]): SectionElement[] => {
            return els.map(el => {
              if (el.id === targetId) {
                found = true;
                insertedInThisSection = true;
                newElement.order = (el.children || []).length;
                return { ...el, children: [...(el.children || []), newElement] };
              }
              if (el.type === 'COLUMN' && el.children && !insertedInThisSection) {
                return { ...el, children: insertRec(el.children) };
              }
              return el;
            });
          };
          const newElements = insertRec(s.elements);
          if (insertedInThisSection) {
            const updatedS = { ...s, elements: newElements };
            sectionToUpdate = updatedS;
            return updatedS;
          }
        }
        return s;
      });

      if (found && sectionToUpdate) {
        saveHistory(newSections);
        setSections(newSections);
        setEditingSection(sectionToUpdate);
        setActiveElementId(newElement.id);
        setActivePanel('editor');
        setAddingBlockToId(null);
        showToast("Grid (Layout Horizontal) berhasil ditambahkan via Drag-and-Drop!", "success");
        console.log("[Drag & Drop] Custom Grid element added via drag-and-drop to:", targetId);
      }
      return;
    }

    // Jika targetId adalah Section
    const targetSection = sections.find(s => s.id === targetId);
    if (targetSection) {
      console.log("[Drag & Drop] Menambahkan elemen ke Section:", targetId);
      handleAddElement(targetId, widgetType);
      return;
    }

    // Jika targetId adalah Kolom
    let foundSectionId: string | null = null;
    for (const s of sections) {
      const hasCol = (s.elements || []).some(el => el.id === targetId || (el.children || []).some(ch => ch.id === targetId));
      if (hasCol) {
        foundSectionId = s.id;
        break;
      }
    }

    if (foundSectionId) {
      console.log("[Drag & Drop] Menambahkan elemen ke Kolom:", targetId, "di dalam Section:", foundSectionId);
      handleAddColumnChild(foundSectionId, targetId, widgetType);
    } else {
      if (editingSection) {
        console.log("[Drag & Drop] Default ke section aktif:", editingSection.id);
        handleAddElement(editingSection.id, widgetType);
      } else {
        showToast("Silakan letakkan di dalam area section atau kolom yang ada di canvas", "info");
      }
    }
  };

  const handleWidgetClick = (type: string) => {
    console.log("[Widget Click] Mengklik widget tipe:", type);
    const targetId = addingBlockToId || editingSection?.id;
    if (!targetId) {
      showToast("Pilih kolom atau section di canvas terlebih dahulu dengan mengklik ikon +", "info");
      return;
    }

    // Cari apakah targetId adalah Section
    const targetSection = sections.find(s => s.id === targetId);
    if (targetSection) {
      console.log("[Widget Click] Menambahkan elemen ke Section:", targetId);
      handleAddElement(targetId, type);
      return;
    }

    // Cari apakah targetId adalah Kolom
    let foundSectionId: string | null = null;
    for (const s of sections) {
      const hasCol = (s.elements || []).some(el => el.id === targetId || (el.children || []).some(ch => ch.id === targetId));
      if (hasCol) {
        foundSectionId = s.id;
        break;
      }
    }

    if (foundSectionId) {
      console.log("[Widget Click] Menambahkan elemen ke Kolom:", targetId, "di dalam Section:", foundSectionId);
      handleAddColumnChild(foundSectionId, targetId, type);
    } else {
      if (editingSection) {
        console.log("[Widget Click] Default ke section aktif:", editingSection.id);
        handleAddElement(editingSection.id, type);
      } else {
        showToast("Silakan aktifkan section atau kolom terlebih dahulu", "info");
      }
    }
  };

  const handleCustomWidgetClick = (newElement: SectionElement, label: string) => {
    console.log(`[Widget Click] Menambahkan custom element ${label}:`, newElement);
    const targetId = addingBlockToId || editingSection?.id;
    if (!targetId) {
      showToast("Pilih kolom atau section di canvas terlebih dahulu dengan mengklik ikon +", "info");
      return;
    }

    let sectionToUpdate: Section | null = null;
    let found = false;

    const newSections = sections.map(s => {
      if (s.id === targetId) {
        found = true;
        newElement.order = (s.elements || []).length;
        const updatedS = { ...s, elements: [...(s.elements || []), newElement] };
        sectionToUpdate = updatedS;
        return updatedS;
      }

      if (!found && s.elements) {
        let insertedInThisSection = false;
        const insertRec = (els: SectionElement[]): SectionElement[] => {
          return els.map(el => {
            if (el.id === targetId) {
              found = true;
              insertedInThisSection = true;
              newElement.order = (el.children || []).length;
              return { ...el, children: [...(el.children || []), newElement] };
            }
            if (el.type === 'COLUMN' && el.children && !insertedInThisSection) {
              return { ...el, children: insertRec(el.children) };
            }
            return el;
          });
        };
        const newElements = insertRec(s.elements);
        if (insertedInThisSection) {
          const updatedS = { ...s, elements: newElements };
          sectionToUpdate = updatedS;
          return updatedS;
        }
      }
      return s;
    });

    if (found && sectionToUpdate) {
      saveHistory(newSections);
      setEditingSection(sectionToUpdate);
      setActiveElementId(newElement.id);
      setActivePanel('editor');
      setAddingBlockToId(null);

      setNewlyAddedElementId(newElement.id);
      setTimeout(() => {
        setNewlyAddedElementId(null);
      }, 1500);

      showToast(`${label} ditambahkan`, "success");
    } else {
      showToast("Pilih penampung kolom yang valid di canvas", "info");
    }
  };

  const handleInsertHeroTemplate = () => {
    const sectionId = `new-hero-${Math.random().toString(36).substring(7)}`;
    const titleEl: SectionElement = {
      id: `el-hero-title-${Date.now()}`,
      type: 'HEADING',
      config: {
        text: 'Layanan Istimewa untuk Hunian Impian Anda',
        textColor: '#1e293b',
        align: 'center',
        fontWeight: '800',
        fontSize: 38,
        marginBottom: 16
      },
      order: 0
    };
    const subEl: SectionElement = {
      id: `el-hero-sub-${Date.now()}`,
      type: 'TEXT',
      config: {
        text: 'Temukan pilihan villa terbaik dengan fasilitas bintang lima dan pemandangan menakjubkan di seluruh destinasi favorit Anda. Booking sekarang dan nikmati diskon khusus.',
        textColor: '#64748b',
        align: 'center',
        fontSize: 15,
        marginBottom: 24
      },
      order: 1
    };
    const cId = `el-hero-col-${Date.now()}`;
    const btnCol: SectionElement = {
      id: cId,
      type: 'COLUMN',
      config: {
        layout: 'horizontal',
        gap: 12,
        align: 'center'
      },
      order: 2,
      children: [
        {
          id: `el-hero-btn1-${Date.now()}`,
          type: 'BUTTON',
          config: {
            text: 'Jelajahi Villa',
            bgColor: '#2563eb',
            textColor: '#ffffff',
            borderRadius: 8,
            align: 'center'
          },
          order: 0
        },
        {
          id: `el-hero-btn2-${Date.now()}`,
          type: 'BUTTON',
          config: {
            text: 'Hubungi Kami',
            bgColor: '#f1f5f9',
            textColor: '#1e293b',
            borderRadius: 8,
            align: 'center'
          },
          order: 1
        }
      ]
    };

    const newSection: Section = {
      id: sectionId,
      type: 'SECTION',
      config: {
        bgColor: '#f8fafc',
        paddingTop: 80,
        paddingBottom: 80,
        paddingLeft: 40,
        paddingRight: 40,
        layout: 'vertical',
        gap: 16,
        align: 'center'
      },
      elements: [titleEl, subEl, btnCol],
      order: sections.length,
      isActive: true
    };

    saveHistory([...sections, newSection]);
    setEditingSection(newSection);
    setActiveElementId(null);
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
    showToast("Template Hero Premium berhasil diterapkan!", "success");
    console.log("[Builder] Hero Premium Template Inserted:", sectionId);
  };

  const handleInsertFeaturesTemplate = () => {
    const sectionId = `new-features-${Math.random().toString(36).substring(7)}`;
    const titleEl: SectionElement = {
      id: `el-feat-title-${Date.now()}`,
      type: 'HEADING',
      config: {
        text: 'Mengapa Memilih Kami?',
        textColor: '#1e293b',
        align: 'center',
        fontWeight: '800',
        fontSize: 32,
        marginBottom: 8
      },
      order: 0
    };
    const subEl: SectionElement = {
      id: `el-feat-sub-${Date.now()}`,
      type: 'TEXT',
      config: {
        text: 'Komitmen kami adalah menghadirkan kenyamanan dan keindahan liburan terbaik.',
        textColor: '#64748b',
        align: 'center',
        fontSize: 14,
        marginBottom: 40
      },
      order: 1
    };
    const gridId = `el-feat-grid-${Date.now()}`;
    const gridCol: SectionElement = {
      id: gridId,
      type: 'COLUMN',
      config: {
        layout: 'horizontal',
        gap: 24,
        align: 'center'
      },
      order: 2,
      children: [
        {
          id: `el-feat-col1-${Date.now()}`,
          type: 'COLUMN',
          config: {
            layout: 'vertical',
            gap: 8,
            align: 'center'
          },
          order: 0,
          children: [
            {
              id: `el-feat-icon1-${Date.now()}`,
              type: 'BADGE',
              config: {
                text: '⭐ Bintang 5',
                bgColor: '#fef3c7',
                textColor: '#d97706',
                borderRadius: 999
              },
              order: 0
            },
            {
              id: `el-feat-h1-${Date.now()}`,
              type: 'HEADING',
              config: {
                text: 'Fasilitas Premium',
                textColor: '#1e293b',
                align: 'center',
                fontWeight: '700',
                fontSize: 18
              },
              order: 1
            },
            {
              id: `el-feat-t1-${Date.now()}`,
              type: 'TEXT',
              config: {
                text: 'Setiap villa dilengkapi kolam renang pribadi dan interior mewah.',
                textColor: '#64748b',
                align: 'center',
                fontSize: 12
              },
              order: 2
            }
          ]
        },
        {
          id: `el-feat-col2-${Date.now()}`,
          type: 'COLUMN',
          config: {
            layout: 'vertical',
            gap: 8,
            align: 'center'
          },
          order: 1,
          children: [
            {
              id: `el-feat-icon2-${Date.now()}`,
              type: 'BADGE',
              config: {
                text: '🛡️ Aman & Privat',
                bgColor: '#dcfce7',
                textColor: '#15803d',
                borderRadius: 999
              },
              order: 0
            },
            {
              id: `el-feat-h2-${Date.now()}`,
              type: 'HEADING',
              config: {
                text: 'Keamanan 24/7',
                textColor: '#1e293b',
                align: 'center',
                fontWeight: '700',
                fontSize: 18
              },
              order: 1
            },
            {
              id: `el-feat-t2-${Date.now()}`,
              type: 'TEXT',
              config: {
                text: 'Privasi penuh dan penjagaan keamanan ketat di setiap kompleks.',
                textColor: '#64748b',
                align: 'center',
                fontSize: 12
              },
              order: 2
            }
          ]
        },
        {
          id: `el-feat-col3-${Date.now()}`,
          type: 'COLUMN',
          config: {
            layout: 'vertical',
            gap: 8,
            align: 'center'
          },
          order: 2,
          children: [
            {
              id: `el-feat-icon3-${Date.now()}`,
              type: 'BADGE',
              config: {
                text: '💰 Harga Terbaik',
                bgColor: '#e0f2fe',
                textColor: '#0369a1',
                borderRadius: 999
              },
              order: 0
            },
            {
              id: `el-feat-h3-${Date.now()}`,
              type: 'HEADING',
              config: {
                text: 'Garansi Termurah',
                textColor: '#1e293b',
                align: 'center',
                fontWeight: '700',
                fontSize: 18
              },
              order: 1
            },
            {
              id: `el-feat-t3-${Date.now()}`,
              type: 'TEXT',
              config: {
                text: 'Penawaran langsung dari pemilik villa tanpa biaya perantara tambahan.',
                textColor: '#64748b',
                align: 'center',
                fontSize: 12
              },
              order: 2
            }
          ]
        }
      ]
    };

    const newSection: Section = {
      id: sectionId,
      type: 'SECTION',
      config: {
        bgColor: '#ffffff',
        paddingTop: 80,
        paddingBottom: 80,
        paddingLeft: 40,
        paddingRight: 40,
        layout: 'vertical',
        gap: 16,
        align: 'center'
      },
      elements: [titleEl, subEl, gridCol],
      order: sections.length,
      isActive: true
    };

    saveHistory([...sections, newSection]);
    setEditingSection(newSection);
    setActiveElementId(null);
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
    showToast("Template Feature Showcase berhasil diterapkan!", "success");
    console.log("[Builder] Features Template Inserted:", sectionId);
  };

  // ── ELEMENT CRUD ──
  const handleAddElement = (targetId: string, elementType: string) => {
    const meta = ELEMENT_TYPE_MAP[elementType];
    if (!meta) return;

    const newElement: SectionElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: elementType as any,
      config: { ...meta.defaultConfig },
      order: 0,
    };

    let sectionToUpdate: Section | null = null;
    let found = false;

    const newSections = sections.map(s => {
      if (s.id === targetId) {
        found = true;
        newElement.order = (s.elements || []).length;
        const updatedS = { ...s, elements: [...(s.elements || []), newElement] };
        sectionToUpdate = updatedS;
        return updatedS;
      }

      if (!found && s.elements) {
        let insertedInThisSection = false;
        const insertRec = (els: SectionElement[]): SectionElement[] => {
          return els.map(el => {
            if (el.id === targetId) {
              found = true;
              insertedInThisSection = true;
              newElement.order = (el.children || []).length;
              return { ...el, children: [...(el.children || []), newElement] };
            }
            if (el.type === 'COLUMN' && el.children && !insertedInThisSection) {
              return { ...el, children: insertRec(el.children) };
            }
            return el;
          });
        };
        const newElements = insertRec(s.elements);
        if (insertedInThisSection) {
          const updatedS = { ...s, elements: newElements };
          sectionToUpdate = updatedS;
          return updatedS;
        }
      }
      return s;
    });

    if (found && sectionToUpdate) {
      saveHistory(newSections);
      setEditingSection(sectionToUpdate);
      setActiveElementId(newElement.id);
      setActivePanel('editor');
      setAddingBlockToId(null);

      setNewlyAddedElementId(newElement.id);
      setTimeout(() => {
        setNewlyAddedElementId(null);
      }, 1500);

      showToast(`${meta.label} ditambahkan`, "success");
      console.log("[Builder] Element Added:", elementType, "to:", targetId);
    }
  };

  const handleDeleteElement = (sectionId: string, elementId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    // Cari elemen yang akan dihapus untuk cek tipe
    const findElementInList = (els: SectionElement[]): SectionElement | null => {
      for (const el of els) {
        if (el.id === elementId) return el;
        if (el.children) {
          const found = findElementInList(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    const targetEl = findElementInList(section.elements || []);
    if (targetEl?.type === 'CART') {
      console.warn("[Builder Security] Aksi ditolak: Tombol Keranjang (CART) wajib ada dan tidak boleh dihapus.");
      showToast("Gagal: Tombol Keranjang adalah elemen wajib dan tidak boleh dihapus.", "error");
      return;
    }

    const deleteRecursively = (elements: SectionElement[]): SectionElement[] => {
      return elements
        .filter(el => el.id !== elementId)
        .map((el, i) => {
          if (el.children) {
            return { ...el, order: i, children: deleteRecursively(el.children) };
          }
          return { ...el, order: i };
        });
    };

    const updated = { ...section, elements: deleteRecursively(section.elements || []) };
    updateLocalSection(updated);
    if (activeElementId === elementId) setActiveElementId(null);
    showToast("Elemen dihapus", "info");
    console.log("[Builder] Element Deleted:", elementId);
  };

  const handleUpdateElement = (sectionId: string, elementId: string, newConfig: Record<string, any>) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const updateRecursively = (elements: SectionElement[]): SectionElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return { ...el, config: { ...el.config, ...newConfig } };
        }
        if (el.children) {
          return { ...el, children: updateRecursively(el.children) };
        }
        return el;
      });
    };

    const elements = updateRecursively(section.elements || []);
    const updated = { ...section, elements };
    updateLocalSection(updated);
    console.log("[Builder Element Update Debug] Updated element config successfully:", elementId, newConfig);
  };

  const handleAddColumnChild = (sectionId: string, columnId: string, childType: string) => {
    const meta = ELEMENT_TYPE_MAP[childType];
    if (!meta) return;
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newChildId = `ch-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    let found = false;

    const addRecursively = (els: SectionElement[]): SectionElement[] => {
      return els.map(el => {
        if (el.id === columnId) {
          found = true;
          const children = el.children || [];
          const newChild: SectionElement = {
            id: newChildId,
            type: childType as any,
            config: { ...meta.defaultConfig },
            order: children.length,
          };
          return { ...el, children: [...children, newChild] };
        }
        if (el.type === 'COLUMN' && el.children) {
          return { ...el, children: addRecursively(el.children) };
        }
        return el;
      });
    };

    const elements = addRecursively(section.elements || []);
    if (!found) {
      console.error("[handleAddColumnChild] Kolom tidak ditemukan secara rekursif:", columnId);
      return;
    }

    updateLocalSection({ ...section, elements });

    setNewlyAddedElementId(newChildId);
    setTimeout(() => {
      setNewlyAddedElementId(null);
    }, 1500);

    showToast(`${meta.label} ditambahkan ke kolom`, "success");
    console.log("[Builder] Column Child Added:", childType, "to Column:", columnId, "Nested: true");
  };

  const handleUpdateColumnChild = (sectionId: string, columnId: string, childId: string, newConfig: Record<string, any>) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const elements = (section.elements || []).map(el => {
      if (el.id !== columnId) return el;
      const children = (el.children || []).map(ch =>
        ch.id === childId ? { ...ch, config: { ...ch.config, ...newConfig } } : ch
      );
      return { ...el, children };
    });
    updateLocalSection({ ...section, elements });
  };

  const handleDeleteColumnChild = (sectionId: string, columnId: string, childId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const removeRecursively = (elements: SectionElement[]): SectionElement[] => {
      return elements.map(el => {
        if (el.id === columnId) {
          const children = (el.children || []).filter(ch => ch.id !== childId).map((ch, i) => ({ ...ch, order: i }));
          return { ...el, children };
        }
        if (el.children) {
          return { ...el, children: removeRecursively(el.children) };
        }
        return el;
      });
    };

    const elements = removeRecursively(section.elements || []);
    updateLocalSection({ ...section, elements });
    if (activeElementId === childId) setActiveElementId(null);
    showToast("Elemen kolom dihapus", "info");
    console.log("[Builder] Column Child Deleted recursively:", childId, "under parent column:", columnId);
  };

  // Context Menu Actions
  // --- Element-level helpers (modular) ---
  const [copiedElementData, setCopiedElementData] = useState<SectionElement | null>(null);

  const handleCopyElementCtx = (section: Section, elementId: string) => {
    let el: SectionElement | undefined;
    const findRecursively = (elements: SectionElement[]) => {
      for (const e of elements) {
        if (e.id === elementId) { el = e; return; }
        if (e.children) findRecursively(e.children);
      }
    };
    findRecursively(section.elements || []);
    if (!el) return;
    setCopiedElementData({ ...el });
    showToast(`"${ELEMENT_TYPE_MAP[el.type]?.label || el.type}" disalin`, "success");
    console.log("[Builder] Element Copied:", el.type);
    setContextMenu(null);
  };

  const handlePasteElementCtx = (section: Section, targetElementId?: string) => {
    if (!copiedElementData) return;
    const newEl: SectionElement = {
      ...copiedElementData,
      id: `el-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };

    let inserted = false;
    const insertRecursively = (elements: SectionElement[]): SectionElement[] => {
      if (inserted) return elements;
      if (!targetElementId) {
        inserted = true;
        return [...elements, { ...newEl, order: elements.length }];
      }

      const idx = elements.findIndex(e => e.id === targetElementId);
      if (idx !== -1) {
        inserted = true;
        const newElements = [...elements];
        newElements.splice(idx + 1, 0, { ...newEl, order: idx + 1 });
        return newElements.map((e, i) => ({ ...e, order: i }));
      }

      return elements.map(e => {
        if (e.children && !inserted) {
          return { ...e, children: insertRecursively(e.children) };
        }
        return e;
      });
    };

    const updatedElements = insertRecursively(section.elements || []);
    updateLocalSection({ ...section, elements: updatedElements });
    showToast(`"${ELEMENT_TYPE_MAP[newEl.type]?.label || newEl.type}" ditempel`, "success");
    console.log("[Builder] Element Pasted:", newEl.type);
    setContextMenu(null);
  };

  const handleDuplicateElementCtx = (section: Section, elementId: string) => {
    let elToDuplicate: SectionElement | undefined;
    const findRecursively = (elements: SectionElement[]) => {
      for (const e of elements) {
        if (e.id === elementId) { elToDuplicate = e; return; }
        if (e.children) findRecursively(e.children);
      }
    };
    findRecursively(section.elements || []);

    if (!elToDuplicate) return;
    setCopiedElementData({ ...elToDuplicate });

    // Immediately paste after copying
    const newEl: SectionElement = {
      ...elToDuplicate,
      id: `el-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };

    let inserted = false;
    const insertRecursively = (elements: SectionElement[]): SectionElement[] => {
      if (inserted) return elements;
      const idx = elements.findIndex(e => e.id === elementId);
      if (idx !== -1) {
        inserted = true;
        const newElements = [...elements];
        newElements.splice(idx + 1, 0, { ...newEl, order: idx + 1 });
        return newElements.map((e, i) => ({ ...e, order: i }));
      }
      return elements.map(e => {
        if (e.children && !inserted) {
          return { ...e, children: insertRecursively(e.children) };
        }
        return e;
      });
    };

    const updatedElements = insertRecursively(section.elements || []);
    updateLocalSection({ ...section, elements: updatedElements });
    showToast(`"${ELEMENT_TYPE_MAP[newEl.type]?.label || newEl.type}" diduplikasi`, "success");
    setContextMenu(null);
  };

  const handleDeleteElementCtx = (section: Section, elementId: string) => {
    handleDeleteElement(section.id, elementId);
    setContextMenu(null);
  };

  // --- Section-level actions ---
  const handleCopySection = (section: Section) => {
    setCopiedSection({ ...section });
    showToast("Komponen disalin", "success");
    console.log("[Storefront Builder] Section Copied:", section.type);
    setContextMenu(null);
  };

  const handlePasteSection = (afterSection: Section) => {
    if (!copiedSection) return;
    const newSection: Section = {
      ...copiedSection,
      id: `${copiedSection.type}-${Date.now()}`,
      order: afterSection.order + 1,
    };
    const idx = sections.findIndex(s => s.id === afterSection.id);
    const updated = [...sections];
    updated.splice(idx + 1, 0, newSection);
    saveHistory(updated.map((s, i) => ({ ...s, order: i })));
    showToast("Komponen ditempel", "success");
    console.log("[Storefront Builder] Section Pasted:", newSection.type);
    setContextMenu(null);
  };

  const handleDuplicateSection = (section: Section) => {
    const newSection: Section = {
      ...section,
      id: `${section.type}-${Date.now()}`,
      config: { ...section.config },
      order: section.order + 1,
    };
    const idx = sections.findIndex(s => s.id === section.id);
    const updated = [...sections];
    updated.splice(idx + 1, 0, newSection);
    saveHistory(updated.map((s, i) => ({ ...s, order: i })));
    showToast("Komponen diduplikasi", "success");
    console.log("[Storefront Builder] Section Duplicated:", section.type);
    setContextMenu(null);
  };

  // Close context menu on any interaction
  useEffect(() => {
    if (!contextMenu) return;
    const dismiss = () => setContextMenu(null);
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    // capture: true agar stopPropagation di sub-elemen tidak menghalangi dismiss
    window.addEventListener('mousedown', dismiss, true);
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', dismiss, true);
      window.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('keydown', handleKey);
    };
  }, [contextMenu]);

  // Auto-close context menu saat pindah komponen
  useEffect(() => { setContextMenu(null); }, [editingSection]);

  const handleSvgUpload = (file: File, idx: number, currentSection: Section) => {
    if (file && (file.type === "image/svg+xml" || file.name.endsWith(".svg"))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newItems = [...(currentSection.config.items || [])];
        newItems[idx] = { ...newItems[idx], svg: content };
        updateLocalSection({ ...currentSection, config: { ...currentSection.config, items: newItems } });
      };
      reader.readAsText(file);
    }
  };

  const handleSaveOrder = (newItems: Section[]) => {
    const header = sections.find(s => s.type === "HEADER");
    const reordered = newItems.map((item, index) => ({ ...item, order: header ? index + 1 : index }));
    saveHistory(header ? [header, ...reordered] : reordered);
  };

  const handleSaveElementOrder = (
    sectionId: string,
    parentElementId: string | null,
    newElements: SectionElement[],
    options?: { keepEditorContext?: boolean }
  ) => {
    const keepEditorContext = options?.keepEditorContext ?? false;
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const reorderedElements = newElements.map((el, i) => ({ ...el, order: i }));

    // Jika section header, pastikan CART selalu di posisi terakhir
    if (sectionId === 'global-header' || section.type === 'HEADER') {
      const cartIdx = reorderedElements.findIndex(el => el.type === 'CART');
      if (cartIdx >= 0 && cartIdx !== reorderedElements.length - 1) {
        const cart = reorderedElements.splice(cartIdx, 1)[0];
        reorderedElements.push({ ...cart, order: reorderedElements.length });
        // Perbaiki order elemen lainnya
        reorderedElements.forEach((el, i) => { el.order = i; });
      }
    }

    if (!parentElementId) {
      const updatedSection = { ...section, elements: reorderedElements };
      if (keepEditorContext) {
        updateLocalSection(updatedSection);
      } else {
        saveHistory(sections.map(s => (s.id === sectionId ? updatedSection : s)));
      }
      return;
    }

    let updated = false;
    const replaceRecursively = (elements: SectionElement[]): SectionElement[] => {
      if (updated) return elements;
      return elements.map(e => {
        if (e.id === parentElementId) {
          updated = true;
          return { ...e, children: reorderedElements };
        }
        if (e.children && !updated) {
          return { ...e, children: replaceRecursively(e.children) };
        }
        return e;
      });
    };

    const newSectionElements = replaceRecursively(section.elements || []);
    const updatedSection = { ...section, elements: newSectionElements };
    if (keepEditorContext) {
      updateLocalSection(updatedSection);
    } else {
      saveHistory(sections.map(s => (s.id === sectionId ? updatedSection : s)));
    }
  };

  const moveInArray = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
    if (toIndex < 0 || toIndex >= items.length) return items;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  const swapInArray = <T,>(items: T[], indexA: number, indexB: number): T[] => {
    if (indexA < 0 || indexA >= items.length || indexB < 0 || indexB >= items.length) return items;
    const next = [...items];
    const temp = next[indexA];
    next[indexA] = next[indexB];
    next[indexB] = temp;
    return next;
  };


  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const sectionItems = sections.filter(s => s.type === "SECTION").sort((a, b) => a.order - b.order);
    const index = sectionItems.findIndex(s => s.id === sectionId);
    if (index < 0) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sectionItems.length) return;
    handleSaveOrder(moveInArray(sectionItems, index, target));
  };

  const findChildrenList = (elements: SectionElement[], parentElementId: string): SectionElement[] | null => {
    for (const element of elements) {
      if (element.id === parentElementId) {
        return [...(element.children || [])].sort((a, b) => a.order - b.order);
      }
      if (element.children) {
        const nested = findChildrenList(element.children, parentElementId);
        if (nested) return nested;
      }
    }
    return null;
  };

  const moveElement = (
    sectionId: string,
    elementId: string,
    direction: "up" | "down" | "left" | "right",
    parentElementId: string | null = null,
    keepContext: boolean = false
  ) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const source = parentElementId
      ? findChildrenList(section.elements || [], parentElementId)
      : [...(section.elements || [])].sort((a, b) => a.order - b.order);
    if (!source || source.length <= 1) return;

    const index = source.findIndex(el => el.id === elementId);
    if (index < 0) return;

    // Helper rekursif internal untuk mencari parent element
    const findEl = (elements: SectionElement[], id: string): SectionElement | null => {
      for (const el of elements) {
        if (el.id === id) return el;
        if (el.children) {
          const found = findEl(el.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    // Deteksi dimensi kolom grid spasial (C)
    let columns = 1;
    if (!parentElementId) {
      const sectLayout = section.config.layout || 'vertical';
      if (sectLayout !== 'vertical') {
        columns = section.config.columns || 3;
      }
    } else {
      const parentElement = findEl(section.elements || [], parentElementId);
      if (parentElement && parentElement.config) {
        const pLayout = parentElement.config.layout || 'vertical';
        const pContainerLayout = parentElement.config.containerLayout || 'flex';
        if (pLayout !== 'vertical' || pContainerLayout === 'grid') {
          columns = parentElement.config.columns || 2;
        }
      }
    }

    let target = index;
    if (columns > 1) {
      if (direction === 'up') target = index - columns;
      else if (direction === 'down') target = index + columns;
      else if (direction === 'left') target = index - 1;
      else if (direction === 'right') target = index + 1;
    } else {
      if (direction === 'up' || direction === 'left') target = index - 1;
      else if (direction === 'down' || direction === 'right') target = index + 1;
    }

    if (target < 0 || target >= source.length) return;

    // Menambahkan debug log premium sesuai Rule 8
    console.log(`[DEBUG] moveElement Swap: menukar elemen ${elementId} (index ${index}) dengan elemen di index ${target} (direction: ${direction}, columns: ${columns})`);

    handleSaveElementOrder(sectionId, parentElementId, swapInArray(source, index, target), { keepEditorContext: keepContext });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      showToast("Menyimpan perubahan...", "info");

      if (pageId) {
        // Save for Custom Page
        const res = await fetch(`/api/storefront/pages/${pageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: JSON.stringify(sections) })
        });
        if (!res.ok) throw new Error("Gagal menyimpan halaman");
        showToast("Halaman berhasil disimpan", "success");
        setHasChanges(false);
        refreshPage();
      } else {
        // Handle Deletions for Global Sections
        if (initialSections) {
          const currentIds = sections.map(s => s.id);
          const toDelete = initialSections.filter(s => !currentIds.includes(s.id));
          await Promise.all(toDelete.map(s =>
            fetch(`/api/storefront/sections/${s.id}`, { method: "DELETE" })
          ));
        }

        // Handle Upserts (POST/PUT) for Global Sections
        const promises = sections.map((section, index) => {
          const isNew = section.id.startsWith("def-") || section.id.startsWith("new-");

          // Gabungkan elements ke dalam properti config untuk persistensi di DB
          const configWithElements = {
            ...(section.config || {}),
            elements: section.elements || []
          };

          console.log(`[Save Debug] Menyiapkan payload simpan untuk section ${section.id} (tipe: ${section.type}, isNew: ${isNew}). Elements count:`, (section.elements || []).length);

          if (isNew) {
            return fetch("/api/storefront/sections", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: section.type,
                config: configWithElements,
                order: index,
                isActive: true
              })
            });
          } else {
            return fetch(`/api/storefront/sections/${section.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: section.type,
                config: configWithElements,
                order: index,
                isActive: section.isActive
              })
            });
          }
        });

        const results = await Promise.all(promises);
        const failed = [];
        const savedSections = [...sections];

        for (let i = 0; i < results.length; i++) {
          if (!results[i].ok) {
            const errorData = await results[i].json().catch(() => ({}));
            console.error(`Gagal menyimpan komponen ${sections[i].type}:`, errorData);
            failed.push(sections[i].type);
          } else {
            const resultData = await results[i].json().catch(() => ({}));
            if (resultData && resultData.id) {
              // Jika ini section baru yang sukses di-POST, update ID-nya di local state dari response DB (CUID)
              savedSections[i] = {
                ...savedSections[i],
                id: resultData.id
              };
            }
          }
        }

        if (failed.length > 0) {
          showToast(`Gagal: ${failed.join(", ")}`, "error");
        } else {
          showToast("Perubahan berhasil disimpan", "success");
          setHasChanges(false);
          setSections(sanitizeSections(savedSections));
          refreshSections();
        }
      }
    } catch (err) {
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    await handleSave();
    showToast("Store berhasil dipublikasikan!", "success");
  };

  const handlePreview = () => {
    if (client?.slug) {
      if (pageId && customPage?.page?.slug) {
        window.open(`https://${client.slug}.stockysee.com/p/${customPage.page.slug}`, '_blank');
      } else {
        window.open(`https://${client.slug}.stockysee.com`, '_blank');
      }
    }
  };

  const renderElementTree = (
    el: SectionElement,
    depth: number,
    parentId: string | null,
    section: Section,
    siblingElements: SectionElement[],
    selfIndex: number
  ) => {
    const meta = ELEMENT_TYPE_MAP[el.type];
    const Icon = meta?.icon || Type;
    const isElActive = activeElementId === el.id && editingSection?.id === section.id;
    const isContainer = el.type === 'COLUMN' || (el.type as string) === 'CONTAINER' || (el.type as string) === 'GRID' || (el.children && el.children.length > 0);

    // Hitung indentasi visual yang rapi
    const paddingLeftClass = depth === 0 ? "pl-6" : depth === 1 ? "pl-12" : depth === 2 ? "pl-18" : "pl-24";
    const lineLeft = depth === 0 ? 10 : depth === 1 ? 16 : depth === 2 ? 22 : 28;

    if (isContainer) {
      const isColExpanded = expandedSections[el.id] ?? true;
      const childList = (el.children || []).sort((a, b) => a.order - b.order);

      return (
        <DraggableReorderItem
          key={el.id}
          value={el}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className={`${paddingLeftClass} relative`}
        >
          {() => (
            <>
              {/* Garis pandu vertikal hirarki */}
              <div className="absolute top-0 bottom-0 w-[1px] bg-zinc-800" style={{ left: `${lineLeft}px` }}></div>
              <div className={`flex items-center gap-1.5 pr-4 py-1 cursor-pointer transition-colors group ${isElActive ? 'bg-zinc-900/40 text-white border-l border-blue-400 pl-1' : 'hover:bg-zinc-900/30 text-zinc-300'}`}>
                <MoveControls
                  canMoveUp={selfIndex > 0}
                  canMoveDown={selfIndex < siblingElements.length - 1}
                  onMoveUp={(e) => { e.stopPropagation(); e.preventDefault(); moveElement(section.id, el.id, "up", parentId); }}
                  onMoveDown={(e) => { e.stopPropagation(); e.preventDefault(); moveElement(section.id, el.id, "down", parentId); }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setExpandedSections(prev => ({ ...prev, [el.id]: !isColExpanded })); }}
                  className="p-0.5 rounded transition-colors text-zinc-500 hover:text-zinc-300 relative z-10 bg-[#131316]"
                >
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isColExpanded ? 'rotate-90' : ''}`} />
                </button>
                <div
                  onClick={() => { if (shouldSuppressClick()) return; setEditingSection(section); setActiveElementId(el.id); setActivePanel('editor'); }}
                  className="flex-1 flex items-center gap-2 min-w-0"
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isElActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                  <span className={`text-[13px] truncate ${isElActive ? 'text-blue-400 font-semibold' : 'text-zinc-300 group-hover:text-white'}`}>
                    {el.config?.text ? `${meta?.label || el.type} – ${el.config.text.substring(0, 18)}...` : (meta?.label || el.type)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("[Global Tree] Menargetkan Kolom/Kontainer untuk penambahan elemen. ID:", el.id);
                    setAddingBlockToId(el.id);
                    setActiveLibraryTab('widget');
                    setIsLeftPanelOpen(true);
                    setActivePanel('library');
                  }}
                  className="p-1 rounded text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
                  title="Tambah Elemen ke Kolom/Kontainer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {el.type !== 'CART' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDeleteElement(section.id, el.id); console.log('[Builder] Deleted Container:', el.id); }}
                    className="p-1 rounded text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus Kontainer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {isColExpanded && (
                <div className="pb-0.5">
                  <Reorder.Group
                    axis="y"
                    values={childList}
                    onReorder={(newOrder) => handleSaveElementOrder(section.id, el.id, newOrder)}
                    className="w-full"
                    onClickCapture={handleContainerClickCapture}
                  >
                    {childList.map((child, childIndex) =>
                      renderElementTree(child, depth + 1, el.id, section, childList, childIndex)
                    )}
                  </Reorder.Group>
                </div>
              )}
            </>
          )}
        </DraggableReorderItem>
      );
    }

    // Jika bukan kontainer (misalnya Title, Subtitle, Divider, dll)
    const paddingLeftNon = depth === 0 ? "pl-10" : depth === 1 ? "pl-16" : depth === 2 ? "pl-22" : "pl-28";

    return (
      <DraggableReorderItem
        key={el.id}
        value={el}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => { if (shouldSuppressClick()) return; setEditingSection(section); setActiveElementId(el.id); setActivePanel('editor'); }}
        className={`flex items-center gap-1.5 pr-4 py-1 cursor-pointer transition-colors relative z-10 group ${isElActive ? 'bg-zinc-900/40 text-white border-l border-blue-400 pl-1' : 'hover:bg-zinc-900/30 text-zinc-300'} ${paddingLeftNon}`}
      >
        {() => (
          <>
            {el.type !== 'CART' && (
              <MoveControls
                canMoveUp={selfIndex > 0}
                canMoveDown={selfIndex < siblingElements.length - 1}
                onMoveUp={(e) => { e.stopPropagation(); e.preventDefault(); moveElement(section.id, el.id, "up", parentId); }}
                onMoveDown={(e) => { e.stopPropagation(); e.preventDefault(); moveElement(section.id, el.id, "down", parentId); }}
              />
            )}
            <Icon className={`w-3.5 h-3.5 shrink-0 ${isElActive ? 'text-blue-400' : 'text-zinc-500'}`} style={{ marginLeft: depth > 0 ? `${depth * 4}px` : '0px' }} />
            <span className={`text-[12px] truncate ${isElActive ? 'text-blue-400 font-semibold' : 'text-zinc-300 group-hover:text-white'}`}>
              {el.config?.text ? `${meta?.label || el.type} – ${el.config.text.substring(0, 18)}...` : (meta?.label || el.type)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setEditingSection(section);
                setActiveElementId(el.id);
                setActivePanel('editor');
              }}
              className="p-1 rounded text-amber-400 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
              title="Edit Elemen"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {el.type !== 'CART' && (
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (parentId) { handleDeleteColumnChild(section.id, parentId, el.id); } else { handleDeleteElement(section.id, el.id); } console.log('[Builder] Deleted Element:', el.id); }}
                className="p-1 rounded text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                title="Hapus Elemen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}
      </DraggableReorderItem>
    );
  };

  const isLoading = pageId ? loadingPage : loadingSections;

  // Return objek raksasa yang menampung semua state dan handlers
  return {
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
  };
}
