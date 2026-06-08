import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Banknote,
  Calendar,
  CalendarCheck,
  Car,
  Handshake,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Carousel } from "@/components/landing/Carousel";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Button } from "@/design-system/primitives/button";
import { DEFAULT_FILTERS } from "@/api/vehicles";
import { useAvailableCount, useVehicles } from "@/hooks/useVehicles";

const STATS: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Calendar, value: "12+", label: "anos de mercado" },
  { icon: Car, value: "1.400+", label: "veículos vendidos" },
  { icon: Users, value: "98%", label: "clientes satisfeitos" },
  { icon: Star, value: "4,9", label: "avaliação Google" },
];

const TIMELINE = [
  { year: "2012", label: "Fundação da loja no Brás com 12 veículos" },
  { year: "2015", label: "Início das parcerias com financeiras nacionais" },
  { year: "2018", label: "Expansão do pátio — capacidade de 80+ veículos" },
  { year: "2021", label: "Lançamento do serviço de avaliação e compra online" },
  { year: "2024", label: "Certificação FENABRAVE — qualidade e ética no varejo" },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Vistoria cautelar",
    body: "Todos os veículos passam por inspeção técnica detalhada antes de entrar no pátio.",
  },
  {
    icon: CalendarCheck,
    title: "30 dias de garantia",
    body: "Garantia contratual de 30 dias em motor, câmbio e componentes essenciais.",
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

export function LandingPage() {
  const { data } = useVehicles(DEFAULT_FILTERS);
  const { data: totalDisponivel } = useAvailableCount();
  const featured = (data?.vehicles ?? []).filter((v) => v.status === "available").slice(0, 3);

  return (
    <div>
      <Carousel />

      {/* Stats strip */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-4 py-8 sm:px-6 lg:justify-between lg:px-8">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
                <s.icon className="size-5" />
              </span>
              <div>
                <div className="num text-2xl font-bold tracking-tight">{s.value}</div>
                <div className="text-sm text-primary-foreground/80">{s.label}</div>
              </div>
              {i < STATS.length - 1 && <span className="ml-6 hidden h-10 w-px bg-white/20 lg:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* Nossa história */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Nossa história
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              Mais de uma década conectando pessoas ao carro certo
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                O Pátio nasceu em 2012 com uma ideia simples: tornar a compra de um seminovo tão
                tranquila quanto comprar um carro zero — com transparência de preço, histórico
                completo do veículo e suporte real no pós-venda.
              </p>
              <p>
                Hoje somos uma referência em São Paulo, com mais de 80 veículos disponíveis sempre em
                pátio e uma equipe de consultores especializados prontos para encontrar o modelo
                ideal dentro do seu orçamento — seja financiado ou à vista.
              </p>
              <p>
                Cada carro que entra no pátio passa por vistoria cautelar, laudo de procedência e
                limpeza completa. Sem histórico de sinistro grave, sem pendências de documentação.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/estoque">Conheça o estoque</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/onde-estamos">
                  <MapPin /> Como chegar
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative pl-4">
            <div className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
            <ul className="space-y-6">
              {TIMELINE.map((ev) => (
                <li key={ev.year} className="relative flex gap-4">
                  <span className="absolute -left-4 top-1 size-4 rounded-full border-2 border-primary bg-background" />
                  <div className="num w-12 shrink-0 text-sm font-bold text-primary">{ev.year}</div>
                  <p className="text-sm text-muted-foreground">{ev.label}</p>
                </li>
              ))}
            </ul>
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
              <Link to="/estoque">
                Ver todos os {totalDisponivel ?? ""} disponíveis
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Por que Pátio */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Por que escolher a Pátio
          </span>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Comprar seminovo com a segurança de um zero-km
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <Link to="/vender">
                <Car /> Vender meu carro
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-background/35 bg-transparent text-background hover:bg-background/10 hover:text-background"
            >
              <Link to="/estoque">Ver estoque</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
