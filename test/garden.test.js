import { describe, expect, it } from 'vitest';
import { plantBySlug, plants } from '../src/data/plants.js';
import { assignPlant, plotPlan, resetGarden } from '../src/state/garden.js';

describe('plant catalog', () => {
  it('finds routeable plants by slug', () => {
    expect(plantBySlug('sun-gold-tomato')?.name).toBe('Sun Gold Tomato');
  });

  it('keeps care cadences finite and positive', () => {
    expect(plants.every((plant) => Number.isFinite(plant.waterEvery) && plant.waterEvery > 0)).toBe(true);
  });

  it('moves a plant to one plot instead of duplicating assignments', () => {
    resetGarden();
    assignPlant('kitchen bed', 'sun-gold-tomato');
    const appearances = Object.values(plotPlan()).flat().filter((slug) => slug === 'sun-gold-tomato');
    expect(appearances).toHaveLength(1);
    expect(plotPlan()['kitchen bed']).toContain('sun-gold-tomato');
    expect(plotPlan()['south trellis']).not.toContain('sun-gold-tomato');
  });
});
