import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import { StorefrontProvider } from "@/components/storefront/StorefrontProvider";
import { HeroSection, FeaturesSection, CategoriesSection, ProductGridSection, BannerSection, RichContentSection } from "@/components/storefront/sections/DynamicSections";
import SectionRenderer from "@/components/storefront/SectionRenderer";
import { Metadata, ResolvingMetadata } from "next";

interface DynamicPageProps {
  params: Promise<{ slug: string; page_slug: string }>;
}

export async function generateMetadata(
  { params }: DynamicPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, page_slug } = await params;
  
  const client = await prisma.client.findUnique({
    where: { slug }
  });

  if (!client) return {};

  const page = await prisma.storePage.findUnique({
    where: {
      clientId_slug: {
        clientId: client.id,
        slug: page_slug
      }
    }
  });

  if (!page || !page.isPublished) return {};

  return {
    title: `${page.title} | ${client.name}`,
    description: `Halaman ${page.title} resmi dari toko ${client.name}`,
  };
}

export default async function DynamicClientPage({ params }: DynamicPageProps) {
  const { slug, page_slug } = await params;

  // 1. Dapatkan info toko
  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      categories: true,
      products: {
        where: { isActive: true }
      },
      sections: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!client) return notFound();

  // 2. Dapatkan data halaman yang spesifik
  const page = await prisma.storePage.findUnique({
    where: {
      clientId_slug: {
        clientId: client.id,
        slug: page_slug
      }
    }
  });

  // Jika halaman tidak ada atau diset menjadi draft, return 404
  if (!page || !page.isPublished) {
    return notFound();
  }

  // Bersihkan data untuk Provider serialization
  const clientClean = JSON.parse(JSON.stringify(client));

  if (clientClean.sections) {
    clientClean.sections = clientClean.sections.map((s: any) => {
      if (s.id === `global-header-${clientClean.id}`) {
        return { ...s, id: "global-header" };
      }
      if (s.id === `global-footer-${clientClean.id}`) {
        return { ...s, id: "global-footer" };
      }
      return s;
    });
  }

  let parsedSections: any[] = [];
  try {
    parsedSections = page.content ? JSON.parse(page.content) : [];
  } catch(e) {
    // Legacy support: jika bukan JSON, jadikan text block biasa
    parsedSections = [
      {
         id: "legacy-text",
         type: "TEXT",
         config: {
           paddingTop: "py-20",
           paddingBottom: "py-20",
           backgroundColor: "bg-white",
           textColor: "text-zinc-900",
           bgColor: "#F8F7F5",
           content: page.content,
           title: page.title
         }
      }
    ];
  }

  // Filter only active sections and sort by order
  parsedSections = parsedSections
    .filter(s => s.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <StorefrontProvider 
      client={clientClean} 
      products={clientClean.products} 
      categories={clientClean.categories} 
      sections={clientClean.sections}
    >
      <main className="min-h-screen bg-[#F3F0EC] pb-20">
        <StorefrontHeader showBack={true} backLink="/" />
        
        <div className="flex flex-col min-h-[50vh]">
          {parsedSections.length === 0 ? (
            <div className="pt-40 text-center text-zinc-500 font-medium">
              Halaman ini belum memiliki konten.
            </div>
          ) : (
            parsedSections.map((section, index) => {
              return (
                <div key={section.id || index}>
                  {section.type === "HERO" && <HeroSection config={section.config} />}
                  {section.type === "FEATURES" && <FeaturesSection config={section.config} />}
                  {section.type === "CATEGORIES" && <CategoriesSection config={section.config} />}
                  {section.type === "PRODUCT_GRID" && <ProductGridSection config={section.config} />}
                  {section.type === "BANNER" && <BannerSection config={section.config} />}
                  {section.type === "TEXT" && <RichContentSection config={section.config} />}
                  {section.type === "SECTION" && <SectionRenderer section={section} />}
                </div>
              );
            })
          )}
        </div>
      </main>
    </StorefrontProvider>
  );
}
