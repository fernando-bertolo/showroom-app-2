import type { ReactNode } from "react";

export interface Slide {
  label: string;
  scene: ReactNode;
}

const sceneStyle = { position: "absolute", inset: 0, width: "100%", height: "100%" } as const;

/** "Fotos" da loja recriadas como cenas SVG (placeholders — sem fotos reais). */
export const SLIDES: Slide[] = [
  {
    label: "Fachada — sede principal",
    scene: (
      <svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" style={sceneStyle} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.72 0.1 220)" />
            <stop offset="1" stopColor="oklch(0.58 0.12 240)" />
          </linearGradient>
        </defs>
        <rect width="1200" height="560" fill="url(#sky)" />
        <rect y="380" width="1200" height="180" fill="oklch(0.32 0.04 265)" />
        <rect y="378" width="1200" height="4" fill="oklch(0.55 0.1 60)" opacity=".7" />
        <rect x="180" y="120" width="840" height="280" fill="oklch(0.96 0.01 240)" rx="6" />
        {[260, 380, 500, 620, 740, 860].map((x) => (
          <rect key={x} x={x} y="165" width="70" height="110" fill="oklch(0.48 0.12 255)" opacity=".9" rx="4" />
        ))}
        <rect x="480" y="300" width="240" height="100" fill="oklch(0.65 0.14 225)" opacity=".75" rx="4" />
        <rect x="440" y="88" width="320" height="50" fill="oklch(0.48 0.18 255)" rx="8" />
        <text x="600" y="121" textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="sans-serif" letterSpacing="-0.5">
          PÁTIO
        </text>
        <ellipse cx="540" cy="385" rx="70" ry="22" fill="oklch(0.25 0.04 265)" opacity=".5" />
        <rect x="490" y="356" width="100" height="30" fill="oklch(0.55 0.1 225)" rx="14" />
        <ellipse cx="760" cy="385" rx="70" ry="22" fill="oklch(0.25 0.04 265)" opacity=".5" />
        <rect x="710" y="356" width="100" height="30" fill="oklch(0.65 0.08 30)" rx="14" />
      </svg>
    ),
  },
  {
    label: "Showroom — interior",
    scene: (
      <svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" style={sceneStyle} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.92 0.02 60)" />
            <stop offset="1" stopColor="oklch(0.78 0.04 55)" />
          </linearGradient>
          <radialGradient id="spot1" cx="35%" cy="30%" r="40%">
            <stop offset="0" stopColor="oklch(0.99 0 0)" stopOpacity="0.6" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="spot2" cx="70%" cy="25%" r="35%">
            <stop offset="0" stopColor="oklch(0.99 0 0)" stopOpacity="0.4" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="1200" height="560" fill="url(#floor)" />
        <rect width="1200" height="560" fill="url(#spot1)" />
        <rect width="1200" height="560" fill="url(#spot2)" />
        {[100, 400, 800, 1100].map((x) => (
          <rect key={x} x={x} y="0" width="28" height="560" fill="oklch(0.88 0.03 60)" opacity=".8" />
        ))}
        {[150, 300, 450, 600, 750, 900, 1050].map((x) => (
          <rect key={x} x={x - 1} y="0" width="3" height="18" fill="white" opacity=".9" rx="2" />
        ))}
        <ellipse cx="350" cy="430" rx="130" ry="36" fill="oklch(0.3 0.04 265)" opacity=".35" />
        <rect x="210" y="370" width="280" height="62" fill="oklch(0.40 0.16 255)" rx="22" />
        <rect x="240" y="340" width="220" height="38" fill="oklch(0.48 0.16 255)" rx="18" />
        <ellipse cx="260" cy="432" rx="30" ry="30" fill="oklch(0.2 0.02 265)" />
        <ellipse cx="440" cy="432" rx="30" ry="30" fill="oklch(0.2 0.02 265)" />
        <ellipse cx="870" cy="430" rx="130" ry="36" fill="oklch(0.3 0.04 265)" opacity=".35" />
        <rect x="730" y="370" width="280" height="62" fill="oklch(0.72 0.05 25)" rx="22" />
        <rect x="760" y="340" width="220" height="38" fill="oklch(0.78 0.04 25)" rx="18" />
        <ellipse cx="780" cy="432" rx="30" ry="30" fill="oklch(0.2 0.02 265)" />
        <ellipse cx="960" cy="432" rx="30" ry="30" fill="oklch(0.2 0.02 265)" />
        <rect x="500" y="80" width="200" height="56" fill="oklch(0.48 0.18 255)" rx="8" opacity=".9" />
        <text x="600" y="116" textAnchor="middle" fill="white" fontSize="26" fontWeight="700" fontFamily="sans-serif">
          PÁTIO
        </text>
      </svg>
    ),
  },
  {
    label: "Pátio externo — estoque ao ar livre",
    scene: (
      <svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" style={sceneStyle} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.78 0.12 215)" />
            <stop offset="1" stopColor="oklch(0.90 0.06 210)" />
          </linearGradient>
        </defs>
        <rect width="1200" height="560" fill="url(#sky2)" />
        <rect y="320" width="1200" height="240" fill="oklch(0.42 0.03 265)" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1={80 + i * 150} y1="320" x2={80 + i * 150} y2="560" stroke="white" strokeWidth="2" strokeDasharray="12 10" opacity=".4" />
        ))}
        <rect y="315" width="1200" height="8" fill="oklch(0.6 0.08 145)" opacity=".6" />
        {[60, 240, 420, 900, 1080, 1160].map((x) => (
          <g key={x}>
            <rect x={x + 12} y="260" width="8" height="58" fill="oklch(0.50 0.08 80)" />
            <ellipse cx={x + 16} cy="252" rx="24" ry="32" fill="oklch(0.55 0.16 145)" />
          </g>
        ))}
        {[
          { x: 140, y: 340, c: "oklch(0.45 0.16 255)" },
          { x: 300, y: 340, c: "oklch(0.85 0.03 60)" },
          { x: 460, y: 340, c: "oklch(0.35 0.12 15)" },
          { x: 620, y: 340, c: "oklch(0.92 0.01 0)" },
          { x: 780, y: 340, c: "oklch(0.48 0.16 255)" },
          { x: 940, y: 340, c: "oklch(0.5 0.08 155)" },
        ].map((car, i) => (
          <g key={i}>
            <ellipse cx={car.x + 65} cy={car.y + 54} rx={65} ry={16} fill="black" opacity=".25" />
            <rect x={car.x} y={car.y + 16} width={130} height={40} fill={car.c} rx="18" />
            <rect x={car.x + 20} y={car.y} width={90} height={24} fill={car.c} rx="12" opacity=".85" />
            <circle cx={car.x + 26} cy={car.y + 56} r="16" fill="oklch(0.18 0.02 265)" />
            <circle cx={car.x + 104} cy={car.y + 56} r="16" fill="oklch(0.18 0.02 265)" />
          </g>
        ))}
      </svg>
    ),
  },
  {
    label: "Equipe — atendimento",
    scene: (
      <svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" style={sceneStyle} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.94 0.02 45)" />
            <stop offset="1" stopColor="oklch(0.88 0.04 50)" />
          </linearGradient>
        </defs>
        <rect width="1200" height="560" fill="url(#bg4)" />
        <rect x="300" y="340" width="600" height="30" fill="oklch(0.65 0.08 55)" rx="6" />
        <rect x="280" y="366" width="640" height="120" fill="oklch(0.60 0.09 55)" rx="4" />
        <rect x="530" y="240" width="140" height="104" fill="oklch(0.22 0.03 265)" rx="8" />
        <rect x="536" y="246" width="128" height="88" fill="oklch(0.48 0.18 255)" opacity=".85" rx="4" />
        <rect x="576" y="344" width="48" height="10" fill="oklch(0.50 0.05 265)" rx="3" />
        <ellipse cx="400" cy="290" rx="38" ry="44" fill="oklch(0.72 0.08 35)" />
        <circle cx="400" cy="220" r="42" fill="oklch(0.78 0.08 35)" />
        <ellipse cx="800" cy="295" rx="38" ry="44" fill="oklch(0.55 0.10 255)" />
        <circle cx="800" cy="222" r="42" fill="oklch(0.78 0.08 35)" />
        <rect x="0" y="490" width="1200" height="70" fill="oklch(0.48 0.18 255)" opacity=".88" />
        <text x="600" y="534" textAnchor="middle" fill="white" fontSize="20" fontFamily="sans-serif" fontWeight="600">
          Consultores especializados para te ajudar na melhor escolha
        </text>
      </svg>
    ),
  },
];
