import Link from "next/link";

import { Search, X } from "lucide-react";

import { Button, buttonVariants } from "@/design-system/primitives/button";
import { Input } from "@/design-system/primitives/input";
import { Label } from "@/design-system/primitives/label";

export interface EstoqueFilters {
  brand?: string;
  model?: string;
  year?: string;
  minPrice?: string;
  maxPrice?: string;
  minKm?: string;
  maxKm?: string;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-5">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

/**
 * Filtros do estoque — formulário GET nativo (funciona sem JS) que rende
 * os search params para a própria /estoque, renderizada no servidor.
 */
export function FilterPanel({ filters }: { filters: EstoqueFilters }) {
  const hasActiveFilters = Object.values(filters).some((v) => v && v.length > 0);

  return (
    <form action="/estoque" method="GET" className="flex flex-col gap-5">
      <FilterSection title="Marca">
        <Input
          name="brand"
          placeholder="Ex.: Honda"
          defaultValue={filters.brand ?? ""}
          aria-label="Marca"
        />
      </FilterSection>

      <FilterSection title="Modelo">
        <Input
          name="model"
          placeholder="Ex.: Civic"
          defaultValue={filters.model ?? ""}
          aria-label="Modelo"
        />
      </FilterSection>

      <FilterSection title="Ano">
        <Input
          name="year"
          inputMode="numeric"
          placeholder="Ex.: 2022"
          defaultValue={filters.year ?? ""}
          className="num"
          aria-label="Ano"
        />
      </FilterSection>

      <FilterSection title="Faixa de preço">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="fp-min-price" className="sr-only">
              Preço mínimo
            </Label>
            <Input
              id="fp-min-price"
              name="minPrice"
              inputMode="numeric"
              placeholder="R$ mín"
              defaultValue={filters.minPrice ?? ""}
              className="num"
            />
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1">
            <Label htmlFor="fp-max-price" className="sr-only">
              Preço máximo
            </Label>
            <Input
              id="fp-max-price"
              name="maxPrice"
              inputMode="numeric"
              placeholder="R$ máx"
              defaultValue={filters.maxPrice ?? ""}
              className="num"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Quilometragem">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="fp-min-km" className="sr-only">
              Km mínima
            </Label>
            <Input
              id="fp-min-km"
              name="minKm"
              inputMode="numeric"
              placeholder="km mín"
              defaultValue={filters.minKm ?? ""}
              className="num"
            />
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1">
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
          </div>
        </div>
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
