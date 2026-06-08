import { Link } from "@tanstack/react-router";
import { ArrowRight, Cog, Fuel, Gauge, Heart, Scale } from "lucide-react";

import { StatusBadge } from "@/design-system/patterns/StatusBadge";
import { formatCurrencyBRL, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/stores/favorites";

import { VehiclePhoto } from "./VehiclePhoto";

import type { Vehicle } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  onToggleCompare?: (id: string) => void;
  isComparing?: boolean;
  compareFull?: boolean;
}

export function VehicleCard({
  vehicle,
  onToggleCompare,
  isComparing,
  compareFull,
}: VehicleCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(vehicle.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <Link
        to="/veiculo/$id"
        params={{ id: vehicle.id }}
        className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        aria-label={`${vehicle.marca} ${vehicle.modelo} ${vehicle.versao}`}
      />

      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <VehiclePhoto vehicle={vehicle} />
        <StatusBadge
          status={vehicle.status}
          withIcon
          className="absolute top-3 left-3 bg-card/90 backdrop-blur-xs"
        />

        <div className="absolute top-3 right-3 z-20 flex gap-1.5">
          {onToggleCompare && (
            <button
              type="button"
              aria-label={isComparing ? "Remover da comparação" : "Adicionar à comparação"}
              title={compareFull && !isComparing ? "Máximo de 3 veículos para comparar" : undefined}
              disabled={compareFull && !isComparing}
              onClick={(e) => {
                e.preventDefault();
                onToggleCompare(vehicle.id);
              }}
              className={cn(
                "flex size-8 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-xs backdrop-blur-xs transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground",
                isComparing && "border-primary/40 bg-primary/10 text-primary hover:text-primary",
              )}
            >
              <Scale className="size-4" />
            </button>
          )}
          <button
            type="button"
            aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
            onClick={(e) => {
              e.preventDefault();
              toggle(vehicle.id);
            }}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-xs backdrop-blur-xs transition-colors hover:text-foreground",
              fav && "border-destructive/30 text-destructive hover:text-destructive",
            )}
          >
            <Heart className={cn("size-4", fav && "fill-current")} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold leading-tight">
          {vehicle.marca} {vehicle.modelo}{" "}
          <span className="font-normal text-muted-foreground">{vehicle.versao}</span>
        </h3>
        <p className="num text-sm text-muted-foreground">
          {vehicle.ano}/{vehicle.anoModelo} · {vehicle.cor}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="num inline-flex items-center gap-1">
            <Gauge className="size-3.5" /> {formatKm(vehicle.km)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="size-3.5" /> {vehicle.combustivel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Cog className="size-3.5" /> {vehicle.cambio}
          </span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <p className="num text-xl font-bold tracking-tight">{formatCurrencyBRL(vehicle.preco)}</p>
            {vehicle.status === "available" && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Ver detalhes <ArrowRight className="size-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
