import { headers } from "next/headers";

import { getVehicles } from "@/lib/api";
import { resolveSlug } from "@/lib/tenant";

import type { MetadataRoute } from "next";

/** Sitemap dinâmico por tenant, com URLs absolutas baseadas no host. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3001";
  const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
  const base = `${protocol}://${host}`;

  const slug = h.get("x-branch-slug") ?? resolveSlug(host);

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/estoque`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/vender`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/onde-estamos`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const list = await getVehicles(slug, { size: 60, page: 0 });
  if (list) {
    for (const vehicle of list.content) {
      entries.push({
        url: `${base}/veiculo/${vehicle.publicId}`,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  return entries;
}
