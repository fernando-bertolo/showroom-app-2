# Pátio — Showroom

Frontend do showroom público de uma loja de carros seminovos, construído sobre o
**design system Pátio** (white-label, pt-BR, BRL, multi-tenant).

O comprador navega no estoque, filtra por marca / preço / câmbio / portas, abre a
página de detalhe do veículo, favorita, simula financiamento e fala com a loja.

### Telas / rotas

| Rota | Tela |
|---|---|
| `/` | **Início** — landing com carrossel, história/timeline, destaques, "por que Pátio", CTA |
| `/estoque` | Grade de veículos com filtros (URL), busca e ordenação |
| `/veiculo/$id` | Detalhe do veículo (galeria, ficha, opcionais, preço, contato) |
| `/vender` | **Venda seu carro** — formulário em 4 passos + confirmação |
| `/financiamento` | Simulador (Tabela Price) |
| `/favoritos` | Veículos salvos |
| `/onde-estamos` | Localização, horários e contato |

## Stack

| Camada | Tecnologia |
|---|---|
| Build / dev | Vite + React 19 + TypeScript |
| Estilo | Tailwind CSS v4 (`@theme inline`) + tokens OKLCH do design system |
| Roteamento | TanStack Router (code-based, search params validados com Zod) |
| Dados / cache | TanStack Query (camada de API mockada com latência simulada) |
| Validação | Zod (schemas de domínio + formulários) |
| Formulários | React Hook Form + `@hookform/resolvers/zod` |
| UI primitives | Radix UI + padrão shadcn/ui (espelhado do design system) |
| Ícones | lucide-react |

## Scripts

```bash
npm run dev        # servidor de desenvolvimento (porta 5173)
npm run build      # typecheck + build de produção
npm run preview    # serve o build
npm run typecheck  # apenas checagem de tipos
```

## Estrutura

```
src/
├── design-system/         espelho do DS Pátio
│   ├── foundations/        tokens.css, typography.css, reset.css
│   ├── primitives/         button, card, badge, input, textarea, label,
│   │                       select, checkbox, alert
│   └── patterns/           StatusBadge, StatCard, IconBadge, GradientAvatar,
│                           EmptyState, ErrorState, LoadingState
├── components/
│   ├── layout/             Header, Footer, RootLayout, NotFound
│   ├── landing/            Carousel + slides (cenas SVG da loja)
│   ├── vehicle/            Hero, FilterRail, VehicleCard, VehiclePhoto
│   ├── contact/            ContactDrawer (RHF + Zod)
│   └── form/               Field (wrapper label + erro)
├── pages/                 LandingPage (Início), EstoquePage, VehicleDetailPage,
│                          SellCarPage (Venda seu carro), FavoritesPage,
│                          FinancingPage, LocationPage
├── api/                   vehicles.ts — camada de dados (fetch mockado + Zod)
├── hooks/                 useVehicles — hooks do TanStack Query
├── stores/                contexts: theme (dark), favorites, contact, toast
├── types/                 vehicle.ts, contact.ts, search.ts (schemas Zod)
├── data/                  inventário mock
├── lib/                   utils (cn), format (BRL/km), status (labels/ícones)
├── router.tsx             árvore de rotas + tipos registrados
└── main.tsx               entrada
```

## Princípios do design system aplicados

- **Cor**: azul automotivo `oklch(0.48 0.18 255)` como único cromático no chrome;
  tratado como **variável** (`--primary`) para temas por tenant (`[data-tenant]`).
- **Status** (sempre nesta ordem): **Disponível · Reservado · Manutenção · Vendido**,
  com badge de tinta (fundo 15% + texto + borda 30%).
- **Tipografia**: Inter Variable com `font-feature-settings: "cv11" "ss01"`;
  números tabulares (`.num`) para preços, km e ano.
- **Moeda**: BRL via `pt-BR` → `R$ 142.900`.
- **Cópia**: pt-BR, sentence case, sem pontuação final em labels, sem emoji;
  ícones Lucide para pontuação visual.
- **Movimento**: três durações, dois easings; sombra `sm → md` no hover dos cards.
- **Dark mode**: alterna `.dark` no `<html>` (persistido em localStorage).

## Notas

- Fotos dos veículos são placeholders de gradiente (a loja sobe fotos reais em
  produção). Cada veículo tem um par `accent` no mock.
- A camada de API simula latência para exercitar os estados de
  carregamento / erro / vazio (`LoadingState`, `ErrorState`, `EmptyState`).
- Favoritos e tema persistem em `localStorage`.
