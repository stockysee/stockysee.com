import { Section } from "./types";

export const sanitizeSections = (secs: Section[]): Section[] => {
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
export const parseUnitAndValue = (rawVal: any, defaultVal = 0) => {
      if (rawVal === undefined || rawVal === null || rawVal === '') {
        return { val: defaultVal, unit: 'px' as const, customStr: '', isCustom: false, isDefault: true };
      }
      if (typeof rawVal === 'number') {
        return { val: rawVal, unit: 'px' as const, customStr: '', isCustom: false, isDefault: false };
      }
      const str = String(rawVal).trim();

      const match = str.match(/^([\d.-]+)(px|vw|%|rem|em|vh)$/);
      if (match) {
        const num = parseFloat(match[1]);
        const unit = match[2];
        if (unit === 'px' || unit === 'vw' || unit === '%' || unit === 'em' || unit === 'rem' || unit === 'vh') {
          return { val: num, unit: unit as 'px' | 'vw' | '%' | 'em' | 'rem' | 'vh', customStr: '', isCustom: false, isDefault: false };
        }
      }

      if (/^[\d.-]+$/.test(str)) {
        return { val: parseFloat(str), unit: 'px' as const, customStr: '', isCustom: false, isDefault: false };
      }

      return { val: defaultVal, unit: 'custom' as const, customStr: str, isCustom: true, isDefault: false };
    };
