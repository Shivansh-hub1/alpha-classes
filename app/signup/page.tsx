"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignupForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed.");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Create your free account 🚀</h1>
        <p className="sub">Join Alpha Classes — take free tests and track your progress.</p>
        <form className="form" onSubmit={submit}>
          <div>
            <label htmlFor="su-name">Full name</label>
            <input id="su-name" className="input" value={form.name} onChange={set("name")} required placeholder="Your full name" />
          </div>
          <div>
            <label htmlFor="su-email">Email</label>
            <input id="su-email" className="input" type="email" value={form.email} onChange={set("email")} required placeholder="you@email.com" />
          </div>
          <div>
            <label htmlFor="su-phone">Mobile number</label>
            <input id="su-phone" className="input" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile (optional)" inputMode="numeric" />
          </div>
          <div>
            <label htmlFor="su-pass">Password</label>
            <input id="su-pass" className="input" type="password" value={form.password} onChange={set("password")} required placeholder="At least 6 characters" minLength={6} />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating account…" : "Create Free Account"}</button>
        </form>
        <p className="alt">Already have an account? <Link href="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
