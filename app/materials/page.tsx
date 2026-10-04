import Link from "next/link";
import type { Metadata } from "next";
import { getMaterials } from "@/lib/db";
import MaterialsGrid from "@/components/MaterialsGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Study Material — Test Series PDFs, Books & Notes",
  description: "Download free study material from Alpha Classes: test series PDFs, book PDFs, notes and Google Drive book links for JEE, NEET, SSC and school exams.",
  alternates: { canonical: "/materials" },
};

export default async function MaterialsPage() {
  const materials = await getMaterials();
  return (
    <main className="container">
      <div className="page-head">
        <h1>Free Study Material 🎁</h1>
        <p>Test series PDFs, books and notes — free for every student. New material is added regularly by our teachers.</p>
      </div>
      <section className="section" style={{ paddingTop: 30 }}>
        <MaterialsGrid materials={materials} />
      </section>
      <div className="container" style={{ paddingBottom: 50 }}>
        <section className="cta">
          <div>
            <h2>Want full access to everything?</h2>
            <p>Join a course and get structured material for the full syllabus.</p>
          </div>
          <Link className="btn" href="/courses">Explore Courses</Link>
        </section>
      </div>
    </main>
  );
}
