import { plantBySlug } from '../data/plants.js';
import { wateringJournal } from '../state/garden.js';

export default function Journal() {
  return (
    <section class="page-enter">
      <p class="eyebrow">Watering journal</p>
      <h1>Care notes stay local.</h1>
      <div class="journal-list">
        {wateringJournal().map((entry) => (
          <article>
            <strong>{plantBySlug(entry.plant)?.name || entry.plant}</strong>
            <span>{entry.day}</span>
            <p>{entry.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
