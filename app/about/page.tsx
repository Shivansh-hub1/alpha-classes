import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Alpha Classes — Our Mission & Teaching Method",
  description: "Alpha Classes helps students build strong concepts through live classes, structured study material, regular tests and personal doubt support — from school foundations to competitive exams.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="container">
      <div className="page-head">
        <h1>About Alpha Classes</h1>
        <p>Learn Today. Lead Tomorrow.</p>
      </div>
      <section className="section prose" style={{ paddingTop: 26, maxWidth: 760 }}>
        <p>
          Alpha Classes is a coaching institute built around one idea: every student can perform better
          with the right guidance, structure and practice. We teach school foundations (Class 9–10),
          competitive exam preparation (JEE, NEET, SSC) and practical skill courses — with the same
          focus on concept clarity.
        </p>
        <h3>How we teach</h3>
        <ul className="hl-list">
          <li><b>Concept-first classes</b> — live teaching where you can ask questions, plus recordings to revise anytime.</li>
          <li><b>Structured material</b> — notes, PDFs and practice sheets aligned with the syllabus.</li>
          <li><b>Regular testing</b> — timed online tests with instant results and question-wise review.</li>
          <li><b>Doubt support</b> — teachers available to unblock you when you are stuck.</li>
          <li><b>Progress tracking</b> — every student sees their scores and progress in one dashboard.</li>
        </ul>
        <h3 id="careers">Careers</h3>
        <p>
          We are always looking for passionate teachers. If you love teaching Maths, Science, English or
          skill subjects, send your details from the <Link href="/contact" style={{ color: "#f56600", fontWeight: 700 }}>contact page</Link> with the
          subject &quot;Teaching Application&quot;.
        </p>
        <h3>Visit us</h3>
        <p>Want to see how a class feels? Book a free demo class from the <Link href="/contact" style={{ color: "#f56600", fontWeight: 700 }}>contact page</Link> and experience it yourself.</p>
        <div style={{ marginTop: 24 }}>
          <Link className="btn btn-primary" href="/courses">Explore Courses →</Link>
        </div>
      </section>
    </main>
  );
}
