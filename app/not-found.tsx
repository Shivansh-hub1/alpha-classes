import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <div>
        <div className="nf-code">404</div>
        <h1>This page bunked class! 🙈</h1>
        <p>The page you are looking for doesn&apos;t exist or has moved. Let&apos;s get you back to learning.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="/">← Back to Home</Link>
          <Link className="btn btn-outline" href="/courses">Browse Courses</Link>
        </div>
      </div>
    </main>
  );
}
