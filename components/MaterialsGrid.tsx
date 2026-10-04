"use client";

import { useState } from "react";
import type { Material } from "@/lib/db";

const CATS = [
  { id: "all", label: "All" },
  { id: "test-series", label: "Test Series" },
  { id: "book", label: "Books" },
  { id: "notes", label: "Notes" },
];

function fmtSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MaterialsGrid({ materials }: { materials: Material[] }) {
  const [cat, setCat] = useState("all");
  const shown = cat === "all" ? materials : materials.filter((m) => m.category === cat);

  return (
    <div>
      <div className="admin-tabs">
        {CATS.map((c) => (
          <button key={c.id} className={cat === c.id ? "active" : ""} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="card" style={{ padding: 28 }}>
          <p className="muted">No materials here yet — new PDFs and books will appear in this section. Check back soon!</p>
        </div>
      ) : (
        <div className="grid">
          {shown.map((m) => (
            <article key={m.id} className="card">
              <div className="card-top">
                <div className="icon">{m.category === "test-series" ? "📝" : m.category === "book" ? "📗" : "🗒️"}</div>
                <span className="level">{m.kind === "pdf" ? "PDF" : "Drive Link"}</span>
              </div>
              <div className="card-body">
                <h3>{m.title}</h3>
                <p>{m.description || "Free study material from Alpha Classes."}</p>
                <div className="meta" style={{ marginBottom: 14 }}>
                  <span>{m.kind === "pdf" ? `📄 ${fmtSize(m.file_size)} · ${m.downloads} downloads` : `🔗 ${m.downloads} opens`}</span>
                </div>
                {m.kind === "pdf" ? (
                  <a className="btn btn-primary" href={`/api/materials/${m.id}/download`}>⬇ Download PDF</a>
                ) : (
                  <a className="btn btn-primary" href={m.url || "#"} target="_blank" rel="noopener noreferrer">🔗 Open Link</a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
