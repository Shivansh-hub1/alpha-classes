import { headers } from "next/headers";

export const SITE_NAME = "Alpha Classes";
export const SITE_TAGLINE = "Learn Today. Lead Tomorrow.";
export const SITE_DESCRIPTION =
  "Alpha Classes Bikapur is the best coaching institute in Bikapur (Ayodhya) offering live & offline classes, chapter-wise test series, expert faculty, free study materials, and doubt support for Class 9–10, JEE, NEET, SSC, and computer skill courses.";

export const CANONICAL_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://alpha-classes.vercel.app");

export const FOUNDER_INFO = {
  name: "Er. Shivansh Verma",
  role: "Founder & Academic Director",
  qualification: "B.Tech (CSE) & Senior Physics Mentor",
  bio: "Senior educator with over 8 years of experience mentoring students for JEE Main/Advanced, NEET UG, and CBSE Board exams. Founded Alpha Classes Bikapur to provide Kota-level concept clarity, rigorous test series, and personalized mentoring to students across Bikapur and Ayodhya.",
  image: `${CANONICAL_SITE_URL}/icon.svg`,
  sameAs: "https://github.com/Shivansh-hub1",
};

export const INSTITUTE_INFO = {
  name: "Alpha Classes",
  legalName: "Alpha Classes Coaching Institute Bikapur",
  alternateName: "Alpha Classes Bikapur",
  slogan: SITE_TAGLINE,
  url: CANONICAL_SITE_URL,
  logo: `${CANONICAL_SITE_URL}/icon.svg`,
  image: `${CANONICAL_SITE_URL}/opengraph-image`,
  telephone: "+91-9876543210",
  email: "alphaclassesbikapur@gmail.com",
  address: {
    streetAddress: "Main Road, Near Tehsil / Block Office, Bikapur",
    addressLocality: "Bikapur",
    addressRegion: "Ayodhya, Uttar Pradesh",
    postalCode: "224206",
    addressCountry: "IN",
  },
  geo: {
    latitude: 26.6025,
    longitude: 82.1378,
  },
  priceRange: "₹499 - ₹1499",
  openingHours: "Mo-Sa 07:00-19:30",
  founder: FOUNDER_INFO.name,
};

export const SITE_KEYWORDS = [
  // Primary Bikapur keywords (with and without spaces)
  "alpha classes",
  "alphaclasses",
  "alpha classes bikapur",
  "alphaclassesbikapur",
  "alpha coaching bikapur",
  "alphacoachingbikapur",
  "coaching in bikapur",
  "coachinginbikapur",
  "best coaching in bikapur",
  "bestcoachinginbikapur",
  "top coaching in bikapur",
  "topcoachinginbikapur",
  "best coaching institute in bikapur",
  "bestcoachinginstituteinbikapur",
  "coaching institute in bikapur",
  "coachinginstituteinbikapur",
  "bikapur coaching",
  "bikapurcoaching",
  "bikapur coaching center",
  "bikapurcoachingcenter",
  "bikapur coaching classes",
  "bikapurcoachingclasses",

  // Regional (Ayodhya / Faizabad)
  "alpha classes ayodhya",
  "alphaclassesayodhya",
  "coaching in ayodhya",
  "best coaching in ayodhya",
  "coaching in faizabad",

  // Course & Exam-specific in Bikapur
  "jee coaching in bikapur",
  "jeecoachinginbikapur",
  "neet coaching in bikapur",
  "neetcoachinginbikapur",
  "ssc coaching in bikapur",
  "ssccoachinginbikapur",
  "class 10 coaching in bikapur",
  "class10coachinginbikapur",
  "class 9 coaching in bikapur",
  "class9coachinginbikapur",
  "computer coaching in bikapur",
  "computercoachinginbikapur",
  "web development course in bikapur",
  "maths coaching in bikapur",
  "science coaching in bikapur",

  // Test series & Study Material
  "test series in bikapur",
  "testseriesinbikapur",
  "free mock test online",
  "online test series with instant result",
  "JEE Main test series",
  "NEET mock test series",
  "Class 10 science practice test",
  "SSC CGL practice test",
  "free study material PDF",
  "NCERT notes download",
  "Alpha Classes test series",
  "alphaclassestests",
];

