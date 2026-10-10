import { b, type Crop, type Stage } from './garden';

export const growthTiming = { fps: 30, durationInFrames: 900, width: 900, height: 620, chapterFrames: 180 };
export const growthChapters = [
  { stage: 'prepare', title: b('Pre-sowing', 'Pra-semai') },
  { stage: 'sow', title: b('Sowing', 'Semai') },
  { stage: 'transplant', title: b('Planting', 'Tanam') },
  { stage: 'care', title: b('Growing', 'Tumbuh') },
  { stage: 'harvest', title: b('Harvest', 'Panen') },
] as const;
export function growthChapter(frame: number) {
  return Math.min(4, Math.max(0, Math.floor(frame / growthTiming.chapterFrames)));
}
export function growthFrameForStage(stage?: Stage) {
  const index = stage === 'troubleshoot' ? 3 : growthChapters.findIndex(item => item.stage === stage);
  return Math.max(0, index) * growthTiming.chapterFrames;
}
export function growthNote(crop: Crop, chapter: number) {
  return [
    b(`Prepare clean containers and moist propagation medium. Sowing depth: ${crop.depth}.`, `Siapkan wadah bersih dan media semai lembap. Kedalaman semai: ${crop.depth.replaceAll('.', ',')}.`),
    crop.sow, crop.transplant, crop.care, crop.harvest,
  ][chapter];
}
