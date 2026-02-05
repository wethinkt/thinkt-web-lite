# thinkt-web-lite

Lightweight web dashboard for [go-thinkt](https://github.com/wethinkt/go-thinkt) when the user invokes `thinkt serve lite`. 

Vanilla HTML/CSS/JS — no build tools, no dependencies.

## Structure

```
index.html        Main application (HTML + inline JS)
static/style.css  Styles (dark/light themes, responsive)
static/i18n.js    Internationalization (English, Spanish, Chinese)
```

## Development

This repo is used as a git submodule inside go-thinkt at `internal/server/web-lite/`.

### Fresh clone

```sh
git clone --recurse-submodules https://github.com/wethinkt/go-thinkt
```

### Existing clone (init submodules)

```sh
cd go-thinkt
git submodule update --init --recursive
```

### Workflow

1. Run the go-thinkt server — `thinkt serve lite` — it serves the webapp on the same origin.
2. Edit files in `internal/server/web-lite/`. Changes are picked up on rebuild.
3. Commit and push from inside the submodule directory.
4. Back in the go-thinkt root, stage the updated submodule ref and commit:
   ```sh
   git add internal/server/web-lite
   git commit -m "update web-lite submodule"
   ```

## Embedding

The Go project embeds this directory via `//go:embed`. The webapp always calls APIs on the same origin — there is no configurable API base URL.

## API Endpoints

The dashboard consumes these go-thinkt API routes:

| Endpoint | Description |
|---|---|
| `GET /api/v1/sources` | List data sources (Claude, Kimi, Gemini, Copilot) |
| `GET /api/v1/projects` | List projects with session counts |
| `GET /api/v1/open-in/apps` | List available apps for opening projects |
| `GET /api/v1/themes` | List available themes |
| `POST /api/v1/open-in` | Open a project in an app |

## Features

- Project aggregation across multiple AI sources
- Source visibility filtering
- Open-in-app dropdown (configurable via go-thinkt)
- Dark/light theme with system preference detection
- i18n: English, Spanish, Chinese
- Connection status monitoring
- API response viewer modal
- Responsive layout (mobile breakpoint at 700px)

## License

Created with :heart: and :fire: by the team at [Neomantra](https://www.neomantra.net) and [BrainSTM](https://brain-stm.org).

Released under the MIT License - see [LICENSE.txt](./LICENSE.txt)
