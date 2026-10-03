import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alpha Classes — Learn Today. Lead Tomorrow.",
    short_name: "Alpha Classes",
    description: "Live classes, test series and study material for Class 9–10, JEE, NEET, SSC and skill courses.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff6b00",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
