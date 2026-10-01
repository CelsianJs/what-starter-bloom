export const plants = [
  { slug: 'opal-basil', name: 'Opal Basil', family: 'Herb', season: 'warm', waterEvery: 2, plot: 'kitchen bed', color: '#6c8f5d', notes: 'Pinch tips weekly for branching and keep soil evenly moist.', tasks: ['Pinch flower buds', 'Harvest outer stems'] },
  { slug: 'sun-gold-tomato', name: 'Sun Gold Tomato', family: 'Fruit', season: 'warm', waterEvery: 1, plot: 'south trellis', color: '#e2a33a', notes: 'Needs deep watering and soft ties as fruit clusters set.', tasks: ['Tie new growth', 'Check lower leaves'] },
  { slug: 'moon-carrot', name: 'Moon Carrot', family: 'Root', season: 'cool', waterEvery: 3, plot: 'root box', color: '#d98a4a', notes: 'Thin seedlings early; avoid transplanting once roots form.', tasks: ['Thin seedlings', 'Brush mulch aside'] },
  { slug: 'blue-borage', name: 'Blue Borage', family: 'Flower', season: 'spring', waterEvery: 4, plot: 'pollinator edge', color: '#6f96b8', notes: 'Pollinator magnet with edible flowers; self-seeds readily.', tasks: ['Deadhead spent blooms', 'Leave some seed heads'] },
  { slug: 'jade-cucumber', name: 'Jade Cucumber', family: 'Vine', season: 'warm', waterEvery: 1, plot: 'east arch', color: '#5f9f80', notes: 'Train vines up the arch and harvest small for crisp skins.', tasks: ['Guide tendrils', 'Harvest small fruit'] },
];

export const plots = ['kitchen bed', 'south trellis', 'root box', 'pollinator edge', 'east arch'];

export function plantBySlug(slug) {
  return plants.find((plant) => plant.slug === slug);
}
