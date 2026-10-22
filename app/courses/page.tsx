import type { Metadata } from "next";
import { getCourses } from "@/lib/db";
import CoursesList from "@/components/CoursesList";
import { breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Courses — Class 9–10, JEE, NEET, SSC & Tech | Alpha Classes Bikapur",
  description:
    "Explore classroom and online coaching courses at Alpha Classes Bikapur: Class 9–10 Foundation, JEE Preparation, NEET UG, SSC Complete Course, Web Development and Computer Skills.",
  keywords: [
    "coaching in bikapur",
    "coachinginbikapur",
    "best coaching in bikapur",
    "bestcoachinginbikapur",
    "jee coaching in bikapur",
    "neet coaching in bikapur",
    "ssc coaching in bikapur",
    "class 10 coaching in bikapur",
    "class 9 coaching in bikapur",
    "computer coaching in bikapur",
    "alpha classes bikapur courses",
  ],
  alternates: { canonical: "/courses" },
};

export default async function CoursesPage() {
  const courses = await getCourses();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Alpha Classes Bikapur Course Catalog",
    description: "Comprehensive coaching programs for school and competitive exams in Bikapur.",
    numberOfItems: courses.length,
    itemListElement: courses.map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: c.title,
      url: `${CANONICAL_SITE_URL}/courses/${c.slug}`,
    })),
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
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
        <div className="badge">🎓 Structured Curriculums</div>
        <h1>All Courses at Alpha Classes Bikapur</h1>
        <p>
          Choose a program tailored for your academic goal. Live and recorded video lessons, chapter-wise mock tests, and physical + PDF study materials included in every enrollment.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        <CoursesList courses={courses} />
      </section>
    </main>
  );
}
