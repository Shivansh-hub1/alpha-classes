"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Blog } from "@/lib/db";

export default function BlogManager({
  blogs,
  onUpdated,
}: {
  blogs: Blog[];
  onUpdated?: () => void;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [busy, setBusy] = useState<number | string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Blog creation state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Coaching Guide");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("alpha classes,coaching in bikapur,best coaching in bikapur");
  const [readTime, setReadTime] = useState(4);

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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy("create");

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          category,
          excerpt,
          content,
          tags,
          read_time: Number(readTime),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish blog.");

      setSuccess(`✓ Blog "${title}" published successfully!`);
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setShowForm(false);
      if (onUpdated) onUpdated();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to publish blog.");
    } finally {
      setBusy(null);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBlog) return;
    setError("");
    setSuccess("");
    setBusy(editingBlog.id);

    try {
      const res = await fetch(`/api/admin/blogs/${editingBlog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingBlog.title,
          category: editingBlog.category,
          excerpt: editingBlog.excerpt,
          content: editingBlog.content,
          tags: editingBlog.tags,
          read_time: Number(editingBlog.read_time),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update blog.");

      setSuccess(`✓ Blog "${editingBlog.title}" updated successfully!`);
      setEditingBlog(null);
      if (onUpdated) onUpdated();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to update blog.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Are you sure you want to delete blog "${title}"?`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blog.");
      setSuccess(`✓ Blog "${title}" deleted.`);
      if (onUpdated) onUpdated();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to delete blog.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 20 }}>SEO Blogs & Articles</h3>
          <p className="small muted">Publish search engine optimized guides targeting Bikapur, Ayodhya & exams.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: "8px 16px", fontSize: 13.5 }}
          onClick={() => {
            setShowForm(!showForm);
            setEditingBlog(null);
          }}
        >
          {showForm ? "Cancel" : "+ Write New Blog"}
        </button>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="form-success" style={{ marginBottom: 16 }}>{success}</div>}

      {/* New Blog Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="form" style={{ padding: 22, border: "1px solid var(--border)", borderRadius: 16, background: "#fafbfc", marginBottom: 26 }}>
          <h4 style={{ fontSize: 16, color: "var(--primary)" }}>Write New SEO Article</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
            <div>
              <label>Article Title *</label>
              <input className="input" value={title} onChange={(e) => handleTitleChange(e.target.value)} required placeholder="e.g. 5 Reasons Why Alpha Classes is the Best in Bikapur" />
            </div>
            <div>
              <label>URL Slug *</label>
              <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="e.g. best-coaching-in-bikapur-reasons" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label>Category *</label>
              <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g. JEE Preparation / Board Exam" />
            </div>
            <div>
              <label>Read Time (Minutes)</label>
              <input className="input" type="number" min={1} value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} required />
            </div>
            <div>
              <label>SEO Tags (comma separated)</label>
              <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="alpha classes,bikapur,coaching" />
            </div>
          </div>

          <div>
            <label>SEO Excerpt / Summary (shown on Google snippet & blog feed) *</label>
            <textarea className="input" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required placeholder="Compelling 2-sentence summary of the article..." />
          </div>

          <div>
            <label>Article Content (supports Markdown ## Headings and bullet lists) *</label>
            <textarea className="input" rows={8} value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Write your full guide here. Use ## for section headings and - for bullet points." />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={busy === "create"}>
              {busy === "create" ? "Publishing…" : "Publish Blog Post"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Edit Blog Form */}
      {editingBlog && (
        <form onSubmit={handleUpdate} className="form" style={{ padding: 22, border: "2px solid var(--primary)", borderRadius: 16, background: "#fff", marginBottom: 26, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ fontSize: 16, color: "var(--primary)" }}>Editing: {editingBlog.title}</h4>
            <button type="button" onClick={() => setEditingBlog(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>

          <div>
            <label>Article Title *</label>
            <input className="input" value={editingBlog.title} onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label>Category</label>
              <input className="input" value={editingBlog.category} onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })} required />
            </div>
            <div>
              <label>Read Time (Min)</label>
              <input className="input" type="number" value={editingBlog.read_time} onChange={(e) => setEditingBlog({ ...editingBlog, read_time: Number(e.target.value) })} required />
            </div>
          </div>

          <div>
            <label>Excerpt / Meta Description</label>
            <textarea className="input" rows={2} value={editingBlog.excerpt} onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })} required />
          </div>

          <div>
            <label>Content</label>
            <textarea className="input" rows={8} value={editingBlog.content} onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })} required />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={busy === editingBlog.id}>
              {busy === editingBlog.id ? "Saving…" : "Save Changes"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setEditingBlog(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Blogs Table */}
      <div className="table-card">
        <table className="data">
          <thead>
            <tr>
              <th>Article Title / Slug</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr key={b.id} style={{ opacity: busy === b.id ? 0.5 : 1 }}>
                <td>
                  <b style={{ color: "#111827" }}>{b.title}</b>
                  <br />
                  <span className="small muted">/blog/{b.slug}</span>
                </td>
                <td>
                  <span className="tag new">{b.category}</span>
                </td>
                <td className="small">{b.author}</td>
                <td className="small muted">{new Date(b.created_at).toLocaleDateString("en-IN")}</td>
                <td>
                  <button
                    type="button"
                    className="status-btn"
                    onClick={() => {
                      setEditingBlog(b);
                      setShowForm(false);
                      window.scrollTo({ top: 180, behavior: "smooth" });
                    }}
                    style={{ color: "var(--primary)" }}
                  >
                    ✏ Edit
                  </button>
                  <a
                    className="status-btn"
                    href={`/blog/${b.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    className="status-btn"
                    onClick={() => handleDelete(b.id, b.title)}
                    disabled={busy === b.id}
                    style={{ color: "#b42318" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
