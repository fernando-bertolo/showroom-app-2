import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Button } from "@/design-system/primitives/button";
import { Card } from "@/design-system/primitives/card";
import { useContact } from "@/stores/contact";

const HORARIOS = [
  { dia: "Segunda a Sexta", hora: "9h às 19h" },
  { dia: "Sábado", hora: "9h às 14h" },
  { dia: "Domingo e feriados", hora: "Fechado" },
];

export function LocationPage() {
  const { openContact } = useContact();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Onde estamos</h1>
      <p className="mt-1 text-muted-foreground">
        Venha conhecer o pátio. Estamos a 5 minutos do metrô.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Mapa estilizado (placeholder — sem mapa real). */}
        <Card className="relative h-80 overflow-hidden p-0 lg:h-auto">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.94_0.01_260),oklch(0.97_0.005_260))]">
            <svg className="h-full w-full opacity-60" aria-hidden="true">
              <defs>
                <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path
                    d="M 48 0 L 0 0 0 48"
                    fill="none"
                    stroke="oklch(0.9 0.01 260)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <line x1="0" y1="55%" x2="100%" y2="40%" stroke="oklch(0.85 0.02 260)" strokeWidth="10" />
              <line x1="30%" y1="0" x2="45%" y2="100%" stroke="oklch(0.85 0.02 260)" strokeWidth="8" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <MapPin className="size-6" />
            </span>
            <span className="mt-2 rounded-md bg-card px-3 py-1 text-sm font-medium shadow-sm">
              Pátio Seminovos
            </span>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="gap-4 p-6">
            <div className="flex items-start gap-3">
              <IconBadge variant="primary" size="sm">
                <MapPin />
              </IconBadge>
              <div className="text-sm">
                <p className="font-semibold">Endereço</p>
                <p className="text-muted-foreground">
                  Av. dos Estados, 1234 — Centro
                  <br />
                  São Paulo, SP · 01000-000
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconBadge variant="status-maintenance" size="sm">
                <Clock />
              </IconBadge>
              <div className="text-sm">
                <p className="font-semibold">Horário de funcionamento</p>
                <dl className="mt-1 space-y-0.5 text-muted-foreground">
                  {HORARIOS.map((h) => (
                    <div key={h.dia} className="flex justify-between gap-6">
                      <dt>{h.dia}</dt>
                      <dd className="num">{h.hora}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Card>

          <Card className="gap-2 p-6">
            <Button asChild>
              <a
                href="https://maps.google.com/?q=Av.+dos+Estados+1234+São+Paulo"
                target="_blank"
                rel="noreferrer"
              >
                <Navigation />
                Como chegar
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:+551130000000">
                <Phone className="text-primary" />
                <span className="num">(11) 3000-0000</span>
              </a>
            </Button>
            <Button variant="ghost" onClick={() => openContact()}>
              <MessageCircle />
              Falar com a loja
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
