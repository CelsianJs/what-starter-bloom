import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { plants } from '../src/data/plants.js';

const routes = [
  ['/', 'Bloom — Garden planner', 'Seed catalog, plot plan, watering journal, and computed care queue.'],
  ['/catalog', 'Catalog — Bloom', 'Seasonal seed catalog with local care actions.'],
  ...plants.map((plant) => [`/plants/${plant.slug}`, `${plant.name} — Bloom`, plant.notes]),
  ['/plots', 'Plots — Bloom', 'Local plot plan grouped by garden bed.'],
  ['/journal', 'Watering journal — Bloom', 'Local watering and care journal.'],
  ['/build', 'How Bloom is built', 'Implementation notes for agents learning What Framework.'],
];

const shellPath = join('dist', 'index.html');
if (!existsSync(shellPath)) {
  throw new Error('dist/index.html missing; run vite build first');
}
const shell = readFileSync(shellPath, 'utf8');

function writeRoute(path, title, description) {
  const out = path === '/' ? shellPath : join('dist', path.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  const html = shell
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace('<div id="app"></div>', `<div id="app"><noscript><main><h1>${title}</h1><p>${description}</p></main></noscript></div>`);
  writeFileSync(out, html);
}

for (const route of routes) writeRoute(...route);
writeRoute('/404', 'Page not found — Bloom', 'Bloom includes a genuine 404 artifact for Vura static hosting.');
copyFileSync(join('dist', '404', 'index.html'), join('dist', '404.html'));

console.log(`static aliases OK: ${routes.length} routes plus 404`);
