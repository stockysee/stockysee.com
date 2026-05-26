import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { StorefrontProvider } from "@/components/storefront/StorefrontProvider";
import VisitorTracker from "@/components/VisitorTracker";
import ProductModal from "@/components/storefront/ProductModal";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const clientData = await prisma.client.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          products: {
            where: { isActive: true },
            take: 1
          }
        }
      },
      sections: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      storePages: {
        where: { isPublished: true },
        orderBy: { createdAt: "asc" },
      }
    },
  });

  if (!clientData) return notFound();

  // Plain object for serialization
  const client = JSON.parse(JSON.stringify(clientData));

  if (client.sections) {
    client.sections = client.sections.map((s: any) => {
      // Normalize id
      let id = s.id;
      if (id === `global-header-${client.id}`) id = "global-header";
      if (id === `global-footer-${client.id}`) id = "global-footer";

      // Normalize config: Prisma Json field bisa string atau object
      const cfg = typeof s.config === "string" ? JSON.parse(s.config) : (s.config || {});

      // Normalize elements: bisa ada di root (jarang) atau di dalam config
      const elements = s.elements || cfg?.elements || [];

      return { ...s, id, config: cfg, elements };
    });
  }

  // We fetch global products for the cart and modal to work consistently
  const products = await prisma.product.findMany({
    where: { clientId: client.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <StorefrontProvider 
      client={client} 
      products={JSON.parse(JSON.stringify(products))} 
      categories={client.categories} 
      sections={client.sections}
      customPages={client.storePages}
    >
      <div className="min-h-screen bg-[#F8F7F5]">
        <VisitorTracker clientId={client.id} />
        {children}
        <ProductModal />
      </div>
    </StorefrontProvider>
  );
}
