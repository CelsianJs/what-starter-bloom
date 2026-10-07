import { plantBySlug } from '../data/plants.js';
import { wateringJournal } from '../state/garden.js';
import { Link } from 'what-framework/router';
import { formatEntryDate } from '../utils/care.js';

export default function Journal() {
  return (
    <section class="page-enter">
      <p class="eyebrow">Watering journal</p>
      <h1>A little attention, recorded.</h1>
      <p>Watering and observations, newest first. Undated notes remain undated; only dated watering changes the care window. The latest 30 notes stay in this browser.</p>
      <div class="journal-list">
        {wateringJournal().map((entry) => (
          <article>
            <strong><Link href={`/plants/${entry.plant}`}>{plantBySlug(entry.plant)?.name || entry.plant}</Link></strong>
            <span>{entry.kind === 'observation' ? 'Observation' : 'Watering'} · {formatEntryDate(entry)}</span>
            <p>{entry.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
