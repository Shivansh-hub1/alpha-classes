import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alpha Classes Bikapur — Learn Today. Lead Tomorrow.",
    short_name: "Alpha Classes",
    description:
      "Premier coaching institute in Bikapur for Class 9–10, JEE, NEET, SSC, and skill courses with live classes and online test series.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff6b00",
    orientation: "portrait-primary",
    categories: ["education", "coaching", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        sizes: "64x64 32x32",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
