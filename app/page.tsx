import Link from "next/link";
import type { Metadata } from "next";
import { getCourses, getTests, getMaterials } from "@/lib/db";
import DemoModal from "@/components/DemoModal";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  INSTITUTE_INFO,
  CANONICAL_SITE_URL,
  faqJsonLd,
} from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Alpha Classes Bikapur — Best Coaching in Bikapur | JEE, NEET, Class 9–10 & SSC",
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
};

const HOME_FAQS = [
  {
    question: "Which is the best coaching institute in Bikapur for Class 9 and 10?",
    answer:
      "Alpha Classes Bikapur is rated as the best coaching institute in Bikapur for CBSE and UP Board Class 9 and 10 students. We provide conceptual teaching in Science, Maths and English, weekly chapter-wise tests, and personal doubt clearance.",
  },
  {
    question: "Does Alpha Classes Bikapur offer JEE and NEET coaching?",
    answer:
      "Yes, Alpha Classes provides dedicated preparation batches for JEE Main/Advanced and NEET with NCERT-first fundamentals, previous year questions (PYQs), and regular timed online mock tests.",
  },
  {
    question: "Where is Alpha Classes located in Bikapur?",
    answer:
      "Alpha Classes is centrally located on Main Road near Tehsil / Block Office, Bikapur, Ayodhya, Uttar Pradesh (224206). Both offline classroom coaching and online test series are available.",
  },
  {
    question: "Are the online tests on Alpha Classes free?",
    answer:
      "Yes, all practice tests on the Alpha Classes Test Series portal are 100% free with instant scorecards, accuracy analysis, and detailed question solutions.",
  },
];

