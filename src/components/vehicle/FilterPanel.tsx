"use client";

import * as React from "react";

import Link from "next/link";

import { ChevronDown, Search, X } from "lucide-react";

import { Button, buttonVariants } from "@/design-system/primitives/button";
import { Input } from "@/design-system/primitives/input";
import { Label } from "@/design-system/primitives/label";
import { cn } from "@/lib/utils";

import type { VehicleFacets } from "@/types/vehicle";

export interface EstoqueFilters {
  brand?: string;
  model?: string;
  minYear?: string;
  maxYear?: string;
  maxKm?: string;
  sort?: string;
}

const SORT_OPTIONS = [
  { value: "", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "year_desc", label: "Mais novos" },
  { value: "year_asc", label: "Mais antigos" },
  { value: "km_asc", label: "Menor quilometragem" },
] as const;

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-5">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function FilterSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-8 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 [&>optgroup]:bg-popover [&>optgroup]:text-popover-foreground [&>option]:bg-popover [&>option]:text-popover-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

/**
 * Filtros do estoque — formulário GET nativo que rende os search params para
 * a própria /estoque, renderizada no servidor. As opções de marca/modelo/ano
 * vêm dos facets do estoque disponível; o select de modelo acompanha a marca
 * escolhida.
 */
export function FilterPanel({
  filters,
  facets,
}: {
  filters: EstoqueFilters;
  facets: VehicleFacets | null;
}) {
  const brands = facets?.brands ?? [];
  const years = facets?.years ?? [];

  const [brand, setBrand] = React.useState(filters.brand ?? "");
  const [model, setModel] = React.useState(filters.model ?? "");

  const selectedBrand = brands.find((b) => b.name === brand);
  const hasActiveFilters = Object.values(filters).some((v) => v && v.length > 0);

  function handleBrandChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    setBrand(next);
    const nextBrand = brands.find((b) => b.name === next);
    if (model && nextBrand && !nextBrand.models.includes(model)) {
      setModel("");
    }
  }

  return (
    <form action="/estoque" method="GET" className="flex flex-col gap-5">
      <FilterSection title="Marca">
        <FilterSelect name="brand" value={brand} onChange={handleBrandChange} aria-label="Marca">
          <option value="">Todas as marcas</option>
          {brands.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </FilterSelect>
      </FilterSection>

      <FilterSection title="Modelo">
        <FilterSelect
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          aria-label="Modelo"
        >
          <option value="">Todos os modelos</option>
          {selectedBrand
            ? selectedBrand.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))
            : brands.map((b) => (
                <optgroup key={b.name} label={b.name}>
                  {b.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </optgroup>
              ))}
        </FilterSelect>
      </FilterSection>

      <FilterSection title="Ano">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="fp-min-year" className="sr-only">
              Ano mínimo
            </Label>
            <FilterSelect
              id="fp-min-year"
              name="minYear"
              defaultValue={filters.minYear ?? ""}
              className="num"
            >
              <option value="">De</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </FilterSelect>
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1">
            <Label htmlFor="fp-max-year" className="sr-only">
              Ano máximo
            </Label>
            <FilterSelect
              id="fp-max-year"
              name="maxYear"
              defaultValue={filters.maxYear ?? ""}
              className="num"
            >
              <option value="">Até</option>
              {[...years].reverse().map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Quilometragem">
        <Label htmlFor="fp-max-km" className="sr-only">
          Km máxima
        </Label>
        <Input
          id="fp-max-km"
          name="maxKm"
          inputMode="numeric"
          placeholder="km máx"
          defaultValue={filters.maxKm ?? ""}
          className="num"
        />
      </FilterSection>

      <FilterSection title="Ordenar por">
        <FilterSelect name="sort" defaultValue={filters.sort ?? ""} aria-label="Ordenar por">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FilterSelect>
      </FilterSection>

      <Button type="submit" variant="outline" size="sm" className="w-full">
        <Search /> Aplicar filtros
      </Button>

      {hasActiveFilters && (
        <Link
          href="/estoque"
          className={buttonVariants({ variant: "ghost", size: "sm", className: "self-start" })}
        >
          <X /> Limpar filtros
        </Link>
      )}
    </form>
  );
}
