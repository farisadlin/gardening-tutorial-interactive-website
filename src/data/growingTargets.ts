import type { Localized, Source } from './garden';
const b = (en: string, id: string): Localized => ({ en, id });
export type Range = readonly [number, number];
export type PpmScale = 500 | 700;
export interface GrowingTarget {
  ph: Range; ec: Range; air: Range; note: Localized; nutrientSource: Source; temperatureSource: Source;
}
export const measurementSources = {
  hydro: { title: 'Oklahoma State University · EC, pH & solution temperature', url: 'https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics' },
  scales: { title: 'Bluelab · EC and PPM scales', url: 'https://support.bluelab.com/hc/en-us/articles/205237090-What-are-the-different-conductivity-scales-What-do-they-mean-' },
};
// Shared hydroponic reference, rounded from OSU's 72–75 °F. Not a species-specific optimum.
export const solutionTemperature: Range = [22, 24];
export const growingTargets: Record<string, GrowingTarget> = {
  'pak-choi': {
    ph: [5.5, 6.5], ec: [1.5, 2], air: [16, 21],
    note: b('Cool-weather reference for established plants. Locally adapted, heat-tolerant cultivars may grow warmer; shade the afternoon sun. The nutrient band is a starting range within the cited pak choi trial, not a universal optimum.', 'Acuan tanaman mapan penyuka sejuk. Varietas lokal tahan panas dapat tumbuh pada suhu lebih hangat; naungi terik siang. Kisaran nutrisi adalah rentang awal dalam uji pakcoy yang dirujuk, bukan angka optimum universal.'),
    nutrientSource: { title: 'IPB · Pak choy in NFT: pH & EC trial conditions', url: 'https://journal.ipb.ac.id/mapace/article/view/71769' },
    temperatureSource: { title: 'Iowa State University · Bok choy temperature & cultivars', url: 'https://www.extension.iastate.edu/vegetablelab/bok-choy-cultivar-trial-spring-high-tunnel-production' },
  },
  'water-spinach': {
    ph: [5.5, 6.5], ec: [1.5, 2], air: [25, 32],
    note: b('A warm-weather crop. Its preferred air temperature is higher than the shared solution-temperature reference: keep the reservoir shaded and aerated as your system requires. These are nutrient-solution readings, not a fertilizer mixing dose.', 'Tanaman penyuka hangat. Suhu udara yang disukai lebih tinggi daripada acuan suhu larutan bersama: naungi tandon dan beri aerasi sesuai sistem. Angka ini adalah bacaan larutan nutrisi, bukan takaran pencampuran pupuk.'),
    nutrientSource: { title: 'BBPP Kupang · Kangkung pH & EC guidance', url: 'https://bbppkupang.bppsdmp.pertanian.go.id/blog/fungsi-tdc-meter-dan-ph-meter-untuk-hidroponik' },
    temperatureSource: { title: 'World Vegetable Center · Home gardening crop guides', url: 'https://avrdc.org/download/home_garden_toolbox/crop_guides/HomeGardenToolbox-CropGuides.pdf' },
  },
  amaranth: {
    ph: [6, 6.5], ec: [1.3, 1.7], air: [25, 35],
    note: b('Vegetable amaranth, not cool-season spinach. EC 1.3–1.7 is an editorial starting band around a 1.5 mS/cm result for red amaranth Arka Arunima in NFT. Other leafy species, cultivars and systems need adjustment; the study does not establish a universal range.', 'Bayam sayur/amaranth, bukan spinach penyuka dingin. EC 1,3–1,7 adalah kisaran awal editorial di sekitar hasil 1,5 mS/cm untuk bayam merah Arka Arunima pada NFT. Spesies daun, varietas dan sistem lain perlu penyesuaian; penelitian itu tidak menetapkan rentang universal.'),
    nutrientSource: { title: 'JEAI · Red amaranth Arka Arunima nutrient trial', url: 'https://www.journaljeai.com/index.php/JEAI/article/view/4326' },
    temperatureSource: { title: 'World Vegetable Center · Growing amaranth', url: 'https://avrdc.org/download/v4pp/training-farmers/1-6-other-gap/1-6-1-production-guides/Grow-Amaranth.pdf' },
  },
  lettuce: {
    ph: [6, 7], ec: [1.2, 1.8], air: [16, 21],
    note: b('Prefers cooler air. Heat-tolerant loose-leaf varieties help in the tropics, but sustained heat can still cause bolting or bitterness. Start near the lower end for established plants in hot conditions and follow the nutrient product guidance.', 'Menyukai udara lebih sejuk. Selada daun tahan panas membantu di tropis, tetapi panas berkepanjangan tetap dapat memicu bunga atau rasa pahit. Mulai dekat batas bawah untuk tanaman mapan saat panas dan ikuti panduan produk nutrisi.'),
    nutrientSource: measurementSources.hydro,
    temperatureSource: { title: 'University of Illinois · Growing lettuce in cool conditions', url: 'https://extension.illinois.edu/blogs/good-growing/2020-04-24-how-grow-lettuce' },
  },
  chilli: {
    ph: [5.5, 6], ec: [.8, 1.8], air: [21, 29],
    note: b('The cited general pepper EC range is a growth reference, not a complete fruiting schedule for every chilli cultivar. Flowering and fruiting may need a different product-specific feed plan. Hot peppers vary in heat tolerance; high heat can reduce fruit set.', 'Kisaran EC pepper pada sumber adalah acuan pertumbuhan, bukan jadwal nutrisi berbuah lengkap untuk semua varietas cabai. Fase bunga dan buah dapat memerlukan panduan nutrisi berbeda dari produk. Toleransi panas cabai bervariasi; panas tinggi dapat mengurangi pembentukan buah.'),
    nutrientSource: measurementSources.hydro,
    temperatureSource: { title: 'Iowa State University · Pepper growth & fruit-set temperatures', url: 'https://yardandgarden.extension.iastate.edu/how-to/growing-peppers-home-garden' },
  },
  chives: {
    ph: [5.5, 6.8], ec: [1.8, 2.4], air: [13, 24],
    note: b('For common chives (Allium schoenoprasum), not garlic chives or spring onions. The EC/pH reference is a hydroponic equipment producer’s growing guide. Established clumps tolerate some variation; use afternoon shade in tropical heat.', 'Untuk common chives (Allium schoenoprasum), bukan kucai bawang/garlic chives atau daun bawang. Acuan EC/pH berasal dari panduan produsen peralatan hidroponik. Rumpun mapan menoleransi variasi tertentu; beri naungan siang saat panas tropis.'),
    nutrientSource: { title: 'IGWorks · Growing hydroponic chives', url: 'https://igworks.com/blogs/growing-guides/growing-hydroponic-chives' },
    temperatureSource: { title: 'Ontario Ministry of Agriculture · Common chives', url: 'https://omafra.gov.on.ca/CropOp/en/herbs/culinary/chive.html' },
  },
};
export function ppmRange(ec: Range, scale: PpmScale): Range { return [Math.round(ec[0] * scale), Math.round(ec[1] * scale)]; }
export function rangeText(range: Range, language: 'en' | 'id'): string {
  const formatter = new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { maximumFractionDigits: 2 });
  return range.map(n => formatter.format(n)).join('–');
}
export function targetSources(cropId: string, hydro: boolean): Source[] {
  const target = growingTargets[cropId];
  return [...new Map([target.temperatureSource, ...(hydro ? [target.nutrientSource, measurementSources.hydro, measurementSources.scales] : [])].map(s => [s.url, s])).values()];
}
