// @ts-nocheck
import React from 'react';
import { Monitor, Pencil, RotateCcw, Plus, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { POPULAR_FONTS } from '../constants';

interface TextStylingGroupProps {
  prefix: string;
  label: string;
  defaultFontSize?: number;
  activeElement: any;
  editingSection: any;
  handleUpdateElement: (sectionId: string, elementId: string, payload: any) => void;
  activeDropdown: any;
  setActiveDropdown: (val: any) => void;
  hideAlign?: boolean;
}

export function TextStylingGroup({
  prefix,
  label,
  defaultFontSize = 16,
  activeElement,
  editingSection,
  handleUpdateElement,
  activeDropdown,
  setActiveDropdown,
  hideAlign = false
}: TextStylingGroupProps) {
  
  const getProp = (key: string) => {
    if (prefix === '') return activeElement.config[key];
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    return activeElement.config[`${prefix}${capitalizedKey}`];
  };

  const updateProp = (key: string, value: any) => {
    if (prefix === '') {
      handleUpdateElement(editingSection.id, activeElement.id, { [key]: value });
    } else {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      handleUpdateElement(editingSection.id, activeElement.id, { [`${prefix}${capitalizedKey}`]: value });
    }
  };

  const updateMultipleProps = (payload: any) => {
    if (prefix === '') {
      handleUpdateElement(editingSection.id, activeElement.id, payload);
    } else {
      const prefixedPayload: any = {};
      Object.keys(payload).forEach(key => {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        prefixedPayload[`${prefix}${capitalizedKey}`] = payload[key];
      });
      handleUpdateElement(editingSection.id, activeElement.id, prefixedPayload);
    }
  };

  const dropdownKeyPrefix = prefix === '' ? 'base' : prefix;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Label Header (Optional, if we want to show which text we are editing) */}
      <div className="pb-1 border-b border-zinc-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{label}</span>
      </div>

      {/* Perataan */}
      {!hideAlign && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-300 font-semibold">Perataan</span>
            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="flex border border-zinc-800 rounded-[4px] overflow-hidden bg-zinc-950/20">
            {['left', 'center', 'right', 'justify'].map((a, idx) => {
              const isActive = (getProp('align') || 'left') === a;
              const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : a === 'right' ? AlignRight : AlignJustify;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    console.log(`[Editor] Perataan ${prefix} diperbarui ke:`, a);
                    updateProp('align', a);
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
      )}

      {/* Penulisan (Typography) */}
      <div className="flex items-center justify-between relative">
        <span className="text-xs text-zinc-300 font-semibold">Penulisan</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(activeDropdown?.field === `penulisan_${dropdownKeyPrefix}` ? null : { field: `penulisan_${dropdownKeyPrefix}` });
          }}
          className={`w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center transition-all ${
            activeDropdown?.field === `penulisan_${dropdownKeyPrefix}` 
              ? 'bg-zinc-800 text-white' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        
        {/* Popover Penulisan */}
        {activeDropdown?.field === `penulisan_${dropdownKeyPrefix}` && (
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
                    console.log(`[Editor] Reset penulisan ${prefix}`);
                    updateMultipleProps({
                      fontFamily: undefined,
                      fontSize: undefined,
                      fontWeight: undefined,
                      textTransform: undefined,
                      fontStyle: undefined,
                      textDecoration: undefined,
                      lineHeight: undefined,
                      letterSpacing: undefined,
                      wordSpacing: undefined
                    });
                  }}
                  className="text-zinc-500 hover:text-zinc-300 font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Family */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Family</span>
              <select
                value={getProp('fontFamily') || 'Roboto'}
                onChange={(e) => updateProp('fontFamily', e.target.value)}
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
                  value={String(getProp('fontSize') || `${defaultFontSize}px`).replace(/[0-9.]/g, '') || 'px'}
                  onChange={(e) => {
                    const num = parseInt(String(getProp('fontSize') || defaultFontSize)) || defaultFontSize;
                    updateProp('fontSize', `${num}${e.target.value}`);
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
                  value={parseInt(String(getProp('fontSize') || defaultFontSize)) || defaultFontSize}
                  onChange={(e) => {
                    const unit = String(getProp('fontSize') || `${defaultFontSize}px`).replace(/[0-9.]/g, '') || 'px';
                    updateProp('fontSize', `${e.target.value}${unit}`);
                  }}
                  className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                />
                <input
                  type="number"
                  value={parseInt(String(getProp('fontSize') || defaultFontSize)) || defaultFontSize}
                  onChange={(e) => {
                    const unit = String(getProp('fontSize') || `${defaultFontSize}px`).replace(/[0-9.]/g, '') || 'px';
                    updateProp('fontSize', `${e.target.value}${unit}`);
                  }}
                  className="w-12 h-6 px-1 text-center text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-[4px] outline-none font-bold"
                />
              </div>
            </div>

            {/* Ketebalan */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Ketebalan</span>
              <select
                value={getProp('fontWeight') || '600'}
                onChange={(e) => updateProp('fontWeight', e.target.value)}
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
                value={getProp('textTransform') || 'none'}
                onChange={(e) => updateProp('textTransform', e.target.value)}
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
                value={getProp('fontStyle') || 'normal'}
                onChange={(e) => updateProp('fontStyle', e.target.value)}
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
                value={getProp('textDecoration') || 'none'}
                onChange={(e) => updateProp('textDecoration', e.target.value)}
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
                  value={String(getProp('lineHeight') || '1.2em').replace(/[0-9.]/g, '') || 'em'}
                  onChange={(e) => {
                    const num = parseFloat(String(getProp('lineHeight') || '1.2')) || 1.2;
                    updateProp('lineHeight', `${num}${e.target.value}`);
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
                  value={parseFloat(String(getProp('lineHeight') || '1.2')) || 1.2}
                  onChange={(e) => {
                    const unit = String(getProp('lineHeight') || '1.2em').replace(/[0-9.]/g, '') || 'em';
                    updateProp('lineHeight', `${e.target.value}${unit}`);
                  }}
                  className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                />
                <input
                  type="number"
                  step="0.1"
                  value={parseFloat(String(getProp('lineHeight') || '1.2')) || 1.2}
                  onChange={(e) => {
                    const unit = String(getProp('lineHeight') || '1.2em').replace(/[0-9.]/g, '') || 'em';
                    updateProp('lineHeight', `${e.target.value}${unit}`);
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
                  value={String(getProp('letterSpacing') || '0px').replace(/[-0-9]/g, '') || 'px'}
                  onChange={(e) => {
                    const num = parseInt(String(getProp('letterSpacing') || '0')) || 0;
                    updateProp('letterSpacing', `${num}${e.target.value}`);
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
                  value={parseInt(String(getProp('letterSpacing') || '0')) || 0}
                  onChange={(e) => {
                    const unit = String(getProp('letterSpacing') || '0px').replace(/[-0-9]/g, '') || 'px';
                    updateProp('letterSpacing', `${e.target.value}${unit}`);
                  }}
                  className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                />
                <input
                  type="number"
                  value={parseInt(String(getProp('letterSpacing') || '0')) || 0}
                  onChange={(e) => {
                    const unit = String(getProp('letterSpacing') || '0px').replace(/[-0-9]/g, '') || 'px';
                    updateProp('letterSpacing', `${e.target.value}${unit}`);
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
                  value={String(getProp('wordSpacing') || '0px').replace(/[-0-9]/g, '') || 'px'}
                  onChange={(e) => {
                    const num = parseInt(String(getProp('wordSpacing') || '0')) || 0;
                    updateProp('wordSpacing', `${num}${e.target.value}`);
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
                  value={parseInt(String(getProp('wordSpacing') || '0')) || 0}
                  onChange={(e) => {
                    const unit = String(getProp('wordSpacing') || '0px').replace(/[-0-9]/g, '') || 'px';
                    updateProp('wordSpacing', `${e.target.value}${unit}`);
                  }}
                  className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                />
                <input
                  type="number"
                  value={parseInt(String(getProp('wordSpacing') || '0')) || 0}
                  onChange={(e) => {
                    const unit = String(getProp('wordSpacing') || '0px').replace(/[-0-9]/g, '') || 'px';
                    updateProp('wordSpacing', `${e.target.value}${unit}`);
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
            setActiveDropdown(activeDropdown?.field === `strokeTeks_${dropdownKeyPrefix}` ? null : { field: `strokeTeks_${dropdownKeyPrefix}` });
          }}
          className={`w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center transition-all ${
            activeDropdown?.field === `strokeTeks_${dropdownKeyPrefix}` 
              ? 'bg-zinc-800 text-white' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {/* Popover Stroke Teks */}
        {activeDropdown?.field === `strokeTeks_${dropdownKeyPrefix}` && (
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
                  updateMultipleProps({
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
                  value={getProp('textStrokeWidth') || 0}
                  onChange={(e) => updateProp('textStrokeWidth', Number(e.target.value))}
                  className="flex-1 accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
                />
                <input
                  type="number"
                  value={getProp('textStrokeWidth') || 0}
                  onChange={(e) => updateProp('textStrokeWidth', Number(e.target.value))}
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
                  value={getProp('textStrokeColor') || '#000000'}
                  onChange={(e) => updateProp('textStrokeColor', e.target.value)}
                  className="w-8 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={getProp('textStrokeColor') || '#000000'}
                  onChange={(e) => updateProp('textStrokeColor', e.target.value)}
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
            setActiveDropdown(activeDropdown?.field === `textShadow_${dropdownKeyPrefix}` ? null : { field: `textShadow_${dropdownKeyPrefix}` });
          }}
          className={`w-8 h-8 rounded-[4px] border border-zinc-800 flex items-center justify-center transition-all ${
            activeDropdown?.field === `textShadow_${dropdownKeyPrefix}` 
              ? 'bg-zinc-800 text-white' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {/* Popover Text Shadow */}
        {activeDropdown?.field === `textShadow_${dropdownKeyPrefix}` && (
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
                  updateMultipleProps({
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
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-400">Warna</span>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={getProp('textShadowColor') || '#000000'}
                  onChange={(e) => updateProp('textShadowColor', e.target.value)}
                  className="w-8 h-7 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={getProp('textShadowColor') || '#000000'}
                  onChange={(e) => updateProp('textShadowColor', e.target.value)}
                  className="w-20 px-1.5 h-7 rounded text-[10px] bg-zinc-950 text-zinc-100 border border-zinc-800 outline-none font-bold animate-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center"><span className="text-[10px] text-zinc-400 font-semibold">Blur</span></div>
              <div className="flex gap-2 items-center">
                <input type="range" min="0" max="100" value={getProp('textShadowBlur') ?? 10} onChange={(e) => updateProp('textShadowBlur', Number(e.target.value))} className="flex-1 accent-zinc-100 h-1 bg-zinc-800 rounded-lg cursor-pointer" />
                <input type="number" value={getProp('textShadowBlur') ?? 10} onChange={(e) => updateProp('textShadowBlur', Number(e.target.value))} className="w-12 h-6 text-center text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 rounded outline-none font-bold" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center"><span className="text-[10px] text-zinc-400 font-semibold">Horizontal (X)</span></div>
              <div className="flex gap-2 items-center">
                <input type="range" min="-50" max="50" value={getProp('textShadowOffsetX') ?? 0} onChange={(e) => updateProp('textShadowOffsetX', Number(e.target.value))} className="flex-1 accent-zinc-100 h-1 bg-zinc-800 rounded-lg cursor-pointer" />
                <input type="number" value={getProp('textShadowOffsetX') ?? 0} onChange={(e) => updateProp('textShadowOffsetX', Number(e.target.value))} className="w-12 h-6 text-center text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 rounded outline-none font-bold" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center"><span className="text-[10px] text-zinc-400 font-semibold">Vertikal (Y)</span></div>
              <div className="flex gap-2 items-center">
                <input type="range" min="-50" max="50" value={getProp('textShadowOffsetY') ?? 0} onChange={(e) => updateProp('textShadowOffsetY', Number(e.target.value))} className="flex-1 accent-zinc-100 h-1 bg-zinc-800 rounded-lg cursor-pointer" />
                <input type="number" value={getProp('textShadowOffsetY') ?? 0} onChange={(e) => updateProp('textShadowOffsetY', Number(e.target.value))} className="w-12 h-6 text-center text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 rounded outline-none font-bold" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warna Teks */}
      <div className="flex items-center justify-between relative">
        <span className="text-xs text-zinc-300 font-semibold">Warna Teks</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={getProp('color') || getProp('textColor') || '#18181B'}
            onChange={(e) => {
              if (prefix === '') updateProp('textColor', e.target.value);
              else updateProp('color', e.target.value);
            }}
            className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
          />
        </div>
      </div>
    </div>
  );
}

