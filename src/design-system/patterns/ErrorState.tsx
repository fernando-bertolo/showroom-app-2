import type { ReactNode } from "react";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/design-system/primitives/button";
import { cn } from "@/lib/utils";

import { IconBadge } from "./IconBadge";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  message = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
  retryLabel = "Tentar de novo",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center",
        className,
      )}
    >
      <IconBadge variant="destructive" size="lg">
        <TriangleAlert />
      </IconBadge>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {action ??
        (onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        ))}
    </div>
  );
}
