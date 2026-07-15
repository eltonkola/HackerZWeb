export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "sm" | "md" | "lg" | "xl";
export type Density = "comfortable" | "compact";

export interface AccentPreset {
  name: string;
  value: string;
  /** Overrides --accent-foreground for light/high-lightness accents that need dark text instead of white. */
  foreground?: string;
}

const DARK_FOREGROUND = "oklch(0.2 0.02 95)";

// Lightness/chroma loosely follows HeroUI's own default accent
// (oklch(0.6204 0.195 253.83)), varying hue across the wheel so most presets
// keep the same contrast against white text. Bright presets (yellow, amber,
// orange, cyan) are lighter and specify a dark foreground instead.
export const ACCENT_PRESETS: AccentPreset[] = [
  { name: "Yellow", value: "oklch(0.83 0.17 97)", foreground: DARK_FOREGROUND },
  { name: "Amber", value: "oklch(0.77 0.16 75)", foreground: DARK_FOREGROUND },
  { name: "Orange", value: "oklch(0.71 0.18 55)", foreground: DARK_FOREGROUND },
  { name: "Red", value: "oklch(0.63 0.21 25)" },
  { name: "Rose", value: "oklch(0.63 0.21 10)" },
  { name: "Pink", value: "oklch(0.63 0.2 350)" },
  { name: "Fuchsia", value: "oklch(0.62 0.22 325)" },
  { name: "Purple", value: "oklch(0.6 0.22 305)" },
  { name: "Violet", value: "oklch(0.6 0.2 285)" },
  { name: "Indigo", value: "oklch(0.58 0.19 265)" },
  { name: "Blue", value: "oklch(0.6204 0.195 253.83)" },
  { name: "Sky", value: "oklch(0.68 0.15 235)" },
  { name: "Cyan", value: "oklch(0.72 0.14 205)", foreground: DARK_FOREGROUND },
  { name: "Teal", value: "oklch(0.65 0.15 195)" },
  { name: "Emerald", value: "oklch(0.64 0.17 165)" },
  { name: "Green", value: "oklch(0.65 0.17 145)" },
];

export const DEFAULT_ACCENT = ACCENT_PRESETS[0];

export const FONT_SIZE_PX: Record<FontSize, number> = { sm: 14, md: 16, lg: 18, xl: 20 };
export const FONT_SIZE_LABEL: Record<FontSize, string> = { sm: "Small", md: "Medium", lg: "Large", xl: "X-Large" };

export const DENSITY_ROW_PADDING: Record<Density, string> = {
  comfortable: "0.75rem",
  compact: "0.4rem",
};
export const DENSITY_LABEL: Record<Density, string> = { comfortable: "Comfortable", compact: "Compact" };
