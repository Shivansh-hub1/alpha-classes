"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuestionInput = {
  q_text: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
};

const EMPTY_QUESTION: QuestionInput = {
  q_text: "",
  options: ["", "", "", ""],
  correct: 0,
  explanation: "",
};

export default function TestCreator({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Foundation");
  const [durationMin, setDurationMin] = useState(15);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([
    {
      q_text: "",
      options: ["", "", "", ""],
      correct: 0,
      explanation: "",
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  }

  function updateQuestion(index: number, field: keyof QuestionInput, val: unknown) {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  }

  function updateOption(qIdx: number, optIdx: number, text: string) {
    setQuestions((prev) => {
      const copy = [...prev];
      const opts = [...copy[qIdx].options] as [string, string, string, string];
      opts[optIdx] = text;
      copy[qIdx] = { ...copy[qIdx], options: opts };
      return copy;
    });
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, { ...EMPTY_QUESTION, options: ["", "", "", ""] }]);
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (title.trim().length < 3) {
      setError("Please enter a valid test title (at least 3 characters).");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a short description for students.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.q_text.trim()) {
        setError(`Question #${i + 1} has empty question text.`);
        return;
      }
      for (let o = 0; o < 4; o++) {
        if (!q.options[o].trim()) {
          setError(`Question #${i + 1} is missing Option ${String.fromCharCode(65 + o)}.`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          category,
          duration_min: Number(durationMin),
          description: description.trim(),
          questions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create test.");

      setSuccess(`✓ Test "${title}" created successfully with ${questions.length} questions!`);
      setTitle("");
      setSlug("");
      setDescription("");
      setQuestions([{ ...EMPTY_QUESTION, options: ["", "", "", ""] }]);
      if (onCreated) onCreated();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create test.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={submit} style={{ maxWidth: 780 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
        <div>
          <label htmlFor="t-title">Test Title *</label>
          <input
            id="t-title"
            className="input"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="e.g. Class 10 Science Chapter 2 Mock"
          />
        </div>
        <div>
          <label htmlFor="t-slug">URL Slug *</label>
          <input
            id="t-slug"
            className="input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="e.g. class-10-science-ch2"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label htmlFor="t-cat">Category / Course *</label>
          <select
            id="t-cat"
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Foundation">Class 9–10 Foundation</option>
            <option value="JEE Main">JEE Main / Advanced</option>
            <option value="NEET">NEET Medical</option>
            <option value="SSC">SSC / Govt Exams</option>
            <option value="Skills">Computer & Career Skills</option>
            <option value="General">General Knowledge / Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="t-dur">Duration (Minutes) *</label>
          <input
            id="t-dur"
            className="input"
            type="number"
            min={1}
            max={180}
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="t-desc">Short Description *</label>
        <textarea
          id="t-desc"
          className="input"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="What topics are covered in this test?"
        />
      </div>

      {/* Dynamic Questions Builder */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h4 style={{ fontSize: 16 }}>Test Questions ({questions.length})</h4>
          <button type="button" className="btn btn-outline" onClick={addQuestion} style={{ padding: "6px 12px", fontSize: 13 }}>
            + Add Another Question
          </button>
        </div>

        {questions.map((q, qIdx) => (
          <div
            key={qIdx}
            style={{
              padding: 18,
              border: "1px solid var(--border)",
              borderRadius: 14,
              marginBottom: 16,
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <strong style={{ fontSize: 14, color: "var(--primary)" }}>Question #{qIdx + 1}</strong>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIdx)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#b42318",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✕ Remove
                </button>
              )}
            </div>

            <div style={{ marginBottom: 10 }}>
              <input
                className="input"
                style={{ background: "#fff" }}
                value={q.q_text}
                onChange={(e) => updateQuestion(qIdx, "q_text", e.target.value)}
                placeholder={`Type Question #${qIdx + 1} here…`}
                required
              />
            </div>

            {/* 4 Options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[0, 1, 2, 3].map((optIdx) => (
                <div key={optIdx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.correct === optIdx}
                    onChange={() => updateQuestion(qIdx, "correct", optIdx)}
                    title={`Mark option ${String.fromCharCode(65 + optIdx)} as correct`}
                  />
                  <input
                    className="input"
                    style={{
                      background: q.correct === optIdx ? "#ecfdf3" : "#fff",
                      borderColor: q.correct === optIdx ? "#12b76a" : "#ddd",
                    }}
                    value={q.options[optIdx]}
                    onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)} ${q.correct === optIdx ? "(Correct Answer)" : ""}`}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div>
              <input
                className="input"
                style={{ background: "#fff", fontSize: 13 }}
                value={q.explanation}
                onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                placeholder="Step-by-step solution / explanation (shown to students in review)"
              />
            </div>
          </div>
        ))}
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving & Publishing Test…" : "Publish New Test"}
        </button>
        <button type="button" className="btn btn-outline" onClick={addQuestion}>
          + Add Question
        </button>
      </div>
    </form>
  );
}
