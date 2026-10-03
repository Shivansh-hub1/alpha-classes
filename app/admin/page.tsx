import type { Metadata } from "next";
import { pool, ensureDb } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel, { AdminData } from "@/components/AdminPanel";
import AdminLogout from "@/components/AdminLogout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  await ensureDb();
  const enquiries = await pool.query(
    `SELECT e.id, e.name, e.email, e.phone, e.message, e.status, e.created_at, c.title AS course
     FROM enquiries e LEFT JOIN courses c ON c.id = e.course_id ORDER BY e.created_at DESC LIMIT 200`
  );
  const students = await pool.query(
    "SELECT id, name, email, phone, created_at FROM students ORDER BY created_at DESC LIMIT 200"
  );
  const results = await pool.query(
    `SELECT r.id, s.name AS student, t.title AS test, r.score, r.total, r.created_at
     FROM test_results r JOIN students s ON s.id = r.student_id JOIN tests t ON t.id = r.test_id
     ORDER BY r.created_at DESC LIMIT 200`
  );

  const data: AdminData = {
    enquiries: enquiries.rows,
    students: students.rows,
    results: results.rows,
  };

  return (
    <main className="container">
      <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Admin Panel</h1>
          <p>Enquiries, students and test results.</p>
        </div>
        <AdminLogout />
      </div>
      <section className="section" style={{ paddingTop: 26 }}>
        <AdminPanel data={data} />
      </section>
    </main>
  );
}
