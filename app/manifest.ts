import type { MetadataRoute } from "next";
import { sv } from "@/lib/copy/sv";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: sv.site.name,
    short_name: "Skafferiet",
    description: sv.site.description,
    lang: "sv",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbf8f2",
    theme_color: "#2f5a3e",
    categories: ["food", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: sv.nav.shop, url: "/butik" },
      { name: sv.nav.producers, url: "/producenter" },
    ],
  };
}
