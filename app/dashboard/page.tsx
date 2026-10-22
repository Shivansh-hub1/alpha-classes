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
          <span>Courses Enrolled</span>
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
            <h2 style={{ fontSize: 24 }}>My Courses</h2>
          </div>
          <Link href="/courses" style={{ color: "var(--primary)", fontWeight: 800 }}>
            Browse catalog →
          </Link>
        </div>
        {enrolledRows.length === 0 ? (
          <div className="card" style={{ padding: 26 }}>
            <p className="muted">You haven&apos;t enrolled in any course yet.</p>
            <Link className="btn btn-primary" href="/courses" style={{ marginTop: 12, display: "inline-block" }}>
              Explore Courses & Enroll
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
                  <p>Continue learning →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

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
                    <td className="muted small">
                      {new Date(r.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td>
                      <Link className="status-btn" href={`/tests/${r.slug}`} style={{ color: "var(--primary)" }}>
                        Retake Test
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Recommended Practice Tests */}
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="section-head">
          <div>
            <h2 style={{ fontSize: 24 }}>Recommended Tests For You</h2>
            <p>Sharpen your speed with chapter-wise timed practice.</p>
          </div>
        </div>
        <div className="grid">
          {allTests.slice(0, 3).map((t) => (
            <article key={t.id} className="card">
              <div className="card-top" style={{ height: 100 }}>
                <div className="icon">🧪</div>
                <span className="level">{t.category || "Practice"}</span>
              </div>
              <div className="card-body">
                <h3>{t.title}</h3>
                <p>{t.question_count} Qs · {t.duration_min} min</p>
                <Link className="btn btn-primary" href={`/tests/${t.slug}`} style={{ width: "100%", textAlign: "center" }}>
                  Start Practice Test
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
