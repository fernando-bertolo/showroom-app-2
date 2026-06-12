/**
 * Resolução de domínio próprio do lojista (ex: minhaloja.com.br) para slug,
 * consultando o endpoint público da API. Usado pelo middleware quando o Host
 * não é um subdomínio {slug}.{ROOT_DOMAIN}.
 *
 * Sem imports de runtime — roda no edge (middleware).
 */

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api/v1";

// Cache em memória por isolate: evita uma chamada à API a cada request.
// Negativo também é cacheado (domínio desconhecido continua desconhecido).
const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { slug: string | null; expires: number }>();

export async function resolveSlugByCustomDomain(
  host: string | null | undefined,
): Promise<string | null> {
  if (!host) return null;
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  if (!hostname || !hostname.includes(".")) return null;
  // Domínios da própria plataforma nunca são custom domain.
  if (hostname.endsWith(".netlify.app")) return null;

  const hit = cache.get(hostname);
  if (hit && hit.expires > Date.now()) return hit.slug;

  try {
    const res = await fetch(
      `${API_BASE_URL}/showroom/resolve?host=${encodeURIComponent(hostname)}`,
      { headers: { accept: "application/json" } },
    );
    const slug = res.ok ? ((await res.json()).branchSlug ?? null) : null;
    cache.set(hostname, { slug, expires: Date.now() + TTL_MS });
    return slug;
  } catch (error) {
    // API indisponível: não cacheia, tenta de novo na próxima request.
    console.error(`[showroom-api] falha ao resolver host ${hostname}`, error);
    return null;
  }
}
