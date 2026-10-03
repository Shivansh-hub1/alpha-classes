import { NextResponse } from "next/server";
import { pool, ensureDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    const courseId = Number(body?.courseId);
    if (!courseId) return NextResponse.json({ error: "Invalid course." }, { status: 400 });

    await ensureDb();
    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [courseId]);
    if (!course.rowCount) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    await pool.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [session.uid, courseId]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("enroll error", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
