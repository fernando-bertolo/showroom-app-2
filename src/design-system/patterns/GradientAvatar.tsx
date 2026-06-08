import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/15 via-primary/10 to-accent/30 font-semibold text-foreground ring-1 ring-border",
  {
    variants: {
      size: {
        sm: "h-9 w-9 text-xs",
        md: "h-14 w-14 text-base",
        lg: "h-20 w-20 text-xl",
        xl: "h-28 w-28 text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type GradientAvatarProps = React.ComponentProps<"div"> &
  VariantProps<typeof avatarVariants> & {
    fallback?: React.ReactNode;
  };

export function GradientAvatar({
  className,
  size,
  fallback,
  children,
  ...props
}: GradientAvatarProps) {
  return (
    <div data-slot="gradient-avatar" className={cn(avatarVariants({ size }), className)} {...props}>
      {children ?? fallback}
    </div>
  );
}
