import { Check, ShieldCheck, Wrench } from "lucide-react";

import { formatNumber } from "@/lib/format";

interface HeroProps {
  total: number | null;
}

export function Hero({ total }: HeroProps) {
  return (
    <section className="border-b border-border bg-sidebar">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Encontre o carro certo, sem rodeios.
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          <span className="num">{total != null ? formatNumber(total) : "—"}</span> veículos
          disponíveis na nossa loja. Todos vistoriados, com procedência garantida.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-status-available" /> Procedência garantida
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wrench className="size-4" /> Vistoria cautelar
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-4" /> 3 meses de garantia (motor e câmbio)
          </span>
        </div>
      </div>
    </section>
  );
}
