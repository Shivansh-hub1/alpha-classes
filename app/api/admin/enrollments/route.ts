import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { grantStudentAccess, revokeStudentAccess } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { student_id, course_id } = await req.json();
    if (!student_id || !course_id) {
      return NextResponse.json({ error: "student_id and course_id are required." }, { status: 400 });
    }

    await grantStudentAccess(Number(student_id), Number(course_id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("grant access error", e);
    return NextResponse.json({ error: e?.message || "Failed to grant access." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { student_id, course_id } = await req.json();
    if (!student_id || !course_id) {
      return NextResponse.json({ error: "student_id and course_id are required." }, { status: 400 });
    }

    await revokeStudentAccess(Number(student_id), Number(course_id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("revoke access error", e);
    return NextResponse.json({ error: e?.message || "Failed to revoke access." }, { status: 500 });
  }
}
