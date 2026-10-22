import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms and Conditions | Alpha Classes Bikapur",
  description: "Terms and conditions of student admission and service usage at Alpha Classes Bikapur.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Terms & Conditions", path: "/terms" },
  ]);

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#667085", margin: "20px 0 6px" }}>
        <Link href="/" style={{ color: "#667085" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>Terms & Conditions</span>
      </nav>

      <div className="page-head">
        <h1>Terms & Conditions</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
      </div>

      <section className="section prose" style={{ paddingTop: 20, maxWidth: 780 }}>
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing the Alpha Classes Bikapur portal or enrolling in any offline classroom batch or online test series, you agree to comply with these terms.
        </p>

        <h3>2. Course Materials & Intellectual Property</h3>
        <p>
          All video lectures, notes, tests, and study materials provided by Alpha Classes are copyrighted educational assets. They are licensed for your individual personal study and may not be redistributed, sold, or shared publicly.
        </p>

        <h3>3. Online Test Series</h3>
        <p>
          Our practice tests are designed to simulate real exam environments for CBSE, JEE, NEET, and SSC. Scores and analytics are provided as evaluative feedback to help students identify weak areas and improve performance.
        </p>

        <h3>4. Student Conduct</h3>
        <p>
          Students must maintain mutual respect in all classroom interactions and online doubt discussions. Any misuse of the testing portal or disruptive behavior may result in suspension of access.
        </p>

        <h3>5. Inquiries & Support</h3>
        <p>
          For questions regarding batch schedules, enrollment fees, or technical support, please contact us via our{" "}
          <Link href="/contact" style={{ color: "var(--primary)", fontWeight: 700 }}>
            contact page
          </Link>.
        </p>
      </section>
    </main>
  );
}
