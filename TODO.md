- [ ] Implement LottiePanelTrigger timeline control:
  - [ ] Total animasi awal berjalan sampai selesai (3 detik)
  - [ ] Hover: play 1.5 detik (90 frame) lalu pause
  - [ ] Hover leave: lanjut sisa sampai selesai
  - [ ] Cancel timeout saat hover state berubah untuk hindari race condition
- [ ] Besarkan icon: dari 28px ke 48px (sesuai +20px) dan samakan ukuran wrapper/tombol
- [ ] Hapus state/console yang tidak perlu (hasPlayedInitial + console.log)
- [ ] Jalankan build/dev dan verifikasi behavior di refresh + hover


## Frontend - Perbaikan Navigator Move (2026-05-21)
- [x] Kirim detail sectionId saat men-dispatch event builder:openNavigatorPanel pada kolom dan elemen biasa
- [x] Update event handler openNavigatorPanel di BuilderSidebar untuk mengeset editingSection secara dinamis dengan pencarian rekursif yang kokoh
- [x] Tambah console.log/debug log di BuilderSection dan BuilderSidebar untuk melacak event navigator move
- File:
  - [components/storefront/sections/BuilderSection.tsx](file:///c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/components/storefront/sections/BuilderSection.tsx)
  - [app/dashboard/storefront/builder/BuilderSidebar.tsx](file:///c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/BuilderSidebar.tsx)

## Gallery Style Tab - Perbaikan (2026-05-20)
- [x] Hapus card generic (Desain & Warna, Batas & Sudut, Efek Bayangan) dari tab gaya Gallery
- [x] Tambah kontrol Lebar Batas 4 sisi (Atas/Kanan/Bawah/Kiri) + link button saat Border Type aktif
- [x] Tambah Warna Batas (color picker + reset) saat Border Type aktif
- File:  pp/dashboard/storefront/builder/BuilderSidebar.tsx

## Frontend - Perbaikan Klik Elemen Antar-Section (2026-05-21)
- [x] Perbaiki isu klik 2x saat berpindah elemen di section berbeda dengan memeriksa keberadaan elemen aktif secara rekursif di section baru sebelum me-reset activeElementId menjadi null
- File:
  - [app/dashboard/storefront/builder/useBuilderState.tsx](file:///c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/useBuilderState.tsx)

## Gallery Style Tab - Perbaikan Radius Batas (2026-05-21)
- [x] Mengubah border dan divide dari zinc-850 menjadi zinc-800 pada kolom input Radius Batas di edit panel gallery tab gaya agar warna border lebih soft dan gelap setara dengan contoh gambar ke-2
- File:
  - [app/dashboard/storefront/builder/BuilderSidebar.tsx](file:///c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/BuilderSidebar.tsx)

## Frontend - Relokasi dan Peningkatan Kontrol Direksi Section (2026-05-21)
- [x] Memindahkan kontrol Direksi dari akordeon Struktur ke akordeon Penyelarasan, diletakkan tepat di atas Justify Content
- [x] Memperbaiki kerusakan sintaksis JSX/TSX akibat potongan kode yang rusak sebelumnya
- [x] Meningkatkan tampilan visual kontrol Direksi agar setara secara estetika dengan Justify Content (menggunakan layout vertikal flex flex-col items-stretch py-1.5 gap-1 premium dengan label ikon Monitor)
- [x] Menambahkan console.log untuk debug saat interaksi perubahan direksi terjadi
- [x] Mengubah seluruh ikon teks bawaan (seperti ├─, ┳, dll.) pada kontrol Direksi, Justify Content, dan Align Items menjadi ikon SVG kustom yang presisi tinggi dan sangat premium sesuai dengan tangkapan layar user
- [x] Menyesuaikan tata letak baris kontrol: Direksi dan Align Items menggunakan layout inline (bersebelahan dengan label) dengan lebar w-[144px], sedangkan Justify Content menggunakan layout stacked (di bawah label) dengan lebar penuh (w-full) agar 100% identik dengan desain referensi
- File:
  - [app/dashboard/storefront/builder/BuilderSidebar.tsx](file:///c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/BuilderSidebar.tsx)
