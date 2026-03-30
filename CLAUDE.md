# Abraj MIS Dashboard

Rig operations management platform for Abraj Energy Services (Oman).
Next.js 15 + React 19 + Tailwind v4 + Supabase + Recharts.

## Design Context

### Users
- **Rig Managers** — Desktop, reviewing DDORs and fleet performance. Long data-dense sessions.
- **Field Engineers** — Tablets on-site, entering daily operations data. Harsh lighting, touch input.
- **Senior Management** — Mobile/meeting screens, glancing at fleet KPIs and revenue.

### Brand Personality
Modern, Sharp, Performance-Driven. A purpose-built command center for drilling operations — not a generic admin panel. Feels like a modern energy company with operational excellence: every number matters.

### Aesthetic Direction
- **Colors**: Teal `#2D7A89` (primary), `#243B42` (dark), `#00D2B3` (accent)
- **Font**: Inter
- **Theme**: Light primary + dark mode for field use
- **Tone**: Industrial precision meets modern tech. Data-dense but calm.
- **Anti-references**: No glassmorphism, no gradient cards, no decorative visuals

### Design Principles
1. **Data first, decoration never.** Every pixel serves the operator.
2. **Scannable in 3 seconds.** Fleet status visible at a glance via color coding and hierarchy.
3. **Touch-ready, desk-optimized.** 44px touch targets, 16px input fonts, no hover-only interactions.
4. **Trust through consistency.** Green = operating, amber = warning, red = NPT/critical, gray = inactive.
5. **Respect the operator's time.** Minimize clicks, pre-fill derivable fields, auto-calculate.

### Accessibility
- WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text)
- Full keyboard navigation
- `prefers-reduced-motion` respected
- Color-blind safe (never color-only meaning)
- Dark mode supported
