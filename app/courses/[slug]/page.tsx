import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse, getCourses } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { pool, ensureDb } from "@/lib/db";
import EnrollButton from "@/components/EnrollButton";
import EnquiryForm from "@/components/EnquiryForm";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} — ₹${course.price.toLocaleString("en-IN")}`,
    description: `${course.description} ${course.classes_count} classes at Alpha Classes.`,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: `${course.title} | Alpha Classes`,
      description: course.description,
      type: "website",
    },
  };
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const [session, courses] = await Promise.all([getSession(), getCourses()]);
  let alreadyEnrolled = false;
  if (session) {
    await ensureDb();
    const { rowCount } = await pool.query(
      "SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2", [session.uid, course.id]
    );
    alreadyEnrolled = !!rowCount;
  }
  const others = courses.filter((c) => c.id !== course.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: { "@type": "EducationalOrganization", name: "Alpha Classes", url: process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-classes.vercel.app" },
    offers: { "@type": "Offer", price: course.price, priceCurrency: "INR", category: "Paid" },
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="page-head">
        <h1>{course.icon} {course.title}</h1>
        <p>{course.description}</p>
      </div>

      <div className="course-hero">
        <div>
          <div className="test-meta">
            <span>📘 {course.level}</span>
            <span>🎥 {course.classes_count} classes</span>
            <span>🧪 Practice tests included</span>
          </div>
          <h2 style={{ fontSize: 22, margin: "14px 0 4px" }}>What you get</h2>
          <ul className="hl-list">
            {course.highlights.split("|").filter(Boolean).map((h) => <li key={h}>{h}</li>)}
            <li>Live + recorded classes</li>
            <li>Notes, PDFs and practice sheets</li>
            <li>Doubt support from teachers</li>
          </ul>

          <h2 style={{ fontSize: 22, margin: "26px 0 14px" }}>Have a question about this course?</h2>
          <EnquiryForm courseId={course.id} courseTitle={course.title} />
        </div>

        <aside className="buy-card">
          <span className="level">{course.level}</span>
          <div style={{ margin: "12px 0 4px" }} className="price-tag">₹{course.price.toLocaleString("en-IN")}</div>
          <p className="small muted">One-time fee · Full course access</p>
          <div style={{ margin: "16px 0" }}>
            <EnrollButton courseId={course.id} loggedIn={!!session} alreadyEnrolled={alreadyEnrolled} />
          </div>
          <ul className="hl-list" style={{ marginTop: 8 }}>
            <li>{course.classes_count} live + recorded classes</li>
            <li>Practice tests with instant results</li>
            <li>Doubt clearing support</li>
          </ul>
        </aside>
      </div>

      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="section-head"><div><h2 style={{ fontSize: 25 }}>More courses</h2></div></div>
        <div className="grid">
          {others.map((c) => (
            <Link key={c.id} className="card" href={`/courses/${c.slug}`}>
              <div className="card-top"><div className="icon">{c.icon}</div><span className="level">{c.level}</span></div>
              <div className="card-body"><h3>{c.title}</h3><p>{c.description}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
