# Showroom — vitrine pública (Next.js)

Vitrine pública multi-tenant do CarStock: cada loja tem um subdomínio
`{slug}.byeauto.com.br`. SSR/ISR com **Next.js 15 (App Router)** para SEO,
integrada à API real do backend Spring.

### Telas / rotas

| Rota | Tela |
|---|---|
| `/` | **Início** — landing com banner/carrossel, destaques reais e CTA |
| `/estoque` | Grade de veículos com filtros via search params (form GET, funciona sem JS) |
| `/veiculo/[id]` | Detalhe do veículo (galeria, ficha, opcionais, form de interesse) |
| `/vender` | **Venda seu carro** — wizard em 4 passos → POST sell-offers |
| `/favoritos` | Veículos salvos (localStorage, client) |
| `/onde-estamos` | Endereço e horários reais da loja |

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router, server components, ISR `revalidate: 60`) |
| Estilo | Tailwind CSS v4 (`@tailwindcss/postcss`) + tokens OKLCH do design system |
| Dados | fetch server-side (`src/lib/api.ts`); forms postam nos proxies `/api/leads` e `/api/sell-offers` (zero CORS) |
| Validação | Zod (formulários) |
| Formulários | React Hook Form + `@hookform/resolvers/zod` |
| UI primitives | Radix UI + padrão shadcn/ui (espelhado do design system) |
| Ícones | lucide-react |

## Multi-tenant

- `middleware.ts` extrai o slug do Host (`{slug}.{ROOT_DOMAIN}` ou
  `{slug}.localhost:3001` em dev; `www/api/app/site` são reservados) e propaga
  via header `x-branch-slug`.
- Sem subdomínio, usa `DEFAULT_BRANCH_SLUG` (dev: `carstock-sp`).
- O layout busca `GET /showroom/{slug}` e injeta a skin da loja
  (`--primary`/`--secondary` + foregrounds por luminância). Vitrine
  inexistente/inativa → página "Vitrine não encontrada".

## Env

Veja `.env.example` (`API_BASE_URL`, `DEFAULT_BRANCH_SLUG`,
`NEXT_PUBLIC_SHOWROOM_ROOT_DOMAIN`).

## Scripts

```bash
npm run dev        # next dev na porta 3001
npm run build      # build de produção (typecheck incluso)
npm run start      # serve o build na porta 3001
npm run typecheck  # apenas checagem de tipos
```

## Estrutura

```
app/                       App Router (páginas server + route handlers)
├── layout.tsx             html/body, providers client, bootstrap do tema
├── (site)/                layout com storefront (skin, Header, Footer, drawer)
│   ├── page.tsx           landing
│   ├── estoque/           listagem com filtros e paginação por links
│   ├── veiculo/[id]/      detalhe + generateMetadata/OG
│   ├── vender/ favoritos/ onde-estamos/
├── api/leads/             proxy POST → API (valida e repassa)
├── api/sell-offers/       proxy POST → API
├── sitemap.ts robots.ts   dinâmicos por tenant
src/
├── design-system/         foundations (CSS), primitives, patterns
├── components/            layout, landing, vehicle, contact, sell, form
├── stores/                contexts client: theme, favorites, contact, toast
├── types/                 vehicle (payloads da API), contact, sell
└── lib/                   api (server-only), tenant, skin, labels, format, utils
middleware.ts              resolução do slug por Host
```

## Princípios do design system aplicados

- **Cor**: azul automotivo `oklch(0.48 0.18 255)` como único cromático no chrome;
  sobrescrito por loja via skin (`--primary`/`--secondary` hex do backend).
- **Tipografia**: Inter Variable com `font-feature-settings: "cv11" "ss01"`;
  números tabulares (`.num`) para preços, km e ano.
- **Moeda**: BRL via `pt-BR` → `R$ 142.900`.
