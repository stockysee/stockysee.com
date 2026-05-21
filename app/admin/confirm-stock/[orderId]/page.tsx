import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function ConfirmStockPage({ params }: any) {
  // Ambil orderId secara fleksibel (kompatibel 14 & 15)
  const orderId = params?.orderId;
  if (!orderId) return notFound();

  // 1. Ambil data Order & Items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true }
      },
      client: true
    }
  }) as any;

  if (!order) return notFound();

  // Server Action untuk konfirmasi
  async function handleConfirm() {
    "use server";
    
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Update status Order
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID" }
        });

        // 2. Potong stok tiap produk
        if (order.items) {
          for (const item of order.items) {
            if (item.productId) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: { decrement: item.quantity || 0 }
                }
              });
            }
          }
        }
      });

      revalidatePath(`/admin/confirm-stock/${orderId}`);
    } catch (e) {
      console.error("Confirm error:", e);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-md mx-auto">
        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden shadow-2xl">
          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full" />
          
          <h1 className="text-2xl font-black mb-8 tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            Konfirmasi Penjualan
          </h1>
          
          <div className="space-y-5 mb-10 bg-white/5 p-6 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-40 font-black uppercase tracking-widest text-[9px]">Order ID</span>
              <span className="font-mono text-xs text-blue-400 font-bold">#{orderId.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-40 font-black uppercase tracking-widest text-[9px]">Status</span>
              <span className={`font-black uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-lg ${order.status === "PAID" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"}`}>
                {order.status}
              </span>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="opacity-40 font-black uppercase tracking-widest text-[9px]">Total Bayar</span>
              <span className="font-black text-white text-xl">Rp {Number(order.totalPrice || 0).toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="space-y-3 mb-10">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-2">Daftar Produk</p>
             {order.items?.map((item: any) => (
               <div key={item.id} className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-all">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-xs font-bold truncate uppercase tracking-tight text-gray-200">{item.product?.name || "Produk dihapus"}</p>
                    <p className="text-[9px] opacity-40 font-black mt-0.5 tracking-widest">QTY: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-black text-blue-400 whitespace-nowrap">Rp {(Number(item.price || 0) * (item.quantity || 1)).toLocaleString("id-ID")}</p>
               </div>
             ))}
          </div>

          {order.status !== "PAID" ? (
            <form action={handleConfirm}>
              <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 transition-all text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2">
                <span>✅</span>
                <span>Konfirmasi & Potong Stok</span>
              </button>
            </form>
          ) : (
            <div className="w-full py-5 bg-green-500/10 text-green-500 font-black rounded-2xl text-center uppercase tracking-widest text-[10px] border border-green-500/20 backdrop-blur-md font-sans">
              Penjualan Berhasil Dikonfirmasi
            </div>
          )}
        </div>
        
        <div className="text-center mt-10 space-y-2">
          <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.3em] leading-loose">
            Stockysee Automation Layer
          </p>
          <div className="w-8 h-1 bg-white/5 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}
