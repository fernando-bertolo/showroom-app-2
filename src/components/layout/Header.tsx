"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Heart, Menu, MessageCircle, Moon, Phone, Sun, X } from "lucide-react";

import { Button } from "@/design-system/primitives/button";
import { telHref } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useContact } from "@/stores/contact";
import { useFavorites } from "@/stores/favorites";
import { useTheme } from "@/stores/theme";

const NAV = [
  { to: "/", label: "Início", exact: true },
  { to: "/estoque", label: "Estoque", exact: false },
  { to: "/vender", label: "Venda seu carro", exact: false },
  { to: "/onde-estamos", label: "Onde estamos", exact: false },
] as const;

interface HeaderProps {
  tradeName: string;
  logoUrl: string | null;
  phone: string | null;
}

export function Header({ tradeName, logoUrl, phone }: HeaderProps) {
  const pathname = usePathname();
  const { count } = useFavorites();
  const { openContact } = useContact();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Fecha o menu mobile ao navegar para outra página.
  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 md:gap-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>

        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={tradeName} className="h-10 w-auto max-w-48 object-contain" />
          ) : (
            <span className="text-lg font-bold tracking-tight">{tradeName}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive(item.to, item.exact) && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={theme === "dark" ? "Tema claro" : "Tema escuro"}
            onClick={toggle}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className={cn(
              "relative inline-flex size-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Heart className="size-4" />
            {count > 0 && (
              <span className="num absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {phone && (
            <a
              href={telHref(phone)}
              className="hidden items-center gap-2 px-2 text-sm font-medium lg:flex"
            >
              <Phone className="size-4 text-primary" />
              <span className="num">{phone}</span>
            </a>
          )}

          <Button size="sm" onClick={() => openContact()}>
            <MessageCircle />
            <span className="hidden sm:inline">Falar com a loja</span>
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  isActive(item.to, item.exact) && "bg-accent text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            {phone && (
              <a
                href={telHref(phone)}
                className="flex items-center gap-2 border-t border-border px-3 pt-3 pb-1.5 text-sm font-medium"
              >
                <Phone className="size-4 text-primary" />
                <span className="num">{phone}</span>
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
