import Link from "next/link";
import type { Metadata } from "next";
import { getTests } from "@/lib/db";
import TestsList from "@/components/TestsList";
import { breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Test Series — Free Online Practice Tests | Alpha Classes Bikapur",
  description:
    "Practice with free timed online tests for CBSE Class 10 Science, JEE Main, NEET UG, and SSC at Alpha Classes Bikapur. Instant result analysis, question-wise score report, and detailed step-by-step solutions.",
  keywords: [
    "test series in bikapur",
    "testseriesinbikapur",
    "alpha classes bikapur test series",
    "best coaching in bikapur online test",
    "JEE mock test bikapur",
    "NEET mock test online free",
    "Class 10 science test paper",
    "SSC CGL free mock test",
    "free test series online",
  ],
  alternates: { canonical: "/tests" },
};

export default async function TestsPage() {
  const tests = await getTests();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Alpha Classes Online Test Series",
    description: "Timed online practice mock tests for school and competitive exams.",
    numberOfItems: tests.length,
    itemListElement: tests.map((t, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: t.title,
      url: `${CANONICAL_SITE_URL}/tests/${t.slug}`,
    })),
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Test Series", path: "/tests" },
  ]);

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="page-head">
        <div className="badge">⏱ Real Exam Simulation</div>
        <h1>Online Test Series</h1>
        <p>
          Practice chapter-wise & full-length mock tests designed by expert teachers at Alpha Classes Bikapur.
          Instant scorecards, accuracy analytics, and detailed step-by-step solutions.
        </p>
      </div>

      {/* Feature Highlights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          margin: "20px 0 30px",
        }}
      >
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>⏱ Timed Practice</strong>
          <p className="small muted" style={{ marginTop: 2 }}>Exam-style countdown to develop speed and accuracy.</p>
        </div>
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>📊 Instant Scorecard</strong>
          <p className="small muted" style={{ marginTop: 2 }}>Immediate evaluation of marks, correct/incorrect ratio & accuracy %.</p>
        </div>
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>💡 Step-by-Step Solutions</strong>
          <p className="small muted" style={{ marginTop: 2 }}>Full explanations for every question to resolve doubts instantly.</p>
        </div>
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>🎁 100% Free</strong>
          <p className="small muted" style={{ marginTop: 2 }}>No hidden fees — open for all students and aspirants.</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <TestsList tests={tests} />
      </section>

      {/* Local Bikapur Coaching Support CTA */}
      <section className="cta" style={{ marginTop: 30 }}>
        <div>
          <h2>Want Offline Classroom Practice in Bikapur?</h2>
          <p>
            Join our offline batches in Bikapur for weekly OMR tests, personal mentor doubt solving, and printed study material.
          </p>
        </div>
        <Link className="btn" href="/contact">
          Inquire for Classroom Batches →
        </Link>
      </section>
    </main>
  );
}
