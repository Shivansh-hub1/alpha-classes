"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MaterialsUpload() {
  const router = useRouter();
  const [kind, setKind] = useState<"pdf" | "link">("pdf");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("test-series");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone("");
    if (kind === "pdf" && file && file.size > 4 * 1024 * 1024) {
      setError("This PDF is larger than 4 MB. Use the Google Drive link option for big files.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.set("title", title);
      form.set("category", category);
      form.set("description", description);
      if (kind === "pdf" && file) form.set("file", file);
      if (kind === "link") form.set("url", url);
      const res = await fetch("/api/admin/materials", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setDone(`✓ "${title}" is now live on the Free Materials page.`);
      setTitle("");
      setDescription("");
      setUrl("");
      setFile(null);
      (document.getElementById("mat-file") as HTMLInputElement | null)?.value !== undefined &&
        ((document.getElementById("mat-file") as HTMLInputElement).value = "");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={submit} style={{ maxWidth: 620 }}>
      <div className="admin-tabs" style={{ margin: "0 0 4px" }}>
        <button type="button" className={kind === "pdf" ? "active" : ""} onClick={() => setKind("pdf")}>📄 Upload PDF</button>
        <button type="button" className={kind === "link" ? "active" : ""} onClick={() => setKind("link")}>🔗 Google Drive Link</button>
      </div>

      <div>
        <label htmlFor="mat-title">Title *</label>
        <input id="mat-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder={kind === "pdf" ? "e.g. JEE Main Mock Test 1 (PDF)" : "e.g. NCERT Physics Class 11 — Full Book"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label htmlFor="mat-cat">Category *</label>
          <select id="mat-cat" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="test-series">Test Series</option>
            <option value="book">Book</option>
            <option value="notes">Notes</option>
          </select>
        </div>
        {kind === "pdf" ? (
          <div>
            <label htmlFor="mat-file">PDF file (max 4 MB) *</label>
            <input id="mat-file" className="input" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
          </div>
        ) : (
          <div>
            <label htmlFor="mat-url">Link (https://) *</label>
            <input id="mat-url" className="input" value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://drive.google.com/…" />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="mat-desc">Description (optional)</label>
        <input id="mat-desc" className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description students will see" />
      </div>

      {error && <div className="form-error">{error}</div>}
      {done && <div className="form-success">{done}</div>}
      <div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Uploading…" : kind === "pdf" ? "Upload Material" : "Add Link"}
        </button>
      </div>
    </form>
  );
}
