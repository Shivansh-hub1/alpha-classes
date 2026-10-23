"use client";

import { useState } from "react";
import Link from "next/link";
import type { Course } from "@/lib/db";
import { CourseIconBadge, IconVideo } from "@/components/Icons";

export default function CoursesList({ courses }: { courses: Course[] }) {
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");

  const levels = ["all", ...Array.from(new Set(courses.map((c) => c.level)))];

  const filtered = courses.filter((c) => {
    const matchesLevel = level === "all" || c.level.toLowerCase() === level.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div className="admin-tabs" style={{ margin: 0 }}>
          {levels.map((lvl) => (
            <button
              key={lvl}
              className={level === lvl ? "active" : ""}
              onClick={() => setLevel(lvl)}
            >
              {lvl === "all" ? "All Courses" : lvl}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 280, width: "100%" }}>
          <input
            className="input"
            type="search"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "9px 14px", fontSize: 14 }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 36, textAlign: "center" }}>
          <p className="muted" style={{ fontSize: 16 }}>
            No courses found matching &quot;{search}&quot;.
          </p>
          <button
            className="btn btn-outline"
            style={{ marginTop: 12 }}
            onClick={() => {
              setLevel("all");
              setSearch("");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((c) => (
            <Link key={c.id} className="card" href={`/courses/${c.slug}`}>
              <div className="card-top">
                <div className="icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  <CourseIconBadge level={c.level} icon={c.icon} size={28} />
                </div>
                <span className="level">{c.level}</span>
              </div>
              <div className="card-body">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <div className="meta">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <IconVideo size={15} /> {c.classes_count} Classes
                  </span>
                  <b>₹{c.price.toLocaleString("en-IN")}</b>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
