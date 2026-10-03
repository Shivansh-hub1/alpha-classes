import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { pool, ensureDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
  robots: { index: false, follow: false },
};

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  await ensureDb();
  const enrolled = await pool.query<{ id: number; slug: string; title: string; icon: string; level: string }>(
    `SELECT c.id, c.slug, c.title, c.icon, c.level FROM enrollments e JOIN courses c ON c.id = e.course_id
     WHERE e.student_id = $1 ORDER BY e.created_at DESC`, [session.uid]
  );
  const results = await pool.query<{ id: number; title: string; score: number; total: number; created_at: string }>(
    `SELECT r.id, t.title, r.score, r.total, r.created_at FROM test_results r JOIN tests t ON t.id = r.test_id
     WHERE r.student_id = $1 ORDER BY r.created_at DESC LIMIT 20`, [session.uid]
  );

  const firstName = session.name.split(" ")[0];
  const bestPct = results.rows.length
    ? Math.max(...results.rows.map((r) => Math.round((r.score / r.total) * 100)))
    : null;

  return (
    <main className="container">
      <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Hi {firstName} 👋</h1>
          <p>Continue learning and track your progress.</p>
        </div>
        <LogoutButton />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, margin: "26px 0" }} className="stats-grid">
        <div className="stat-card"><strong>{enrolled.rows.length}</strong><span>Courses enrolled</span></div>
        <div className="stat-card"><strong>{results.rows.length}</strong><span>Tests attempted</span></div>
        <div className="stat-card"><strong>{bestPct === null ? "—" : bestPct + "%"}</strong><span>Best test score</span></div>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="section-head">
          <div><h2 style={{ fontSize: 24 }}>My Courses</h2></div>
          <Link href="/courses" style={{ color: "#f56600", fontWeight: 800 }}>Browse courses →</Link>
        </div>
        {enrolled.rows.length === 0 ? (
          <div className="card" style={{ padding: 26 }}>
            <p className="muted">You haven&apos;t enrolled in any course yet.</p>
            <Link className="btn btn-primary" href="/courses" style={{ marginTop: 12, display: "inline-block" }}>Explore Courses</Link>
          </div>
        ) : (
          <div className="grid">
            {enrolled.rows.map((c) => (
              <Link key={c.id} className="card" href={`/courses/${c.slug}`}>
                <div className="card-top"><div className="icon">{c.icon}</div><span className="level">{c.level}</span></div>
                <div className="card-body"><h3>{c.title}</h3><p>Continue learning →</p></div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="section-head">
          <div><h2 style={{ fontSize: 24 }}>My Test Results</h2></div>
          <Link href="/tests" style={{ color: "#f56600", fontWeight: 800 }}>Take a test →</Link>
        </div>
        {results.rows.length === 0 ? (
          <div className="card" style={{ padding: 26 }}>
            <p className="muted">No tests attempted yet. Try a free practice test!</p>
            <Link className="btn btn-primary" href="/tests" style={{ marginTop: 12, display: "inline-block" }}>Start a Test</Link>
          </div>
        ) : (
          <table className="data">
            <thead><tr><th>Test</th><th>Score</th><th>When</th></tr></thead>
            <tbody>
              {results.rows.map((r) => {
                const pct = Math.round((r.score / r.total) * 100);
                const cls = pct >= 70 ? "good" : pct >= 40 ? "mid" : "bad";
                return (
                  <tr key={r.id}>
                    <td><b>{r.title}</b></td>
                    <td><span className={`score-chip ${cls}`}>{r.score}/{r.total} ({pct}%)</span></td>
                    <td className="muted small">{new Date(r.created_at).toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
