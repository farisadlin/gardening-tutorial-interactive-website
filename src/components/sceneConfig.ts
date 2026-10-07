import { b, type Stage } from '../data/garden';
export const scenePresets: Record<Stage, { growth: number; focus: 'container' | 'seed' | 'roots' | 'leaves'; caption: ReturnType<typeof b> }> = {
  prepare: { growth: 0, focus: 'container', caption: b('Prepare the container and growing environment.', 'Siapkan wadah dan lingkungan tumbuh.') },
  sow: { growth: 0, focus: 'seed', caption: b('Start a seed in a moist propagation plug or seed tray.', 'Semai benih dalam media lembap atau baki semai.') },
  transplant: { growth: .32, focus: 'roots', caption: b('Move the intact seedling plug and keep its crown above the medium.', 'Pindahkan media bibit utuh dan jaga pangkal di atas media.') },
  care: { growth: .72, focus: 'roots', caption: b('Follow the roots below the surface and keep their growing conditions steady.', 'Amati akar di bawah permukaan dan jaga kondisi tumbuh stabil.') },
  troubleshoot: { growth: .72, focus: 'leaves', caption: b('Inspect the leaves and roots before changing water or nutrients.', 'Periksa daun dan akar sebelum mengubah air atau nutrisi.') },
  harvest: { growth: 1, focus: 'leaves', caption: b('Look for mature, tender growth; this is an illustration, not a yield prediction.', 'Amati pertumbuhan dewasa yang empuk; ini ilustrasi, bukan prediksi panen.') },
};
