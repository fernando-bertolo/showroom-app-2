"use client";

import Link from "next/link";

import { ArrowRight, Fuel, Gauge, Heart } from "lucide-react";

import { formatCurrencyBRL, formatKm } from "@/lib/format";
import { colorLabel, fuelLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/stores/favorites";

import { VehiclePhoto } from "./VehiclePhoto";

import type { VehicleSummary } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: VehicleSummary;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(vehicle.publicId);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/veiculo/${vehicle.publicId}`}
        className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        aria-label={vehicle.name}
      />

      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {vehicle.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.coverImage}
            alt={vehicle.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <VehiclePhoto seed={vehicle.publicId} />
        )}

        <div className="absolute top-3 right-3 z-20 flex gap-1.5">
          <button
            type="button"
            aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
            onClick={(e) => {
              e.preventDefault();
              toggle(vehicle);
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
          {vehicle.brandName} {vehicle.modelName}{" "}
          {vehicle.versionName && (
            <span className="font-normal text-muted-foreground">{vehicle.versionName}</span>
          )}
        </h3>
        <p className="num text-sm text-muted-foreground">
          {vehicle.manufacturerYear}/{vehicle.modelYear}
          {vehicle.color ? ` · ${colorLabel(vehicle.color)}` : ""}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="num inline-flex items-center gap-1">
            <Gauge className="size-3.5" /> {formatKm(vehicle.mileage)}
          </span>
          {vehicle.fuelType && (
            <span className="inline-flex items-center gap-1">
              <Fuel className="size-3.5" /> {fuelLabel(vehicle.fuelType)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <p className="num text-xl font-bold tracking-tight">
              {formatCurrencyBRL(vehicle.salePrice)}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Ver detalhes <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
