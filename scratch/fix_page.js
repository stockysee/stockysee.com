const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\HYPE\\project\\villa-engine\\engine\\BACKUP-ENGINE\\BUILD\\stockysee\\app\\dashboard\\storefront\\builder\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Kita pecah per baris
const lines = content.split(/\r?\n/);

console.log("Baris 6342 asli:", JSON.stringify(lines[6341]));
console.log("Baris 6343 asli:", JSON.stringify(lines[6342]));
console.log("Baris 6344 asli:", JSON.stringify(lines[6343]));

// Ganti baris ke-6343 (indeks 6342) dengan penutup yang benar
lines[6342] = '                                                    }`}\r\n                                                  >';

fs.writeFileSync(filePath, lines.join('\r\n'), 'utf8');
console.log("Berhasil diperbaiki!");
