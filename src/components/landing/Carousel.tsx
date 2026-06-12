"use client";

import * as React from "react";

import Link from "next/link";
import { Camera, ChevronLeft, ChevronRight, MessageCircle, Search } from "lucide-react";

import { Button } from "@/design-system/primitives/button";
import { cn } from "@/lib/utils";
import { useContact } from "@/stores/contact";

import { SLIDES } from "./slides";

const INTERVAL = 5200;

function HeroContent() {
  const { openContact } = useContact();
  return (
    <>
      <h1 className="mt-4 max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl">
        Seu próximo carro está aqui
      </h1>
      <p className="mt-4 max-w-lg text-base text-white/80">
        Seminovos selecionados, vistoriados e com procedência garantida. Visite a loja ou fale com
        um consultor agora.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <Link href="/estoque">
            <Search /> Ver estoque completo
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => openContact()}
          className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <MessageCircle /> Falar com consultor
        </Button>
      </div>
    </>
  );
}

interface HomeHeroProps {
  bannerUrl: string | null;
  tradeName: string;
}

/**
 * Hero da landing: banner real da loja quando configurado; senão, o
 * carrossel de cenas ilustradas (placeholder do visual original).
 */
export function HomeHero({ bannerUrl, tradeName }: HomeHeroProps) {
  if (bannerUrl) {
    return (
      <div className="relative h-[clamp(420px,62vh,600px)] w-full overflow-hidden bg-foreground">
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerUrl}
            alt={tradeName}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <HeroContent />
        </div>
      </div>
    );
  }

  return <Carousel />;
}

function Carousel() {
  const [slide, setSlide] = React.useState(0);
  const timerRef = React.useRef<number | null>(null);

  const reset = React.useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(
      () => setSlide((s) => (s + 1) % SLIDES.length),
      INTERVAL,
    );
  }, []);

  React.useEffect(() => {
    reset();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [reset]);

  const go = (i: number) => {
    setSlide((i + SLIDES.length) % SLIDES.length);
    reset();
  };

  return (
    <div className="relative h-[clamp(420px,62vh,600px)] w-full overflow-hidden bg-foreground">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {SLIDES.map((sl, i) => (
          <div key={i} className="relative h-full w-full shrink-0">
            <div className="absolute inset-0 overflow-hidden">
              {sl.scene}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            </div>

            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Camera className="size-3" />
                {sl.label}
              </span>

              {i === 0 && <HeroContent />}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={() => go(slide - 1)}
        className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Próxima"
        onClick={() => go(slide + 1)}
        className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Foto ${i + 1}`}
            onClick={() => go(i)}
            className={cn(
              "h-2 rounded-full bg-white/40 transition-all",
              i === slide ? "w-6 bg-white" : "w-2 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
