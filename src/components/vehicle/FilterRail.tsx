import * as React from "react";

import { X } from "lucide-react";

import { Button } from "@/design-system/primitives/button";
import { Checkbox } from "@/design-system/primitives/checkbox";
import { Input } from "@/design-system/primitives/input";
import { useMarcas } from "@/hooks/useVehicles";
import { cn } from "@/lib/utils";

import type { VehicleFilters } from "@/api/vehicles";

const CAMBIOS = ["Automático", "CVT", "Manual"] as const;
const PORTAS = [2, 4] as const;

interface FilterRailProps {
  filters: VehicleFilters;
  onChange: (patch: Partial<VehicleFilters>) => void;
  onClear: () => void;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-5">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  muted,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  muted?: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 py-1.5 text-sm">
      <span className="flex items-center gap-2.5">
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <span className={cn(muted && "text-muted-foreground")}>{label}</span>
      </span>
      {count != null && <span className="num text-xs text-muted-foreground">{count}</span>}
    </label>
  );
}

export function FilterRail({ filters, onChange, onClear }: FilterRailProps) {
  const { data: marcas } = useMarcas();
  const [precoMin, setPrecoMin] = React.useState(filters.precoMin?.toString() ?? "");
  const [precoMax, setPrecoMax] = React.useState(filters.precoMax?.toString() ?? "");

  // Mantém os inputs em sincronia se os filtros forem limpos externamente.
  React.useEffect(() => {
    setPrecoMin(filters.precoMin?.toString() ?? "");
    setPrecoMax(filters.precoMax?.toString() ?? "");
  }, [filters.precoMin, filters.precoMax]);

  const applyRange = () => {
    onChange({
      precoMin: precoMin ? Number(precoMin) : null,
      precoMax: precoMax ? Number(precoMax) : null,
    });
  };

  const hasActiveFilters =
    filters.marcas.length > 0 ||
    filters.cambio.length > 0 ||
    filters.portas.length > 0 ||
    filters.precoMin != null ||
    filters.precoMax != null ||
    filters.busca.length > 0;

  return (
    <aside className="flex flex-col gap-5">
      <FilterSection title="Marca">
        <div className="flex flex-col">
          {marcas?.map((m) => (
            <CheckRow
              key={m.name}
              label={m.name}
              count={m.count}
              muted={m.count === 0}
              checked={filters.marcas.includes(m.name)}
              onChange={() => onChange({ marcas: toggle(filters.marcas, m.name) })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Faixa de preço">
        <div className="flex items-center gap-2">
          <Input
            inputMode="numeric"
            placeholder="R$ mín"
            value={precoMin}
            onChange={(e) => setPrecoMin(e.target.value.replace(/\D/g, ""))}
            onBlur={applyRange}
            className="num"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            inputMode="numeric"
            placeholder="R$ máx"
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value.replace(/\D/g, ""))}
            onBlur={applyRange}
            className="num"
          />
        </div>
        <Button variant="outline" size="sm" className="mt-2.5 w-full" onClick={applyRange}>
          Aplicar
        </Button>
      </FilterSection>

      <FilterSection title="Câmbio">
        <div className="flex flex-col">
          {CAMBIOS.map((c) => (
            <CheckRow
              key={c}
              label={c}
              checked={filters.cambio.includes(c)}
              onChange={() => onChange({ cambio: toggle(filters.cambio, c) })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Portas">
        <div className="flex flex-col">
          {PORTAS.map((p) => (
            <CheckRow
              key={p}
              label={`${p} portas`}
              checked={filters.portas.includes(p)}
              onChange={() => onChange({ portas: toggle(filters.portas, p) })}
            />
          ))}
        </div>
      </FilterSection>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="self-start" onClick={onClear}>
          <X /> Limpar filtros
        </Button>
      )}
    </aside>
  );
}
