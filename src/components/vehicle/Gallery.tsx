"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFavorites } from "@/stores/favorites";

import { VehiclePhoto } from "./VehiclePhoto";

import type { VehicleSummary } from "@/types/vehicle";

interface GalleryProps {
  /** Resumo do veículo (armazenado nos favoritos ao favoritar). */
  vehicle: VehicleSummary;
  images: string[];
}

/** Lightbox fullscreen — fecha no backdrop/Esc, navega com as setas. */
function Lightbox({
  images,
  alt,
  index,
  onIndexChange,
  onClose,
}: {
  images: string[];
  alt: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  React.useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onIndexChange(Math.max(0, index - 1));
      if (event.key === "ArrowRight") onIndexChange(Math.min(images.length - 1, index + 1));
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onIndexChange]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt={`${alt} — foto ${index + 1} ampliada`}
        className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(Math.max(0, index - 1));
            }}
            className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Próxima foto"
            disabled={index === images.length - 1}
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(Math.min(images.length - 1, index + 1));
            }}
            className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40"
          >
            <ChevronRight className="size-5" />
          </button>
          <span className="num absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}

export function Gallery({ vehicle, images }: GalleryProps) {
  const [active, setActive] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
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
        {hasImages ? (
          <button
            type="button"
            aria-label="Ampliar foto"
            onClick={() => setExpanded(true)}
            className="block h-full w-full cursor-zoom-in"
          >
            {renderImage(active, "size-12")}
          </button>
        ) : (
          renderImage(active, "size-12")
        )}

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
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1.5">
          {Array.from({ length: count }).map((_, t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-label={`Foto ${t + 1}`}
              className={cn(
                "aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:w-28",
                active === t ? "border-primary" : "border-transparent",
              )}
            >
              {renderImage(t, "size-4")}
            </button>
          ))}
        </div>
      )}

      {expanded && hasImages && (
        <Lightbox
          images={images}
          alt={vehicle.name}
          index={active}
          onIndexChange={setActive}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  );
}
