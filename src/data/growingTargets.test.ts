import { describe, it, expect } from 'vitest';
import { crops, getTutorial } from './garden';
import { growingTargets, ppmRange, rangeText, targetSources } from './growingTargets';
describe('crop measurement references', () => {
  it('represents the same solution correctly on different meter scales', () => {
    expect(ppmRange([1.5, 2], 500)).toEqual([750, 1000]);
    expect(ppmRange([1.5, 2], 700)).toEqual([1050, 1400]);
    expect(rangeText([5.5, 6.5], 'id')).toBe('5,5–6,5');
  });
  it('covers every crop with provenance in every hydroponic tutorial', () => {
    expect(Object.keys(growingTargets).sort()).toEqual(crops.map(c => c.id).sort());
    for (const crop of crops) {
      const refs = targetSources(crop.id, true);
      expect(refs.length).toBeGreaterThanOrEqual(3);
      for (const ref of refs) expect(getTutorial(crop, 'hydro').sources).toContainEqual(ref);
    }
  });
  it('does not substitute cool-season spinach targets for tropical amaranth', () => {
    expect(growingTargets.amaranth.air).toEqual([25, 35]);
    expect(growingTargets.amaranth.note.en).toContain('not cool-season spinach');
    expect(growingTargets.amaranth.note.en).toContain('editorial');
    expect(growingTargets.amaranth.nutrientSource.title).toContain('amaranth');
  });
});
