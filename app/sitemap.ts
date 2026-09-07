import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://theagamyoga.com", lastModified: new Date() }];
}
