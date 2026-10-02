# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-01
- Primary product surfaces: overview, seed catalog, plant detail, plot plan, watering journal, build notes
- Evidence reviewed: What Framework routing/state examples, current getting-started guidance, and the Vura deploy script pattern used by these starters

## Brand
- Personality: botanical, practical, patient, bright
- Trust signals: explicit local persistence, synthetic garden data, reset controls, no sensor/weather claims
- Avoid: stock plant photos, fake live weather, farm-management overclaiming, generic dashboard cards

## Product goals
- Goals: show static plant content, routeable details, computed care queue, plot assignment, watering journal, local persistence, and generated aliases
- Non-goals: live weather, hardware sensors, inventory, accounts, databases
- Success signals: users can filter plants, assign plots, log watering, view care queue, reset local state, and inspect how What patterns fit together

## Information architecture
- Navigation: Home, Catalog, Plots, Journal, Build Notes
- Routes: `/`, `/catalog`, `/plants/:slug`, `/plots`, `/journal`, `/build`, `404`
- Hierarchy: summary, catalog cards, plant detail, plot groups, care journal, implementation guide

## Visual language
- Color: botanical mint, ochre accents, moss controls, warm paper panels
- Layout: Bloom should not share the same hero-card formula as Gather, Tally, or Drift; it opens with a seed-packet / plot-map composition and a care calendar rail
- Imagery: original inline SVG plant marks generated from local plant data, plot-bed shapes with packet-colored assignment dots, seed-packet labels reused on detail pages, and calendar tags; no stock plant photos or external assets
- Shape/rhythm: stamped seed packets, ruled garden rows, clipped care notes, and tighter botanical catalog rhythm
- Motion: short page entrance with reduced-motion fallback

## Accessibility
- Native buttons/selects, visible focus rings, one `h1` per route, labelled assignment controls, SVGs with names, and reduced-motion support.

## Interaction states
- Empty and filtered states stay readable.
- Plot map visuals must be driven by the unique assignment state, not decorative counts.
- Malformed storage resets to seed garden.
- Storage denied displays session-only copy while keeping edits working.
- Care queue is computed from plant data and local journal state.

## Implementation constraints
- What Framework 0.13.10, what-compiler 0.13.10, Vite 6.4.3, Vitest 4.1.11, Vura CLI 0.3.0.
- No external assets, runtime network, tracking, auth, or paid service.
- Tests cover unit care data, browser flows, direct plant routes, storage denial, 404, focus, and screenshots.

## Open questions
- [ ] Choose the final Vura subdomain during deployment.
