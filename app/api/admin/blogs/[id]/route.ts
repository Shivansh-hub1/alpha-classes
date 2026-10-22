import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateBlog, deleteBlog } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = await req.json();
    const updated = await updateBlog(id, body);
    if (!updated) return NextResponse.json({ error: "Blog not found or no changes" }, { status: 404 });
    return NextResponse.json({ ok: true, blog: updated });
  } catch (e: any) {
    console.error("updateBlog error", e);
    return NextResponse.json({ error: e?.message || "Failed to update blog." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await deleteBlog(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("deleteBlog error", e);
    return NextResponse.json({ error: e?.message || "Failed to delete blog." }, { status: 500 });
  }
}
