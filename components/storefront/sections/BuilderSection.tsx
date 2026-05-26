// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Type, AlignLeft, MousePointerClick, Image as ImageIcon, Minus, Award, GripVertical, Trash2, LayoutGrid, SeparatorHorizontal, Columns, Pencil, ShoppingBag, Folder, ChevronLeft, ChevronRight, Move, Menu } from "lucide-react";
import { useStorefront } from "../StorefrontProvider";
import ProductCard from "../ProductCard";
import Link from "next/link";

// ── TYPES ──
export interface SectionElement {
  id: string;
  type: 'HEADING' | 'TEXT' | 'BUTTON' | 'IMAGE' | 'SPACER' | 'BADGE' | 'GALLERY' | 'DIVIDER' | 'COLUMN' | 'BRANDING' | 'MENU' | 'CART' | 'CATEGORY_LIST' | 'PRODUCT_LIST';
  config: any;
  order: number;
  children?: SectionElement[]; // For Columns
}

// Helper to format dynamic style spacing values (px, %, vw, custom, etc.)
export const formatStyleValue = (val: any, defaultVal: number | string = 0): string | undefined => {
  if (val === undefined || val === null || val === '') {
    const fallback = typeof defaultVal === 'number' ? `${defaultVal}px` : defaultVal;
    return fallback;
  }
  if (typeof val === 'number') {
    return `${val}px`;
  }
  const str = String(val).trim();
  let result = str;
  // If it already ends with a valid CSS unit or has custom parts
  if (/^[\d.-]+(px|vw|%|rem|em|vh)$/.test(str) || ['auto', 'inherit', 'initial', 'unset'].includes(str)) {
    result = str;
  }
  // If it's multiple parts (e.g., custom value "10px 20px 10px 20px" or "10px 5%")
  else if (str.includes(' ') || str.includes(',')) {
    result = str;
  }
  // If it's a number only as string, append px
  else if (/^[\d.-]+$/.test(str)) {
    result = `${str}px`;
  }

  console.log(`[Format Spacing] Input Spacing: "${val}" -> Output Style: "${result}"`);
  return result;
};

export interface BuilderSectionConfig {
  bgColor?: string;
  bgImageUrl?: string;
  overlay?: number;
  textColor?: string;
  textAlign?: 'text-left' | 'text-center' | 'text-right';
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  maxWidth?: string;
  contentWidth?: 'boxed' | 'full';
  layout?: 'flexbox' | 'grid';
  columns?: number;
  rows?: number;
  customGridColumns?: string;
  customGridRows?: string;
  customGridClass?: string;
  placeholderCount?: number;
  showGridOutline?: boolean;
  gap?: number;
  columnGap?: number;
  rowGap?: number;
  gapLinked?: boolean;
  flexWrap?: 'nowrap' | 'wrap';
  borderRadius?: number;
  borderRadiusTop?: number;
  borderRadiusRight?: number;
  borderRadiusBottom?: number;
  borderRadiusLeft?: number;
  borderRadiusLinked?: boolean;
  borderType?: string;
  borderColor?: string;
  borderWidth?: number;
  borderWidthTop?: number;
  borderWidthRight?: number;
  borderWidthBottom?: number;
  borderWidthLeft?: number;
  boxShadow?: string;
  boxShadowType?: string;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  align?: 'left' | 'center' | 'right' | 'start' | 'end' | 'stretch';
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  // Background Extensions
  bgType?: 'classic' | 'gradient';
  bgGradientType?: 'linear' | 'radial';
  bgGradientColor1?: string;
  bgGradientColor2?: string;
  bgGradientLoc1?: number;
  bgGradientLoc2?: number;
  bgGradientAngle?: number;
  bgGradientRadialPos?: string;
  bgImageOpacity?: number;
  bgImageBlur?: number;
  // Hover configuration for borders and shadows
  hoverBorderType?: string;
  hoverBorderColor?: string;
  hoverBorderWidth?: number;
  hoverBorderWidthTop?: number;
  hoverBorderWidthRight?: number;
  hoverBorderWidthBottom?: number;
  hoverBorderWidthLeft?: number;
  hoverBorderWidthLinked?: boolean;
  hoverBorderRadius?: number;
  hoverBorderRadiusTop?: number;
  hoverBorderRadiusRight?: number;
  hoverBorderRadiusBottom?: number;
  hoverBorderRadiusLeft?: number;
  hoverBorderRadiusLinked?: boolean;
  hoverBoxShadow?: string;
  hoverBoxShadowType?: string;
  hoverShadowColor?: string;
  hoverShadowOffsetX?: number;
  hoverShadowOffsetY?: number;
  hoverShadowBlur?: number;
  hoverShadowSpread?: number;
  // Hover background
  hoverBgColor?: string;
  hoverBgType?: 'classic' | 'gradient';
  hoverBgGradientType?: 'linear' | 'radial';
  hoverBgGradientColor1?: string;
  hoverBgGradientColor2?: string;
  hoverBgGradientLoc1?: number;
  hoverBgGradientLoc2?: number;
  hoverBgGradientAngle?: number;
  hoverBgGradientRadialPos?: string;
  hoverBgImageUrl?: string;
  hoverOverlay?: number;
  // Hover transition
  hoverTransitionDuration?: number;
  // Position & stacking
  position?: 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky';
  zIndex?: number;
  sticky?: boolean;
}

export const ELEMENT_TYPE_MAP: Record<string, { label: string; icon: any; defaultConfig?: any }> = {
  HEADING: { label: 'Heading', icon: Type, defaultConfig: { fontSize: 30 } },
  TEXT: { label: 'Paragraph', icon: AlignLeft },
  BUTTON: { label: 'Button', icon: MousePointerClick },
  IMAGE: { label: 'Image', icon: ImageIcon },
  GALLERY: { label: 'Gallery', icon: LayoutGrid },
  SPACER: { label: 'Spacer', icon: Minus },
  DIVIDER: { label: 'Divider', icon: SeparatorHorizontal },
  BADGE: { label: 'Badge', icon: Award },
  COLUMN: {
    label: 'Kolom',
    icon: Columns,
    defaultConfig: {
      layout: 'flexbox',
      gap: 16,
      align: 'left',
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      paddingRight: 16,
      bgColor: 'transparent',
      borderRadius: 0
    }
  },
  BRANDING: {
    label: 'Nama & Logo Toko',
    icon: Award,
    defaultConfig: {
      fontSize: 16,
      textColor: '#18181B'
    }
  },
  MENU: {
    label: 'Menu Navigasi',
    icon: AlignLeft,
    defaultConfig: {
      fontSize: 20,
      textColor: '#18181B',
      align: 'center',
      fontFamily: 'Inter',
      hiddenMenus: []
    }
  },
  CART: {
    label: 'Tombol Keranjang',
    icon: ShoppingBag,
    defaultConfig: {
      text: 'Keranjang',
      bgColor: '#18181B',
      textColor: '#FFFFFF',
      borderRadius: 8,
      buttonType: 'Asali',
      iconType: 'none',
      iconPosition: 'before',
      iconSpacing: 4
    }
  },
  CATEGORY_LIST: {
    label: 'Daftar Kategori',
    icon: Folder,
    defaultConfig: {
      title: 'Kategori Populer',
      layout: 'slider',
      columns: 5,
      columnsMobile: 2,
      borderRadius: 9999,
      titleColor: '#18181B',
      textColor: '#18181B',
      fontSize: 14,
      titleFontSize: 22,
      fontWeight: '700',
      titleFontWeight: '700',
      align: 'center',
      showDots: true,
      showArrows: true
    }
  },
  PRODUCT_LIST: {
    label: 'Grid Produk',
    icon: ShoppingBag,
    defaultConfig: {
      title: 'Produk Pilihan',
      source: 'ALL',
      categoryId: '',
      limit: 10,
      limitMobile: 8,
      columns: 5,
      columnsMobile: 2,
      titleColor: '#18181B',
      cardBorderRadius: 8,
      showStock: true,
      showComparePrice: true,
      titleFontSize: 22,
      productNameFontSize: 17,
      priceFontWeight: '700',
      stockFontWeight: '800'
    }
  }
};

