"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="container nav">
        <Link className="logo" href="/"><span className="logo-mark">A</span> ALPHA CLASSES</Link>
        <nav className="nav-links">
          <Link href="/courses">Courses</Link>
          <Link href="/materials">Free Materials</Link>
          <Link href="/#features">Why Alpha</Link>
          <Link href="/tests">Test Series</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="nav-actions">
          <Link className="btn btn-outline" href="/login">Login</Link>
          <Link className="btn btn-primary" href="/signup">Join Now</Link>
          <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
        </div>
      </div>
      <div className={"mobile-menu" + (open ? " open" : "")} onClick={() => setOpen(false)}>
        <Link href="/courses">Courses</Link>
        <Link href="/materials">Free Materials</Link>
        <Link href="/#features">Why Alpha</Link>
        <Link href="/tests">Test Series</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Join Now</Link>
      </div>
    </header>
  );
}
