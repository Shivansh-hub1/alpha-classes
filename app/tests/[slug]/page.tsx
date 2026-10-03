import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTestWithQuestions } from "@/lib/db";
import { getSession } from "@/lib/auth";
import TestRunner from "@/components/TestRunner";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getTestWithQuestions(params.slug);
  if (!data) return { title: "Test Not Found" };
  return {
    title: `${data.test.title} — Free Online Practice Test`,
    description: `${data.test.description} ${data.questions.length} questions, ${data.test.duration_min} minutes, instant result with answer review.`,
    alternates: { canonical: `/tests/${data.test.slug}` },
  };
}

export default async function TestPage({ params }: Props) {
  const data = await getTestWithQuestions(params.slug);
  if (!data) notFound();

  const session = await getSession();
  // never send correct answers to the browser before submission
  const questions = data.questions.map((q) => ({ id: q.id, q_text: q.q_text, options: q.options }));

  return (
    <main className="container section" style={{ paddingTop: 40 }}>
      {!session && (
        <div className="form-error" style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span>🔒 You need a free account to attempt this test — your score will be saved to your dashboard.</span>
          <span style={{ display: "flex", gap: 8 }}>
            <Link className="btn btn-primary" href={`/login?next=/tests/${params.slug}`}>Login</Link>
            <Link className="btn btn-outline" href={`/signup?next=/tests/${params.slug}`} style={{ background: "#fff" }}>Sign Up Free</Link>
          </span>
        </div>
      )}
      <TestRunner slug={params.slug} title={data.test.title} durationMin={data.test.duration_min} questions={questions} />
    </main>
  );
}
