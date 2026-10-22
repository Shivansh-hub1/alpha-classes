"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/lib/db";

export default function BatchManager({
  courses,
  onUpdated,
}: {
  courses: Course[];
  onUpdated?: () => void;
}) {
  const router = useRouter();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [busy, setBusy] = useState<number | string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New batch form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [level, setLevel] = useState("Foundation");
  const [icon, setIcon] = useState("📚");
  const [price, setPrice] = useState(699);
  const [classesCount, setClassesCount] = useState(100);
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState(
    "NCERT-focused theory|Weekly chapter mock tests|1-on-1 doubt clearing|PDF notes & formula book"
  );

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
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          level,
          icon,
          price: Number(price),
          classes_count: Number(classesCount),
          description,
          highlights,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create batch.");

      setSuccess(`✓ Batch "${title}" created successfully!`);
      setTitle("");
      setSlug("");
      setDescription("");
      setShowAddForm(false);
      if (onUpdated) onUpdated();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to create batch.");
    } finally {
      setBusy(null);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCourse) return;
    setError("");
    setSuccess("");
    setBusy(editingCourse.id);

    try {
      const res = await fetch(`/api/admin/courses/${editingCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingCourse.title,
          price: Number(editingCourse.price),
          level: editingCourse.level,
          classes_count: Number(editingCourse.classes_count),
          description: editingCourse.description,
          highlights: editingCourse.highlights,
          icon: editingCourse.icon,
          featured: editingCourse.featured,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update batch.");

      setSuccess(`✓ Batch "${editingCourse.title}" updated successfully!`);
      setEditingCourse(null);
      if (onUpdated) onUpdated();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to update batch.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Are you sure you want to delete batch "${title}"? Enrolled students will lose access.`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete batch.");
      setSuccess(`✓ Batch "${title}" deleted.`);
      if (onUpdated) onUpdated();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to delete batch.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 20 }}>Manage Batches & Course Pricing</h3>
          <p className="small muted">Add new coaching programs, edit batch descriptions, or update admission fees.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: "8px 16px", fontSize: 13.5 }}
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingCourse(null);
          }}
        >
          {showAddForm ? "Cancel" : "+ Add New Batch"}
        </button>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="form-success" style={{ marginBottom: 16 }}>{success}</div>}

      {/* Add New Batch Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="form" style={{ padding: 22, border: "1px solid var(--border)", borderRadius: 16, background: "#fafbfc", marginBottom: 26 }}>
          <h4 style={{ fontSize: 16, color: "var(--primary)" }}>Create New Coaching Batch</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
            <div>
              <label>Batch / Course Title *</label>
              <input className="input" value={title} onChange={(e) => handleTitleChange(e.target.value)} required placeholder="e.g. Class 10 Board Crash Course" />
            </div>
            <div>
              <label>URL Slug *</label>
              <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="e.g. class-10-crash-course" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label>Category / Level *</label>
              <select className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="Foundation">Foundation (Class 9-10)</option>
                <option value="Competitive">JEE Main / Adv</option>
                <option value="Medical">NEET UG</option>
                <option value="Govt Exams">SSC / Railways</option>
                <option value="Technology">Web & Coding</option>
                <option value="Skills">Computer Skills</option>
              </select>
            </div>
            <div>
              <label>Icon Emoji</label>
              <input className="input" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="📚" />
            </div>
            <div>
              <label>Admission Fee (₹) *</label>
              <input className="input" type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
            </div>
            <div>
              <label>Classes Count *</label>
              <input className="input" type="number" min={1} value={classesCount} onChange={(e) => setClassesCount(Number(e.target.value))} required />
            </div>
          </div>

          <div>
            <label>Course Overview Description *</label>
            <textarea className="input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Comprehensive curriculum description for students and parents..." />
          </div>

          <div>
            <label>Features / Highlights (separate with &apos;|&apos; pipe)</label>
            <input className="input" value={highlights} onChange={(e) => setHighlights(e.target.value)} placeholder="Live classes|Mock test series|Daily doubt solving" />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={busy === "create"}>
              {busy === "create" ? "Saving Batch…" : "Publish New Batch"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Edit Modal / Drawer */}
      {editingCourse && (
        <form onSubmit={handleUpdate} className="form" style={{ padding: 22, border: "2px solid var(--primary)", borderRadius: 16, background: "#fff", marginBottom: 26, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ fontSize: 16, color: "var(--primary)" }}>Editing Batch: {editingCourse.title}</h4>
            <button type="button" onClick={() => setEditingCourse(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
            <div>
              <label>Batch Title *</label>
              <input className="input" value={editingCourse.title} onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })} required />
            </div>
            <div>
              <label>Fee / Price (₹) *</label>
              <input
                className="input"
                type="number"
                min={0}
                style={{ fontWeight: 800, color: "var(--primary)", fontSize: 16 }}
                value={editingCourse.price}
                onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label>Level / Category</label>
              <input className="input" value={editingCourse.level} onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })} required />
            </div>
            <div>
              <label>Classes Count</label>
              <input className="input" type="number" value={editingCourse.classes_count} onChange={(e) => setEditingCourse({ ...editingCourse, classes_count: Number(e.target.value) })} required />
            </div>
            <div>
              <label>Featured on Homepage?</label>
              <select className="input" value={editingCourse.featured ? "yes" : "no"} onChange={(e) => setEditingCourse({ ...editingCourse, featured: e.target.value === "yes" })}>
                <option value="yes">Yes (Featured)</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div>
            <label>Description</label>
            <textarea className="input" rows={2} value={editingCourse.description} onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} required />
          </div>

          <div>
            <label>Highlights (separated by |)</label>
            <input className="input" value={editingCourse.highlights} onChange={(e) => setEditingCourse({ ...editingCourse, highlights: e.target.value })} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={busy === editingCourse.id}>
              {busy === editingCourse.id ? "Saving Changes…" : "Save Price & Details"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setEditingCourse(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Batches Table */}
      <div className="table-card">
        <table className="data">
          <thead>
            <tr>
              <th>Batch Title / Slug</th>
              <th>Category</th>
              <th>Classes</th>
              <th>Current Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} style={{ opacity: busy === c.id ? 0.5 : 1 }}>
                <td>
                  <span style={{ fontSize: 18, marginRight: 6 }}>{c.icon}</span>
                  <b style={{ color: "#111827" }}>{c.title}</b>
                  <br />
                  <span className="small muted">/courses/{c.slug}</span>
                </td>
                <td>
                  <span className="tag new">{c.level}</span>
                </td>
                <td>{c.classes_count} classes</td>
                <td>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "#111827" }}>
                    ₹{c.price.toLocaleString("en-IN")}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="status-btn"
                    onClick={() => {
                      setEditingCourse(c);
                      setShowAddForm(false);
                      window.scrollTo({ top: 180, behavior: "smooth" });
                    }}
                    style={{ color: "var(--primary)", borderColor: "var(--primary)" }}
                  >
                    ✏ Edit Price / Info
                  </button>
                  <a
                    className="status-btn"
                    href={`/courses/${c.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    className="status-btn"
                    onClick={() => handleDelete(c.id, c.title)}
                    disabled={busy === c.id}
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
