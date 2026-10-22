import { NextResponse } from "next/server";
import { getTests, createTest } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const tests = await getTests();
    return NextResponse.json({ tests });
  } catch (e) {
    console.error("fetch admin tests error", e);
    return NextResponse.json({ error: "Failed to load tests." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const title = String(body.title || "").trim();
    const rawSlug = String(body.slug || "").trim();
    const description = String(body.description || "").trim();
    const duration_min = Math.max(1, Math.min(180, Number(body.duration_min) || 15));
    const category = String(body.category || "General").trim();
    const questions = Array.isArray(body.questions) ? body.questions : [];

    if (title.length < 3) {
      return NextResponse.json({ error: "Test title must be at least 3 characters." }, { status: 400 });
    }

    // Generate clean slug if empty
    let slug = rawSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (slug.length < 3) slug = `test-${Date.now().toString(36)}`;

    if (!description) {
      return NextResponse.json({ error: "Please enter a short description for the test." }, { status: 400 });
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: "Please add at least 1 question to the test." }, { status: 400 });
    }

    const cleanQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const q_text = String(q.q_text || "").trim();
      const options = Array.isArray(q.options)
        ? q.options.map((opt: unknown) => String(opt || "").trim()).filter(Boolean)
        : [];
      const correct = Number(q.correct);
      const explanation = String(q.explanation || "").trim();

      if (!q_text) {
        return NextResponse.json({ error: `Question #${i + 1} is missing question text.` }, { status: 400 });
      }
      if (options.length < 2) {
        return NextResponse.json({ error: `Question #${i + 1} must have at least 2 options.` }, { status: 400 });
      }
      if (isNaN(correct) || correct < 0 || correct >= options.length) {
        return NextResponse.json(
          { error: `Question #${i + 1} has an invalid correct option index.` },
          { status: 400 }
        );
      }

      cleanQuestions.push({
        q_text,
        options,
        correct,
        explanation,
      });
    }

    const created = await createTest({
      title,
      slug,
      description,
      duration_min,
      category,
      questions: cleanQuestions,
    });

    return NextResponse.json({ ok: true, test: created });
  } catch (e: unknown) {
    console.error("admin test creation error", e);
    const msg = e instanceof Error ? e.message : "Failed to create test.";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "A test with this slug or title already exists. Choose a different slug." }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
