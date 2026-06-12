"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { FilterSelect } from "@/components/vehicle/FilterPanel";

const SORT_OPTIONS = [
  { value: "", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "km_asc", label: "Menor quilometragem" },
] as const;

/**
 * Ordenação da listagem — vive fora do form de filtros: troca o `sort` nos
 * search params preservando os filtros ativos e volta para a primeira página.
 */
export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "";

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams);
    if (event.target.value) {
      params.set("sort", event.target.value);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`/estoque${qs ? `?${qs}` : ""}`);
  }

  return (
    <FilterSelect
      name="sort"
      value={current}
      onChange={handleChange}
      aria-label="Ordenar por"
      className="w-auto min-w-44"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </FilterSelect>
  );
}
