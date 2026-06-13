import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Banknote,
  Check,
  ChevronRight,
  Cog,
  Fuel,
  Gauge,
  Palette,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Gallery } from "@/components/vehicle/Gallery";
import { PriceCard } from "@/components/vehicle/PriceCard";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Button } from "@/design-system/primitives/button";
import { Card } from "@/design-system/primitives/card";
import { getSlug, getStorefront, getVehicle } from "@/lib/api";
import { formatCurrencyBRL, formatKm } from "@/lib/format";
import { colorLabel, fuelLabel, transmissionLabel } from "@/lib/labels";

import type { VehicleDetail, VehicleSummary } from "@/types/vehicle";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const slug = await getSlug();
  const [vehicle, storefront] = await Promise.all([getVehicle(slug, id), getStorefront(slug)]);
  if (!vehicle) return { title: "Veículo não encontrado" };

  const tradeName = storefront?.tradeName ?? "";
  const description = `${vehicle.name} ${vehicle.manufacturerYear}/${vehicle.modelYear}, ${formatKm(vehicle.mileage)} por ${formatCurrencyBRL(vehicle.salePrice)}${tradeName ? ` na ${tradeName}` : ""}.`;
  const firstImage = vehicle.images[0];

  return {
    title: vehicle.name,
    description,
    openGraph: {
      title: tradeName ? `${vehicle.name} | ${tradeName}` : vehicle.name,
      description,
      ...(firstImage ? { images: [firstImage] } : {}),
    },
  };
}

function toSummary(vehicle: VehicleDetail): VehicleSummary {
  const { engine, transmission, optionals, images, ...rest } = vehicle;
  void engine;
  void transmission;
  void optionals;
  return { ...rest, coverImage: images[0] ?? null };
}

function SpecSheet({ vehicle }: { vehicle: VehicleDetail }) {
  const specs = [
    { k: "Marca", v: vehicle.brandName },
    { k: "Modelo", v: vehicle.modelName },
    { k: "Versão", v: vehicle.versionName },
    { k: "Ano", v: `${vehicle.manufacturerYear}/${vehicle.modelYear}` },
    { k: "Quilometragem", v: formatKm(vehicle.mileage) },
    { k: "Combustível", v: fuelLabel(vehicle.fuelType) },
    { k: "Câmbio", v: transmissionLabel(vehicle.transmission) },
    { k: "Motor", v: vehicle.engine },
    { k: "Cor", v: colorLabel(vehicle.color) },
  ].filter((s) => s.v);

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

function Guarantees() {
  const items = [
    {
      icon: ShieldCheck,
      variant: "status-available" as const,
      title: "Garantia de 3 meses",
      sub: "Motor e câmbio",
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
      sub: "Sujeito à análise do banco",
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

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const slug = await getSlug();
  const [vehicle, storefront] = await Promise.all([getVehicle(slug, id), getStorefront(slug)]);

  if (!vehicle) notFound();

  const summary = toSummary(vehicle);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav
        aria-label="Navegação"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/estoque" className="transition-colors hover:text-foreground">
          Estoque
        </Link>
        <ChevronRight className="size-3.5" />
        <span>{vehicle.brandName}</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">
          {vehicle.modelName} {vehicle.versionName ?? ""}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* min-w-0: a faixa de thumbnails (overflow-x) não pode ditar a largura da coluna. */}
        <div className="min-w-0">
          <Gallery vehicle={summary} images={vehicle.images} />

          <div className="mt-7">
            <h1 className="text-2xl font-bold tracking-tight">{vehicle.name}</h1>
            <p className="num mt-1 text-muted-foreground">
              {vehicle.manufacturerYear}/{vehicle.modelYear}
              {vehicle.color ? ` · ${colorLabel(vehicle.color)}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="num inline-flex items-center gap-1.5">
                <Gauge className="size-4" /> {formatKm(vehicle.mileage)}
              </span>
              {vehicle.fuelType && (
                <span className="inline-flex items-center gap-1.5">
                  <Fuel className="size-4" /> {fuelLabel(vehicle.fuelType)}
                </span>
              )}
              {vehicle.transmission && (
                <span className="inline-flex items-center gap-1.5">
                  <Cog className="size-4" /> {transmissionLabel(vehicle.transmission)}
                </span>
              )}
              {vehicle.color && (
                <span className="inline-flex items-center gap-1.5">
                  <Palette className="size-4" /> {colorLabel(vehicle.color)}
                </span>
              )}
            </div>
          </div>

          <Card className="mt-6 gap-0 py-0">
            <h2 className="border-b border-border px-6 py-4 text-lg font-semibold">
              Ficha técnica
            </h2>
            <SpecSheet vehicle={vehicle} />
          </Card>

          {vehicle.optionals.length > 0 && (
            <Card className="mt-4 gap-0 py-0">
              <h2 className="border-b border-border px-6 py-4 text-lg font-semibold">Opcionais</h2>
              <div className="flex flex-wrap gap-2 px-6 py-5">
                {vehicle.optionals.map((o) => (
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
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <PriceCard vehicle={summary} whatsapp={storefront?.whatsapp ?? null} />
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/financiamento?veiculo=${encodeURIComponent(id)}`}>
              <Banknote /> Simular financiamento
            </Link>
          </Button>
          <Guarantees />
        </aside>
      </div>
    </main>
  );
}
