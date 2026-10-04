import { NextResponse } from "next/server";
import { pool, ensureDb } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  try {
    await ensureDb();
    await pool.query("DELETE FROM materials WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("material delete error", e);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
