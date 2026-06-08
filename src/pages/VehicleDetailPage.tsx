import * as React from "react";

import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  Check,
  ChevronLeft,
  ChevronRight,
  Cog,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageCircle,
  Palette,
  ShieldCheck,
  TrendingDown,
  Wrench,
} from "lucide-react";

import { VehiclePhoto } from "@/components/vehicle/VehiclePhoto";
import { GradientAvatar } from "@/design-system/patterns/GradientAvatar";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { LoadingState } from "@/design-system/patterns/LoadingState";
import { ErrorState } from "@/design-system/patterns/ErrorState";
import { StatusBadge } from "@/design-system/patterns/StatusBadge";
import { Button } from "@/design-system/primitives/button";
import { Card } from "@/design-system/primitives/card";
import { useVehicle } from "@/hooks/useVehicles";
import { formatCurrencyBRL, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useContact } from "@/stores/contact";
import { useFavorites } from "@/stores/favorites";

import type { Vehicle } from "@/types/vehicle";

const routeApi = getRouteApi("/veiculo/$id");

const THUMB_COUNT = 5;

function Gallery({ vehicle }: { vehicle: Vehicle }) {
  const [active, setActive] = React.useState(0);
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(vehicle.id);

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border">
        <VehiclePhoto vehicle={vehicle} angle={135 + active * 10} iconClassName="size-12" />

        <button
          type="button"
          aria-label="Foto anterior"
          onClick={() => setActive((i) => Math.max(0, i - 1))}
          className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-xs transition-colors hover:bg-card"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Próxima foto"
          onClick={() => setActive((i) => Math.min(THUMB_COUNT - 1, i + 1))}
          className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-xs transition-colors hover:bg-card"
        >
          <ChevronRight className="size-4" />
        </button>

        <StatusBadge status={vehicle.status} withIcon className="absolute top-4 left-4 bg-card/90" />
        <button
          type="button"
          aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
          onClick={() => toggle(vehicle.id)}
          className={cn(
            "absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur-xs transition-colors hover:text-foreground",
            fav && "border-destructive/30 text-destructive hover:text-destructive",
          )}
        >
          <Heart className={cn("size-5", fav && "fill-current")} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {Array.from({ length: THUMB_COUNT }).map((_, t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            aria-label={`Foto ${t + 1}`}
            className={cn(
              "aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors",
              active === t ? "border-primary" : "border-transparent",
            )}
          >
            <VehiclePhoto vehicle={vehicle} angle={135 + t * 10} iconClassName="size-4" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SpecSheet({ vehicle }: { vehicle: Vehicle }) {
  const specs: { k: string; v: string | number }[] = [
    { k: "Marca", v: vehicle.marca },
    { k: "Modelo", v: vehicle.modelo },
    { k: "Versão", v: vehicle.versao },
    { k: "Ano", v: `${vehicle.ano}/${vehicle.anoModelo}` },
    { k: "Quilometragem", v: formatKm(vehicle.km) },
    { k: "Combustível", v: vehicle.combustivel },
    { k: "Câmbio", v: vehicle.cambio },
    { k: "Cor", v: vehicle.cor },
    { k: "Portas", v: vehicle.portas },
    { k: "Potência", v: `${vehicle.potencia} cv` },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {specs.map((s) => (
        <div
          key={s.k}
          className="flex items-center justify-between gap-4 border-b border-border px-6 py-3 text-sm last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
        >
          <span className="text-muted-foreground">{s.k}</span>
          <span className="num font-medium">{s.v}</span>
        </div>
      ))}
    </div>
  );
}

function PriceCard({ vehicle }: { vehicle: Vehicle }) {
  const { openContact } = useContact();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(vehicle.id);
  const sold = vehicle.status === "sold";

  return (
    <Card className="gap-0 p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Preço à vista
      </p>
      <p className="num mt-1 text-3xl font-bold tracking-tight">{formatCurrencyBRL(vehicle.preco)}</p>

      {vehicle.precoAntigo && (
        <p className="num mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-status-available/15 px-2 py-0.5 text-xs font-medium text-status-available">
          <TrendingDown className="size-3.5" />
          De {formatCurrencyBRL(vehicle.precoAntigo)} por {formatCurrencyBRL(vehicle.preco)}
        </p>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        ou em até <span className="num">60x</span> —{" "}
        <Link
          to="/financiamento"
          search={{ valor: vehicle.preco }}
          className="text-primary underline underline-offset-2"
        >
          simule o financiamento
        </Link>
      </p>

      <div className="mt-5 flex flex-col gap-2">
        <Button size="lg" disabled={sold} onClick={() => openContact(vehicle)}>
          <MessageCircle />
          {sold ? "Veículo vendido" : "Tenho interesse"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
        >
          <a
            href={`https://wa.me/5511999990000?text=${encodeURIComponent(
              `Olá! Tenho interesse no ${vehicle.marca} ${vehicle.modelo}.`,
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="text-[oklch(0.6_0.14_145)]" />
            WhatsApp
          </a>
        </Button>
        <Button variant="ghost" onClick={() => toggle(vehicle.id)}>
          <Heart className={cn(fav && "fill-destructive text-destructive")} />
          {fav ? "Favoritado" : "Favoritar"}
        </Button>
      </div>

      <hr className="my-5 border-border" />

      <div className="flex items-center gap-3">
        <GradientAvatar size="sm" fallback="RM" />
        <div className="text-sm">
          <p className="font-medium">Ricardo Mendes</p>
          <p className="text-xs text-muted-foreground">Consultor responsável</p>
        </div>
      </div>
    </Card>
  );
}

function Guarantees() {
  const items = [
    {
      icon: ShieldCheck,
      variant: "status-available" as const,
      title: "Garantia de 30 dias",
      sub: "Itens mecânicos e elétricos",
    },
    {
      icon: Wrench,
      variant: "primary" as const,
      title: "Vistoria cautelar",
      sub: "Histórico, motor, lataria",
    },
    {
      icon: Banknote,
      variant: "status-maintenance" as const,
      title: "Financiamento",
      sub: "Aprovação em até 24h",
    },
  ];
  return (
    <Card className="gap-3 p-5">
      {items.map((it) => (
        <div key={it.title} className="flex items-center gap-3 text-sm">
          <IconBadge variant={it.variant} size="sm">
            <it.icon />
          </IconBadge>
          <div>
            <p className="font-medium">{it.title}</p>
            <p className="text-xs text-muted-foreground">{it.sub}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function VehicleDetailPage() {
  const { id } = routeApi.useParams();
  const navigate = useNavigate();
  const { data: vehicle, isPending, isError, refetch } = useVehicle(id);

  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <LoadingState />
      </main>
    );
  }

  if (isError || !vehicle) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState
          title="Veículo não encontrado"
          message="Esse veículo pode ter sido vendido ou removido do estoque."
          action={
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/estoque" })}>
              Voltar ao estoque
            </Button>
          }
          onRetry={() => void refetch()}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Navegação" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/estoque" className="transition-colors hover:text-foreground">
          Estoque
        </Link>
        <ChevronRight className="size-3.5" />
        <span>{vehicle.marca}</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">
          {vehicle.modelo} {vehicle.versao}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <Gallery vehicle={vehicle} />

          <div className="mt-7">
            <h1 className="text-2xl font-bold tracking-tight">
              {vehicle.marca} {vehicle.modelo} {vehicle.versao}
            </h1>
            <p className="num mt-1 text-muted-foreground">
              {vehicle.ano}/{vehicle.anoModelo} · {vehicle.cor} · {vehicle.local}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="num inline-flex items-center gap-1.5">
                <Gauge className="size-4" /> {formatKm(vehicle.km)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Fuel className="size-4" /> {vehicle.combustivel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cog className="size-4" /> {vehicle.cambio}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Palette className="size-4" /> {vehicle.cor}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" /> {vehicle.local}
              </span>
            </div>
          </div>

          <Card className="mt-6 gap-0 py-0">
            <h2 className="border-b border-border px-6 py-4 text-lg font-semibold">
              Sobre o veículo
            </h2>
            <p className="px-6 py-5 text-sm leading-relaxed">{vehicle.descricao}</p>
          </Card>

          <Card className="mt-4 gap-0 py-0">
            <h2 className="border-b border-border px-6 py-4 text-lg font-semibold">Ficha técnica</h2>
            <SpecSheet vehicle={vehicle} />
          </Card>

          <Card className="mt-4 gap-0 py-0">
            <h2 className="border-b border-border px-6 py-4 text-lg font-semibold">Opcionais</h2>
            <div className="flex flex-wrap gap-2 px-6 py-5">
              {vehicle.opcionais.map((o) => (
                <span
                  key={o}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm"
                >
                  <Check className="size-3.5 text-status-available" />
                  {o}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <PriceCard vehicle={vehicle} />
          <Guarantees />
        </aside>
      </div>
    </main>
  );
}
