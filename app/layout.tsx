import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-classes.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Alpha Classes — Coaching Institute | Live Classes, Test Series & Study Material",
    template: "%s | Alpha Classes",
  },
  description:
    "Alpha Classes — live and recorded classes for Class 9–10, JEE, NEET, SSC and skill courses. Expert teachers, smart tests, structured study material and doubt support. Learn Today. Lead Tomorrow.",
  keywords: [
    "Alpha Classes", "coaching institute", "JEE coaching", "NEET coaching", "SSC exam preparation",
    "Class 10 foundation course", "online coaching classes", "test series", "web development course",
  ],
  openGraph: {
    type: "website",
    siteName: "Alpha Classes",
    title: "Alpha Classes — Learn Today. Lead Tomorrow.",
    description: "Live classes, expert teachers, smart tests and structured study material — everything students need in one place.",
    url: SITE,
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Classes — Learn Today. Lead Tomorrow.",
    description: "Live classes, expert teachers, smart tests and structured study material — everything students need in one place.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE },
};

export const viewport: Viewport = {
  themeColor: "#ff6b00",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Alpha Classes",
  url: SITE,
  slogan: "Learn Today. Lead Tomorrow.",
  description: "Coaching institute offering live and recorded classes, test series and study material for school, competitive and skill-based exams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