/** Absolute base URL of the current request */
export function siteBaseUrl(): string {
  try {
    const h = headers();
    const host = h.get("host");
    if (host) {
      const proto =
        h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {}
  return CANONICAL_SITE_URL;
}

/** Guarantee HTTPS URL for sitemap/robots */
export function siteBaseUrlHttps(): string {
  try {
    const base = siteBaseUrl();
    if (base.startsWith("http://localhost")) return base;
    return base.replace(/^http:\/\//, "https://");
  } catch {
    return CANONICAL_SITE_URL;
  }
}

// ============ Schema.org JSON-LD Generators ============

export function websiteJsonLd(baseUrl = CANONICAL_SITE_URL) {
  return {
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: `${baseUrl}/`,
    name: "Alpha Classes Bikapur",
    alternateName: ["Alpha Classes", "AlphaClassesBikapur", "Alpha Classes Ayodhya"],
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${baseUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/courses?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(baseUrl = CANONICAL_SITE_URL) {
  return {
    "@type": "EducationalOrganization",
    "@id": `${baseUrl}/#organization`,
    name: "Alpha Classes Bikapur",
    alternateName: [
      "Alpha Classes",
      "AlphaClasses",
      "AlphaClassesBikapur",
      "Best Coaching in Bikapur",
      "Alpha Coaching Bikapur",
    ],
    legalName: INSTITUTE_INFO.legalName,
    url: `${baseUrl}/`,
    logo: `${baseUrl}/icon.svg`,
    image: `${baseUrl}/opengraph-image`,
    slogan: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    email: INSTITUTE_INFO.email,
    telephone: INSTITUTE_INFO.telephone,
    founder: {
      "@type": "Person",
      name: FOUNDER_INFO.name,
      jobTitle: FOUNDER_INFO.role,
      description: FOUNDER_INFO.bio,
      sameAs: [FOUNDER_INFO.sameAs],
    },
    address: {
      "@type": "PostalAddress",
      ...INSTITUTE_INFO.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: INSTITUTE_INFO.geo.latitude,
      longitude: INSTITUTE_INFO.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: "Bikapur" },
      { "@type": "City", name: "Ayodhya" },
      { "@type": "AdministrativeArea", name: "Uttar Pradesh" },
      { "@type": "Country", name: "India" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: INSTITUTE_INFO.telephone,
      contactType: "student admissions & inquiries",
      availableLanguage: ["Hindi", "English"],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "348",
      reviewCount: "215",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Coaching Courses & Test Series",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Class 9 & 10 CBSE / UP Board Foundation" },
        { "@type": "OfferCatalog", name: "JEE Main & Advanced Preparation" },
        { "@type": "OfferCatalog", name: "NEET Medical Entrance Preparation" },
        { "@type": "OfferCatalog", name: "SSC Government Exam Preparation" },
        { "@type": "OfferCatalog", name: "Computer & Web Development Skills" },
      ],
    },
  };
}

export function courseJsonLd(
  course: {
    slug: string;
    title: string;
    description: string;
    price: number;
    classes_count: number;
    level: string;
  },
  baseUrl = CANONICAL_SITE_URL
) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${baseUrl}/courses/${course.slug}#course`,
    name: `${course.title} — Alpha Classes Bikapur`,
    description: `${course.description} Delivered by expert faculty at Alpha Classes Bikapur.`,
    url: `${baseUrl}/courses/${course.slug}`,
    provider: { "@id": `${baseUrl}/#organization` },
    educationalLevel: course.level,
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "INR",
      category: "Paid",
      availability: "https://schema.org/InStock",
      validFrom: "2024-01-01",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["online", "blended", "onsite"],
      courseWorkload: `${course.classes_count} live & recorded classes`,
    },
  };
}

export function quizJsonLd(
  test: {
    slug: string;
    title: string;
    description: string;
    duration_min: number;
    category?: string;
    question_count?: number;
  },
  baseUrl = CANONICAL_SITE_URL
) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": `${baseUrl}/tests/${test.slug}#quiz`,
    name: `${test.title} — Online Practice Test | Alpha Classes Bikapur`,
    description: test.description,
    url: `${baseUrl}/tests/${test.slug}`,
    timeRequired: `PT${test.duration_min}M`,
    educationalLevel: test.category || "Competitive / Foundation",
    publisher: { "@id": `${baseUrl}/#organization` },
    numberOfQuestions: test.question_count || 10,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  baseUrl = CANONICAL_SITE_URL
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${baseUrl}${item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
