import Link from "next/link";
import type { Metadata } from "next";
import { getMaterials } from "@/lib/db";
import MaterialsGrid from "@/components/MaterialsGrid";
import { breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Free Study Material — Test Series PDFs, Books & Notes | Alpha Classes Bikapur",
  description:
    "Download free study material from Alpha Classes Bikapur: test series PDFs, NCERT notes, formula sheets, and solved PYQ books for CBSE Class 10, JEE, NEET, and SSC exams.",
  keywords: [
    "free study material in bikapur",
    "coaching in bikapur notes",
    "alpha classes bikapur materials",
    "NCERT notes download",
    "JEE Main formula sheet PDF",
    "NEET biology diagrams PDF",
    "SSC CGL quant tricks PDF",
    "free test series PDF download",
  ],
  alternates: { canonical: "/materials" },
};

export default async function MaterialsPage() {
  const materials = await getMaterials();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Free Study Material", path: "/materials" },
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Study Material & Downloadable Resources — Alpha Classes Bikapur",
    description: "Free downloadable PDF notes, formula sheets, and practice test materials.",
    url: `${CANONICAL_SITE_URL}/materials`,
  };

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="page-head">
        <div className="badge">🎁 100% Free Resources</div>
        <h1>Free Study Material & Downloads</h1>
        <p>
          Handcrafted chapter-wise formula sheets, NCERT summary notes, and test series PDFs created by Alpha Classes Bikapur teachers. Free for every student.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 24 }}>
        <MaterialsGrid materials={materials} />
      </section>

      <div style={{ marginTop: 20 }}>
        <section className="cta">
          <div>
            <h2>Looking for Full-Length Courses in Bikapur?</h2>
            <p>
              Join our classroom batches or online programs for full syllabus lectures, printed books, and weekly offline OMR test series.
            </p>
          </div>
          <Link className="btn" href="/courses">
            Explore All Courses →
          </Link>
        </section>
      </div>
    </main>
  );
}
