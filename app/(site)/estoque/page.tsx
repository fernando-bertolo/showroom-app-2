import type { Metadata } from "next";

import { SearchX } from "lucide-react";

import { FilterPanel, type EstoqueFilters } from "@/components/vehicle/FilterPanel";
import { Hero } from "@/components/vehicle/Hero";
import { Pagination } from "@/components/vehicle/Pagination";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { EmptyState } from "@/design-system/patterns/EmptyState";
import { ErrorState } from "@/design-system/patterns/ErrorState";
import { getSlug, getVehicles, type VehicleQuery } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Estoque",
};

const PAGE_SIZE = 12;

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.trim() ? v.trim() : undefined;
}

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value.replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;

  const filters: EstoqueFilters = {
    brand: first(sp.brand),
    model: first(sp.model),
    year: first(sp.year),
    minPrice: first(sp.minPrice),
    maxPrice: first(sp.maxPrice),
    minKm: first(sp.minKm),
    maxKm: first(sp.maxKm),
  };
  const pageParam = toNumber(first(sp.page)) ?? 1; // URL 1-based

  const query: VehicleQuery = {
    brand: filters.brand,
    model: filters.model,
    year: toNumber(filters.year),
    minPrice: toNumber(filters.minPrice),
    maxPrice: toNumber(filters.maxPrice),
    minKm: toNumber(filters.minKm),
    maxKm: toNumber(filters.maxKm),
    page: pageParam - 1, // API 0-based
    size: PAGE_SIZE,
  };

  const slug = await getSlug();
  const [data, unfiltered] = await Promise.all([
    getVehicles(slug, query),
    getVehicles(slug, { size: 1, page: 0 }),
  ]);

  const total = unfiltered?.metadata.totalElements ?? null;

  // Search params "limpos" (só filtros ativos) para os links de paginação.
  const activeParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value) activeParams[key] = value;
  }

  return (
    <>
      <Hero total={total} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <FilterPanel filters={filters} />
          </div>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Veículos disponíveis
                {data && total != null && (
                  <span className="num ml-2 text-sm font-normal text-muted-foreground">
                    {formatNumber(data.metadata.totalElements)} de {formatNumber(total)}
                  </span>
                )}
              </h2>
            </div>

            {!data ? (
              <ErrorState
                title="Não foi possível carregar o estoque"
                message="Tente recarregar a página em alguns instantes."
              />
            ) : data.content.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Nenhum veículo encontrado"
                description="Tente remover alguns filtros ou pesquisar por outra marca."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {data.content.map((v) => (
                    <VehicleCard key={v.publicId} vehicle={v} />
                  ))}
                </div>
                <Pagination metadata={data.metadata} searchParams={activeParams} />
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
