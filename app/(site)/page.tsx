import Link from "next/link";

import {
  ArrowRight,
  Banknote,
  CalendarCheck,
  Car,
  Handshake,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { HomeHero } from "@/components/landing/Carousel";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Button } from "@/design-system/primitives/button";
import { getSlug, getStorefront, getVehicles } from "@/lib/api";
import { formatNumber } from "@/lib/format";

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Vistoria cautelar",
    body: "Todos os veículos passam por inspeção técnica detalhada antes de entrar na loja.",
  },
  {
    icon: CalendarCheck,
    title: "3 meses de garantia",
    body: "Garantia contratual de 3 meses para motor e câmbio.",
  },
  {
    icon: Banknote,
    title: "Financiamento facilitado",
    body: "Parcerias com as principais financeiras. Taxa a partir de 0,99%/mês sujeita à análise.",
  },
  {
    icon: Handshake,
    title: "Procedência garantida",
    body: "Histórico completo: FIPE, multas, recalls e registro de proprietários anteriores.",
  },
];

export default async function LandingPage() {
  const slug = await getSlug();
  const [storefront, list] = await Promise.all([
    getStorefront(slug),
    getVehicles(slug, { size: 3, page: 0 }),
  ]);

  const tradeName = storefront?.tradeName ?? "nossa loja";
  const total = list?.metadata.totalElements ?? 0;
  const featured = list?.content ?? [];

  return (
    <div>
      <HomeHero bannerUrl={storefront?.bannerUrl ?? null} tradeName={tradeName} />

      {/* Stats strip */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:gap-x-10 lg:px-8">
          <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:size-12 sm:rounded-2xl">
              <Car className="size-5" />
            </span>
            <div>
              <div className="num text-lg font-bold tracking-tight sm:text-2xl">
                {formatNumber(total)}
              </div>
              <div className="text-xs text-primary-foreground/80 sm:text-sm">
                {total === 1 ? "veículo em estoque" : "veículos em estoque"}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:size-12 sm:rounded-2xl">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <div className="text-lg font-bold tracking-tight sm:text-2xl">Procedência</div>
              <div className="text-xs text-primary-foreground/80 sm:text-sm">histórico verificado</div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:size-12 sm:rounded-2xl">
              <Banknote className="size-5" />
            </span>
            <div>
              <div className="text-lg font-bold tracking-tight sm:text-2xl">Financiamento</div>
              <div className="text-xs text-primary-foreground/80 sm:text-sm">sujeito à análise do banco</div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:size-12 sm:rounded-2xl">
              <Handshake className="size-5" />
            </span>
            <div>
              <div className="text-lg font-bold tracking-tight sm:text-2xl">Troca e compra</div>
              <div className="text-xs text-primary-foreground/80 sm:text-sm">avaliamos o seu usado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre a loja */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              A loja
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              Conectando pessoas ao carro certo
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Na {tradeName}, transparência e confiança vêm em primeiro lugar.              
              </p>
              <p>
                Cada veículo anunciado passa por vistoria cautelar, análise de procedência e preparação completa, 
                garantindo mais segurança e tranquilidade na sua decisão de compra. Além disso, todos os automóveis possuem documentação regularizada e histórico verificado.
              </p>
              <p>
                Acreditamos que uma boa negociação começa com informações claras e continua com um 
                atendimento que permanece presente mesmo após a entrega das chaves.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/estoque">Conheça o estoque</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/onde-estamos">
                  <MapPin /> Como chegar
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <IconBadge variant="primary" size="md">
                  <item.icon />
                </IconBadge>
                <h3 className="mt-4 font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Em destaque */}
      <section className="bg-sidebar">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Em destaque
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Veículos selecionados
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/estoque">
                Ver todos os {total > 0 ? formatNumber(total) : ""} disponíveis
                <ArrowRight />
              </Link>
            </Button>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((v) => (
                <VehicleCard key={v.publicId} vehicle={v} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-muted-foreground">
              O estoque está sendo atualizado. Volte em breve ou fale com a loja.
            </p>
          )}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-14 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Quer vender ou trocar seu carro?
            </h2>
            <p className="mt-2 text-background/70">
              Avaliamos em 24h. Compramos à vista ou aceitamos como entrada.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              asChild
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/vender">
                <Car /> Vender meu carro
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-background/35 bg-transparent text-background hover:bg-background/10 hover:text-background"
            >
              <Link href="/estoque">Ver estoque</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
