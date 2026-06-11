import { headers } from "next/headers";

import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3001";
  const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${protocol}://${host}/sitemap.xml`,
  };
}