// ── HEADING ELEMENT ──
const HeadingElement = ({ config }: { config: any }) => {
  const Tag = config.tag || 'h2';
  const sizeMap: Record<string, string> = {
    h1: 'text-3xl md:text-4xl font-extrabold tracking-tight',
    h2: 'text-2xl md:text-3xl font-bold tracking-tight',
    h3: 'text-xl md:text-2xl font-bold',
    h4: 'text-lg md:text-xl font-semibold',
  };
  const finalColor = config.textColor || config.color || '#18181b';
  
  // Custom styles parsing
  const textStrokeStyle = config.textStrokeWidth !== undefined && config.textStrokeWidth > 0
    ? `${config.textStrokeWidth}px ${config.textStrokeColor || '#000000'}`
    : undefined;

  const textShadowStyle = (config.textShadowColor || config.textShadowBlur !== undefined || config.textShadowOffsetX !== undefined || config.textShadowOffsetY !== undefined)
    ? `${config.textShadowOffsetX || 0}px ${config.textShadowOffsetY || 0}px ${config.textShadowBlur || 0}px ${config.textShadowColor || 'rgba(0,0,0,0.5)'}`
    : undefined;

  console.log(`[BuilderSection Heading Debug] Rendering Heading: "${config.text || 'Awesome Heading'}", Color: "${finalColor}", Stroke: "${textStrokeStyle}", Shadow: "${textShadowStyle}"`);
  
  // Base style untuk element Heading
  const headingStyle: React.CSSProperties = {
    color: finalColor,
    fontFamily: config.fontFamily || 'inherit',
    fontSize: config.fontSize || undefined,
    fontWeight: config.fontWeight || '700',
    textAlign: config.align || 'left',
    letterSpacing: config.letterSpacing || '0px',
    lineHeight: config.lineHeight || '1.2',
    textTransform: config.textTransform || 'none',
    fontStyle: config.fontStyle || 'normal',
    textDecoration: config.textDecoration || 'none',
    wordSpacing: config.wordSpacing || '0px',
    WebkitTextStroke: textStrokeStyle,
    textShadow: textShadowStyle,
    mixBlendMode: config.mixBlendMode || 'normal',
    
    // Background properties
    backgroundColor: config.bgColor || 'transparent',
    
    // Border Radius
    borderTopLeftRadius: config.bgBorderRadiusTopLeft !== undefined ? `${config.bgBorderRadiusTopLeft}px` : (config.bgBorderRadius !== undefined ? `${config.bgBorderRadius}px` : undefined),
    borderTopRightRadius: config.bgBorderRadiusTopRight !== undefined ? `${config.bgBorderRadiusTopRight}px` : (config.bgBorderRadius !== undefined ? `${config.bgBorderRadius}px` : undefined),
    borderBottomRightRadius: config.bgBorderRadiusBottomRight !== undefined ? `${config.bgBorderRadiusBottomRight}px` : (config.bgBorderRadius !== undefined ? `${config.bgBorderRadius}px` : undefined),
    borderBottomLeftRadius: config.bgBorderRadiusBottomLeft !== undefined ? `${config.bgBorderRadiusBottomLeft}px` : (config.bgBorderRadius !== undefined ? `${config.bgBorderRadius}px` : undefined),
    
    // Padding
    paddingTop: config.bgPaddingTop !== undefined ? `${config.bgPaddingTop}px` : (config.bgPaddingY !== undefined ? `${config.bgPaddingY}px` : undefined),
    paddingBottom: config.bgPaddingBottom !== undefined ? `${config.bgPaddingBottom}px` : (config.bgPaddingY !== undefined ? `${config.bgPaddingY}px` : undefined),
    paddingLeft: config.bgPaddingLeft !== undefined ? `${config.bgPaddingLeft}px` : (config.bgPaddingX !== undefined ? `${config.bgPaddingX}px` : undefined),
    paddingRight: config.bgPaddingRight !== undefined ? `${config.bgPaddingRight}px` : (config.bgPaddingX !== undefined ? `${config.bgPaddingX}px` : undefined),
    
    // Border Type, Width & Color
    borderStyle: config.bgBorderType && config.bgBorderType !== 'none' ? config.bgBorderType : undefined,
    borderTopWidth: config.bgBorderWidthTop !== undefined ? formatStyleValue(config.bgBorderWidthTop) : (config.bgBorderWidth !== undefined ? formatStyleValue(config.bgBorderWidth) : undefined),
    borderRightWidth: config.bgBorderWidthRight !== undefined ? formatStyleValue(config.bgBorderWidthRight) : (config.bgBorderWidth !== undefined ? formatStyleValue(config.bgBorderWidth) : undefined),
    borderBottomWidth: config.bgBorderWidthBottom !== undefined ? formatStyleValue(config.bgBorderWidthBottom) : (config.bgBorderWidth !== undefined ? formatStyleValue(config.bgBorderWidth) : undefined),
    borderLeftWidth: config.bgBorderWidthLeft !== undefined ? formatStyleValue(config.bgBorderWidthLeft) : (config.bgBorderWidth !== undefined ? formatStyleValue(config.bgBorderWidth) : undefined),
    borderColor: config.bgBorderColor || undefined,
    
    // Box Shadow
    boxShadow: config.bgBoxShadow || undefined,
    
    // Width & Display
    display: config.bgWidth === 'fit' ? 'inline-block' : 'block',
    width: config.bgWidth === 'fit' ? 'auto' : '100%',
  };

  const content = (
    <Tag
      className={`${config.fontSize ? '' : (sizeMap[Tag] || 'text-2xl')} transition-all`}
      style={headingStyle}
    >
      {config.text || 'Awesome Heading'}
    </Tag>
  );

  // Jika Lebar Latar adalah "Sesuai Teks" (fit), bungkus dengan div beralignment agar posisi teks tetap di kiri/tengah/kanan kolom kontainer dengan benar
  if (config.bgWidth === 'fit') {
    return (
      <div 
        className="w-full animate-in fade-in duration-200"
        style={{ 
          textAlign: config.align || 'left'
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

// ── TEXT ELEMENT ──
const TextElement = ({ config, elementId }: { config: any, elementId?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const finalId = elementId ? `text-el-${elementId}` : `text-el-${Math.random().toString(36).substr(2, 9)}`;

  const textColor = isHovered 
    ? (config.hoverTextColor || config.textColor || '#4b5563') 
    : (config.textColor || '#4b5563');

  const textShadow = config.textShadowColor && config.textShadowColor !== 'transparent'
    ? `${config.textShadowOffsetX || 0}px ${config.textShadowOffsetY || 0}px ${config.textShadowBlur || 0}px ${config.textShadowColor}`
    : 'none';

  const defaultLinkColor = config.linkColor || '#2563eb';
  const defaultHoverLinkColor = config.hoverLinkColor || config.linkColor || '#1d4ed8';

  const htmlContent = config.text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  useEffect(() => {
    console.log(`[TextElement Debug] ID: ${finalId}, isHovered: ${isHovered}, textColor: ${textColor}, textShadow: ${textShadow}, linkColor: ${defaultLinkColor}, hoverLinkColor: ${defaultHoverLinkColor}`);
  }, [finalId, isHovered, textColor, textShadow, defaultLinkColor, defaultHoverLinkColor]);

  return (
    <>
      <style>{`
        #${finalId} {
          transition: color ${config.transitionDuration ?? 0.3}s ease;
        }
        #${finalId} a {
          color: ${defaultLinkColor} !important;
          transition: color ${config.transitionDuration ?? 0.3}s ease;
        }
        #${finalId} a:hover {
          color: ${defaultHoverLinkColor} !important;
        }
        ${config.dropCap ? `
        #${finalId}::first-letter {
          font-size: 3.2em;
          float: left;
          line-height: 0.85;
          margin-top: 0.1em;
          margin-right: 0.08em;
          font-weight: bold;
          color: inherit;
        }
        ` : ''}
      `}</style>
      <p
        id={finalId}
        className="leading-relaxed"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          fontSize: typeof config.fontSize === 'number' ? `${config.fontSize}px` : (config.fontSize || '16px'),
          fontWeight: config.fontWeight || 'normal',
          color: textColor,
          textAlign: config.align || 'left',
          lineHeight: typeof config.lineHeight === 'number' ? String(config.lineHeight) : (config.lineHeight || '1.6'),
          fontFamily: config.fontFamily || 'inherit',
          textTransform: config.textTransform || 'none',
          fontStyle: config.fontStyle || 'normal',
          textDecoration: config.textDecoration || 'none',
          letterSpacing: config.letterSpacing || '0px',
          wordSpacing: config.wordSpacing || '0px',
          marginBottom: `${config.paragraphSpacing ?? 16}px`,
          textShadow: textShadow,
          columnCount: config.columns ? Number(config.columns) : undefined,
          columnGap: config.columnGap || undefined,
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </>
  );
};

// ── BUTTON ELEMENT ──
const ButtonElement = ({ config }: { config: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverClassRef = useRef(`bh_${Math.random().toString(36).substr(2, 8)}`);

  useEffect(() => {
    console.log(`[Button Hover State Debug] isHovered: ${isHovered}, hoverBgColor: ${config.hoverBgColor}, hoverTextColor: ${config.hoverTextColor}, hoverBorderColor: ${config.hoverBorderColor}`);
  }, [isHovered, config.hoverBgColor, config.hoverTextColor, config.hoverBorderColor]);

  // Build CSS hover string using simple concatenation (no nested templates to avoid parser issues)
  const hoverStyles: string[] = [];
  if (config.hoverBgColor) hoverStyles.push('background-color:' + config.hoverBgColor + '!important');
  if (config.hoverTextColor) hoverStyles.push('color:' + config.hoverTextColor + '!important');
  if (config.hoverBorderColor) hoverStyles.push('border-color:' + config.hoverBorderColor + '!important');
  if (config.hoverBgType === 'gradient' && config.hoverGradientStart && config.hoverGradientEnd) {
    const a = config.hoverGradientAngle || '90deg';
    hoverStyles.push('background:linear-gradient(' + a + ',' + config.hoverGradientStart + ',' + config.hoverGradientEnd + ')!important');
  }
  if (config.hoverBoxShadowOffsetX !== undefined || config.hoverBoxShadowBlur !== undefined) {
    const sx = config.hoverBoxShadowOffsetX ?? config.boxShadowOffsetX ?? 0;
    const sy = config.hoverBoxShadowOffsetY ?? config.boxShadowOffsetY ?? 0;
    const bl = config.hoverBoxShadowBlur ?? config.boxShadowBlur ?? 0;
    const sc = config.hoverBoxShadowColor || config.boxShadowColor || 'rgba(0,0,0,0.15)';
    hoverStyles.push('box-shadow:' + sx + 'px ' + sy + 'px ' + bl + 'px ' + sc + '!important');
  }

  // Base (non-hover) background — CSS :hover overrides for hover state
  let backgroundStyle: string | undefined = undefined;
  let backgroundColorStyle: string | undefined = undefined;

  if (config.bgType === 'gradient') {
    backgroundStyle = `linear-gradient(${config.gradientAngle || '90deg'}, ${config.gradientStart || '#3b82f6'}, ${config.gradientEnd || '#8b5cf6'})`;
  } else {
    backgroundColorStyle = config.bgColor || '#2563eb';
  }

  // Bayangan Tombol (Box Shadow) — base values; CSS :hover overrides for hover
  const boxShadowStyle = (config.boxShadowColor || config.boxShadowBlur !== undefined || config.boxShadowOffsetX !== undefined || config.boxShadowOffsetY !== undefined)
    ? `${config.boxShadowOffsetX ?? 0}px ${config.boxShadowOffsetY ?? 0}px ${config.boxShadowBlur ?? 0}px ${config.boxShadowColor || 'rgba(0,0,0,0.15)'}`
    : undefined;

  // Bayangan Teks (Text Shadow)
  const currentTextShadowColor = isHovered 
    ? (config.hoverTextShadowColor || config.textShadowColor)
    : config.textShadowColor;
  const currentTextShadowBlur = isHovered
    ? (config.hoverTextShadowBlur ?? config.textShadowBlur)
    : config.textShadowBlur;
  const currentTextShadowOffsetX = isHovered
    ? (config.hoverTextShadowOffsetX ?? config.textShadowOffsetX)
    : config.textShadowOffsetX;
  const currentTextShadowOffsetY = isHovered
    ? (config.hoverTextShadowOffsetY ?? config.textShadowOffsetY)
    : config.textShadowOffsetY;

  const textShadowStyle = (currentTextShadowColor || currentTextShadowBlur !== undefined || currentTextShadowOffsetX !== undefined || currentTextShadowOffsetY !== undefined)
    ? `${currentTextShadowOffsetX || 0}px ${currentTextShadowOffsetY || 0}px ${currentTextShadowBlur || 0}px ${currentTextShadowColor || 'rgba(0,0,0,0.15)'}`
    : undefined;

  // Stroke Teks (Text Stroke)
  const currentTextStrokeWidth = isHovered 
    ? (config.hoverTextStrokeWidth ?? config.textStrokeWidth ?? 0) 
    : (config.textStrokeWidth ?? 0);
  const currentTextStrokeColor = isHovered 
    ? (config.hoverTextStrokeColor || config.textStrokeColor || '#000000') 
    : (config.textStrokeColor || '#000000');
  
  const textStrokeStyle = currentTextStrokeWidth 
    ? `${currentTextStrokeWidth}px ${currentTextStrokeColor}` 
    : undefined;

  // Animasi & Transform Sorotan
  let transformStyle: string | undefined = undefined;
  let animationStyle: string | undefined = undefined;

  if (isHovered) {
    if (config.hoverAnimation === 'grow') {
      transformStyle = 'scale(1.05)';
    } else if (config.hoverAnimation === 'shrink') {
      transformStyle = 'scale(0.95)';
    } else if (config.hoverAnimation === 'shift-up') {
      transformStyle = 'translateY(-4px)';
    } else if (config.hoverAnimation === 'shift-down') {
      transformStyle = 'translateY(4px)';
    } else if (config.hoverAnimation === 'rotate') {
      transformStyle = 'rotate(2deg) scale(1.02)';
    } else if (config.hoverAnimation === 'pulse') {
      animationStyle = 'btn-pulse-anim 1s infinite ease-in-out';
    } else if (config.hoverAnimation === 'glow') {
      animationStyle = 'btn-glow-anim 1.5s infinite ease-in-out';
    }
  }

  // Durasi Transisi
  const durationVal = config.transitionDuration ?? 0.2;
  const durationUnit = config.transitionDurationUnit || 's';
  const transitionDurationStyle = `${durationVal}${durationUnit}`;

  useEffect(() => {
    console.log("[BuilderSection ButtonElement Debug] Rendering button with styles:", {
      id: config.elementId,
      fontFamily: config.fontFamily,
      fontSize: `${config.fontSize ?? 16}${config.fontSizeUnit || 'px'}`,
      fontWeight: config.fontWeight,
      textTransform: config.textTransform,
      fontStyle: config.fontStyle,
      textDecoration: config.textDecoration,
      lineHeight: config.lineHeight ? `${config.lineHeight}${config.lineHeightUnit || ''}` : undefined,
      letterSpacing: config.letterSpacing ? `${config.letterSpacing}${config.letterSpacingUnit || 'px'}` : undefined,
      wordSpacing: config.wordSpacing ? `${config.wordSpacing}${config.wordSpacingUnit || 'px'}` : undefined,
      textShadow: textShadowStyle,
      textStroke: textStrokeStyle,
    });
  }, [
    config.elementId,
    config.fontFamily,
    config.fontSize,
    config.fontSizeUnit,
    config.fontWeight,
    config.textTransform,
    config.fontStyle,
    config.textDecoration,
    config.lineHeight,
    config.lineHeightUnit,
    config.letterSpacing,
    config.letterSpacingUnit,
    config.wordSpacing,
    config.wordSpacingUnit,
    textShadowStyle,
    textStrokeStyle
  ]);

  return (
    <div className="w-full" style={{ textAlign: config.align || 'left' }}>
      {/* Dynamic Keyframes & Hover Style Block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes btn-pulse-anim {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes btn-glow-anim {
          0%, 100% { box-shadow: 0 0 5px ${config.hoverBorderColor || config.hoverBgColor || '#2563eb'}; }
          50% { box-shadow: 0 0 20px ${config.hoverBorderColor || config.hoverBgColor || '#2563eb'}; }
        }
        ${hoverStyles.length > 0 ? '.' + hoverClassRef.current + ':hover { ' + hoverStyles.join('; ') + ' }' : ''}
      ` }} />
      <a
        id={config.elementId || undefined}
        href={config.url || '#'}
        target={config.targetLink || '_self'}
        onClick={(e) => e.preventDefault()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${hoverClassRef.current} pointer-events-auto inline-flex items-center justify-center transition-all hover:opacity-90 active:scale-95`}
        style={{
          background: backgroundStyle,
          backgroundColor: backgroundColorStyle,
          color: config.textColor || '#ffffff',
          paddingTop: formatStyleValue(config.paddingY, 12),
          paddingBottom: formatStyleValue(config.paddingY, 12),
          paddingLeft: formatStyleValue(config.paddingX, 24),
          paddingRight: formatStyleValue(config.paddingX, 24),
          borderRadius: `${config.borderRadius ?? 8}px`,
          fontSize: `${config.fontSize ?? 16}${config.fontSizeUnit || 'px'}`,
          fontFamily: config.fontFamily || 'inherit',
          fontWeight: config.fontWeight || '700',
          textTransform: config.textTransform || 'none',
          fontStyle: config.fontStyle || 'normal',
          textDecoration: config.textDecoration || 'none',
          lineHeight: config.lineHeight !== undefined ? `${config.lineHeight}${config.lineHeightUnit || ''}` : undefined,
          letterSpacing: config.letterSpacing !== undefined ? `${config.letterSpacing}${config.letterSpacingUnit || 'px'}` : undefined,
          wordSpacing: config.wordSpacing !== undefined ? `${config.wordSpacing}${config.wordSpacingUnit || 'px'}` : undefined,
          border: config.borderWidth ? `${config.borderWidth}px ${config.borderStyle || 'solid'} ${config.borderColor || '#2563eb'}` : 'none',
          width: config.fullWidth ? '100%' : undefined,
          boxShadow: boxShadowStyle,
          textShadow: textShadowStyle,
          WebkitTextStroke: textStrokeStyle,
          gap: `${config.iconSpacing ?? 4}${config.iconSpaceUnit || 'px'}`,
          transform: transformStyle,
          animation: animationStyle,
          transitionDuration: transitionDurationStyle,
        }}
      >
        {config.iconType === 'custom' && (config.customIconSvg || config.icon) && (config.iconPosition || 'before') === 'before' && (
          config.iconColor ? (
            <span
              style={{
                display: 'inline-block',
                width: config.iconSize || 20,
                height: config.iconSize || 20,
                backgroundColor: config.iconColor,
                mask: `url(${config.customIconSvg || config.icon}) center/contain no-repeat`,
                WebkitMask: `url(${config.customIconSvg || config.icon}) center/contain no-repeat`,
              }}
              className="shrink-0"
            />
          ) : (
            <img src={config.customIconSvg || config.icon} alt="icon" className="object-contain shrink-0" style={{ width: config.iconSize || 20, height: config.iconSize || 20 }} />
          )
        )}
        <span>{config.text || 'Click Me'}</span>
        {config.iconType === 'custom' && (config.customIconSvg || config.icon) && config.iconPosition === 'after' && (
          config.iconColor ? (
            <span
              style={{
                display: 'inline-block',
                width: config.iconSize || 20,
                height: config.iconSize || 20,
                backgroundColor: config.iconColor,
                mask: `url(${config.customIconSvg || config.icon}) center/contain no-repeat`,
                WebkitMask: `url(${config.customIconSvg || config.icon}) center/contain no-repeat`,
              }}
              className="shrink-0"
            />
          ) : (
            <img src={config.customIconSvg || config.icon} alt="icon" className="object-contain shrink-0" style={{ width: config.iconSize || 20, height: config.iconSize || 20 }} />
          )
        )}
      </a>
    </div>
  );
};

// ── IMAGE ELEMENT ──
const ImageElement = ({ config }: { config: any }) => {
  useEffect(() => {
    console.log(`[BuilderSection Image Debug] width: ${config.width}, height: ${config.height}, clickUrl: ${config.clickUrl}`);
  }, [config.width, config.height, config.clickUrl]);

  // CSS Filters
  const filters = [];
  if (config.blur !== undefined && config.blur > 0) filters.push(`blur(${config.blur}px)`);
  if (config.brightness !== undefined && config.brightness !== 100) filters.push(`brightness(${config.brightness}%)`);
  if (config.contrast !== undefined && config.contrast !== 100) filters.push(`contrast(${config.contrast}%)`);
  if (config.saturate !== undefined && config.saturate !== 100) filters.push(`saturate(${config.saturate}%)`);
  if (config.hueRotate !== undefined && config.hueRotate > 0) filters.push(`hue-rotate(${config.hueRotate}deg)`);
  const filterString = filters.length > 0 ? filters.join(' ') : undefined;

  // Opacity
  const opacityValue = config.opacity !== undefined ? config.opacity / 100 : undefined;

  // Custom Border Radius
  const unit = config.borderRadiusUnit || 'px';
  const borderRadiusStyle = config.borderRadiusType === 'custom'
    ? `${config.borderRadiusTop ?? config.borderRadius ?? 0}${unit} ${config.borderRadiusRight ?? config.borderRadius ?? 0}${unit} ${config.borderRadiusBottom ?? config.borderRadius ?? 0}${unit} ${config.borderRadiusLeft ?? config.borderRadius ?? 0}${unit}`
    : `${config.borderRadius ?? 0}px`;

  // Custom Box Shadow
  let boxShadowStyle = 'none';
  if (config.boxShadowType === 'custom') {
    boxShadowStyle = `${config.shadowOffsetX ?? 0}px ${config.shadowOffsetY ?? 0}px ${config.shadowBlur ?? 10}px ${config.shadowSpread ?? 0}px ${config.shadowColor || 'rgba(0,0,0,0.5)'}`;
  } else {
    const shadowVal = config.shadow || config.boxShadow || 'none';
    boxShadowStyle = shadowVal === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' 
      : shadowVal === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
      : shadowVal === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
      : shadowVal === 'hover-glow' ? '0 10px 15px -3px rgba(59, 130, 246, 0.4)' 
      : 'none';
  }

  // Border Style
  const unitW = config.borderWidthUnit || 'px';
  const borderTop = config.borderStyle && config.borderStyle !== 'none'
    ? `${config.borderWidthTop ?? config.borderWidth ?? 1}${unitW} ${config.borderStyle} ${config.borderColor || '#000000'}`
    : 'none';
  const borderRight = config.borderStyle && config.borderStyle !== 'none'
    ? `${config.borderWidthRight ?? config.borderWidth ?? 1}${unitW} ${config.borderStyle} ${config.borderColor || '#000000'}`
    : 'none';
  const borderBottom = config.borderStyle && config.borderStyle !== 'none'
    ? `${config.borderWidthBottom ?? config.borderWidth ?? 1}${unitW} ${config.borderStyle} ${config.borderColor || '#000000'}`
    : 'none';
  const borderLeft = config.borderStyle && config.borderStyle !== 'none'
    ? `${config.borderWidthLeft ?? config.borderWidth ?? 1}${unitW} ${config.borderStyle} ${config.borderColor || '#000000'}`
    : 'none';

  const imageStyles: React.CSSProperties = {
    width: formatStyleValue(config.width, '100%'),
    height: formatStyleValue(config.height, '100%'),
    objectFit: 'cover',
    borderRadius: borderRadiusStyle,
    boxShadow: boxShadowStyle,
    borderTop: borderTop,
    borderRight: borderRight,
    borderBottom: borderBottom,
    borderLeft: borderLeft,
    filter: filterString,
    opacity: opacityValue,
  };

  const imageContent = (
    <img
      src={config.url || '/placeholder-gambar.png'}
      alt={config.alt || 'Visual Storefront'}
      className="max-w-full w-full h-full transition-all"
      style={imageStyles}
    />
  );

  return (
    <div
      className="w-full h-full flex transition-all"
      style={{
        justifyContent: config.align === 'center' ? 'center' : config.align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      {config.clickUrl ? (
        <a 
          href={config.clickUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full h-full max-w-full hover:opacity-95 transition-opacity"
        >
          {imageContent}
        </a>
      ) : (
        imageContent
      )}
    </div>
  );
};

// ── GALLERY ELEMENT ──
const GalleryElement = ({ config }: { config: any }) => {
  const images = config.images || [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=60',
  ];

  const getGridColumnsCount = () => {
    const cols = config.columns || 3;
    const layout = config.gridLayout || 'auto';
    if (layout === 'auto') return cols;
    const parts = layout.split('x');
    if (parts.length === 2) {
      const c = parseInt(parts[0]);
      if (!isNaN(c)) return c;
    }
    return cols;
  };

  const formatDimension = (val: any) => {
    if (!val) return undefined;
    const str = String(val).trim();
    if (/^\d+$/.test(str)) return `${str}px`;
    return str;
  };

  const columnsCount = getGridColumnsCount();
  const isKhusus = config.resolutionMode === 'khusus';

  // Compute gap value based on mode
  const effectiveGap = config.gapMode === 'khusus' ? (config.gap ?? 15) : 16;

  // Compute border radius per-corner
  const radiusUnit = config.borderRadiusUnit || 'px';
  const fallbackRadius = config.borderRadius !== undefined ? `${config.borderRadius}${radiusUnit}` : '0';
  const brTop = config.borderRadiusTop !== undefined ? `${config.borderRadiusTop}${radiusUnit}` : fallbackRadius;
  const brRight = config.borderRadiusRight !== undefined ? `${config.borderRadiusRight}${radiusUnit}` : fallbackRadius;
  const brBottom = config.borderRadiusBottom !== undefined ? `${config.borderRadiusBottom}${radiusUnit}` : fallbackRadius;
  const brLeft = config.borderRadiusLeft !== undefined ? `${config.borderRadiusLeft}${radiusUnit}` : fallbackRadius;
  const borderRadiusStr = [brTop, brRight, brBottom, brLeft].every(v => v === 'inherit') 
    ? 'inherit' 
    : `${brTop} ${brRight} ${brBottom} ${brLeft}`;

  // Border style (Asali = no explicit border, none = none, others = 1px <style> transparent)
  const effectiveBorderStyle = config.borderStyle || 'Asali';

  // Rule 8: Debug log to verify successful rendering/configuration propagation
  console.log(`[GalleryElement] Rendered. Columns: ${columnsCount}, Layout: ${config.gridLayout || 'auto'}, ResolutionMode: ${config.resolutionMode || 'auto'}, Gap: ${effectiveGap}, BorderRadius: ${borderRadiusStr}, BorderStyle: ${effectiveBorderStyle}`);

  return (
    <div
      className="grid w-full h-full transition-all justify-items-center"
      style={{
        gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
        gap: `${effectiveGap}px`,
      }}
    >
      {images.map((img: string, idx: number) => {
        const imgStyle: React.CSSProperties = {
          borderRadius: borderRadiusStr,
          width: isKhusus && config.imageWidth ? formatDimension(config.imageWidth) : '100%',
          height: isKhusus && config.imageHeight ? formatDimension(config.imageHeight) : '100%',
          minHeight: isKhusus && config.imageHeight ? undefined : '12rem',
          objectFit: 'cover',
          ...(effectiveBorderStyle !== 'Asali' && effectiveBorderStyle !== 'none'
            ? { border: `1px ${effectiveBorderStyle} rgba(255,255,255,0.15)` }
            : effectiveBorderStyle === 'none'
              ? { border: 'none' }
              : {}),
        };

        return (
          <div key={idx} className="flex justify-center items-center overflow-hidden w-full h-full">
            <img
              src={img}
              alt={`Gallery item ${idx + 1}`}
              className="transition-all hover:scale-[1.02]"
              style={imgStyle}
            />
          </div>
        );
      })}
    </div>
  );
};

// ── SPACER ELEMENT ──
const SpacerElement = ({ config }: { config: any }) => (
  <div style={{ height: `${config.height ?? 40}px` }} className="w-full" />
);

// ── DIVIDER ELEMENT ──
const DividerElement = ({ config }: { config: any }) => (
  <div className="w-full flex transition-all">
    <div
      style={{
        width: config.width || '100%',
        borderTop: `${config.thickness ?? 1}px ${config.style || 'solid'} ${config.color || '#e5e7eb'}`,
        margin: config.align === 'center' ? '0 auto' : config.align === 'right' ? '0 0 0 auto' : '0 auto 0 0',
      }}
    />
  </div>
);

// ── BADGE ELEMENT ──
const BadgeElement = ({ config }: { config: any }) => (
  <div
    className="w-full flex transition-all"
    style={{
      justifyContent: config.align === 'center' ? 'center' : config.align === 'right' ? 'flex-end' : 'flex-start',
    }}
  >
    <span
      className="inline-flex items-center font-black uppercase tracking-wider text-[9px] px-2.5 py-1 transition-all"
      style={{
        backgroundColor: config.bgColor || '#eff6ff',
        color: config.textColor || '#1d4ed8',
        borderRadius: `${config.borderRadius ?? 9999}px`,
        fontFamily: config.fontFamily || 'inherit',
      }}
    >
      {config.text || 'Featured'}
    </span>
  </div>
);

// ── BRANDING ELEMENT (Logo & Toko) ──
interface BrandingElementProps {
  config: any;
  readOnly?: boolean;
  onElementSelect?: (id: string, subFocus?: string | null) => void;
  elementId?: string;
  activeSubFocus?: string | null;
  isActive?: boolean;
}

const BrandingElement = ({ config, readOnly, onElementSelect, elementId, activeSubFocus, isActive }: BrandingElementProps) => {
  const sf = useStorefront();
  const name = sf?.client?.name || "Nama Toko";
  const logo = sf?.client?.logoUrl;

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isPathMode = pathname?.includes(`/storefront/${sf?.client?.slug}`);
  const baseLink = isPathMode ? `/storefront/${sf?.client?.slug}` : "";

  const showBuilderUI = !readOnly;

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!showBuilderUI || !onElementSelect || !elementId) return;
    e.stopPropagation();
    onElementSelect(elementId, null);
  };

  const handleSubFocusClick = (e: React.MouseEvent, focusType: string) => {
    if (!showBuilderUI || !onElementSelect || !elementId) return;
    e.stopPropagation();
    onElementSelect(elementId, focusType);
  };

  const hoverLogoClass = !readOnly ? 'hover:outline-dashed hover:outline-2 hover:outline-blue-500/40 hover:scale-105 transition-all' : '';
  const hoverTextClass = !readOnly ? 'hover:outline-dashed hover:outline-1 hover:outline-blue-500/40 rounded px-1 transition-all' : '';

  // Debug log untuk Aturan 8
  useEffect(() => {
    console.log("[BrandingElement Debug] Loaded:", { name, logo, readOnly });
  }, [name, logo, readOnly]);

  // Baca config logo
  const logoSize = config.logoSize ?? 40;
  const logoShape = config.logoShape ?? 'circle';
  const logoRadius = logoShape === 'circle' ? 9999 : logoShape === 'rounded' ? 8 : 0;
  const logoBgColor = config.logoBgColor || 'transparent';

  // Config gaya baru (identik IMAGE)
  const logoOpacity = config.logoOpacity !== undefined ? config.logoOpacity / 100 : 1;
  const logoCssFilter = [
    config.logoBlur > 0 ? `blur(${config.logoBlur}px)` : '',
    config.logoBrightness !== undefined && config.logoBrightness !== 100 ? `brightness(${config.logoBrightness}%)` : '',
    config.logoContrast !== undefined && config.logoContrast !== 100 ? `contrast(${config.logoContrast}%)` : '',
    config.logoSaturate !== undefined && config.logoSaturate !== 100 ? `saturate(${config.logoSaturate}%)` : '',
    config.logoHueRotate > 0 ? `hue-rotate(${config.logoHueRotate}deg)` : '',
  ].filter(Boolean).join(' ') || undefined;

  const logoBorderRadius = (() => {
    const unit = config.logoBorderRadiusUnit || 'px';
    const tl = config.logoBorderRadiusTop ?? config.logoBorderRadius ?? logoRadius;
    const tr = config.logoBorderRadiusRight ?? config.logoBorderRadius ?? logoRadius;
    const br = config.logoBorderRadiusBottom ?? config.logoBorderRadius ?? logoRadius;
    const bl = config.logoBorderRadiusLeft ?? config.logoBorderRadius ?? logoRadius;
    // Jika ada key radius per-sudut diset, gunakan shorthand per-sudut; jika tidak, pakai logoRadius (dari logoShape)
    const hasCustomRadius = config.logoBorderRadiusTop !== undefined || config.logoBorderRadius !== undefined;
    if (!hasCustomRadius) return logoRadius;
    return `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}`;
  })();

  const logoBoxShadow = config.logoBoxShadowType === 'custom'
    ? `${config.logoShadowOffsetX ?? 0}px ${config.logoShadowOffsetY ?? 4}px ${config.logoShadowBlur ?? 2}px ${config.logoShadowSpread ?? 0}px ${config.logoShadowColor || 'rgba(0,0,0,0.5)'}`
    : (config.logoBoxShadow && config.logoBoxShadow !== 'none' ? config.logoBoxShadow : (config.logoBorderStyle && config.logoBorderStyle !== 'none' ? undefined : '0 1px 2px 0 rgba(0,0,0,0.05)'));
  const logoBorder = config.logoBorderStyle && config.logoBorderStyle !== 'none'
    ? `${parseInt(String(config.logoBorderWidth || '1')) || 1}${config.logoBorderWidthUnit || 'px'} ${config.logoBorderStyle} ${config.logoBorderColor || '#e4e4e7'}`
    : '1px solid rgba(228,228,231,0.8)';

  // Tag HTML untuk nama toko
  const TextTag = (config.textTag || 'span') as keyof JSX.IntrinsicElements;

  const content = (
    <div
      className="flex items-center gap-3.5"
      style={{
        justifyContent: config.align === 'center' ? 'center' : config.align === 'right' ? 'flex-end' : 'flex-start',
      }}
      onClick={showBuilderUI ? handleContainerClick : undefined}
    >
      {logo ? (
        <img
          src={logo}
          alt={name}
          className={`cursor-pointer transition-all duration-200 ${
            isActive && activeSubFocus === 'logo'
              ? 'outline outline-2 outline-blue-500/60 scale-105 shadow-md'
              : hoverLogoClass
          }`}
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: logoBorderRadius,
            backgroundColor: logoBgColor,
            objectFit: 'contain',
            border: logoBorder,
            boxShadow: logoBoxShadow,
            opacity: logoOpacity,
            filter: logoCssFilter,
            flexShrink: 0,
          }}
          onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'logo') : undefined}
        />
      ) : (
        <div
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: logoBorderRadius,
            backgroundColor: logoBgColor !== 'transparent' ? logoBgColor : undefined,
            border: logoBorder,
            boxShadow: logoBoxShadow,
            opacity: logoOpacity,
            filter: logoCssFilter,
            flexShrink: 0,
          }}
          className={`bg-indigo-500/10 flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200 ${
            isActive && activeSubFocus === 'logo'
              ? 'outline outline-2 outline-blue-500/60 scale-105 shadow-md'
              : hoverLogoClass
          }`}
          onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'logo') : undefined}
        >
          <span className="text-indigo-600 text-sm font-black uppercase tracking-wider">{name.substring(0, 2)}</span>
        </div>
      )}
      <TextTag
        className={`font-extrabold tracking-tight transition-all duration-200 cursor-pointer ${
          isActive && activeSubFocus === 'text'
            ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded px-1 scale-105 shadow-sm'
            : hoverTextClass
        }`}
        style={{
          fontSize: config.fontSize ? `${config.fontSize}px` : '16px',
          color: config.textColor || '#18181B',
          fontFamily: config.fontFamily || 'inherit',
          fontWeight: config.fontWeight || undefined,
          fontStyle: config.fontStyle || undefined,
          textTransform: config.textTransform as any || undefined,
          letterSpacing: config.letterSpacing || undefined,
          textAlign: config.textAlign as any || undefined,
        }}
        onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'text') : undefined}
      >
        {name}
      </TextTag>
    </div>
  );

  if (readOnly) {
    return (
      <Link href={baseLink || "/"} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

// ── MENU ELEMENT ──
const MenuElement = ({ config, readOnly }: { config: any; readOnly?: boolean }) => {
  const sf = useStorefront();
  const defaultTabs = [
    { id: 'catalog', label: 'Katalog', url: '/category/all' },
    { id: 'categories', label: 'Kategori', url: '/#kategori' }
  ];
  const customPages = sf?.customPages || [];
  const customTabs = customPages.map((p: any) => ({
    id: p.slug || p.id,
    label: p.title,
    url: `/p/${p.slug}`
  }));
  const hiddenMenus = config.hiddenMenus || [];
  const allTabs = [...defaultTabs, ...customTabs].filter(tab => !hiddenMenus.includes(tab.id));

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isPathMode = pathname?.includes(`/storefront/${sf?.client?.slug}`);
  const baseLink = isPathMode ? `/storefront/${sf?.client?.slug}` : "";

  // Debug log untuk Aturan 8
  useEffect(() => {
    console.log("[MenuElement Debug] Loaded:", { allTabsCount: allTabs.length, readOnly });
  }, [allTabs, readOnly]);

  const handleHamburgerClick = (e: React.MouseEvent) => {
    if (readOnly && sf?.setIsMobileMenuOpen) {
      e.preventDefault();
      e.stopPropagation();
      sf.setIsMobileMenuOpen(true);
      console.log("[MenuElement Debug] Mobile hamburger menu opened successfully via state");
    }
  };

  return (
    <>
      {/* Desktop Menu */}
      <div
        className={`${readOnly ? "hidden md:flex" : "flex"} items-center flex-wrap gap-5 md:gap-7`}
        style={{
          justifyContent: config.align === 'center' ? 'center' : config.align === 'right' ? 'flex-end' : 'flex-start',
        }}
      >
        {allTabs.length === 0 ? (
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Navigasi Kosong</span>
        ) : (
          allTabs.map(tab => {
            const href = tab.url.startsWith('/') ? `${baseLink}${tab.url}` : `${baseLink}/${tab.url}`;
            
            if (readOnly) {
              return (
                <Link
                  key={tab.id}
                  href={href}
                  style={{
                    color: config.textColor || '#18181B',
                    fontSize: `${config.fontSize ?? 13}px`,
                    fontFamily: config.fontFamily || 'inherit',
                    fontWeight: config.fontWeight || '600'
                  }}
                  className="hover:opacity-75 transition-opacity"
                >
                  {tab.label}
                </Link>
              );
            }

            return (
              <span
                key={tab.id}
                style={{
                  color: config.textColor || '#18181B',
                  fontSize: `${config.fontSize ?? 13}px`,
                  fontFamily: config.fontFamily || 'inherit',
                  fontWeight: config.fontWeight || '600'
                }}
                className="cursor-default hover:opacity-75 transition-opacity"
              >
                {tab.label}
              </span>
            );
          })
        )}
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      {readOnly && (
        <button
          onClick={handleHamburgerClick}
          className="p-2.5 bg-zinc-100 text-zinc-900 rounded-xl md:hidden hover:bg-zinc-200 transition-all active:scale-90"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

// ── CART ELEMENT ──
const CartElement = ({ config, readOnly }: { config: any; readOnly?: boolean }) => {
  const sf = useStorefront();
  const showCustomIcon = config.iconType === 'custom' && config.customIconSvg;
  const defaultIcon = '/cart.svg';

  const cartCount = sf?.cartCount ?? 0;
  const setIsCartOpen = sf?.setIsCartOpen;

  // Debug log untuk Aturan 8
  useEffect(() => {
    console.log("[CartElement Debug] Loaded:", { cartCount, readOnly });
  }, [cartCount, readOnly]);

  const handleClick = (e: React.MouseEvent) => {
    if (readOnly && setIsCartOpen) {
      e.preventDefault();
      e.stopPropagation();
      setIsCartOpen(true);
      console.log("[CartElement Debug] Cart drawer opened successfully via state click");
    }
  };

  return (
    <div className="relative inline-block cursor-pointer" onClick={handleClick}>
      <ButtonElement config={showCustomIcon ? config : { ...config, iconType: 'custom', customIconSvg: defaultIcon, icon: defaultIcon }} />
      <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-zinc-900 text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow pointer-events-none">
        {cartCount}
      </span>
    </div>
  );
};

// ── CATEGORY LIST WIDGET ──
const PLACEHOLDER_CATEGORIES = [
  { id: 'cat-dummy-1', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-2', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-3', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-4', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-5', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-6', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-7', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-8', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-9', name: 'Nama kategori', image: '/default-kategori.webp' },
  { id: 'cat-dummy-10', name: 'Nama kategori', image: '/default-kategori.webp' }
];

interface CategoryListElementProps {
  config: any;
  onElementSelect: (id: string, subFocus?: string | null) => void;
  elementId: string;
  activeSubFocus?: string | null;
  isActive: boolean;
  readOnly?: boolean;
}

const CategoryListElement = ({
  config,
  onElementSelect,
  elementId,
  activeSubFocus,
  isActive,
  readOnly = false,
}: CategoryListElementProps) => {
  const { categories } = useStorefront();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [isCatHovered, setIsCatHovered] = useState(false);

  console.log("[CategoryListElement Canvas] Render dengan activeSubFocus:", activeSubFocus, "isActive:", isActive);

  const showBuilderUI = !readOnly;
  const hoverTitleClass = !readOnly ? 'hover:bg-blue-500/5 hover:outline-dashed hover:outline-1 hover:outline-blue-500/40 rounded px-1' : '';
  const hoverImageClass = !readOnly ? 'hover:scale-105 hover:outline-dashed hover:outline-1 hover:outline-blue-500/40' : '';
  const hoverNameClass = !readOnly ? 'hover:outline-dashed hover:outline-1 hover:outline-blue-500/40 rounded px-1' : '';

  const dbCats = categories || [];
  let displayCategories = [...dbCats];
  if (readOnly) {
    // storefront: real data only, no filler
  } else if (displayCategories.length < 10) {
    const remainingCount = 10 - displayCategories.length;
    const fillers = PLACEHOLDER_CATEGORIES.slice(displayCategories.length, displayCategories.length + remainingCount);
    displayCategories = [...displayCategories, ...fillers];
  }

  const layout = config?.layout || 'slider';
  const columns = config?.columns || 5;
  const borderRadius = config?.borderRadius !== undefined ? config.borderRadius : 9999;
  const title = config?.title || 'Kategori Populer';
  const titleColor = config?.titleColor || '#18181b';
  const itemTitleColor = config?.textColor || '#18181b';
  const itemTitleAlign = config?.align || 'center';
  const itemTitleFontFamily = config?.fontFamily || 'inherit';
  const itemTitleFontSize = config?.fontSize || 14;
  const itemTitleFontWeight = config?.fontWeight || 'bold';
  const itemTitleTextTransform = config?.textTransform || 'none';
  const itemTitleFontStyle = config?.fontStyle || 'normal';
  const itemTitleTextDecoration = config?.textDecoration || 'none';
  const itemTitleLineHeight = config?.lineHeight || '1.2';
  const itemTitleLetterSpacing = config?.letterSpacing || '0px';
  const itemTitleWordSpacing = config?.wordSpacing || '0px';

  const itemTitleTextStrokeWidth = config?.textStrokeWidth || 0;
  const itemTitleTextStrokeColor = config?.textStrokeColor || '#000000';
  const itemTitleTextStrokeStyle = itemTitleTextStrokeWidth > 0
    ? `${itemTitleTextStrokeWidth}px ${itemTitleTextStrokeColor}`
    : undefined;

  const itemTitleTextShadowColor = config?.textShadowColor;
  const itemTitleTextShadowBlur = config?.textShadowBlur;
  const itemTitleTextShadowOffsetX = config?.textShadowOffsetX;
  const itemTitleTextShadowOffsetY = config?.textShadowOffsetY;
  const itemTitleTextShadowStyle = (itemTitleTextShadowColor || itemTitleTextShadowBlur !== undefined || itemTitleTextShadowOffsetX !== undefined || itemTitleTextShadowOffsetY !== undefined)
    ? `${itemTitleTextShadowOffsetX || 0}px ${itemTitleTextShadowOffsetY || 0}px ${itemTitleTextShadowBlur || 0}px ${itemTitleTextShadowColor || 'rgba(0,0,0,0.5)'}`
    : undefined;

  const itemTitleStyle: React.CSSProperties = {
    color: itemTitleColor,
    textAlign: itemTitleAlign as any,
    fontFamily: itemTitleFontFamily,
    fontSize: itemTitleFontSize,
    fontWeight: itemTitleFontWeight,
    textTransform: itemTitleTextTransform as any,
    fontStyle: itemTitleFontStyle,
    textDecoration: itemTitleTextDecoration,
    lineHeight: itemTitleLineHeight,
    letterSpacing: itemTitleLetterSpacing,
    wordSpacing: itemTitleWordSpacing,
    WebkitTextStroke: itemTitleTextStrokeStyle,
    textShadow: itemTitleTextShadowStyle,
  };

  // Custom typography styles for Title
  const titleAlign = config?.titleAlign || 'left';
  const titleFontFamily = config?.titleFontFamily || 'inherit';
  const titleFontSize = config?.titleFontSize || 22;
  const titleFontWeight = config?.titleFontWeight || '800';
  const titleTextTransform = config?.titleTextTransform || 'none';
  const titleFontStyle = config?.titleFontStyle || 'normal';
  const titleTextDecoration = config?.titleTextDecoration || 'none';
  const titleLineHeight = config?.titleLineHeight || '1.2';
  const titleLetterSpacing = config?.titleLetterSpacing || '0px';
  const titleWordSpacing = config?.titleWordSpacing || '0px';

  // Text Stroke for Title
  const titleTextStrokeWidth = config?.titleTextStrokeWidth || 0;
  const titleTextStrokeColor = config?.titleTextStrokeColor || '#000000';
  const textStrokeStyle = titleTextStrokeWidth > 0
    ? `${titleTextStrokeWidth}px ${titleTextStrokeColor}`
    : undefined;

  // Text Shadow for Title
  const titleTextShadowColor = config?.titleTextShadowColor;
  const titleTextShadowBlur = config?.titleTextShadowBlur;
  const titleTextShadowOffsetX = config?.titleTextShadowOffsetX;
  const titleTextShadowOffsetY = config?.titleTextShadowOffsetY;
  const textShadowStyle = (titleTextShadowColor || titleTextShadowBlur !== undefined || titleTextShadowOffsetX !== undefined || titleTextShadowOffsetY !== undefined)
    ? `${titleTextShadowOffsetX || 0}px ${titleTextShadowOffsetY || 0}px ${titleTextShadowBlur || 0}px ${titleTextShadowColor || 'rgba(0,0,0,0.5)'}`
    : undefined;

  console.log(`[CategoryListElement Canvas Debug] Rendering Title: "${title}", Color: "${titleColor}", Align: "${titleAlign}", FontSize: "${titleFontSize}", Stroke: "${textStrokeStyle}", Shadow: "${textShadowStyle}"`);

  const titleStyle: React.CSSProperties = {
    color: titleColor,
    textAlign: titleAlign as any,
    fontFamily: titleFontFamily,
    fontSize: titleFontSize,
    fontWeight: titleFontWeight,
    textTransform: titleTextTransform as any,
    fontStyle: titleFontStyle,
    textDecoration: titleTextDecoration,
    lineHeight: titleLineHeight,
    letterSpacing: titleLetterSpacing,
    wordSpacing: titleWordSpacing,
    WebkitTextStroke: textStrokeStyle,
    textShadow: textShadowStyle,
  };

  // Grid pagination calculation
  const itemsPerPage = columns;
  const totalPages = Math.ceil(displayCategories.length / itemsPerPage);
  const paginatedCategories = displayCategories.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage);

  // ── Hover-aware style computation ──
  const getCatShadow = (s?: string) => {
    if (s === 'soft') return '0 2px 10px rgba(0, 0, 0, 0.05)';
    if (s === 'medium') return '0 4px 20px rgba(0, 0, 0, 0.08)';
    if (s === 'strong') return '0 10px 30px rgba(0, 0, 0, 0.12)';
    return undefined;
  };

  const catResolvedBgColor = isCatHovered && config.hoverBgColor && config.hoverBgColor !== 'transparent'
    ? config.hoverBgColor
    : (config.bgColor || 'transparent');

  const catResolvedBgImage = (() => {
    if (isCatHovered && config.hoverBgType === 'gradient') {
      return config.hoverBgGradientType === 'radial'
        ? `radial-gradient(circle at ${config.hoverBgGradientRadialPos || 'center center'}, ${config.hoverBgGradientColor1 || 'transparent'} ${config.hoverBgGradientLoc1 ?? 0}%, ${config.hoverBgGradientColor2 || 'transparent'} ${config.hoverBgGradientLoc2 ?? 100}%)`
        : `linear-gradient(${config.hoverBgGradientAngle ?? 180}deg, ${config.hoverBgGradientColor1 || 'transparent'} ${config.hoverBgGradientLoc1 ?? 0}%, ${config.hoverBgGradientColor2 || 'transparent'} ${config.hoverBgGradientLoc2 ?? 100}%)`;
    }
    if (config.bgType === 'gradient') {
      return config.bgGradientType === 'radial'
        ? `radial-gradient(circle at ${config.bgGradientRadialPos || 'center center'}, ${config.bgGradientColor1 || '#ffffff'} ${config.bgGradientLoc1 ?? 0}%, ${config.bgGradientColor2 || '#e83a65'} ${config.bgGradientLoc2 ?? 100}%)`
        : `linear-gradient(${config.bgGradientAngle ?? 180}deg, ${config.bgGradientColor1 || '#ffffff'} ${config.bgGradientLoc1 ?? 0}%, ${config.bgGradientColor2 || '#e83a65'} ${config.bgGradientLoc2 ?? 100}%)`;
    }
    if (config.bgImageUrl) return `url(${config.bgImageUrl})`;
    return undefined;
  })();

  const catResolvedBorderTopLeftRadius = formatStyleValue(
    isCatHovered ? (config.hoverBorderRadiusTop ?? config.hoverBorderRadius ?? config.borderRadiusTop ?? config.borderRadius) : (config.borderRadiusTop ?? config.borderRadius), 0);
  const catResolvedBorderTopRightRadius = formatStyleValue(
    isCatHovered ? (config.hoverBorderRadiusRight ?? config.hoverBorderRadius ?? config.borderRadiusRight ?? config.borderRadius) : (config.borderRadiusRight ?? config.borderRadius), 0);
  const catResolvedBorderBottomRightRadius = formatStyleValue(
    isCatHovered ? (config.hoverBorderRadiusBottom ?? config.hoverBorderRadius ?? config.borderRadiusBottom ?? config.borderRadius) : (config.borderRadiusBottom ?? config.borderRadius), 0);
  const catResolvedBorderBottomLeftRadius = formatStyleValue(
    isCatHovered ? (config.hoverBorderRadiusLeft ?? config.hoverBorderRadius ?? config.borderRadiusLeft ?? config.borderRadius) : (config.borderRadiusLeft ?? config.borderRadius), 0);

  const catResolvedBorderStyle = (() => {
    const bt = isCatHovered ? (config.hoverBorderType || config.borderType) : config.borderType;
    return bt && bt !== 'none' && bt !== 'Asali' ? bt : undefined;
  })();

  const catResolvedBorderTopWidth = (() => {
    const bw = isCatHovered
      ? (config.hoverBorderWidthTop ?? config.hoverBorderWidth ?? config.borderWidthTop ?? config.borderWidth)
      : (config.borderWidthTop ?? config.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const catResolvedBorderRightWidth = (() => {
    const bw = isCatHovered
      ? (config.hoverBorderWidthRight ?? config.hoverBorderWidth ?? config.borderWidthRight ?? config.borderWidth)
      : (config.borderWidthRight ?? config.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const catResolvedBorderBottomWidth = (() => {
    const bw = isCatHovered
      ? (config.hoverBorderWidthBottom ?? config.hoverBorderWidth ?? config.borderWidthBottom ?? config.borderWidth)
      : (config.borderWidthBottom ?? config.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const catResolvedBorderLeftWidth = (() => {
    const bw = isCatHovered
      ? (config.hoverBorderWidthLeft ?? config.hoverBorderWidth ?? config.borderWidthLeft ?? config.borderWidth)
      : (config.borderWidthLeft ?? config.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();

  const catResolvedBorderColor = isCatHovered
    ? (config.hoverBorderColor || config.borderColor || undefined)
    : (config.borderColor || undefined);

  const catResolvedBoxShadow = (() => {
    if (isCatHovered && config.hoverBoxShadowType === 'custom') {
      return `${config.hoverShadowOffsetX ?? 0}px ${config.hoverShadowOffsetY ?? 0}px ${config.hoverShadowBlur ?? 10}px ${config.hoverShadowSpread ?? 0}px ${config.hoverShadowColor || 'rgba(0,0,0,0.5)'}`;
    }
    if (isCatHovered && config.hoverBoxShadow) {
      return config.hoverBoxShadow;
    }
    if (config.boxShadowType === 'custom') {
      return `${config.shadowOffsetX ?? 0}px ${config.shadowOffsetY ?? 0}px ${config.shadowBlur ?? 10}px ${config.shadowSpread ?? 0}px ${config.shadowColor || 'rgba(0,0,0,0.5)'}`;
    }
    return getCatShadow(config.boxShadow) || config.boxShadow || undefined;
  })();

  const catResolvedTransition = config.hoverTransitionDuration !== undefined
    ? `background-color ${config.hoverTransitionDuration}s ease, background-image ${config.hoverTransitionDuration}s ease, border-color ${config.hoverTransitionDuration}s ease, border-width ${config.hoverTransitionDuration}s ease, border-radius ${config.hoverTransitionDuration}s ease, box-shadow ${config.hoverTransitionDuration}s ease`
    : undefined;

  const catStyleObj: React.CSSProperties = {
    backgroundColor: catResolvedBgColor,
    backgroundImage: catResolvedBgImage,
    backgroundSize: config.bgImageUrl ? 'cover' : undefined,
    backgroundPosition: config.bgImageUrl ? 'center' : undefined,
    borderTopLeftRadius: catResolvedBorderTopLeftRadius,
    borderTopRightRadius: catResolvedBorderTopRightRadius,
    borderBottomRightRadius: catResolvedBorderBottomRightRadius,
    borderBottomLeftRadius: catResolvedBorderBottomLeftRadius,
    boxShadow: catResolvedBoxShadow,
    borderStyle: catResolvedBorderStyle,
    borderTopWidth: catResolvedBorderTopWidth,
    borderRightWidth: catResolvedBorderRightWidth,
    borderBottomWidth: catResolvedBorderBottomWidth,
    borderLeftWidth: catResolvedBorderLeftWidth,
    borderColor: catResolvedBorderColor,
    transition: catResolvedTransition,
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementSelect(elementId, null);
  };

  const handleSubFocusClick = (e: React.MouseEvent, focusType: string) => {
    e.stopPropagation();
    onElementSelect(elementId, focusType);
    console.log(`[CategoryListElement SubFocus] Mengaktifkan fokus sub-elemen: ${focusType}`);
  };

  // Reset page when columns or categories change
  useEffect(() => {
    setActivePage(0);
  }, [columns, displayCategories.length]);

  return (
    <div
      className={`w-full space-y-3 p-2 rounded-xl transition-all duration-300 ${isActive && !activeSubFocus ? 'bg-blue-500/5' : ''}`}
      onClick={showBuilderUI ? handleContainerClick : undefined}
      onMouseEnter={() => setIsCatHovered(true)}
      onMouseLeave={() => setIsCatHovered(false)}
      style={catStyleObj}
    >
      {title && (
        <h3
          className={`font-extrabold text-xs uppercase tracking-wider px-2 cursor-pointer transition-all ${isActive && activeSubFocus === 'header_title'
            ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded px-1 scale-105 shadow-sm'
            : hoverTitleClass
            }`}
          style={titleStyle}
          onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'header_title') : undefined}
        >
          {title}
        </h3>
      )}
      {layout === 'slider' ? (
        <div className="relative group/slider w-full">
          <div
            ref={scrollRef}
            className="flex items-center gap-4 overflow-x-auto pb-2 px-2 snap-x no-scrollbar"
          >
            {displayCategories.map((cat: any) => (
              <div
                key={cat.id}
                className="flex flex-col items-center gap-2 shrink-0 snap-start select-none cursor-pointer"
                onClick={(e) => handleSubFocusClick(e, 'layout')}
              >
                <div
                  className={`w-14 h-14 border border-zinc-200/60 shadow-[0_4px_10px_rgba(0,0,0,0.03)] overflow-hidden flex items-center justify-center bg-zinc-50 transition-all duration-300 ${isActive && activeSubFocus === 'image'
                    ? 'outline outline-2 outline-blue-500/60 scale-105 shadow-md'
                    : hoverImageClass
                    }`}
                  style={{ borderRadius: `${borderRadius}px` }}
                  onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'image') : undefined}
                >
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <span
                  className={`font-bold leading-tight text-center tracking-tight transition-all duration-300 ${isActive && activeSubFocus === 'title'
                    ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded px-1 scale-105'
                    : hoverNameClass
                    }`}
                  style={itemTitleStyle}
                  onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'title') : undefined}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* Floating desktop scroll chevrons */}
          <button
            type="button"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-200/80 items-center justify-center text-zinc-700 hover:bg-zinc-50 active:scale-95 transition-all z-20 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("[CategoryListElement] Scroll horizontal ke kiri");
              scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-200/80 items-center justify-center text-zinc-700 hover:bg-zinc-50 active:scale-95 transition-all z-20 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("[CategoryListElement] Scroll horizontal ke kanan");
              scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className="grid gap-4 px-2 animate-in fade-in duration-300"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {paginatedCategories.map((cat: any) => (
              <div
                key={cat.id}
                className="flex flex-col items-center gap-2 cursor-pointer select-none"
                onClick={(e) => handleSubFocusClick(e, 'layout')}
              >
                <div
                  className={`w-14 h-14 border border-zinc-200/60 shadow-[0_4px_10px_rgba(0,0,0,0.03)] overflow-hidden flex items-center justify-center bg-zinc-50 transition-all duration-300 ${isActive && activeSubFocus === 'image'
                    ? 'outline outline-2 outline-blue-500/60 scale-105 shadow-md'
                    : hoverImageClass
                    }`}
                  style={{ borderRadius: `${borderRadius}px` }}
                  onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'image') : undefined}
                >
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <span
                  className={`font-bold leading-tight text-center tracking-tight transition-all duration-300 ${isActive && activeSubFocus === 'title'
                    ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded px-1 scale-105'
                    : hoverNameClass
                    }`}
                  style={itemTitleStyle}
                  onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'title') : undefined}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Pagination for Grid category if items exceed column capacity */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-1 pb-1">
              <button
                type="button"
                disabled={activePage === 0}
                className="p-1 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`[CategoryListElement Grid Nav] Ke halaman sebelumnya (${activePage})`);
                  setActivePage(prev => Math.max(0, prev - 1));
                }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activePage === idx ? 'bg-blue-500 w-3' : 'bg-zinc-300 hover:bg-zinc-400'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`[CategoryListElement Grid Nav] Ke halaman indeks: ${idx}`);
                      setActivePage(idx);
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={activePage === totalPages - 1}
                className="p-1 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`[CategoryListElement Grid Nav] Ke halaman berikutnya (${activePage + 2})`);
                  setActivePage(prev => Math.min(totalPages - 1, prev + 1));
                }}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── PRODUCT LIST WIDGET ──
const PLACEHOLDER_PRODUCTS = [
  { id: 'p-dummy-1', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-2', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-3', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-4', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-5', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-6', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-7', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-8', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-9', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 },
  { id: 'p-dummy-10', name: 'Nama produk', price: 199000, discountPrice: 299000, images: ['/default-produk.png'], stock: 100 }
];

interface ProductListElementProps {
  config: any;
  onElementSelect: (id: string, subFocus?: string | null) => void;
  elementId: string;
  activeSubFocus?: string | null;
  isActive: boolean;
  readOnly?: boolean;
}

const ProductListElement = ({
  config,
  onElementSelect,
  elementId,
  activeSubFocus,
  isActive,
  readOnly = false,
}: ProductListElementProps) => {
  const { products, setSelectedProduct } = useStorefront();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isProdHovered, setIsProdHovered] = useState(false);
  console.log("[ProductListElement Canvas] Render dengan activeSubFocus:", activeSubFocus, "isActive:", isActive);

  const showBuilderUI = !readOnly;
  const hoverTitleClass = !readOnly ? 'hover:bg-blue-500/5 hover:outline-dashed hover:outline-1 hover:outline-blue-500/40 rounded px-1' : '';
  const hoverCardClass = !readOnly ? 'hover:scale-[1.01] hover:ring-2 hover:ring-blue-500/30' : '';
  const hoverImageClass = !readOnly ? 'hover:outline-dashed hover:outline-1 hover:outline-blue-500/40' : '';
  const hoverNameClass = !readOnly ? 'hover:outline-dashed hover:outline-1 hover:outline-blue-500/40 rounded px-1' : '';
  const hoverPriceClass = !readOnly ? 'hover:outline-dashed hover:outline-1 hover:outline-blue-500/40 rounded p-1' : '';

  const source = config?.source || 'ALL';
  const categoryId = config?.categoryId || '';
  const limit = config?.limit || 4;
  const title = config?.title || 'Produk Pilihan';
  const titleColor = config?.titleColor || '#18181b';
  const layout = config?.layout || 'grid'; // grid is default

  // Custom typography styles for Title
  const titleAlign = config?.titleAlign || 'left';
  const titleFontFamily = config?.titleFontFamily || 'inherit';
  const titleFontSize = config?.titleFontSize || 22;
  const titleFontWeight = config?.titleFontWeight || '800';
  const titleTextTransform = config?.titleTextTransform || 'none';
  const titleFontStyle = config?.titleFontStyle || 'normal';
  const titleTextDecoration = config?.titleTextDecoration || 'none';
  const titleLineHeight = config?.titleLineHeight || '1.2';
  const titleLetterSpacing = config?.titleLetterSpacing || '0px';
  const titleWordSpacing = config?.titleWordSpacing || '0px';

  // Text Stroke for Title
  const titleTextStrokeWidth = config?.titleTextStrokeWidth || 0;
  const titleTextStrokeColor = config?.titleTextStrokeColor || '#000000';
  const textStrokeStyle = titleTextStrokeWidth > 0
    ? `${titleTextStrokeWidth}px ${titleTextStrokeColor}`
    : undefined;

  // Text Shadow for Title
  const titleTextShadowColor = config?.titleTextShadowColor;
  const titleTextShadowBlur = config?.titleTextShadowBlur;
  const titleTextShadowOffsetX = config?.titleTextShadowOffsetX;
  const titleTextShadowOffsetY = config?.titleTextShadowOffsetY;
  const textShadowStyle = (titleTextShadowColor || titleTextShadowBlur !== undefined || titleTextShadowOffsetX !== undefined || titleTextShadowOffsetY !== undefined)
    ? `${titleTextShadowOffsetX || 0}px ${titleTextShadowOffsetY || 0}px ${titleTextShadowBlur || 0}px ${titleTextShadowColor || 'rgba(0,0,0,0.5)'}`
    : undefined;

  console.log(`[ProductListElement Canvas Debug] Rendering Title: "${title}", Color: "${titleColor}", Align: "${titleAlign}", FontSize: "${titleFontSize}", Stroke: "${textStrokeStyle}", Shadow: "${textShadowStyle}"`);

  const titleStyle: React.CSSProperties = {
    color: titleColor,
    textAlign: titleAlign as any,
    fontFamily: titleFontFamily,
    fontSize: titleFontSize,
    fontWeight: titleFontWeight,
    textTransform: titleTextTransform as any,
    fontStyle: titleFontStyle,
    textDecoration: titleTextDecoration,
    lineHeight: titleLineHeight,
    letterSpacing: titleLetterSpacing,
    wordSpacing: titleWordSpacing,
    WebkitTextStroke: textStrokeStyle,
    textShadow: textShadowStyle,
  };

  // Card customization styles from config
  const cardBgType = config?.cardBgType || 'classic';
  const cardBgColor = config?.cardBgColor || '#ffffff';
  const cardBgGradientType = config?.cardBgGradientType || 'linear';
  const cardBgGradientAngle = config?.cardBgGradientAngle ?? 180;
  const cardBgGradientColor1 = config?.cardBgGradientColor1 || '#ffffff';
  const cardBgGradientLoc1 = config?.cardBgGradientLoc1 ?? 0;
  const cardBgGradientColor2 = config?.cardBgGradientColor2 || '#e83a65';
  const cardBgGradientLoc2 = config?.cardBgGradientLoc2 ?? 100;
  const cardBgGradientRadialPos = config?.cardBgGradientRadialPos || 'center center';

  const getCardBackgroundStyle = () => {
    if (cardBgType === 'gradient') {
      if (cardBgGradientType === 'radial') {
        return { backgroundImage: `radial-gradient(circle at ${cardBgGradientRadialPos}, ${cardBgGradientColor1} ${cardBgGradientLoc1}%, ${cardBgGradientColor2} ${cardBgGradientLoc2}%)` };
      }
      return { backgroundImage: `linear-gradient(${cardBgGradientAngle}deg, ${cardBgGradientColor1} ${cardBgGradientLoc1}%, ${cardBgGradientColor2} ${cardBgGradientLoc2}%)` };
    }
    return { backgroundColor: cardBgColor !== 'transparent' ? cardBgColor : undefined };
  };
  const cardBorderRadius = config?.cardBorderRadius !== undefined ? config.cardBorderRadius : 16;
  const cardBorderColor = config?.cardBorderColor || '#f4f4f5';
  const cardBoxShadow = config?.cardBoxShadow || 'soft';
  const cardPadding = config?.cardPadding !== undefined ? config.cardPadding : 14;

  // Image customization styles from config
  const imageBorderRadius = config?.imageBorderRadius !== undefined ? config.imageBorderRadius : 16;
  const imagePadding = config?.imagePadding !== undefined ? config.imagePadding : 0;
  const imageBgColor = config?.imageBgColor || '#F5F4F2';

  // Typography styles for productName
  const productNameColor = config?.productNameColor || '#1f2937';
  const productNameAlign = config?.productNameAlign || 'left';
  const productNameFontFamily = config?.productNameFontFamily || 'inherit';
  const productNameFontSize = config?.productNameFontSize || 17;
  const productNameFontWeight = config?.productNameFontWeight || '600';
  const productNameTextTransform = config?.productNameTextTransform || 'none';
  const productNameFontStyle = config?.productNameFontStyle || 'normal';
  const productNameTextDecoration = config?.productNameTextDecoration || 'none';
  const productNameLineHeight = config?.productNameLineHeight || '1.2';
  const productNameLetterSpacing = config?.productNameLetterSpacing || '0px';
  const productNameWordSpacing = config?.productNameWordSpacing || '0px';

  // Text Stroke for productName
  const productNameTextStrokeWidth = config?.productNameTextStrokeWidth || 0;
  const productNameTextStrokeColor = config?.productNameTextStrokeColor || '#000000';
  const productNameTextStrokeStyle = productNameTextStrokeWidth > 0
    ? `${productNameTextStrokeWidth}px ${productNameTextStrokeColor}`
    : undefined;

  // Text Shadow for productName
  const productNameTextShadowColor = config?.productNameTextShadowColor;
  const productNameTextShadowBlur = config?.productNameTextShadowBlur;
  const productNameTextShadowOffsetX = config?.productNameTextShadowOffsetX;
  const productNameTextShadowOffsetY = config?.productNameTextShadowOffsetY;
  const productNameTextShadowStyle = (productNameTextShadowColor || productNameTextShadowBlur !== undefined || productNameTextShadowOffsetX !== undefined || productNameTextShadowOffsetY !== undefined)
    ? `${productNameTextShadowOffsetX || 0}px ${productNameTextShadowOffsetY || 0}px ${productNameTextShadowBlur || 0}px ${productNameTextShadowColor || 'rgba(0,0,0,0.5)'}`
    : undefined;

  const productNameStyle: React.CSSProperties = {
    color: productNameColor,
    textAlign: productNameAlign as any,
    fontFamily: productNameFontFamily,
    fontSize: productNameFontSize,
    fontWeight: productNameFontWeight,
    textTransform: productNameTextTransform as any,
    fontStyle: productNameFontStyle,
    textDecoration: productNameTextDecoration,
    lineHeight: productNameLineHeight,
    letterSpacing: productNameLetterSpacing,
    wordSpacing: productNameWordSpacing,
    WebkitTextStroke: productNameTextStrokeStyle,
    textShadow: productNameTextShadowStyle,
  };
  // Typography styles for price
  const priceColor = config?.priceColor || '#18181b';
  const priceAlign = config?.priceAlign || 'left';
  const priceFontFamily = config?.priceFontFamily || 'inherit';
  const priceFontSize = config?.priceFontSize || 14;
  const priceFontWeight = config?.priceFontWeight || '700';
  const priceTextTransform = config?.priceTextTransform || 'none';
  const priceFontStyle = config?.priceFontStyle || 'normal';
  const priceTextDecoration = config?.priceTextDecoration || 'none';
  const priceLineHeight = config?.priceLineHeight || '1.2';
  const priceLetterSpacing = config?.priceLetterSpacing || '0px';
  const priceWordSpacing = config?.priceWordSpacing || '0px';

  // Text Stroke for price
  const priceTextStrokeWidth = config?.priceTextStrokeWidth || 0;
  const priceTextStrokeColor = config?.priceTextStrokeColor || '#000000';
  const priceTextStrokeStyle = priceTextStrokeWidth > 0
    ? `${priceTextStrokeWidth}px ${priceTextStrokeColor}`
    : undefined;

  // Text Shadow for price
  const priceTextShadowColor = config?.priceTextShadowColor;
  const priceTextShadowBlur = config?.priceTextShadowBlur;
  const priceTextShadowOffsetX = config?.priceTextShadowOffsetX;
  const priceTextShadowOffsetY = config?.priceTextShadowOffsetY;
  const priceTextShadowStyle = (priceTextShadowColor || priceTextShadowBlur !== undefined || priceTextShadowOffsetX !== undefined || priceTextShadowOffsetY !== undefined)
    ? `${priceTextShadowOffsetX || 0}px ${priceTextShadowOffsetY || 0}px ${priceTextShadowBlur || 0}px ${priceTextShadowColor || 'rgba(0,0,0,0.5)'}`
    : undefined;

  const priceStyle: React.CSSProperties = {
    color: priceColor,
    textAlign: priceAlign as any,
    fontFamily: priceFontFamily,
    fontSize: priceFontSize,
    fontWeight: priceFontWeight,
    textTransform: priceTextTransform as any,
    fontStyle: priceFontStyle,
    textDecoration: priceTextDecoration,
    lineHeight: priceLineHeight,
    letterSpacing: priceLetterSpacing,
    wordSpacing: priceWordSpacing,
    WebkitTextStroke: priceTextStrokeStyle,
    textShadow: priceTextShadowStyle,
  };
  // Typography styles for discountPrice
  const discountPriceColor = config?.discountPriceColor || '#d1d5db';
  const discountPriceAlign = config?.discountPriceAlign || 'left';
  const discountPriceFontFamily = config?.discountPriceFontFamily || 'inherit';
  const discountPriceFontSize = config?.discountPriceFontSize || 10;
  const discountPriceFontWeight = config?.discountPriceFontWeight || '500';
  const discountPriceTextTransform = config?.discountPriceTextTransform || 'none';
  const discountPriceFontStyle = config?.discountPriceFontStyle || 'normal';
  const discountPriceTextDecoration = config?.discountPriceTextDecoration || 'none';
  const discountPriceLineHeight = config?.discountPriceLineHeight || '1.2';
  const discountPriceLetterSpacing = config?.discountPriceLetterSpacing || '0px';
  const discountPriceWordSpacing = config?.discountPriceWordSpacing || '0px';

  // Text Stroke for discountPrice
  const discountPriceTextStrokeWidth = config?.discountPriceTextStrokeWidth || 0;
  const discountPriceTextStrokeColor = config?.discountPriceTextStrokeColor || '#000000';
  const discountPriceTextStrokeStyle = discountPriceTextStrokeWidth > 0
    ? `${discountPriceTextStrokeWidth}px ${discountPriceTextStrokeColor}`
    : undefined;

  // Text Shadow for discountPrice
  const discountPriceTextShadowColor = config?.discountPriceTextShadowColor;
  const discountPriceTextShadowBlur = config?.discountPriceTextShadowBlur;
  const discountPriceTextShadowOffsetX = config?.discountPriceTextShadowOffsetX;
  const discountPriceTextShadowOffsetY = config?.discountPriceTextShadowOffsetY;
  const discountPriceTextShadowStyle = (discountPriceTextShadowColor || discountPriceTextShadowBlur !== undefined || discountPriceTextShadowOffsetX !== undefined || discountPriceTextShadowOffsetY !== undefined)
    ? `${discountPriceTextShadowOffsetX || 0}px ${discountPriceTextShadowOffsetY || 0}px ${discountPriceTextShadowBlur || 0}px ${discountPriceTextShadowColor || 'rgba(0,0,0,0.5)'}`
    : undefined;

  const discountPriceStyle: React.CSSProperties = {
    color: discountPriceColor,
    textAlign: discountPriceAlign as any,
    fontFamily: discountPriceFontFamily,
    fontSize: discountPriceFontSize,
    fontWeight: discountPriceFontWeight,
    textTransform: discountPriceTextTransform as any,
    fontStyle: discountPriceFontStyle,
    textDecoration: discountPriceTextDecoration,
    lineHeight: discountPriceLineHeight,
    letterSpacing: discountPriceLetterSpacing,
    wordSpacing: discountPriceWordSpacing,
    WebkitTextStroke: discountPriceTextStrokeStyle,
    textShadow: discountPriceTextShadowStyle,
  };
  // Typography styles for stock
  const stockColor = config?.stockColor || '#9ca3af';
  const stockAlign = config?.stockAlign || 'left';
  const stockFontFamily = config?.stockFontFamily || 'inherit';
  const stockFontSize = config?.stockFontSize || 9;
  const stockFontWeight = config?.stockFontWeight || '800';
  const stockTextTransform = config?.stockTextTransform || 'none';
  const stockFontStyle = config?.stockFontStyle || 'normal';
  const stockTextDecoration = config?.stockTextDecoration || 'none';
  const stockLineHeight = config?.stockLineHeight || '1.2';
  const stockLetterSpacing = config?.stockLetterSpacing || '0px';
  const stockWordSpacing = config?.stockWordSpacing || '0px';

  // Text Stroke for stock
  const stockTextStrokeWidth = config?.stockTextStrokeWidth || 0;
  const stockTextStrokeColor = config?.stockTextStrokeColor || '#000000';
  const stockTextStrokeStyle = stockTextStrokeWidth > 0
    ? `${stockTextStrokeWidth}px ${stockTextStrokeColor}`
    : undefined;

  // Text Shadow for stock
  const stockTextShadowColor = config?.stockTextShadowColor;
  const stockTextShadowBlur = config?.stockTextShadowBlur;
  const stockTextShadowOffsetX = config?.stockTextShadowOffsetX;
  const stockTextShadowOffsetY = config?.stockTextShadowOffsetY;
  const stockTextShadowStyle = (stockTextShadowColor || stockTextShadowBlur !== undefined || stockTextShadowOffsetX !== undefined || stockTextShadowOffsetY !== undefined)
    ? `${stockTextShadowOffsetX || 0}px ${stockTextShadowOffsetY || 0}px ${stockTextShadowBlur || 0}px ${stockTextShadowColor || 'rgba(0,0,0,0.5)'}`
    : undefined;

  const showStock = config?.showStock !== false;
  const stockStyle: React.CSSProperties = {
    color: stockColor,
    textAlign: stockAlign as any,
    fontFamily: stockFontFamily,
    fontSize: stockFontSize,
    fontWeight: stockFontWeight,
    textTransform: stockTextTransform as any,
    fontStyle: stockFontStyle,
    textDecoration: stockTextDecoration,
    lineHeight: stockLineHeight,
    letterSpacing: stockLetterSpacing,
    wordSpacing: stockWordSpacing,
    WebkitTextStroke: stockTextStrokeStyle,
    textShadow: stockTextShadowStyle,
  };

  let dbProds = products || [];
  if (source === 'CATEGORY' && categoryId) {
    dbProds = dbProds.filter((p: any) => p.categoryId === categoryId);
  } else if (source === 'DISCOUNT') {
    dbProds = dbProds.filter((p: any) => p.discountPrice && p.discountPrice < p.price);
  }

  // Slice based on limit, and pad with placeholders up to limit
  let slicedDbProds = dbProds.slice(0, limit);
  let displayProducts = [...slicedDbProds];
  if (readOnly) {
    // storefront: real data only, no filler
  } else if (displayProducts.length < limit) {
    const remainingCount = limit - displayProducts.length;
    const fillers = PLACEHOLDER_PRODUCTS.slice(slicedDbProds.length, slicedDbProds.length + remainingCount);
    displayProducts = [...displayProducts, ...fillers];
  }

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // ── Hover-aware style computation ──
  const getProdShadow = (s?: string) => {
    if (s === 'soft') return '0 2px 10px rgba(0, 0, 0, 0.05)';
    if (s === 'medium') return '0 4px 20px rgba(0, 0, 0, 0.08)';
    if (s === 'strong') return '0 10px 30px rgba(0, 0, 0, 0.12)';
    return undefined;
  };

  const prodResolvedBgColor = isProdHovered && config.hoverBgColor && config.hoverBgColor !== 'transparent'
    ? config.hoverBgColor
    : (config.bgColor || 'transparent');

  const prodResolvedBgImage = (() => {
    if (isProdHovered && config.hoverBgType === 'gradient') {
      return config.hoverBgGradientType === 'radial'
        ? `radial-gradient(circle at ${config.hoverBgGradientRadialPos || 'center center'}, ${config.hoverBgGradientColor1 || 'transparent'} ${config.hoverBgGradientLoc1 ?? 0}%, ${config.hoverBgGradientColor2 || 'transparent'} ${config.hoverBgGradientLoc2 ?? 100}%)`
        : `linear-gradient(${config.hoverBgGradientAngle ?? 180}deg, ${config.hoverBgGradientColor1 || 'transparent'} ${config.hoverBgGradientLoc1 ?? 0}%, ${config.hoverBgGradientColor2 || 'transparent'} ${config.hoverBgGradientLoc2 ?? 100}%)`;
    }
    if (config.bgType === 'gradient') {
      return config.bgGradientType === 'radial'
        ? `radial-gradient(circle at ${config.bgGradientRadialPos || 'center center'}, ${config.bgGradientColor1 || '#ffffff'} ${config.bgGradientLoc1 ?? 0}%, ${config.bgGradientColor2 || '#e83a65'} ${config.bgGradientLoc2 ?? 100}%)`
        : `linear-gradient(${config.bgGradientAngle ?? 180}deg, ${config.bgGradientColor1 || '#ffffff'} ${config.bgGradientLoc1 ?? 0}%, ${config.bgGradientColor2 || '#e83a65'} ${config.bgGradientLoc2 ?? 100}%)`;
    }
    if (config.bgImageUrl) return `url(${config.bgImageUrl})`;
    return undefined;
  })();

  const prodResolvedBorderTopLeftRadius = formatStyleValue(
    isProdHovered ? (config.hoverBorderRadiusTop ?? config.hoverBorderRadius ?? config.borderRadiusTop ?? config.borderRadius) : (config.borderRadiusTop ?? config.borderRadius), 0);
  const prodResolvedBorderTopRightRadius = formatStyleValue(
    isProdHovered ? (config.hoverBorderRadiusRight ?? config.hoverBorderRadius ?? config.borderRadiusRight ?? config.borderRadius) : (config.borderRadiusRight ?? config.borderRadius), 0);
  const prodResolvedBorderBottomRightRadius = formatStyleValue(
    isProdHovered ? (config.hoverBorderRadiusBottom ?? config.hoverBorderRadius ?? config.borderRadiusBottom ?? config.borderRadius) : (config.borderRadiusBottom ?? config.borderRadius), 0);
  const prodResolvedBorderBottomLeftRadius = formatStyleValue(
    isProdHovered ? (config.hoverBorderRadiusLeft ?? config.hoverBorderRadius ?? config.borderRadiusLeft ?? config.borderRadius) : (config.borderRadiusLeft ?? config.borderRadius), 0);

  const prodResolvedBorderStyle = (() => {
    const bt = isProdHovered ? (config.hoverBorderType || config.borderType) : config.borderType;
    return bt && bt !== 'none' && bt !== 'Asali' ? bt : undefined;
  })();

  const prodResolvedBorderTopWidth = (() => {
    const bw = isProdHovered
      ? (config.hoverBorderWidthTop ?? config.hoverBorderWidth ?? config.borderWidthTop ?? config.borderWidth)
      : (config.borderWidthTop ?? config.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const prodResolvedBorderRightWidth = (() => {
    const bw = isProdHovered
      ? (config.hoverBorderWidthRight ?? config.hoverBorderWidth ?? config.borderWidthRight ?? config.borderWidth)
      : (config.borderWidthRight ?? config.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const prodResolvedBorderBottomWidth = (() => {
    const bw = isProdHovered
      ? (config.hoverBorderWidthBottom ?? config.hoverBorderWidth ?? config.borderWidthBottom ?? config.borderWidth)
      : (config.borderWidthBottom ?? config.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const prodResolvedBorderLeftWidth = (() => {
    const bw = isProdHovered
      ? (config.hoverBorderWidthLeft ?? config.hoverBorderWidth ?? config.borderWidthLeft ?? config.borderWidth)
      : (config.borderWidthLeft ?? config.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();

  const prodResolvedBorderColor = isProdHovered
    ? (config.hoverBorderColor || config.borderColor || undefined)
    : (config.borderColor || undefined);

  const prodResolvedBoxShadow = (() => {
    if (isProdHovered && config.hoverBoxShadowType === 'custom') {
      return `${config.hoverShadowOffsetX ?? 0}px ${config.hoverShadowOffsetY ?? 0}px ${config.hoverShadowBlur ?? 10}px ${config.hoverShadowSpread ?? 0}px ${config.hoverShadowColor || 'rgba(0,0,0,0.5)'}`;
    }
    if (isProdHovered && config.hoverBoxShadow) {
      return config.hoverBoxShadow;
    }
    if (config.boxShadowType === 'custom') {
      return `${config.shadowOffsetX ?? 0}px ${config.shadowOffsetY ?? 0}px ${config.shadowBlur ?? 10}px ${config.shadowSpread ?? 0}px ${config.shadowColor || 'rgba(0,0,0,0.5)'}`;
    }
    return getProdShadow(config.boxShadow) || config.boxShadow || undefined;
  })();

  const prodResolvedTransition = config.hoverTransitionDuration !== undefined
    ? `background-color ${config.hoverTransitionDuration}s ease, background-image ${config.hoverTransitionDuration}s ease, border-color ${config.hoverTransitionDuration}s ease, border-width ${config.hoverTransitionDuration}s ease, border-radius ${config.hoverTransitionDuration}s ease, box-shadow ${config.hoverTransitionDuration}s ease`
    : undefined;

  const prodStyleObj: React.CSSProperties = {
    backgroundColor: prodResolvedBgColor,
    backgroundImage: prodResolvedBgImage,
    backgroundSize: config.bgImageUrl ? 'cover' : undefined,
    backgroundPosition: config.bgImageUrl ? 'center' : undefined,
    borderTopLeftRadius: prodResolvedBorderTopLeftRadius,
    borderTopRightRadius: prodResolvedBorderTopRightRadius,
    borderBottomRightRadius: prodResolvedBorderBottomRightRadius,
    borderBottomLeftRadius: prodResolvedBorderBottomLeftRadius,
    boxShadow: prodResolvedBoxShadow,
    borderStyle: prodResolvedBorderStyle,
    borderTopWidth: prodResolvedBorderTopWidth,
    borderRightWidth: prodResolvedBorderRightWidth,
    borderBottomWidth: prodResolvedBorderBottomWidth,
    borderLeftWidth: prodResolvedBorderLeftWidth,
    borderColor: prodResolvedBorderColor,
    transition: prodResolvedTransition,
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementSelect(elementId, null);
  };

  const handleSubFocusClick = (e: React.MouseEvent, focusType: string) => {
    e.stopPropagation();
    onElementSelect(elementId, focusType);
    console.log(`[ProductListElement SubFocus] Mengaktifkan fokus sub-elemen: ${focusType}`);
  };

  // Map shadow string config to actual CSS value
  let shadowStyle = 'none';
  if (cardBoxShadow === 'soft') shadowStyle = '0 8px 30px rgb(0,0,0,0.04)';
  else if (cardBoxShadow === 'premium') shadowStyle = '0 20px 50px rgba(0,0,0,0.08)';
  else if (cardBoxShadow === 'bold') shadowStyle = '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.15)';

  return (
    <div
      className={`w-full space-y-3 p-2 rounded-xl transition-all duration-300 ${isActive && !activeSubFocus ? 'bg-blue-500/5' : ''}`}
      onClick={showBuilderUI ? handleContainerClick : undefined}
      onMouseEnter={() => setIsProdHovered(true)}
      onMouseLeave={() => setIsProdHovered(false)}
      style={prodStyleObj}
    >
      {title && (
        <h3
          className={`font-extrabold text-xs uppercase tracking-wider px-2 cursor-pointer transition-all ${isActive && activeSubFocus === 'header_title'
            ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded px-1 scale-105 shadow-sm'
            : hoverTitleClass
            }`}
          style={titleStyle}
          onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'header_title') : undefined}
        >
          {title}
        </h3>
      )}

      {layout === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-2">
          {displayProducts.map((product: any) => {
            const hasDiscount = product.discountPrice && product.discountPrice > 0;
            const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

            return (
              <div
                key={product.id}
                className={`group border flex flex-col h-full transition-all duration-500 cursor-pointer ${isActive && activeSubFocus === 'card'
                  ? 'ring-4 ring-blue-500/50 scale-[1.02] shadow-lg'
                  : hoverCardClass
                  }`}
                style={{
                  ...getCardBackgroundStyle(),
                  borderRadius: `${cardBorderRadius}px`,
                  borderColor: cardBorderColor,
                  boxShadow: shadowStyle,
                }}
                onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'card') : () => setSelectedProduct(product)}
              >
                {/* Image Area */}
                <div
                  className={`aspect-square overflow-hidden relative transition-all duration-300 w-full ${isActive && activeSubFocus === 'image'
                    ? 'outline outline-2 outline-blue-500/60 scale-[1.01] shadow-md z-10'
                    : hoverImageClass
                    }`}
                  style={{
                    borderTopLeftRadius: `${cardBorderRadius}px`,
                    borderTopRightRadius: `${cardBorderRadius}px`,
                    borderBottomLeftRadius: `${imageBorderRadius}px`,
                    borderBottomRightRadius: `${imageBorderRadius}px`,
                    padding: `${imagePadding}px`,
                    backgroundColor: imageBgColor
                  }}
                  onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'image') : undefined}
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{
                        borderTopLeftRadius: `${Math.max(0, cardBorderRadius - imagePadding)}px`,
                        borderTopRightRadius: `${Math.max(0, cardBorderRadius - imagePadding)}px`,
                        borderBottomLeftRadius: `${Math.max(0, imageBorderRadius - imagePadding)}px`,
                        borderBottomRightRadius: `${Math.max(0, imageBorderRadius - imagePadding)}px`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}

                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
                      -{discountPct}%
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div
                  className="pt-3.5 flex flex-col flex-grow text-left"
                  style={{
                    padding: `${cardPadding}px`,
                    paddingTop: '12px'
                  }}
                >
                  <h3
                    className={`line-clamp-2 transition-all duration-300 mb-2 group-hover:text-zinc-900 ${isActive && activeSubFocus === 'title'
                      ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded px-1 scale-105'
                      : hoverNameClass
                      }`}
                    style={productNameStyle}
                    onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'title') : undefined}
                  >
                    {product.name}
                  </h3>

                  <div
                    className={`flex flex-col mt-auto pt-2.5 border-t border-zinc-50 transition-all duration-300 ${isActive && activeSubFocus === 'price'
                      ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded p-1 scale-105'
                      : hoverPriceClass
                      }`}
                    onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'price') : undefined}
                  >
                    {showStock && (
                      <span
                        className="font-bold uppercase mb-0.5 tracking-tight"
                        style={stockStyle}
                      >
                        Stok: {product.stock || 0}
                      </span>
                    )}
                    {hasDiscount && (
                      <p
                        className="line-through font-medium leading-none mb-0.5"
                        style={{ ...discountPriceStyle, textDecoration: 'line-through' }}
                      >
                        {formatRupiah(product.price)}
                      </p>
                    )}
                    <p
                      className="tracking-tight leading-none"
                      style={priceStyle}
                    >
                      {formatRupiah(hasDiscount ? product.discountPrice : product.price)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative group/slider w-full">
          <div
            ref={scrollRef}
            className="flex items-center gap-4 overflow-x-auto pb-3 px-2 snap-x no-scrollbar"
          >
            {displayProducts.map((product: any) => {
              const hasDiscount = product.discountPrice && product.discountPrice > 0;
              const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

              return (
              <div
                key={product.id}
                className={`group border flex flex-col w-[170px] shrink-0 snap-start transition-all duration-500 cursor-pointer ${isActive && activeSubFocus === 'card'
                  ? 'ring-4 ring-blue-500/50 scale-[1.02] shadow-lg'
                  : hoverCardClass
                  }`}
                style={{
                  ...getCardBackgroundStyle(),
                  borderRadius: `${cardBorderRadius}px`,
                  borderColor: cardBorderColor,
                  boxShadow: shadowStyle,
                }}
                onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'card') : () => setSelectedProduct(product)}
              >
                {/* Image Area */}
                <div
                  className={`aspect-square overflow-hidden relative transition-all duration-300 w-full ${isActive && activeSubFocus === 'image'
                    ? 'outline outline-2 outline-blue-500/60 scale-[1.01] shadow-md z-10'
                    : hoverImageClass
                    }`}
                  style={{
                    borderTopLeftRadius: `${cardBorderRadius}px`,
                    borderTopRightRadius: `${cardBorderRadius}px`,
                    borderBottomLeftRadius: `${imageBorderRadius}px`,
                    borderBottomRightRadius: `${imageBorderRadius}px`,
                    padding: `${imagePadding}px`,
                    backgroundColor: imageBgColor
                  }}
                  onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'image') : undefined}
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{
                        borderTopLeftRadius: `${Math.max(0, cardBorderRadius - imagePadding)}px`,
                        borderTopRightRadius: `${Math.max(0, cardBorderRadius - imagePadding)}px`,
                        borderBottomLeftRadius: `${Math.max(0, imageBorderRadius - imagePadding)}px`,
                        borderBottomRightRadius: `${Math.max(0, imageBorderRadius - imagePadding)}px`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}

                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
                      -{discountPct}%
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div
                  className="pt-3.5 flex flex-col flex-grow text-left"
                  style={{
                    padding: `${cardPadding}px`,
                    paddingTop: '12px'
                  }}
                >
                  <h3
                    className={`line-clamp-2 transition-all duration-300 mb-2 group-hover:text-zinc-900 ${isActive && activeSubFocus === 'title'
                      ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded px-1 scale-105'
                      : hoverNameClass
                      }`}
                    style={productNameStyle}
                    onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'title') : undefined}
                  >
                    {product.name}
                  </h3>

                  <div
                    className={`flex flex-col mt-auto pt-2.5 border-t border-zinc-50 transition-all duration-300 ${isActive && activeSubFocus === 'price'
                      ? 'outline outline-2 outline-blue-500/60 bg-blue-500/10 rounded p-1 scale-105'
                      : hoverPriceClass
                      }`}
                    onClick={showBuilderUI ? (e) => handleSubFocusClick(e, 'price') : undefined}
                  >
                    {showStock && (
                      <span
                        className="font-bold uppercase mb-0.5 tracking-tight"
                        style={stockStyle}
                      >
                        Stok: {product.stock || 0}
                      </span>
                    )}
                    {hasDiscount && (
                      <p
                        className="line-through font-medium leading-none mb-0.5"
                        style={{ ...discountPriceStyle, textDecoration: 'line-through' }}
                      >
                        {formatRupiah(product.price)}
                      </p>
                    )}
                    <p
                      className="tracking-tight leading-none"
                      style={priceStyle}
                    >
                      {formatRupiah(hasDiscount ? product.discountPrice : product.price)}
                    </p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Floating desktop scroll chevrons */}
          <button
            type="button"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-200/85 items-center justify-center text-zinc-700 hover:bg-zinc-50 active:scale-95 transition-all z-20 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("[ProductListElement] Scroll horizontal ke kiri");
              scrollRef.current?.scrollBy({ left: -240, behavior: 'smooth' });
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-200/85 items-center justify-center text-zinc-700 hover:bg-zinc-50 active:scale-95 transition-all z-20 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("[ProductListElement] Scroll horizontal ke kanan");
              scrollRef.current?.scrollBy({ left: 240, behavior: 'smooth' });
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// ── COLUMN ELEMENT (nested container) ──
const ColumnElement = ({
  element,
  activeElementId,
  onElementSelect,
  onElementContextMenu,
  onAddElementClick,
  onElementSelectOnly,
  onElementEdit,
  onDeleteElement,
  newlyAddedElementId,
  sectionId,
  onDropWidget,
  isDraggingWidget,
  activeSubFocus,
  isLeftPanelOpen,
  onOpenEditPanel,
  isLocalNavigatorOpen,
  onSectionSelect,
  hidePlaceholder,
  readOnly = false,
}: {
  element: SectionElement;
  activeElementId: string | null;
  onElementSelect: (id: string, subFocus?: string | null) => void;
  onElementContextMenu?: (elementId: string, x: number, y: number) => void;
  onAddElementClick?: (parentId: string, isColumn: boolean) => void;
  onElementSelectOnly?: (elementId: string) => void;
  onElementEdit?: (elementId: string) => void;
  onDeleteElement?: (elementId: string) => void;
  newlyAddedElementId?: string | null;
  sectionId?: string;
  onDropWidget?: (targetId: string, widgetType: string) => void;
  isDraggingWidget?: boolean;
  activeSubFocus?: string | null;
  isLeftPanelOpen?: boolean;
  onOpenEditPanel?: (elementId: string) => void;
  isLocalNavigatorOpen?: boolean;
  onSectionSelect?: () => void;
  hidePlaceholder?: boolean;
  readOnly?: boolean;
}) => {
  const [hoveredChild, setHoveredChild] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isColumnHovered, setIsColumnHovered] = useState(false);

  // Debug Log rendering properti kolom (Aturan 8)
  useEffect(() => {
    console.log(`[CANVAS COLUMN ${element.id}] Render element dengan Layout: ${element.config.containerLayout || 'flex'}, Bg: ${element.config.bgColor || 'transparent'}, Radius: ${element.config.borderRadius ?? 0}px`);
  }, [element.id, element.config.containerLayout, element.config.bgColor, element.config.borderRadius]);

  const children = (element.children || []).sort((a, b) => a.order - b.order);
  const c = element.config;
  const isHoriz = c.layout === 'horizontal' || c.layout === 'row-reverse';
  const isGrid = c.containerLayout === 'grid';

  // Layout classes
  const layoutClass = isGrid
    ? 'grid'
    : c.layout === 'horizontal'
      ? 'flex flex-row flex-wrap'
      : c.layout === 'row-reverse'
        ? 'flex flex-row-reverse flex-wrap'
        : c.layout === 'col-reverse'
          ? 'flex flex-col-reverse'
          : 'flex flex-col';

  // Box Shadow Mapper
  const getShadow = (s?: string) => {
    if (s === 'soft') return '0 2px 10px rgba(0, 0, 0, 0.05)';
    if (s === 'medium') return '0 4px 20px rgba(0, 0, 0, 0.08)';
    if (s === 'strong') return '0 10px 30px rgba(0, 0, 0, 0.12)';
    return undefined;
  };

  // Order Mapper
  const getOrder = () => {
    if (c.order === 'start') return -9999;
    if (c.order === 'end') return 9999;
    if (c.order === 'custom') return c.customOrder ?? 0;
    return undefined;
  };

  // Width/Sizing Mapper
  const getWidth = () => {
    if (c.sizing === 'full') return '100%';
    if (c.sizing === 'fit') return 'fit-content';
    if (c.sizing === 'custom') return c.customWidth ? `${c.customWidth}px` : undefined;
    return c.contentWidth === 'boxed' ? undefined : '100%';
  };

  // ── Hover-aware style computation (sama seperti Section) ──
  const resolvedBgColor = isColumnHovered && c.hoverBgColor && c.hoverBgColor !== 'transparent'
    ? c.hoverBgColor
    : (c.bgColor || 'transparent');

  const resolvedBgImage = (() => {
    if (isColumnHovered && c.hoverBgType === 'gradient') {
      return c.hoverBgGradientType === 'radial'
        ? `radial-gradient(circle at ${c.hoverBgGradientRadialPos || 'center center'}, ${c.hoverBgGradientColor1 || 'transparent'} ${c.hoverBgGradientLoc1 ?? 0}%, ${c.hoverBgGradientColor2 || 'transparent'} ${c.hoverBgGradientLoc2 ?? 100}%)`
        : `linear-gradient(${c.hoverBgGradientAngle ?? 180}deg, ${c.hoverBgGradientColor1 || 'transparent'} ${c.hoverBgGradientLoc1 ?? 0}%, ${c.hoverBgGradientColor2 || 'transparent'} ${c.hoverBgGradientLoc2 ?? 100}%)`;
    }
    if (c.bgType === 'gradient') {
      return c.bgGradientType === 'radial'
        ? `radial-gradient(circle at ${c.bgGradientRadialPos || 'center center'}, ${c.bgGradientColor1 || '#ffffff'} ${c.bgGradientLoc1 ?? 0}%, ${c.bgGradientColor2 || '#e83a65'} ${c.bgGradientLoc2 ?? 100}%)`
        : `linear-gradient(${c.bgGradientAngle ?? 180}deg, ${c.bgGradientColor1 || '#ffffff'} ${c.bgGradientLoc1 ?? 0}%, ${c.bgGradientColor2 || '#e83a65'} ${c.bgGradientLoc2 ?? 100}%)`;
    }
    if (c.bgImageUrl) return `url(${c.bgImageUrl})`;
    return undefined;
  })();

  const resolvedBorderTopLeftRadius = formatStyleValue(
    isColumnHovered ? (c.hoverBorderRadiusTop ?? c.hoverBorderRadius ?? c.borderRadiusTop ?? c.borderRadius) : (c.borderRadiusTop ?? c.borderRadius), 0);
  const resolvedBorderTopRightRadius = formatStyleValue(
    isColumnHovered ? (c.hoverBorderRadiusRight ?? c.hoverBorderRadius ?? c.borderRadiusRight ?? c.borderRadius) : (c.borderRadiusRight ?? c.borderRadius), 0);
  const resolvedBorderBottomRightRadius = formatStyleValue(
    isColumnHovered ? (c.hoverBorderRadiusBottom ?? c.hoverBorderRadius ?? c.borderRadiusBottom ?? c.borderRadius) : (c.borderRadiusBottom ?? c.borderRadius), 0);
  const resolvedBorderBottomLeftRadius = formatStyleValue(
    isColumnHovered ? (c.hoverBorderRadiusLeft ?? c.hoverBorderRadius ?? c.borderRadiusLeft ?? c.borderRadius) : (c.borderRadiusLeft ?? c.borderRadius), 0);

  const resolvedBorderStyle = (() => {
    const bt = isColumnHovered ? (c.hoverBorderType || c.borderType) : c.borderType;
    return bt && bt !== 'none' && bt !== 'Asali' ? bt : undefined;
  })();

  const resolvedBorderTopWidth = (() => {
    const bw = isColumnHovered
      ? (c.hoverBorderWidthTop ?? c.hoverBorderWidth ?? c.borderWidthTop ?? c.borderWidth)
      : (c.borderWidthTop ?? c.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const resolvedBorderRightWidth = (() => {
    const bw = isColumnHovered
      ? (c.hoverBorderWidthRight ?? c.hoverBorderWidth ?? c.borderWidthRight ?? c.borderWidth)
      : (c.borderWidthRight ?? c.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const resolvedBorderBottomWidth = (() => {
    const bw = isColumnHovered
      ? (c.hoverBorderWidthBottom ?? c.hoverBorderWidth ?? c.borderWidthBottom ?? c.borderWidth)
      : (c.borderWidthBottom ?? c.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();
  const resolvedBorderLeftWidth = (() => {
    const bw = isColumnHovered
      ? (c.hoverBorderWidthLeft ?? c.hoverBorderWidth ?? c.borderWidthLeft ?? c.borderWidth)
      : (c.borderWidthLeft ?? c.borderWidth);
    return bw !== undefined ? `${bw}px` : undefined;
  })();

  const resolvedBorderColor = isColumnHovered
    ? (c.hoverBorderColor || c.borderColor || undefined)
    : (c.borderColor || undefined);

  const resolvedBoxShadow = (() => {
    if (isColumnHovered && c.hoverBoxShadowType === 'custom') {
      return `${c.hoverShadowOffsetX ?? 0}px ${c.hoverShadowOffsetY ?? 0}px ${c.hoverShadowBlur ?? 10}px ${c.hoverShadowSpread ?? 0}px ${c.hoverShadowColor || 'rgba(0,0,0,0.5)'}`;
    }
    if (isColumnHovered && c.hoverBoxShadow) {
      return c.hoverBoxShadow;
    }
    if (c.boxShadowType === 'custom') {
      return `${c.shadowOffsetX ?? 0}px ${c.shadowOffsetY ?? 0}px ${c.shadowBlur ?? 10}px ${c.shadowSpread ?? 0}px ${c.shadowColor || 'rgba(0,0,0,0.5)'}`;
    }
    return getShadow(c.boxShadow) || c.boxShadow || undefined;
  })();

  const resolvedTransition = c.hoverTransitionDuration !== undefined
    ? `background-color ${c.hoverTransitionDuration}s ease, background-image ${c.hoverTransitionDuration}s ease, border-color ${c.hoverTransitionDuration}s ease, border-width ${c.hoverTransitionDuration}s ease, border-radius ${c.hoverTransitionDuration}s ease, box-shadow ${c.hoverTransitionDuration}s ease`
    : undefined;

  const styleObj: React.CSSProperties = {
    // Gap
    columnGap: `${c.columnGap ?? c.gap ?? 16}px`,
    rowGap: `${c.rowGap ?? c.gap ?? 16}px`,

    // Background & Visual (hover-aware)
    backgroundColor: resolvedBgColor,
    backgroundImage: resolvedBgImage,
    backgroundSize: c.bgImageUrl ? 'cover' : undefined,
    backgroundPosition: c.bgImageUrl ? 'center' : undefined,
    borderTopLeftRadius: resolvedBorderTopLeftRadius,
    borderTopRightRadius: resolvedBorderTopRightRadius,
    borderBottomRightRadius: resolvedBorderBottomRightRadius,
    borderBottomLeftRadius: resolvedBorderBottomLeftRadius,
    boxShadow: resolvedBoxShadow,
    borderStyle: resolvedBorderStyle,
    borderTopWidth: resolvedBorderTopWidth,
    borderRightWidth: resolvedBorderRightWidth,
    borderBottomWidth: resolvedBorderBottomWidth,
    borderLeftWidth: resolvedBorderLeftWidth,
    borderColor: resolvedBorderColor,

    // Padding
    paddingTop: formatStyleValue(c.paddingTop, 16),
    paddingBottom: formatStyleValue(c.paddingBottom, 16),
    paddingLeft: formatStyleValue(c.paddingLeft, 16),
    paddingRight: formatStyleValue(c.paddingRight, 16),

    // Margin
    marginTop: formatStyleValue(c.marginTop, 0),
    marginBottom: formatStyleValue(c.marginBottom, 0),
    marginLeft: formatStyleValue(c.marginLeft, 0),
    marginRight: formatStyleValue(c.marginRight, 0),

    // Alignment
    alignItems: c.alignItems || (c.align === 'center' ? 'center' : c.align === 'right' ? 'flex-end' : 'flex-start'),
    justifyContent: c.justifyContent || 'flex-start',
    alignSelf: c.alignSelf || 'auto',

    // Width & Height & Grid
    gridTemplateColumns: isGrid ? `repeat(${c.columns || 2}, 1fr)` : undefined,
    width: getWidth(),
    maxWidth: c.contentWidth === 'boxed' ? `${c.width ?? 1000}px` : '100%',
    minHeight: c.minHeight ? `${c.minHeight}px` : undefined,

    // Advanced
    order: getOrder(),
    position: (c.position || 'relative') as any,
    zIndex: c.zIndex !== undefined ? c.zIndex : undefined,

    // Transition
    transition: resolvedTransition,
  };

  return (
    <div
      className={`relative transition-all ${layoutClass} ${!readOnly && isDragOver ? 'outline-dashed outline-2 outline-blue-500 bg-blue-500/10 animate-pulse rounded-lg' : ''}`}
      style={styleObj}
      onMouseEnter={!readOnly ? () => setIsColumnHovered(true) : undefined}
      onMouseLeave={!readOnly ? () => setIsColumnHovered(false) : undefined}
      onDragOver={!readOnly ? (e) => {
        if (isDraggingWidget) {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }
      } : undefined}
      onDragLeave={!readOnly ? () => {
        setIsDragOver(false);
      } : undefined}
      onDrop={!readOnly ? (e) => {
        if (isDraggingWidget) {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          const type = e.dataTransfer.getData("text/plain");
          if (type && onDropWidget) {
            console.log(`[Drag & Drop COLUMN] Drop widget tipe: "${type}" ke Kolom ID: "${element.id}"`);
            onDropWidget(element.id, type);
          }
        }
      } : undefined}
    >
      {/* Overlay Background image */}
      {c.bgImageUrl && c.overlay !== undefined && (
        <div
          className="absolute inset-0 bg-black pointer-events-none rounded-[inherit]"
          style={{ opacity: c.overlay ?? 0.3 }}
        />
      )}
      {!readOnly && children.length === 0 ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("[Empty State Click] Kolom kosong diklik, ID:", element.id);
            if (onAddElementClick) {
              onAddElementClick(element.id, true);
            }
          }}
          className="w-full py-10 h-full min-h-[120px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-200/60 hover:border-blue-400 rounded-xl bg-zinc-50/30 hover:bg-blue-50/20 cursor-pointer transition-all group/colempty"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 group-hover/colempty:bg-blue-500/10 flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 text-zinc-400 group-hover/colempty:text-blue-600 transition-colors" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 group-hover/colempty:text-blue-600 transition-colors uppercase tracking-widest">Kolom Kosong</span>
          <span className="text-[8px] text-zinc-400">Klik tombol + untuk menambahkan elemen</span>
        </div>
      ) : readOnly && children.length === 0 ? null : (
        (() => {
          return children.map((child) => {
            return (
            <div key={child.id} className={isHoriz ? 'flex-1 min-w-0' : (c.alignItems === 'stretch' || !c.alignItems ? 'w-full' : 'max-w-full')} onClick={(e) => e.stopPropagation()}>
              <ElementWrapper
                element={child}
                isActive={!readOnly && activeElementId === child.id}
                isHovered={!readOnly && hoveredChild === child.id}
                readOnly={readOnly}
              onSelect={!readOnly ? () => {
                if (onSectionSelect) onSectionSelect();
                onElementSelect(child.id);
              } : undefined}
              onHover={!readOnly ? () => setHoveredChild(child.id) : undefined}
              onLeave={!readOnly ? () => setHoveredChild(null) : undefined}
              onContextMenu={!readOnly ? (e) => {
                if (onElementContextMenu) {
                  e.preventDefault();
                  e.stopPropagation();
                  onElementContextMenu(child.id, e.clientX, e.clientY);
                }
              } : undefined}
              activeElementId={activeElementId}
              parentGap={c.gap ?? 16}
              parentLayout={c.layout}
              onElementSelect={onElementSelect}
              onElementContextMenu={onElementContextMenu}
              onAddElementClick={onAddElementClick}
              newlyAddedElementId={newlyAddedElementId}
              onElementSelectOnly={onElementSelectOnly}
              onElementEdit={onElementEdit}
              onDeleteElement={onDeleteElement}
              sectionId={sectionId}
              onDropWidget={onDropWidget}
              isDraggingWidget={isDraggingWidget}
              activeSubFocus={activeSubFocus}
              isLeftPanelOpen={isLeftPanelOpen}
              onOpenEditPanel={onOpenEditPanel}
              isLocalNavigatorOpen={isLocalNavigatorOpen}
              onSectionSelect={onSectionSelect}
            />
            </div>
            );
          });
        })()
      )}
    </div>
  );
};

// ── ELEMENT WRAPPER (hover badge + click) ──
const ElementWrapper = ({
  element,
  isActive,
  isHovered,
  onSelect,
  onHover,
  onLeave,
  onContextMenu,
  activeElementId,
  onElementSelect,
  onElementContextMenu,
  onAddElementClick,
  newlyAddedElementId,
  onElementSelectOnly,
  onElementEdit,
  onDeleteElement,
  sectionId,
  onDropWidget,
  isDraggingWidget,
  activeSubFocus,
  parentGap,
  parentLayout,
  isLeftPanelOpen,
  onOpenEditPanel,
  isLocalNavigatorOpen,
  onSectionSelect,
  readOnly = false,
}: {
  element: SectionElement;
  isActive: boolean;
  isHovered: boolean;
  onSelect?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  activeElementId: string | null;
  onElementSelect: (id: string, subFocus?: string | null) => void;
  onElementContextMenu?: (elementId: string, x: number, y: number) => void;
  onAddElementClick?: (parentId: string, isColumn: boolean) => void;
  newlyAddedElementId?: string | null;
  onElementSelectOnly?: (elementId: string) => void;
  onElementEdit?: (elementId: string) => void;
  onDeleteElement?: (elementId: string) => void;
  sectionId?: string;
  onDropWidget?: (targetId: string, widgetType: string) => void;
  isDraggingWidget?: boolean;
  activeSubFocus?: string | null;
  parentGap?: number;
  parentLayout?: string;
  isLeftPanelOpen?: boolean;
  onOpenEditPanel?: (elementId: string) => void;
  isLocalNavigatorOpen?: boolean;
  onSectionSelect?: () => void;
  readOnly?: boolean;
}) => {
  const meta = ELEMENT_TYPE_MAP[element.type];
  const Icon = meta?.icon || Type;
  const isNewlyAdded = newlyAddedElementId === element.id;

  const isHeader = sectionId === 'global-header';
  const headerWrapperStyle = isHeader
    ? {}
    : undefined;

  // Debug log untuk Aturan 8
  useEffect(() => {
    if (isHeader) {
      console.log(`[Header Layout Debug] Elemen ${element.type} di global-header dideteksi. Menerapkan style:`, headerWrapperStyle);
    }
  }, [isHeader, element.type]);

  const defaultMarginTop = 0;

  const defaultMarginBottom =
    element.type === 'HEADING' ? 12 :
      ['TEXT', 'BUTTON'].includes(element.type) ? 16 :
        element.type === 'BADGE' ? 12 :
            element.type === 'DIVIDER' ? 16 :
              0;

  const wrapperStyle: React.CSSProperties = {
    ...headerWrapperStyle,
    ...(element.type === 'COLUMN' ? {
      width: (() => {
        const rawWidth = element.config?.width || (element.config?.sizing === 'full' ? '100%' : element.config?.sizing === 'fit' ? 'fit-content' : element.config?.sizing === 'custom' ? `${element.config?.customWidth}px` : '100%');
        if (typeof rawWidth === 'string' && rawWidth.endsWith('%') && (parentLayout === 'flexbox' || parentLayout === 'horizontal')) {
          const pct = parseFloat(rawWidth);
          if (!isNaN(pct)) {
            const fraction = pct / 100;
            const gap = parentGap !== undefined ? parentGap : 16;
            const calculated = `calc(${rawWidth} - ${(1 - fraction) * gap}px)`;
            // Aturan 8: Tambah console log
            console.log(`[Layout Fix] Column ID: ${element.id}, width original: ${rawWidth}, parentGap: ${gap}, calculated width: ${calculated}`);
            return calculated;
          }
        }
        return rawWidth;
      })(),
      flex: element.config?.flex || (element.config?.sizing === 'default' && element.config?.flexGrow ? `${element.config?.flexGrow} ${element.config?.flexShrink || 1} ${element.config?.flexBasis || '0%'}` : undefined),
      alignSelf: element.config?.alignSelf || undefined,
    } : {
      alignSelf: element.config?.alignSelf || undefined,
      marginTop: formatStyleValue(element.config?.marginTop, defaultMarginTop),
      marginBottom: formatStyleValue(element.config?.marginBottom, defaultMarginBottom),
      marginLeft: formatStyleValue(element.config?.marginLeft, undefined),
      marginRight: formatStyleValue(element.config?.marginRight, undefined),
      zIndex: element.config?.zIndex !== undefined ? Number(element.config.zIndex) : undefined,
      justifyContent: element.config?.justifyContent || undefined,
      alignContent: element.config?.alignContent || undefined,
      position: element.config?.position || undefined,
      order: element.config?.order !== undefined ? Number(element.config.order) : undefined,
      width: element.config?.widthType === 'full' ? '100%' : element.config?.widthType === 'custom' ? element.config?.customWidth : undefined,
      flex: element.config?.sizing === 'full' ? '1 1 100%' : element.config?.sizing === 'fit' ? '0 0 auto' : element.config?.sizing === 'custom' ? element.config?.flex : undefined,
    }),
    ...(sectionId === 'global-header' && element.type === 'CART' ? { marginLeft: 'auto' as const } : {}),
  };

  const isColumnType = element.type === 'COLUMN';
  const contentStyle: React.CSSProperties = !isColumnType ? {
    backgroundColor: element.type === 'BUTTON' ? undefined : ((element.config?.bgType || 'classic') === 'classic' ? (element.config?.bgColor || undefined) : undefined),
    backgroundImage: element.type === 'BUTTON' ? undefined : (element.config?.bgType === 'gradient'
      ? (element.config.bgGradientType === 'radial'
          ? `radial-gradient(circle at ${element.config.bgGradientRadialPos || 'center center'}, ${element.config.bgGradientColor1 || '#ffffff'} ${element.config.bgGradientLoc1 ?? 0}%, ${element.config.bgGradientColor2 || '#e83a65'} ${element.config.bgGradientLoc2 ?? 100}%)`
          : `linear-gradient(${element.config.bgGradientAngle ?? 180}deg, ${element.config.bgGradientColor1 || '#ffffff'} ${element.config.bgGradientLoc1 ?? 0}%, ${element.config.bgGradientColor2 || '#e83a65'} ${element.config.bgGradientLoc2 ?? 100}%)`)
      : undefined),
    color: element.type === 'BUTTON' ? undefined : (element.config?.textColor || undefined),
    borderRadius: element.type === 'BUTTON' ? undefined : (element.config?.borderRadius !== undefined ? `${element.config.borderRadius}px` : 0),
    borderWidth: element.type === 'BUTTON' ? undefined : (element.config?.borderWidth !== undefined ? `${element.config.borderWidth}px` : undefined),
    borderStyle: element.type === 'BUTTON' ? undefined : (element.config?.borderStyle || undefined),
    borderColor: element.type === 'BUTTON' ? undefined : (element.config?.borderColor || undefined),
    boxShadow: element.type === 'BUTTON' ? undefined : (element.config?.boxShadow === 'sm'
      ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      : element.config?.boxShadow === 'md'
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        : element.config?.boxShadow === 'lg'
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : element.config?.boxShadow === 'hover-glow'
            ? '0 0 15px rgba(59, 130, 246, 0.5)'
            : undefined),
    paddingTop: element.type === 'BUTTON' ? undefined : formatStyleValue(element.config?.paddingTop, undefined),
    paddingBottom: element.type === 'BUTTON' ? undefined : formatStyleValue(element.config?.paddingBottom, undefined),
    paddingLeft: element.type === 'BUTTON' ? undefined : formatStyleValue(element.config?.paddingLeft, undefined),
    paddingRight: element.type === 'BUTTON' ? undefined : formatStyleValue(element.config?.paddingRight, undefined),
    opacity: element.config?.opacity !== undefined ? (Number(element.config.opacity) / 100) : undefined,
    height: '100%',
    width: '100%',
  } : {};

  useEffect(() => {
    if (element.type === 'COLUMN') {
      console.log(`[ElementWrapper COLUMN ${element.id}] Menerapkan style wrapper:`, wrapperStyle);
    } else {
      console.log(`[ElementWrapper ${element.type} Style Match] Menerapkan style kustom:`, {
        wrapperStyle,
        contentStyle,
        customClass: element.config?.customClass
      });
      if (element.type === 'BUTTON') {
        console.log(`[BuilderSection BUTTON Wrapper Style Debug] Menghindari kebocoran bgColor ke wrapper. contentStyle.backgroundColor:`, contentStyle.backgroundColor);
      }
    }
  }, [element.id, element.type, element.config, wrapperStyle, contentStyle]);

  return (
    <div
      className={`relative group/el cursor-pointer transition-all ${isNewlyAdded
        ? 'outline outline-2 outline-blue-500 rounded-none animate-pulse bg-blue-500/10'
        : isActive
          ? 'outline outline-2 outline-blue-600 outline-offset-2 rounded-none bg-blue-500/5'
          : !readOnly ? 'hover:outline-dashed hover:outline-2 hover:outline-blue-500/40 hover:outline-offset-2 hover:rounded-none' : ''
        }`}
      style={wrapperStyle}
      onClick={!readOnly ? (e) => {
        e.stopPropagation();
        if (element.type === 'COLUMN') {
          if (onElementSelectOnly) onElementSelectOnly(element.id);
        } else {
          onSelect?.();
        }
      } : undefined}
      onMouseEnter={!readOnly ? onHover : undefined}
      onMouseLeave={!readOnly ? onLeave : undefined}
      onContextMenu={!readOnly ? onContextMenu : undefined}
    >
      {/* Element Badge di Pojok Kiri Atas */}
      {!readOnly && (isHovered || isActive) && (
        <div className="absolute -top-5 left-0 z-[65] flex items-center gap-1 pointer-events-none">
          <div className={`flex items-center gap-1 ${isActive ? 'bg-blue-700' : 'bg-blue-600'} text-white px-2 py-0.5 rounded shadow-lg`}>
            <Icon className="w-2.5 h-2.5" />
            <span className="text-[9px] font-bold">{meta?.label || element.type}</span>
          </div>
        </div>
      )}



      {/* WordPress Elementor-Style Premium Column Navigator (Melayang Tengah Atas) */}
      {!readOnly && element.type === 'COLUMN' && (isHovered || isActive) && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-1.5 bg-zinc-900/60 hover:bg-zinc-900/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full shadow-lg border border-white/10 transition-all pointer-events-auto select-none">
          {/* Tombol Tambah + */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("[Column Navigator] Plus diklik untuk Kolom ID:", element.id);
              if (onAddElementClick) {
                onAddElementClick(element.id, true);
              }
            }}
            className="p-1 hover:text-blue-400 transition-colors flex items-center justify-center cursor-pointer"
            title="Tambah Elemen ke Kolom"
          >
            <Plus className="w-3 h-3 font-extrabold" />
          </button>

          {/* Divider */}
          <div className="w-px h-3 bg-white/10" />

          {/* Tombol Move/Navigator 🟢 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("[Column Navigator] Move (Navigator) diklik untuk Kolom ID:", element.id);
              if (onElementSelectOnly) onElementSelectOnly(element.id);
              console.log("[Column Navigator Debug] Mengirim event builder:openNavigatorPanel untuk Kolom:", element.id, "di Section:", sectionId);
              window.dispatchEvent(new CustomEvent('builder:openNavigatorPanel', { detail: { elementId: element.id, sectionId } }));
            }}
            className={`p-1 transition-colors flex items-center justify-center cursor-pointer ${isLocalNavigatorOpen ? 'text-emerald-300' : 'text-emerald-400 hover:text-emerald-300'}`}
            title="Buka Navigator Posisi"
          >
            <Move className="w-2.5 h-2.5" />
          </button>

          {/* Divider */}
          <div className="w-px h-3 bg-white/10" />

          {/* Tombol Edit/Pensil ✏️ */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("[Column Navigator] Edit (Pencil) diklik untuk Kolom ID:", element.id);
              if (onElementEdit) {
                onElementEdit(element.id);
              }
            }}
            className="p-1 hover:text-amber-400 transition-colors flex items-center justify-center cursor-pointer"
            title="Edit Kolom"
          >
            <Pencil className="w-2.5 h-2.5" />
          </button>

          {/* Divider */}
          <div className="w-px h-3 bg-white/10" />

          {/* Tombol Hapus/Sampah 🗑️ */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("[Column Navigator] Delete (Trash) diklik untuk Kolom ID:", element.id);
              if (onDeleteElement) {
                onDeleteElement(element.id);
              }
            }}
            className="p-1 hover:text-red-400 transition-colors flex items-center justify-center cursor-pointer"
            title="Hapus Kolom"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Element Content */}
      <div
        className={`${(element.type === 'COLUMN' || element.type === 'CATEGORY_LIST' || element.type === 'PRODUCT_LIST' || element.type === 'BRANDING') ? '' : 'pointer-events-none'} ${element.config?.customClass || ''} transition-all`}
        style={contentStyle}
      >
        {element.type === 'HEADING' && <HeadingElement config={element.config} />}
        {element.type === 'TEXT' && <TextElement config={element.config} elementId={element.id} />}
        {element.type === 'BUTTON' && <ButtonElement config={element.config} />}
        {element.type === 'IMAGE' && <ImageElement config={element.config} />}
        {element.type === 'GALLERY' && <GalleryElement config={element.config} />}
        {element.type === 'SPACER' && <SpacerElement config={element.config} />}
        {element.type === 'DIVIDER' && <DividerElement config={element.config} />}
        {element.type === 'BADGE' && <BadgeElement config={element.config} />}
        {element.type === 'BRANDING' && (
          <BrandingElement
            config={element.config}
            onElementSelect={onElementSelect}
            elementId={element.id}
            activeSubFocus={activeSubFocus}
            isActive={isActive}
            readOnly={readOnly}
          />
        )}
        {element.type === 'MENU' && <MenuElement config={element.config} readOnly={readOnly} />}
        {element.type === 'CART' && <CartElement config={element.config} readOnly={readOnly} />}
        {element.type === 'CATEGORY_LIST' && (
          <CategoryListElement
            config={element.config}
            onElementSelect={onElementSelect}
            elementId={element.id}
            activeSubFocus={activeSubFocus}
            isActive={isActive}
            readOnly={readOnly}
          />
        )}
        {element.type === 'PRODUCT_LIST' && (
          <ProductListElement
            config={element.config}
            onElementSelect={onElementSelect}
            elementId={element.id}
            activeSubFocus={activeSubFocus}
            isActive={isActive}
            readOnly={readOnly}
          />
        )}
        {element.type === 'COLUMN' && (
          <ColumnElement
            element={element}
            activeElementId={activeElementId}
            onElementSelect={onElementSelect}
            onElementContextMenu={onElementContextMenu}
            onAddElementClick={onAddElementClick}
            onElementSelectOnly={onElementSelectOnly}
            onElementEdit={onElementEdit}
            onDeleteElement={onDeleteElement}
            newlyAddedElementId={newlyAddedElementId}
            sectionId={sectionId}
            onDropWidget={onDropWidget}
            isDraggingWidget={isDraggingWidget}
            activeSubFocus={activeSubFocus}
            isLeftPanelOpen={isLeftPanelOpen}
            onOpenEditPanel={onOpenEditPanel}
            isLocalNavigatorOpen={isLocalNavigatorOpen}
            onSectionSelect={onSectionSelect}
            readOnly={readOnly}
          />
        )}
      </div>

      {/* Hover action buttons — pojok kanan atas elemen */}
      {!readOnly && !isHeader && element.type !== 'COLUMN' && isHovered && (
        <div className="absolute top-1 right-1 z-[60] flex items-center gap-0.5 pointer-events-auto">
          {/* Tombol Move 🟢 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('[Element Hover Move] Navigator diklik untuk elemen:', element.id);
              onSelect?.();
              console.log("[Element Hover Move Debug] Mengirim event builder:openNavigatorPanel untuk Elemen:", element.id, "di Section:", sectionId);
              window.dispatchEvent(new CustomEvent('builder:openNavigatorPanel', { detail: { elementId: element.id, sectionId } }));
            }}
            className={`p-1.5 rounded-l-md transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover/el:opacity-100 ${isLocalNavigatorOpen ? 'bg-emerald-600 text-white' : 'bg-emerald-600/90 hover:bg-emerald-500 text-white'}`}
            title="Navigator Posisi"
          >
            <Move className="w-3 h-3" />
          </button>

          {/* Tombol Edit 🟡 — hanya saat panel kiri collapse */}
          {!isLeftPanelOpen && onOpenEditPanel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('[Element Hover Edit] Membuka panel edit untuk elemen:', element.id);
                onOpenEditPanel(element.id);
              }}
              className="p-1.5 transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover/el:opacity-100 bg-amber-500/90 hover:bg-amber-400 text-white"
              title="Edit elemen ini"
            >
              <Pencil className="w-3 h-3" />
            </button>
          )}

          {/* Tombol Delete 🔴 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("[Element Hover Delete] Hapus diklik untuk Elemen ID:", element.id);
              if (onDeleteElement) {
                onDeleteElement(element.id);
              }
            }}
            className={`p-1.5 transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover/el:opacity-100 bg-red-600/90 hover:bg-red-600 text-white ${!isLeftPanelOpen && onOpenEditPanel ? 'rounded-r-md' : 'rounded-r-md'}`}
            title={`Hapus ${meta?.label || element.type}`}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

// ── MAIN SECTION COMPONENT ──
export const BuilderSection = ({
  id,
  config,
  elements,
  activeElementId,
  onElementSelect,
  onSectionSelect,
  isActive,
  onAddElement,
  onElementContextMenu,
  onAddElementClick,
  newlyAddedElementId,
  onDeleteSection,
  onSectionSelectOnly,
  onElementSelectOnly,
  onElementEdit,
  onDeleteElement,
  onDropWidget,
  isDraggingWidget,
  activeSubFocus,
  isLeftPanelOpen,
  onOpenEditPanel,
  readOnly = false,
}: {
  id: string;
  config: BuilderSectionConfig;
  elements: SectionElement[];
  activeElementId: string | null;
  onElementSelect: (elementId: string, subFocus?: string | null) => void;
  onSectionSelect: () => void;
  isActive: boolean;
  onAddElement?: () => void;
  onElementContextMenu?: (elementId: string, x: number, y: number) => void;
  onAddElementClick?: (parentId: string, isColumn: boolean) => void;
  newlyAddedElementId?: string | null;
  onDeleteSection?: (id: string) => void;
  onSectionSelectOnly?: () => void;
  onElementSelectOnly?: (elementId: string) => void;
  onElementEdit?: (elementId: string) => void;
  onDeleteElement?: (elementId: string) => void;
  onDropWidget?: (targetId: string, widgetType: string) => void;
  isDraggingWidget?: boolean;
  activeSubFocus?: string | null;
  isLeftPanelOpen?: boolean;
  onOpenEditPanel?: (elementId: string) => void;
  onOpenNavigatorPanel?: () => void;
  isNavigatorPanelOpen?: boolean;
  readOnly?: boolean;
}) => {
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLocalNavigatorOpen, setIsLocalNavigatorOpen] = useState(false);

  // Sync local state dengan event global
  useEffect(() => {
    const handleOpen = () => setIsLocalNavigatorOpen(true);
    const handleClose = () => setIsLocalNavigatorOpen(false);
    window.addEventListener('builder:navigatorPanelOpened', handleOpen);
    window.addEventListener('builder:navigatorPanelClosed', handleClose);
    return () => {
      window.removeEventListener('builder:navigatorPanelOpened', handleOpen);
      window.removeEventListener('builder:navigatorPanelClosed', handleClose);
    };
  }, []);

  // Debug log untuk letak floating navigator global-header
  useEffect(() => {
    if (id === 'global-header' && (isSectionHovered || isActive)) {
      console.log("[Header Navigator Debug] Floating Section Navigator untuk global-header diposisikan di bawah (-bottom-5) agar tidak terpotong header visual builder");
    }
  }, [id, isSectionHovered, isActive]);

  const sorted = [...elements].sort((a, b) => a.order - b.order);

  useEffect(() => {
    console.log("[BuilderSection] Rendered section active state:", isActive, "Elements count:", elements.length, "Highlighting ID:", newlyAddedElementId);
  }, [isActive, elements, newlyAddedElementId]);

  // Layout classes
  const isGrid = config.layout === 'grid';
  // config.direction (row/col/row-reverse/col-reverse) takes precedence over legacy config.layout
  const effectiveDirection = config.direction
    ? config.direction
    : (config.layout === 'flexbox' ? 'row' : 'col');
  const layoutClass = isGrid
    ? 'grid'
    : (effectiveDirection === 'row' || effectiveDirection === 'row-reverse')
      ? 'flex flex-row flex-wrap'
      : 'flex flex-col';

  const alignClass = isGrid 
    ? (config.align === 'stretch' ? 'items-stretch' : config.align === 'center' ? 'items-center text-center' : config.align === 'right' ? 'items-end text-right' : 'items-start text-left')
    : (config.align === 'center'
      ? 'items-center text-center'
      : config.align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left');

  const gridStyle = isGrid
    ? { 
        gridTemplateColumns: config.customGridColumns || `repeat(${config.columns ?? 3}, 1fr)`,
        gridTemplateRows: config.customGridRows || `repeat(${config.rows ?? 2}, 1fr)`,
      }
    : {};

  const placeholderCount = config.placeholderCount ?? ((config.columns ?? 3) * (config.rows ?? 2));

  // Compute CSS hover styles using native :hover pseudo-class to override inline styles
  const hoverBorderRadiusTop = config.hoverBorderRadiusTop !== undefined ? config.hoverBorderRadiusTop : (config.borderRadiusTop ?? config.borderRadius);
  const hoverBorderRadiusRight = config.hoverBorderRadiusRight !== undefined ? config.hoverBorderRadiusRight : (config.borderRadiusRight ?? config.borderRadius);
  const hoverBorderRadiusBottom = config.hoverBorderRadiusBottom !== undefined ? config.hoverBorderRadiusBottom : (config.borderRadiusBottom ?? config.borderRadius);
  const hoverBorderRadiusLeft = config.hoverBorderRadiusLeft !== undefined ? config.hoverBorderRadiusLeft : (config.borderRadiusLeft ?? config.borderRadius);

  const hoverBorderType = config.hoverBorderType && config.hoverBorderType !== 'none' && config.hoverBorderType !== 'Asali' && config.hoverBorderType !== 'asali'
    ? config.hoverBorderType 
    : (config.borderType && config.borderType !== 'none' && config.borderType !== 'Asali' && config.borderType !== 'asali' ? config.borderType : 'none');

  const hoverBorderColor = (config.hoverBorderColor && config.hoverBorderColor !== 'transparent') ? config.hoverBorderColor : (config.borderColor || 'transparent');

  const hoverBorderWidthTop = config.hoverBorderWidthTop !== undefined ? `${config.hoverBorderWidthTop}px` : (config.hoverBorderWidth ? `${config.hoverBorderWidth}px` : undefined);
  const hoverBorderWidthRight = config.hoverBorderWidthRight !== undefined ? `${config.hoverBorderWidthRight}px` : (config.hoverBorderWidth ? `${config.hoverBorderWidth}px` : undefined);
  const hoverBorderWidthBottom = config.hoverBorderWidthBottom !== undefined ? `${config.hoverBorderWidthBottom}px` : (config.hoverBorderWidth ? `${config.hoverBorderWidth}px` : undefined);
  const hoverBorderWidthLeft = config.hoverBorderWidthLeft !== undefined ? `${config.hoverBorderWidthLeft}px` : (config.hoverBorderWidth ? `${config.hoverBorderWidth}px` : undefined);

  const hoverBoxShadow = config.hoverBoxShadowType === 'custom'
    ? `${config.hoverShadowOffsetX ?? 0}px ${config.hoverShadowOffsetY ?? 0}px ${config.hoverShadowBlur ?? 10}px ${config.hoverShadowSpread ?? 0}px ${config.hoverShadowColor || 'rgba(0,0,0,0.5)'}`
    : (config.hoverBoxShadow || 'none');

  return (
    <>
      {!readOnly && <style>{`
        #section-${id}:hover {
          border-top-left-radius: ${formatStyleValue(hoverBorderRadiusTop, 0)} !important;
          border-top-right-radius: ${formatStyleValue(hoverBorderRadiusRight, 0)} !important;
          border-bottom-right-radius: ${formatStyleValue(hoverBorderRadiusBottom, 0)} !important;
          border-bottom-left-radius: ${formatStyleValue(hoverBorderRadiusLeft, 0)} !important;
          border-style: ${hoverBorderType} !important;
          ${hoverBorderWidthTop !== undefined ? `border-top-width: ${hoverBorderWidthTop} !important;` : ''}
          ${hoverBorderWidthRight !== undefined ? `border-right-width: ${hoverBorderWidthRight} !important;` : ''}
          ${hoverBorderWidthBottom !== undefined ? `border-bottom-width: ${hoverBorderWidthBottom} !important;` : ''}
          ${hoverBorderWidthLeft !== undefined ? `border-left-width: ${hoverBorderWidthLeft} !important;` : ''}
          border-color: ${hoverBorderColor} !important;
          box-shadow: ${hoverBoxShadow} !important;
        }
      `}</style>}
      <div
        id={`section-${id}`}
        className={`relative transition-all mx-auto w-full ${!readOnly && isActive
        ? 'after:absolute after:inset-0 after:border-2 after:border-blue-600 after:pointer-events-none after:z-[50] after:rounded-[inherit]'
        : !readOnly ? 'hover:after:absolute hover:after:inset-0 hover:after:border-2 hover:after:border-blue-500/30 hover:after:pointer-events-none hover:after:z-[50] hover:after:rounded-[inherit]'
        : ''
        } ${!readOnly && isDragOver ? 'after:absolute after:inset-0 after:border-2 after:border-dashed after:border-blue-500 after:bg-blue-500/10 after:pointer-events-none after:z-[50] after:rounded-[inherit] after:animate-pulse' : ''}`}
      onClick={!readOnly ? (e) => {
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        console.log("[Canvas Click] Section area diklik biasa (hanya sorot), ID:", id);
        if (onSectionSelectOnly) {
          onSectionSelectOnly();
        } else {
          onSectionSelect();
        }
      } : undefined}
      onMouseEnter={!readOnly ? () => setIsSectionHovered(true) : undefined}
      onMouseLeave={!readOnly ? () => setIsSectionHovered(false) : undefined}
      onDragOver={!readOnly ? (e) => {
        if (isDraggingWidget) {
          e.preventDefault();
          setIsDragOver(true);
        }
      } : undefined}
      onDragLeave={!readOnly ? () => {
        setIsDragOver(false);
      } : undefined}
      onDrop={!readOnly ? (e) => {
        if (isDraggingWidget) {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          const type = e.dataTransfer.getData("text/plain");
          if (type && onDropWidget) {
            console.log(`[Drag & Drop SECTION] Drop widget tipe: "${type}" ke Section ID: "${id}"`);
            onDropWidget(id, type);
          }
        }
      } : undefined}
      style={{
        // ── Latar Belakang ──
        backgroundColor: isSectionHovered && config.hoverBgColor && config.hoverBgColor !== 'transparent'
          ? config.hoverBgColor
          : (config.bgColor || 'transparent'),
        backgroundImage: isSectionHovered && config.hoverBgType === 'gradient'
          ? (config.hoverBgGradientType === 'radial'
              ? `radial-gradient(circle at ${config.hoverBgGradientRadialPos || 'center center'}, ${config.hoverBgGradientColor1 || 'transparent'} ${config.hoverBgGradientLoc1 ?? 0}%, ${config.hoverBgGradientColor2 || 'transparent'} ${config.hoverBgGradientLoc2 ?? 100}%)`
              : `linear-gradient(${config.hoverBgGradientAngle ?? 180}deg, ${config.hoverBgGradientColor1 || 'transparent'} ${config.hoverBgGradientLoc1 ?? 0}%, ${config.hoverBgGradientColor2 || 'transparent'} ${config.hoverBgGradientLoc2 ?? 100}%)`)
          : config.bgType === 'gradient'
            ? (config.bgGradientType === 'radial'
                ? `radial-gradient(circle at ${config.bgGradientRadialPos || 'center center'}, ${config.bgGradientColor1 || '#ffffff'} ${config.bgGradientLoc1 ?? 0}%, ${config.bgGradientColor2 || '#e83a65'} ${config.bgGradientLoc2 ?? 100}%)`
                : `linear-gradient(${config.bgGradientAngle ?? 180}deg, ${config.bgGradientColor1 || '#ffffff'} ${config.bgGradientLoc1 ?? 0}%, ${config.bgGradientColor2 || '#e83a65'} ${config.bgGradientLoc2 ?? 100}%)`)
            : undefined,

        // ── Radius ──
        borderTopLeftRadius: formatStyleValue(
          isSectionHovered ? (config.hoverBorderRadiusTop ?? config.hoverBorderRadius ?? config.borderRadiusTop ?? config.borderRadius)
                           : (config.borderRadiusTop ?? config.borderRadius), 0),
        borderTopRightRadius: formatStyleValue(
          isSectionHovered ? (config.hoverBorderRadiusRight ?? config.hoverBorderRadius ?? config.borderRadiusRight ?? config.borderRadius)
                           : (config.borderRadiusRight ?? config.borderRadius), 0),
        borderBottomRightRadius: formatStyleValue(
          isSectionHovered ? (config.hoverBorderRadiusBottom ?? config.hoverBorderRadius ?? config.borderRadiusBottom ?? config.borderRadius)
                           : (config.borderRadiusBottom ?? config.borderRadius), 0),
        borderBottomLeftRadius: formatStyleValue(
          isSectionHovered ? (config.hoverBorderRadiusLeft ?? config.hoverBorderRadius ?? config.borderRadiusLeft ?? config.borderRadius)
                           : (config.borderRadiusLeft ?? config.borderRadius), 0),

        // ── Border ──
        borderStyle: (() => {
          const bt = isSectionHovered ? (config.hoverBorderType || config.borderType) : config.borderType;
          return bt && bt !== 'none' && bt !== 'Asali' ? bt : undefined;
        })(),
        borderTopWidth: (() => {
          const bw = isSectionHovered
            ? (config.hoverBorderWidthTop ?? config.hoverBorderWidth ?? config.borderWidthTop ?? config.borderWidth)
            : (config.borderWidthTop ?? config.borderWidth);
          return bw !== undefined ? `${bw}px` : undefined;
        })(),
        borderRightWidth: (() => {
          const bw = isSectionHovered
            ? (config.hoverBorderWidthRight ?? config.hoverBorderWidth ?? config.borderWidthRight ?? config.borderWidth)
            : (config.borderWidthRight ?? config.borderWidth);
          return bw !== undefined ? `${bw}px` : undefined;
        })(),
        borderBottomWidth: (() => {
          const bw = isSectionHovered
            ? (config.hoverBorderWidthBottom ?? config.hoverBorderWidth ?? config.borderWidthBottom ?? config.borderWidth)
            : (config.borderWidthBottom ?? config.borderWidth);
          return bw !== undefined ? `${bw}px` : undefined;
        })(),
        borderLeftWidth: (() => {
          const bw = isSectionHovered
            ? (config.hoverBorderWidthLeft ?? config.hoverBorderWidth ?? config.borderWidthLeft ?? config.borderWidth)
            : (config.borderWidthLeft ?? config.borderWidth);
          return bw !== undefined ? `${bw}px` : undefined;
        })(),
        borderColor: isSectionHovered
          ? (config.hoverBorderColor || config.borderColor || undefined)
          : (config.borderColor || undefined),

        // ── Box Shadow ──
        boxShadow: (() => {
          if (isSectionHovered && config.hoverBoxShadowType === 'custom') {
            return `${config.hoverShadowOffsetX ?? 0}px ${config.hoverShadowOffsetY ?? 0}px ${config.hoverShadowBlur ?? 10}px ${config.hoverShadowSpread ?? 0}px ${config.hoverShadowColor || 'rgba(0,0,0,0.5)'}`;
          }
          if (config.boxShadowType === 'custom') {
            return `${config.shadowOffsetX ?? 0}px ${config.shadowOffsetY ?? 0}px ${config.shadowBlur ?? 10}px ${config.shadowSpread ?? 0}px ${config.shadowColor || 'rgba(0,0,0,0.5)'}`;
          }
          return config.boxShadow || undefined;
        })(),

        // ── Spacing & Size ──
        paddingTop: formatStyleValue(config.paddingTop, 40),
        paddingBottom: formatStyleValue(config.paddingBottom, 40),
        paddingLeft: formatStyleValue(config.paddingLeft, 40),
        paddingRight: formatStyleValue(config.paddingRight, 40),
        marginTop: formatStyleValue(config.marginTop, 0),
        marginBottom: formatStyleValue(config.marginBottom, 0),
        maxWidth: config.contentWidth === 'full' ? '100%' : (config.maxWidth || '1200px'),
        width: '100%',
        minHeight: isGrid ? '200px' : undefined,

        // ── Position & Stacking ──
        position: (config.position || 'relative') as any,
        zIndex: config.zIndex !== undefined ? config.zIndex : undefined,

        // ── Transition (aktif jika ada hover setting apapun) ──
        transition: config.hoverTransitionDuration !== undefined
          ? `background-color ${config.hoverTransitionDuration}s ease, background-image ${config.hoverTransitionDuration}s ease, border-color ${config.hoverTransitionDuration}s ease, border-width ${config.hoverTransitionDuration}s ease, border-radius ${config.hoverTransitionDuration}s ease, box-shadow ${config.hoverTransitionDuration}s ease`
          : undefined,
      }}
    >
      {/* Background Image Layer (with opacity and blur) */}
      {((isSectionHovered && config.hoverBgType === 'classic') || (!isSectionHovered && (config.bgType === 'classic' || !config.bgType))) && (isSectionHovered && config.hoverBgImageUrl ? config.hoverBgImageUrl : config.bgImageUrl) && (
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none z-0">
          <img 
            src={isSectionHovered && config.hoverBgImageUrl ? config.hoverBgImageUrl : config.bgImageUrl} 
            alt="Section Background" 
            className={`w-full h-full object-cover ${config.hoverTransitionDuration ? 'transition-all' : ''}`}
            style={{
              opacity: (config.bgImageOpacity ?? 100) / 100,
              filter: (config.bgImageBlur ?? 0) > 0 ? `blur(${config.bgImageBlur}px)` : 'none',
              transform: (config.bgImageBlur ?? 0) > 0 ? `scale(1.1)` : 'none',
              transitionDuration: config.hoverTransitionDuration ? `${config.hoverTransitionDuration}s` : undefined
            }}
          />
          {((isSectionHovered ? (config.hoverOverlay ?? config.overlay) : config.overlay) !== undefined && (isSectionHovered ? (config.hoverOverlay ?? config.overlay) : config.overlay)! > 0) && (
            <div className={`absolute inset-0 bg-black ${config.hoverTransitionDuration ? 'transition-all' : ''}`} style={{ 
              opacity: isSectionHovered ? (config.hoverOverlay ?? config.overlay ?? 0) : (config.overlay ?? 0),
              transitionDuration: config.hoverTransitionDuration ? `${config.hoverTransitionDuration}s` : undefined
            }}></div>
          )}
        </div>
      )}

      {/* Grid Outline Visuals */}
      {isGrid && (config.showGridOutline ?? true) && (
        <div 
           className={`absolute inset-0 z-0 pointer-events-none ${config.customGridClass ?? ''}`}
           style={{
             display: 'grid',
             columnGap: `${config.columnGap ?? config.gap ?? 16}px`,
             rowGap: `${config.rowGap ?? config.gap ?? 16}px`,
             paddingTop: formatStyleValue(config.paddingTop, 40),
             paddingBottom: formatStyleValue(config.paddingBottom, 40),
             paddingLeft: formatStyleValue(config.paddingLeft, 40),
             paddingRight: formatStyleValue(config.paddingRight, 40),
             ...gridStyle,
           }}
        >
           {Array.from({ length: placeholderCount }).map((_, i) => {
             const col = sorted[i];
             const isFilled = col && col.type === 'COLUMN' && col.children && col.children.length > 0;
             // Kisi terisi: tidak tampilkan outline dashed
             if (isFilled) return <div key={i} />;
             return <div key={i} className="border border-dashed border-zinc-400/50 bg-zinc-500/5 rounded" />;
           })}
        </div>
      )}

      {/* WordPress Elementor-Style Premium Section Navigator (Melayang Tengah Atas / Bawah jika Header) */}
      {!readOnly && (isSectionHovered || isActive) && (
        <div className={`absolute ${id === 'global-header' ? '-bottom-5' : '-top-3.5'} left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-3 py-1 rounded-full shadow-lg border border-fuchsia-500 transition-all pointer-events-auto select-none`}>
           {/* Tombol Tambah + — tampil untuk semua section termasuk global-header */}
           <button
             type="button"
             onClick={(e) => {
               e.stopPropagation();
               e.preventDefault();
               console.log("[Section Navigator] Plus diklik untuk Section ID:", id);
               if (onAddElementClick) {
                 onAddElementClick(id, false);
               }
             }}
             className="p-1 hover:text-fuchsia-200 transition-colors flex items-center justify-center cursor-pointer"
             title="Tambah Elemen ke Section"
           >
             <Plus className="w-3.5 h-3.5 font-extrabold" />
           </button>

           {/* Divider */}
           <div className="w-px h-3.5 bg-fuchsia-400/40" />

          {/* Tombol Move/Navigator 🟢 — selalu muncul */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("[Section Navigator] Move (Navigator) diklik untuk Section ID:", id);
              onSectionSelect();
              window.dispatchEvent(new CustomEvent('builder:openNavigatorPanel', { detail: { sectionId: id, elementId: null } }));
            }}
            className={`p-1 transition-colors flex items-center justify-center cursor-pointer ${isLocalNavigatorOpen ? 'text-emerald-300' : 'text-emerald-400 hover:text-emerald-300'}`}
            title="Buka Navigator Posisi"
          >
            <Move className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="w-px h-3.5 bg-fuchsia-400/40" />

          {/* Tombol Edit/Pensil ✏️ */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("[Section Navigator] Edit (Pencil) diklik untuk Section ID:", id);
              onSectionSelect();
            }}
            className="p-1 hover:text-fuchsia-200 transition-colors flex items-center justify-center cursor-pointer"
            title="Edit Section"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {id !== 'global-header' && (
            <>
              {/* Divider */}
              <div className="w-px h-3.5 bg-fuchsia-400/40" />

              {/* Tombol Hapus/Sampah 🗑️ */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log("[Section Navigator] Delete (Trash) diklik untuk Section ID:", id);
                  if (onDeleteSection) {
                    onDeleteSection(id);
                  }
                }}
                className="p-1 hover:text-red-200 transition-colors flex items-center justify-center cursor-pointer"
                title="Hapus Section"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* BG Image + Overlay (Legacy div backgrounds, only rendered if not classic type, or maybe it's redundant but kept for safety if used without bgType flag) */}
      {!(config.bgType === 'classic' || !config.bgType) && (isSectionHovered && config.hoverBgImageUrl ? config.hoverBgImageUrl : config.bgImageUrl) && (
        <div
          className={`absolute inset-0 bg-cover bg-center ${config.hoverTransitionDuration ? 'transition-all' : ''}`}
          style={{ 
            backgroundImage: `url(${isSectionHovered && config.hoverBgImageUrl ? config.hoverBgImageUrl : config.bgImageUrl})`, 
            borderRadius: `${config.borderRadius ?? 0}px`,
            transitionDuration: config.hoverTransitionDuration ? `${config.hoverTransitionDuration}s` : undefined
          }}
        />
      )}
      {!(config.bgType === 'classic' || !config.bgType) && (isSectionHovered && config.hoverBgImageUrl ? config.hoverBgImageUrl : config.bgImageUrl) && (
        <div
          className={`absolute inset-0 bg-black ${config.hoverTransitionDuration ? 'transition-all' : ''}`}
          style={{ 
            opacity: isSectionHovered ? (config.hoverOverlay ?? config.overlay ?? 0.3) : (config.overlay ?? 0.3), 
            borderRadius: `${config.borderRadius ?? 0}px`,
            transitionDuration: config.hoverTransitionDuration ? `${config.hoverTransitionDuration}s` : undefined
          }}
        />
      )}

      {/* Elements */}
      <div
        className={`relative z-10 ${layoutClass} ${alignClass} ${id === 'global-header' ? 'w-full' : ''} ${config.customGridClass ?? ''}`}
        style={{
          columnGap: `${config.columnGap ?? config.gap ?? 16}px`,
          rowGap: `${config.rowGap ?? config.gap ?? 16}px`,
          ...gridStyle,
          flexDirection: !isGrid
            ? (effectiveDirection === 'col' ? 'column'
                : effectiveDirection === 'col-reverse' ? 'column-reverse'
                : effectiveDirection === 'row-reverse' ? 'row-reverse'
                : 'row')
            : undefined,
          flexWrap: (config.layout !== 'grid' && config.flexWrap)
            ? config.flexWrap
            : undefined,
          justifyContent: (config.layout !== 'grid' && config.justify)
            ? (config.justify === 'start' ? 'flex-start' : config.justify === 'end' ? 'flex-end' : config.justify === 'between' ? 'space-between' : config.justify === 'around' ? 'space-around' : config.justify === 'evenly' ? 'space-evenly' : 'center')
            : undefined,
          alignItems: (config.layout !== 'grid' && config.align)
            ? (config.align === 'start' ? 'flex-start' : config.align === 'end' ? 'flex-end' : config.align === 'stretch' ? 'stretch' : 'center')
            : undefined
        }}
      >
        {!readOnly && sorted.length === 0 ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("[Empty State Click] Section kosong diklik, ID:", id);
              if (onAddElementClick) {
                onAddElementClick(id, false);
              }
            }}
            className="w-full py-16 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-200 hover:border-blue-400 rounded-xl bg-zinc-50/50 hover:bg-blue-50/20 cursor-pointer transition-all group/empty"
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 group-hover/empty:bg-blue-500/10 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-zinc-400 group-hover/empty:text-blue-600 transition-colors" />
            </div>
            <p className="text-[11px] font-bold text-zinc-400 group-hover/empty:text-blue-600 transition-colors uppercase tracking-widest">Section Kosong</p>
            <p className="text-[10px] text-zinc-400">Klik tombol + untuk menambahkan elemen</p>
          </div>
        ) : readOnly && sorted.length === 0 ? null : (
          (() => {
            return sorted.map((el) => {
              return (
              <ElementWrapper
                key={el.id}
                element={el}
                isActive={!readOnly && activeElementId === el.id}
                isHovered={!readOnly && hoveredElementId === el.id}
                readOnly={readOnly}
              onSelect={!readOnly ? () => {
                onSectionSelect();
                onElementSelect(el.id);
              } : undefined}
              onHover={() => setHoveredElementId(el.id)}
              onLeave={() => setHoveredElementId(null)}
              onContextMenu={(e) => {
                if (onElementContextMenu) {
                  e.preventDefault();
                  e.stopPropagation();
                  onElementContextMenu(el.id, e.clientX, e.clientY);
                }
              }}
              activeElementId={activeElementId}
              parentGap={config.gap ?? 16}
              parentLayout={config.layout}
              onElementSelect={onElementSelect}
              onElementContextMenu={onElementContextMenu}
              onAddElementClick={onAddElementClick}
              newlyAddedElementId={newlyAddedElementId}
              onElementSelectOnly={onElementSelectOnly}
              onElementEdit={onElementEdit}
              onDeleteElement={onDeleteElement}
              sectionId={id}
              onDropWidget={onDropWidget}
              isDraggingWidget={isDraggingWidget}
              activeSubFocus={activeSubFocus}
              isLeftPanelOpen={isLeftPanelOpen}
              onOpenEditPanel={onOpenEditPanel}
              isLocalNavigatorOpen={isLocalNavigatorOpen}
              onSectionSelect={onSectionSelect}
            />
            );
          });
        })()
        )}
      </div>
    </div>
    </>
  );
};
