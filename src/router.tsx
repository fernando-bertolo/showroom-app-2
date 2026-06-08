import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { NotFound } from "@/components/layout/NotFound";
import { RootLayout } from "@/components/layout/RootLayout";
import { EstoquePage } from "@/pages/EstoquePage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { FinancingPage } from "@/pages/FinancingPage";
import { LandingPage } from "@/pages/LandingPage";
import { LocationPage } from "@/pages/LocationPage";
import { SellCarPage } from "@/pages/SellCarPage";
import { VehicleDetailPage } from "@/pages/VehicleDetailPage";
import { estoqueSearchSchema, financiamentoSearchSchema } from "@/types/search";

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const estoqueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/estoque",
  validateSearch: estoqueSearchSchema,
  component: EstoquePage,
});

const sellRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vender",
  component: SellCarPage,
});

const vehicleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/veiculo/$id",
  component: VehicleDetailPage,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favoritos",
  component: FavoritesPage,
});

const financingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/financiamento",
  validateSearch: financiamentoSearchSchema,
  component: FinancingPage,
});

const locationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onde-estamos",
  component: LocationPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  estoqueRoute,
  sellRoute,
  vehicleDetailRoute,
  favoritesRoute,
  financingRoute,
  locationRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
