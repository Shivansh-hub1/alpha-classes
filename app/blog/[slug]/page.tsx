import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlog, getBlogs } from "@/lib/db";
import { breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: "Blog Not Found | Alpha Classes Bikapur" };

  return {
    title: `${blog.title} — Alpha Classes Bikapur`,
    description: blog.excerpt,
    keywords: blog.tags.split(",").map((t) => t.trim()),
    alternates: { canonical: `/blog/${blog.slug}` },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      url: `${CANONICAL_SITE_URL}/blog/${blog.slug}`,
      publishedTime: blog.created_at,
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: blog.title, path: `/blog/${blog.slug}` },
  ]);

  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    url: `${CANONICAL_SITE_URL}/blog/${blog.slug}`,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      "@type": "Person",
      name: blog.author,
      jobTitle: "Founder & Academic Director",
      worksFor: {
        "@type": "EducationalOrganization",
        name: "Alpha Classes Bikapur",
      },
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "Alpha Classes Bikapur",
      logo: {
        "@type": "ImageObject",
        url: `${CANONICAL_SITE_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${CANONICAL_SITE_URL}/blog/${blog.slug}`,
    },
    articleSection: blog.category,
    keywords: blog.tags,
  };

  // Convert simple markdown headings & paragraphs
  const paragraphs = blog.content.split("\n\n").filter(Boolean);

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#667085", margin: "20px 0 10px" }}>
        <Link href="/" style={{ color: "#667085" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link href="/blog" style={{ color: "#667085" }}>Blog</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>{blog.title.slice(0, 35)}…</span>
      </nav>

      <article style={{ maxWidth: 840, margin: "auto" }}>
        <div className="page-head" style={{ padding: "20px 0" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <span className="tag new">{blog.category}</span>
            <span className="small muted">⏱ {blog.read_time} min read</span>
            <span className="small muted">· Published on {new Date(blog.created_at).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          <h1 style={{ fontSize: 36, lineHeight: 1.2, letterSpacing: -1, marginBottom: 16 }}>
            {blog.title}
          </h1>
          <p style={{ fontSize: 18, color: "#475467", lineHeight: 1.6 }}>
            {blog.excerpt}
          </p>
        </div>

        {/* Author Bio Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 18px",
            background: "#fff7ed",
            borderRadius: 14,
            border: "1px solid #fed7aa",
            margin: "14px 0 28px",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            S
          </div>
          <div>
            <strong style={{ fontSize: 14, color: "#111827" }}>By {blog.author}</strong>
            <div className="small muted">Founder & Academic Director · Alpha Classes Bikapur</div>
          </div>
        </div>

        {/* Content Body */}
        <div className="prose" style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937" }}>
          {paragraphs.map((p, idx) => {
            if (p.startsWith("### ")) {
              return (
                <h3 key={idx} style={{ fontSize: 20, margin: "28px 0 10px", color: "#111827" }}>
                  {p.replace("### ", "")}
                </h3>
              );
            }
            if (p.startsWith("## ")) {
              return (
                <h2 key={idx} style={{ fontSize: 24, margin: "32px 0 12px", color: "#111827" }}>
                  {p.replace("## ", "")}
                </h2>
              );
            }
            if (p.startsWith("- ")) {
              const items = p.split("\n- ").map((item) => item.replace(/^- /, ""));
              return (
                <ul key={idx} className="hl-list" style={{ margin: "14px 0" }}>
                  {items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} style={{ marginBottom: 18 }}>
                {p}
              </p>
            );
          })}
        </div>

        {/* High Conversion CTA for Bikapur Admissions */}
        <div className="cta" style={{ marginTop: 44, padding: "32px 28px" }}>
          <div>
            <h3 style={{ fontSize: 22, color: "#fff", marginBottom: 6 }}>
              Prepare with Alpha Classes in Bikapur
            </h3>
            <p style={{ margin: 0, opacity: 0.95, fontSize: 15 }}>
              Join offline classrooms near Tehsil Office, Bikapur, or enroll in our online test series today.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" href="/contact" style={{ background: "#fff", color: "#d95100" }}>
              Book Free Demo →
            </Link>
            <Link className="btn btn-outline" href="/tests" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
              Take Practice Test
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
