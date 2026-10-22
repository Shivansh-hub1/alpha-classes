import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import Footer from "@/components/Footer";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  CANONICAL_SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: "Alpha Classes Bikapur — Best Coaching in Bikapur | JEE, NEET, Class 9–10 & SSC",
    template: "%s | Alpha Classes Bikapur",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "Alpha Classes Bikapur" }],
  creator: "Alpha Classes Bikapur",
  publisher: "Alpha Classes Bikapur",
  category: "education",
  openGraph: {
    type: "website",
    siteName: "Alpha Classes Bikapur",
    title: "Alpha Classes Bikapur — Best Coaching in Bikapur | Learn Today. Lead Tomorrow.",
    description: SITE_DESCRIPTION,
    url: CANONICAL_SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Alpha Classes Bikapur — Premier Coaching Institute for JEE, NEET, Foundation & SSC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Classes Bikapur — Learn Today. Lead Tomorrow.",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "B_z0BI96R7tdKgQ1A21ggTFeRWmTyoG4UX0Pj7_mFxM",
  },
  other: {
    "theme-color": "#ff6b00",
    "color-scheme": "light",
    "geo.region": "IN-UP",
    "geo.placename": "Bikapur",
    "geo.position": "26.6025;82.1378",
    "ICBM": "26.6025, 82.1378",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff6b00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const globalJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      websiteJsonLd(CANONICAL_SITE_URL),
      organizationJsonLd(CANONICAL_SITE_URL),
      {
        "@type": "EducationalApplication",
        "@id": `${CANONICAL_SITE_URL}/#app`,
        name: "Alpha Classes Learning Portal",
        url: CANONICAL_SITE_URL,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web, iOS, Android",
        description: SITE_DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
        featureList:
          "Live & recorded classes, Online test series with instant scoring, Chapter-wise answer keys and explanations, Free study materials & NCERT PDF downloads, Personal doubt support",
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        <ProgressBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
