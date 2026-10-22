"use client";

import { useState } from "react";
import Link from "next/link";
import type { Test } from "@/lib/db";

export default function TestsList({ tests }: { tests: Test[] }) {
  const [selectedCat, setSelectedCat] = useState("all");
  const [query, setQuery] = useState("");

  const categories = ["all", ...Array.from(new Set(tests.map((t) => t.category || "General")))];

  const filtered = tests.filter((t) => {
    const matchesCat = selectedCat === "all" || (t.category || "General").toLowerCase() === selectedCat.toLowerCase();
    const matchesQuery =
      !query.trim() ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div>
      {/* Search & Filter Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div className="admin-tabs" style={{ margin: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCat === cat ? "active" : ""}
              onClick={() => setSelectedCat(cat)}
            >
              {cat === "all" ? "All Tests" : cat}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 280, width: "100%" }}>
          <input
            className="input"
            type="search"
            placeholder="Search test series…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: "9px 14px", fontSize: 14 }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 36, textAlign: "center" }}>
          <p className="muted" style={{ fontSize: 16 }}>
            No tests found matching your search. Try a different keyword or category.
          </p>
          <button
            className="btn btn-outline"
            style={{ marginTop: 12 }}
            onClick={() => {
              setSelectedCat("all");
              setQuery("");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((t) => (
            <article key={t.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="card-top"
                style={{
                  height: 110,
                  background: "linear-gradient(135deg, #fff7ed, #fff)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="icon">🧪</div>
                <span className="level" style={{ background: "#fff", borderColor: "#ffd7b5", color: "#d95100" }}>
                  {t.category || "Online Mock"}
                </span>
              </div>
              <div className="card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{t.title}</h3>
                <p style={{ flex: 1, color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
                  {t.description}
                </p>
                <div className="meta" style={{ marginBottom: 16, paddingTop: 10, borderTop: "1px solid #f2f2f3" }}>
                  <span>📝 {t.question_count} Questions</span>
                  <span>⏱ {t.duration_min} Minutes</span>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>Free</span>
                </div>
                <Link
                  className="btn btn-primary"
                  href={`/tests/${t.slug}`}
                  style={{ textAlign: "center", width: "100%" }}
                >
                  Start Test Now →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
