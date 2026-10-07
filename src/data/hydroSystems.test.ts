import { describe, it, expect } from 'vitest';
import { crops, getTutorial, tutorialHref, tutorials } from './garden';
import { hydroSystems, resolveSystem, systemSupport } from './hydroSystems';
import { countComplete, sanitizeState } from '../state';
describe('System-specific learning paths', () => {
  it('preserves legacy default IDs and deep links', () => {
    for (const crop of crops) {
      const tutorial = getTutorial(crop, 'hydro');
      expect(tutorial.id).toBe(`${crop.id}:hydro`);
      expect(tutorialHref(tutorial, 'care')).toBe(`/learn/${crop.id}/hydro/care`);
    }
  });
  it('gives every supported crop-system pair its own URL and lessons', () => {
    for (const crop of crops) for (const system of hydroSystems) {
      const support = systemSupport(crop, system.id);
      const tutorial = tutorials.find(t => t.cropId === crop.id && t.systemId === system.id);
      expect(Boolean(tutorial)).toBe(support.available);
      if (!tutorial) continue;
      expect(tutorial.steps.find(s => s.id === 'prepare')!.tasks[0]).toEqual(system.setup);
      expect(tutorial.steps.find(s => s.id === 'care')!.tasks[1]).toEqual(system.care);
      expect(tutorial.steps.find(s => s.id === 'care')!.quiz.question).toEqual(system.quizQuestion);
      expect(tutorial.steps.find(s => s.id === 'troubleshoot')!.tasks[1]).toEqual(system.problem);
      expect(tutorial.steps.find(s => s.id === 'harvest')!.tasks[2]).toEqual(system.cleanup);
      const url = new URL(tutorialHref(tutorial, 'care'), 'https://example.test');
      expect(resolveSystem(crop, url.searchParams.get('system'))?.id).toBe(system.id);
    }
  });
  it('keeps existing saved Kratky progress separate from new NFT progress', () => {
    const crop = crops[0];
    const old = getTutorial(crop, 'hydro');
    const nft = getTutorial(crop, 'hydro', 'nft');
    const progress = Object.fromEntries(old.steps.map(step => [step.id, { checks: [0, 1, 2], answer: step.quiz.correct, complete: true }]));
    const saved = sanitizeState({ version: 1, language: 'id', progress: { [old.id]: progress, [nft.id]: { prepare: { checks: [0], complete: false } } } });
    expect(countComplete(saved, old.id)).toBe(6);
    expect(countComplete(saved, nft.id)).toBe(0);
    expect(saved.language).toBe('id');
  });
  it('rejects unknown systems and unsupported beginner crop-system pairs', () => {
    expect(resolveSystem(crops[0], 'unknown')).toBeUndefined();
    expect(resolveSystem(crops.find(c => c.id === 'chilli')!, 'wick')).toBeUndefined();
    expect(resolveSystem(crops.find(c => c.id === 'water-spinach')!, 'kratky')).toBeUndefined();
  });
});
