# thinkt-web-lite

Lightweight web dashboard for [go-thinkt](https://github.com/wethinkt/go-thinkt), used by `thinkt server lite`.

This project now uses a small Vite + TypeScript build pipeline and is shipped as static assets.

## Stack

- TypeScript + Vite
- No framework
- Same-origin API calls to `/api/v1/...`
- Embedded in go-thinkt as a git submodule at `internal/server/web-lite/`

## Structure

```txt
index.html              Vite entry HTML
src/main.ts             App shell + navigation + language selector
src/views/*             Dashboard views
src/components/*        Shared UI pieces (JSON viewer, theme preview)
src/i18n.ts             Runtime i18n catalogs + locale persistence
src/style.css           Global styles
dist/                   Production build output
static/                 Legacy static assets (not the main app runtime)
```

## Internationalization

The UI supports:

- English (`en`)
- Spanish (`es`)
- Chinese (`zh`)

Locale behavior:

- Browser locale auto-detection on first load
- Selection persisted in `localStorage` (`thinkt-lite-locale`)
- Language can be changed from the sidebar selector

## Development

Install dependencies:

```sh
npm install
```

Run the app in dev mode (proxies `/api` to local go-thinkt):

```sh
npm run dev
```

Other scripts:

```sh
npm run lint
npm run typecheck
npm run build
npm run ci:check
```

## Submodule Workflow

This repo is consumed by go-thinkt as a submodule.

Fresh clone of go-thinkt:

```sh
git clone --recurse-submodules https://github.com/wethinkt/go-thinkt
```

If submodules are missing:

```sh
cd go-thinkt
git submodule update --init --recursive
```

After committing changes here, update the submodule ref in go-thinkt:

```sh
cd /path/to/go-thinkt
git add internal/server/web-lite
git commit -m "update web-lite submodule"
```

## API Endpoints Used

| Endpoint | Description |
|---|---|
| `GET /api/v1/sources` | List data sources |
| `GET /api/v1/projects` | List projects |
| `GET /api/v1/open-in/apps` | List available "open in" apps |
| `GET /api/v1/themes` | List themes |
| `GET /api/v1/stats` | Usage statistics |
| `GET /api/v1/info` | Server info |
| `GET /api/v1/indexer/status` | Indexer status |
| `POST /api/v1/open-in` | Open a project in an app |

## License

Released under the MIT License - see [LICENSE.txt](./LICENSE.txt).
