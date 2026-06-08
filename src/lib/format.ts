/**
 * Formatação BR — moeda, quilometragem, números.
 *
 * Moeda em BRL: `R$ 142.900` (ponto para milhar, vírgula para decimal, espaço
 * após R$). Espaço não-quebrável entre símbolo e valor para não quebrar linha.
 */

const NBSP = " ";

export function formatCurrencyBRL(value: number, withCents = false): string {
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  });
  return `R$${NBSP}${formatted}`;
}

export function formatKm(value: number): string {
  return `${value.toLocaleString("pt-BR")}${NBSP}km`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR");
}
