// @ts-nocheck
import { ChevronUp, ChevronDown } from "lucide-react";
import { MoveControlsProps } from "../types";

export function MoveControls({ canMoveUp, canMoveDown, onMoveUp, onMoveDown }: MoveControlsProps) {
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

