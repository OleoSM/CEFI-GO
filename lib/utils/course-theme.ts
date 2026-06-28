/**
 * Institutional color themes per exam/course.
 * Colors are derived from official brand guidelines of each institution.
 */

export interface CourseTheme {
  key: string;
  label: string;
  /** CSS hex — page-level dark background tinted for the institution */
  bg: string;
  /** Main brand color */
  primary: string;
  /** Lighter variant for gradients / hover */
  primaryLight: string;
  /** Accent / CTA color (contrasts with primary) */
  accent: string;
  /** Tailwind gradient classes for text/decorative use */
  gradientFrom: string;
  gradientTo: string;
  /** Tailwind gradient classes for button/CTA */
  accentFrom: string;
  accentTo: string;
  /** rgba glow for card hover effects */
  glow: string;
  /** Sidebar chart stop colors */
  chartStart: string;
  chartEnd: string;
  /** Badge classes (Tailwind) */
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

const THEMES: Record<string, CourseTheme> = {
  // ── UNAM ──────────────────────────────────────────────────────────────────
  // Azul UNAM #002F6C + Oro #F5A800
  unam: {
    key: "unam",
    label: "UNAM",
    bg: "#020B18",
    primary: "#002F6C",
    primaryLight: "#1A5CA8",
    accent: "#F5A800",
    gradientFrom: "from-[#1A5CA8]",
    gradientTo: "to-[#002F6C]",
    accentFrom: "from-[#F5A800]",
    accentTo: "to-[#FACC15]",
    glow: "rgba(26,92,168,0.35)",
    chartStart: "#1A5CA8",
    chartEnd: "#F5A800",
    badgeBg: "bg-[#002F6C]/20",
    badgeText: "text-[#60A5FA]",
    badgeBorder: "border-[#002F6C]/40",
  },

  // ── IPN ───────────────────────────────────────────────────────────────────
  // Guinda #6D1130 + Dorado #C8A951
  ipn: {
    key: "ipn",
    label: "IPN",
    bg: "#0F0208",
    primary: "#6D1130",
    primaryLight: "#9E1D47",
    accent: "#C8A951",
    gradientFrom: "from-[#9E1D47]",
    gradientTo: "to-[#6D1130]",
    accentFrom: "from-[#C8A951]",
    accentTo: "to-[#E2C878]",
    glow: "rgba(158,29,71,0.35)",
    chartStart: "#9E1D47",
    chartEnd: "#C8A951",
    badgeBg: "bg-[#6D1130]/20",
    badgeText: "text-[#F9A8D4]",
    badgeBorder: "border-[#6D1130]/40",
  },

  // ── UAM ───────────────────────────────────────────────────────────────────
  // Azul UAM #003087 + Amarillo #E8A500
  uam: {
    key: "uam",
    label: "UAM",
    bg: "#020A18",
    primary: "#003087",
    primaryLight: "#1251B5",
    accent: "#E8A500",
    gradientFrom: "from-[#1251B5]",
    gradientTo: "to-[#003087]",
    accentFrom: "from-[#E8A500]",
    accentTo: "to-[#FCD34D]",
    glow: "rgba(18,81,181,0.35)",
    chartStart: "#1251B5",
    chartEnd: "#E8A500",
    badgeBg: "bg-[#003087]/20",
    badgeText: "text-[#93C5FD]",
    badgeBorder: "border-[#003087]/40",
  },

  // ── COMIPEMS ──────────────────────────────────────────────────────────────
  // Bachillerato ZMVM — verde SEP #006847 + amarillo/oro
  comipems: {
    key: "comipems",
    label: "COMIPEMS",
    bg: "#020E09",
    primary: "#065F46",
    primaryLight: "#059669",
    accent: "#FACC15",
    gradientFrom: "from-[#059669]",
    gradientTo: "to-[#065F46]",
    accentFrom: "from-[#FACC15]",
    accentTo: "to-[#FDE68A]",
    glow: "rgba(5,150,105,0.35)",
    chartStart: "#059669",
    chartEnd: "#FACC15",
    badgeBg: "bg-[#065F46]/20",
    badgeText: "text-[#6EE7B7]",
    badgeBorder: "border-[#065F46]/40",
  },

  // ── ECOEMS ────────────────────────────────────────────────────────────────
  // Secundaria/Prepa Sonora — naranja energético + azul cielo
  // Más accesible y juvenil que los universitarios
  ecoems: {
    key: "ecoems",
    label: "ECOEMS",
    bg: "#0A0500",
    primary: "#C2410C",
    primaryLight: "#EA580C",
    accent: "#38BDF8",
    gradientFrom: "from-[#EA580C]",
    gradientTo: "to-[#F97316]",
    accentFrom: "from-[#38BDF8]",
    accentTo: "to-[#7DD3FC]",
    glow: "rgba(234,88,12,0.35)",
    chartStart: "#EA580C",
    chartEnd: "#38BDF8",
    badgeBg: "bg-[#C2410C]/20",
    badgeText: "text-[#FB923C]",
    badgeBorder: "border-[#C2410C]/40",
  },

  // ── CENEVAL / EXANI-II ────────────────────────────────────────────────────
  // Azul institucional #1B3A6B + naranja #E85D04
  ceneval: {
    key: "ceneval",
    label: "CENEVAL",
    bg: "#030810",
    primary: "#1B3A6B",
    primaryLight: "#2563EB",
    accent: "#E85D04",
    gradientFrom: "from-[#2563EB]",
    gradientTo: "to-[#1B3A6B]",
    accentFrom: "from-[#E85D04]",
    accentTo: "to-[#FB923C]",
    glow: "rgba(37,99,235,0.35)",
    chartStart: "#2563EB",
    chartEnd: "#E85D04",
    badgeBg: "bg-[#1B3A6B]/20",
    badgeText: "text-[#93C5FD]",
    badgeBorder: "border-[#1B3A6B]/40",
  },
};

// Alias para slugs alternativos
THEMES["unam-examen"]    = { ...THEMES.unam,     key: "unam-examen" };
THEMES["exani-ii"]       = { ...THEMES.ceneval,  key: "exani-ii" };
THEMES["exani"]          = { ...THEMES.ceneval,  key: "exani" };
THEMES["intensivo"]      = { ...THEMES.comipems, key: "intensivo" };

/** Fallback neutral — para cursos sin tema definido */
export const DEFAULT_THEME: CourseTheme = {
  key: "default",
  label: "CEFI GO",
  bg: "#09090B",
  primary: "#4F46E5",
  primaryLight: "#6366F1",
  accent: "#F59E0B",
  gradientFrom: "from-[#6366F1]",
  gradientTo: "to-[#4F46E5]",
  accentFrom: "from-[#F59E0B]",
  accentTo: "to-[#FBBF24]",
  glow: "rgba(99,102,241,0.3)",
  chartStart: "#6366F1",
  chartEnd: "#F59E0B",
  badgeBg: "bg-indigo-500/10",
  badgeText: "text-indigo-300",
  badgeBorder: "border-indigo-500/20",
};

export function getCourseTheme(slug: string): CourseTheme {
  const key = slug.toLowerCase().replace(/\s+/g, "-");
  return THEMES[key] ?? DEFAULT_THEME;
}
