import { Link, route } from 'what-framework/router';
import { plantBySlug, plots } from '../data/plants.js';
import { assignPlant, logWatering } from '../state/garden.js';

export default function PlantDetail() {
  const plant = plantBySlug(route.params.slug);
  if (!plant) {
    return (
      <section class="empty-state page-enter">
        <p class="eyebrow">Unknown seed</p>
        <h1>No plant is filed under that route.</h1>
        <Link class="button" href="/catalog">Back to catalog</Link>
      </section>
    );
  }
  return (
    <article class="plant-detail page-enter" style={`--plant:${plant.color}`}>
      <Link class="text-link" href="/catalog">← Catalog</Link>
      <p class="eyebrow">{plant.family} · {plant.season} season</p>
      <h1>{plant.name}</h1>
      <p>{plant.notes}</p>
      <ul class="task-list">{plant.tasks.map((task) => <li>{task}</li>)}</ul>
      <div class="action-row">
        <button class="button primary" onClick={() => logWatering(plant.slug)}>Log watering</button>
        <label><span>Assign plot</span><select onChange={(event) => assignPlant(event.target.value, plant.slug)}>
          <option value="">Choose plot</option>
          {plots.map((plot) => <option value={plot}>{plot}</option>)}
        </select></label>
      </div>
    </article>
  );
}
