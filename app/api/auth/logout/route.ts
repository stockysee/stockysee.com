import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    console.log("[AUTH_LOGOUT] Client logout initiated.");
    const cookieStore = await cookies();
    cookieStore.delete("client_session");
    console.log("[AUTH_LOGOUT] Session cookie cleared successfully.");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[AUTH_LOGOUT_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
