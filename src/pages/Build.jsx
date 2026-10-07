export default function Build() {
  return (
    <article class="build-notes page-enter">
      <p class="eyebrow">Agent reference</p>
      <h1>How Bloom is built.</h1>
      <section>
        <h2>Dates without invented history</h2>
        <p><code>careForPlant(plant, entries, now)</code> separates date math from signal state and accepts a test clock. Only valid, non-future dated watering changes the next local-calendar care window. Observation notes leave watering unchanged; unknown history says Check soil.</p>
        <pre><code>{`const nextCare = midnight(latest.observedAt);
nextCare.setDate(nextCare.getDate() + plant.waterEvery);`}</code></pre>
        <p>Old Today labels had no actual date. Migration keeps the notes with <code>observedAt: null</code> and labels them undated instead of inventing timestamps. Tests lock that distinction and the today/next-day/overdue boundaries.</p>
      </section>
      <section>
        <h2>Current placement and observations</h2>
        <p>The original detail select did not display a saved assignment. Catalog and detail now bind to the unique plot bucket through the same accessor:</p>
        <pre><code>{`export const assignedPlot = slug =>
  plots.find(plot => plotPlan()[plot].includes(slug)) || '';`}</code></pre>
        <p>An inline composer appends dated observation notes; plant history reacts to the shared journal. AppShell owns the minute/focus clock refresh and its cleanup. Existing static aliases, local-storage fallback and unique assignments continued to work without another service.</p>
      </section>
      <section>
        <h2>Signals</h2>
        <p><code>src/state/garden.js</code> keeps plot assignments, watering journal entries, season filter, and save status in module-scoped signals.</p>
      </section>
      <section>
        <h2>Computed values</h2>
        <p><code>filteredPlants</code>, <code>careQueue</code>, and <code>gardenSummary</code> derive catalog, care, and header UI without duplicating state.</p>
      </section>
      <section>
        <h2>Effects and persistence</h2>
        <p>A single <code>effect</code> writes garden snapshots into localStorage and updates the saved status. Malformed or denied storage falls back to safe in-memory session edits.</p>
      </section>
      <section>
        <h2>Routing</h2>
        <p><code>src/routes.js</code> defines explicit What router routes including <code>/plants/:slug</code> and a catch-all 404 route. The build script emits concrete aliases for every bundled plant plus <code>404.html</code>.</p>
      </section>
      <section>
        <h2>Vura static packaging</h2>
        <p>Bloom emits concrete plant HTML files and <code>404.html</code>, then lets Vura synthesize static routing. The deploy config uses supported top-level fields only, writes catch-alls as <code>(.*)</code>, and avoids unused Vura server-runtime code.</p>
      </section>
      <section>
        <h2>Build journal</h2>
        <p>The inline SVG plant marks keep the starter asset-free. Static hosting also needed generated detail aliases instead of only index shells.</p>
      </section>
      <section>
        <h2>Problem → fix → proof</h2>
        <p><strong>Static plant URLs:</strong> <code>scripts/static-aliases.mjs</code> reads <code>src/data/plants.js</code> and emits each <code>/plants/:slug</code> path. Browser tests open every plant directly.</p>
        <p><strong>Storage resilience:</strong> <code>validPlan()</code> guards known plot keys, known plants, and unique placements; journal entries and season filters are validated before restore. Browser tests seed malformed storage and verify seed fallback.</p>
        <p><strong>Visual direction:</strong> <code>src/pages/Home.jsx</code> uses seed packets, a care calendar, and a plot map so Bloom is recognizably botanical rather than another pastel card dashboard.</p>
        <p><strong>Plot map iteration:</strong> the first map only showed counts. It now renders bed shapes and plant-colored dots from <code>plotPlan()</code>, making the unique-assignment state visible in the hero.</p>
        <p><strong>Shared SVG identity:</strong> <code>src/components/PlantArt.jsx</code> shares the packet and plant marks across home, catalog, and detail routes so detail pages keep the seed-packet identity without external assets.</p>
        <p><strong>State bucket lesson:</strong> a plant belongs to one plot bucket at a time. <code>assignPlant()</code> removes the slug from every plot before appending it to the selected destination, and tests assert Sun Gold Tomato appears exactly once.</p>
        <p><strong>Upload size:</strong> the Vura CLI pack check is about 21.7 KiB with static synthesis and no manual manifest.</p>
      </section>
    </article>
  );
}
