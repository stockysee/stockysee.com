# ROADMAP & ARSITEKTUR FILE — STOCKYSEE
> Dokumen ini menjelaskan seluruh file dalam project Stockysee beserta fungsinya, alur flow, dan keterkaitan antar bagian.
> Last Synced: 21 Mei 2026

---

## DAFTAR ISI
1. [Gambaran Arsitektur](#1-gambaran-arsitektur)
2. [Config & Root Files](#2-config--root-files)
3. [Middleware](#3-middleware)
4. [Library & Utilities (`lib/`)](#4-library--utilities-lib)
5. [Database Schema (`prisma/`)](#5-database-schema-prisma)
6. [Halaman Publik (`app/`)](#6-halaman-publik-app)
7. [API Routes (`app/api/`)](#7-api-routes-appapi)
8. [Dashboard Client (`app/dashboard/`)](#8-dashboard-client-appdashboard)
9. [Visual Page Builder (`app/dashboard/storefront/builder/`)](#9-visual-page-builder-appdashboardstorefrontbuilder)
10. [Admin Area (`app/admin*` & `app/super-gate/`)](#10-admin-area-appadmin--appsuper-gate)
11. [Storefront Publik (`app/storefront/`)](#11-storefront-publik-appstorefront)
12. [Components (`components/`)](#12-components-components)
13. [Hooks (`hooks/`)](#13-hooks-hooks)
14. [Types (`types/`)](#14-types-types)
15. [Worker (`worker/`)](#15-worker-worker)
16. [Public Assets (`public/`)](#16-public-assets-public)
17. [Alur Flow Lengkap](#17-alur-flow-lengkap)

---

## 1. GAMBARAN ARSITEKTUR

```
User Request
     │
     ▼
middleware.ts ──────────────────────────────────────────────────────────────┐
     │                                                                       │
     ├── Subdomain/Custom Domain terdeteksi?                                 │
     │         └── Rewrite ke /storefront/[slug]                             │
     │                                                                       │
     ├── Route /dashboard atau /api private?                                 │
     │         └── Validasi JWT (client_session cookie)                      │
     │                                                                       │
     ├── Route /admin-panel atau /api/admin?                                 │
     │         └── Validasi admin_session cookie                             │
     │                                                                       │
     └── Route publik (/, /auth, /register, /pricing, dll) ──► Lanjut       │
                                                                             │
Database: PostgreSQL (via Prisma ORM)                                        │
Storage: Supabase Storage (gambar, KTP, QRIS, bukti bayar)                  │
Deploy: Vercel                                                               │
AI: Google Gemini (verifikasi struk pembayaran)                              │
Email: Resend (OTP, link aktivasi)                                           │
Push: Web Push + VAPID (notifikasi order baru)                              │
```

---

## 2. CONFIG & ROOT FILES

### `package.json`
Mendefinisikan seluruh dependensi project. Dependensi utama:
- `next 14.2.3` — Framework utama (App Router)
- `prisma` + `@prisma/client` — ORM untuk PostgreSQL
- `@supabase/supabase-js` — Upload file ke cloud storage
- `bcryptjs` + `jsonwebtoken` + `jose` — Autentikasi & enkripsi
- `@google/generative-ai` — Google Gemini AI untuk verifikasi struk
- `resend` — Pengiriman email (OTP, aktivasi)
- `web-push` — Native push notification ke browser
- `framer-motion` — Animasi UI
- `lottie-react` — Animasi Lottie (ikon animasi di sidebar builder)
- `@react-pdf/renderer` — Generate PDF invoice
- `node-whois` — Cek status domain sebelum pendaftaran

### `next.config.mjs`
Konfigurasi Next.js. Mengatur domain gambar, opsi build, dan integrasi PWA via `@ducanh2912/next-pwa`.

### `tailwind.config.ts`
Konfigurasi Tailwind CSS. Mendefinisikan warna kustom, font, dan breakpoint yang digunakan di seluruh UI.

### `tsconfig.json`
Konfigurasi TypeScript. Mendefinisikan path alias `@/` yang menunjuk ke root project (memudahkan import).

### `.eslintrc.json`
Aturan linting kode TypeScript/React. Menjaga konsistensi kode seluruh tim.

### `.npmrc`
Konfigurasi npm untuk kebutuhan deployment Vercel.

### `.vercelignore`
File/folder yang diabaikan saat deploy ke Vercel.

### `middleware.ts`
*(Lihat bagian tersendiri di bawah)*

### `app/globals.css`
CSS global untuk seluruh aplikasi. Mendefinisikan variabel warna tema (dark/light), font base, dan utility class global.

### `app/layout.tsx`
Root layout seluruh aplikasi. Membungkus semua halaman dengan provider global: `UIProvider` (Toast & Confirm dialog), `VisitorTracker`, dan konfigurasi metadata PWA (title, favicon, manifest).

### `app/manifest.ts`
Menghasilkan file `manifest.json` dinamis untuk PWA. Mendefinisikan nama app, warna tema, ikon, dan display mode.

### `app/page.tsx`
**Landing page utama Stockysee** (`/`). Berisi:
- Hero section dengan animasi meteor/bintang jatuh
- Social proof (jumlah pengguna aktif realtime dari API `/api/stats/active-users`)
- Arsitektur platform (isometric SVG stack)
- Grid fitur (12 fitur utama)
- Carousel review pelanggan
- Pricing section (toggle PRIBADI/BISNIS)
- CTA section + Footer

### `app/page2.tsx`
Halaman eksperimen/backup. Tidak terhubung ke routing utama, digunakan sebagai scratchpad UI.

### `page.tsx` *(di root, luar folder `app/`)*
File test/draft yang tidak digunakan di production.

---

## 3. MIDDLEWARE

### `middleware.ts`
**Pintu gerbang utama seluruh request.** Berjalan di Edge Runtime sebelum halaman/API dirender.

**Fungsi utama:**

**A. Domain & Subdomain Discovery**
- Membaca header `host` dari setiap request
- Jika host adalah subdomain `*.stockysee.com` → ekstrak slug dari subdomain
- Jika host adalah domain asing (custom domain) → panggil `/api/internal/check-domain` untuk mapping ke slug client
- Jika slug terdeteksi dan bukan route internal → **rewrite ke `/storefront/[slug]`** agar toko tampil di domain custom

**B. Admin Protection**
- Semua request ke `/admin-panel` dan `/api/admin/*` wajib punya cookie `admin_session`
- Nilai cookie divalidasi terhadap `ADMIN_SECRET_KEY` di environment variable
- Jika tidak valid → redirect ke `/super-gate` atau return `401 Unauthorized`

**C. Client Dashboard Protection**
- Semua request ke `/dashboard` dan private API (`/api/products`, `/api/categories`, `/api/stats`, `/api/profile`, `/api/orders GET`) wajib punya cookie `client_session`
- Token JWT diverifikasi menggunakan `jose` (edge-compatible)
- Jika tidak valid/expired → redirect ke `/auth?redirect=[path asal]` atau return `401`

---

## 4. LIBRARY & UTILITIES (`lib/`)

### `lib/db.ts`
**Singleton Prisma Client.** Memastikan hanya satu instance Prisma aktif di seluruh aplikasi (mencegah connection leak di development mode dengan hot-reload).

### `lib/auth-server.ts`
**Helper autentikasi sisi server.** Berisi 3 fungsi utama:
- `getCurrentClientId()` — Membaca cookie `client_session`, memverifikasi JWT, dan mengembalikan `clientId`. Aman untuk Vercel Build phase.
- `isAuthenticated()` — Mengecek apakah request terautentikasi.
- `getSessionPayload()` — Mengembalikan full JWT payload (clientId, email, slug).

Digunakan di semua API routes dashboard untuk memastikan client hanya mengakses data miliknya sendiri (proteksi IDOR).

### `lib/plan-limits.ts`
**Konfigurasi tier dan batasan fitur berdasarkan paket berlangganan.** Source of truth untuk semua batasan plan.

Mendefinisikan `PLAN_CONFIG` untuk 6 tier:
- `FREE` — Tidak bisa digunakan, hanya placeholder
- `BASIC` — Subdomain saja, watermark aktif, tidak ada fitur bisnis
- `BASIC_PLUS` — Custom domain, chatbot trial 3 hari
- `STANDARD` — Semua fitur bisnis, bank max 3, referral max 2 kolom
- `STANDARD_PRO` — Invoice aktif, bank max 6, chatbot 20 hari
- `PREMIUM` — Semua fitur unlimited, bank max 8, chatbot selamanya

Fungsi `getPlanConfig(plan)` → mengembalikan konfigurasi limit berdasarkan nama plan.
Fungsi `isChatbotActive(client)` → mengecek apakah masa trial chatbot masih aktif berdasarkan `activatedAt`.

### `lib/supabase.ts`
**Inisialisasi Supabase client.** Membaca `SUPABASE_URL` dan `SUPABASE_ANON_KEY` dari environment untuk digunakan di storage helper.

### `lib/storage-helper.ts`
**Helper upload file ke Supabase Storage.** Berisi:
- `uploadToSupabase(path, fileData, contentType, bucket)` — Upload file dengan validasi:
  - Batas ukuran file per-upload: 2MB
  - Quota enforcement berdasarkan plan (total storage yang sudah digunakan vs limit plan)
  - Bucket default: `tenant-assets`

### `lib/resend.ts`
**Helper pengiriman email via Resend API.** Digunakan untuk:
- Kirim OTP verifikasi email saat registrasi
- Kirim link aktivasi akun Ghost-Auth ke client baru yang diapprove admin

### `lib/notifications.ts`
**Helper push notification.** Berisi fungsi untuk mengirim Web Push notification ke browser client menggunakan VAPID keys. Dipanggil saat ada order baru masuk.

### `lib/whatsapp.ts` & `lib/whatsapp-utils.ts`
**Helper integrasi WhatsApp CRM.** Berisi template pesan WhatsApp dan fungsi untuk mengirim notifikasi order ke nomor WhatsApp client. Aktif jika `hasWhatsapp: true` di data client.

### `lib/storefront.ts`
**Helper query data storefront.** Fungsi utilitas untuk mengambil data client, produk, kategori, dan sections storefront dari database secara efisien.

### `lib/invoice-helper.ts`
**Helper generate invoice.** Berisi logika pembentukan nomor invoice (format: `INV/[SLUG]/[TAHUN]/[NOMOR]`), kalkulasi total, dan snapshot data produk untuk historis invoice.

### `lib/image-utils.ts`
**Utilitas gambar.** Berisi fungsi `pHash` (perceptual hash) untuk mendeteksi duplikat struk pembayaran — gambar yang serupa menghasilkan hash yang mirip.

### `lib/vercel.ts`
**Helper Vercel API.** Fungsi untuk menambah/menghapus custom domain di project Vercel secara programatik menggunakan Vercel API token. Dipanggil saat client mendaftarkan atau menghapus custom domain.

---

## 5. DATABASE SCHEMA (`prisma/`)

### `prisma/schema.prisma`
**Definisi seluruh model database PostgreSQL.** Relasi utama:

```
Client (Tenant)
  ├── Domain[]              — subdomain & custom domain
  ├── Product[]             — katalog produk
  ├── Category[]            — kategori produk
  ├── Order[]               — transaksi masuk
  │     └── OrderItem[]     — detail item per order
  │     └── CustomerInvoice — invoice per order
  ├── Invoice[]             — tagihan aktivasi plan
  ├── StorefrontSection[]   — blok konten visual builder
  ├── StorePage[]           — halaman kustom (about, dll)
  ├── Visitor[]             — log pengunjung
  ├── VerificationRequest[] — antrian verifikasi KTP/rekening
  ├── PushSubscription[]    — token push notification browser
  └── ShippingMethod[]      — metode pengiriman
```

**Model penting:**

**`Client`** — Data utama setiap tenant:
- `slug` — identifier unik untuk URL dan subdomain
- `username` — login identity (Ghost-Auth)
- `plan` — BASIC / STANDARD / PREMIUM / CUSTOM
- `status` — PENDING / ACTIVE / DISABLED
- `paymentInfo` — info rekening pembayaran (JSON)
- `themeId` — tema aktif (1/2/3)
- `activationToken` — token one-time untuk aktivasi akun
- `lastVerificationAt` — untuk security lock 14 hari rekening
- `hasChatbot`, `hasWhatsapp` — feature flags

**`StorefrontSection`** — Blok visual yang dibuat di Page Builder:
- `type` — HERO, FEATURES, PRODUCT_GRID, BANNER, TEXT, dll
- `config` — JSON berisi konten: teks, URL gambar, warna, layout
- `order` — urutan tampil di storefront

**`Invoice`** — Tagihan aktivasi dari client ke platform:
- `uniqueCode` — 3 digit unik untuk verifikasi transfer
- `pHash` — fingerprint gambar struk untuk deteksi duplikat

**`PushSubscription`** — Token push notification per device:
- `endpoint`, `p256dh`, `auth` — credential Web Push API

---

## 6. HALAMAN PUBLIK (`app/`)

### `app/page.tsx`
**Landing page utama** (`/`). *(Lihat section 2 di atas)*

### `app/auth/page.tsx`
**Halaman login client** (`/auth`). Form login dengan field Username/ID dan Password. Sistem Ghost-Auth: menggunakan username rahasia bukan email. Setelah login berhasil, menerima cookie `client_session` (JWT) dan redirect ke `/dashboard` atau path asal dari query `?redirect=`.

### `app/register/page.tsx`
**Halaman registrasi client baru** (`/register`). Form multi-step:
1. **Step 1** — Pilih paket (BASIC/STANDARD/PREMIUM), nama bisnis, upload logo
2. **Step 2** — Data pemilik (nama, telepon, email)
3. **Step 3** — Pilih domain (subdomain otomatis atau custom domain)
4. **Step 4** — Konfirmasi & pembayaran (tampil nominal + kode unik 3 digit)

Setelah submit → memanggil `POST /api/auth/register` → akun dibuat dengan status `PENDING` menunggu approval admin.

### `app/pricing/page.tsx`
**Halaman harga** (`/pricing`). Menampilkan tabel perbandingan paket BASIC, STANDARD, PREMIUM, dan CUSTOM dengan fitur dan harga masing-masing. Toggle mode Pribadi/Bisnis.

### `app/models/page.tsx`
**Halaman showcase model bisnis** (`/models`). Menampilkan demo tampilan toko untuk berbagai jenis bisnis (e-commerce, booking, dll) sebagai referensi visual untuk calon client.

### `app/activate/[token]/page.tsx`
**Halaman aktivasi akun Ghost-Auth** (`/activate/[token]`). Client yang sudah diapprove admin menerima link ini via email. Halaman ini:
1. Memvalidasi `token` ke API `/api/auth/activate`
2. Meminta client membuat password baru
3. Setelah submit → akun aktif, client langsung login

### `app/test/page.tsx`
**Halaman testing/debugging internal.** Tidak ditampilkan ke publik, digunakan developer untuk menguji komponen atau API secara terisolasi.

---

## 7. API ROUTES (`app/api/`)

### AUTH & IDENTITY

#### `app/api/auth/login/route.ts`
**POST** — Login client. Menerima `identifier` (username/email/slug) + `password`. Mencari client di database, validasi password dengan bcrypt (dengan auto-upgrade dari plain text ke bcrypt jika belum). Jika berhasil → set cookie `client_session` berisi JWT dengan payload `{clientId, email, slug}`, berlaku 3 hari.

#### `app/api/auth/register/route.ts`
**POST** — Registrasi client baru. Menerima data form multi-step. Membuat record `Client` dengan status `PENDING` dan record `Invoice` dengan kode unik 3 digit. Membuat subdomain otomatis di Vercel jika diperlukan.

#### `app/api/auth/activate/route.ts`
**POST** — Aktivasi akun via token one-time. Memvalidasi token, meminta password baru dari client, meng-hash password, dan mengupdate status client menjadi `ACTIVE`. Token dihapus setelah digunakan.

#### `app/api/auth/logout/route.ts`
**POST** — Logout. Menghapus cookie `client_session`.

#### `app/api/auth/verify-email/route.ts`
**POST** — Verifikasi email via OTP. Digunakan di alur registrasi untuk memastikan email valid sebelum akun dibuat.

#### `app/api/auth/check-domain/route.ts`
**GET** — Mengecek ketersediaan nama domain/slug sebelum registrasi. Mengembalikan `available: true/false`.

---

### DASHBOARD CLIENT API

#### `app/api/profile/route.ts`
**GET** — Mengambil data profil dan konfigurasi bisnis client yang sedang login. Mengembalikan data lengkap client (tanpa password).
**PUT** — Update profil, info bisnis, konfigurasi rekening bank, chatbot, WhatsApp, dan fitur lainnya. Dengan validasi security lock 14 hari untuk perubahan rekening.

#### `app/api/products/route.ts`
**GET** — Mengambil semua produk milik client yang login (dari JWT, bukan URL param — proteksi IDOR).
**POST** — Membuat produk baru dengan nama, harga, stok, gambar, dan kategori.
**PUT** — Update produk.
**DELETE** — Hapus produk.

#### `app/api/categories/route.ts`
**GET** — Mengambil semua kategori milik client.
**POST** — Membuat kategori baru.
**DELETE** — Hapus kategori (produk dalam kategori akan di-null-kan).

#### `app/api/orders/route.ts`
**GET** — Mengambil semua order milik client yang login, diurutkan terbaru. Mendukung filter status.
**PATCH** — Update status order (PENDING → PROCESSED → COMPLETED, atau → CANCELLED).

#### `app/api/payments/route.ts`
**GET** — Mengambil riwayat pembayaran/invoice client.
**POST** — Submit bukti pembayaran (upload struk).

#### `app/api/stats/route.ts`
**GET** — Mengambil statistik bisnis client: total order, total produk, total pendapatan, dan visitor count.

#### `app/api/stats/active-users/route.ts`
**GET** — Mengambil jumlah total pengguna aktif platform (publik, tidak perlu auth). Digunakan di landing page sebagai social proof.

#### `app/api/media/route.ts`
**GET** — Mengambil daftar file media (gambar) yang sudah diupload client ke Supabase Storage.
**DELETE** — Menghapus file media dari Supabase.

#### `app/api/upload/route.ts`
**POST** — Upload gambar ke Supabase Storage. Menerima file base64 atau form data. Melakukan validasi ukuran (max 2MB) dan quota berdasarkan plan. Mengembalikan URL publik file yang sudah diupload.

#### `app/api/track/route.ts`
**POST** — Mencatat kunjungan ke storefront. Menyimpan IP pengunjung ke tabel `Visitor` untuk keperluan statistik. Rate-limited untuk menghindari abuse.

---

### STOREFRONT & BUILDER API

#### `app/api/storefront/checkout/route.ts`
**POST** — Proses checkout dari toko client. Menerima `clientId`, list `items`, dan data customer. Membuat record `Order` baru dengan status `PENDING`. Memicu push notification ke client jika ada subscription aktif.

#### `app/api/storefront/sections/route.ts`
**GET** — Mengambil semua section storefront milik client yang login (untuk Builder).
**POST** — Membuat section baru di storefront.

#### `app/api/storefront/sections/[id]/route.ts`
**PUT** — Update konfigurasi section (konten, layout, style) berdasarkan ID. Digunakan Builder saat auto-save.
**DELETE** — Hapus section dari storefront.

#### `app/api/storefront/sections/reorder/route.ts`
**POST** — Update urutan (`order`) banyak section sekaligus setelah drag-and-drop di Builder.

#### `app/api/storefront/pages/route.ts`
**GET** — Mengambil semua halaman kustom (StorePage) milik client.
**POST** — Membuat halaman kustom baru (contoh: halaman "Tentang Kami").

#### `app/api/storefront/pages/[id]/route.ts`
**GET** — Mengambil konten halaman kustom berdasarkan ID.
**PUT** — Update konten halaman kustom.
**DELETE** — Hapus halaman kustom.

---

### PAYMENT & VERIFICATION

#### `app/api/payment/verify/route.ts`
**POST** — **Smart AI Payment Verification v2.** Endpoint inti untuk verifikasi pembayaran aktivasi plan. Alur:
1. Menerima gambar struk (base64) dan `invoiceId`
2. Hitung `pHash` gambar → cek duplikat di database (anti-fraud)
3. Kirim gambar ke Google Gemini AI untuk ekstrak data: nominal, bank, ID transaksi
4. Validasi nominal sesuai `totalAmount` invoice (termasuk kode unik 3 digit)
5. Validasi format ID transaksi sesuai pola bank (BCA, BNI, BRI, GoPay, OVO, dll)
6. Jika valid → update status invoice ke `PAID`, update status client ke `ACTIVE`

#### `app/api/payments/route.ts`
**GET** — Riwayat invoice/pembayaran client.

#### `app/api/invoice-manager/route.ts` & `/generate/route.ts`
**POST** — Generate PDF invoice untuk client (tagihan aktivasi). Menggunakan `@react-pdf/renderer`.

#### `app/api/invoices/route.ts` & `/generate/route.ts`
**GET/POST** — Manajemen customer invoice (invoice yang diterima pembeli setelah order selesai). Menyimpan snapshot data produk dan toko saat invoice dibuat untuk keamanan historis.

---

### NOTIFICATION

#### `app/api/notifications/subscribe/route.ts`
**POST** — Menyimpan token push subscription (endpoint, p256dh, auth) dari browser ke database. Dipanggil saat client mengaktifkan notifikasi di dashboard.

#### `app/api/notifications/test/route.ts`
**POST** — Mengirim push notification test ke semua subscription aktif milik client. Digunakan untuk testing konfigurasi notifikasi.

---

### INTERNAL (Server-to-Server)

#### `app/api/internal/check-domain/route.ts`
**GET** — Digunakan oleh `middleware.ts` untuk mengecek apakah suatu custom domain terdaftar di database dan mendapatkan slug client-nya. Khusus untuk internal server-to-server call.

#### `app/api/internal/orders/create/route.ts`
**POST** — Endpoint internal untuk membuat order (digunakan oleh sistem otomatisasi internal).

#### `app/api/internal/orders/cancel/route.ts`
**POST** — Endpoint internal untuk membatalkan order.

---

### ADMIN API

#### `app/api/admin/login/route.ts`
**POST** — Login super admin. Memvalidasi password admin dari `ADMIN_SECRET_KEY` di env, dan set cookie `admin_session`.

#### `app/api/admin/clients/route.ts`
**GET** — Mengambil semua client (tenant) yang terdaftar di platform beserta status dan info paketnya.

#### `app/api/admin/clients/[id]/route.ts`
**GET** — Detail lengkap satu client.
**PUT** — Update data client: approve/reject registrasi, generate username, generate activation token, kirim link aktivasi via email.
**DELETE** — Nonaktifkan atau hapus client.

#### `app/api/admin/domains/route.ts`
**GET/POST** — Manajemen semua domain yang terdaftar di platform. Approve/reject pengajuan custom domain dan sinkronisasi ke Vercel API.

#### `app/api/admin/invoices/route.ts`
**GET** — Melihat semua invoice pembayaran dari semua client. Dashboard pendapatan platform.

#### `app/api/admin/platform-accounts/route.ts`
**GET/POST** — Manajemen rekening bank platform (tempat client transfer pembayaran). CRUD untuk `PlatformAccount`.

#### `app/api/admin/verification/route.ts`
**GET** — Mengambil semua `VerificationRequest` yang pending (pengajuan KTP, rekening bank, QRIS dari client).
**PUT** — Approve atau reject satu verification request.

#### `app/api/admin/impersonate/route.ts`
**POST** — Fitur admin untuk login sebagai client tertentu (impersonation). Set `client_session` cookie dengan data client yang dipilih untuk keperluan debugging atau support.

---

## 8. DASHBOARD CLIENT (`app/dashboard/`)

### `app/dashboard/layout.tsx`
**Layout wrapper seluruh area dashboard.** Berisi:
- Sidebar navigasi kiri (desktop) dengan accordion menu
- Mobile hamburger menu
- Profile dropdown (nama, plan, tombol logout)
- Tombol akses cepat ke storefront + page builder
- `PushNotificationManager` — inisialisasi push notification
- Dark/light mode toggle
- Auto-expand menu aktif berdasarkan URL (smart accordion)
- Fetch data profil client via `useCacheFetch` dari `/api/profile`

### `app/dashboard/page.tsx`
**Beranda dashboard** (`/dashboard`). Saat ini placeholder — "Persiapan konten beranda baru sedang dalam proses."

### `app/dashboard/loading.tsx`
**Loading state** untuk dashboard layout. Ditampilkan saat halaman dashboard sedang dimuat.

### `app/dashboard/orders/page.tsx`
**Halaman manajemen order** (`/dashboard/orders`). Menampilkan daftar order masuk dengan filter status (PENDING, PROCESSED, COMPLETED, CANCELLED). Bisa update status order, lihat detail item, dan konfirmasi pembayaran.

### `app/dashboard/orders/loading.tsx`
**Loading skeleton** untuk halaman orders.

### `app/dashboard/products/page.tsx`
**Indeks produk** (`/dashboard/products`). Redirect/landing ke sub-halaman produk.

### `app/dashboard/products/list/page.tsx`
**Daftar produk** (`/dashboard/products/list`). CRUD produk: tambah, edit, hapus produk. Upload gambar produk (multi-foto), atur harga, harga diskon, stok, deskripsi, spesifikasi, dan kategori.

### `app/dashboard/products/categories/page.tsx`
**Manajemen kategori** (`/dashboard/products/categories`). CRUD kategori produk dengan nama dan gambar.

### `app/dashboard/products/loading.tsx`
**Loading skeleton** untuk halaman produk.

### `app/dashboard/payments/page.tsx`
**Halaman pembayaran** (`/dashboard/payments`). Upload bukti transfer untuk tagihan aktivasi plan. Menampilkan status invoice (PENDING/PAID/EXPIRED) dan memicu proses verifikasi AI.

### `app/dashboard/invoices/page.tsx`
**Halaman invoice** (`/dashboard/invoices`). Daftar customer invoice yang sudah dibuat untuk pembeli. Bisa generate PDF dan lihat detail snapshot order.

### `app/dashboard/analysis/page.tsx`
**Halaman analitik** (`/dashboard/analysis`). Statistik bisnis: total pendapatan, jumlah order, produk terlaris, dan grafik visitor.

### `app/dashboard/media/page.tsx`
**Media library** (`/dashboard/media`). Galeri semua gambar yang sudah diupload client. Bisa hapus file dan lihat URL. Menggunakan modal `MediaLibraryModal`.

### `app/dashboard/profile/page.tsx`
**Halaman profil** (`/dashboard/profile`). Edit nama bisnis, foto profil/logo, info pemilik, nomor telepon.

### `app/dashboard/settings/page.tsx`
**Pengaturan utama** (`/dashboard/settings`). Hub ke semua sub-setting.

### `app/dashboard/settings/loading.tsx`
**Loading skeleton** untuk halaman settings.

### `app/dashboard/settings/domain/page.tsx`
**Pengaturan domain** (`/dashboard/settings/domain`). Manajemen subdomain dan pengajuan custom domain. Menampilkan instruksi DNS setup (CNAME record) dan status verifikasi domain.

### `app/dashboard/settings/payments/page.tsx`
**Pengaturan pembayaran** (`/dashboard/settings/payments`). Konfigurasi rekening bank dan QRIS untuk menerima pembayaran dari pembeli. Dengan batasan jumlah rekening sesuai plan dan security lock 14 hari.

### `app/dashboard/settings/fitur/page.tsx`
**Pengaturan fitur bisnis** (`/dashboard/settings/fitur`). Aktivasi/konfigurasi fitur premium:
- Sistem Referral (kode referral, komisi)
- AI Chatbot (konfigurasi instruksi, aktivasi trial)
- WhatsApp CRM (template notifikasi WA)
- Rekening pembayaran (QRIS)

### `app/dashboard/storefront/page.tsx`
**Halaman storefront hub** (`/dashboard/storefront`). Navigasi ke Builder, Design, Pages, dan Themes.

### `app/dashboard/storefront/design/page.tsx`
**Pengaturan desain global** (`/dashboard/storefront/design`). Mengatur tema warna global, font, dan style storefront.

### `app/dashboard/storefront/pages/page.tsx`
**Daftar halaman kustom** (`/dashboard/storefront/pages`). CRUD halaman tambahan (contoh: Tentang Kami, Kebijakan, dll).

### `app/dashboard/storefront/pages/new/page.tsx`
**Buat halaman kustom baru** (`/dashboard/storefront/pages/new`). Form input judul, slug URL, dan konten halaman.

### `app/dashboard/storefront/pages/[id]/edit/page.tsx`
**Edit halaman kustom** (`/dashboard/storefront/pages/[id]/edit`). Editor konten halaman kustom yang sudah ada.

### `app/dashboard/themes/page.tsx`
**Pemilihan tema** (`/dashboard/themes`). Preview dan aktivasi tema storefront (Galaxy, Digital, Retail, Landing). Dengan indikator tema yang terkunci sesuai plan.

---

## 9. VISUAL PAGE BUILDER (`app/dashboard/storefront/builder/`)

Ini adalah **inti fitur terpenting Stockysee** — engine untuk membangun tampilan storefront secara visual tanpa coding.

### `app/dashboard/storefront/builder/page.tsx`
**Entry point Visual Page Builder** (`/dashboard/storefront/builder`). Halaman utama builder. Bertanggung jawab untuk:
- Render **kanvas preview** storefront di tengah (desktop/mobile toggle)
- Menampilkan section-section yang sudah dibuat menggunakan `BuilderSection`
- Mengelola **drag-and-drop** antar section
- Membuka dialog modal global: konfirmasi hapus, pilih template section
- Menampilkan toolbar atas: Undo/Redo, Save, Preview, mode Device (desktop/mobile)
- Mengintegrasikan `BuilderSidebar` di sebelah kiri sebagai panel properti
- Memanggil `useBuilderState` sebagai pusat semua state & logic
- Menyediakan `LottiePanelTrigger` (trigger animasi sidebar)

### `app/dashboard/storefront/builder/useBuilderState.tsx`
**Pusat logika state Visual Builder.** Custom React hook yang menjadi "otak" seluruh builder. Berisi:

- **State management** untuk semua data builder: daftar sections, section aktif, elemen aktif, undo/redo history, mode preview, dll
- **Event handlers** untuk semua interaksi: klik elemen, drag section, update properti, tambah/hapus section/elemen
- **Undo/Redo system** — menyimpan history state setiap perubahan
- **Auto-save** — menyimpan perubahan ke API secara debounced
- **Sanitasi data** — memastikan config section selalu dalam format yang valid sebelum disimpan
- **`SECTION_STRUCTURE_TEMPLATES`** — daftar template struktur section yang bisa dipilih saat menambah section baru (HERO, FEATURE GRID, PRODUCT LIST, dll)
- **Pencarian rekursif** — helper untuk mencari elemen di struktur bersarang (termasuk di dalam column children)

### `app/dashboard/storefront/builder/BuilderSidebar.tsx`
**Panel sidebar kiri Visual Builder.** Komponen terbesar di project. Berisi semua kontrol properti untuk elemen yang sedang dipilih:

- **Panel Navigasi** — daftar section & elemen dalam tree view, drag-to-reorder, duplicate, delete
- **Panel Properti Section** — kontrol layout section: padding, margin, background color/image, flex direction, justify content, align items
- **Panel Properti Elemen** — accordion berisi semua properti berdasarkan tipe elemen:
  - `HEADING` / `TEXT` — Rich Text Editor (Bold, Italic, Underline, List, Quote, dll), font size, warna teks, alignment
  - `BUTTON` — teks, URL link, warna, border radius, padding, style outline/solid
  - `IMAGE` — upload/pilih dari media library, object-fit, border radius, shadow
  - `GALLERY` — grid foto, jumlah kolom, gap, border style (4 sisi individual + link button), border radius, warna border
  - `SPACER` — tinggi spacer
  - `BADGE` — teks badge, warna, style
  - `DIVIDER` — warna, ketebalan, style (solid/dashed/dotted)
  - `COLUMN` — jumlah kolom, gap, dan properti child column masing-masing
  - `PRODUCT_LIST` / `CATEGORY_LIST` — filter kategori, jumlah kolom grid
  - `MENU` / `CART` — konfigurasi navigasi global header
  - `BRANDING` — logo toko
- **Kontrol Direksi & Alignment** — flex direction, justify content, align items dengan ikon SVG kustom presisi tinggi
- **Color Picker** — pemilih warna dengan input hex dan reset
- **Media Library integration** — tombol untuk buka modal galeri dan pilih gambar

---

## 10. ADMIN AREA (`app/admin*` & `app/super-gate/`)

### `app/super-gate/page.tsx`
**Halaman login super admin** (`/super-gate`). Form login dengan password tunggal. Password divalidasi terhadap `ADMIN_SECRET_KEY` di environment variable. Set cookie `admin_session` jika berhasil.

### `app/admin-panel/page.tsx`
**Master Control Center admin** (`/admin-panel`). Dashboard utama admin dengan tab-tab:
- **Clients** — Daftar semua tenant. Bisa approve/reject registrasi, generate activation link, lihat detail, impersonate, disable/delete client.
- **Domains** — Semua domain yang terdaftar. Approve custom domain → sinkronisasi ke Vercel API.
- **Verification** — Antrian verifikasi KTP, rekening bank, dan QRIS dari client. Approve/reject dengan pesan.
- **Invoices** — Semua tagihan ke client. Rekap pendapatan platform.
- **Platform Accounts** — CRUD rekening bank platform tempat client transfer.

### `app/admin/confirm-stock/[orderId]/page.tsx`
**Halaman konfirmasi stok** (`/admin/confirm-stock/[orderId]`). Halaman khusus admin untuk mengkonfirmasi bahwa stok produk sudah tersedia untuk order tertentu. Mengupdate status order dari PENDING ke PROCESSED.

---

## 11. STOREFRONT PUBLIK (`app/storefront/`)

### `app/storefront/[slug]/page.tsx`
**Halaman utama toko** (`/storefront/[slug]` atau via custom domain). Server Component dengan `revalidate: 60` (cache 60 detik). Logika:
1. Ambil data client dari database berdasarkan `slug`
2. Jika tidak ada → `notFound()`
3. Jika ada `themeId` lama (1/2/3) → render tema lama sebagai fallback (ThemeGalaxy, ThemeLanding, ThemeDigital)
4. Jika model bisnis terdeteksi → render `EcommerceModel` atau `BookingModel`
5. Generate metadata dinamis (title = nama toko, favicon = logo toko)

### `app/storefront/[slug]/layout.tsx`
**Layout wrapper storefront.** Membungkus seluruh halaman toko dengan `StorefrontProvider` (context global untuk cart, produk, kategori) dan menginjeksikan `VisitorTracker`.

### `app/storefront/[slug]/loading.tsx`
**Loading state** saat data storefront sedang diambil dari server.

### `app/storefront/[slug]/about/page.tsx`
**Halaman tentang toko** (`/storefront/[slug]/about`). Menampilkan informasi toko, deskripsi bisnis, dan link sosial media.

### `app/storefront/[slug]/category/[categoryId]/page.tsx`
**Halaman kategori produk** (`/storefront/[slug]/category/[categoryId]`). Menampilkan semua produk dalam satu kategori dengan filter dan sorting.

### `app/storefront/[slug]/category/[categoryId]/loading.tsx`
**Loading state** untuk halaman kategori.

### `app/storefront/[slug]/p/[page_slug]/page.tsx`
**Halaman kustom storefront** (`/storefront/[slug]/p/[page_slug]`). Menrender konten `StorePage` yang dibuat client melalui dashboard. Contoh: `/toko/p/tentang-kami`.

---

## 12. COMPONENTS (`components/`)

### `components/LottiePanelTrigger.tsx`
**Komponen tombol animasi Lottie** untuk trigger panel sidebar di Builder. Animasi berjalan otomatis 3 detik saat load, play 1.5 detik saat hover, lanjut sisa animasi saat hover leave. Berisi logic cancel timeout untuk menghindari race condition.

### `components/MediaLibraryModal.tsx`
**Modal galeri media** yang digunakan di Builder dan halaman media. Menampilkan semua gambar yang sudah diupload client. Bisa memilih gambar untuk dimasukkan ke elemen, upload gambar baru, atau hapus gambar.

### `components/VisitorTracker.tsx`
**Komponen tracking pengunjung.** Client component yang berjalan di background saat storefront dibuka. Mengirim request ke `/api/track` untuk mencatat kunjungan.

### `components/dashboard/PlanBadge.tsx`
**Badge tampilan plan** (BASIC, STANDARD, PREMIUM) yang ditampilkan di sidebar dashboard. Dengan warna berbeda per tier.

### `components/dashboard/ProfileContent.tsx`
**Konten profil di dropdown sidebar** dashboard. Menampilkan nama bisnis, username, plan badge, dan tombol logout.

### `components/dashboard/PushNotificationManager.tsx`
**Manager push notification.** Berjalan di background di dashboard. Meminta permission notifikasi dari browser, registrasi service worker, mendapatkan push subscription token, dan menyimpannya ke server via `/api/notifications/subscribe`.

### `components/dashboard/invoices/InvoiceTemplate.tsx`
**Template PDF invoice** menggunakan `@react-pdf/renderer`. Mendefinisikan layout visual invoice PDF: header toko, tabel produk, total, dan footer.

### `components/pwa/InstallButton.tsx`
**Tombol install PWA.** Mendeteksi event `beforeinstallprompt` dari browser dan menampilkan tombol "Install App" untuk menambahkan Stockysee ke home screen.

### `components/storefront/StorefrontProvider.tsx`
**Context provider global storefront.** Menyediakan state dan fungsi yang dibutuhkan seluruh halaman toko:
- Data client, produk, kategori, sections, dan custom pages
- State keranjang belanja (cart): `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- State modal produk (detail produk yang diklik)
- State cart drawer (buka/tutup)
- `formatRupiah` — formatter angka ke format Rupiah

### `components/storefront/CartDrawer.tsx`
**Drawer keranjang belanja.** Slide-in panel dari kanan yang menampilkan item di cart, total harga, tombol hapus item, dan tombol checkout yang membuka form data pembeli.

### `components/storefront/ProductCard.tsx`
**Kartu produk** yang ditampilkan di grid storefront. Menampilkan gambar, nama, harga (dengan harga coret jika ada diskon), badge kondisi (baru/bekas), dan tombol tambah ke cart.

### `components/storefront/ProductModal.tsx`
**Modal detail produk.** Tampil saat pembeli mengklik produk. Menampilkan galeri foto (carousel), deskripsi lengkap, spesifikasi, dan tombol "Beli Sekarang" yang menambah ke cart.

### `components/storefront/StorefrontHeader.tsx`
**Header global storefront.** Menampilkan logo toko, nama bisnis, navigasi menu (dari section MENU), dan ikon cart dengan badge jumlah item.

### `components/storefront/CategoryProductList.tsx`
**Komponen daftar produk per kategori.** Digunakan di halaman kategori dan section `CATEGORY_LIST` di builder.

### `components/storefront/models/EcommerceModel.tsx`
**Model bisnis e-commerce.** Renderer storefront lengkap untuk tipe bisnis jual-beli produk. Menggunakan `DynamicSections` untuk render section-section dari builder, dengan layout header + produk + cart.

### `components/storefront/models/BookingModel.tsx`
**Model bisnis booking/reservasi.** Renderer storefront untuk bisnis yang menerima pemesanan/reservasi (contoh: villa, salon, konsultasi). Berbeda flow checkout dari e-commerce.

### `components/storefront/sections/BuilderSection.tsx`
**Renderer section di kanvas builder.** Komponen yang me-render satu section beserta semua elemennya. Bertanggung jawab untuk:
- Menampilkan overlay interaktif saat section/elemen diklik di builder (border highlight, toolbar aksi)
- Dispatch event ke `BuilderSidebar` saat elemen diklik: `builder:openNavigatorPanel`
- Mencegah klik double saat berpindah elemen lintas section (cek rekursif keberadaan elemen aktif)
- Merender elemen berdasarkan `type` via `ELEMENT_TYPE_MAP`
- Mendukung struktur bersarang (COLUMN dengan children)

Mendefinisikan tipe `SectionElement` dan `ELEMENT_TYPE_MAP` yang digunakan seluruh sistem builder.

### `components/storefront/sections/DynamicSections.tsx`
**Renderer dinamis section di storefront publik.** Mengambil array sections dari `StorefrontProvider` dan me-render masing-masing section sesuai tipenya (HERO, PRODUCT_GRID, BANNER, dll) tanpa interaksi builder.

### `components/themes/ThemeGalaxy.tsx`
**Tema Galaxy** — tema tampilan storefront dengan gaya dark/galaxy. Tema lama sebagai fallback untuk client yang belum migrasi ke Page Builder.

### `components/themes/ThemeDigital.tsx`
**Tema Digital** — tema tampilan storefront dengan gaya minimalis digital/tech.

### `components/themes/ThemeLanding.tsx`
**Tema Landing** — tema tampilan storefront bergaya landing page marketing.

### `components/themes/ThemeRetail.tsx`
**Tema Retail** — tema tampilan storefront bergaya toko retail klasik.

### `components/ui/UIProvider.tsx`
**Provider UI global** untuk Toast notification dan Confirm dialog. Menyediakan hooks `useUI()` yang bisa dipanggil dari komponen mana pun untuk:
- `showToast(message, type)` — tampilkan notifikasi kecil (success/error/info)
- `showConfirm(message, onConfirm)` — tampilkan dialog konfirmasi dengan tombol OK/Batal

---

## 13. HOOKS (`hooks/`)

### `hooks/useCacheFetch.ts`
**Custom hook fetch dengan caching.** Melakukan fetch ke suatu URL dan menyimpan hasilnya di `sessionStorage` dengan key berbasis URL. Pada request berikutnya di session yang sama, data diambil dari cache tanpa fetch ulang. Digunakan di dashboard layout untuk fetch profil client agar tidak re-fetch setiap navigasi.

### `hooks/useMediaLibrary.ts`
**Custom hook untuk media library.** Mengelola state loading, daftar media, upload baru, dan hapus file. Digunakan di `MediaLibraryModal` dan halaman media dashboard.

---

## 14. TYPES (`types/`)

### `types/node-whois.d.ts`
**Type declaration** untuk library `node-whois` yang tidak memiliki TypeScript types resmi. Mendefinisikan interface untuk hasil query WHOIS domain.

---

## 15. WORKER (`worker/`)

### `worker/index.js`
**Service Worker** untuk PWA dan Web Push. Menangani:
- Event `push` — menampilkan push notification saat ada order baru, bahkan ketika browser/tab tertutup
- Event `notificationclick` — deep-link saat notifikasi diklik, membuka tab dashboard ke halaman orders
- Caching aset untuk offline support (dasar PWA)

---

## 16. PUBLIC ASSETS (`public/`)

Folder berisi semua aset statis yang dapat diakses langsung via URL:

| File/Folder | Keterangan |
|---|---|
| `icon-192x192.png` & `icon-512x512.png` | Ikon PWA untuk home screen |
| `logo.png`, `logo2.png` | Logo Stockysee (versi hitam & putih) |
| `loading-logo.gif` | Animasi loading logo |
| `moon.png` | Gambar bulan untuk hero landing page |
| `editor-panel.json` | File JSON Lottie untuk animasi panel trigger di Builder |
| `*.png` (basic, standart, premium, dll) | Ikon untuk halaman pricing |
| `gopay.png`, `dana.png` | Logo metode pembayaran |
| `sound-1.mp3` s/d `sound-5.mp3`, `sound-cancel.mp3` | Efek suara notifikasi order |
| `storefront.svg`, `tab.svg` | Ikon SVG statis |
| `manifest.json.bak` | Backup manifest PWA |

---

## 17. ALUR FLOW LENGKAP

### A. Flow Registrasi Client Baru
```
1. /register (page.tsx)
   └── Form multi-step (nama, plan, domain, pembayaran)
       └── POST /api/auth/register
           └── Buat Client {status: PENDING} + Invoice {uniqueCode}
               └── Admin menerima notifikasi

2. /admin-panel (admin melihat client baru)
   └── Klik Approve → PUT /api/admin/clients/[id]
       └── Generate username + activationToken
           └── Kirim email via Resend → link /activate/[token]

3. /activate/[token] (page.tsx)
   └── Client isi password baru
       └── POST /api/auth/activate
           └── Update Client {password: hashed, status: ACTIVE}
               └── Redirect ke /auth

4. /auth (page.tsx)
   └── Login dengan username + password
       └── POST /api/auth/login → set cookie client_session (JWT)
           └── Redirect ke /dashboard
```

### B. Flow Verifikasi Pembayaran (AI Payment)
```
/dashboard/payments (page.tsx)
└── Upload foto struk
    └── POST /api/payment/verify
        ├── Hitung pHash → cek duplikat (anti-fraud)
        ├── Kirim ke Gemini AI → ekstrak nominal, bank, ID transaksi
        ├── Validasi nominal == totalAmount invoice
        ├── Validasi format ID transaksi sesuai pola bank
        └── Jika valid: Invoice {status: PAID}, Client {status: ACTIVE}
```

### C. Flow Visual Page Builder
```
/dashboard/storefront/builder (page.tsx)
└── Load sections dari GET /api/storefront/sections
    └── Render di kanvas via BuilderSection.tsx
        └── User klik elemen
            ├── Dispatch event builder:openNavigatorPanel
            ├── BuilderSidebar.tsx menerima event → tampilkan properti
            └── User edit properti (warna, teks, layout, dll)
                └── useBuilderState.tsx update state + tambah ke history
                    └── Debounce 1s → PUT /api/storefront/sections/[id]
                        └── Config tersimpan di database
```

### D. Flow Pembeli di Storefront
```
Custom Domain / subdomain.stockysee.com
└── middleware.ts → detect slug → rewrite ke /storefront/[slug]
    └── /storefront/[slug]/page.tsx
        ├── Fetch client, produk, sections dari DB
        └── Render EcommerceModel (atau BookingModel)
            └── StorefrontProvider (cart context)
                ├── DynamicSections → render sections dari builder
                ├── ProductCard → klik → ProductModal
                ├── "Beli Sekarang" → addToCart
                ├── CartDrawer → isi data (nama, telepon, alamat)
                └── Checkout → POST /api/storefront/checkout
                    └── Buat Order {status: PENDING}
                        └── POST /api/notifications/subscribe → kirim Push Notification ke client
```

### E. Flow Notifikasi Order Baru (Push)
```
Order baru dibuat di checkout
└── Server memanggil web-push API
    └── Push Subscription di database (endpoint, p256dh, auth)
        └── Browser client menerima push event (via Service Worker)
            └── worker/index.js: tampilkan notifikasi browser
                └── User klik notifikasi → buka /dashboard/orders
```

### F. Flow Custom Domain
```
1. /dashboard/settings/domain (page.tsx)
   └── Input domain kustom → POST /api/admin/domains
       └── Status: PENDING, instruksi DNS CNAME ditampilkan

2. Admin verifikasi: GET /api/admin/domains → PUT (approve)
   └── lib/vercel.ts → Vercel API: tambah domain ke project
       └── Domain {status: ACTIVE}

3. Request masuk ke domain kustom
   └── middleware.ts → GET /api/internal/check-domain?domain=...
       └── DB: cari Domain record → return slug
           └── Rewrite ke /storefront/[slug]
```

---

*Dokumen ini mencakup seluruh 180+ file dalam project Stockysee dan menjelaskan peran, fungsi, dan keterkaitan masing-masing dalam alur sistem secara menyeluruh.*
