"use client";

import Link from "next/link";
import { useState } from "react";

export default function DemoModal({ variant = "button" }: { variant?: "button" | "play" }) {
  const [open, setOpen] = useState(false);
  const videoId = process.env.NEXT_PUBLIC_DEMO_VIDEO_ID;

  return (
    <>
      {variant === "play" ? (
        <button className="play" onClick={() => setOpen(true)} aria-label="Watch demo video">▶</button>
      ) : (
        <button className="btn btn-outline" onClick={() => setOpen(true)}>▶ Watch Demo</button>
      )}
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            <h2 style={{ fontSize: 21, letterSpacing: -0.5 }}>Watch a demo class</h2>
            <p className="muted" style={{ fontSize: 14 }}>See how Alpha Classes teaches — live concepts, practice and doubt solving.</p>
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Alpha Classes demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div style={{ background: "#111827", borderRadius: 14, padding: "40px 24px", textAlign: "center", margin: "12px 0" }}>
                <div style={{ fontSize: 34 }}>🎬</div>
                <p style={{ color: "#c7cdd8", fontSize: 14.5, margin: "8px 0 16px" }}>
                  Demo video is coming soon. Until then, book a free live demo class with our teachers.
                </p>
                <Link href="/contact" className="btn btn-primary">Book Free Demo Class</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
