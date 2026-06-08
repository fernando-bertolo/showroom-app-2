import * as React from "react";

import { getRouteApi } from "@tanstack/react-router";
import { Search, SearchX } from "lucide-react";

import { Hero } from "@/components/vehicle/Hero";
import { FilterRail } from "@/components/vehicle/FilterRail";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { EmptyState } from "@/design-system/patterns/EmptyState";
import { ErrorState } from "@/design-system/patterns/ErrorState";
import { Input } from "@/design-system/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/design-system/primitives/select";
import { useVehicles } from "@/hooks/useVehicles";
import { searchToFilters, type EstoqueSearch } from "@/types/search";
import type { SortBy } from "@/types/vehicle";

const routeApi = getRouteApi("/estoque");

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "relevant", label: "Mais relevantes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "km-asc", label: "Menor quilometragem" },
  { value: "year-desc", label: "Mais novos" },
];

function VehicleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-6 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function EstoquePage() {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const listingRef = React.useRef<HTMLDivElement>(null);

  const filters = React.useMemo(() => searchToFilters(search), [search]);
  const { data, isPending, isError, refetch, isFetching } = useVehicles(filters);

  const [buscaInput, setBuscaInput] = React.useState(search.busca);
  React.useEffect(() => setBuscaInput(search.busca), [search.busca]);

  const patchSearch = React.useCallback(
    (patch: Partial<EstoqueSearch>) => {
      void navigate({ search: (prev) => ({ ...prev, ...patch }) });
    },
    [navigate],
  );

  // Debounce da busca textual.
  React.useEffect(() => {
    if (buscaInput === search.busca) return;
    const t = window.setTimeout(() => patchSearch({ busca: buscaInput }), 350);
    return () => window.clearTimeout(t);
  }, [buscaInput, search.busca, patchSearch]);

  const clearFilters = () =>
    void navigate({
      search: { marcas: [], cambio: [], portas: [], precoMin: null, precoMax: null, busca: "", sort: search.sort },
    });

  const scrollToListing = () =>
    listingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <Hero onSearch={scrollToListing} />

      <main ref={listingRef} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <FilterRail
              filters={filters}
              onChange={(patch) => patchSearch(patch)}
              onClear={clearFilters}
            />
          </div>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Veículos disponíveis
                {data && (
                  <span className="num ml-2 text-sm font-normal text-muted-foreground">
                    {data.matched} de {data.total}
                  </span>
                )}
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar veículo"
                    className="w-full pl-9 sm:w-56"
                    value={buscaInput}
                    onChange={(e) => setBuscaInput(e.target.value)}
                  />
                </div>
                <Select
                  value={search.sort}
                  onValueChange={(value) => patchSearch({ sort: value as SortBy })}
                >
                  <SelectTrigger className="w-[180px] shrink-0" aria-label="Ordenar">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isError ? (
              <ErrorState onRetry={() => void refetch()} />
            ) : isPending ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            ) : data.vehicles.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Nenhum veículo encontrado"
                description="Tente remover alguns filtros ou pesquisar por outra marca."
              />
            ) : (
              <div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 200ms" }}
              >
                {data.vehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
