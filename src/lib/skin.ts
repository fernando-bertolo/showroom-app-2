/**
 * Skin por tenant: gera um bloco CSS sobrescrevendo --primary/--secondary
 * (e foregrounds calculados por luminância) quando a loja define cores.
 */

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function expandHex(hex: string): string {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

/** Luminância relativa (WCAG) de uma cor hex — 0 (preta) a 1 (branca). */
export function hexToLuminance(hex: string): number {
  const full = expandHex(hex);
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const [r = 0, g = 0, b = 0] = channels;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Foreground legível: branco sobre cor escura, quase-preto sobre clara. */
function foregroundFor(hex: string): string {
  return hexToLuminance(hex) > 0.5 ? "#1c1c21" : "#ffffff";
}

/**
 * Bloco <style> com overrides do tema. Retorna null quando a loja não
 * customizou cores (mantém os defaults do tokens.css).
 */
export function buildSkinCss(
  primaryColor: string | null,
  secondaryColor: string | null,
): string | null {
  const vars: string[] = [];

  if (primaryColor && HEX_RE.test(primaryColor)) {
    const fg = foregroundFor(primaryColor);
    vars.push(
      `--primary: ${primaryColor};`,
      `--primary-foreground: ${fg};`,
      `--ring: ${primaryColor};`,
      `--sidebar-primary: ${primaryColor};`,
      `--sidebar-primary-foreground: ${fg};`,
    );
  }

  if (secondaryColor && HEX_RE.test(secondaryColor)) {
    vars.push(
      `--secondary: ${secondaryColor};`,
      `--secondary-foreground: ${foregroundFor(secondaryColor)};`,
    );
  }

  if (vars.length === 0) return null;
  return `:root, .dark {\n  ${vars.join("\n  ")}\n}`;
}
