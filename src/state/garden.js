import { computed, effect, signal } from 'what-framework';
import { plantBySlug, plants, plots } from '../data/plants.js';

export const STORAGE_KEY = 'what-starter-bloom-v1';

function seedPlan() {
  return {
    'kitchen bed': ['opal-basil'],
    'south trellis': ['sun-gold-tomato'],
    'root box': ['moon-carrot'],
    'pollinator edge': ['blue-borage'],
    'east arch': ['jade-cucumber'],
  };
}

function initialJournal() {
  return [{ id: 'water-seed', plant: 'opal-basil', note: 'Seeded journal with a light morning soak.', day: 'Today' }];
}

const knownSeasons = ['all', ...new Set(plants.map((plant) => plant.season))];

function validPlan(plan) {
  if (!plan || Array.isArray(plan) || typeof plan !== 'object') return false;
  const keys = Object.keys(plan);
  if (keys.length !== plots.length || !plots.every((plot) => keys.includes(plot))) return false;
  const assigned = new Set();
  for (const plot of plots) {
    const slugs = plan[plot];
    if (!Array.isArray(slugs) || slugs.length > plants.length) return false;
    const plotSet = new Set();
    for (const slug of slugs) {
      if (!plantBySlug(slug) || plotSet.has(slug) || assigned.has(slug)) return false;
      plotSet.add(slug);
      assigned.add(slug);
    }
  }
  return true;
}

function validJournal(journal) {
  return Array.isArray(journal)
    && journal.length <= 30
    && journal.every((entry) => entry
      && typeof entry.id === 'string'
      && plantBySlug(entry.plant)
      && typeof entry.note === 'string'
      && typeof entry.day === 'string');
}

function validFilter(filter) {
  return knownSeasons.includes(filter);
}

function safeLoad() {
  if (typeof localStorage === 'undefined') return { plan: seedPlan(), journal: initialJournal(), filter: 'all', status: 'Session only.' };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || !validPlan(parsed.plan) || !validJournal(parsed.journal) || !validFilter(parsed.filter || 'all')) {
      return { plan: seedPlan(), journal: initialJournal(), filter: 'all', status: 'Loaded seed garden.' };
    }
    return {
      plan: parsed.plan,
      journal: parsed.journal,
      filter: parsed.filter || 'all',
      status: 'Garden restored from this browser.',
    };
  } catch {
    return { plan: seedPlan(), journal: initialJournal(), filter: 'all', status: 'Stored garden was invalid, so seed data loaded.' };
  }
}

const initial = safeLoad();

export const plotPlan = signal(initial.plan, 'bloom.plotPlan');
export const wateringJournal = signal(initial.journal, 'bloom.wateringJournal');
export const seasonFilter = signal(initial.filter, 'bloom.seasonFilter');
export const saveStatus = signal(initial.status, 'bloom.saveStatus');

export const filteredPlants = computed(() => plants.filter((plant) => seasonFilter() === 'all' || plant.season === seasonFilter()));

export const careQueue = computed(() => filteredPlants()
  .map((plant) => ({
    ...plant,
    urgency: plant.waterEvery <= 1 ? 'today' : plant.waterEvery <= 2 ? 'soon' : 'watch',
    lastWatered: wateringJournal().find((entry) => entry.plant === plant.slug)?.day || 'not logged',
  }))
  .sort((a, b) => a.waterEvery - b.waterEvery));

export const gardenSummary = computed(() => ({
  plants: plants.length,
  plots: Object.keys(plotPlan()).length,
  dueToday: careQueue().filter((plant) => plant.urgency === 'today').length,
  entries: wateringJournal().length,
}));

export function assignPlant(plot, slug) {
  if (!plots.includes(plot) || !plantBySlug(slug)) return;
  plotPlan((plan) => {
    const next = Object.fromEntries(plots.map((name) => [
      name,
      (plan[name] || []).filter((item) => item !== slug),
    ]));
    next[plot] = [...next[plot], slug];
    return next;
  });
}

export function logWatering(slug, note = 'Watered deeply.') {
  const plant = plantBySlug(slug);
  if (!plant) return;
  wateringJournal((entries) => [{ id: `water-${Date.now().toString(36)}`, plant: slug, note, day: 'Today' }, ...entries].slice(0, 30));
}

export function resetGarden() {
  plotPlan(seedPlan());
  wateringJournal(initialJournal());
  seasonFilter('all');
  saveStatus('Garden reset to seed plan.');
}

function persistSnapshot(snapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    saveStatus(`Saved ${snapshot.journal.length} watering entr${snapshot.journal.length === 1 ? 'y' : 'ies'} locally.`);
  } catch {
    saveStatus('Changes are not saved in this browser. Garden edits will last for this session only.');
  }
}

effect(() => {
  if (typeof localStorage === 'undefined') return;
  persistSnapshot({ plan: plotPlan(), journal: wateringJournal(), filter: seasonFilter() });
});
