"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const firstName = user?.name ? user.name.split(" ")[0] : null;

  return (
    <header>
      <div className="container nav">
        <Link className="logo" href="/" aria-label="Alpha Classes Bikapur Home">
          <span className="logo-mark">A</span>
          <span>ALPHA CLASSES <small style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", display: "block", letterSpacing: 0.5, marginTop: -4 }}>BIKAPUR</small></span>
        </Link>
        <nav className="nav-links" aria-label="Primary Navigation">
          <Link href="/courses">Courses</Link>
          <Link href="/tests">Test Series</Link>
          <Link href="/materials">Free Materials</Link>
          <Link href="/#features">Why Alpha</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <Link className="btn btn-primary" href="/dashboard">
                Hi {firstName} 👋 (Dashboard)
              </Link>
              <button
                className="btn btn-outline"
                onClick={handleLogout}
                style={{ padding: "8px 14px", fontSize: 13 }}
                title="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline" href="/login">Login</Link>
              <Link className="btn btn-primary" href="/signup">Join Now</Link>
            </>
          )}
          <button
            className="burger"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>
      <div className={"mobile-menu" + (open ? " open" : "")} onClick={() => setOpen(false)}>
        <Link href="/courses">Courses</Link>
        <Link href="/tests">Test Series</Link>
        <Link href="/materials">Free Materials</Link>
        <Link href="/#features">Why Alpha</Link>
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact</Link>
        {user ? (
          <>
            <Link href="/dashboard" style={{ fontWeight: 800, color: "var(--primary)" }}>
              My Dashboard ({firstName})
            </Link>
            <button
              onClick={handleLogout}
              style={{
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "10px 6px",
                fontSize: 15,
                fontWeight: 600,
                color: "#b42318",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup" style={{ fontWeight: 800, color: "var(--primary)" }}>Join Now</Link>
          </>
        )}
      </div>
    </header>
  );
}
