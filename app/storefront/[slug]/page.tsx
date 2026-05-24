import { notFound } from "next/navigation";
import prisma from "@/lib/db";
export const revalidate = 0; // Strict sync with latest builder data
import EcommerceModel from "@/components/storefront/models/EcommerceModel";
import BookingModel from "@/components/storefront/models/BookingModel";

// Import tema lama sebagai fallback sementara
import ThemeGalaxy from "@/components/themes/ThemeGalaxy";
import ThemeLanding from "@/components/themes/ThemeLanding";
import ThemeDigital from "@/components/themes/ThemeDigital";

interface StorefrontPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string; model?: string }>;
}

export async function generateMetadata({ params }: StorefrontPageProps) {
  const { slug } = await params;
  
  const client = await prisma.client.findUnique({
    where: { slug },
    select: { name: true, logoUrl: true }
  });

  if (!client) return { title: "Store Not Found" };

  return {
    title: client.name,
    icons: {
      icon: client.logoUrl || "/logo2.png",
    }
  };
}

export default async function StorefrontPage({ params, searchParams }: StorefrontPageProps) {
  const { slug } = await params;
  const { theme, model } = await searchParams;

  // 1. Ambil data Client, Products & Categories dari database
  let clientData = null;
  try {
    clientData = await prisma.client.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            products: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        products: {
          where: { isActive: true },
          include: { category: true },
          orderBy: { createdAt: 'desc' }
        },
        sections: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        storePages: {
          where: { isPublished: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  } catch (error) {
    console.error("Storefront Query Error:", error);
    // Fallback query jika include gagal
    clientData = await prisma.client.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  if (!clientData) {
    return notFound();
  }

  // Bersihkan data untuk serialisasi aman (Plain Objects)
  const client = JSON.parse(JSON.stringify(clientData));

  if (client.sections) {
    client.sections = client.sections.map((s: any) => {
      if (s.id === `global-header-${client.id}`) {
        return { ...s, id: "global-header" };
      }
      if (s.id === `global-footer-${client.id}`) {
        return { ...s, id: "global-footer" };
      }
      return s;
    });
  }

  // 2. Tentukan model mana yang akan dirender
  const activeModelId = model || theme || client.themeId || "1";

  const renderModel = () => {
    switch (activeModelId) {
      case "1":
        return <EcommerceModel />;
      case "2":
        return <BookingModel />; 
      case "3":
        return <EcommerceModel />;
      
      default:
        if (activeModelId === "galaxy") return <ThemeGalaxy client={client} products={client.products} />;
        if (activeModelId === "landing") return <ThemeLanding client={client} products={client.products} />;
        if (activeModelId === "digital") return <ThemeDigital client={client} products={client.products} />;
        return <EcommerceModel />;
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F5]">
      {renderModel()}
    </main>
  );
}
