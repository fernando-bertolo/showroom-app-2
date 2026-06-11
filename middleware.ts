import { NextResponse, type NextRequest } from "next/server";

import { resolveSlug } from "@/lib/tenant";

/**
 * Multi-tenant por subdomínio: {slug}.byeauto.com.br (ou {slug}.localhost:3001
 * em dev). O slug resolvido é propagado para server components e route
 * handlers via request header `x-branch-slug`.
 */
export function middleware(request: NextRequest) {
  const slug = resolveSlug(request.headers.get("host"));

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
