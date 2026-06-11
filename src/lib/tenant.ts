/**
 * Resolução do tenant (slug da loja) a partir do Host.
 * Sem imports de runtime — usável no middleware (edge) e em route handlers.
 */

const RESERVED_SUBDOMAINS = new Set(["www", "api", "app", "site"]);

function rootDomain(): string {
  return process.env.NEXT_PUBLIC_SHOWROOM_ROOT_DOMAIN || "byeauto.com.br";
}

export function defaultSlug(): string {
  return process.env.DEFAULT_BRANCH_SLUG || "carstock-sp";
}

/**
 * Extrai o slug de um host `{slug}.{ROOT_DOMAIN}` (ou `{slug}.localhost` em
 * dev). Retorna null quando o host não carrega um subdomínio de vitrine.
 */
export function deriveSlugFromHost(host: string | null | undefined): string | null {
  if (!host) return null;
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";

  for (const base of [rootDomain(), "localhost"]) {
    if (hostname.endsWith(`.${base}`)) {
      const sub = hostname.slice(0, -(base.length + 1));
      if (sub && !sub.includes(".") && !RESERVED_SUBDOMAINS.has(sub)) {
        return sub;
      }
      return null;
    }
  }
  return null;
}

/** Slug do host ou fallback de dev (DEFAULT_BRANCH_SLUG). */
export function resolveSlug(host: string | null | undefined): string {
  return deriveSlugFromHost(host) ?? defaultSlug();
}
