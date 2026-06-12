import { NextResponse, type NextRequest } from "next/server";

import { resolveSlugByCustomDomain } from "@/lib/customDomain";
import { defaultSlug, deriveSlugFromHost } from "@/lib/tenant";

/**
 * Multi-tenant por Host: subdomínio {slug}.byeauto.com.br (ou
 * {slug}.localhost:3001 em dev) e domínio próprio do lojista
 * (ex: minhaloja.com.br, resolvido via API com cache). O slug resolvido é
 * propagado para server components e route handlers via `x-branch-slug`.
 */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const slug =
    deriveSlugFromHost(host) ??
    (await resolveSlugByCustomDomain(host)) ??
    defaultSlug();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-branch-slug", slug);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Tudo, exceto assets estáticos do Next e arquivos públicos comuns.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|logo-mark.svg).*)"],
};
