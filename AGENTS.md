# AGENTS.md

## What this project is

`DANIEL'S MAISON` — a **client-side only** Vite + React 19 SPA (Tailwind v4, `motion`,
`lucide-react`). There is no backend process in this repo.

Non-obvious things worth knowing:

- `src/services/*` all talk to `/api/v1` through `src/services/apiClient.ts`, but every
  caller falls back to the bundled mock data in `src/mock/*` and/or `localStorage` when
  that endpoint is unreachable. The UI is therefore fully functional with no API server.
- `.env.example` lists `GEMINI_API_KEY` and `APP_URL`, and `metadata.json` advertises a
  server-side Gemini capability, but **no source file reads those variables** — they are
  leftovers from the AI Studio export. The app boots and works without them.
- `src/App.tsx` switches top-level sections with local state (no router); it opens on a
  welcome/loader overlay that must be dismissed before the storefront is visible.

## Running it

Use the Base44 compose file (dev-server based, source bind-mounted, live reload):

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web entry point: <http://localhost:3000> (Vite dev server on 0.0.0.0, port 3000).
- Dependencies are installed with `bun install --frozen-lockfile` on container start
  (the repo ships `bun.lock`; `node_modules` lives in a Docker volume).
- Logs: `docker compose -f docker-compose.base44.yml logs -f web`

## Sandbox notes

- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed through from the platform so Vite
  accepts the preview proxy's `Host` header. Do not hardcode any `BASE44_*` host value.
- `BASE44_PREVIEW_MODE` is forwarded to the service as a bare passthrough; no application
  code branches on it today, and with the variable unset behavior is unchanged.

## Verifying a change

- The preview is the dev server itself, so edits hot-reload. Restart the service only if
  you changed build configuration or dependencies.
- `bun run lint` (i.e. `tsc --noEmit`) is the only static check configured, and it passes
  clean at the imported revision. Run it inside the container:
  `docker compose -f docker-compose.base44.yml exec -T web bunx tsc --noEmit`
