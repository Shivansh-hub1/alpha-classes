import type { Metadata } from "next";
import { pool, ensureDb, getTests } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel, { AdminData } from "@/components/AdminPanel";
import AdminLogout from "@/components/AdminLogout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel | Alpha Classes Bikapur",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  await ensureDb();

  let enquiriesRows: any[] = [];
  let studentsRows: any[] = [];
  let resultsRows: any[] = [];
  let materialsRows: any[] = [];

  try {
    const enquiries = await pool.query(
      `SELECT e.id, e.name, e.email, e.phone, e.message, e.status, e.created_at, c.title AS course
       FROM enquiries e LEFT JOIN courses c ON c.id = e.course_id ORDER BY e.created_at DESC LIMIT 200`
    );
    enquiriesRows = enquiries.rows;

    const students = await pool.query(
      "SELECT id, name, email, phone, created_at FROM students ORDER BY created_at DESC LIMIT 200"
    );
    studentsRows = students.rows;

    const results = await pool.query(
      `SELECT r.id, s.name AS student, t.title AS test, r.score, r.total, r.created_at
       FROM test_results r JOIN students s ON s.id = r.student_id JOIN tests t ON t.id = r.test_id
       ORDER BY r.created_at DESC LIMIT 200`
    );
    resultsRows = results.rows;

    const materials = await pool.query(
      "SELECT id, title, category, kind, description, url, file_name, file_size, downloads, created_at FROM materials ORDER BY created_at DESC LIMIT 200"
    );
    materialsRows = materials.rows;
  } catch (err) {
    console.warn("Admin panel DB query warning (offline mode):", err);
  }

  const tests = await getTests();

  const data: AdminData = {
    enquiries: enquiriesRows,
    students: studentsRows,
    results: resultsRows,
    materials: materialsRows,
    tests,
  };

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
          <h1>Admin Control Panel</h1>
          <p>Manage student inquiries, publish tests, upload materials and review test results.</p>
        </div>
        <AdminLogout />
      </div>
      <section className="section" style={{ paddingTop: 26 }}>
        <AdminPanel data={data} />
      </section>
    </main>
  );
}
