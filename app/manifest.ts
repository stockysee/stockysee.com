import { MetadataRoute } from "next";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const headerList = headers();
  const host = headerList.get("host") || "localhost:3000";
  
  // Ambil root domain untuk deteksi subdomain
  const rootDomain = process.env.NODE_ENV === "production" 
    ? "stockysee.vercel.app" 
    : "localhost:3000";

  let clientName = "StockySee Admin";
  let shortName = "StockySee";
  let description = "Premium Multi-tenant Storefront Platform";
  let startUrl = "/dashboard";
  let iconUrl = "/icon-512x512.png";

  // Jika ini adalah subdomain (storefront)
  if (host.endsWith(`.${rootDomain}`)) {
    const slug = host.replace(`.${rootDomain}`, "");
    
    try {
      const client = await prisma.client.findUnique({
        where: { slug },
      });

      if (client) {
        clientName = client.name;
        shortName = client.name.split(" ")[0]; // Ambil kata pertama
        description = `Toko resmi ${client.name}`;
        startUrl = "/";
        // Gunakan logo client jika ada di paymentInfo atau field khusus nantinya
        // Untuk sekarang template pakai icon default atau logo2.png
        iconUrl = "/icon-512x512.png"; 
      }
    } catch (e) {
      console.error("Failed to fetch client for manifest:", e);
    }
  }

  return {
    name: clientName,
    short_name: shortName,
    description: description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#3b82f6",
    icons: [
      {
        src: iconUrl,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: iconUrl,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
