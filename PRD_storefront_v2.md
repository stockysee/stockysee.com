# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Nama Produk
Multi-tenant Storefront Platform

---

## 1. OBJECTIVE
Membangun platform multi-tenant storefront untuk membantu client membuat halaman jualan, share link, dan mengelola produk serta order.

---

## 2. TARGET USER
Primary:
- UMKM
- Reseller
- Dropshipper

Secondary:
- Agency marketing

---

## 3. VALUE PROPOSITION
- Setup cepat (<5 menit)
- Tidak perlu coding
- Bisa pakai domain sendiri
- Dashboard simpel

---

## 4. CORE FEATURES (MVP)

### 4.1 Authentication
- Register
- Login
- Session

### 4.2 Domain System
- Subdomain otomatis
- Custom domain
- Status: pending, verifying, active, failed

### 4.3 Product Management
- Tambah produk
- Edit produk
- Hapus produk
- Atur harga & stok

### 4.4 Storefront
- List produk
- Harga
- Tombol beli

### 4.5 Order System
- Input data customer
- Create order
- Simpan ke dashboard

### 4.6 Dashboard
- List produk
- Stok
- Order
- Status order

---

## 5. USER FLOW

### Client
1. Register
2. Login
3. Dapat subdomain
4. Tambah produk
5. Share link
6. Terima order

### Customer
1. Buka link
2. Lihat produk
3. Klik beli
4. Isi data
5. Order masuk

---

## 6. DOMAIN FLOW

Subdomain:
- Auto generate

Custom Domain:
1. Input domain
2. Status pending
3. DNS setup (CNAME)
4. Verifikasi
5. Active

---

## 7. FUNCTIONAL REQUIREMENTS
- Domain resolver (host → client_id)
- Multi-tenant isolation
- CRUD produk
- Create order

---

## 8. NON-FUNCTIONAL REQUIREMENTS
- Response < 1 detik
- Aman (isolasi data)
- Scalable (100–1000 client)
- Uptime 99%

---

## 9. DATA MODEL

clients:
- id
- name
- slug
- plan

domains:
- id
- client_id
- domain
- type
- status

products:
- id
- client_id
- name
- price
- stock

orders:
- id
- client_id
- total_price
- status

order_items:
- order_id
- product_id
- quantity

---

## 10. SYSTEM ARCHITECTURE

### 10.1 Frontend + Backend
- Next.js (App Router)
- API Routes untuk backend logic

---

### 10.2 Server Structure

- Vercel (initial deployment)
- Optional scaling:
  - Node server (Railway / AWS)
  - Reverse proxy via Cloudflare

---

### 10.3 Backend Structure

/app
  /dashboard
  /storefront
  /api

/lib
  domain-resolver.ts
  db.ts
  auth.ts

/middleware.ts

---

### 10.4 Backend Modules

- Auth Module
- Domain Module
- Product Module
- Order Module
- Dashboard Module

---

### 10.5 Database

Database: PostgreSQL

ORM: Prisma

---

### 10.6 Database Structure

Relational model:
- clients → products
- clients → domains
- clients → orders
- orders → order_items

---

### 10.7 Request Flow

User → Domain → Middleware → Resolver → client_id → Query DB → Render

---

### 10.8 Domain Resolver Logic

1. Ambil host
2. Cek ke table domains
3. Jika tidak ada → cek subdomain
4. Mapping ke client_id
5. Inject ke request

---

## 11. API (HIGH LEVEL)

Auth:
- POST /auth/register
- POST /auth/login

Product:
- GET /products
- POST /products
- PUT /products/:id
- DELETE /products/:id

Order:
- POST /orders
- GET /orders

Domain:
- POST /domains
- GET /domains
- POST /domains/verify

---

## 12. OUT OF SCOPE
- Live chat
- AI
- Advanced analytics

---

## 13. SUCCESS METRICS
- Setup < 5 menit
- Client aktif
- Order masuk
- Conversion link

---

## 14. ROADMAP

Phase 1:
- MVP

Phase 2:
- Payment gateway
- Analytics

Phase 3:
- Chat
- Automation
