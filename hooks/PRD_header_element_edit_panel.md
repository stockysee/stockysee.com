# PRD: Redesign Edit Panel — Element Header (BRANDING & MENU)

**Tanggal:** 24 Mei 2026  
**Scope:** Edit panel untuk element `BRANDING` (Nama & Logo Toko) dan `MENU` (Navigasi) di dalam header visual builder  
**File utama:** `app/dashboard/storefront/builder/panels/EditorPanel.tsx`  
**File pendukung:** `components/storefront/sections/BuilderSection.tsx` (BrandingElement render)

---

## Latar Belakang

Edit panel saat ini untuk elemen header tidak konsisten dengan edit panel elemen lain (HEADING, IMAGE, BUTTON). Panel BRANDING dan MENU hanya punya tab "Konten" dengan kontrol minimal yang digabung jadi satu — tidak ada pemisahan layer sub-fokus, tidak ada tab Gaya, tidak ada tab Lanjutan.

---

## Tujuan

Samakan struktur UX edit panel BRANDING dan MENU dengan standar edit panel elemen lain (HEADING, IMAGE), namun disesuaikan dengan kebutuhan masing-masing elemen TERMASUK DI SETIAP TAB NYA MASING" (konten, gaya, dan lanjutan).

---

## Arsitektur Sub-Fokus (Layer)

Element BRANDING adalah satu elemen tapi punya **dua layer yang bisa diedit secara terpisah**: Logo dan Teks. Gunakan `activeSubFocus` untuk toggle antara keduanya — pola ini sudah ada di elemen COLUMN dan PRODUCT_LIST.

```
BRANDING element terpilih
├── Sub-fokus: null (default) → tampilkan pilihan layer: Logo | Teks
├── Sub-fokus: 'logo'  → panel edit Logo
└── Sub-fokus: 'text'  → panel edit Teks (nama toko)

MENU element terpilih
└── Tidak ada sub-fokus (satu layer, langsung ke panel)
```

---

## Spesifikasi: Element BRANDING

### Tab Konten — Sub-fokus null (pilih layer)

Tampilkan dua tombol pemilih layer, mirip pola PRODUCT_LIST:

```tsx
// Saat activeSubFocus === null && activeElement.type === 'BRANDING'
<div className="space-y-3">
  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Pilih Bagian</span>
  <div className="grid grid-cols-2 gap-2">
    <button onClick={() => setActiveSubFocus('logo')}
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all group">
      <ImageIcon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200" />
      <span className="text-[10px] font-bold uppercase text-zinc-400 group-hover:text-zinc-200">Logo</span>
    </button>
    <button onClick={() => setActiveSubFocus('text')}
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all group">
      <Type className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200" />
      <span className="text-[10px] font-bold uppercase text-zinc-400 group-hover:text-zinc-200">Teks</span>
    </button>
  </div>
</div>
```

---

### Tab Konten — Sub-fokus: `logo`

**Tampilkan tombol Back** ke pemilih layer di atas panel.

Kontrol yang tersedia:

| Kontrol | Config key | Tipe | Default | Keterangan |
|---------|-----------|------|---------|------------|
| Ukuran Logo | `logoSize` | `number` (px) | `40` | Slider min 24 max 120 |
| Bentuk Logo | `logoShape` | `'square' \| 'rounded' \| 'circle'` | `'circle'` | Toggle 3 pilihan dengan icon preview |

**Bentuk Logo — 3 pilihan visual:**
- `square` → `borderRadius: 0` (ikon: kotak)
- `rounded` → `borderRadius: 8px` (ikon: kotak sudut tumpul)
- `circle` → `borderRadius: 9999px` (ikon: lingkaran)

**Tidak ada upload logo di sini** — logo diambil dari data toko (profile). Tambahkan teks info kecil: _"Logo diambil dari pengaturan profil toko"_ dengan link ke halaman settings.

---

### Tab Gaya — Sub-fokus: `logo`

| Kontrol | Config key | Tipe | Default | Keterangan |
|---------|-----------|------|---------|------------|
| Warna Latar Logo | `logoBgColor` | `string (hex)` | `'transparent'` | Color picker + toggle on/off |

Hanya satu kontrol di tab Gaya untuk logo. Tampilkan toggle "Aktifkan Latar" → jika aktif, tampilkan color picker.

---

### Tab Konten — Sub-fokus: `text`

**Tampilkan tombol Back** ke pemilih layer.

Kontrol yang tersedia (sama seperti HEADING layout tab):

| Kontrol | Config key | Tipe | Default |
|---------|-----------|------|---------|
| Nama Toko | — | — | Read-only, tampilkan nama dari `client.name` dengan info: _"Ubah nama di pengaturan profil"_ |
| Tag HTML | `textTag` | `'span' \| 'p' \| 'h1' \| 'h2'` | `'span'` | Select dropdown |

> Nama toko tidak bisa diedit dari sini karena sync dengan data profil akun.

---

### Tab Gaya — Sub-fokus: `text`

Gunakan pola yang sama dengan tab Gaya HEADING. Kontrol:

