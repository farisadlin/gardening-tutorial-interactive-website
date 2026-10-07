import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { tutorials, type Language, type Stage } from './data/garden';
export interface StepProgress { checks: number[]; answer?: number; complete: boolean }
export interface SavedState { version: 1; language: Language; progress: Record<string, Partial<Record<Stage, StepProgress>>> }
export const STORAGE_KEY = 'grow-together:v1';
export const emptyState = (): SavedState => ({ version: 1, language: 'en', progress: {} });
export function sanitizeState(raw: unknown): SavedState {
  const clean = emptyState();
  if (!raw || typeof raw !== 'object') return clean;
  const value = raw as Partial<SavedState>;
  if (value.version !== 1) return clean;
  if (value.language === 'id') clean.language = 'id';
  if (!value.progress || typeof value.progress !== 'object') return clean;
  for (const tutorial of tutorials) {
    const path = value.progress[tutorial.id];
    if (!path || typeof path !== 'object') continue;
    clean.progress[tutorial.id] = {};
    for (const step of tutorial.steps) {
      const saved = path[step.id];
      if (!saved || typeof saved !== 'object') continue;
      const checks = Array.isArray(saved.checks) ? [...new Set(saved.checks.filter(i => Number.isInteger(i) && i >= 0 && i < step.tasks.length))] : [];
      const answer = typeof saved.answer === 'number' && Number.isInteger(saved.answer) && saved.answer >= 0 && saved.answer < step.quiz.choices.length ? saved.answer : undefined;
      clean.progress[tutorial.id][step.id] = { checks, answer, complete: saved.complete === true && checks.length === step.tasks.length && answer === step.quiz.correct };
    }
  }
  return clean;
}
function readState() {
  try { return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')); } catch { return emptyState(); }
}
interface GardenContextValue { state: SavedState; storageError: boolean; setLanguage: (lang: Language) => void; update: (path: string, stage: Stage, patch: Partial<StepProgress>) => void; reset: () => void }
const GardenContext = createContext<GardenContextValue | null>(null);
export function GardenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SavedState>(readState);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    document.documentElement.lang = state.language;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); setStorageError(false); } catch { setStorageError(true); }
  }, [state]);
  const update = (path: string, stage: Stage, patch: Partial<StepProgress>) => setState(old => {
    const previous = old.progress[path]?.[stage] || { checks: [], complete: false };
    const next = { ...previous, ...patch };
    const definition = tutorials.find(t => t.id === path)?.steps.find(s => s.id === stage);
    if (!definition) return old;
    if (next.checks.length !== definition.tasks.length || next.answer !== definition.quiz.correct) next.complete = false;
    return { ...old, progress: { ...old.progress, [path]: { ...old.progress[path], [stage]: next } } };
  });
  return <GardenContext.Provider value={{ state, storageError, setLanguage: language => setState(s => ({ ...s, language })), update, reset: () => setState(s => ({ ...emptyState(), language: s.language })) }}>{children}</GardenContext.Provider>;
}
export function useGarden() { const context = useContext(GardenContext); if (!context) throw new Error('GardenProvider missing'); return context; }
export const countComplete = (state: SavedState, id: string) => Object.values(state.progress[id] || {}).filter(s => s?.complete).length;
