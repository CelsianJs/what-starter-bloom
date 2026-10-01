import { Link } from 'what-framework/router';
import { plants, plots } from '../data/plants.js';
import { careQueue, gardenSummary, plotPlan } from '../state/garden.js';

function PacketPlant({ plant }) {
  return (
    <svg class="packet-plant" viewBox="0 0 90 120" role="img" aria-label={`${plant.name} seed packet illustration`}>
      <rect x="10" y="12" width="70" height="96" rx="7" fill="#fffdf1" stroke={plant.color} stroke-width="4" />
      <path d="M45 92 C42 70 42 46 48 28" stroke={plant.color} stroke-width="5" fill="none" stroke-linecap="round" />
      <ellipse cx="34" cy="57" rx="18" ry="8" fill={plant.color} opacity=".78" transform="rotate(-31 34 57)" />
      <ellipse cx="58" cy="49" rx="18" ry="8" fill={plant.color} opacity=".68" transform="rotate(29 58 49)" />
      <circle cx="45" cy="31" r="8" fill="#d9a441" opacity=".82" />
      <path d="M20 24 H70 M20 98 H70" stroke="#d9a441" stroke-width="2" stroke-dasharray="3 4" />
    </svg>
  );
}

export default function Home() {
  const featured = plants.slice(0, 3);
  return (
    <section class="garden-bench page-enter">
      <div class="seed-packets" aria-label="Seed packet preview">
        {featured.map((plant) => (
          <Link class="seed-packet" href={`/plants/${plant.slug}`} style={`--plant:${plant.color}`}>
            <PacketPlant plant={plant} />
            <span>{plant.season}</span>
            <strong>{plant.name}</strong>
          </Link>
        ))}
      </div>
      <div class="garden-brief">
        <p class="eyebrow">Garden planner</p>
        <h1>Seed packets, beds, and care queue.</h1>
        <p>Bloom combines static plant content, routeable details, plot assignment, a watering journal, and computed care timing without weather, sensors, or remote services.</p>
        <div class="hero-actions">
          <Link class="button primary" href="/catalog">Open seed catalog</Link>
          <Link class="button" href="/journal">Watering journal</Link>
        </div>
        <div class="garden-stats">
          <span>{gardenSummary().plants} plants</span>
          <span>{gardenSummary().plots} plots</span>
          <span>{gardenSummary().entries} journal entries</span>
        </div>
      </div>
      <aside class="care-calendar" aria-label="Care calendar">
        <p class="eyebrow">Care queue</p>
        {careQueue().slice(0, 4).map((plant) => (
          <Link href={`/plants/${plant.slug}`}><strong>{plant.name}</strong><span>{plant.urgency}</span></Link>
        ))}
      </aside>
      <div class="plot-map" aria-label="Plot map preview">
        {plots.slice(0, 4).map((plot) => (
          <div>
            <span>{plot}</span>
            <strong>{plotPlan()[plot].length}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
