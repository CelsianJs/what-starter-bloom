# Build notes for agents

Bloom is intentionally compact but shaped like a real garden planning app.

## What it demonstrates

- `signal` stores plot assignments, watering journal entries, season filter, and save status.
- `computed` derives filtered plants, the care queue, and garden summary metrics.
- `effect` persists garden snapshots to `localStorage` and falls back to session-only edits if writes are denied.
- `what-framework/router` supplies overview, catalog, plant detail, plots, journal, build, and fallback routes.
- Static content is authored in `src/data/plants.js`; every concrete `/plants/:slug` route is emitted after build for Vura-friendly static hosting.

## State shape

```text
plant fixtures -> plot/journal/filter signals -> computed care queue -> catalog, plot, journal, detail routes
```

The state module validates stored JSON. Corrupt schemas load seed plot data rather than crashing. Storage-denied browsers keep session edits and show a visible warning.

## Vura static deployment notes

Bloom is a pure Vite/What client app. Static plant URLs are emitted as concrete HTML files, with a real `404.html`, and Vura is left to synthesize its static manifest.

The Vura schema lesson from live upload testing is baked into `vura.json`: no unsupported top-level `rewrites`, and catch-all header sources use `(.*)` rather than `*`. The rules are enforced by `vura-platform/packages/shared/src/config/vura-config.ts` and `routing-rules.ts`.

The starter also avoids an unused Vura server runtime dependency. A local Vura CLI archive check now packs Bloom at about 21.7 KiB while preserving every concrete plant route.

## Actual issues handled

- The plant illustrations are inline SVG so the starter remains deterministic and asset-free.
- Generated static aliases were required for direct plant links; a single SPA shell was not enough for the deployment target.
- Care copy stays honest: there are no weather, sensor, or inventory integrations.
- The first design pass shared too much of the same pastel card rhythm as other starters. The fix was a seed-packet, care-calendar, and plot-map homepage in `src/pages/Home.jsx`.
- The catalog SVG mark and homepage seed packets are both generated from plant data, proving that original visual devices can stay local and deterministic.
- Plot assignment is a single-location state bucket: selecting a new plot removes that plant from every previous plot before adding it to the destination. The UI uses one select per plant, so duplicating the same plant across beds would contradict the control.
- A review caught the plot map rendering as count pills and the detail page dropping packet identity. The homepage now draws bed shapes with plant-colored dots from the unique plot assignment state, and plant detail reuses the same seed-packet SVG.
- The background and care queue were polished with `min-height:100vh`, non-repeating radial layers, centered urgency chips, and pluralized "journal entry" copy.

## Problem → fix → proof

- Problem: plant details need direct static URLs. Fix: aliases are generated from `src/data/plants.js`. Proof: `npm run build` prints `static aliases OK: 10 routes plus 404` and Playwright opens every plant.
- Problem: garden state must survive normal reloads but not crash on corrupt storage. Fix: `validPlan()` checks stored plot data and persistence catches write failures. Proof: browser tests force storage denial and still log watering.
- Problem: Bloom needed a botanical-specific composition. Fix: homepage now uses seed packets, care-calendar rows, and a plot map instead of the generic hero/card formula. Proof: screenshot tests capture the new “Seed packets” first viewport.
- Problem: the plot map showed counts instead of plant placement, and detail routes lost the packet visual identity. Fix: `src/pages/Home.jsx` maps plot assignments to bed shapes and colored dots, while `src/components/PlantArt.jsx` shares packet/plant SVGs across home, catalog, and detail. Proof: browser tests count five plot dots and verify every plant detail exposes its seed-packet illustration.
- Problem: a plant could appear in both its old and new plot after reassignment. Fix: `assignPlant()` rebuilds the known plot buckets, removes the plant everywhere, then appends it to the chosen plot. Proof: unit and browser tests assert Sun Gold Tomato appears exactly once after moving to kitchen bed.
- Problem: a malformed stored plan or journal could include unknown plot keys, duplicate plant placements, null journal entries, or an unknown season filter. Fix: the storage loader now validates known plot keys, known plants, unique assignments, journal entry shape, and known seasons before restoring. Proof: a browser regression seeds invalid storage and verifies Bloom falls back to seed state.
- Problem: a static starter should not upload like a server app. Fix: remove the manual manifest path, keep valid Vura schema fields, and let static synthesis read the generated files. Proof: `parseVuraJson()` accepts the config, no `dist/manifest.json` remains after build, and the Vura CLI archive is about 21.7 KiB.

## Verification

Expected gates:

```bash
npm ci
npm run test
npm run build
npm run test:browser
```

The browser suite checks filtering, plot assignment, watering journal, direct plant routes, storage-denied fallback, 404, focusability, and mobile rendering.
