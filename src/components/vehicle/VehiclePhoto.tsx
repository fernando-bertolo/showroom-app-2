import { Car } from "lucide-react";

import { cn } from "@/lib/utils";

interface VehiclePhotoProps {
  /** Semente determinística (publicId) para o gradiente placeholder. */
  seed: string;
  className?: string;
  iconClassName?: string;
  angle?: number;
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Placeholder de foto para veículos sem imagem: gradiente determinístico
 * derivado do publicId, para cada card ler distinto sem inventar fotos.
 */
export function VehiclePhoto({ seed, className, iconClassName, angle = 135 }: VehiclePhotoProps) {
  const hue = hashSeed(seed) % 360;
  const a = `oklch(0.78 0.08 ${hue})`;
  const b = `oklch(0.55 0.11 ${(hue + 40) % 360})`;
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center", className)}
      style={{ background: `linear-gradient(${angle}deg, ${a}, ${b})` }}
    >
      <Car className={cn("size-8 text-black/35", iconClassName)} />
    </div>
  );
}
