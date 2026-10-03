import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using the Alpha Classes learning platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="container">
      <div className="page-head"><h1>Terms of Use</h1><p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p></div>
      <section className="section prose" style={{ paddingTop: 26, maxWidth: 760 }}>
        <h3>Using the platform</h3>
        <p>By creating an account you agree to use Alpha Classes for personal learning only. Sharing account credentials or misusing the platform (including attempting to cheat in tests) may lead to account suspension.</p>
        <h3>Courses & payments</h3>
        <p>Course fees, batch timings and refunds are governed by the admission terms shared at the time of enrolment. Online practice tests on this website are free for registered students.</p>
        <h3>Content</h3>
        <p>Notes, videos, questions and other material on this platform are for enrolled students only. Redistribution or reproduction without permission is not allowed.</p>
        <h3>Changes</h3>
        <p>We may update these terms from time to time. Continued use of the platform after changes means you accept the updated terms.</p>
      </section>
    </main>
  );
}
