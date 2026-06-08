import type { ComponentProps } from "react";

import { Badge } from "@/design-system/primitives/badge";
import { STATUS_BADGE_CLASSES, STATUS_ICONS, STATUS_LABELS } from "@/lib/status";
import { cn } from "@/lib/utils";

import type { VehicleStatus } from "@/types/vehicle";

interface StatusBadgeProps extends Omit<ComponentProps<typeof Badge>, "variant"> {
  status: VehicleStatus;
  label?: string;
  withIcon?: boolean;
}

export function StatusBadge({
  status,
  label,
  withIcon = false,
  className,
  ...props
}: StatusBadgeProps) {
  const Icon = STATUS_ICONS[status];
  return (
    <Badge
      data-slot="status-badge"
      variant="outline"
      className={cn(STATUS_BADGE_CLASSES[status], className)}
      {...props}
    >
      {withIcon && <Icon />}
      {label ?? STATUS_LABELS[status]}
    </Badge>
  );
}
