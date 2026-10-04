"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MaterialsUpload from "@/components/MaterialsUpload";

export type Enquiry = { id: number; name: string; email: string; phone: string; message: string; status: string; created_at: string; course: string | null };
export type Student = { id: number; name: string; email: string; phone: string; created_at: string };
export type ResultRow = { id: number; student: string; test: string; score: number; total: number; created_at: string };
export type MaterialRow = { id: number; title: string; category: string; kind: string; description: string; url: string | null; file_name: string | null; file_size: number | null; downloads: number; created_at: string };
export type AdminData = { enquiries: Enquiry[]; students: Student[]; results: ResultRow[]; materials: MaterialRow[] };

const STATUSES = ["new", "contacted", "joined", "closed"] as const;

export default function AdminPanel({ data }: { data: AdminData }) {
  const router = useRouter();
  const [tab, setTab] = useState<"enquiries" | "materials" | "students" | "results">("enquiries");
  const [busy, setBusy] = useState<number | null>(null);

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

  const counts = { new: data.enquiries.filter((e) => e.status === "new").length };

  return (
    <div>
      <div className="admin-tabs">
        <button className={tab === "enquiries" ? "active" : ""} onClick={() => setTab("enquiries")}>
          Enquiries ({data.enquiries.length}{counts.new > 0 ? ` · ${counts.new} new` : ""})
        </button>
        <button className={tab === "materials" ? "active" : ""} onClick={() => setTab("materials")}>Free Materials ({data.materials.length})</button>
        <button className={tab === "students" ? "active" : ""} onClick={() => setTab("students")}>Students ({data.students.length})</button>
        <button className={tab === "results" ? "active" : ""} onClick={() => setTab("results")}>Test Results ({data.results.length})</button>
      </div>

      {tab === "materials" && (
        <div>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Upload new material</h3>
          <MaterialsUpload />
          <h3 style={{ fontSize: 18, margin: "28px 0 12px" }}>Published materials</h3>
          {data.materials.length === 0 ? <p className="muted">No materials yet — upload the first one above.</p> :
          <table className="data">
            <thead><tr><th>Title</th><th>Category</th><th>Type</th><th>Downloads</th><th>Added</th><th></th></tr></thead>
            <tbody>
              {data.materials.map((m) => (
                <tr key={m.id} style={{ opacity: busy === m.id ? 0.5 : 1 }}>
                  <td><b>{m.title}</b>{m.description ? <><br /><span className="small muted">{m.description}</span></> : null}</td>
                  <td><span className="tag new">{m.category}</span></td>
                  <td className="small">{m.kind === "pdf" ? `📄 PDF · ${m.file_name || ""}` : "🔗 Link"}</td>
                  <td>{m.downloads}</td>
                  <td className="small muted">{new Date(m.created_at).toLocaleDateString("en-IN")}</td>
                  <td><button className="status-btn" onClick={() => deleteMaterial(m.id)} disabled={busy === m.id} style={{ color: "#b42318" }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>}
        </div>
      )}

      {tab === "enquiries" && (
        data.enquiries.length === 0 ? <p className="muted">No enquiries yet.</p> :
        <table className="data">
          <thead><tr><th>Name / Contact</th><th>Course</th><th>Message</th><th>Status</th><th>Received</th></tr></thead>
          <tbody>
            {data.enquiries.map((e) => (
              <tr key={e.id} style={{ opacity: busy === e.id ? 0.5 : 1 }}>
                <td><b>{e.name}</b><br /><span className="small muted">{e.email}<br />📞 {e.phone}</span></td>
                <td className="small">{e.course || "—"}</td>
                <td className="small" style={{ maxWidth: 220 }}>{e.message || "—"}</td>
                <td>
                  <span className={`tag ${e.status}`}>{e.status}</span>
                  <div style={{ marginTop: 6 }}>
                    {STATUSES.filter((s) => s !== e.status).map((s) => (
                      <button key={s} className="status-btn" onClick={() => setStatus(e.id, s)} disabled={busy === e.id}>{s}</button>
                    ))}
                  </div>
                </td>
                <td className="small muted">{new Date(e.created_at).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "students" && (
        data.students.length === 0 ? <p className="muted">No students yet.</p> :
        <table className="data">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
          <tbody>
            {data.students.map((s) => (
              <tr key={s.id}>
                <td><b>{s.name}</b></td>
                <td>{s.email}</td>
                <td>{s.phone || "—"}</td>
                <td className="small muted">{new Date(s.created_at).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "results" && (
        data.results.length === 0 ? <p className="muted">No test results yet.</p> :
        <table className="data">
          <thead><tr><th>Student</th><th>Test</th><th>Score</th><th>When</th></tr></thead>
          <tbody>
            {data.results.map((r) => {
              const pct = Math.round((r.score / r.total) * 100);
              const cls = pct >= 70 ? "good" : pct >= 40 ? "mid" : "bad";
              return (
                <tr key={r.id}>
                  <td><b>{r.student}</b></td>
                  <td>{r.test}</td>
                  <td><span className={`score-chip ${cls}`}>{r.score}/{r.total} ({pct}%)</span></td>
                  <td className="small muted">{new Date(r.created_at).toLocaleString("en-IN")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
