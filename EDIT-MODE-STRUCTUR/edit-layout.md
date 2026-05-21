# 📐 Spesifikasi Struktur Sunting Elemen & Tata Letak (Edit Mode Structure) - Stockysee Visual Page Builder

Dokumen ini mendokumentasikan spesifikasi teknis dan visual untuk struktur panel editor aktif (*Edit Mode Structure*) pada **Stockysee Visual Page Builder**. Panduan ini mengintegrasikan rancangan mockup visual dari aset gambar di folder `EDIT-MODE-STRUCTUR/` dengan arsitektur kode Next.js modular di `app/dashboard/storefront/builder/` (`page.tsx`, `useBuilderState.tsx`, `BuilderSidebar.tsx`) dan canvas renderer di `components/storefront/sections/BuilderSection.tsx`.

---

## 🎨 Prinsip Desain Utama & Tata Letak Panel
Panel editor kanan dirancang dengan prinsip **Elegan, Kontekstual, dan Presisi**, menggunakan palet warna premium dark mode zinc/slate (`#18181b` dan `#131316`) dengan aksen biru neon (`#2563eb` atau `#3b82f6`) untuk menunjukkan fokus aktif. 

Setiap elemen memiliki 3 tab sticky global di bagian atas yang menyelaraskan seluruh opsi perubahan:
1. 🎛️ **Tata Letak / Konten** (Tata letak struktural, pengaturan teks utama, perataan, tautan, ukuran)
2. 🎨 **Gaya** (Warna latar, warna teks, border, radius, shadow, hover effect)
3. ⚙️ **Lanjutan** (Spacing margin/padding responsif, perlindungan ID, custom class, Z-Index, visual filter)

> [!IMPORTANT]
> **Penyelarasan Tab Otomatis:**
> Jika widget kustom bertipe `BRANDING`, `MENU`, `CART`, `CATEGORY_LIST`, atau `PRODUCT_LIST` sedang dipilih, panel editor sidebar **wajib** secara otomatis memindahkan fokus tab (`activeEditorTab`) ke `'layout'` (Tata Letak) karena widget ini memiliki alur konfigurasi terpadu di tab tersebut.

---

## 🧩 Peta Struktur Sunting Berdasarkan Mockup Aset

Berikut adalah pemetaan komprehensif 5 elemen utama (Kontainer, Teks, Paragraf, Tombol, Gambar) berdasarkan berkas mockup PNG di direktori ini:

### 1. 🗂️ Elemen: Kontainer (Container / Column)
Elemen dasar pembungkus tata letak (Section Grid / Flex). Karakteristik utamanya adalah tidak memiliki tab "Konten" konvensional, melainkan langsung berfokus pada Tata Letak struktural.

* **Aset Mockup Terkait:**
  * `edit-kontainer-tab-tata-letak.png` (Mengatur alur flex/grid dan perataan item)
  * `edit-kontainer-tab-gaya.png` (Mengatur latar belakang, warna, gambar, dan sudut melengkung)
  * `edit-kontainer-tab-lanjutan.png` (Mengatur margin/padding responsif dengan dropdown unit dan link-unlink state)

#### 🎛️ Tab 1: Tata Letak
Tab ini bertindak sebagai otak dari alur data tata letak elemen di dalam kontainer.
* **Accordion: Kontainer**
  * `Container Layout` (Dropdown Select): `Flexbox` (default) atau `Grid`.
  * `Lebar Konten` (Dropdown Select): `boxed` (Dalam kotak, default `1000px`) atau `full` (Lebar penuh/layar).
  * `Lebar Kustom` (Unit Slider & Dropdown Satuan): `200px` - `1600px` (Satuan: `px`, `vw`, `%`, `custom`).
  * `Tinggi Minimal` (Unit Slider & Dropdown Satuan): `0px` - `1000px`.
* **Accordion: Item (Hanya muncul jika Container Layout = Flexbox)**
  * `Direksi / Flex Direction` (Segmented Button): `Row (→)`, `Column (↓)`, `Row-Reverse (←)`, `Column-Reverse (↑)`.
  * `Justify Content` (Horizontal/Vertical alignment depending on direction - Icon Buttons): `Start`, `Center`, `End`, `Space Between`, `Space Around`, `Space Evenly`.
  * `Align Items` (Cross axis alignment - Icon Buttons): `Start`, `Center`, `End`, `Stretch`.
  * `Jarak (Gap)` (Input numerik ganda + Link Icon): Mengatur `Column Gap` (Jarak Kolom) dan `Row Gap` (Jarak Baris) dalam `px` yang dapat dikunci (`gapLinked`).
