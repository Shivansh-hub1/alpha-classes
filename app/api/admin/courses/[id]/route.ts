import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateCourse, deleteCourse } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = await req.json();
    const updated = await updateCourse(id, body);
    if (!updated) return NextResponse.json({ error: "Course not found or no changes" }, { status: 404 });
    return NextResponse.json({ ok: true, course: updated });
  } catch (e: any) {
    console.error("updateCourse error", e);
    return NextResponse.json({ error: e?.message || "Failed to update course." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await deleteCourse(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("deleteCourse error", e);
    return NextResponse.json({ error: e?.message || "Failed to delete course." }, { status: 500 });
  }
}
