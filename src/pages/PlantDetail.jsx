import { Link, route } from 'what-framework/router';
import { PacketPlant } from '../components/PlantArt.jsx';
import { plantBySlug, plots } from '../data/plants.js';
import { useSignal } from 'what-framework';
import { assignedPlot, assignPlant, plantCare, logObservation, logWatering, wateringJournal } from '../state/garden.js';
import { formatEntryDate } from '../utils/care.js';

export default function PlantDetail() {
  const plant = plantBySlug(route.params.slug);
  const note = useSignal('');
  const feedback = useSignal('');
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
      <div class="plant-hero">
        <PacketPlant plant={plant} className="packet-plant detail-packet" />
        <div>
          <p class="eyebrow">{plant.family} · {plant.season} season</p>
          <h1>{plant.name}</h1>
          <p>{plant.notes}</p>
        </div>
      </div>
      <ul class="task-list">{plant.tasks.map((task) => <li>{task}</li>)}</ul>
      <section class="plant-care" aria-label="Manual care window">
        <div><p class="eyebrow">Next manual check</p><strong>{() => plantCare(plant.slug).label}</strong></div>
        <p>Suggested watering interval: {plant.waterEvery} {plant.waterEvery === 1 ? 'day' : 'days'}. Check the soil before watering; this notebook does not sense moisture.</p>
        <p>{() => {
          const care = plantCare(plant.slug);
          return care.nextCare ? `Last watered ${new Date(care.lastWatered).toLocaleDateString()}. Next check ${new Date(care.nextCare).toLocaleDateString()}.` : 'No dated watering yet. Start with a manual soil check.';
        }}</p>
      </section>
      <div class="action-row">
        <button class="button primary" onClick={() => { logWatering(plant.slug); feedback('Watering recorded. The next care window has been updated.'); }}>Log watering</button>
        <label><span>Assign plot</span><select value={() => assignedPlot(plant.slug)} onChange={(event) => { assignPlant(event.target.value, plant.slug); feedback(`Moved to ${event.target.value}.`); }}>
          <option value="">Choose plot</option>
          {plots.map((plot) => <option value={plot}>{plot}</option>)}
        </select></label>
      </div>
      <form class="observation-form" onSubmit={(event) => { event.preventDefault(); if (logObservation(plant.slug, note())) { note(''); feedback('Observation saved. Watering date unchanged.'); } }}>
        <label><span>Observation</span><textarea maxLength="500" rows="3" required value={note} onInput={(event) => note(event.target.value)} placeholder="What changed in this bed?" /></label>
        <button class="button" type="submit">Save observation</button>
      </form>
      <p class="action-feedback" aria-live="polite">{feedback}</p>
      <section class="plant-history" aria-label="Recent plant history">
        <h2>From the notebook</h2>
        {() => {
          const entries = wateringJournal().filter(entry => entry.plant === plant.slug).slice(0, 5);
          return entries.length ? entries.map(entry => <article><span>{entry.kind === 'observation' ? 'Observation' : 'Watering'} · {formatEntryDate(entry)}</span><p>{entry.note}</p></article>) : <p>No notes yet. Your first observation starts the history.</p>;
        }}
      </section>
    </article>
  );
}
