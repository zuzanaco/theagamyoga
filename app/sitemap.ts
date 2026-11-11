import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/de"].map(path => ({ url: `https://theagamyoga.com${path}`, lastModified: new Date(), alternates: { languages: { en: "https://theagamyoga.com", de: "https://theagamyoga.com/de" } } }));
}
