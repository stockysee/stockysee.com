const fs = require('fs');
const path = require('path');

const code = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8');

function extractBlock(source, regex, componentName) {
    const match = regex.exec(source);
    if (!match) return { source, content: null };

    const startIdx = match.index;
    let braceCount = 0;
    let started = false;
    let endIdx = -1;

    for (let i = startIdx; i < source.length; i++) {
        if (source[i] === '{') { braceCount++; started = true; }
        if (source[i] === '}') { braceCount--; }

        if (started && braceCount === 0) {
            endIdx = i;
            break;
        }
    }

    if (endIdx === -1) return { source, content: null };

    const content = source.substring(startIdx, endIdx + 1);
    const newSource = source.substring(0, startIdx) + 
                      `{/* EXTRACTED ${componentName} */}\n                            <${componentName} props={props} activeElement={activeElement} />` + 
                      source.substring(endIdx + 1);
    
    return { source: newSource, content };
}

let currentCode = code;

const blocksToExtract = [
    { name: 'ColumnEditor', regex: /\{activeElement\.type === 'COLUMN' && \(/ },
    { name: 'LayoutTabEditor', regex: /\{activeElement\.type !== 'COLUMN' && activeEditorTab === 'layout' && \(/ },
    { name: 'StyleTabEditor', regex: /\{activeElement\.type !== 'COLUMN' && activeEditorTab === 'style' && \(/ },
    { name: 'AdvancedTabEditor', regex: /\{activeElement\.type !== 'COLUMN' && activeElement\.type !== 'CATEGORY_LIST' && activeElement\.type !== 'PRODUCT_LIST' && activeEditorTab === 'advanced' && \(/ }
];

const extracted = {};

for (const block of blocksToExtract) {
    const res = extractBlock(currentCode, block.regex, block.name);
    currentCode = res.source;
    extracted[block.name] = res.content;
}

// Now for Section Editor. It's the entire 'editor_false.txt' block!
// Wait, to safely replace the Section block, we can just find where `activeElement ? ( ... ) : ( ... )` happens.
// But we already did that! Let's just create the component files first!

function writeComponent(name, content) {
    if (!content) {
        console.log("NOT FOUND: ", name);
        return;
    }
    const str = `
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

export function ${name}({ props, activeElement }: { props: EditorPanelProps, activeElement: any }) {
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
    ${content}
  );
}
`;
    fs.writeFileSync('app/dashboard/storefront/builder/panels/editor/' + name + '.tsx', str);
}

for (const [name, content] of Object.entries(extracted)) {
    writeComponent(name, content);
}

// Write the main EditorPanel.tsx with new imports
let finalCode = currentCode;
const importsToAdd = `
import { ColumnEditor } from "./editor/ColumnEditor";
import { LayoutTabEditor } from "./editor/LayoutTabEditor";
import { StyleTabEditor } from "./editor/StyleTabEditor";
import { AdvancedTabEditor } from "./editor/AdvancedTabEditor";
import { SectionEditor } from "./editor/SectionEditor";
`;

finalCode = finalCode.replace('import { EditorPanelProps', importsToAdd + '\nexport interface EditorPanelProps');

// Fix SectionEditor
const startFalse = fs.readFileSync('editor_false.txt', 'utf8');
if (finalCode.includes(startFalse)) {
    finalCode = finalCode.replace(startFalse, '\n<SectionEditor props={props} activeElement={activeElement} />\n');
}

fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', finalCode);
console.log('Refactoring complete!');
