// @ts-nocheck
import { SectionElement } from "@/components/storefront/sections/BuilderSection";

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

