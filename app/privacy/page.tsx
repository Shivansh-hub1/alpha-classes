import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Alpha Classes collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="container">
      <div className="page-head"><h1>Privacy Policy</h1><p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p></div>
      <section className="section prose" style={{ paddingTop: 26, maxWidth: 760 }}>
        <h3>What we collect</h3>
        <p>When you create an account or send an enquiry, we collect your name, email address and mobile number. When you attempt a test, we store your answers and scores so you can track progress.</p>
        <h3>How we use it</h3>
        <p>We use your details only to provide the learning platform — managing your account, showing your course progress and test results, and responding to your enquiries. We do not sell your data to anyone.</p>
        <h3>Cookies</h3>
        <p>We use a single login cookie to keep you signed in. It contains no personal data besides your session, and you can clear it any time by logging out.</p>
        <h3>Security</h3>
        <p>Passwords are stored only as secure hashes, never in plain text. Data is stored in a managed database with encryption in transit.</p>
        <h3>Your choices</h3>
        <p>You can request deletion of your account and data any time by contacting us through the contact page.</p>
        <h3>Contact</h3>
        <p>Questions about this policy? Reach us from the contact page.</p>
      </section>
    </main>
  );
}
