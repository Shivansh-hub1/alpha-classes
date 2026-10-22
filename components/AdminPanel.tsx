"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MaterialsUpload from "@/components/MaterialsUpload";
import TestCreator from "@/components/TestCreator";
import BatchManager from "@/components/BatchManager";
import BlogManager from "@/components/BlogManager";
import type { Test, Course, Blog, Material, StudentWithCourses } from "@/lib/db";

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  course: string | null;
};

export type ResultRow = {
  id: number;
  student: string;
  test: string;
  score: number;
  total: number;
  created_at: string;
};

export type AdminData = {
  enquiries: Enquiry[];
  students: StudentWithCourses[];
  results: ResultRow[];
  materials: Material[];
  tests: Test[];
  courses: Course[];
  blogs: Blog[];
};

const STATUSES = ["new", "contacted", "joined", "closed"] as const;

export default function AdminPanel({ data }: { data: AdminData }) {
  const router = useRouter();
  const [tab, setTab] = useState<
    "enquiries" | "batches" | "tests" | "materials" | "students" | "blogs" | "results"
  >("enquiries");
  const [busy, setBusy] = useState<number | string | null>(null);
  const [grantSelected, setGrantSelected] = useState<Record<number, number>>({});

  async function setStatus(id: number, status: string) {
    setBusy(id);
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  async function deleteMaterial(id: number) {
    if (!confirm("Delete this material? Students will no longer see it.")) return;
    setBusy(id);
    await fetch(`/api/admin/materials/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  async function deleteTestItem(id: number, title: string) {
    if (!confirm(`Are you sure you want to delete test "${title}"? This cannot be undone.`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/tests/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Failed to delete test.");
      }
    } catch {
      alert("Failed to delete test.");
    } finally {
      setBusy(null);
      router.refresh();
    }
  }

  async function handleGrantAccess(studentId: number) {
    const courseId = grantSelected[studentId] || data.courses[0]?.id;
    if (!courseId) return;

    setBusy(`grant-${studentId}`);
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      });
      if (!res.ok) throw new Error("Failed to grant access.");
      router.refresh();
    } catch (e: any) {
      alert(e?.message || "Failed to grant access.");
    } finally {
      setBusy(null);
    }
  }

  async function handleRevokeAccess(studentId: number, courseId: number, courseTitle: string) {
    if (!confirm(`Revoke access to "${courseTitle}" from this student?`)) return;
    setBusy(`revoke-${studentId}-${courseId}`);
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      });
      if (!res.ok) throw new Error("Failed to revoke access.");
      router.refresh();
    } catch (e: any) {
      alert(e?.message || "Failed to revoke access.");
    } finally {
      setBusy(null);
    }
  }

  const counts = { new: data.enquiries.filter((e) => e.status === "new").length };

  return (
    <div>
      <div className="admin-tabs">
        <button
          type="button"
          className={tab === "enquiries" ? "active" : ""}
          onClick={() => setTab("enquiries")}
        >
          <span>Enquiries</span>
          <span className={`tab-badge ${counts.new > 0 ? "badge-new" : ""}`}>
            {data.enquiries.length}{counts.new > 0 ? ` (${counts.new} new)` : ""}
          </span>
        </button>
        <button
          type="button"
          className={tab === "batches" ? "active" : ""}
          onClick={() => setTab("batches")}
        >
          <span>Batches & Prices</span>
          <span className="tab-badge">{data.courses.length}</span>
        </button>
        <button
          type="button"
          className={tab === "tests" ? "active" : ""}
          onClick={() => setTab("tests")}
        >
          <span>Tests & Add Test</span>
          <span className="tab-badge">{data.tests.length}</span>
        </button>
        <button
          type="button"
          className={tab === "materials" ? "active" : ""}
          onClick={() => setTab("materials")}
        >
          <span>Materials (Free & Batches)</span>
          <span className="tab-badge">{data.materials.length}</span>
        </button>
        <button
          type="button"
          className={tab === "students" ? "active" : ""}
          onClick={() => setTab("students")}
        >
          <span>Students & Batch Access</span>
          <span className="tab-badge">{data.students.length}</span>
        </button>
        <button
          type="button"
          className={tab === "blogs" ? "active" : ""}
          onClick={() => setTab("blogs")}
        >
          <span>SEO Blogs</span>
          <span className="tab-badge">{data.blogs.length}</span>
        </button>
        <button
          type="button"
          className={tab === "results" ? "active" : ""}
          onClick={() => setTab("results")}
        >
          <span>Test Results</span>
          <span className="tab-badge">{data.results.length}</span>
        </button>
      </div>

      {/* Batches & Prices Tab */}
      {tab === "batches" && (
        <BatchManager courses={data.courses} onUpdated={() => router.refresh()} />
      )}

      {/* SEO Blogs Tab */}
      {tab === "blogs" && (
        <BlogManager blogs={data.blogs} onUpdated={() => router.refresh()} />
      )}

      {/* Tests & Add Test Tab */}
      {tab === "tests" && (
        <div>
          <h3 style={{ fontSize: 20, marginBottom: 14 }}>Create & Add New Test</h3>
          <p className="muted" style={{ marginBottom: 18, fontSize: 14 }}>
            Create chapter-wise mock tests with multiple choice questions and step-by-step solutions for students.
          </p>
          <TestCreator onCreated={() => router.refresh()} />

          <h3 style={{ fontSize: 20, margin: "36px 0 14px" }}>Published Tests ({data.tests.length})</h3>
          {data.tests.length === 0 ? (
            <p className="muted">No tests published yet. Create your first test above.</p>
          ) : (
            <div className="table-card">
              <table className="data">
                <thead>
                  <tr>
                    <th>Test Title / Slug</th>
                    <th>Category</th>
                    <th>Questions</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tests.map((t) => (
                    <tr key={t.id} style={{ opacity: busy === t.id ? 0.5 : 1 }}>
                      <td>
                        <b>{t.title}</b>
                        <br />
                        <span className="small muted">/tests/{t.slug}</span>
                      </td>
                      <td>
                        <span className="tag new">{t.category || "General"}</span>
                      </td>
                      <td>{t.question_count} Qs</td>
                      <td>{t.duration_min} min</td>
                      <td>
                        <a
                          className="status-btn"
                          href={`/tests/${t.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "var(--primary)", textDecoration: "none" }}
                        >
                          Preview
                        </a>
                        <button
                          type="button"
                          className="status-btn"
                          onClick={() => deleteTestItem(t.id, t.title)}
                          disabled={busy === t.id}
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
          )}
        </div>
      )}

      {/* Materials Tab */}
      {tab === "materials" && (
        <div>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Upload New Material (Free or Batch Locked)</h3>
          <MaterialsUpload courses={data.courses} />

          <h3 style={{ fontSize: 18, margin: "28px 0 12px" }}>Published Study Materials</h3>
          {data.materials.length === 0 ? (
            <p className="muted">No materials yet — upload the first one above.</p>
          ) : (
            <div className="table-card">
              <table className="data">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Destination</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Downloads</th>
                    <th>Added</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.materials.map((m) => (
                    <tr key={m.id} style={{ opacity: busy === m.id ? 0.5 : 1 }}>
                      <td>
                        <b>{m.title}</b>
                        {m.description ? (
                          <>
                            <br />
                            <span className="small muted">{m.description}</span>
                          </>
                        ) : null}
                      </td>
                      <td>
                        {m.course_title ? (
                          <span className="tag joined" title="Locked to students in this batch">
                            🔒 {m.course_title}
                          </span>
                        ) : (
                          <span className="tag new" title="Public for all students">
                            🌐 Free / Public
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="tag new">{m.category}</span>
                      </td>
                      <td className="small">
                        {m.kind === "pdf" ? `📄 PDF · ${m.file_name || ""}` : "🔗 Link"}
                      </td>
                      <td>{m.downloads}</td>
                      <td className="small muted">
                        {new Date(m.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="status-btn"
                          onClick={() => deleteMaterial(m.id)}
                          disabled={busy === m.id}
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
          )}
        </div>
      )}

      {/* Enquiries Tab */}
      {tab === "enquiries" &&
        (data.enquiries.length === 0 ? (
          <p className="muted">No enquiries yet.</p>
        ) : (
          <div className="table-card">
            <table className="data">
              <thead>
                <tr>
                  <th>Name / Contact</th>
                  <th>Course</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {data.enquiries.map((e) => (
                  <tr key={e.id} style={{ opacity: busy === e.id ? 0.5 : 1 }}>
                    <td>
                      <b style={{ color: "#111827", fontSize: 14.5 }}>{e.name}</b>
                      <div className="small muted" style={{ marginTop: 4, lineHeight: 1.6 }}>
                        <a href={`mailto:${e.email}`} style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 2 }}>
                          {e.email}
                        </a>
                        <br />
                        <a href={`tel:${e.phone}`} style={{ color: "var(--primary)", fontWeight: 700 }}>
                          📞 {e.phone}
                        </a>
                      </div>
                    </td>
                    <td className="small" style={{ fontWeight: 600 }}>{e.course || "—"}</td>
                    <td className="small" style={{ maxWidth: 220, color: "#475467" }}>
                      {e.message || "—"}
                    </td>
                    <td>
                      <span className={`tag ${e.status}`}>{e.status}</span>
                      <div className="status-actions">
                        {STATUSES.filter((s) => s !== e.status).map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="status-btn"
                            onClick={() => setStatus(e.id, s)}
                            disabled={busy === e.id}
                            title={`Mark enquiry status as ${s}`}
                          >
                            → {s}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="small muted">
                      {new Date(e.created_at).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* Students & Batch Access Tab */}
      {tab === "students" &&
        (data.students.length === 0 ? (
          <p className="muted">No registered students yet.</p>
        ) : (
          <div>
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 18 }}>Student Accounts & Batch Access Control</h3>
              <p className="small muted">
                Grant or revoke student access to any coaching batch with a single click. Enrolled students gain immediate access to batch materials and test resources.
              </p>
            </div>
            <div className="table-card">
              <table className="data">
                <thead>
                  <tr>
                    <th>Student Name & Contact</th>
                    <th>Enrolled Batches</th>
                    <th>Grant Batch Access</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <b style={{ color: "#111827", fontSize: 14.5 }}>{s.name}</b>
                        <div className="small muted" style={{ marginTop: 3 }}>
                          <a href={`mailto:${s.email}`} style={{ color: "inherit", textDecoration: "underline" }}>
                            {s.email}
                          </a>
                          {s.phone ? (
                            <>
                              <br />
                              <a href={`tel:${s.phone}`} style={{ color: "var(--primary)", fontWeight: 600 }}>
                                📞 {s.phone}
                              </a>
                            </>
                          ) : null}
                        </div>
                      </td>
                      <td style={{ minWidth: 220 }}>
                        {s.courses.length === 0 ? (
                          <span className="small muted">No active batches</span>
                        ) : (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {s.courses.map((c) => (
                              <span
                                key={c.id}
                                className="tag joined"
                                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                              >
                                <span>{c.title}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRevokeAccess(s.id, c.id, c.title)}
                                  disabled={busy === `revoke-${s.id}-${c.id}`}
                                  title={`Revoke access to ${c.title}`}
                                  style={{
                                    border: "none",
                                    background: "none",
                                    color: "#b42318",
                                    cursor: "pointer",
                                    fontWeight: 900,
                                    fontSize: 12,
                                    padding: "0 2px",
                                  }}
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <select
                            className="input"
                            style={{ padding: "6px 10px", fontSize: 13, width: "auto" }}
                            value={grantSelected[s.id] || (data.courses[0]?.id ?? "")}
                            onChange={(e) =>
                              setGrantSelected({ ...grantSelected, [s.id]: Number(e.target.value) })
                            }
                          >
                            {data.courses.map((c) => {
                              const alreadyHas = s.courses.some((sc) => sc.id === c.id);
                              return (
                                <option key={c.id} value={c.id} disabled={alreadyHas}>
                                  {c.title} {alreadyHas ? "(Active)" : `(₹${c.price})`}
                                </option>
                              );
                            })}
                          </select>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: "6px 12px", fontSize: 12.5 }}
                            onClick={() => handleGrantAccess(s.id)}
                            disabled={busy === `grant-${s.id}`}
                          >
                            + Grant
                          </button>
                        </div>
                      </td>
                      <td className="small muted">
                        {new Date(s.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      {/* Results Tab */}
      {tab === "results" &&
        (data.results.length === 0 ? (
          <p className="muted">No test results yet.</p>
        ) : (
          <div className="table-card">
            <table className="data">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Test</th>
                  <th>Score</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((r) => {
                  const pct = Math.round((r.score / r.total) * 100);
                  const cls = pct >= 70 ? "good" : pct >= 40 ? "mid" : "bad";
                  return (
                    <tr key={r.id}>
                      <td>
                        <b style={{ color: "#111827" }}>{r.student}</b>
                      </td>
                      <td style={{ fontWeight: 600 }}>{r.test}</td>
                      <td>
                        <span className={`score-chip ${cls}`}>
                          {r.score}/{r.total} ({pct}%)
                        </span>
                      </td>
                      <td className="small muted">
                        {new Date(r.created_at).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
