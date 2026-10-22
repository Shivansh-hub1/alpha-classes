import { NextResponse } from "next/server";
import { pool, ensureDb } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PDF_BYTES = 4 * 1024 * 1024; // 4 MB — Vercel request body limit
const CATEGORIES = new Set(["test-series", "book", "notes"]);

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

    const title = String(form.get("title") || "").trim();
    const category = String(form.get("category") || "notes");
    const description = String(form.get("description") || "").trim().slice(0, 1000);
    const url = String(form.get("url") || "").trim();
    const file = form.get("file");
    const courseIdRaw = form.get("course_id");
    const courseId =
      courseIdRaw && courseIdRaw !== "null" && courseIdRaw !== ""
        ? Number(courseIdRaw)
        : null;

    if (title.length < 3) return NextResponse.json({ error: "Please enter a title (min 3 characters)." }, { status: 400 });
    if (!CATEGORIES.has(category)) return NextResponse.json({ error: "Invalid category." }, { status: 400 });

    await ensureDb();

    if (file instanceof File && file.size > 0) {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files can be uploaded." }, { status: 400 });
      }
      if (file.size > MAX_PDF_BYTES) {
        return NextResponse.json({ error: "PDF is larger than 4 MB. Use a Google Drive link for big files." }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      await pool.query(
        "INSERT INTO materials (title, category, kind, description, file_data, file_name, file_size, course_id) VALUES ($1,$2,'pdf',$3,$4,$5,$6,$7)",
        [title, category, description, buffer, file.name, file.size, courseId]
      );
      return NextResponse.json({ ok: true });
    }

    if (url) {
      if (!/^https:\/\/[^\s]+$/i.test(url)) {
        return NextResponse.json({ error: "Please enter a valid https:// link (Google Drive or any URL)." }, { status: 400 });
      }
      await pool.query(
        "INSERT INTO materials (title, category, kind, description, url, course_id) VALUES ($1,$2,'link',$3,$4,$5)",
        [title, category, description, url, courseId]
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Attach a PDF file or paste a link." }, { status: 400 });
  } catch (e) {
    console.error("material upload error", e);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
