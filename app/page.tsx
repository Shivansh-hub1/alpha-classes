import Link from "next/link";
import type { Metadata } from "next";
import { getCourses, getTests, getMaterials } from "@/lib/db";
import DemoModal from "@/components/DemoModal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alpha Classes — Learn Today. Lead Tomorrow.",
  description:
    "Live classes, expert teachers, smart tests and structured study material — everything students need in one place. Courses for Class 9–10, JEE, NEET, SSC and skills.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [courses, tests, materials] = await Promise.all([getCourses(), getTests(), getMaterials(3)]);
  const featured = courses.find((c) => c.featured) || courses[0];

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">🚀 New-age learning platform</div>
            <h1>Learn Today.<br /><span>Lead Tomorrow.</span></h1>
            <p>Live classes, expert teachers, smart tests and structured study material — everything students need in one place.</p>
            <div className="hero-buttons">
              <Link className="btn btn-primary" href="/courses">Explore Courses →</Link>
              <DemoModal />
            </div>
          </div>
          <div className="hero-card">
            <div className="video"><DemoModal variant="play" /></div>
            <div className="course-mini">
              <div><small>Featured Course</small><br /><strong>{featured ? featured.title : "Complete JEE Foundation"}</strong></div>
              <div className="price">₹{featured ? featured.price : 999}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats"><div className="container stats-grid">
        <div className="stat"><strong>50K+</strong><span>Students Learning</span></div>
        <div className="stat"><strong>120+</strong><span>Expert Teachers</span></div>
        <div className="stat"><strong>500+</strong><span>Video Classes</span></div>
        <div className="stat"><strong>95%</strong><span>Student Satisfaction</span></div>
      </div></section>

      <section className="section" id="courses">
        <div className="container">
          <div className="section-head">
            <div><h2>Popular Courses</h2><p>Choose a path and start learning.</p></div>
            <Link href="/courses" style={{ color: "#f56600", fontWeight: 800 }}>View all →</Link>
          </div>
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
        </div>
      </section>

      <section className="section feature" id="features">
        <div className="container">
          <div className="section-head">
            <div><h2>Everything you need to learn</h2><p>Designed for focused, consistent progress.</p></div>
          </div>
          <div className="feature-grid">
            <div className="feature-item"><div className="ficon">🎥</div><h3>Live + Recorded</h3><p>Attend live sessions or learn at your own pace.</p></div>
            <div className="feature-item"><div className="ficon">📄</div><h3>Smart Study Material</h3><p>Notes, PDFs, practice sheets and revision resources.</p></div>
            <div className="feature-item"><div className="ficon">🧪</div><h3>Test Series</h3><p>Practice with timed tests and detailed results.</p></div>
            <div className="feature-item"><div className="ficon">📊</div><h3>Performance Tracking</h3><p>See your progress, scores and learning streak.</p></div>
            <div className="feature-item"><div className="ficon">👨‍🏫</div><h3>Doubt Support</h3><p>Ask questions and get help when you are stuck.</p></div>
            <div className="feature-item"><div className="ficon">📱</div><h3>Learn Anywhere</h3><p>Responsive experience for desktop, tablet and mobile.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="tests">
        <div className="container">
          <div className="section-head">
            <div><h2>Test Series</h2><p>Practice. Analyze. Improve.</p></div>
          </div>
          <div className="grid">
            {tests.map((t) => (
              <article key={t.id} className="card">
                <div className="card-body">
                  <h3>{t.title}</h3>
                  <p>{t.question_count} questions · {t.duration_min} minutes · Instant result</p>
                  <Link className="btn btn-primary" href={`/tests/${t.slug}`}>Start Test</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="materials" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Free Study Material 🎁</h2>
              <p>Test series PDFs, books and notes — free for every student.</p>
            </div>
            <Link href="/materials" style={{ color: "#f56600", fontWeight: 800 }}>View all →</Link>
          </div>
          <div className="grid">
            {materials.map((m) => (
              <article key={m.id} className="card">
                <div className="card-top">
                  <div className="icon">{m.category === "test-series" ? "📝" : m.category === "book" ? "📗" : "🗒️"}</div>
                  <span className="level">{m.kind === "pdf" ? "PDF" : "Drive Link"}</span>
                </div>
                <div className="card-body">
                  <h3>{m.title}</h3>
                  <p>{m.description || "Free study material from Alpha Classes."}</p>
                  {m.kind === "pdf" ? (
                    <a className="btn btn-primary" href={`/api/materials/${m.id}/download`}>⬇ Download Free</a>
                  ) : (
                    <a className="btn btn-primary" href={m.url || "#"} target="_blank" rel="noopener noreferrer">🔗 Open Link</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <section className="cta" id="about">
          <div>
            <h2>Ready to start your Alpha journey?</h2>
            <p>Join thousands of learners building their future.</p>
          </div>
          <Link className="btn" href="/signup">Create Free Account</Link>
        </section>
      </div>
    </main>
  );
}
