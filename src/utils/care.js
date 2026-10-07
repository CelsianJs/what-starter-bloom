const DAY = 86400000;
const midnight = value => { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; };

export function migrateJournal(entries) {
  return entries.map(entry => ({
    id: entry.id, plant: entry.plant, note: entry.note,
    kind: entry.kind === 'observation' ? 'observation' : 'watering',
    observedAt: typeof entry.observedAt === 'string' && Number.isFinite(Date.parse(entry.observedAt)) ? entry.observedAt : null,
  }));
}

export function careForPlant(plant, entries, now = new Date()) {
  const latest = entries.filter(entry => entry.plant === plant.slug && entry.kind !== 'observation'
    && entry.observedAt && Number.isFinite(Date.parse(entry.observedAt)) && Date.parse(entry.observedAt) <= +now)
    .sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt))[0];
  if (!latest) return { urgency: 'check', label: 'Check soil', lastWatered: 'No dated watering', nextCare: null };
  const nextCare = midnight(latest.observedAt);
  nextCare.setDate(nextCare.getDate() + plant.waterEvery);
  const days = Math.round((nextCare - midnight(now)) / DAY);
  return {
    urgency: days < 0 ? 'overdue' : days === 0 ? 'today' : days === 1 ? 'soon' : 'rest',
    label: days < 0 ? 'Overdue' : days === 0 ? 'Today' : days === 1 ? 'Rest · tomorrow' : `Rest · ${days} days`,
    lastWatered: latest.observedAt, nextCare: nextCare.toISOString(),
  };
}

export function formatEntryDate(entry) {
  return entry.observedAt ? new Date(entry.observedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Undated legacy note';
}
