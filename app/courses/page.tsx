import Link from "next/link";
import type { Metadata } from "next";
import { getCourses } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Courses — Class 9–10, JEE, NEET, SSC & Skills",
  description: "Explore all Alpha Classes courses: Class 9–10 Foundation, JEE Preparation, NEET Preparation, SSC Complete Course, Web Development and Computer & Career Skills.",
  alternates: { canonical: "/courses" },
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <main className="container">
      <div className="page-head">
        <h1>All Courses</h1>
        <p>Choose a path and start learning. Live + recorded classes, study material and tests included in every course.</p>
      </div>
      <section className="section" style={{ paddingTop: 30 }}>
        <div className="grid">
          {courses.map((c) => (
            <Link key={c.id} className="card" href={`/courses/${c.slug}`}>
              <div className="card-top"><div className="icon">{c.icon}</div><span className="level">{c.level}</span></div>
              <div className="card-body">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <div className="meta"><span>{c.classes_count} Classes</span><b>₹{c.price.toLocaleString("en-IN")}</b></div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