* **Accordion: Grid Settings (Hanya muncul jika Container Layout = Grid)**
  * `Grid Columns` (Segmented Buttons): `1`, `2`, `3`, `4`, `6` kolom.

#### 🎨 Tab 2: Gaya
* **Accordion: Latar Belakang**
  * `Warna Latar` (Color Picker + Hex Input): Mendukung opacity RGBA.
  * `Gambar Latar` (Text Input URL + Tombol Upload): Upload berkas langsung ke storage tenant.
  * `Overlay Opacity` (Range Slider): `0%` - `100%` (hanya aktif jika Gambar Latar terisi).
* **Accordion: Perbatasan & Bayangan**
  * `Sudut Radius / Border Radius` (Range Slider + Input Angka): `0px` - `100px`.
  * `Tebal Border` (Input Angka): `0px` - `20px`.
  * `Warna Border` (Color Picker + Hex Input).
  * `Efek Bayangan / Box Shadow` (Segmented Buttons): `None`, `Soft`, `Medium`, `Strong`.

#### ⚙️ Tab 3: Lanjutan
* **Accordion: Tata Letak Spacing**
  * `Margin` & `Padding` (Input 4 Arah: Atas, Kanan, Bawah, Kiri):
    * Terintegrasi dengan **Dropdown Satuan Dinamis** (`px`, `vw`, `%`, `custom` (seperti formula `calc(10% - 20px)`)).
    * Tombol **Link/Unlink** (`LinkIcon`) untuk mengunci/membuka kesamaan nilai 4 arah.

---

### 2. 🔤 Elemen: Teks (Heading / Title)
Elemen bertipe teks heading tingkat tinggi (`h1`, `h2`, `h3`) yang menjadi jangkar perhatian utama pada halaman.

* **Aset Mockup Terkait:**
  * `edit-teks-tab-konten.png`
  * `edit-teks-tab-gaya.png`
  * `edit-teks-tab-lanjutan.png`

#### 🎛️ Tab 1: Konten
* **Accordion: Teks Utama**
  * `Input Konten Teks` (Input Teks baris tunggal): Mengubah string nilai judul secara real-time.
  * `Ukuran Font / Font Size` (Range Slider): `10px` - `80px` (Default Heading: `24px`).
  * `Font Family` (Select Option): Mendukung unifikasi **Google Fonts Dynamic Stylesheet Loader** (seperti *Inter*, *Outfit*, *Playfair Display*, *Roboto*, dll.).
  * `Alignment / Perataan` (Segmented Buttons): `Kiri (Left)`, `Tengah (Center)`, `Kanan (Right)`.

#### 🎨 Tab 2: Gaya
* **Accordion: Tipografi & Efek**
  * `Warna Teks` (Color Picker + Hex Input).
  * `Ketebalan Font / Font Weight` (Dropdown Select): `100 (Thin)`, `300 (Light)`, `400 (Regular)`, `700 (Bold)`, `900 (Black)`.
  * `Gaya Huruf / Font Style` (Toggle Buttons): *Italic*, **Bold**, <u>Underline</u>.
  * `Bayangan Teks / Text Shadow` (Dropdown Preset): `None`, `Soft Glow`, `Dark Shadow`, `Neon Blur`.

#### ⚙️ Tab 3: Lanjutan
* **Accordion: Spacing & ID**
  * `Margin` & `Padding` responsif (4 Arah dengan dropdown unit).
  * `Z-Index` (Input Angka): Mengatur posisi kedalaman elemen.
  * `Custom CSS Class / ID` (Input Teks): Untuk penyuntingan manual developer.

---

### 3. 📝 Elemen: Paragraf (Paragraph / Text)
Elemen blok tulisan panjang (`p`) yang menampilkan deskripsi produk, ulasan, atau teks informasi penjelas.

* **Aset Mockup Terkait:**
  * `edit-paragraf-tab-konten.png`
  * `edit-paragraf-tab-gaya.png`
  * `edit-paragraf-tab-lanjutan.png`

