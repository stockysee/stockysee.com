# 🛡️ Stockysee Master Security Roadmap

Dokumen ini berisi rencana strategis untuk memperkuat keamanan ekosistem Stockysee (Dashboard Admin, Dashboard Client, dan Database).

---

## 🏗️ Pilar 1: API & Middleware Hardening (COMPLETED 🛡️)
Membangun "Tembok Cina" di jalur komunikasi data agar tidak bisa diintip atau dimanipulasi dari luar.

### 🔒 1.1 Penambalan Celah IDOR (Insecure Direct Object Reference)
- [x] **Hapus** pengambilan `clientId` dari URL di API Products, Categories, Orders, Stats, dan Profile.
- [x] **Wajib** menggunakan ID dari JWT Token (Session).
- [x] Verifikasi kepemilikan data (Ownership) pada API Update/Delete.

### 👮 1.2 Upgrade Middleware Guard
- [x] Masukkan rute `/api` ke dalam pantauan `middleware.ts`.
- [x] Validasi Token JWT untuk rute dashboard & private API.
- [x] Pengecekan `admin_session` secara global untuk rute Admin.

---

## 🔑 Pilar 2: Authentication Overhaul (Ghost-Auth System) (COMPLETED 🛡️)
Sistem aktivasi akun berbasis undangan dan login berbasis Username untuk privasi total.

### 👤 2.1 "Invite-to-Activate" Flow (New Clients)
- [x] **Status Registrasi**: Client baru masuk sebagai `PENDING`.
- [x] **Approval Admin**: Saat Admin menyetujui (Approve), sistem otomatis:
  - [x] Generate **Unique Username** untuk client.
  - [x] Generate **One-Time Activation Token**.
  - [x] Link Aktivasi `/activate/[token]` siap digunakan.
- [x] **Aktivasi**: Client mengklik link sekali pakai untuk membuat Password baru mereka sendiri.
- [x] **Login**: Menggunakan **Username** + **Password Baru**.

### 👑 2.2 Login Dashboard (Username-Based)
- [x] **Update Form Login**: Label "Email" sudah diganti menjadi "Username / ID".
- [x] **Update Login API**: Pencarian user di database mendukung Username, Slug, dan Email.
- [x] **Email Privacy**: Alamat email disembunyikan dari UI publik.

---

## 🗄️ Pilar 3: Database & Privacy Protection
Melindungi data paling sensitif milik client (Password, Rekening, KTP).

### 🔐 3.1 Database & Data Integrity
- [x] Kolom `username`, `activationToken`, dan `activatedAt` sudah di-deploy.
- [x] **Bcrypt Auto-Upgrade**: Sistem otomatis meng-upgrade password plain text ke Bcrypt saat login pertama.
- [x] **Security Lock**: Gembok 14 hari otomatis untuk perubahan data bank (`lastVerificationAt`).

### 📄 3.2 KTP & Document Privacy (ONGOING 🚧)
- [ ] **Private Storage**: Ubah folder `ktp/` di Supabase menjadi folder **Private**.
- [ ] **Signed URL**: Implementasi akses foto KTP via link sementara (5 menit) di Admin Panel.

---

## 📅 Jadwal Eksekusi (Next Steps)
1. [x] Ghost-Auth Activation System.
2. [x] Username-based Login UI & API.
3. [x] Security Lock 14-day policy.
4. [/] **Supabase Private Bucket Refactor** -> *🚧 IN PROGRESS*.
5. [ ] Integrasi Email Service (Resend) untuk pengiriman Link Aktivasi otomatis.

---
*Status Dokumen: Updated - 15 Mei 2026 (Ghost-Auth Fully Implemented)*
