import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Moon, Phone, Sun } from "lucide-react";

import { Button } from "@/design-system/primitives/button";
import { cn } from "@/lib/utils";
import { useContact } from "@/stores/contact";
import { useFavorites } from "@/stores/favorites";
import { useTheme } from "@/stores/theme";

const NAV = [
  { to: "/", label: "Início", exact: true },
  { to: "/estoque", label: "Estoque", exact: false },
  { to: "/financiamento", label: "Financiamento", exact: false },
  { to: "/vender", label: "Venda seu carro", exact: false },
  { to: "/onde-estamos", label: "Onde estamos", exact: false },
] as const;

export function Header() {
  const { count } = useFavorites();
  const { openContact } = useContact();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <img src="/logo.svg" alt="Pátio" className="h-7 dark:brightness-0 dark:invert" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
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
            to="/favoritos"
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

          <a
            href="tel:+551130000000"
            className="hidden items-center gap-2 px-2 text-sm font-medium lg:flex"
          >
            <Phone className="size-4 text-primary" />
            <span className="num">(11) 3000-0000</span>
          </a>

          <Button size="sm" onClick={() => openContact()}>
            <MessageCircle />
            <span className="hidden sm:inline">Falar com a loja</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
