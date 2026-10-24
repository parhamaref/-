# NESTORA HOMES

Premium luxury real estate website and application — dark, cinematic, reference-driven.

- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS 4 (client-only single-page application)
- **Brand system:** obsidian `#101315` surfaces, champagne gold `#C9A264` accents, Inter + Manrope
- **Data:** a local record store (see *Data & backend* below) seeded with demonstration properties and advisors

## Getting started

```bash
bun install --frozen-lockfile   # or: npm install
bun run dev                     # dev server on http://localhost:3000
bun run lint                    # typecheck (tsc --noEmit)
bun run build                   # production bundle
```

In the Base44 sandbox the app is started with `docker compose -f docker-compose.base44.yml up -d` (Vite dev
server with hot module replacement on host port 3000). See `AGENTS.md`.

## Routes

| Route | Description |
| --- | --- |
| `/` | Homepage — hero, floating search foundation, featured properties, Why Choose Us, portfolio CTA, footer |
| `/listings` | Listings with filters, sorting, grid/list toggle, pagination; all state is mirrored in the URL query string |
| `/property/:slug` | Property detail — gallery with lightbox, specs, description, amenities, enquiry form, related properties |
| `/agents`, `/agents/:slug` | Advisor list and profile with listings and enquiry form |
| `/about` | Brand story, principles and approach |
| `/contact` | Contact form (with optional property reference) storing an enquiry record |
| `/get-started` | Three-step consultation request (`GET STARTED` in the header) |
| `/saved` | Properties saved in this browser |
| `/privacy`, `/terms` | Template legal pages — replace with your own copy |
| `/admin`, `/admin/properties`, `/admin/agents`, `/admin/inquiries`, `/admin/settings` | Content console |

## Data & backend

This repository ships as a **client-only** application: there is no server, database or authenticated API. Nestora
therefore keeps its records in one JSON document in the browser's `localStorage` (`nestora.db.v1`) and reads/writes
them through `src/nestora/data/api.ts`, which has the shape a real backend would have (list, detail, create, update,
delete, plus validation). `src/nestora/data/seed.ts` supplies the demonstration content.

Consequences to be aware of:

- Records are per browser profile. Clearing site data restores the demonstration content.
- Enquiries are stored locally; no email, SMS, maps, analytics or payment service is connected.
- Saved properties belong to an anonymous visitor id, because there is no account system in this build.

To move to a real backend, replace the functions in `src/nestora/data/api.ts` with HTTP calls and keep the same
signatures — no component changes are needed.

### Content console

`/admin` is a development console with full CRUD for properties, advisors, enquiries and site settings. It is gated
by a passphrase held in `src/nestora/pages/admin/Admin.tsx` (`nestora-admin`). **This is not real authorization** —
a client-side gate cannot be, and it must be replaced by server-side auth when a backend is added.

## Imagery

Architectural photography is loaded from Unsplash CDN URLs (recorded per property and in Settings) and rendered with
`SmartImage`, which lazy-loads below-the-fold images and falls back to a branded panel if a URL fails. Replace the
URLs in the console with your own licensed photography before launch.

## Accessibility & performance

Semantic landmarks and headings, labelled form controls with `aria-invalid`/`aria-describedby` errors, visible focus
rings, skip link, keyboard-operable menu, gallery lightbox and price sliders, `prefers-reduced-motion` support,
lazy-loaded imagery and per-route document titles, descriptions, canonicals and JSON-LD.
