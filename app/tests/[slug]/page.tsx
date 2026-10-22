import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTestWithQuestions } from "@/lib/db";
import { getSession } from "@/lib/auth";
import TestRunner from "@/components/TestRunner";
import { quizJsonLd, breadcrumbJsonLd, CANONICAL_SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getTestWithQuestions(params.slug);
  if (!data) return { title: "Test Not Found" };

  const title = `${data.test.title} — Online Practice Test | Alpha Classes Bikapur`;
  const description = `${data.test.description} ${data.questions.length} questions, ${data.test.duration_min} minutes timed practice with instant score report and step-by-step solutions at Alpha Classes Bikapur.`;

  return {
    title,
    description,
    keywords: [
      data.test.title,
      `${data.test.title} online test`,
      `${data.test.title} bikapur`,
      "alpha classes bikapur test series",
      "best coaching in bikapur mock test",
      "free practice test online",
      "coaching in bikapur test series",
    ],
    alternates: { canonical: `/tests/${data.test.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/tests/${data.test.slug}`,
    },
  };
}

export default async function TestPage({ params }: Props) {
  const data = await getTestWithQuestions(params.slug);
  if (!data) notFound();

  const session = await getSession();

  // Strip correct answer and explanation before sending to client during test taking
  const questions = data.questions.map((q) => ({
    id: q.id,
    q_text: q.q_text,
    options: q.options,
  }));

  const quizSchema = quizJsonLd({
    slug: data.test.slug,
    title: data.test.title,
    description: data.test.description,
    duration_min: data.test.duration_min,
    category: data.test.category,
    question_count: data.questions.length,
  });

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Test Series", path: "/tests" },
    { name: data.test.title, path: `/tests/${data.test.slug}` },
  ]);

  return (
    <main className="container section" style={{ paddingTop: 30, paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#667085", marginBottom: 20 }}>
        <Link href="/" style={{ color: "#667085" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link href="/tests" style={{ color: "#667085" }}>Test Series</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>{data.test.title}</span>
      </nav>

      {!session && (
        <div
          className="form-error"
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            background: "#fff7ed",
            borderColor: "#fed7aa",
            color: "#9a3412",
          }}
        >
          <span>
            💡 <b>Guest Mode:</b> You can attempt this practice test for free and review instant solutions. Login to save attempts to your student dashboard.
          </span>
          <span style={{ display: "flex", gap: 8 }}>
            <Link className="btn btn-primary" href={`/login?next=/tests/${params.slug}`} style={{ padding: "7px 14px", fontSize: 13 }}>
              Login
            </Link>
            <Link className="btn btn-outline" href={`/signup?next=/tests/${params.slug}`} style={{ background: "#fff", padding: "7px 14px", fontSize: 13 }}>
              Sign Up Free
            </Link>
          </span>
        </div>
      )}

      <TestRunner
        slug={params.slug}
        title={data.test.title}
        durationMin={data.test.duration_min}
        questions={questions}
        isLoggedIn={!!session}
      />
    </main>
  );
}
