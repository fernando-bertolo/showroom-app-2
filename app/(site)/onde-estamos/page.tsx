import type { Metadata } from "next";

import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import { ContactButton } from "@/components/contact/ContactButton";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Button } from "@/design-system/primitives/button";
import { Card } from "@/design-system/primitives/card";
import { getSlug, getStorefront } from "@/lib/api";
import { telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Onde estamos",
};

export default async function LocationPage() {
  const slug = await getSlug();
  const storefront = await getStorefront(slug);

  const tradeName = storefront?.tradeName ?? "A loja";
  const address = storefront?.address ?? null;
  const businessHours = storefront?.businessHours ?? null;
  const phone = storefront?.phone ?? null;

  const hourLines = businessHours
    ? businessHours
        .split(/\r?\n|;/)
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Onde estamos</h1>
      <p className="mt-1 text-muted-foreground">
        Venha conhecer nossa loja e ver os carros de perto.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="relative h-80 overflow-hidden p-0 lg:h-auto">
          {address ? (
            <iframe
              title={`Mapa — ${tradeName}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <>
              {/* Sem endereço configurado — mantém o placeholder estilizado. */}
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
                  {tradeName}
                </span>
              </div>
            </>
          )}
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
                  {address ?? "Endereço em breve — fale com a loja."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconBadge variant="status-maintenance" size="sm">
                <Clock />
              </IconBadge>
              <div className="text-sm">
                <p className="font-semibold">Horário de funcionamento</p>
                {hourLines.length > 0 ? (
                  <ul className="mt-1 space-y-0.5 text-muted-foreground">
                    {hourLines.map((line) => (
                      <li key={line} className="num">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-muted-foreground">Consulte a loja.</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="gap-2 p-6">
            {address && (
              <Button asChild>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation />
                  Como chegar
                </a>
              </Button>
            )}
            {phone && (
              <Button variant="outline" asChild>
                <a href={telHref(phone)}>
                  <Phone className="text-primary" />
                  <span className="num">{phone}</span>
                </a>
              </Button>
            )}
            <ContactButton variant="ghost">
              <MessageCircle />
              Falar com a loja
            </ContactButton>
          </Card>
        </div>
      </div>
    </main>
  );
}
