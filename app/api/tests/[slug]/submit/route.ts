import { NextResponse } from "next/server";
import { pool, ensureDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in to submit a test." }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    const answers: Record<string, number> = (body && typeof body === "object" && body.answers) || {};

    await ensureDb();
    const { rows } = await pool.query<{ id: number }>("SELECT id FROM tests WHERE slug = $1", [params.slug]);
    const test = rows[0];
    if (!test) return NextResponse.json({ error: "Test not found." }, { status: 404 });

    const qs = await pool.query<{ id: number; q_text: string; options: string[]; correct: number }>(
      "SELECT id, q_text, options, correct FROM questions WHERE test_id = $1 ORDER BY sort, id", [test.id]
    );

    let score = 0;
    const review = qs.rows.map((q) => {
      const picked = answers[String(q.id)];
      const isCorrect = picked === q.correct;
      if (isCorrect) score++;
      return { id: q.id, q_text: q.q_text, options: q.options, picked: typeof picked === "number" ? picked : null, correct: q.correct, isCorrect };
    });

    await pool.query(
      "INSERT INTO test_results (student_id, test_id, score, total) VALUES ($1,$2,$3,$4)",
      [session.uid, test.id, score, qs.rows.length]
    );

    return NextResponse.json({ ok: true, score, total: qs.rows.length, review });
  } catch (e) {
    console.error("test submit error", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
