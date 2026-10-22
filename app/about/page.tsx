import Link from "next/link";
import type { Metadata } from "next";
import { breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Alpha Classes Bikapur — Mission, Faculty & Teaching Methodology",
  description:
    "Alpha Classes Bikapur is the top coaching institute in Bikapur (Ayodhya) dedicated to concept mastery, structured test series, and personalized mentoring for Class 9–10, JEE, NEET, and SSC exams.",
  keywords: [
    "alpha classes bikapur",
    "alphaclassesbikapur",
    "about alpha classes",
    "best coaching in bikapur",
    "bestcoachinginbikapur",
    "coaching in bikapur",
    "coachinginbikapur",
    "top coaching in bikapur",
    "bikapur coaching classes",
  ],
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ]);

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Alpha Classes Bikapur",
    description: "Mission, history, and teaching methodology of Alpha Classes in Bikapur, Ayodhya.",
    url: `${CANONICAL_SITE_URL}/about`,
  };

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#667085", margin: "20px 0 6px" }}>
        <Link href="/" style={{ color: "#667085" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>About Us</span>
      </nav>

      <div className="page-head">
        <div className="badge">📍 Bikapur, Ayodhya</div>
        <h1>About Alpha Classes Bikapur</h1>
        <p>Learn Today. Lead Tomorrow. Empowering learners with deep concepts and disciplined practice.</p>
      </div>

      <section className="section prose" style={{ paddingTop: 20, maxWidth: 820 }}>
        <p style={{ fontSize: 16.5, lineHeight: 1.7 }}>
          <strong>Alpha Classes Bikapur</strong> was founded with a singular mission: to provide world-class, concept-driven coaching to students in Bikapur and the surrounding Ayodhya region. Whether preparing for CBSE / UP Board foundations in Class 9 and 10, or cracking high-stakes competitive exams like JEE, NEET, and SSC, our students achieve excellence through structured teaching, continuous testing, and personal doubt support.
        </p>

        <h2 style={{ fontSize: 24, margin: "28px 0 10px" }}>Our 5-Pillar Teaching Methodology</h2>
        <ul className="hl-list" style={{ gap: 14 }}>
          <li>
            <b>Concept-First Lectures:</b> Interactive teaching that emphasizes the core theory behind mathematical formulas and scientific principles.
          </li>
          <li>
            <b>Weekly Timed Test Series:</b> Rigorous chapter-wise tests with instant scoring and question-by-question solution analysis.
          </li>
          <li>
            <b>NCERT-Focused Materials:</b> Crisp summary booklets, formula reference sheets, and previous 10-year question banks.
          </li>
          <li>
            <b>1-on-1 Mentor Doubt Support:</b> Daily dedicated doubt sessions ensuring no student leaves the classroom with unresolved queries.
          </li>
          <li>
            <b>Digital Progress Tracking:</b> Seamless student portal to track test rankings, attendance, and performance improvement over time.
          </li>
        </ul>

        <h2 style={{ fontSize: 24, margin: "32px 0 10px" }}>Classroom & Online Facilities in Bikapur</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, margin: "16px 0 24px" }}>
          <div style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 14, background: "#fafafa" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6 }}>🏢 Modern Classrooms</h4>
            <p className="small muted">Spacious, air-cooled digital classrooms located near Tehsil / Block Office on Main Road, Bikapur.</p>
          </div>
          <div style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 14, background: "#fafafa" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6 }}>💻 Computer Lab</h4>
            <p className="small muted">Hands-on computer training, web development practice, and online mock exam terminals.</p>
          </div>
          <div style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 14, background: "#fafafa" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6 }}>📚 Library & Reading Room</h4>
            <p className="small muted">Quiet study environment stocked with reference books, NCERT textbooks, and past year question papers.</p>
          </div>
        </div>

        <h2 style={{ fontSize: 24, margin: "28px 0 10px" }} id="careers">Careers & Faculty Positions</h2>
        <p>
          We are always looking for passionate educators in Physics, Chemistry, Mathematics, Biology, English, and Computer Science. If you love teaching and want to make an impact in Bikapur, submit your details through our{" "}
          <Link href="/contact" style={{ color: "var(--primary)", fontWeight: 700 }}>
            contact page
          </Link>{" "}
          with subject &quot;Faculty Application&quot;.
        </p>

        <div style={{ marginTop: 32 }}>
          <Link className="btn btn-primary" href="/courses">
            Explore Courses & Batches →
          </Link>
          <Link className="btn btn-outline" href="/contact" style={{ marginLeft: 12 }}>
            Visit Us in Bikapur
          </Link>
        </div>
      </section>
    </main>
  );
}
