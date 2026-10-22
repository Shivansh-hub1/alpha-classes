import Link from "next/link";
import { INSTITUTE_INFO } from "@/lib/seo";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="logo" href="/" style={{ color: "white" }}>
              <span className="logo-mark">A</span>
              <span>ALPHA CLASSES <small style={{ fontSize: 10, color: "var(--primary)", display: "block", letterSpacing: 0.5 }}>BIKAPUR, AYODHYA</small></span>
            </Link>
            <p style={{ marginTop: 12, fontSize: 13.5, color: "#9ca3af", lineHeight: 1.6 }}>
              Alpha Classes Bikapur is the top coaching center in Bikapur (Ayodhya) for Class 9–10, JEE, NEET, SSC and computer skill courses. Learn Today. Lead Tomorrow.
            </p>
            <p style={{ marginTop: 10, fontSize: 13, color: "#9ca3af" }}>
              📍 {INSTITUTE_INFO.address.streetAddress}, {INSTITUTE_INFO.address.addressLocality}
            </p>
          </div>

          <div>
            <div className="footer-title">Academic Programs</div>
            <div className="footer-links">
              <Link href="/courses">All Courses</Link>
              <Link href="/tests">Online Test Series</Link>
              <Link href="/materials">Free Study Material & PDFs</Link>
              <Link href="/courses/jee-preparation">JEE Coaching</Link>
              <Link href="/courses/neet-preparation">NEET Coaching</Link>
              <Link href="/courses/class-9-10-foundation">Class 9–10 Foundation</Link>
            </div>
          </div>

          <div>
            <div className="footer-title">Institute</div>
            <div className="footer-links">
              <Link href="/about">About Alpha Classes</Link>
              <Link href="/contact">Contact & Center Address</Link>
              <Link href="/about#careers">Faculty Careers</Link>
              <Link href="/#faq">Admissions FAQ</Link>
            </div>
          </div>

          <div>
            <div className="footer-title">Student Portal & Legal</div>
            <div className="footer-links">
              <Link href="/login">Student Login</Link>
              <Link href="/signup">Create Free Account</Link>
              <Link href="/dashboard">My Dashboard</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms & Conditions</Link>
              <Link href="/admin">Staff & Admin Panel</Link>
            </div>
          </div>
        </div>

        <div className="copyright" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>© {new Date().getFullYear()} Alpha Classes Bikapur. All rights reserved.</div>
          <div style={{ color: "#6b7280", fontSize: 12 }}>
            Keywords: coaching in bikapur · best coaching in bikapur · alpha classes bikapur
          </div>
        </div>
      </div>
    </footer>
  );
}
