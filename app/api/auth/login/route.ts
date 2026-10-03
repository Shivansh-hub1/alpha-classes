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

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

    await ensureDb();
    const { rows } = await pool.query<{ id: number; name: string; password_hash: string }>(
      "SELECT id, name, password_hash FROM students WHERE email = $1", [email]
    );
    const student = rows[0];
    if (!student || !(await bcrypt.compare(password, student.password_hash))) {
      return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
    }
    await createSession({ uid: student.id, name: student.name, email });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("login error", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
