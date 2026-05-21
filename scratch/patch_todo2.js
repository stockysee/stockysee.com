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
  * Sebagai gantinya, menambahkan tombol **Back Hirarkis (\`ArrowLeft\`)**, tombol **Hapus (\`Trash2\`)**, dan tombol **Tutup (\`X\`)** dinamis secara terpadu di bagian **Header Kanan Atas** dari Property Editor Panel kustom (bukan di sidebar footer). Langkah ini menyelaraskan aksi persis sesuai mock-up layout visual premium yang ramah pengguna.`;

if (content.includes(oldText)) {
  content = content.replace(oldText, newText);
  fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully patched TODO.md!');
} else {
  console.error('Target text not found in TODO.md');
}
