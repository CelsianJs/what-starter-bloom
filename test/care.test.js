import { expect, it } from 'vitest';
import { careForPlant, migrateJournal } from '../src/utils/care.js';

const plant = { slug: 'sun-gold-tomato', waterEvery: 1 };
const now = new Date('2026-10-07T12:00:00.000Z');
it('moves a manually watered plant out of today until its next care window', () => {
  const entries = [{ plant: plant.slug, observedAt: now.toISOString(), note: 'Soil dry; watered.' }];
  expect(careForPlant(plant, entries, now).urgency).toBe('soon');
  expect(careForPlant(plant, entries, new Date('2026-10-08T12:00:00.000Z')).urgency).toBe('today');
  expect(careForPlant(plant, entries, new Date('2026-10-09T12:00:00.000Z')).urgency).toBe('overdue');
});
it('does not invent dates for legacy Today labels', () => {
  const [entry] = migrateJournal([{ id: 'old', plant: plant.slug, note: 'Old note', day: 'Today' }]);
  expect(entry.observedAt).toBe(null);
  expect(entry.note).toBe('Old note');
  expect(careForPlant(plant, [entry], now).urgency).toBe('check');
});
it('ignores observation-only notes and invalid/future timestamps for watering', () => {
  const entries = [{ plant: plant.slug, kind: 'observation', observedAt: now.toISOString() }, { plant: plant.slug, observedAt: 'invalid' }, { plant: plant.slug, observedAt: '2027-01-01T00:00:00Z' }];
  expect(careForPlant(plant, entries, now).urgency).toBe('check');
});
