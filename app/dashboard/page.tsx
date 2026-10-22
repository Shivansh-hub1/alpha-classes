import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { pool, ensureDb, getTests } from "@/lib/db";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student Dashboard | Alpha Classes Bikapur",
  robots: { index: false, follow: false },
};

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  await ensureDb();

  let enrolledRows: Array<{ id: number; slug: string; title: string; icon: string; level: string }> = [];
  let resultsRows: Array<{ id: number; title: string; slug: string; score: number; total: number; created_at: string }> = [];
  let batchMaterials: Array<{
    id: number;
    title: string;
    kind: string;
    description: string;
    url: string | null;
    file_name: string | null;
    file_size: number | null;
    course_title: string;
  }> = [];

  try {
    const enrolled = await pool.query<{ id: number; slug: string; title: string; icon: string; level: string }>(
      `SELECT c.id, c.slug, c.title, c.icon, c.level FROM enrollments e JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = $1 ORDER BY e.created_at DESC`,
      [session.uid]
    );
    enrolledRows = enrolled.rows;

    const results = await pool.query<{ id: number; title: string; slug: string; score: number; total: number; created_at: string }>(
      `SELECT r.id, t.title, t.slug, r.score, r.total, r.created_at FROM test_results r JOIN tests t ON t.id = r.test_id
       WHERE r.student_id = $1 ORDER BY r.created_at DESC LIMIT 20`,
      [session.uid]
    );
    resultsRows = results.rows;

    const bMat = await pool.query<{
      id: number;
      title: string;
      kind: string;
      description: string;
      url: string | null;
      file_name: string | null;
      file_size: number | null;
      course_title: string;
    }>(
      `SELECT m.id, m.title, m.kind, m.description, m.url, m.file_name, m.file_size, c.title AS course_title
       FROM materials m
       JOIN courses c ON c.id = m.course_id
       WHERE m.course_id IN (SELECT course_id FROM enrollments WHERE student_id = $1)
       ORDER BY m.created_at DESC`,
      [session.uid]
    );
    batchMaterials = bMat.rows;
  } catch (err) {
    console.warn("Dashboard DB warning (offline mode):", err);
  }

  const allTests = await getTests();
  const firstName = session.name.split(" ")[0];

  const totalScore = resultsRows.reduce((acc, r) => acc + r.score, 0);
  const totalMax = resultsRows.reduce((acc, r) => acc + r.total, 0);
  const avgPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : null;
  const bestPct = resultsRows.length
    ? Math.max(...resultsRows.map((r) => Math.round((r.score / r.total) * 100)))
    : null;

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <div
        className="page-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <span className="badge">🎓 Registered Student</span>
          <h1>Hi {firstName} 👋</h1>
          <p>Welcome to your learning progress center at Alpha Classes Bikapur.</p>
        </div>
        <LogoutButton />
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          margin: "24px 0",
        }}
        className="stats-grid"
      >
        <div className="stat-card">
          <strong>{enrolledRows.length}</strong>
          <span>Batches Enrolled</span>
        </div>
        <div className="stat-card">
          <strong>{resultsRows.length}</strong>
          <span>Tests Attempted</span>
        </div>
        <div className="stat-card">
          <strong>{bestPct === null ? "—" : `${bestPct}%`}</strong>
          <span>Highest Score</span>
        </div>
        <div className="stat-card">
          <strong>{avgPct === null ? "—" : `${avgPct}%`}</strong>
          <span>Average Performance</span>
        </div>
      </div>

      {/* My Courses Section */}
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="section-head">
          <div>
            <h2 style={{ fontSize: 24 }}>My Enrolled Batches</h2>
          </div>
          <Link href="/courses" style={{ color: "var(--primary)", fontWeight: 800 }}>
            Browse catalog →
          </Link>
        </div>
        {enrolledRows.length === 0 ? (
          <div className="card" style={{ padding: 26 }}>
            <p className="muted">You haven&apos;t enrolled in any batch yet.</p>
            <Link className="btn btn-primary" href="/courses" style={{ marginTop: 12, display: "inline-block" }}>
              Explore Courses & Batches
            </Link>
          </div>
        ) : (
          <div className="grid">
            {enrolledRows.map((c) => (
              <Link key={c.id} className="card" href={`/courses/${c.slug}`}>
                <div className="card-top">
                  <div className="icon">{c.icon}</div>
                  <span className="level">{c.level}</span>
                </div>
                <div className="card-body">
                  <h3>{c.title}</h3>
                  <p>Access batch lessons & study material →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Exclusive Batch Materials */}
      {batchMaterials.length > 0 && (
        <section className="section" style={{ paddingTop: 10 }}>
          <div className="section-head">
            <div>
              <h2 style={{ fontSize: 24 }}>🔒 Exclusive Batch Materials & Notes</h2>
              <p className="small muted">Study materials, PDF books & formula sheets provided exclusively to your batches.</p>
            </div>
          </div>
          <div className="grid">
            {batchMaterials.map((m) => (
              <div key={m.id} className="card" style={{ padding: 20 }}>
                <span className="tag joined" style={{ marginBottom: 10 }}>
                  {m.course_title}
                </span>
                <h3 style={{ fontSize: 17, marginBottom: 6 }}>{m.title}</h3>
                {m.description && <p className="small muted" style={{ marginBottom: 14 }}>{m.description}</p>}
                {m.kind === "pdf" ? (
                  <a
                    className="btn btn-primary"
                    href={`/api/materials/${m.id}/download`}
                    style={{ width: "100%", textAlign: "center", display: "inline-block", padding: "8px 14px" }}
                  >
                    📥 Download PDF
                  </a>
                ) : (
                  <a
                    className="btn btn-outline"
                    href={m.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    style={{ width: "100%", textAlign: "center", display: "inline-block", padding: "8px 14px" }}
                  >
                    🔗 Open Drive Link →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Test Performance & History */}
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="section-head">
          <div>
            <h2 style={{ fontSize: 24 }}>Test Series History & Scores</h2>
          </div>
          <Link href="/tests" style={{ color: "var(--primary)", fontWeight: 800 }}>
            Take new practice test →
          </Link>
        </div>

        {resultsRows.length === 0 ? (
          <div className="card" style={{ padding: 26 }}>
            <p className="muted">No tests attempted yet. Start with a free practice mock test!</p>
            <Link className="btn btn-primary" href="/tests" style={{ marginTop: 12, display: "inline-block" }}>
              Take a Free Practice Test Now
            </Link>
          </div>
        ) : (
          <div className="table-card">
            <table className="data">
              <thead>
                <tr>
                  <th>Test Title</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Attempted On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resultsRows.map((r) => {
                  const pct = Math.round((r.score / r.total) * 100);
                  const cls = pct >= 75 ? "good" : pct >= 45 ? "mid" : "bad";
                  return (
                    <tr key={r.id}>
                      <td>
                        <b>{r.title}</b>
                      </td>
                      <td>
                        <span className={`score-chip ${cls}`}>
                          {r.score}/{r.total} ({pct}%)
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: cls === "good" ? "var(--green)" : "#475467" }}>
                          {pct >= 75 ? "High Accuracy" : "Needs Review"}
                        </span>
                      </td>
                      <td className="small muted">
                        {new Date(r.created_at).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <Link className="status-btn" href={`/tests/${r.slug}`}>
                          Retake
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recommended Practice Tests */}
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="section-head">
          <div>
            <h2 style={{ fontSize: 24 }}>Recommended Tests for You</h2>
          </div>
          <Link href="/tests" style={{ color: "var(--primary)", fontWeight: 800 }}>
            View all tests →
          </Link>
        </div>
        <div className="grid">
          {allTests.slice(0, 3).map((t) => (
            <div key={t.id} className="card">
              <div className="card-top">
                <span className="tag new">{t.category || "General"}</span>
                <span className="level">⏱ {t.duration_min} min</span>
              </div>
              <div className="card-body">
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <span className="small muted">{t.question_count} Questions</span>
                  <Link className="btn btn-primary" href={`/tests/${t.slug}`} style={{ padding: "8px 16px", fontSize: 13.5 }}>
                    Start Test →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
