import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

/** Spinner centralizado com rótulo apenas para leitores de tela. */
export function LoadingState({ label = "Carregando", className }: LoadingStateProps) {
  return (
    <div
      data-slot="loading-state"
      role="status"
      className={cn("flex items-center justify-center py-16 text-muted-foreground", className)}
    >
      <Loader2 className="size-6 animate-spin" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
