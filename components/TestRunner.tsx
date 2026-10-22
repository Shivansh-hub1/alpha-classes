"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

export type QuestionItem = {
  id: number;
  q_text: string;
  options: string[];
  explanation?: string;
};

export type ReviewItem = {
  id: number;
  q_text: string;
  options: string[];
  picked: number | null;
  correct: number;
  isCorrect: boolean;
  explanation?: string;
};

export type ResultData = {
  score: number;
  total: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  accuracy: number;
  saved: boolean;
  guest: boolean;
  review: ReviewItem[];
};

export default function TestRunner({
  slug,
  title,
  durationMin,
  questions,
  isLoggedIn,
}: {
  slug: string;
  title: string;
  durationMin: number;
  questions: QuestionItem[];
  isLoggedIn?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(durationMin * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong" | "correct" | "skipped">("all");
  const submittedRef = useRef(false);

  const totalSeconds = durationMin * 60;

  const submit = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      setError("");
      try {
        const res = await fetch(`/api/tests/${slug}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not submit test.");
        setResult(data);
        if (auto) setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        submittedRef.current = false;
        setError(e instanceof Error ? e.message : "Could not submit. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [answers, slug]
  );

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

  function toggleFlag(id: number) {
    setFlagged((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function clearAnswer(id: number) {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function scrollToQuestion(id: number) {
    const el = document.getElementById(`q-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const timeProgressPct = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  // ============ RESULT SCREEN ============
  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    const cls = pct >= 75 ? "good" : pct >= 45 ? "mid" : "bad";

    const filteredReview = result.review.filter((r) => {
      if (reviewFilter === "wrong") return !r.isCorrect && r.picked !== null;
      if (reviewFilter === "correct") return r.isCorrect;
      if (reviewFilter === "skipped") return r.picked === null;
      return true;
    });

    return (
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* Score Card */}
        <div className="card" style={{ padding: 32, marginBottom: 26, borderTop: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
            <div>
              <span className="badge" style={{ marginBottom: 8 }}>Test Performance Report</span>
              <h1 style={{ fontSize: 28, letterSpacing: -1, margin: "4px 0 6px" }}>{title}</h1>
              <p className="muted" style={{ fontSize: 14 }}>
                Evaluated instant result · {new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className={`score-chip ${cls}`} style={{ fontSize: 44, fontWeight: 900 }}>
                {result.score} <span style={{ fontSize: 22, color: "var(--muted)" }}>/ {result.total}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: cls === "good" ? "var(--green)" : cls === "mid" ? "#d95100" : "var(--red)" }}>
                {pct}% Score
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, margin: "24px 0 14px" }}>
            <div className="stat-card" style={{ background: "#ecfdf3", borderColor: "#a6f4c5" }}>
              <strong style={{ color: "#067647" }}>{result.correctCount}</strong>
              <span style={{ color: "#067647" }}>✓ Correct</span>
            </div>
            <div className="stat-card" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
              <strong style={{ color: "#b42318" }}>{result.wrongCount}</strong>
              <span style={{ color: "#b42318" }}>✗ Wrong</span>
            </div>
            <div className="stat-card" style={{ background: "#f8f9fa", borderColor: "#e5e7eb" }}>
              <strong style={{ color: "#475467" }}>{result.unansweredCount}</strong>
              <span style={{ color: "#475467" }}>— Skipped</span>
            </div>
            <div className="stat-card" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
              <strong style={{ color: "#c2410c" }}>{result.accuracy}%</strong>
              <span style={{ color: "#c2410c" }}>🎯 Accuracy</span>
            </div>
          </div>

          <p style={{ fontSize: 15, color: "#344054", marginTop: 12 }}>
            {pct >= 75
              ? "🌟 Outstanding performance! Your concepts in this topic are solid. Keep attempting tests to maintain rank-level speed."
              : pct >= 45
              ? "👍 Good attempt! Review the step-by-step explanations below for incorrect answers to clarify doubts."
              : "📚 More practice needed. Review the solutions below and re-attempt the test to boost your score."}
          </p>

          {result.guest && (
            <div
              style={{
                marginTop: 20,
                padding: "16px 20px",
                background: "#f0f9ff",
                borderRadius: 12,
                border: "1px solid #b9e6fe",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <strong>Want to save your test scores to your student dashboard?</strong>
                <p className="small muted" style={{ marginTop: 2 }}>
                  Create a free Alpha Classes account in 10 seconds.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link className="btn btn-primary" href="/signup" style={{ padding: "8px 16px", fontSize: 13.5 }}>
                  Sign Up Free
                </Link>
                <Link className="btn btn-outline" href="/login" style={{ padding: "8px 16px", fontSize: 13.5 }}>
                  Login
                </Link>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                submittedRef.current = false;
                setResult(null);
                setAnswers({});
                setFlagged({});
                setSecondsLeft(durationMin * 60);
              }}
            >
              🔄 Retake Test
            </button>
            <Link className="btn btn-primary" href="/tests">
              Explore More Tests →
            </Link>
          </div>
        </div>

        {/* Detailed Solutions & Review */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontSize: 22 }}>Question-Wise Review & Solutions</h2>
            <div className="admin-tabs" style={{ margin: 0 }}>
              <button className={reviewFilter === "all" ? "active" : ""} onClick={() => setReviewFilter("all")}>
                All ({result.review.length})
              </button>
              <button className={reviewFilter === "wrong" ? "active" : ""} onClick={() => setReviewFilter("wrong")}>
                Incorrect ({result.wrongCount})
              </button>
              <button className={reviewFilter === "correct" ? "active" : ""} onClick={() => setReviewFilter("correct")}>
                Correct ({result.correctCount})
              </button>
              <button className={reviewFilter === "skipped" ? "active" : ""} onClick={() => setReviewFilter("skipped")}>
                Skipped ({result.unansweredCount})
              </button>
            </div>
          </div>
        </div>

        {filteredReview.map((r, i) => (
          <div
            key={r.id}
            className="q-card"
            style={{
              borderColor: r.isCorrect ? "#a6f4c5" : r.picked === null ? "#e5e7eb" : "#fecaca",
              background: r.isCorrect ? "#fcfffd" : r.picked === null ? "#fff" : "#fffcfc",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
              <span className="qn">Question {i + 1}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: r.isCorrect ? "#ecfdf3" : r.picked === null ? "#f2f4f7" : "#fef2f2",
                  color: r.isCorrect ? "#067647" : r.picked === null ? "#475467" : "#b42318",
                }}
              >
                {r.isCorrect ? "✓ Correct" : r.picked === null ? "— Not Attempted" : "✗ Incorrect"}
              </span>
            </div>

            <strong style={{ fontSize: 16, display: "block", marginBottom: 12, color: "#111827" }}>
              {r.q_text}
            </strong>

            <div style={{ display: "grid", gap: 7 }}>
              {r.options.map((opt, idx) => {
                const isSelected = r.picked === idx;
                const isCorrectOption = r.correct === idx;
                let optStyle = {
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  color: "#344054",
                  fontWeight: 400,
                };
                if (isCorrectOption) {
                  optStyle = {
                    border: "1.5px solid #12b76a",
                    background: "#ecfdf3",
                    color: "#067647",
                    fontWeight: 700,
                  };
                } else if (isSelected && !r.isCorrect) {
                  optStyle = {
                    border: "1.5px solid #e5484d",
                    background: "#fef2f2",
                    color: "#b42318",
                    fontWeight: 700,
                  };
                }

                return (
                  <div
                    key={idx}
                    style={{
                      ...optStyle,
                      padding: "10px 14px",
                      borderRadius: 10,
                      fontSize: 14.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 12,
                        fontWeight: 800,
                        background: isCorrectOption ? "#067647" : isSelected ? "#b42318" : "#f2f4f7",
                        color: isCorrectOption || isSelected ? "#fff" : "#475467",
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                    {isCorrectOption && <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700 }}>✓ Correct Answer</span>}
                    {isSelected && !isCorrectOption && <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700 }}>✗ Your Choice</span>}
                  </div>
                );
              })}
            </div>

            {r.explanation ? (
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  💡 Step-by-Step Explanation
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#334155", lineHeight: 1.5 }}>
                  {r.explanation}
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  // ============ TEST RUNNING SCREEN ============
  return (
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      {/* Sticky Header with Timer & Quick Counters */}
      <div
        className={"timer-bar" + (secondsLeft < 120 ? " warn" : "")}
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          marginBottom: 20,
        }}
      >
        <div>
          <strong style={{ fontSize: 17 }}>{title}</strong>
          <div className="small" style={{ color: "#aab1bf", marginTop: 2 }}>
            <span style={{ color: "#10b981", fontWeight: 700 }}>{answeredCount}</span>/{questions.length} Answered
            {flaggedCount > 0 && (
              <span style={{ color: "#f59e0b", marginLeft: 10, fontWeight: 700 }}>
                · {flaggedCount} Flagged
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="time" style={{ letterSpacing: 1 }}>
            ⏱ {mm}:{ss}
          </div>
          <div className="small" style={{ color: secondsLeft < 120 ? "#ff8a32" : "#aab1bf" }}>
            {secondsLeft < 120 ? "⚠️ Submitting automatically soon" : "Time Remaining"}
          </div>
        </div>
      </div>

      {/* Progress Bar for Time */}
      <div
        style={{
          height: 4,
          background: "#e5e7eb",
          borderRadius: 4,
          overflow: "hidden",
          marginTop: -14,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${timeProgressPct}%`,
            background: secondsLeft < 120 ? "#e5484d" : "var(--primary)",
            transition: "width 1s linear",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
        {/* Questions Column */}
        <div>
          {questions.map((q, i) => {
            const isAnswered = typeof answers[q.id] === "number";
            const isFlag = !!flagged[q.id];

            return (
              <div
                key={q.id}
                id={`q-card-${q.id}`}
                className="q-card"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: isFlag ? "#f59e0b" : isAnswered ? "var(--green)" : "var(--border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div className="qn">Question {i + 1} of {questions.length}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => toggleFlag(q.id)}
                      className="status-btn"
                      style={{
                        background: isFlag ? "#fffbeb" : "#fff",
                        color: isFlag ? "#b45309" : "#667085",
                        borderColor: isFlag ? "#fcd34d" : "#ddd",
                        fontWeight: 700,
                      }}
                      title="Flag question to review before submitting"
                    >
                      {isFlag ? "★ Flagged" : "☆ Flag"}
                    </button>
                    {isAnswered && (
                      <button
                        type="button"
                        onClick={() => clearAnswer(q.id)}
                        className="status-btn"
                        style={{ color: "#667085" }}
                        title="Clear chosen answer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <strong style={{ fontSize: 16.5, display: "block", color: "#111827", lineHeight: 1.4 }}>
                  {q.q_text}
                </strong>

                <div style={{ marginTop: 14 }}>
                  {q.options.map((opt, idx) => {
                    const isSelected = answers[q.id] === idx;
                    return (
                      <label
                        key={idx}
                        className={"opt" + (isSelected ? " sel" : "")}
                        style={{
                          userSelect: "none",
                        }}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={isSelected}
                          onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                        />
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              background: isSelected ? "var(--primary)" : "#f2f4f7",
                              color: isSelected ? "#fff" : "#475467",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 11.5,
                              fontWeight: 800,
                            }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {error && <div className="form-error" style={{ marginBottom: 14 }}>{error}</div>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <button
              className="btn btn-primary"
              style={{ padding: "14px 34px", fontSize: 16 }}
              onClick={() => submit(false)}
              disabled={submitting}
            >
              {submitting ? "Evaluating test…" : `Submit Test (${answeredCount}/${questions.length})`}
            </button>
            <span className="small muted">
              {questions.length - answeredCount > 0
                ? `${questions.length - answeredCount} unanswered questions remaining`
                : "All questions answered! Ready to submit."}
            </span>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <aside
          className="card"
          style={{
            position: "sticky",
            top: 96,
            padding: 18,
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ fontSize: 15, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
            <span>Question Palette</span>
            <span className="small muted">{questions.length} total</span>
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 7,
              marginBottom: 16,
            }}
          >
            {questions.map((q, idx) => {
              const isAnswered = typeof answers[q.id] === "number";
              const isFlag = !!flagged[q.id];

              let bg = "#f2f4f7";
              let color = "#344054";
              let border = "1px solid #e5e7eb";

              if (isFlag) {
                bg = "#fef3c7";
                color = "#92400e";
                border = "1.5px solid #f59e0b";
              } else if (isAnswered) {
                bg = "#ecfdf3";
                color = "#027a48";
                border = "1.5px solid #12b76a";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToQuestion(q.id)}
                  style={{
                    background: bg,
                    color,
                    border,
                    borderRadius: 8,
                    height: 38,
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    transition: "transform 0.1s ease",
                  }}
                  title={`Jump to Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div style={{ fontSize: 12, display: "grid", gap: 6, color: "#475467", borderTop: "1px solid #eee", paddingTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "#ecfdf3", border: "1px solid #12b76a" }} />
              <span>Answered ({answeredCount})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "#fef3c7", border: "1px solid #f59e0b" }} />
              <span>Flagged for review ({flaggedCount})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f2f4f7", border: "1px solid #e5e7eb" }} />
              <span>Unanswered ({questions.length - answeredCount})</span>
            </div>
          </div>

          <div style={{ marginTop: 18, borderTop: "1px solid #eee", paddingTop: 14 }}>
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "10px", fontSize: 14 }}
              onClick={() => submit(false)}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Test"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
