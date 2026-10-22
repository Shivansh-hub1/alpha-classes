import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getCourses, createCourse } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const courses = await getCourses();
    return NextResponse.json({ courses });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch courses." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, slug, level, icon, description, highlights, classes_count, price, featured } = body;

    if (!title || !slug || !description) {
      return NextResponse.json({ error: "Title, slug, and description are required." }, { status: 400 });
    }

    const course = await createCourse({
      title: String(title).trim(),
      slug: String(slug).toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-"),
      level: String(level || "Foundation").trim(),
      icon: String(icon || "📚").trim(),
      description: String(description).trim(),
      highlights: String(highlights || "").trim(),
      classes_count: Number(classes_count || 0),
      price: Number(price || 0),
      featured: !!featured,
    });

    return NextResponse.json({ course });
  } catch (e: any) {
    console.error("createCourse error", e);
    return NextResponse.json(
      { error: e?.message?.includes("unique") ? "A course with this slug already exists." : "Failed to create course." },
      { status: 500 }
    );
  }
}
