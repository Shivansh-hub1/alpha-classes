import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getAllBlogsAdmin, createBlog } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const blogs = await getAllBlogsAdmin();
    return NextResponse.json({ blogs });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch blogs." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, author, category, tags, read_time } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required." }, { status: 400 });
    }

    const blog = await createBlog({
      title: String(title).trim(),
      slug: String(slug).toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-"),
      excerpt: String(excerpt || "").trim(),
      content: String(content).trim(),
      author: String(author || "Er. Shivansh Verma").trim(),
      category: String(category || "Coaching Guide").trim(),
      tags: String(tags || "alpha classes,bikapur").trim(),
      read_time: Number(read_time || 4),
    });

    return NextResponse.json({ blog });
  } catch (e: any) {
    console.error("createBlog error", e);
    return NextResponse.json(
      { error: e?.message?.includes("unique") ? "An article with this slug already exists." : "Failed to create blog." },
      { status: 500 }
    );
  }
}
