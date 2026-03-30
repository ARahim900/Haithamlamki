// ─────────────────────────────────────────────────────────
//  lib/tokens.ts — Centralized color tokens for JS usage
//  Mirrors CSS custom properties in dashboard.css :root
//  Used where CSS var() doesn't work (Recharts SVG props)
// ─────────────────────────────────────────────────────────

export const colors = {
  // Brand
  primary: '#2D7A89',
  primaryDark: '#1E5A66',
  accent: '#00D2B3',

  // Chart palette
  chart1: '#5B8DB8',
  chart2: '#2D7A89',
  chart3: '#D4A24C',
  chart4: '#3A9E7E',
  chart5: '#1E5A66',
  chartBar: '#B06B6F',

  // Semantic status
  positive: '#2A6B4A',
  warning: '#D97706',
  negative: '#8B3A3A',
  info: '#0085CA',
  neutral: '#A7A8A9',

  // Chart grid/axis
  grid: '#f0f0f0',
  axis: '#ccc',
  axisLight: '#eaeaea',
  axisText: '#888',
} as const;

export const darkColors = {
  ...colors,
  primary: '#4DABB8',
  primaryDark: '#2D7A89',
  accent: '#00E5C3',

  chart1: '#6BA3D0',
  chart2: '#4DABB8',
  chart3: '#E4B85C',
  chart4: '#5ABE9E',
  chart5: '#3D9AAB',
  chartBar: '#D08B8F',

  positive: '#4ADE80',
  warning: '#FBBF24',
  negative: '#F87171',
  info: '#60A5FA',
  neutral: '#6B7280',

  grid: '#1E2E3A',
  axis: '#2A3A4A',
  axisLight: '#1E2E3A',
  axisText: '#7A8A9A',
} as const;

/** Pick light or dark token set based on mode */
export function getColors(isDark: boolean) {
  return isDark ? darkColors : colors;
}
