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
const oldText = `- [x] Unifikasi Fokus Sorot Visual Aktif (Active Outline Sync):
  * *Berkas Berubah*: \`components/storefront/sections/BuilderSection.tsx\`, \`app/dashboard/storefront/builder/page.tsx\`
  * Solusi: Menghubungkan parameter \`isActive\` milik section dengan \`activeElementId\`. Jika pengguna sedang mengaktifkan/mengedit elemen/kolom di dalam section, secara otomatis border biru aktif (active outline), border hover, serta fuchsia melayang navigator milik section **disembunyikan secara cerdas**. Visual biru aktif hanya muncul murni pada elemen/kolom yang sedang diedit agar pengguna tidak bingung.`;

const newText = `- [x] Unifikasi Fokus Sorot Visual Aktif (Active Outline Sync):
  * *Berkas Berubah*: \`components/storefront/sections/BuilderSection.tsx\`, \`app/dashboard/storefront/builder/page.tsx\`
  * Solusi: Menghubungkan parameter \`isActive\` milik section dengan \`activeElementId\`. Jika pengguna sedang mengaktifkan/mengedit elemen/kolom di dalam section, secara otomatis border biru aktif (active outline), border hover, serta fuchsia melayang navigator milik section **disembunyikan secara cerdas**. Visual biru aktif hanya muncul murni pada elemen/kolom yang sedang diedit agar pengguna tidak bingung.
- [x] Restorasi & Penyempurnaan Pengaturan Font Family Global Elemen:
  * *Berkas Berubah*: \`app/dashboard/storefront/builder/page.tsx\`, \`components/storefront/sections/BuilderSection.tsx\`
  * Solusi Utama: Sebelumnya, kontrol **Font Family** dan **Ukuran Font** disembunyikan jika parameter \`fontSize\` di dalam config database bernilai \`undefined\` (misal pada elemen Text, Button, dan Badge bawaan).
  * Sekarang kontrol **Font Family** dan slider **Ukuran Font** telah dikeluarkan dari pembungkus kondisional tersebut dan dibuat selalu aktif untuk semua elemen bertipe \`HEADING\`, \`TEXT\`, \`BUTTON\`, dan \`BADGE\`.
  * Menambahkan opsi \`Default System (inherit)\` pada pemilih Font Family dan memetakan nilai default fallback yang presisi (Heading: 24px, Text: 16px, Button: 14px, Badge: 9px) jika ukuran font belum pernah diatur.
  * Menambahkan integrasi pembacaan gaya \`fontFamily\` di sisi render \`TextElement\` canvas sehingga teks paragraph kini merespon perubahan font family secara instan dan sempurna.`;

if (content.includes(oldText)) {
  content = content.replace(oldText, newText);
  fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully patched TODO.md!');
} else {
  console.error('Target text not found in TODO.md');
}
