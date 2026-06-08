import { Car } from "lucide-react";

import { cn } from "@/lib/utils";

import type { Vehicle } from "@/types/vehicle";

interface VehiclePhotoProps {
  vehicle: Pick<Vehicle, "accent">;
  className?: string;
  iconClassName?: string;
  angle?: number;
}

/**
 * Placeholder de foto — o design system usa fotos reais da loja em produção.
 * Aqui desenhamos um gradiente tingido com as cores `accent` do veículo para
 * cada card ler distinto sem inventar fotos falsas.
 */
export function VehiclePhoto({ vehicle, className, iconClassName, angle = 135 }: VehiclePhotoProps) {
  const [a, b] = vehicle.accent;
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center", className)}
      style={{ background: `linear-gradient(${angle}deg, ${a}, ${b})` }}
    >
      <Car className={cn("size-8 text-black/35", iconClassName)} />
    </div>
  );
}
