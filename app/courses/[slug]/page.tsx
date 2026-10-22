import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse, getCourses } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { pool, ensureDb } from "@/lib/db";
import EnrollButton from "@/components/EnrollButton";
import EnquiryForm from "@/components/EnquiryForm";
import { courseJsonLd, breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: "Course Not Found" };

  const title = `${course.title} — Coaching Course in Bikapur | Alpha Classes`;
  const description = `${course.description} Complete syllabus preparation with ${course.classes_count} classes, test series, and notes at Alpha Classes Bikapur. Fee: ₹${course.price.toLocaleString("en-IN")}.`;

  return {
    title,
    description,
    keywords: [
      course.title,
      `${course.title} in bikapur`,
      `${course.title} coaching bikapur`,
      "alpha classes bikapur",
      "best coaching in bikapur",
      "coaching institute in bikapur",
      course.level,
    ],
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/courses/${course.slug}`,
    },
  };
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const [session, courses] = await Promise.all([getSession(), getCourses()]);
  let alreadyEnrolled = false;

  if (session && process.env.DATABASE_URL) {
    try {
      await ensureDb();
      const { rowCount } = await pool.query(
        "SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2",
        [session.uid, course.id]
      );
      alreadyEnrolled = !!rowCount;
    } catch {}
  }

  const others = courses.filter((c) => c.id !== course.id).slice(0, 3);
  const highlights = course.highlights.split("|").filter(Boolean);

  const courseSchema = courseJsonLd(course);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: course.title, path: `/courses/${course.slug}` },
  ]);

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#667085", margin: "20px 0 6px" }}>
        <Link href="/" style={{ color: "#667085" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link href="/courses" style={{ color: "#667085" }}>Courses</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>{course.title}</span>
      </nav>

      <div className="page-head">
        <span className="badge">📍 Available at Bikapur Center & Online</span>
        <h1 style={{ marginTop: 8 }}>{course.icon} {course.title}</h1>
        <p>{course.description}</p>
      </div>

      <div className="course-hero">
        <div>
          <div className="test-meta">
            <span>📘 {course.level}</span>
            <span>🎥 {course.classes_count} Classes</span>
            <span>🧪 Test Series Included</span>
            <span>📍 Bikapur Classroom & Online</span>
          </div>

          <h2 style={{ fontSize: 22, margin: "22px 0 10px" }}>Course Curriculum & What You Get</h2>
          <ul className="hl-list">
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
            <li>Daily classroom lectures & high-definition recorded archives</li>
            <li>Chapter-wise printed booklets and PDF study materials</li>
            <li>Weekly online & offline OMR test series with instant analytics</li>
            <li>Personal 1-on-1 mentor doubt support</li>
          </ul>

          {/* Syllabus Modules */}
          <h2 style={{ fontSize: 22, margin: "30px 0 14px" }}>Structured Course Modules</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <details className="faq-item" open>
              <summary>Module 1: Fundamental Concepts & NCERT Mastery</summary>
              <p style={{ marginTop: 8, fontSize: 14 }}>
                In-depth coverage of textbook fundamentals, standard definitions, theory derivation, and solved examples to ensure 100% board and entrance foundation.
              </p>
            </details>
            <details className="faq-item">
              <summary>Module 2: Previous Year Questions (PYQs) & Advanced Problem Solving</summary>
              <p style={{ marginTop: 8, fontSize: 14 }}>
                Targeted practice on the past 10 years of entrance and board exam patterns with shortcut tricks and time management methods.
              </p>
            </details>
            <details className="faq-item">
              <summary>Module 3: Full-Length Mock Tests & Revision Drills</summary>
              <p style={{ marginTop: 8, fontSize: 14 }}>
                Full-syllabus simulated mock tests with rank prediction, negative marking practice, and personalized review sessions.
              </p>
            </details>
          </div>

          <h2 style={{ fontSize: 22, margin: "34px 0 14px" }}>Have a Question or Want a Free Demo Class?</h2>
          <EnquiryForm courseId={course.id} courseTitle={course.title} />
        </div>

        <aside className="buy-card">
          <span className="level">{course.level}</span>
          <div style={{ margin: "12px 0 4px" }} className="price-tag">
            ₹{course.price.toLocaleString("en-IN")}
          </div>
          <p className="small muted">One-time fee · Full syllabus access & materials</p>
          <div style={{ margin: "16px 0" }}>
            <EnrollButton courseId={course.id} loggedIn={!!session} alreadyEnrolled={alreadyEnrolled} />
          </div>
          <ul className="hl-list" style={{ marginTop: 8 }}>
            <li>{course.classes_count} live + recorded classes</li>
            <li>Chapter-wise test series with instant scoring</li>
            <li>Free downloadable PDF notes & formula sheets</li>
            <li>Direct doubt solving with faculty</li>
          </ul>
        </aside>
      </div>

      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="section-head">
          <div><h2 style={{ fontSize: 24 }}>Explore More Courses</h2></div>
        </div>
        <div className="grid">
          {others.map((c) => (
            <Link key={c.id} className="card" href={`/courses/${c.slug}`}>
              <div className="card-top">
                <div className="icon">{c.icon}</div>
                <span className="level">{c.level}</span>
              </div>
              <div className="card-body">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
