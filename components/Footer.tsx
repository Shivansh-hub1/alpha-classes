import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="logo" href="/" style={{ color: "white" }}><span className="logo-mark">A</span> ALPHA CLASSES</Link>
            <p style={{ marginTop: 14, fontSize: 14 }}>Learn today. Lead tomorrow.</p>
          </div>
          <div>
            <div className="footer-title">Learning</div>
            <div className="footer-links">
              <Link href="/courses">Courses</Link>
              <Link href="/tests">Test Series</Link>
              <Link href="/courses">Study Material</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Company</div>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/about#careers">Careers</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Support</div>
            <div className="footer-links">
              <Link href="/contact">Help Center</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="copyright">© {new Date().getFullYear()} Alpha Classes. All rights reserved.</div>
      </div>
    </footer>
  );
}
