import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/design-system/primitives/button";
import { cn } from "@/lib/utils";

import type { PageMetadata } from "@/types/vehicle";

interface PaginationProps {
  metadata: PageMetadata;
  /** Search params atuais (sem `page`) a preservar nos links. */
  searchParams: Record<string, string>;
}

function pageHref(searchParams: Record<string, string>, page: number): string {
  const params = new URLSearchParams(searchParams);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return `/estoque${qs ? `?${qs}` : ""}`;
}

/** Paginação por links (URL 1-based; API 0-based), preservando filtros. */
export function Pagination({ metadata, searchParams }: PaginationProps) {
  if (metadata.totalPages <= 1) return null;

  const current = metadata.page + 1; // 1-based
  const totalPages = metadata.totalPages;

  // Janela de páginas ao redor da atual.
  const pages: number[] = [];
  for (let p = Math.max(1, current - 2); p <= Math.min(totalPages, current + 2); p++) {
    pages.push(p);
  }

  return (
    <nav aria-label="Paginação" className="mt-8 flex items-center justify-center gap-1.5">
      {metadata.first ? (
        <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
          <ChevronLeft /> Anterior
        </span>
      ) : (
        <Link
          href={pageHref(searchParams, current - 1)}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ChevronLeft /> Anterior
        </Link>
      )}

      {pages[0] !== undefined && pages[0] > 1 && (
        <span className="px-1 text-sm text-muted-foreground">…</span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(searchParams, p)}
          aria-current={p === current ? "page" : undefined}
          className={cn(
            buttonVariants({ variant: p === current ? "default" : "ghost", size: "sm" }),
            "num min-w-9",
          )}
        >
          {p}
        </Link>
      ))}

      {pages[pages.length - 1] !== undefined && pages[pages.length - 1]! < totalPages && (
        <span className="px-1 text-sm text-muted-foreground">…</span>
      )}

      {metadata.last ? (
        <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
          Próxima <ChevronRight />
        </span>
      ) : (
        <Link
          href={pageHref(searchParams, current + 1)}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Próxima <ChevronRight />
        </Link>
      )}
    </nav>
  );
}
