import { NextResponse } from "next/server";
import { pool, ensureDb, TESTS_SEED } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getSession();

  try {
    const body = await req.json().catch(() => null);
    const answers: Record<string, number> = (body && typeof body === "object" && body.answers) || {};

    let testId: number | null = null;
    let questionsList: Array<{ id: number; q_text: string; options: string[]; correct: number; explanation: string }> = [];

    try {
      await ensureDb();
      const { rows } = await pool.query<{ id: number }>("SELECT id FROM tests WHERE slug = $1", [params.slug]);
      if (rows[0]) {
        testId = rows[0].id;
        const qs = await pool.query<{ id: number; q_text: string; options: string[]; correct: number; explanation: string }>(
          "SELECT id, q_text, options, correct, COALESCE(explanation, '') AS explanation FROM questions WHERE test_id = $1 ORDER BY sort, id",
          [testId]
        );
        questionsList = qs.rows.map((q) => ({
          id: q.id,
          q_text: q.q_text,
          options: Array.isArray(q.options) ? q.options : JSON.parse(String(q.options || "[]")),
          correct: q.correct,
          explanation: q.explanation || "",
        }));
      }
    } catch {}

    // Fallback to seed test if database not connected or offline
    if (questionsList.length === 0) {
      const match = TESTS_SEED.find((t) => t[0] === params.slug);
      if (match) {
        testId = 999;
        questionsList = match[6].map(([q_text, options, correct, explanation], idx) => ({
          id: idx + 1,
          q_text,
          options,
          correct,
          explanation: explanation || "",
        }));
      }
    }

    if (questionsList.length === 0) {
      return NextResponse.json({ error: "Test not found." }, { status: 404 });
    }

    let score = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const review = questionsList.map((q) => {
      const pickedRaw = answers[String(q.id)];
      const picked = typeof pickedRaw === "number" && !isNaN(pickedRaw) ? pickedRaw : null;
      const isAnswered = picked !== null;
      const isCorrect = isAnswered && picked === q.correct;

      if (isCorrect) {
        score++;
      } else if (isAnswered) {
        wrongCount++;
      } else {
        unansweredCount++;
      }

      return {
        id: q.id,
        q_text: q.q_text,
        options: q.options,
        picked,
        correct: q.correct,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const attempted = score + wrongCount;
    const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

    // If logged in and real DB is connected, persist result
    let saved = false;
    if (session && testId && testId !== 999 && process.env.DATABASE_URL) {
      try {
        await pool.query(
          "INSERT INTO test_results (student_id, test_id, score, total) VALUES ($1,$2,$3,$4)",
          [session.uid, testId, score, questionsList.length]
        );
        saved = true;
      } catch (err) {
        console.warn("Could not save test result to database:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      score,
      total: questionsList.length,
      correctCount: score,
      wrongCount,
      unansweredCount,
      accuracy,
      saved,
      guest: !session,
      review,
    });
  } catch (e) {
    console.error("test submit error", e);
    return NextResponse.json({ error: "Something went wrong while evaluating test." }, { status: 500 });
  }
}
