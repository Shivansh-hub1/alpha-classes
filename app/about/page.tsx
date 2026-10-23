import Link from "next/link";
import type { Metadata } from "next";
import { breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";
import { IconMapPin, IconBuilding, IconCode, IconBook } from "@/components/Icons";

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
        <div className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <IconMapPin size={14} color="var(--primary)" />
          <span>Bikapur, Ayodhya</span>
        </div>
        <h1>About Alpha Classes Bikapur</h1>
        <p>Learn Today. Lead Tomorrow. Empowering learners with deep concepts and disciplined practice.</p>
      </div>

      <section className="section prose" style={{ paddingTop: 20, maxWidth: 820 }}>
        <p style={{ fontSize: 16.5, lineHeight: 1.7 }}>
          <strong>Alpha Classes Bikapur</strong> was founded with a singular mission: to provide world-class, concept-driven coaching to students in Bikapur and the surrounding Ayodhya region. Whether preparing for CBSE / UP Board foundations in Class 9 and 10, or cracking high-stakes competitive exams like JEE, NEET, and SSC, our students achieve excellence through structured teaching, continuous testing, and personal doubt support.
        </p>

        <h2 style={{ fontSize: 24, margin: "28px 0 10px" }}>Academic Leadership & Mentorship</h2>
        <div
          style={{
            padding: 24,
            border: "1px solid var(--border)",
            borderRadius: 18,
            background: "#fff7ed",
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            margin: "18px 0",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 32,
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            S
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ fontSize: 20, margin: "0 0 4px", color: "#111827" }}>Er. Shivansh Verma</h3>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--primary)", marginBottom: 8 }}>
              Founder & Academic Director · Senior Physics & Tech Mentor
            </div>
            <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              &quot;Every student has immense potential if taught with patience and genuine conceptual clarity. At Alpha Classes Bikapur, our focus isn&apos;t rote memorization — it is understanding why formulas work, building test discipline, and guiding every young learner toward their dreams.&quot;
            </p>
          </div>
        </div>

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
            <h4 style={{ fontSize: 16, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <IconBuilding size={18} color="var(--primary)" />
              <span>Modern Classrooms</span>
            </h4>
            <p className="small muted">Spacious, air-cooled digital classrooms located near Tehsil / Block Office on Main Road, Bikapur.</p>
          </div>
          <div style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 14, background: "#fafafa" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <IconCode size={18} color="var(--primary)" />
              <span>Computer Lab</span>
            </h4>
            <p className="small muted">Hands-on computer training, web development practice, and online mock exam terminals.</p>
          </div>
          <div style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 14, background: "#fafafa" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <IconBook size={18} color="var(--primary)" />
              <span>Library & Reading Room</span>
            </h4>
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

        <h2 style={{ fontSize: 24, margin: "28px 0 10px" }} id="embed">Student & Partner Website Badge</h2>
        <p>
          Are you a student, alumnus, educational blogger, or partner institution? You can embed the official Alpha Classes Bikapur badge on your personal blog, study portfolio, or school website:
        </p>
        <div style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 14, background: "#f9fafb", marginTop: 12 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/badge.svg" alt="Alpha Classes Bikapur Badge" width={220} height={40} style={{ display: "block" }} />
            <span className="small muted">Live preview of embeddable badge</span>
          </div>
          <label style={{ fontSize: 12.5, fontWeight: 700, color: "#475467", display: "block", marginBottom: 6 }}>
            HTML Embed Code:
          </label>
          <pre style={{ background: "#111827", color: "#f9fafb", padding: "12px 14px", borderRadius: 10, fontSize: 12.5, overflowX: "auto" }}>
            <code>{`<a href="${CANONICAL_SITE_URL}" target="_blank" rel="noopener">
  <img src="${CANONICAL_SITE_URL}/badge.svg" alt="Alpha Classes Bikapur — Best Coaching in Bikapur" width="220" height="40" />
</a>`}</code>
          </pre>
        </div>

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
