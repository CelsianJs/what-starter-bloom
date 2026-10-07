import { Link } from 'what-framework/router';
import { PacketPlant } from '../components/PlantArt.jsx';
import { plantBySlug, plants, plots } from '../data/plants.js';
import { careQueue, gardenSummary, plotPlan } from '../state/garden.js';

export default function Home() {
  const featured = plants.slice(0, 3);
  const entriesLabel = () => `${gardenSummary().entries} journal ${gardenSummary().entries === 1 ? 'entry' : 'entries'}`;
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
        <h1>Seed packets.<br />Small daily rituals.</h1>
        <p>A garden notebook for what you planted, where it grows, and what you noticed. Start with a soil check; keep the observations that help you care for it.</p>
        <div class="hero-actions">
          <Link class="button primary" href="/catalog">Open seed catalog</Link>
          <Link class="button" href="/journal">Watering journal</Link>
        </div>
        <div class="garden-stats">
          <span>{gardenSummary().plants} plants</span>
          <span>{gardenSummary().plots} plots</span>
          <span>{entriesLabel()}</span>
        </div>
      </div>
      <aside class="care-calendar" aria-label="Care calendar">
        <p class="eyebrow">Care queue</p>
        {careQueue().slice(0, 4).map((plant) => (
          <Link href={`/plants/${plant.slug}`}><strong>{plant.name}</strong><span>{plant.label}</span></Link>
        ))}
      </aside>
      <div class="plot-map" aria-label="Plot map preview">
        {plots.map((plot) => (
          <div class={`plot-shape ${plot.replaceAll(' ', '-')}`}>
            <span>{plot}</span>
            <div class="plot-dots" aria-label={`${plotPlan()[plot].length} assigned plant${plotPlan()[plot].length === 1 ? '' : 's'} in ${plot}`}>
              {plotPlan()[plot].map((slug) => {
                const plant = plantBySlug(slug);
                return plant ? <i title={plant.name} style={`--plant:${plant.color}`} /> : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
