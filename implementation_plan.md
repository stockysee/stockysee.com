# Implementation Plan - StockySee SaaS (Version 2.1)

## Goal Description
Membangun platform SaaS multi-tenant di mana client bisa membuat toko online (storefront) mereka sendiri dengan pilihan tema yang fleksibel, sistem promo, dan manajemen mandiri.

## User Review Required
> [!IMPORTANT]
> - **Subscription Model**: Model bertingkat (Basic, Standard, Premium) untuk monetisasi platform.
> - **Security**: Super Admin Dashboard harus sangat aman.

## Subscription & Pricing Model (SaaS Tiers)

Platform ini menggunakan sistem berlangganan bertingkat untuk menjangkau berbagai jenis client:

### 🟢 Basic (Entry Level)
- **Harga**: Rp 150.000 / bulan.
- **Domain**: Subdomain otomatis (namaclient.stockysee.com).
- **Fitur**: Setup otomatis, Dashboard standar.
- **Themes**: Add-on (Bayar per tema, misal: Theme 1 50rb, Theme 2 70rb).

### 🔵 Standard (Professional)
- **Harga**: Bulan #1 (Rp 500.000 - Incl. Domain), Bulan #2+ (Rp 250.000).
- **Domain**: Custom Domain (.com/.id) + SSL Ready.
- **Fitur**: Akses fitur Discount & Referral system.
- **Themes**: All-inclusive (Bebas pilih tema tanpa biaya tambahan).

### 🟡 Premium (Ultimate)
- **Harga**: Bulan #1 (Rp 1.000.000 - Incl. Domain), Bulan #2+ (Rp 800.000).
- **Domain**: Custom Domain + Priority Support.
- **Fitur**: Full access (Chatbot, Analytics, Advanced Marketing, Full Maintenance).
- **Themes**: All-inclusive (Premium support for layout adjustments).

### [] Custom (Enterprise)
- **Harga**: Kalkulasi otomatis berdasarkan pilihan fitur di dashboard.
- **Fitur**: Bebas pilih fitur tambahan, bebas pilihan maintenance.
- **Service**: Full assistance dari tim StockySee untuk setup & request fitur khusus.

## Revised Phase Breakdown

### Phase 2: Database & SaaS Logic (In Progress)
- [x] Prisma Schema (Client, Domain, Product, Order).
- [x] Expand Schema (PlanType, ThemeOwnership, Promo).
- [x] API Products (GET/POST).
- [x] API Payments (GET/POST).
- [ ] Onboarding System: Registration with Plan & Theme selection.

### Phase 3: Storefront Multi-Theme Engine
- [x] UI Prototype for Theme 1 (Mobile-first).
- [x] UI Prototype for Theme 2 (Landing Page).
- [x] UI Prototype for Theme 3 (Digital Grid).
- [x] Real Data Integration (Supabase).
- [ ] Theme Selector logic in Dashboard.

### Phase 4: Advanced Marketing Tools
- [ ] Dashboard: Promo Management UI.
- [ ] Dashboard: Referral Management UI.
- [ ] Integration of Promo/Referral logic in Checkout.

### Phase 5: Final Polish & PWA
- [x] Manifest & PWA Foundation.
- [ ] Domain Mapping (stockysee.com/client-slug to client-slug.stockysee.com).
- [ ] Deployment to Production (Vercel + Supabase).
- [x] **Phase 18: Hybrid Real-Time Notifications** (DONE ✅)

### Phase 19: Native Web Push Engine (NEW 🚀)
- [ ] **Schema Update**: Create `PushSubscription` model in Prisma to store device tokens.
- [ ] **Service Worker**: Implement `public/sw.js` to handle background push events & show notifications.
- [ ] **VAPID Setup**: Generate secure Public/Private keys for notification encryption.
- [ ] **Subscription Flow**: Add "Enable Notifications" UI in Dashboard with permission handling.
- [ ] **Push Trigger**: Create server-side logic to send push messages on new orders/cancellations.
- [ ] **UX**: Deep-link notifications to open the specific order details in the dashboard.

### Phase 6: Super Admin Center & Security [NEW]
- [ ] **Secure Admin Middleware**: Protection for all sensitive `/admin` routes.
- [ ] **Env-based Auth**: Admin credentials stored safely in `.env`.
- [ ] **Client Control Center**: View and manage all tenants/clients & total revenue.
- [ ] **Payment Approval System**: Verify and activate client subscriptions manually.

## Security Strategy
1. **Middleware Isolation**: Differentiate between Storefront, Client Dashboard, and Super Admin access levels.
2. **Environment Protection**: Sensitive keys (Supabase, Admin Password) strictly stored in `.env`.
3. **Database Guard**: Ensure multi-tenancy isolation at the database query level.
4. **Auth Guards**: Implement strong session validation for any dashboard access.

## Verification Plan
### Automated Tests
- [ ] Test domain resolution for different slugs.
- [ ] Verify API returns 401/403 for unauthorized access.
- [ ] Mock subscription activation flow.

### Manual Verification
- [ ] Check mobile responsiveness for all 3 themes.
- [ ] Verify product creation reflects immediately on storefront.
