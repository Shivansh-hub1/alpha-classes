"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Question = { id: number; q_text: string; options: string[] };
type ReviewItem = { id: number; q_text: string; options: string[]; picked: number | null; correct: number; isCorrect: boolean };
type Result = { score: number; total: number; review: ReviewItem[] };

export default function TestRunner({ slug, title, durationMin, questions }: { slug: string; title: string; durationMin: number; questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(durationMin * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const submittedRef = useRef(false);

  const submit = useCallback(async (auto = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/tests/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, v])) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit.");
      setResult({ score: data.score, total: data.total, review: data.review });
      if (auto) setError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      submittedRef.current = false;
      setError(e instanceof Error ? e.message : "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, slug]);

  useEffect(() => {
    if (result) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          void submit(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [result, submit]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const answered = Object.keys(answers).length;

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    const cls = pct >= 70 ? "good" : pct >= 40 ? "mid" : "bad";
    return (
      <div>
        <div className="card" style={{ padding: 26, marginBottom: 22 }}>
          <h2 style={{ fontSize: 24 }}>Your result — {title}</h2>
          <p className="muted" style={{ margin: "6px 0 14px" }}>Submitted {new Date().toLocaleString("en-IN")}</p>
          <div style={{ fontSize: 40, fontWeight: 900 }} className={`score-chip ${cls}`}>
            {result.score} / {result.total} <span style={{ fontSize: 20 }}>({pct}%)</span>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            {pct >= 70 ? "Excellent work! Keep this momentum going. 🎯" : pct >= 40 ? "Good attempt — review the questions below and try again. 💪" : "Keep practising — review the answers below and retake the test. 📚"}
          </p>
        </div>
        {result.review.map((r, i) => (
          <div key={r.id} className="q-card">
            <div className="qn">Question {i + 1} · {r.isCorrect ? "✓ Correct" : r.picked === null ? "— Not answered" : "✗ Wrong"}</div>
            <strong>{r.q_text}</strong>
            <div>
              {r.options.map((o, idx) => (
                <span key={idx} className={"review-opt" + (idx === r.correct ? " correct" : idx === r.picked ? " wrong" : "")}>
                  {String.fromCharCode(65 + idx)}. {o}
                </span>
              ))}
            </div>
          </div>
        ))}
        <a className="btn btn-primary" href="/tests" style={{ display: "inline-block", marginTop: 8 }}>Take Another Test</a>
      </div>
    );
  }

  return (
    <div>
      <div className={"timer-bar" + (secondsLeft < 60 ? " warn" : "")}>
        <div>
          <strong>{title}</strong>
          <div className="small" style={{ color: "#aab1bf" }}>{answered}/{questions.length} answered</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="time">{mm}:{ss}</div>
          <div className="small" style={{ color: "#aab1bf" }}>{secondsLeft < 60 ? "Auto-submitting soon!" : "Time left"}</div>
        </div>
      </div>

      {questions.map((q, i) => (
        <div key={q.id} className="q-card">
          <div className="qn">Question {i + 1}</div>
          <strong style={{ fontSize: 15.5 }}>{q.q_text}</strong>
          <div>
            {q.options.map((o, idx) => (
              <label key={idx} className={"opt" + (answers[q.id] === idx ? " sel" : "")}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === idx}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                />
                <span><b style={{ marginRight: 6 }}>{String.fromCharCode(65 + idx)}.</b>{o}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
      <button className="btn btn-primary" style={{ padding: "14px 30px", fontSize: 15 }} onClick={() => submit(false)} disabled={submitting}>
        {submitting ? "Submitting…" : `Submit Test (${answered}/${questions.length})`}
      </button>
    </div>
  );
}
