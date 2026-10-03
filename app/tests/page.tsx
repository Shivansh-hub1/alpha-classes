import Link from "next/link";
import type { Metadata } from "next";
import { getTests } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Test Series — Free Online Practice Tests",
  description: "Practice with timed online tests for Class 10 Science, JEE and SSC. Instant results, question-wise analysis and score tracking at Alpha Classes.",
  alternates: { canonical: "/tests" },
};

export default async function TestsPage() {
  const tests = await getTests();
  return (
    <main className="container">
      <div className="page-head">
        <h1>Test Series</h1>
        <p>Practice. Analyze. Improve. Timed tests with instant results — free for registered students.</p>
      </div>
      <section className="section" style={{ paddingTop: 30 }}>
        <div className="grid">
          {tests.map((t) => (
            <article key={t.id} className="card">
              <div className="card-body">
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <div className="meta" style={{ marginBottom: 14 }}><span>{t.question_count} questions · {t.duration_min} min</span></div>
                <Link className="btn btn-primary" href={`/tests/${t.slug}`}>Start Test</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
