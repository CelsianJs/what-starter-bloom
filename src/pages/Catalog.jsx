import { Link } from 'what-framework/router';
import { PlantMark } from '../components/PlantArt.jsx';
import { plots } from '../data/plants.js';
import { assignPlant, careQueue, filteredPlants, logWatering, resetGarden, seasonFilter } from '../state/garden.js';

export default function Catalog() {
  return (
    <section class="page-enter">
      <div class="section-head">
        <div>
          <p class="eyebrow">Seed catalog</p>
          <h1>Choose plants by season and care rhythm.</h1>
        </div>
        <button class="button ghost" onClick={resetGarden}>Reset garden</button>
      </div>
      <label class="filter-control">
        <span>Season filter</span>
        <select value={seasonFilter()} onInput={(event) => seasonFilter(event.target.value)} onChange={(event) => seasonFilter(event.target.value)}>
          <option value="all">All seasons</option>
          <option value="warm">Warm season</option>
          <option value="cool">Cool season</option>
          <option value="spring">Spring</option>
        </select>
      </label>
      <div class="plant-grid">
        {filteredPlants().map((plant) => (
          <article class="plant-card" style={`--plant:${plant.color}`}>
            <PlantMark plant={plant} />
            <p class="row-kicker">{plant.family} · water every {plant.waterEvery} day{plant.waterEvery === 1 ? '' : 's'}</p>
            <h2><Link href={`/plants/${plant.slug}`}>{plant.name}</Link></h2>
            <p>{plant.notes}</p>
            <div class="action-row">
              <button class="button" onClick={() => logWatering(plant.slug)}>Log watering</button>
              <select aria-label={`Assign ${plant.name} to plot`} onChange={(event) => assignPlant(event.target.value, plant.slug)}>
                <option value="">Assign plot</option>
                {plots.map((plot) => <option value={plot}>{plot}</option>)}
              </select>
            </div>
          </article>
        ))}
      </div>
      <aside class="care-strip" aria-label="Care queue">
        {careQueue().slice(0, 3).map((plant) => <span>{plant.name}: {plant.urgency}</span>)}
      </aside>
    </section>
  );
}
