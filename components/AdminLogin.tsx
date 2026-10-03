"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>🔐 Admin Login</h1>
          <p className="sub">Restricted area — Alpha Classes staff only.</p>
          <form className="form" onSubmit={submit}>
            <div>
              <label htmlFor="ad-pass">Admin password</label>
              <input id="ad-pass" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Admin password" />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Checking…" : "Login"}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
