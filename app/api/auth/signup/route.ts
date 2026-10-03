import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool, ensureDb } from "@/lib/db";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");

    if (name.length < 2) return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    if (phone && !/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

    await ensureDb();
    const existing = await pool.query("SELECT id FROM students WHERE email = $1", [email]);
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ error: "An account with this email already exists. Try logging in." }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query<{ id: number }>(
      "INSERT INTO students (name, email, phone, password_hash) VALUES ($1,$2,$3,$4) RETURNING id",
      [name, email, phone, hash]
    );
    await createSession({ uid: rows[0].id, name, email });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("signup error", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
