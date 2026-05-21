import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "client_session";

// Konversi string secret ke Uint8Array untuk jose (edge runtime compatible)
// Konversi string secret ke Uint8Array untuk jose (edge runtime compatible)
function getSecret() {
  const secret = process.env.CLIENT_SESSION_SECRET;
  if (!secret) {
    console.warn("[Middleware] CLIENT_SESSION_SECRET is missing! Security might be compromised.");
  }
  return new TextEncoder().encode(secret || "fallback_security_key_change_me");
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;
  const host = req.headers.get("host") || "";

  // ── DOMAIN & SUBDOMAIN DISCOVERY ──
  const excludeHosts = [
    "www.stockysee.com", 
    "stockysee.com", 
    "localhost:3000", 
    "cname.stockysee.com",
    "cname"
  ];
  let detectedSlug = "";

  // 1. Cek apakah ini domain utama atau localhost
  if (host.includes("stockysee.com") || host.includes("localhost:3000")) {
    const subdomain = host.replace(".stockysee.com", "").replace("localhost:3000", "");
    if (subdomain && !excludeHosts.includes(host)) {
      detectedSlug = subdomain;
    }
  } else {
    // 2. Jika domain asing (Custom Domain), tanya ke API Internal
    try {
      const checkRes = await fetch(`${url.origin}/api/internal/check-domain?domain=${host}`);
      const { slug } = await checkRes.json();
      if (slug) {
        detectedSlug = slug;
      }
    } catch (err) {
      console.error("[Middleware] Domain check failed:", err);
    }
  }

  // 3. Jika ini rute Storefront (bukan API/Dashboard/Static) dan slug terdeteksi
  const isStaticOrPwa = 
    pathname.includes(".") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/_next") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js";

  const isInternalApp = 
    pathname.toLowerCase().startsWith("/dashboard") || 
    pathname.toLowerCase().startsWith("/admin-panel") || 
    pathname.toLowerCase().startsWith("/auth") ||
    pathname.toLowerCase().startsWith("/activate") ||
    pathname.toLowerCase().startsWith("/super-gate");

  if (detectedSlug && !isStaticOrPwa && !isInternalApp) {
    return NextResponse.rewrite(new URL(`/storefront/${detectedSlug}${pathname}`, req.url));
  }

  // ── ADMIN PROTECTION ──
  if (pathname.startsWith("/admin-panel") || pathname.startsWith("/api/admin")) {
    // Kecualikan rute login agar tidak kena blokir middleware sendiri
    if (pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const adminSession = req.cookies.get("admin_session")?.value;
    const adminSecret = process.env.ADMIN_SECRET_KEY || "secret";

    console.log(`[Middleware] Admin Path: ${pathname} | Session: ${adminSession ? "YES" : "NO"} | SecretMatch: ${adminSession === adminSecret}`);

    if (!adminSession || adminSession !== adminSecret) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/super-gate", req.url));
    }
    return NextResponse.next();
  }

  // ── CLIENT DASHBOARD & PRIVATE API PROTECTION ──
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isPrivateApi = 
    pathname.startsWith("/api/products") || 
    pathname.startsWith("/api/categories") || 
    (pathname.startsWith("/api/stats") && pathname !== "/api/stats/active-users") || 
    pathname.startsWith("/api/profile") ||
    (pathname.startsWith("/api/orders") && req.method !== "POST");

  if (isDashboardRoute || isPrivateApi) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized Client Session" }, { status: 401 });
      }
      const loginUrl = new URL("/auth", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch (err) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Invalid/Expired Session" }, { status: 401 });
      }
      const loginUrl = new URL("/auth", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
