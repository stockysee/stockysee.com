import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SESSION_COOKIE = "client_session";
const JWT_SECRET = process.env.CLIENT_SESSION_SECRET!;

interface ClientJWTPayload {
  clientId: string;
  email: string;
  slug: string;
  iat: number;
  exp: number;
}

/**
 * Mendapatkan clientId dari JWT session cookie.
 * Versi AMAN UNTUK BUILD (Vercel Build-Safe).
 */
export async function getCurrentClientId(): Promise<string | null> {
  // 1. CEK FASE BUILD
  if (process.env.NEXT_PHASE === 'phase-production-build' || (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL)) {
    return null;
  }

  let token: string | undefined;
  try {
    // 2. DEFENSIVE COOKIES ACCESS
    const cookieStore = await cookies();
    if (!cookieStore) return null;
    
    try {
      token = cookieStore.get(SESSION_COOKIE)?.value;
    } catch (e) {
      return null;
    }

    if (!token) return null;

    if (!JWT_SECRET) return null;

    // Verify dan decode JWT
    const payload = jwt.verify(token, JWT_SECRET) as ClientJWTPayload;
    return payload.clientId;
  } catch (err: any) {
    return null;
  }
}

/**
 * Mengecek apakah request terautentikasi.
 */
export async function isAuthenticated(): Promise<boolean> {
  const id = await getCurrentClientId();
  return !!id;
}

/**
 * Mendapatkan full payload dari JWT (untuk kebutuhan middleware/API).
 */
export async function getSessionPayload(): Promise<ClientJWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as ClientJWTPayload;
  } catch {
    return null;
  }
}
