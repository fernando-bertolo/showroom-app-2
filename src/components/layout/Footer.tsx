import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-sidebar">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <img src="/logo.svg" alt="Pátio" className="h-7 dark:brightness-0 dark:invert" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Loja de veículos seminovos com procedência garantida. Vistoria cautelar e 30 dias de
              garantia em todos os carros do pátio.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Estoque</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/estoque" className="transition-colors hover:text-foreground">
                  Todos os veículos
                </Link>
              </li>
              <li>
                <Link to="/estoque" className="transition-colors hover:text-foreground">
                  Em destaque
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="transition-colors hover:text-foreground">
                  Meus favoritos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">A loja</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/onde-estamos" className="transition-colors hover:text-foreground">
                  Onde estamos
                </Link>
              </li>
              <li>
                <Link to="/financiamento" className="transition-colors hover:text-foreground">
                  Financiamento
                </Link>
              </li>
              <li>
                <Link to="/vender" className="transition-colors hover:text-foreground">
                  Venda seu carro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="tel:+551130000000" className="num transition-colors hover:text-foreground">
                  (11) 3000-0000
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511999990000"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@patio.com.br"
                  className="transition-colors hover:text-foreground"
                >
                  contato@patio.com.br
                </a>
              </li>
              <li>
                <Link to="/onde-estamos" className="transition-colors hover:text-foreground">
                  Av. dos Estados, 1234 — SP
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="num mt-10 flex flex-col gap-1 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Pátio. Todos os direitos reservados.</span>
          <span>CNPJ 00.000.000/0001-00</span>
        </div>
      </div>
    </footer>
  );
}