| Kontrol | Config key | Tipe | Default |
|---------|-----------|------|---------|
| Perataan | `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Icon button group |
| Penulisan (popover) | `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `textTransform`, `letterSpacing`, `lineHeight` | mixed | — | Popover sama persis dengan HEADING |
| Warna Teks | `textColor` | `string (hex)` | `'#18181B'` | Color picker + opacity |
| Efek Teks (popover) | `textShadow`, `textStroke` | mixed | — | Opsional, bisa skip di v1 |

---

### Tab Gaya — Sub-fokus: `null` (level elemen)

Tidak ada kontrol khusus di level elemen — langsung arahkan ke pilih layer.

---

## Spesifikasi: Element MENU

Tidak ada sub-fokus. Satu panel langsung.

### Tab Konten

Restructur menjadi dua bagian yang jelas:

#### Bagian 1: Daftar Halaman di Menu

Ganti label "Sembunyikan Halaman" (negatif/confusing) → **"Halaman yang Ditampilkan"** (positif).

UI: List item dengan toggle per halaman, bukan checkbox "sembunyikan".

```
Halaman yang ditampilkan di menu:
┌─────────────────────────────────┐
│ ● Katalog          [toggle ON]  │  ← default page, selalu ada
│ ● Kategori         [toggle ON]  │  ← muncul jika ada kategori
│ ● Tentang Kami     [toggle OFF] │  ← muncul jika ada halaman about
│ ─────────────────────────────── │
│ ● [nama halaman custom]  [ON]   │  ← dari client.storePages (dynamic)
│ ● [nama halaman custom]  [OFF]  │
└─────────────────────────────────┘
```

Data source untuk halaman custom: `allCustomPages.pages` (sudah tersedia di EditorPanel via props). Sync otomatis — jika user tambah halaman baru di menu Pages, muncul di sini.

Config key: tetap `hiddenMenus: string[]` (tidak perlu migrasi data lama) — hanya UI yang berubah dari checkbox "sembunyikan" ke toggle "tampilkan".

Logika toggle:
```ts
// Tampilkan = tidak ada di hiddenMenus
// Sembunyikan = ada di hiddenMenus
const isVisible = !hiddenMenus.includes(tab.id);
// Toggle: jika isVisible → tambah ke hiddenMenus, sebaliknya remove
```

#### Bagian 2: Tidak ada konten lain di tab Konten

Pindahkan semua styling (font, warna, perataan) ke tab Gaya.

---

### Tab Gaya

Kontrol (pindah dari tab Konten saat ini):

| Kontrol | Config key | Tipe | Default |
|---------|-----------|------|---------|
| Perataan Menu | `align` | `'left' \| 'center' \| 'right'` | `'center'` | Icon button group |
| Penulisan (popover) | `fontFamily`, `fontSize`, `fontWeight` | mixed | — | Popover sama dengan HEADING |
| Warna Teks | `textColor` | `string (hex)` | `'#18181B'` | Color picker |

---

## Perubahan di `BuilderSection.tsx` (BrandingElement)

Saat ini BrandingElement hardcode `h-10 w-10 rounded-full`. Perlu baca dari config:

```tsx
// Sebelum (hardcoded)
className="h-10 w-10 object-contain rounded-full border border-zinc-200/80 shadow-sm"

// Sesudah (dari config)
const logoSize = config.logoSize ?? 40;
const logoShape = config.logoShape ?? 'circle';
const logoRadius = logoShape === 'circle' ? 9999 : logoShape === 'rounded' ? 8 : 0;
const logoBgColor = config.logoBgColor || 'transparent';

style={{
  width: logoSize,
  height: logoSize,
  borderRadius: logoRadius,
  backgroundColor: logoBgColor,
  objectFit: 'contain',
  border: '1px solid rgba(228,228,231,0.8)',
}}
```

---

## Ringkasan File yang Diubah

| File | Perubahan |
|------|-----------|
| `EditorPanel.tsx` | Redesign blok BRANDING (baris ~2928) dan MENU (baris ~2957) sesuai spesifikasi di atas |
| `BuilderSection.tsx` | Update `BrandingElement` render untuk baca `logoSize`, `logoShape`, `logoBgColor` dari config |

---

## Acceptance Criteria

- [ ] Klik BRANDING → tampil pilihan layer Logo / Teks
- [ ] Klik "Logo" → panel ukuran + bentuk logo muncul, ada tombol Back
- [ ] Klik "Teks" → panel typography muncul (sama seperti HEADING), ada tombol Back
- [ ] Tab Gaya Logo → hanya ada kontrol warna latar
- [ ] Tab Gaya Teks → perataan + typography lengkap seperti HEADING
- [ ] Logo di canvas update real-time saat ubah ukuran/bentuk/warna latar
- [ ] MENU tab Konten hanya tampilkan list halaman dengan toggle visible/hidden
- [ ] Halaman custom dari `storePages` muncul otomatis di list MENU
- [ ] MENU tab Gaya punya font, warna, perataan (pindah dari tab Konten)
- [ ] Tidak ada regresi pada elemen lain