#### 🎛️ Tab 1: Konten
* **Accordion: Editor Paragraf**
  * `Area Teks / Textarea` (Input Multi-baris): Mendukung enter dan spasi paragraf panjang.
  * `Ukuran Font` (Range Slider): `10px` - `40px` (Default: `16px`).
  * `Font Family` (Select Option).
  * `Alignment / Perataan` (Segmented Buttons): `Kiri (Left)`, `Tengah (Center)`, `Kanan (Right)`, `Rata Kiri-Kanan (Justify)`.
  * `Tinggi Baris / Line Height` (Range Slider): `1.0` - `2.5` (dengan lompatan halus `0.1` kali).

#### 🎨 Tab 2: Gaya
* **Accordion: Pewarnaan & Highlight**
  * `Warna Teks` (Color Picker).
  * `Warna Sorot / Highlight Bg` (Color Picker + Hex): Memberikan latar belakang khusus di balik baris teks.
  * `Transparansi Teks / Opacity` (Range Slider): `10%` - `100%`.

#### ⚙️ Tab 3: Lanjutan
* **Accordion: Responsif & Spacing**
  * Spacing Margin & Padding dengan unifikasi dropdown unit.
  * `Sembunyikan di Perangkat / Hide on Device` (Toggle ganda): *Mobile*, *Tablet*, *Desktop*.
  * `Animasi Masuk / Entrance Animation` (Select Option): *Fade In*, *Slide Up*, *Bounce*, *None*.

---

### 4. 🔘 Elemen: Tombol (Button)
Elemen interaktif utama untuk Call-to-Action (CTA) yang mengarahkan pembeli ke WhatsApp, produk spesifik, atau halaman eksternal.

* **Aset Mockup Terkait:**
  * `edit-tombol-tab-konten.png`
  * `edit-tombol-tab-gaya.png`
  * `edit-tombol-tab-lanjutan.png`

#### 🎛️ Tab 1: Konten
* **Accordion: Konfigurasi Tombol**
  * `Teks Tombol` (Input Teks): default `"Beli Sekarang"` atau `"Hubungi Kami"`.
  * `Tautan / URL Link` (Input Teks URL): format alamat situs atau nomor WhatsApp API (`https://wa.me/...`).
  * `Target Link` (Dropdown Select): `Tab Saat Ini (_self)` atau `Tab Baru (_blank)`.
  * `Perataan Tombol / Align` (Segmented Buttons): `Kiri (Left)`, `Tengah (Center)`, `Kanan (Right)`.
  * `Padding Tombol` (Dua Range Slider):
    * `Padding Horizontal (paddingX)`: `8px` - `80px` (Default: `24px`).
    * `Padding Vertikal (paddingY)`: `4px` - `40px` (Default: `12px`).
  * `Lebar Penuh / Full Width` (Toggle Switch): Membuat tombol selebar kontainer induk jika aktif.

#### 🎨 Tab 2: Gaya
* **Accordion: Warna & Radius**
  * `Warna Teks Tombol` (Color Picker).
  * `Warna Latar Tombol` (Color Picker).
  * `Sudut Radius / Border Radius` (Range Slider): `0px` (Kotak) - `50px` (Capsul).
  * `Tebal & Warna Border` (Input Angka + Color Picker).
* **Accordion: Efek Interaktif (Hover State)**
  * `Warna Latar Hover` (Color Picker).
  * `Efek Transisi / Hover Animation` (Select Option): *Grow*, *Shrink*, *Pulse*, *Float*, *None*.
  * `Efek Bayangan / Box Shadow` (Segmented Buttons): `None`, `Soft`, `Medium`, `Strong`.

#### ⚙️ Tab 3: Lanjutan
* **Accordion: Lanjutan Spacing**
  * Pengaturan margin responsif dengan unit modular.
  * `Z-Index` & `Custom CSS Class`.

---

### 5. 🖼️ Elemen: Gambar (Image)
Elemen visual untuk menampilkan foto produk premium, spanduk promo, atau dekorasi estetis storefront.

* **Aset Mockup Terkait:**
  * `edit-gambar-tab-konten.png`
  * `edit-gambar-tab-gaya.png`
  * `edit-gambar-tab-lanjutan.png`

#### 🎛️ Tab 1: Konten
* **Accordion: Sumber Gambar**
  * `URL Gambar` (Input Teks URL): Alamat berkas gambar eksternal.
  * `Unggah Berkas / Upload` (Tombol Aksi + Progress Bar): Mengunggah gambar dari komputer lokal langsung ke penyimpanan Cloud tenant.
  * `Perataan Gambar / Align` (Segmented Buttons): `Kiri (Left)`, `Tengah (Center)`, `Kanan (Right)`.
