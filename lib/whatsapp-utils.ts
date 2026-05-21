/**
 * Menghormat nomor telepon ke format internasional WhatsApp (62)
 * @param phone Nomor telepon mentah
 * @returns Nomor yang sudah diformat untuk wa.me
 */
export const formatWhatsAppNumber = (phone: string): string => {
  if (!phone) return "";
  
  // Hapus semua karakter non-digit (seperti +, -, spasi, dll)
  let cleaned = phone.replace(/\D/g, "");
  
  // Jika nomor dimulai dengan '0', ganti menjadi '62'
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  
  // Jika nomor sudah dimulai dengan '62' tapi masih ada '0' setelahnya (misal: 6208...), bersihkan
  if (cleaned.startsWith("620")) {
    cleaned = "62" + cleaned.substring(3);
  }

  return cleaned;
};
