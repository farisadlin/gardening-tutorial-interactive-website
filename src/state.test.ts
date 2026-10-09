import { describe, it, expect } from 'vitest';
import { emptyState, sanitizeState, countComplete } from './state';
import { tutorials } from './data/garden';
describe('Saved learning state', () => {
  it('recovers safely from corrupted and unsupported saved data', () => {
    for (const invalid of [null, [], 'bad', { version: 2 }, { version: 1, progress: { 'pak-choi:soil': null } }]) expect(sanitizeState(invalid).language).toBe('id');
  });
  it('defaults to Indonesian while preserving an explicit English choice', () => {
    expect(emptyState().language).toBe('id');
    expect(sanitizeState({ version: 1, language: 'en', progress: {} }).language).toBe('en');
  });
  it('keeps language but removes invalid task and answer references', () => {
    const result = sanitizeState({ version: 1, language: 'id', progress: { 'pak-choi:soil': { prepare: { checks: [0, 0, -1, 999, 1.5], answer: 7, complete: true } }, invented: {} } });
    expect(result.language).toBe('id');
    expect(result.progress['pak-choi:soil']?.prepare).toEqual({ checks: [0], answer: undefined, complete: false });
    expect(result.progress.invented).toBeUndefined();
  });
  it('counts a completed lesson only with all tasks and a correct quiz', () => {
    const state = emptyState();
    const tutorial = tutorials.find(t => t.id === 'pak-choi:soil')!;
    state.progress[tutorial.id] = Object.fromEntries(tutorial.steps.map(s => [s.id, { checks: [0, 1, 2], answer: s.quiz.correct, complete: true }]));
    const result = sanitizeState(state);
    expect(countComplete(result, tutorial.id)).toBe(6);
    expect(countComplete(result, 'pak-choi:hydro')).toBe(0);
    result.progress[tutorial.id]!.prepare!.answer = 1;
    expect(countComplete(sanitizeState(result), tutorial.id)).toBe(5);
  });
});
