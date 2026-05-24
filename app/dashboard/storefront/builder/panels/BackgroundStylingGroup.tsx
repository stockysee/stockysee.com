// @ts-nocheck
import React from 'react';
import { Paintbrush, RotateCcw, Monitor, ChevronDown } from 'lucide-react';
import { Section } from '../types';
import { SectionElement } from '@/components/storefront/sections/BuilderSection';

interface BackgroundStylingGroupProps {
  activeElement: SectionElement;
  editingSection: Section;
  handleUpdateElement: (sectionId: string, elementId: string, payload: any) => void;
  prefix?: string; // e.g., 'card' -> looks for cardBgType instead of bgType
}

export function BackgroundStylingGroup({
  activeElement,
  editingSection,
  handleUpdateElement,
  prefix = ''
}: BackgroundStylingGroupProps) {
  // Helper to get config key with optional prefix
  const getKey = (key: string) => {
    if (!prefix) return key;
    // capitalize first letter of key if prefix exists
    return `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`;
  };

  const bgTypeKey = getKey('bgType');
  const bgColorKey = getKey('bgColor');
  const bgGradientColor1Key = getKey('bgGradientColor1');
  const bgGradientColor2Key = getKey('bgGradientColor2');
  const bgGradientLoc1Key = getKey('bgGradientLoc1');
  const bgGradientLoc2Key = getKey('bgGradientLoc2');
  const bgGradientTypeKey = getKey('bgGradientType');
  const bgGradientAngleKey = getKey('bgGradientAngle');
  const bgGradientRadialPosKey = getKey('bgGradientRadialPos');

  const currentBgType = activeElement.config[bgTypeKey] || 'classic';

  return (
    <div className="space-y-4">
      {/* Background Type */}
      <div className="flex items-center justify-between py-1">
        <span className="text-xs text-zinc-300 font-medium">Tipe Latar</span>
        <div className="flex gap-0.5 bg-[#25262b] rounded p-0.5 border border-zinc-800">
          <button 
            type="button"
            onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { [bgTypeKey]: 'classic' })}
            className={`p-1.5 rounded shadow-sm transition-colors ${currentBgType === 'classic' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
            title="Klasik"
          >
            <Paintbrush className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button"
            onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { [bgTypeKey]: 'gradient' })}
            className={`p-1.5 rounded shadow-sm transition-colors ${currentBgType === 'gradient' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
            title="Gradien"
          >
            <div className="w-3.5 h-3.5 rounded-[1px] bg-gradient-to-br from-zinc-300 to-zinc-600"></div>
          </button>
        </div>
      </div>

      {/* Conditional Content based on bgType */}
      {currentBgType === 'classic' && (
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-zinc-300 font-medium">Warna</span>
          <div className="flex border border-zinc-700 rounded overflow-hidden">
            {activeElement.config[bgColorKey] && activeElement.config[bgColorKey] !== 'transparent' && (
              <button 
                type="button" 
                onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { [bgColorKey]: 'transparent' })}
                className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                title="Reset Warna"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
              <input 
                type="color" 
                value={activeElement.config[bgColorKey] && activeElement.config[bgColorKey] !== 'transparent' ? activeElement.config[bgColorKey] : '#ffffff'} 
                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgColorKey]: e.target.value })} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              {(!activeElement.config[bgColorKey] || activeElement.config[bgColorKey] === 'transparent') ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                </div>
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: activeElement.config[bgColorKey] }}></div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentBgType === 'gradient' && (
        <div className="space-y-4 pt-2">
          <div className="border-l-2 border-orange-500 bg-[#321c0c] p-3 text-[11px] text-orange-200/90 italic font-medium leading-relaxed">
            Set locations and angle for each breakpoint to ensure the gradient adapts to different screen sizes.
          </div>

          {/* Warna 1 */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-zinc-300 font-medium">Warna 1</span>
            <div className="flex border border-zinc-700 rounded overflow-hidden">
              {activeElement.config[bgGradientColor1Key] && activeElement.config[bgGradientColor1Key] !== 'transparent' && (
                <button 
                  type="button" 
                  onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientColor1Key]: 'transparent' })}
                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  title="Reset Warna"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                <input 
                  type="color" 
                  value={activeElement.config[bgGradientColor1Key] && activeElement.config[bgGradientColor1Key] !== 'transparent' ? activeElement.config[bgGradientColor1Key] : '#ffffff'} 
                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientColor1Key]: e.target.value })} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                {(!activeElement.config[bgGradientColor1Key] || activeElement.config[bgGradientColor1Key] === 'transparent') ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0" style={{ backgroundColor: activeElement.config[bgGradientColor1Key] }}></div>
                )}
              </div>
            </div>
          </div>

          {/* Lokasi 1 */}
          <div className="space-y-2 py-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-300 font-medium">Lokasi</span>
                <Monitor className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                <span>%</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <input 
                type="range" min="0" max="100" 
                value={activeElement.config[bgGradientLoc1Key] ?? 0}
                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientLoc1Key]: Number(e.target.value) })}
                className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
              />
              <input 
                type="number" 
                value={activeElement.config[bgGradientLoc1Key] ?? 0}
                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientLoc1Key]: Number(e.target.value) })}
                className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
              />
            </div>
          </div>

          {/* Warna 2 */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-zinc-300 font-medium">Warna 2</span>
            <div className="flex border border-zinc-700 rounded overflow-hidden">
              {activeElement.config[bgGradientColor2Key] && activeElement.config[bgGradientColor2Key] !== 'transparent' && (
                <button 
                  type="button" 
                  onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientColor2Key]: 'transparent' })}
                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  title="Reset Warna"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                <input 
                  type="color" 
                  value={activeElement.config[bgGradientColor2Key] && activeElement.config[bgGradientColor2Key] !== 'transparent' ? activeElement.config[bgGradientColor2Key] : '#e83a65'} 
                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientColor2Key]: e.target.value })} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                {(!activeElement.config[bgGradientColor2Key] || activeElement.config[bgGradientColor2Key] === 'transparent') ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0" style={{ backgroundColor: activeElement.config[bgGradientColor2Key] || '#e83a65' }}></div>
                )}
              </div>
            </div>
          </div>

          {/* Lokasi 2 */}
          <div className="space-y-2 py-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-300 font-medium">Lokasi</span>
                <Monitor className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                <span>%</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <input 
                type="range" min="0" max="100" 
                value={activeElement.config[bgGradientLoc2Key] ?? 100}
                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientLoc2Key]: Number(e.target.value) })}
                className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
              />
              <input 
                type="number" 
                value={activeElement.config[bgGradientLoc2Key] ?? 100}
                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientLoc2Key]: Number(e.target.value) })}
                className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
              />
            </div>
          </div>

          {/* Tipe Gradien */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-zinc-300 font-medium">Tipe</span>
            <div className="relative">
              <select 
                value={activeElement.config[bgGradientTypeKey] || 'linear'}
                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientTypeKey]: e.target.value })}
                className="appearance-none w-[140px] bg-[#1e1f23] border border-zinc-700 text-zinc-300 text-xs font-medium rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:border-zinc-500"
              >
                <option value="linear">Linier</option>
                <option value="radial">Radial</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Sudut */}
          {(!activeElement.config[bgGradientTypeKey] || activeElement.config[bgGradientTypeKey] === 'linear') && (
            <div className="space-y-2 py-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-300 font-medium">Sudut</span>
                  <Monitor className="w-3 h-3 text-zinc-400" />
                </div>
                <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                  <span>deg</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <input 
                  type="range" min="0" max="360" 
                  value={activeElement.config[bgGradientAngleKey] ?? 180}
                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientAngleKey]: Number(e.target.value) })}
                  className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                />
                <input 
                  type="number" 
                  value={activeElement.config[bgGradientAngleKey] ?? 180}
                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientAngleKey]: Number(e.target.value) })}
                  className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                />
              </div>
            </div>
          )}

          {/* Posisi Gradien Radial */}
          {activeElement.config[bgGradientTypeKey] === 'radial' && (
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-300 font-medium">Posisi</span>
              <div className="relative">
                <select 
                  value={activeElement.config[bgGradientRadialPosKey] || 'center center'}
                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { [bgGradientRadialPosKey]: e.target.value })}
                  className="appearance-none w-[140px] bg-[#1e1f23] border border-zinc-700 text-zinc-300 text-xs font-medium rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:border-zinc-500"
                >
                  <option value="center center">Tengah Tengah</option>
                  <option value="left center">Tengah Kiri</option>
                  <option value="right center">Tengah Kanan</option>
                  <option value="center top">Tengah Atas</option>
                  <option value="center bottom">Tengah Bawah</option>
                  <option value="left top">Kiri Atas</option>
                  <option value="left bottom">Kiri Bawah</option>
                  <option value="right top">Kanan Atas</option>
                  <option value="right bottom">Kanan Bawah</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

