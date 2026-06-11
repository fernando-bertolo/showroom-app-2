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

/** Mantém apenas dígitos (telefones vindos da API podem ter máscara). */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Garante o DDI 55 em números BR de 10–11 dígitos. */
function withCountryCode(digits: string): string {
  return digits.length <= 11 ? `55${digits}` : digits;
}

/** href de ligação: tel:+55... */
export function telHref(phone: string): string {
  return `tel:+${withCountryCode(digitsOnly(phone))}`;
}

/** Link do WhatsApp (wa.me) com mensagem opcional. */
export function waHref(whatsapp: string, text?: string): string {
  const number = withCountryCode(digitsOnly(whatsapp));
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${number}${query}`;
}
