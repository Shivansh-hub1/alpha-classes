import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy | Alpha Classes Bikapur",
  description: "Privacy policy and student data security practices at Alpha Classes Bikapur.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
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
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>Privacy Policy</span>
      </nav>

      <div className="page-head">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
      </div>

      <section className="section prose" style={{ paddingTop: 20, maxWidth: 780 }}>
        <h3>What We Collect</h3>
        <p>
          When you register for an account or send an admission inquiry to Alpha Classes Bikapur, we collect your name, email address, and mobile number. When you attempt online practice tests, we store your scores and submission timestamps to generate your performance scorecard.
        </p>

        <h3>How We Use Your Information</h3>
        <p>
          Your information is used solely to provide educational services — managing your student profile, delivering course access, providing test series evaluation, and responding to your admission requests. We never sell or rent your personal data to third parties.
        </p>

        <h3>Cookies & Local Storage</h3>
        <p>
          We use essential HTTP-only cookies to keep you securely signed in to your student or admin session. You can clear cookies at any time by clicking Logout.
        </p>

        <h3>Data Security</h3>
        <p>
          Student passwords are encrypted using bcrypt salted hashing and are never stored in plain text. All network transmissions are protected over SSL/HTTPS.
        </p>

        <h3>Contact & Data Requests</h3>
        <p>
          If you have questions about your data or wish to delete your account, contact our Bikapur admissions desk from our{" "}
          <Link href="/contact" style={{ color: "var(--primary)", fontWeight: 700 }}>
            contact page
          </Link>.
        </p>
      </section>
    </main>
  );
}