* **Accordion: Dimensi Gambar**
  * `Lebar Kustom / Width` (Input Teks): Mendukung nilai dinamis seperti `auto`, `100%`, atau `250px`.
  * `Tinggi Kustom / Height` (Input Teks): Mendukung `auto` atau ukuran pasti seperti `150px`.
  * `Object Fit` (Dropdown Select): `Cover` (Penuh Skala, default), `Contain` (Muat Layar), `Fill` (Regang Penuh), `None` (Asli).

#### 🎨 Tab 2: Gaya
* **Accordion: Bingkai & Bayangan**
  * `Sudut Radius / Border Radius` (Range Slider): `0px` - `100px`.
  * `Tebal & Warna Border` (Input Angka + Color Picker).
  * `Efek Bayangan Gambar / Box Shadow` (Segmented Buttons): `None`, `Soft`, `Medium`, `Strong`.
* **Accordion: Visual Filter**
  * `Transparansi / Opacity` (Range Slider): `10%` - `100%`.
  * `Efek Hover Gambar` (Dropdown Select): *Zoom In*, *Grayscale-to-Color*, *Blur-to-Clear*, *None*.

#### ⚙️ Tab 3: Lanjutan
* **Accordion: Spacing & SEO**
  * Pengaturan Margin & Padding responsif.
  * `Deskripsi Alt / Alt Text` (Input Teks): Sangat krusial untuk **SEO Best Practices** agar halaman storefront terindeks sempurna di Google Search.
  * `Lazy Loading` (Toggle Switch): Mempercepat waktu muat halaman storefront dengan memuat gambar hanya saat masuk ke dalam viewport layar (Default: Aktif).

---

## 🎮 Panduan Integrasi State & Sinkronisasi Real-Time

Untuk memastikan integritas data dan visual yang luar biasa (wow factor), implementasikan aturan pembaruan state berikut dalam pengembangan:

### 1. D-Pad Puzzle & Reorder Algorithm (2D Spatial Collision Solver)
Setiap kali elemen berpindah posisi menggunakan Navigator D-Pad di bagian atas panel sunting:
* Periksa apakah elemen pembungkus menggunakan tata letak `grid` dengan kolom lebih dari 1.
* Jika ya, gunakan algoritma **Swap Puzzle 2D Grid** untuk menukar koordinat baris/kolom secara presisi tanpa memengaruhi elemen tetangga pada kolom yang lain.
* Tombol D-Pad wajib menyala/aktif secara dinamis hanya jika koordinat target berada di dalam batas elemen saudara kandung (*siblings*).

### 2. Standardisasi Visual Kartu Produk (Product Card Full-Bleed)
* **Wajib tanpa sela (Full-Bleed):** Gambar produk diletakkan menempel secara penuh di bagian atas kartu produk. Pindahkan `cardPadding` hanya ke area teks informasi di bagian bawah.
* **Sudut Adaptif:** Terapkan formula pemangkasan sudut adaptif agar sudut gambar bagian atas melengkung mulus mengikuti border radius kartu:
  ```typescript
  const borderTopLeft = cardBorderRadius;
  const borderBottomLeft = imageBorderRadius;
  ```
  Hal ini mencegah ketidaksempurnaan visual (sudut siku-siku gambar yang bocor keluar dari kartu melengkung).

### 3. Log Debug Konsol Developer (Aturan Strict 8)
Setiap kali parameter di sidebar editor diubah oleh pengguna (misalnya font size diubah atau checkbox dicentang), pastikan untuk memicu console log debug di konsol browser agar pemantauan alur state berjalan transparan:
```javascript
console.log(`[Sunting Elemen] Elemen ID "${activeElementId}" tipe "${activeElement.type}" memperbarui parameter:`, updatedFields);
```

---

> [!TIP]
> Dokumen spesifikasi ini adalah landasan terpadu bagi tim pengembang untuk melakukan *styling*, penambahan komponen, maupun refaktor kecil di dalam ruang lingkup direktori `stockysee`. Gunakan spesifikasi di atas saat merancang elemen visual baru agar storefront tenant tetap seragam, premium, dan stabil.
