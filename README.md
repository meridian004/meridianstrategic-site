# Meridian Strategic

Marketing site for Meridian Strategic — government affairs and procurement advisory.

## Stack

- **Astro 5** — static-first, fast, SEO-native
- **TypeScript** strict
- **Tailwind 4** — via Vite plugin, tokens in `src/styles/global.css`
- **MDX** — for insights / long-form content
- **Netlify** — deploy target (`netlify.toml` included)

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve built output
```

## Project structure

```
src/
  components/    Header, Footer, reusable pieces
  layouts/       Base.astro — HTML shell, SEO meta, fonts
  pages/         File-based routing
  styles/        global.css — Tailwind 4 @theme tokens
public/          Static assets (favicon, OG images)
```

## Design tokens

All colors, type, spacing live in `src/styles/global.css` under `@theme`.
Change once, applies everywhere. No hardcoded hex values in components.

## Deploy

Connected repo → Netlify runs `npm run build`, publishes `dist/`.
DNS: CNAME `meridianstrategic.io` → Netlify (configured in Google Cloud DNS).
