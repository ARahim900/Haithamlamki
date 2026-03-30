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
