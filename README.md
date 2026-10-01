# Bloom

Bloom is a complete What Framework starter for a local garden planner. It demonstrates a seed catalog, inline SVG plant illustrations, routeable plant details, plot planning, seasonal care tasks, watering journal entries, computed care queue, storage fallbacks, and a Vura-ready static build.

## Prerequisites

- Node.js 22.x
- npm 10+ (bundled with current Node 22 releases)
- Vura Platform credentials for deployment

## Run it

```bash
npm ci
npm run dev
```

Try these flows:

- Filter the catalog by season and open a plant detail route.
- Assign a plant to a plot and inspect `/plots`.
- Log watering from a card or detail page and inspect `/journal`.
- Visit `/build` for the agent-readable implementation notes.

## Build and test

```bash
npm run test
npm run build
npm run test:browser
```

`npm run verify` runs all three. Browser tests save screenshots under `test-results/screenshots`.

## Reset local state

```js
localStorage.removeItem('what-starter-bloom-v1')
```

The Catalog page also includes a reset action.

## Deploy on Vura

```bash
npm ci
npx vura-platform login
npx vura-platform projects
npm run deploy:vura
```

Use `npm run deploy:vura:prod` for a production upload. Planned public repo: `CelsianJs/what-starter-bloom`.

## Source map for agents

- `src/state/garden.js` — signals, computed care queue, schema validation, journal actions, plot assignment, and guarded persistence.
- `src/data/plants.js` — synthetic seed catalog and plot helpers.
- `src/routes.js` — route table and metadata.
- `src/pages/Build.jsx` — public implementation notes.
- `scripts/static-aliases.mjs` — generated plant aliases, titles, and a real `404.html` for Vura static synthesis.

See [BUILD.md](./BUILD.md) and `/build` for the longer implementation guide.
