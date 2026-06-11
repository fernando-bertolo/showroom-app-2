"use client";

import * as React from "react";

import { Check, X } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  notify: (message: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = React.useCallback(
    (message: string) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message }]);
      window.setTimeout(() => dismiss(id), 3600);
    },
    [dismiss],
  );

  const value = React.useMemo<ToastContextValue>(() => ({ notify }), [notify]);

  return (
    <ToastContext value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex max-w-md items-center gap-2.5 rounded-xl border border-border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-lg duration-200 animate-in fade-in-0 slide-in-from-bottom-2"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-status-available/15 text-status-available">
              <Check className="size-3.5" />
            </span>
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Fechar"
              className="-mr-1 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
