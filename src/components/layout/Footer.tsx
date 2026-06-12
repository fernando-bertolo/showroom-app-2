import Link from "next/link";

import { telHref, waHref } from "@/lib/format";

import type { Storefront } from "@/types/vehicle";

export function Footer({ storefront }: { storefront: Storefront }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-sidebar">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            {storefront.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={storefront.logoUrl}
                alt={storefront.tradeName}
                className="h-8 w-auto max-w-44 object-contain"
              />
            ) : (
              <span className="text-lg font-bold tracking-tight">{storefront.tradeName}</span>
            )}
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Loja de veículos seminovos com procedência garantida. Fale com a equipe e agende uma
              visita à loja.
            </p>
            {storefront.businessHours && (
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
                {storefront.businessHours}
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Estoque</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/estoque" className="transition-colors hover:text-foreground">
                  Todos os veículos
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="transition-colors hover:text-foreground">
                  Meus favoritos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">A loja</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/onde-estamos" className="transition-colors hover:text-foreground">
                  Onde estamos
                </Link>
              </li>
              <li>
                <Link href="/vender" className="transition-colors hover:text-foreground">
                  Venda seu carro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {storefront.phone && (
                <li>
                  <a
                    href={telHref(storefront.phone)}
                    className="num transition-colors hover:text-foreground"
                  >
                    {storefront.phone}
                  </a>
                </li>
              )}
              {storefront.whatsapp && (
                <li>
                  <a
                    href={waHref(storefront.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {storefront.instagramUrl && (
                <li>
                  <a
                    href={storefront.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {storefront.facebookUrl && (
                <li>
                  <a
                    href={storefront.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    Facebook
                  </a>
                </li>
              )}
              {storefront.address && (
                <li>
                  <Link href="/onde-estamos" className="transition-colors hover:text-foreground">
                    {storefront.address}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="num mt-10 flex flex-col gap-1 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {storefront.tradeName}. Todos os direitos reservados.
          </span>
          {storefront.planWatermark && (
            <span>
              Powered by{" "}
              <a
                href="https://byeauto.com.br"
                target="_blank"
                rel="noreferrer"
                className="font-medium transition-colors hover:text-foreground"
              >
                BYE Hub
              </a>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
