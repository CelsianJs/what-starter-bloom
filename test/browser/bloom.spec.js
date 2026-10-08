import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { plants } from '../../src/data/plants.js';
import { STORAGE_KEY } from '../../src/state/garden.js';

test.beforeEach(async ({ page }) => {
  page.consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource: the server responded with a status of 404')) {
      page.consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => page.consoleErrors.push(error.message));
  await page.addInitScript(() => localStorage.removeItem('what-starter-bloom-v1'));
});

test.afterEach(async ({ page }) => {
  expect(page.consoleErrors).toEqual([]);
});

test('build guide contains literal code at390px with a wide fallback font', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/build');
  const widths = [await page.evaluate(() => ({ font: 'default', viewport: innerWidth, document: document.documentElement.scrollWidth }))];
  await page.addStyleTag({ content: '.build-notes pre code { font-family: "Courier New", monospace; font-size: 18px; letter-spacing: .8px; }' });
  widths.push(await page.evaluate(() => ({ font: 'wide fallback', viewport: innerWidth, document: document.documentElement.scrollWidth })));
  expect(widths.every(width => width.document <= width.viewport), JSON.stringify(widths)).toBe(true);
  await expect(page.locator('.build-notes pre code').first()).toContainText('nextCare.setDate(nextCare.getDate() + plant.waterEvery);');
});

test('detail reflects current plot and records a dated observation without watering', async ({ page }) => {
  await page.goto('/plants/sun-gold-tomato');
  await expect(page.getByLabel('Assign plot')).toHaveValue('south trellis');
  await page.getByLabel('Assign plot').selectOption('kitchen bed');
  await expect(page.getByLabel('Assign plot')).toHaveValue('kitchen bed');
  await page.getByLabel('Observation').fill('New flower truss on the north stem.');
  await page.getByRole('button', { name: 'Save observation' }).click();
  await expect(page.locator('.plant-history')).toContainText('New flower truss');
  await expect(page.locator('.plant-care')).toContainText('Check soil');
  await page.getByRole('button', { name: 'Log watering', exact: true }).click();
  await expect(page.locator('.plant-care')).toContainText('Rest');
});

test('filters catalog, assigns a plot, logs watering, and screenshots', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /seed packets/i })).toBeVisible();
  await expect(page.getByText('1 journal entry')).toBeVisible();
  await expect(page.locator('.plot-dots i')).toHaveCount(5);

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Catalog', exact: true }).click();
  await page.getByLabel('Season filter').selectOption('warm');
  await expect(page.getByRole('link', { name: 'Sun Gold Tomato' })).toBeVisible();
  await page.getByLabel('Assign Sun Gold Tomato to plot').selectOption('kitchen bed');
  await page.getByRole('button', { name: 'Log watering' }).first().click();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Plots', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Sun Gold Tomato' })).toHaveCount(1);
  await expect(page.locator('.plot-card').filter({ has: page.getByRole('heading', { name: 'kitchen bed' }) }).getByRole('link', { name: 'Sun Gold Tomato' })).toBeVisible();
  await expect(page.locator('.plot-card').filter({ has: page.getByRole('heading', { name: 'south trellis' }) }).getByRole('link', { name: 'Sun Gold Tomato' })).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Journal', exact: true }).click();
  await expect(page.getByText('Watered deeply.')).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home', exact: true }).click();
  await page.waitForTimeout(350);
  mkdirSync('test-results/screenshots', { recursive: true });
  await page.screenshot({ path: `test-results/screenshots/bloom-${testInfo.project.name}.png`, fullPage: false });
});

