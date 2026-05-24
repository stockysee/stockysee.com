
const fs = require('fs');
const content = fs.readFileSync('BuilderSidebar_HEAD.tsx', 'utf8');
const startMatch = content.indexOf('export function EditorPanel');
if (startMatch !== -1) {
    let editorPanelContent = content.substring(startMatch);
    const imports = 'import React, { useState } from \'react\';\n' +
'import { \n' +
'  X, Image as ImageIcon, Link as LinkIcon, Type, MousePointer2, AlignLeft, \n' +
'  AlignCenter, AlignRight, Bold, Italic, Underline, Palette, Layout, Columns, \n' +
'  Settings2, Copy, Trash2, ArrowUp, ArrowDown, ChevronDown, Check,\n' +
'  ChevronRight, ArrowLeft, ArrowRight, CornerDownRight, Square, Box,\n' +
'  Play, Maximize2, Monitor, Smartphone, LayoutTemplate, Minus, Plus,\n' +
'  Hash, List, MousePointerClick, ToggleLeft, Video, MoveVertical, Paintbrush, RotateCcw\n' +
'} from \'lucide-react\';\n' +
'import { Section, SectionElement } from \'../types\';\n' +
'import { motion, AnimatePresence } from \'framer-motion\';\n\n';

    fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', imports + editorPanelContent);
    console.log('Successfully extracted EditorPanel.tsx from HEAD');
} else {
    console.log('Could not find EditorPanel in HEAD');
}

