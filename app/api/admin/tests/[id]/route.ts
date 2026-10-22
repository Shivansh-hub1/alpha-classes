import { NextResponse } from "next/server";
import { deleteTest } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid test ID." }, { status: 400 });
  }

  try {
    await deleteTest(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("delete test error", e);
    return NextResponse.json({ error: "Failed to delete test." }, { status: 500 });
  }
}
