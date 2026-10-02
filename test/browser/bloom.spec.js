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
  }
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
