/** Tradução best-effort dos enums da API para rótulos PT-BR. */

const FUEL_LABELS: Record<string, string> = {
  FLEX: "Flex",
  GASOLINE: "Gasolina",
  ETHANOL: "Etanol",
  DIESEL: "Diesel",
  ELECTRIC: "Elétrico",
  HYBRID: "Híbrido",
  PLUGIN_HYBRID: "Híbrido plug-in",
  GNV: "GNV",
};

const COLOR_LABELS: Record<string, string> = {
  WHITE: "Branco",
  BLACK: "Preto",
  SILVER: "Prata",
  GRAY: "Cinza",
  GREY: "Cinza",
  RED: "Vermelho",
  BLUE: "Azul",
  GREEN: "Verde",
  YELLOW: "Amarelo",
  ORANGE: "Laranja",
  BROWN: "Marrom",
  BEIGE: "Bege",
  GOLD: "Dourado",
  PURPLE: "Roxo",
  PINK: "Rosa",
  WINE: "Vinho",
  OTHER: "Outra",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  AUTOMATIC: "Automático",
  AUTOMATED: "Automatizado",
  SEMI_AUTOMATIC: "Semiautomático",
  CVT: "CVT",
};

/** Fallback: "SOME_ENUM" → "Some enum". */
function prettify(value: string): string {
  const lower = value.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function fuelLabel(value: string | null | undefined): string {
  if (!value) return "";
  return FUEL_LABELS[value] ?? prettify(value);
}

export function colorLabel(value: string | null | undefined): string {
  if (!value) return "";
  return COLOR_LABELS[value] ?? prettify(value);
}

export function transmissionLabel(value: string | null | undefined): string {
  if (!value) return "";
  return TRANSMISSION_LABELS[value] ?? prettify(value);
}