test('every plant detail route is directly addressable', async ({ page }) => {
  for (const plant of plants) {
    await page.goto(`/plants/${plant.slug}`);
    await expect(page.getByRole('heading', { name: plant.name })).toBeVisible();
    await expect(page.getByRole('img', { name: `${plant.name} seed packet illustration` })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Catalog', exact: true })).toHaveAttribute('aria-current', 'location');
  }
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Catalog', exact: true })).not.toHaveAttribute('aria-current');
});

test('legacy Today text remains undated while dated watering advances care', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-07T12:00:00Z'));
  await page.addInitScript(key => {
    localStorage.setItem(key, JSON.stringify({
      plan: { 'kitchen bed': ['opal-basil'], 'south trellis': ['sun-gold-tomato'], 'root box': ['moon-carrot'], 'pollinator edge': ['blue-borage'], 'east arch': ['jade-cucumber'] },
      journal: [{ id: 'legacy', plant: 'sun-gold-tomato', note: 'A remembered soak.', day: 'Today' }], filter: 'all',
    }));
  }, STORAGE_KEY);
  await page.goto('/plants/sun-gold-tomato');
  await expect(page.locator('.plant-history')).toContainText('Undated legacy note');
  await expect(page.locator('.plant-care')).toContainText('Check soil');
  await page.getByRole('button', { name: 'Log watering', exact: true }).click();
  await expect(page.locator('.plant-care')).toContainText('Rest');
  await page.clock.setFixedTime(new Date('2026-10-09T12:00:00Z'));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('.plant-care')).toContainText('Overdue');
});

test('storage-denied browsers keep session edits without crashing', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('storage denied by test');
    };
  });
  await page.goto('/plants/opal-basil');
  await page.getByRole('button', { name: 'Log watering' }).click();
  await expect(page.getByText(/not saved in this browser/i)).toBeVisible();
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Journal', exact: true }).click();
  await expect(page.getByText('Watered deeply.')).toBeVisible();
});

test('malformed stored garden falls back to seed state', async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({
      plan: {
        'kitchen bed': ['sun-gold-tomato'],
        'south trellis': ['sun-gold-tomato'],
        'root box': ['moon-carrot'],
        'pollinator edge': ['blue-borage'],
        'east arch': ['jade-cucumber'],
        rogue: ['opal-basil'],
      },
      journal: [null],
      filter: 'winter',
    }));
  }, STORAGE_KEY);
  await page.goto('/plots');
  await expect(page.getByRole('link', { name: 'Sun Gold Tomato' })).toHaveCount(1);
  await expect(page.locator('.plot-card').filter({ has: page.getByRole('heading', { name: 'south trellis' }) }).getByRole('link', { name: 'Sun Gold Tomato' })).toBeVisible();
  await expect(page.locator('.plot-card').filter({ has: page.getByRole('heading', { name: 'kitchen bed' }) }).getByRole('link', { name: 'Sun Gold Tomato' })).toHaveCount(0);
});

test('unknown route renders fallback and keyboard focus works', async ({ page }) => {
  await page.goto('/lost-seed');
  await expect(page.getByRole('heading', { name: /overgrown/i })).toBeVisible();
  await page.goto('/catalog');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
});


test('modern typography and touch geometry remain consistent across routes', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const route of ["/","/catalog","/plants/opal-basil","/plots","/journal","/build"]) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      const metrics = await page.evaluate(() => {
        const heading = getComputedStyle(document.querySelector('h1'));
        const body = getComputedStyle(document.body);
        const targets = [...document.querySelectorAll('nav a, button, .button, a.brand')].filter(node => node.getClientRects().length);
        const navRows = new Map();
        for (const link of document.querySelectorAll('nav a')) {
          const top = Math.round(link.getBoundingClientRect().top);
          navRows.set(top, (navRows.get(top) || 0) + 1);
        }
        return { navRows: [...navRows.values()], heading: parseFloat(heading.fontSize), family: body.fontFamily, body: body.fontSize, overflow: document.documentElement.scrollWidth > innerWidth, smallTargets: targets.filter(node => node.getBoundingClientRect().height < 43.9).map(node => node.textContent) };
      });
      expect(metrics.family).toContain('Avenir Next');
      expect(metrics.body).toBe('16px');
      expect(metrics.heading).toBeGreaterThanOrEqual(28);
      expect(metrics.heading).toBeLessThanOrEqual(36);
      expect(metrics.overflow).toBe(false);
      expect(metrics.smallTargets).toEqual([]);
      if (viewport.width === 390) expect(metrics.navRows).toEqual([3, 2]);
      const firstNav = page.locator('nav a').first();
      await firstNav.focus();
      await expect(firstNav).toHaveCSS('outline-style', 'solid');
    }
  }
});
