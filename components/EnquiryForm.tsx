"use client";

import { useState } from "react";

export default function EnquiryForm({ courseId, courseTitle }: { courseId?: number; courseTitle?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="form-success">
        ✓ Thank you! Your enquiry has been received{courseTitle ? ` for ${courseTitle}` : ""}. Our team will contact you soon.
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} style={{ maxWidth: 560 }}>
      <div>
        <label htmlFor="eq-name">Your name</label>
        <input id="eq-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label htmlFor="eq-email">Email</label>
          <input id="eq-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" />
        </div>
        <div>
          <label htmlFor="eq-phone">Mobile number</label>
          <input id="eq-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="10-digit mobile" inputMode="numeric" />
        </div>
      </div>
      <div>
        <label htmlFor="eq-msg">Message (optional)</label>
        <textarea id="eq-msg" className="input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={courseTitle ? `I want to know more about ${courseTitle}…` : "How can we help you?"} />
      </div>
      {error && <div className="form-error">{error}</div>}
      <div>
        <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send Enquiry"}
        </button>
      </div>
    </form>
  );
}
