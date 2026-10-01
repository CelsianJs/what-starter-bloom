import { Link } from 'what-framework/router';
import { plantBySlug } from '../data/plants.js';
import { plotPlan } from '../state/garden.js';

export default function Plots() {
  return (
    <section class="page-enter">
      <p class="eyebrow">Plot plan</p>
      <h1>Every bed has a purpose.</h1>
      <div class="plot-grid">
        {Object.entries(plotPlan()).map(([plot, slugs]) => (
          <article class="plot-card">
            <h2>{plot}</h2>
            {slugs.length === 0 ? <p>No plants assigned.</p> : slugs.map((slug) => {
              const plant = plantBySlug(slug);
              return <p><Link href={`/plants/${plant.slug}`}>{plant.name}</Link></p>;
            })}
          </article>
        ))}
      </div>
    </section>
  );
}
