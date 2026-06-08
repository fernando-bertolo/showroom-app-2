import { Card } from "@/design-system/primitives/card";
import { cn } from "@/lib/utils";

import { IconBadge, type iconBadgeVariants } from "./IconBadge";

import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

type IconBadgeVariant = NonNullable<VariantProps<typeof iconBadgeVariants>["variant"]>;

interface StatCardProps {
  title: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  variant?: IconBadgeVariant;
  className?: string;
}

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  variant = "primary",
  className,
}: StatCardProps) {
  return (
    <Card
      data-slot="stat-card"
      className={cn(
        "flex flex-row items-start justify-between gap-4 px-5 py-5 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
        <p className="num mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <IconBadge variant={variant} size="md">
        <Icon />
      </IconBadge>
    </Card>
  );
}
