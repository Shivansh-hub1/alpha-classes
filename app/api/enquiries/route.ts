import { NextResponse } from "next/server";
import { pool, ensureDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim().slice(0, 2000);
    const courseId = Number(body.courseId) || null;

    if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    if (!/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });

    await ensureDb();
    await pool.query(
      "INSERT INTO enquiries (name, email, phone, course_id, message) VALUES ($1,$2,$3,$4,$5)",
      [name, email, phone, courseId, message]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("enquiry error", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
