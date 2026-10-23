import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import { IconMapPin, IconPhone, IconMail } from "@/components/Icons";
import {
  INSTITUTE_INFO,
  CANONICAL_SITE_URL,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us — Admissions, Address & Demo Classes | Alpha Classes Bikapur",
  description:
    "Contact Alpha Classes in Bikapur, Ayodhya for admissions, fee details, free demo classes, and batch timings. Address: Main Road near Tehsil Office, Bikapur.",
  keywords: [
    "alpha classes bikapur contact",
    "coaching in bikapur address",
    "best coaching in bikapur phone number",
    "bikapur coaching center location",
    "alpha classes bikapur admission",
    "free demo class in bikapur",
  ],
  alternates: { canonical: "/contact" },
};

const CONTACT_FAQS = [
  {
    question: "Where is Alpha Classes located in Bikapur?",
    answer:
      "Alpha Classes is located on Main Road, Near Tehsil / Block Office, Bikapur, District Ayodhya, Uttar Pradesh - 224206.",
  },
  {
    question: "How can I attend a free demo class at Alpha Classes Bikapur?",
    answer:
      "You can fill out the enquiry form on this page with your name and mobile number, or visit our Bikapur center in person. We will schedule a free live demo class for your selected subject.",
  },
  {
    question: "Are both offline classroom and online batches available?",
    answer:
      "Yes! We offer offline physical classroom coaching in Bikapur as well as live streaming and recorded sessions with our online test series.",
  },
  {
    question: "How do I enroll in the online test series?",
    answer:
      "Simply create a free account on our website, navigate to the Test Series tab, and you can instantly attempt chapter-wise tests with full answer solutions.",
  },
];

export default function ContactPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Alpha Classes Bikapur",
    description: "Contact information, campus address, and admission inquiry form for Alpha Classes Bikapur.",
    url: `${CANONICAL_SITE_URL}/contact`,
  };

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(CONTACT_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#667085", margin: "20px 0 6px" }}>
        <Link href="/" style={{ color: "#667085" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>Contact Us</span>
      </nav>

      <div className="page-head">
        <div className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <IconMapPin size={14} color="var(--primary)" />
          <span>Bikapur Center & Admissions</span>
        </div>
        <h1>Contact Alpha Classes Bikapur</h1>
        <p>
          Have questions about classroom batches, fee structures, faculty, or want to book a free demo class? Send us an inquiry or visit our Bikapur campus.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="course-hero">
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 14 }}>Send an Admission Inquiry</h2>
            <EnquiryForm />
          </div>

          <aside className="buy-card">
            <h3 style={{ fontSize: 18, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <IconMapPin size={20} color="var(--primary)" />
              <span>Campus & Contact Details</span>
            </h3>
            <div style={{ display: "grid", gap: 12, fontSize: 14, color: "#344054" }}>
              <div>
                <strong>Alpha Classes Bikapur</strong>
                <p className="muted" style={{ marginTop: 2 }}>
                  {INSTITUTE_INFO.address.streetAddress},<br />
                  {INSTITUTE_INFO.address.addressLocality}, {INSTITUTE_INFO.address.addressRegion} — {INSTITUTE_INFO.address.postalCode}
                </p>
              </div>

              <div>
                <strong style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <IconPhone size={15} color="var(--primary)" /> Phone / WhatsApp:
                </strong>
                <p className="muted" style={{ marginTop: 2 }}>
                  <a href={`tel:${INSTITUTE_INFO.telephone}`} style={{ color: "var(--primary)", fontWeight: 700 }}>
                    {INSTITUTE_INFO.telephone}
                  </a>
                </p>
              </div>

              <div>
                <strong style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <IconMail size={15} color="var(--primary)" /> Email:
                </strong>
                <p className="muted" style={{ marginTop: 2 }}>
                  <a href={`mailto:${INSTITUTE_INFO.email}`} style={{ color: "inherit" }}>
                    {INSTITUTE_INFO.email}
                  </a>
                </p>
              </div>

              <div>
                <strong>⏰ Center Timings:</strong>
                <p className="muted" style={{ marginTop: 2 }}>
                  Monday – Saturday: 7:00 AM – 7:30 PM<br />
                  Sunday: 8:00 AM – 2:00 PM (Doubt & Test Sessions)
                </p>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #eee", marginTop: 18, paddingTop: 16 }}>
              <h4 style={{ fontSize: 15, marginBottom: 8 }}>Quick FAQs</h4>
              {CONTACT_FAQS.slice(0, 2).map((faq, i) => (
                <details key={i} className="faq-item" style={{ marginBottom: 6, padding: "10px 14px" }}>
                  <summary style={{ fontSize: 13.5 }}>{faq.question}</summary>
                  <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
