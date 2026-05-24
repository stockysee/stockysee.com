/**
 * Compresses an image file on the client side
 * @param file The original File object
 * @param maxWidth Maximum width in pixels
 * @param quality Quality from 0 to 1
 * @returns A promise that resolves to a base64 string
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if larger than maxWidth
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// ── Custom SVG Image Placeholder ──
// Used when no image URL is set, consistent across canvas + editor panels
const SVG_PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef2ff"/><stop offset="1" stop-color="#e0e7ff"/></linearGradient><linearGradient id="gi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#818cf8"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)" rx="8"/><circle cx="75" cy="55" r="40" fill="#c7d2fe" opacity=".25"/><circle cx="325" cy="245" r="55" fill="#c7d2fe" opacity=".25"/><g transform="translate(200,125)" fill="none" stroke="url(#gi)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="-50" y="-40" width="100" height="80" rx="10"/><circle cx="-18" cy="-14" r="11"/><path d="M-32 40 -4 12 24 40"/><path d="M4 40 28 10 50 40"/></g><text x="200" y="195" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="13" fill="#818cf8" font-weight="600">No Image</text></svg>`;

export const IMAGE_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(SVG_PLACEHOLDER)}`;
