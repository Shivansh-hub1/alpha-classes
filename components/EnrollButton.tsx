"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EnrollButton({ courseId, loggedIn, alreadyEnrolled }: { courseId: number; loggedIn: boolean; alreadyEnrolled: boolean }) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(alreadyEnrolled);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!loggedIn) {
    return (
      <Link className="btn btn-primary" href="/login" style={{ display: "block", textAlign: "center" }}>
        Login to Enroll
      </Link>
    );
  }

  if (enrolled) {
    return (
      <div>
        <span className="form-success" style={{ display: "block", textAlign: "center" }}>✓ Enrolled</span>
        <Link className="btn btn-outline" href="/dashboard" style={{ display: "block", textAlign: "center", marginTop: 8 }}>Go to Dashboard</Link>
      </div>
    );
  }

  async function enroll() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not enroll.");
      setEnrolled(true);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not enroll.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="btn btn-primary" style={{ width: "100%" }} onClick={enroll} disabled={loading}>
        {loading ? "Enrolling…" : "Enroll Now — Free"}
      </button>
      {err && <p className="form-error" style={{ marginTop: 8 }}>{err}</p>}
    </div>
  );
}
