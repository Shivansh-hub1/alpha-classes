import { NextResponse } from "next/server";
import { pool, ensureDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  try {
    await ensureDb();
    const { rows } = await pool.query<{ file_data: Buffer; file_name: string; kind: string; url: string | null }>(
      "SELECT file_data, file_name, kind, url FROM materials WHERE id = $1", [id]
    );
    const m = rows[0];
    if (!m) return NextResponse.json({ error: "Material not found." }, { status: 404 });
    if (m.kind === "link") {
      return NextResponse.json({ error: "This material is an external link, not a download." }, { status: 400 });
    }
    await pool.query("UPDATE materials SET downloads = downloads + 1 WHERE id = $1", [id]);

    const safeName = (m.file_name || "material.pdf").replace(/[^\w.\- ]+/g, "_");
    return new Response(new Uint8Array(m.file_data), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    console.error("material download error", e);
    return NextResponse.json({ error: "Download failed." }, { status: 500 });
  }
}