export default async function Home() {
  const [courses, tests, materials] = await Promise.all([
    getCourses(),
    getTests(),
    getMaterials(3),
  ]);
  const featured = courses.find((c) => c.featured) || courses[0];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">📍 Best Coaching in Bikapur, Ayodhya</div>
            <h1>
              Learn Today.
              <br />
              <span>Lead Tomorrow.</span>
            </h1>
            <p>
              Welcome to <strong>Alpha Classes Bikapur</strong> — your premier coaching center for CBSE Class 9–10, JEE, NEET, SSC, and career-building skill courses. Expert teachers, smart tests, structured study material, and personal doubt support.
            </p>
            <div className="hero-buttons">
              <Link className="btn btn-primary" href="/courses">
                Explore Courses →
              </Link>
              <Link className="btn btn-outline" href="/tests">
                🧪 Free Test Series
              </Link>
              <DemoModal />
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "var(--muted)" }}>
              <span>✓ Offline & Online Batches</span>
              <span>✓ Free NCERT Material</span>
              <span>✓ Instant Test Analytics</span>
            </div>
          </div>
          <div className="hero-card">
            <div className="video">
              <DemoModal variant="play" />
            </div>
            <div className="course-mini">
              <div>
                <small>Featured Batch in Bikapur</small>
                <br />
                <strong>{featured ? featured.title : "Complete JEE Foundation"}</strong>
              </div>
              <div className="price">₹{featured ? featured.price : 999}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Results Counter */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat">
            <strong>#1</strong>
            <span>Coaching in Bikapur</span>
          </div>
          <div className="stat">
            <strong>100%</strong>
            <span>Concept Clarity & Support</span>
          </div>
          <div className="stat">
            <strong>50+</strong>
            <span>Mock Tests Available</span>
          </div>
          <div className="stat">
            <strong>4.9 ★</strong>
            <span>Student & Parent Rating</span>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="section" id="courses">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Popular Courses at Alpha Classes Bikapur</h2>
              <p>Top-rated classroom and online programs for school foundations and competitive exams.</p>
            </div>
            <Link href="/courses" style={{ color: "var(--primary)", fontWeight: 800 }}>
              View all courses →
            </Link>
          </div>
          <div className="grid">
            {courses.map((c) => (
              <Link key={c.id} className="card" href={`/courses/${c.slug}`}>
                <div className="card-top">
                  <div className="icon">{c.icon}</div>
                  <span className="level">{c.level}</span>
                </div>
                <div className="card-body">
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <div className="meta">
                    <span>🎥 {c.classes_count} Classes</span>
                    <b>₹{c.price.toLocaleString("en-IN")}</b>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Alpha Classes Features */}
      <section className="section feature" id="features">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Why Students Choose Alpha Classes Bikapur</h2>
              <p>Designed for focused learning, disciplined practice, and guaranteed academic growth.</p>
            </div>
          </div>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="ficon">👨‍🏫</div>
              <h3>Experienced Faculty</h3>
              <p>Learn from subject matter experts passionate about building strong concepts from scratch.</p>
            </div>
            <div className="feature-item">
              <div className="ficon">🧪</div>
              <h3>Smart Online & OMR Tests</h3>
              <p>Practice chapter-wise and full-length timed tests with instant scorecards and detailed solutions.</p>
            </div>
            <div className="feature-item">
              <div className="ficon">📄</div>
              <h3>Free Study Material & Notes</h3>
              <p>Download NCERT notes, formula sheets, and solved PYQ books directly from our portal.</p>
            </div>
            <div className="feature-item">
              <div className="ficon">🤝</div>
              <h3>Dedicated Doubt Sessions</h3>
              <p>Never stay stuck — daily one-on-one doubt clearing sessions with teachers.</p>
            </div>
            <div className="feature-item">
              <div className="ficon">📊</div>
              <h3>Performance Tracking</h3>
              <p>Personal student dashboard to monitor test scores, progress analytics, and weak areas.</p>
            </div>
            <div className="feature-item">
              <div className="ficon">📍</div>
              <h3>Prime Bikapur Location</h3>
              <p>Convenient classroom center on Main Road, Bikapur with modern digital classrooms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Series Spotlight */}
      <section className="section" id="tests">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Free Online Test Series</h2>
              <p>Attempt timed mock tests, check your score immediately, and study step-by-step solutions.</p>
            </div>
            <Link href="/tests" style={{ color: "var(--primary)", fontWeight: 800 }}>
              View all tests →
            </Link>
          </div>
          <div className="grid">
            {tests.slice(0, 3).map((t) => (
              <article key={t.id} className="card">
                <div className="card-top" style={{ height: 110, background: "linear-gradient(135deg, #fff7ed, #fff)" }}>
                  <div className="icon">📝</div>
                  <span className="level" style={{ background: "#fff", borderColor: "#ffd7b5", color: "#d95100" }}>
                    {t.category || "Free Test"}
                  </span>
                </div>
                <div className="card-body">
                  <h3>{t.title}</h3>
                  <p>{t.question_count} questions · {t.duration_min} minutes · Instant evaluation</p>
                  <Link className="btn btn-primary" href={`/tests/${t.slug}`} style={{ width: "100%", textAlign: "center" }}>
                    Start Test Now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Free Study Material Section */}
      <section className="section" id="materials" style={{ background: "#fafafa" }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Free Study Material & Downloads 🎁</h2>
              <p>Handcrafted formula sheets, NCERT notes, and question banks for every student in Bikapur.</p>
            </div>
            <Link href="/materials" style={{ color: "var(--primary)", fontWeight: 800 }}>
              View all materials →
            </Link>
          </div>
          <div className="grid">
            {materials.map((m) => (
              <article key={m.id} className="card">
                <div className="card-top">
                  <div className="icon">
                    {m.category === "test-series" ? "📝" : m.category === "book" ? "📗" : "🗒️"}
                  </div>
                  <span className="level">{m.kind === "pdf" ? "PDF Download" : "Drive Resource"}</span>
                </div>
                <div className="card-body">
                  <h3>{m.title}</h3>
                  <p>{m.description || "Free educational material from Alpha Classes Bikapur."}</p>
                  <div className="meta" style={{ marginBottom: 14 }}>
                    <span>📥 {m.downloads} downloads</span>
                  </div>
                  <Link className="btn btn-outline" href="/materials" style={{ width: "100%", textAlign: "center" }}>
                    Access Download →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (SEO Structured) */}
      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="section-head" style={{ textAlign: "center", display: "block" }}>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about joining Alpha Classes Bikapur.</p>
          </div>
          <div style={{ marginTop: 24 }}>
            {HOME_FAQS.map((faq, i) => (
              <details key={i} className="faq-item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <div className="container">
        <section className="cta">
          <div>
            <h2>Ready to Excel in Your Exams?</h2>
            <p>
              Visit our Bikapur coaching center or enroll online to start learning today. Admissions open for Class 9, 10, JEE, NEET & SSC batches!
            </p>
          </div>
          <Link className="btn" href="/contact">
            Contact Admissions Team →
          </Link>
        </section>
      </div>
    </main>
  );
}
