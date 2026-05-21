import prisma from "@/lib/db";

export async function getStoreBySlug(slug: string) {
  return await prisma.client.findUnique({
    where: { slug },
    include: {
      products: {
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: "desc" },
      },
      shippingMethods: true,
    },
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      client: true,
    },
  });
}
