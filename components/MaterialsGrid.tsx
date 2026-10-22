"use client";

import { useState } from "react";
import type { Material } from "@/lib/db";

const CATS = [
  { id: "all", label: "All Materials" },
  { id: "test-series", label: "Test Series PDFs" },
  { id: "book", label: "Books & PYQs" },
  { id: "notes", label: "Revision Notes" },
];

function fmtSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MaterialsGrid({ materials }: { materials: Material[] }) {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");

  const shown = materials.filter((m) => {
    const matchesCat = cat === "all" || m.category === cat;
    const matchesSearch =
      !search.trim() ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
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
          {CATS.map((c) => (
            <button key={c.id} className={cat === c.id ? "active" : ""} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 280, width: "100%" }}>
          <input
            className="input"
            type="search"
            placeholder="Search notes & PDFs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "9px 14px", fontSize: 14 }}
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card" style={{ padding: 36, textAlign: "center" }}>
          <p className="muted" style={{ fontSize: 16 }}>
            No materials found matching your search. New PDFs and books are uploaded regularly.
          </p>
          <button
            className="btn btn-outline"
            style={{ marginTop: 12 }}
            onClick={() => {
              setCat("all");
              setSearch("");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid">
          {shown.map((m) => (
            <article key={m.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div className="card-top">
                <div className="icon">
                  {m.category === "test-series" ? "📝" : m.category === "book" ? "📗" : "🗒️"}
                </div>
                <span className="level">
                  {m.kind === "pdf" ? "PDF Download" : "Drive Link"}
                </span>
              </div>
              <div className="card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{m.title}</h3>
                <p style={{ flex: 1, color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>
                  {m.description || "Free study material from Alpha Classes Bikapur."}
                </p>
                <div className="meta" style={{ marginBottom: 14, paddingTop: 8, borderTop: "1px solid #f2f2f3" }}>
                  <span>
                    {m.kind === "pdf"
                      ? `📄 ${fmtSize(m.file_size)} · 📥 ${m.downloads} downloads`
                      : `🔗 ${m.downloads} opens`}
                  </span>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>Free</span>
                </div>
                {m.kind === "pdf" ? (
                  <a
                    className="btn btn-primary"
                    href={`/api/materials/${m.id}/download`}
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    ⬇ Download PDF
                  </a>
                ) : (
                  <a
                    className="btn btn-primary"
                    href={m.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    🔗 Open Google Drive Resource
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
