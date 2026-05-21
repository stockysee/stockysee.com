import { PrismaClient } from '@prisma/client'

// Coba pake Direct Host buat nembus blokir pooler
const directUrl = "postgresql://postgres.wcfbkcnqkufgcvsqgjcn:Naufalmalang10%23@db.wcfbkcnqkufgcvsqgjcn.supabase.co:5432/postgres"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
})

async function main() {
  try {
    console.log('🔄 Mencoba konek ke Direct Host (db.wcfbkcnqkufgcvsqgjcn.supabase.co)...')
    const count = await prisma.customerInvoice.count()
    console.log('✅ Koneksi BERHASIL! Jumlah invoice:', count)
  } catch (e) {
    console.error('❌ Koneksi GAGAL!')
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
