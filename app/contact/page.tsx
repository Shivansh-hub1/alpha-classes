import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact Us — Admissions & Enquiries",
  description: "Contact Alpha Classes for admissions, course details, free demo classes and fee structure. Send us your question and our team will get back to you.",
  alternates: { canonical: "/contact" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I join a course at Alpha Classes?",
      acceptedAnswer: { "@type": "Answer", text: "Create a free account, open the course page and click Enroll. For paid batches, our team will contact you about fee payment and batch timings." },
    },
    {
      "@type": "Question",
      name: "Can I try a free demo class?",
      acceptedAnswer: { "@type": "Answer", text: "Yes! Send an enquiry with your name and mobile number and mention 'Free Demo' — we will schedule a live demo class for you." },
    },
    {
      "@type": "Question",
      name: "Are the tests free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, all online practice tests on the Test Series page are free for registered students, with instant results and answer review." },
    },
  ],
};

export default function ContactPage() {
  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="page-head">
        <h1>Contact Us</h1>
        <p>Questions about courses, fees, batches or demo classes? Send us an enquiry — we usually reply within a day.</p>
      </div>
      <section className="section" style={{ paddingTop: 30 }}>
        <div className="course-hero">
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 14 }}>Send an enquiry</h2>
            <EnquiryForm />
          </div>
          <aside className="buy-card">
            <h3 style={{ fontSize: 17, marginBottom: 10 }}>Quick answers</h3>
            <details className="faq-item"><summary>How do I join a course?</summary><p className="muted" style={{ marginTop: 8 }}>Create a free account, open the course page and click Enroll. For paid batches our team will contact you about fee and timings.</p></details>
            <details className="faq-item"><summary>Can I try a free demo class?</summary><p className="muted" style={{ marginTop: 8 }}>Yes — send an enquiry with your mobile number and mention &quot;Free Demo&quot; and we will schedule one for you.</p></details>
            <details className="faq-item"><summary>Are the online tests free?</summary><p className="muted" style={{ marginTop: 8 }}>Yes, all practice tests are free for registered students with instant results.</p></details>
            <p className="small muted" style={{ marginTop: 14 }}>You can also call or visit us — contact details are updated by the institute.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
