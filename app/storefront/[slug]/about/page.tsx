import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import { RichContentSection } from "@/components/storefront/sections/DynamicSections";

interface AboutPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      categories: true,
      products: {
        where: { isActive: true }
      },
      sections: {
        where: { 
          isActive: true 
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!client) return notFound();

  // Bersihkan data untuk serialisasi
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

  const aboutSections = clientClean.sections.filter((s: any) => s.type?.toUpperCase() === "TEXT");

  console.log(`[AboutPage] Found ${aboutSections.length} rich content sections for client: ${clientClean.slug}`);
  
  if (aboutSections.length === 0) {
    console.log("[AboutPage] No TEXT sections found, returning 404.");
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8F7F5] pb-20">
      <StorefrontHeader showBack={true} backLink="/" />
      
      <div className="pt-16 md:pt-24">
        {aboutSections.map((section: any) => (
          <RichContentSection key={section.id} config={section.config} />
        ))}
      </div>
    </main>
  );
}
