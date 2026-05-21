# Stockysee Project Structure (Aktual)

_Last Updated: 20 Mei 2026_

## 1. Tujuan Dokumen
Dokumen ini adalah peta arsitektur aktual `stockysee` berdasarkan implementasi kode saat ini. Cakupan meliputi struktur App Router, API backend, model data Prisma, flow pengguna, serta catatan isu aktif.

## 2. Technology Stack Aktual
- Framework: Next.js `14.2.3` (App Router) + React `18`
- Bahasa: TypeScript
- Styling: Tailwind CSS + CSS custom (inline/global pada beberapa halaman)
- Database: PostgreSQL via Prisma ORM (v6)
- Autentikasi client: JWT cookie `client_session` + middleware proteksi dashboard (Ghost-Auth enabled)
- Session admin: cookie `admin_session`
- Integrasi eksternal:
  - Google Gemini AI untuk verifikasi bukti pembayaran (Smart AI Payment v2)
  - Resend untuk OTP/verifikasi email & auto-activation
  - WHOIS (`node-whois`) untuk cek domain
  - Supabase Storage untuk upload aset (logo/produk/receipts/ktp)

## 3. Struktur Folder Inti
- `app/`
  - Halaman publik (`/`, `/auth`, `/register`, `/pricing`, `/models`, `/storefront/[slug]`)
  - Halaman dashboard client (`/dashboard/*`)
  - Halaman admin (`/super-gate`, `/admin-panel`)
  - API routes (`app/api/*`)
  - `dashboard/storefront/builder/` - Visual Page Builder Engine
    - `page.tsx` - Layout visual kanvas utama dan global dialog modal (Entry point)
    - `useBuilderState.tsx` - Pusat logika react state, event handler, undo/redo, sanitasi, dan helper data
    - `BuilderSidebar.tsx` - Panel navigasi kiri, Rich Text Editor, Accordion, dan properti editor widget
- `components/`
  - `dashboard/` komponen dashboard client (PlanBadge, ProfileContent)
  - `storefront/` komponen renderer storefront dinamis
    - `models/` (EcommerceModel, BookingModel)
    - `sections/` (DynamicSections renderer)
  - `themes/` renderer tema lama (Galaxy, Digital, Retail, Landing)
  - `ui/` provider UI global (Toast, Confirm, UIProvider)
  - `pwa/` komponen PWA pendukung
- `hooks/`
  - `useCacheFetch` untuk cache fetch berbasis `sessionStorage`
- `lib/`
  - util DB, auth server, storage, resend, vercel, plan-limits, dan helper AI
- `prisma/`
  - `schema.prisma` untuk definisi model dan relasi (Client, Product, Order, StorefrontSection, VerificationRequest, dll)
- `public/`
  - aset statis (ikon, gambar, gif, logo)

## 4. Peta Route Halaman (Frontend)
### Public
- `/` - Landing Page
- `/auth` - Login Portal (Username/ID based)
- `/register` - Onboarding Flow (Multi-step)
- `/pricing` - Plan Selection
- `/models` - Business Model Showcase
- `/activate/[token]` - Ghost-Auth Activation Page
- `/storefront/[slug]` - Dynamic Storefront
- `/storefront/[slug]/about` - About Page
- `/storefront/[slug]/category/[categoryId]` - Category Detail

### Client Area (Dashboard)
- `/dashboard` - Overview & Stats
- `/dashboard/orders` - Order Management
- `/dashboard/products` - Product & Category Management
- `/dashboard/profile` - Identity & Basic Info
- `/dashboard/settings` - Business Settings
- `/dashboard/settings/domain` - Custom Domain Management
- `/dashboard/settings/fitur` - Business Features (Referral, Bank, AI Chatbot)
- `/dashboard/storefront/builder` - Visual Page Builder Engine

### Admin Area
- `/super-gate` - Admin Login
- `/admin-panel` - Master Control Center (Tenants, Domains, Verification, Settings)

## 5. Peta API Backend
### Auth & Identity
- `POST /api/auth/login` - Username/Email/Slug support
- `POST /api/auth/register` - New Client Registration
- `POST /api/auth/activate` - Account Activation (Set Password)
- `GET /api/auth/check-domain` - Availability Check

### Dashboard API (Client)
- `GET, POST /api/profile` - Profile & Business Feature Updates
- `GET, POST, PUT, DELETE /api/products` - Product Management
- `GET, POST /api/categories` - Category Management
- `GET, PATCH /api/orders` - Order Management
- `GET /api/stats` - Analytics & Active Users

### Storefront & Builder API
- `POST /api/storefront/checkout` - Transaction Flow
- `GET, POST /api/storefront/sections` - Builder Section CRUD
- `PUT /api/storefront/sections/[id]` - Update Section Config
- `POST /api/storefront/sections/reorder` - Sort Sections
- `POST /api/upload` - Supabase Storage Integration
- `POST /api/track` - Visitor Tracking

### Payment & Verification
- `POST /api/payment/verify` - AI Payment Verification (Gemini + pHash)
- `GET, POST /api/admin/verification` - Admin Verification Hub
- `GET, POST /api/admin/platform-accounts` - Global Payment Config

## 6. Model Data Inti (Prisma)
- `Client`: Identitas tenant, plan, status, dan fitur aktif.
- `StorefrontSection`: Konfigurasi blok UI dinamis untuk builder.
- `Product` & `Category`: Katalog produk multi-tenant.
- `Order` & `OrderItem`: Data transaksi pelanggan.
- `Invoice`: Tagihan aktivasi dengan deteksi duplikat (pHash).
- `VerificationRequest`: Antrean verifikasi identitas (KTP) dan rekening.
- `Domain`: Manajemen subdomain dan custom domain Vercel.

## 7. Catatan Keamanan
- **Ghost-Auth**: Login menggunakan Username untuk privasi total.
- **IDOR Protection**: Seluruh API dashboard divalidasi via Server-Side JWT.
- **Security Lock**: Gembok 14 hari otomatis untuk perubahan data rekening.
- **AI Fraud Detection**: Gemini AI memverifikasi keaslian struk dan deteksi duplikat via pHash.

---
*Dokumen ini disinkronkan otomatis berdasarkan audit kode pada 15 Mei 2026.*

