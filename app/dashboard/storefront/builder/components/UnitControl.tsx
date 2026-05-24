// @ts-nocheck
import { ChevronDown } from "lucide-react";
import { UnitControlProps } from "../types";
import { parseUnitAndValue } from "../utils";

export function UnitControl({
      label,
      value,
      onChange,
      min = 0,
      max = 1000,
      defaultValue = 0,
      fieldKey,
      activeDropdown,
      setActiveDropdown,
      elementId
    }: UnitControlProps) {
    const parsed = parseUnitAndValue(value, defaultValue);
    const dropdownOpen = activeDropdown?.field === fieldKey && activeDropdown?.elementId === elementId;
    const handleUnitSelect = (newUnit: 'px' | 'vw' | '%' | 'custom') => {
            setActiveDropdown(null);
            console.log(`[UnitControl] Unit diubah ke: ${newUnit} untuk field: ${fieldKey}`);
            if (newUnit === 'custom') {
              onChange(parsed.unit === 'custom' ? parsed.customStr : `${parsed.val}${parsed.unit === 'px' ? '' : parsed.unit}`);
            } else {
              onChange(newUnit === 'px' ? parsed.val : `${parsed.val}${newUnit}`);
            }
          };
    return (
    <div className="space-y-2 py-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{label}</span>

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (dropdownOpen) {
                setActiveDropdown(null);
              } else {
                setActiveDropdown({ field: fieldKey, elementId });
              }
            }}
            className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-white font-black bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 transition-all select-none cursor-pointer"
          >
            <span>{parsed.unit === 'custom' ? '✏️ Custom' : parsed.unit}</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden py-1 z-[1000] animate-in fade-in slide-in-from-top-1 duration-150">
              {(['px', 'vw', '%', 'custom'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleUnitSelect(u)}
                  className={`w-full text-left text-[10px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-between ${parsed.unit === u ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400'}`}
                >
                  <span>{u === 'custom' ? '✏️ Custom' : u}</span>
                  {parsed.unit === u && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {parsed.unit === 'custom' ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={parsed.customStr}
            placeholder="Contoh: calc(100vh - 40px), auto"
            onChange={(e) => {
              onChange(e.target.value);
              console.log(`[UnitControl] Custom value diubah ke: ${e.target.value} untuk field: ${fieldKey}`);
            }}
            className="flex-1 h-8 text-xs px-2.5 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded focus:border-zinc-700 outline-none placeholder:text-zinc-700 font-bold"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={min}
            max={max}
            value={parsed.val}
            onChange={(e) => {
              const num = Number(e.target.value);
              onChange(parsed.unit === 'px' ? num : `${num}${parsed.unit}`);
              console.log(`[UnitControl] Slider diubah ke: ${num} dengan unit: ${parsed.unit} untuk field: ${fieldKey}`);
            }}
            className="flex-1 accent-white bg-zinc-800 h-1 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="number"
            value={parsed.isDefault ? '' : parsed.val}
            placeholder={String(defaultValue)}
            onChange={(e) => {
              const raw = e.target.value;
              console.log(`[UnitControl Debug] Input number raw untuk field: ${fieldKey} ke: "${raw}"`);
              if (raw === '') {
                console.log(`[UnitControl Debug] Field ${fieldKey} kosong, mengembalikan ke default (undefined)`);
                onChange(undefined);
                return;
              }
              const num = Number(raw);
              onChange(parsed.unit === 'px' ? num : `${num}${parsed.unit}`);
              console.log(`[UnitControl Debug] Field ${fieldKey} diubah ke: ${num}${parsed.unit === 'px' ? '' : parsed.unit}`);
            }}
            className={`w-14 h-7 text-center text-xs font-bold bg-[#1a1a1f] border border-zinc-800 rounded focus:border-zinc-700 outline-none transition-all ${parsed.isDefault ? 'text-zinc-100/40 placeholder:text-zinc-100/40' : 'text-zinc-100'}`}
          />
        </div>
      )}
    </div>
    );
}

