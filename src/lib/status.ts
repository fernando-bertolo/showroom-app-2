import { Check, CircleCheckBig, Clock, Wrench, type LucideIcon } from "lucide-react";

import type { VehicleStatus } from "@/types/vehicle";

/** Rótulos canônicos — sempre nesta ordem quando listados juntos. */
export const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Disponível",
  reserved: "Reservado",
  maintenance: "Manutenção",
  sold: "Vendido",
};

export const STATUS_ICONS: Record<VehicleStatus, LucideIcon> = {
  available: Check,
  reserved: Clock,
  maintenance: Wrench,
  sold: CircleCheckBig,
};

/** Classes de tinta para badges: fundo 15% + texto + borda 30%. */
export const STATUS_BADGE_CLASSES: Record<VehicleStatus, string> = {
  available: "bg-status-available/15 text-status-available border-status-available/30",
  reserved: "bg-status-reserved/15 text-status-reserved border-status-reserved/30",
  maintenance: "bg-status-maintenance/15 text-status-maintenance border-status-maintenance/30",
  sold: "bg-status-sold/15 text-status-sold border-status-sold/30",
};

export const ALL_STATUSES: VehicleStatus[] = ["available", "reserved", "maintenance", "sold"];
