const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'TODO.md');
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Normalize newlines
content = content.replace(/\r\n/g, '\n');

// Replace target text
const oldText = `### ⬅️ Implementasi Breadcrumbs Back Button Hirarkis (Kembali 1 Kelas) [FRONTEND]`;

const newText = `### ⬅️ Implementasi Breadcrumbs Back Button Hirarkis (Kembali 1 Kelas) [FRONTEND]
- [x] Perombakan Navigasi Atas Properti Panel Samping Kanan:
  * *Berkas Berubah*: \`app/dashboard/storefront/builder/page.tsx\`
  * Solusi Utama: Menghapus elemen header navigasi lama yang redundan (\`Section < ChevronLeft\` dan badge tipe elemen) di bagian atas properti panel sidebar kanan.
  * Sebagai gantinya, menambahkan tombol **Back Hirarkis (\`ArrowLeft\`)**, tombol **Hapus (\`Trash2\`)**, dan tombol **Tutup (\`X\`)** dinamis secara terpadu di bagian **Header Kanan Atas** dari Property Editor Panel kustom (bukan di sidebar footer). Langkah ini menyelaraskan aksi persis sesuai mock-up layout visual premium yang ramah pengguna.
- [x] Pembersihan Tombol Kembali Redundan di Header:
  * *Berkas Berubah*: \`app/dashboard/storefront/builder/page.tsx\`
  * Solusi: Menghapus tombol \`< Kembali\` yang redundan di sebelah kiri judul header. Sekarang judul panel langsung tertera bersih di sebelah kiri, sementara aksi navigasi terpadu terkumpul rapi di kanan atas.
- [x] Relokasi Tombol Collapse Panel di Sidebar Footer ke Kanan:
  * *Berkas Berubah*: \`app/dashboard/storefront/builder/page.tsx\`
  * Solusi: Memindahkan letak tombol **Collapse Panel** (\`ChevronLeft\`) dari sisi kiri ke sisi **kanan** di bagian footer sidebar kiri. Hal ini membuat tata letak footer seimbang sempurna dan menempatkan status indikator di tengah secara matematis.
- [x] Unifikasi Fokus Sorot Visual Aktif (Active Outline Sync):
  * *Berkas Berubah*: \`components/storefront/sections/BuilderSection.tsx\`, \`app/dashboard/storefront/builder/page.tsx\`
  * Solusi: Menghubungkan parameter \`isActive\` milik section dengan \`activeElementId\`. Jika pengguna sedang mengaktifkan/mengedit elemen/kolom di dalam section, secara otomatis border biru aktif (active outline), border hover, serta fuchsia melayang navigator milik section **disembunyikan secara cerdas**. Visual biru aktif hanya muncul murni pada elemen/kolom yang sedang diedit agar pengguna tidak bingung.`;

if (content.includes(oldText)) {
  const targetPattern = `### ⬅️ Implementasi Breadcrumbs Back Button Hirarkis (Kembali 1 Kelas) [FRONTEND]\n- [x] Perombakan Navigasi Atas Properti Panel Samping Kanan:\n  * *Berkas Berubah*: \`app/dashboard/storefront/builder/page.tsx\`\n  * Solusi Utama: Menghapus elemen header navigasi lama yang redundan (\`Section < ChevronLeft\` dan badge tipe elemen) di bagian atas properti panel sidebar kanan.\n  * Sebagai gantinya, menambahkan tombol **Back Hirarkis (\`ArrowLeft\`)**, tombol **Hapus (\`Trash2\`)**, dan tombol **Tutup (\`X\`)** dinamis secara terpadu di bagian **Header Kanan Atas** dari Property Editor Panel kustom (bukan di sidebar footer). Langkah ini menyelaraskan aksi persis sesuai mock-up layout visual premium yang ramah pengguna.\n- [x] Pembersihan Tombol Kembali Redundan di Header:\n  * *Berkas Berubah*: \`app/dashboard/storefront/builder/page.tsx\`\n  * Solusi: Menghapus tombol \`< Kembali\` yang redundan di sebelah kiri judul header. Sekarang judul panel langsung tertera bersih di sebelah kiri, sementara aksi navigasi terpadu terkumpul rapi di kanan atas.\n- [x] Relokasi Tombol Collapse Panel di Sidebar Footer ke Kanan:\n  * *Berkas Berubah*: \`app/dashboard/storefront/builder/page.tsx\`\n  * Solusi: Memindahkan letak tombol **Collapse Panel** (\`ChevronLeft\`) dari sisi kiri ke sisi **kanan** di bagian footer sidebar kiri. Hal ini membuat tata letak footer seimbang sempurna dan menempatkan status indikator di tengah secara matematis.`;
  
  if (content.includes(targetPattern)) {
    content = content.replace(targetPattern, newText);
  } else {
    content = content.replace(oldText, newText);
  }
  
  fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully patched TODO.md!');
} else {
  console.error('Target text not found in TODO.md');
}
