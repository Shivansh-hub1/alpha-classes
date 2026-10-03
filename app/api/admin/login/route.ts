import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const password = String(body?.password || "");
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json({ error: "Admin login is not configured. Set ADMIN_PASSWORD in your environment variables." }, { status: 503 });
    }
    if (password !== expected) {
      return NextResponse.json({ error: "Wrong admin password." }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin login error", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
