# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-08
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
- Color: quiet botanical-neutral page (`#f7f9f6`), white panels, moss controls and the existing plant-specific accents.
- Typography: shared local Avenir Next / Segoe UI Variable / Segoe UI sans-serif stack; body 16px/1.6, labels and controls 14px, headings 28–36px/1.2, section headings 24px/1.3, brand 24px.
- Layout: retain the seed-packet, garden brief, care rail, and state-driven plot map. Mobile places the task and actions before the three readable seed packets, without a horizontal carousel.
- Imagery: preserve the existing local SVG plant marks; no new photography or asset requests.
- Shape/rhythm: 8px corners, subtle 1px borders and 8px spacing rhythm; flat panels, no rotations, striped garden backgrounds, or pill labels.
- Motion: short page entrance with reduced-motion support.

## Accessibility
- Native buttons/selects, visible focus rings, one `h1` per route, labelled assignment controls, SVGs with names, and reduced-motion support.

## Interaction states
- Empty and filtered states stay readable.
- Plot map visuals must be driven by the unique assignment state, not decorative counts.
- Malformed storage resets to seed garden.
- Storage denied displays session-only copy while keeping edits working.
- Care queue is computed from plant data and local journal state.
- Care windows use valid dated manual watering and local calendar days. Observation-only notes never change the watering date; undated legacy notes retain their text without invented timestamps. Unknown history means a manual soil check, not a fake overdue claim.
- Plant detail binds current unique bed placement, shows last watering/next check when known, and provides an inline observation composer with reactive recent history.
- Packet and catalog illustrations distinguish herbs, fruit, roots, flowers and vines using local SVG silhouettes; no plant photos or external asset requests.

## Implementation constraints
- What Framework 0.13.10, what-compiler 0.13.10, Vite 6.4.3, Vitest 4.1.11, Vura CLI 0.3.0.
- No external assets, runtime network, tracking, auth, or paid service.
- Tests cover unit care data, browser flows, direct plant routes, storage denial, 404, focus, and screenshots.

## Open questions
- [ ] Choose the final Vura subdomain during deployment.
