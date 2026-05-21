export function generateWhatsAppMessage(storeName: string, items: any[], total: number, paymentMethod?: string) {
  const itemSummary = items
    .map((item) => `- ${item.name} (x${item.quantity})`)
    .join("\n");
  
  let text = `Halo ${storeName},\n\nSaya ingin memesan:\n${itemSummary}\n\nTotal: Rp ${total.toLocaleString("id-ID")}`;
  
  if (paymentMethod) {
    text += `\nMetode Pembayaran: ${paymentMethod}`;
  }

  text += `\n\nMohon informasi selanjutnya untuk konfirmasi pesanan. Terima kasih!`;
  
  return encodeURIComponent(text);
}
