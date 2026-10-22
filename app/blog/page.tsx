import Link from "next/link";
import type { Metadata } from "next";
import { getBlogs } from "@/lib/db";
import { breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog & Exam Strategy Guides — Alpha Classes Bikapur",
  description:
    "Expert articles, syllabus breakdowns, study blueprints, and exam preparation tips for Class 9–10, JEE, NEET, and SSC students in Bikapur and Ayodhya.",
  keywords: [
    "alpha classes bikapur blog",
    "coaching in bikapur tips",
    "best coaching in bikapur articles",
    "jee preparation bikapur",
    "neet preparation tips ayodhya",
    "class 10 board exam guide bikapur",
  ],
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const blogs = await getBlogs(50);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Alpha Classes Bikapur Education & Exam Blog",
    description: "Guidance, study plans, and Kota-level preparation insights from Alpha Classes faculty in Bikapur.",
    url: `${CANONICAL_SITE_URL}/blog`,
    blogPost: blogs.map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      description: b.excerpt,
      url: `${CANONICAL_SITE_URL}/blog/${b.slug}`,
      datePublished: b.created_at,
      author: {
        "@type": "Person",
        name: b.author,
      },
    })),
  };

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
      />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#667085", margin: "20px 0 6px" }}>
        <Link href="/" style={{ color: "#667085" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>Blog & Insights</span>
      </nav>

      <div className="page-head">
        <div className="badge">📰 Academic Insights & Strategies</div>
        <h1>Alpha Classes Blog & Exam Guides</h1>
        <p>
          Actionable tips, syllabus breakdowns, and conceptual roadmaps authored by experienced educators at Alpha Classes Bikapur.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        {blogs.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <p className="muted">No blog articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid">
            {blogs.map((b) => (
              <article key={b.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                <div className="card-top" style={{ height: "auto", minHeight: 90, background: "linear-gradient(135deg, #fff7ed, #fff)" }}>
                  <span className="tag new">{b.category}</span>
                  <span className="small muted">⏱ {b.read_time} min read</span>
                </div>
                <div className="card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <h2 style={{ fontSize: 18, marginBottom: 10, lineHeight: 1.35 }}>
                    <Link href={`/blog/${b.slug}`} style={{ color: "inherit" }}>
                      {b.title}
                    </Link>
                  </h2>
                  <p style={{ flex: 1, fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
                    {b.excerpt}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f2f2f3", paddingTop: 12 }}>
                    <span className="small muted">By {b.author}</span>
                    <Link href={`/blog/${b.slug}`} style={{ color: "var(--primary)", fontWeight: 800, fontSize: 13 }}>
                      Read Guide →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
