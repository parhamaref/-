# AGENTS.md — Nestora Homes

Notes for whoever works on this repository next. The public site is `NESTORA HOMES`; the repository previously
hosted an unrelated storefront (`DANIEL'S MAISON`) whose modules still exist under `src/components`, `src/stores`,
`src/services`, `src/mock`, `src/db` and `src/data`. **Those files are unreferenced dead code** — nothing imports
`src/App.tsx` any more. They are kept only so nothing was destroyed silently; delete them in a dedicated change
once the team confirms they are not needed.

## Run it

```bash
bun install --frozen-lockfile
bun run dev        # http://localhost:3000 (vite, host 0.0.0.0)
bun run lint       # tsc --noEmit
```

## Sandbox / preview notes

- The preview needs Vite's dev server on host port 3000 and no prebuilt bundle: `docker-compose.base44.yml`
  bind-mounts the checkout, installs from `bun.lock` into a named volume (`bun install --frozen-lockfile`) and runs
  `bun run dev` so edits hot-reload.
- Host allowlist: Vite is configured to accept the preview hostname through the platform-provided
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` environment variable, forwarded into the `web` service by compose
  (Vite ≥ 6.1 appends it to `server.allowedHosts`). No application code changes, so `vite.config.ts` stays as
  generated and `BASE44_PREVIEW_MODE` is not needed here.
- `DISABLE_HMR` must **not** be set — the generated `vite.config.ts` treats `DISABLE_HMR=true` as "no hot reload and
  no file watching".
- Deep links work because the Vite dev server answers unknown paths with `index.html` (SPA fallback). Routing is a
  hand-rolled history-API router in `src/nestora/router.tsx`; there is no router dependency to configure.

## Non-obvious application facts

- **No backend.** All records live in one `localStorage` document (`nestora.db.v1`) behind
  `src/nestora/data/api.ts`, seeded by `src/nestora/data/seed.ts`. Async functions carry a small artificial latency so
  loading states are real. Swapping in HTTP calls means changing only `api.ts`.
- **Data reset:** clear site data, or use *Restore demonstration content* in `/admin/settings`.
- **Admin gate** is a client-side passphrase (`nestora-admin`, `src/nestora/pages/admin/Admin.tsx`). It is a
  convenience, not authorization.
- **No auth system.** Saved properties are keyed to an anonymous visitor id in `localStorage`; enquiries are not tied
  to any user.
- **Images** are Unsplash CDN URLs rendered through `SmartImage`; `onError` swaps in a branded fallback so a dead URL
  never leaves a broken image.
- **`GEMINI_API_KEY` / `APP_URL`** in `.env.example` belong to the previous AI Studio project and are not used by
  Nestora; the app boots without them.

## How to verify

1. `curl -sI http://localhost:3000/` returns 200 and the dev server log shows live module compilation.
2. `/` renders the hero, the search foundation panel, four featured cards, Why Choose Us, the portfolio banner and the
   footer.
3. Search from the homepage navigates to `/listings` with query parameters applied and a result count.
4. Filters, sorting, view toggle and pagination on `/listings` update both the results and the URL.
5. `/property/modern-villa-malibu` loads the matching record; the gallery lightbox opens and closes with Escape.
6. An enquiry submitted from `/contact` appears under `/admin/inquiries` with status `new`.
7. `/admin` refuses entry until the passphrase is entered; mutating a property changes the public listings.
