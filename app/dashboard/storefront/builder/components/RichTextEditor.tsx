// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { Link2, Maximize2, Table, Strikethrough, Minus, Clipboard, Eraser, Quote, AlignLeft, AlignCenter, AlignRight, ChevronLeft, ChevronRight, Undo2, Redo2, HelpCircle, Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { RichTextEditorProps } from "../types";

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
      const editorRef = useRef<HTMLDivElement>(null);
      const isUpdatingRef = useRef(false);

      // Sinkronisasi value dari luar hanya jika kontennya benar-benar berbeda
      useEffect(() => {
        if (editorRef.current) {
          if (editorRef.current.innerHTML !== value) {
            isUpdatingRef.current = true;
            editorRef.current.innerHTML = value || "";
            isUpdatingRef.current = false;
          }
        }
      }, [value]);

      const executeCommand = (command: string, ui: boolean = false, val: any = null) => {
        document.execCommand(command, ui, val);
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      };

      const handleInput = () => {
        if (editorRef.current && !isUpdatingRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      };

      const handlePromptLink = () => {
        const url = prompt("Masukkan URL tautan:");
        if (url) {
          executeCommand("createLink", false, url);
        }
      };

      const handlePromptColor = () => {
        const color = prompt("Masukkan kode warna HEX (misal: #ef4444 atau red):");
        if (color) {
          executeCommand("foreColor", false, color);
        }
      };

      return (
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#1e1e1e] flex flex-col">
          {/* Toolbar */}
          <div className="p-2 border-b border-zinc-800 bg-[#16161a] space-y-1 select-none">
            {/* Row 1 */}
            <div className="flex flex-wrap items-center gap-1">
              {/* Dropdown gaya */}
              <div className="relative">
                <select
                  className="text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-200 rounded px-1.5 py-1 outline-none font-bold cursor-pointer"
                  value="p"
                  onChange={(e) => {
                    executeCommand("formatBlock", false, `<${e.target.value}>`);
                  }}
                >
                  <option value="p">Paragraf</option>
                  <option value="h1">Judul 1</option>
                  <option value="h2">Judul 2</option>
                  <option value="h3">Judul 3</option>
                </select>
              </div>

              <div className="w-px h-4 bg-zinc-800 mx-0.5" />

              {/* Bold, Italic, Underline, Bullet List */}
              {[
                { cmd: "bold", icon: Bold, title: "Bold" },
                { cmd: "italic", icon: Italic, title: "Italic" },
                { cmd: "underline", icon: Underline, title: "Underline" },
                { cmd: "insertUnorderedList", icon: List, title: "Bullet List" },
              ].map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.cmd}
                    type="button"
                    onClick={() => executeCommand(btn.cmd)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                    title={btn.title}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap items-center gap-1">
              {[
                { cmd: "insertOrderedList", icon: ListOrdered, title: "Numbered List" },
              ].map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.cmd}
                    type="button"
                    onClick={() => executeCommand(btn.cmd)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                    title={btn.title}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handlePromptLink}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Tautan (Link)"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (editorRef.current) {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      editorRef.current.requestFullscreen();
                    }
                  }
                }}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const rows = prompt("Masukkan jumlah baris (default: 2):", "2");
                  const cols = prompt("Masukkan jumlah kolom (default: 2):", "2");
                  if (rows && cols) {
                    let html = "<table class='border-collapse border border-zinc-300 my-2 w-full'>";
                    for (let r = 0; r < Number(rows); r++) {
                      html += "<tr>";
                      for (let c = 0; c < Number(cols); c++) {
                        html += "<td class='border border-zinc-300 p-1.5 text-xs'>Sel</td>";
                      }
                      html += "</tr>";
                    }
                    html += "</table>";
                    executeCommand("insertHTML", false, html);
                  }
                }}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Tabel (Table)"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Row 3 */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => executeCommand("strikeThrough")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Coret (Strikethrough)"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("insertHorizontalRule")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Garis Horizontal"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handlePromptColor}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Warna Teks"
              >
                <span className="font-extrabold text-xs border-b-2 border-red-500 pb-px text-zinc-300">A</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    executeCommand("insertText", false, text);
                  } catch (e) {
                    const text = prompt("Tempel teks di sini:");
                    if (text) executeCommand("insertText", false, text);
                  }
                }}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Tempel sebagai teks polos"
              >
                <Clipboard className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("removeFormat")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Hapus Pemformatan"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("formatBlock", false, "<blockquote>")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Kutipan (Blockquote)"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("justifyLeft")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Rata Kiri"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Row 4 */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => executeCommand("justifyCenter")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Rata Tengah"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("justifyRight")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Rata Kanan"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("insertText", false, "Ω")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer font-bold text-xs"
                title="Karakter Khusus (Ω)"
              >
                Ω
              </button>

              <button
                type="button"
                onClick={() => executeCommand("outdent")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Kurangi Indentasi"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("indent")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Tambah Indentasi"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("undo")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Urungkan (Undo)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("redo")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Ulangi (Redo)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Row 5 */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => alert("Petunjuk: Gunakan toolbar di atas untuk memformat teks paragraf Anda secara visual.")}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
                title="Bantuan (Help)"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Editor Content Area */}
          <div 
            ref={editorRef}
            contentEditable={true}
            onInput={handleInput}
            className="p-4 bg-white text-zinc-800 text-sm outline-none overflow-y-auto leading-relaxed text-left min-h-[160px] max-h-[300px] border-b border-zinc-200"
            style={{
              fontFamily: 'serif',
              color: '#2d3748'
            }}
          />

          {/* Status Bar / Footer */}
          <div className="px-3 py-1 bg-zinc-100 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-semibold select-none">
            <span>p</span>
            <div className="cursor-se-resize flex flex-col gap-0.5 items-end justify-end w-3 h-3">
              <span className="w-2 h-0.5 bg-zinc-300" />
              <span className="w-1.5 h-0.5 bg-zinc-300" />
              <span className="w-1.5 h-0.5 bg-zinc-300" />
            </div>
          </div>
        </div>
      );
    };

