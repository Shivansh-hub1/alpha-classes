import { NextResponse } from "next/server";
import { pool, ensureDb } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID = new Set(["new", "contacted", "joined", "closed"]);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    const status = String(body?.status || "");
    if (!VALID.has(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

    await ensureDb();
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

    await pool.query("UPDATE enquiries SET status = $1 WHERE id = $2", [status, id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin enquiry update error", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
