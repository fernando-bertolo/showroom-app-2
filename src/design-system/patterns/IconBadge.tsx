import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary",
        accent: "bg-accent text-accent-foreground",
        muted: "bg-muted text-muted-foreground",
        destructive: "bg-destructive/10 text-destructive",
        "status-available": "bg-status-available/15 text-status-available",
        "status-sold": "bg-status-sold/15 text-status-sold",
        "status-reserved": "bg-status-reserved/15 text-status-reserved",
        "status-maintenance": "bg-status-maintenance/15 text-status-maintenance",
      },
      size: {
        sm: "h-8 w-8 rounded-lg [&>svg]:size-4",
        md: "h-11 w-11 rounded-xl [&>svg]:size-5",
        lg: "h-14 w-14 rounded-2xl [&>svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type IconBadgeProps = React.ComponentProps<"span"> & VariantProps<typeof iconBadgeVariants>;

export function IconBadge({ className, variant, size, ...props }: IconBadgeProps) {
  return (
    <span
      data-slot="icon-badge"
      className={cn(iconBadgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { iconBadgeVariants };
