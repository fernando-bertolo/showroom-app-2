"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFavorites } from "@/stores/favorites";

import { VehiclePhoto } from "./VehiclePhoto";

import type { VehicleSummary } from "@/types/vehicle";

interface GalleryProps {
  /** Resumo do veículo (armazenado nos favoritos ao favoritar). */
  vehicle: VehicleSummary;
  images: string[];
}

export function Gallery({ vehicle, images }: GalleryProps) {
  const [active, setActive] = React.useState(0);
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(vehicle.publicId);

  const count = Math.max(images.length, 1);
  const hasImages = images.length > 0;

  const renderImage = (index: number, iconClassName?: string) => {
    const src = images[index];
    if (!hasImages || !src) {
      return (
        <VehiclePhoto
          seed={vehicle.publicId}
          angle={135 + index * 10}
          iconClassName={iconClassName}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${vehicle.name} — foto ${index + 1}`}
        className="h-full w-full object-cover"
      />
    );
  };

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border">
        {renderImage(active, "size-12")}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-xs transition-colors hover:bg-card"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => setActive((i) => Math.min(count - 1, i + 1))}
              className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-xs transition-colors hover:bg-card"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}

        <button
          type="button"
          aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
          onClick={() => toggle(vehicle)}
          className={cn(
            "absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur-xs transition-colors hover:text-foreground",
            fav && "border-destructive/30 text-destructive hover:text-destructive",
          )}
        >
          <Heart className={cn("size-5", fav && "fill-current")} />
        </button>
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {Array.from({ length: Math.min(count, 5) }).map((_, t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-label={`Foto ${t + 1}`}
              className={cn(
                "aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors",
                active === t ? "border-primary" : "border-transparent",
              )}
            >
              {renderImage(t, "size-4")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
