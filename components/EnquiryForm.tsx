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

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: cleanPhone, message, courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send inquiry.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="form-success" style={{ padding: "18px 20px" }}>
        <h4 style={{ fontSize: 16, marginBottom: 4 }}>✓ Enquiry Received!</h4>
        <p style={{ margin: 0, fontSize: 14 }}>
          Thank you, {name.split(" ")[0]}! Your enquiry has been received
          {courseTitle ? ` for ${courseTitle}` : ""}. Our Bikapur admissions team will call or WhatsApp you shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} style={{ maxWidth: 560 }}>
      <div>
        <label htmlFor="eq-name">Your Full Name *</label>
        <input
          id="eq-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Amit Kumar"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label htmlFor="eq-email">Email Address *</label>
          <input
            id="eq-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label htmlFor="eq-phone">10-Digit Mobile Number *</label>
          <input
            id="eq-phone"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="e.g. 9876543210"
            inputMode="numeric"
            maxLength={10}
          />
        </div>
      </div>
      <div>
        <label htmlFor="eq-msg">Message / Inquiry (Optional)</label>
        <textarea
          id="eq-msg"
          className="input"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            courseTitle
              ? `I want to know batch timings, fee, and demo class for ${courseTitle}…`
              : "Ask about batch timings, fees, demo classes, or coaching programs in Bikapur…"
          }
        />
      </div>
      {error && <div className="form-error">{error}</div>}
      <div>
        <button className="btn btn-primary" type="submit" disabled={status === "loading"} style={{ padding: "12px 28px" }}>
          {status === "loading" ? "Submitting Inquiry…" : "Submit Admission Inquiry →"}
        </button>
      </div>
    </form>
  );
}
