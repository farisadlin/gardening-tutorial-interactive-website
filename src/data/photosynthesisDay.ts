import type { Localized, Method, Language } from './garden';
const b = (en: string, id: string): Localized => ({ en, id });
export const dayTiming = { fps: 30, framesPerHour: 120, durationInFrames: 2880, width: 1000, height: 660 };
export const hourLabel = (hour: number) => `${String(hour).padStart(2, '0')}:00`;
// An explanatory natural-light scenario, not an observed biological rate or a local sunrise forecast.
export const daylightAt = (hour: number) => hour < 6 || hour >= 18 ? 0 : Math.sin(((hour - 6 + 0.5) / 12) * Math.PI);
const hourNotes: [Localized, Localized][] = [
  [b('Midnight: stored energy', 'Tengah malam: energi tersimpan'), b('Without light, new photosynthesis is inactive. Stored sugars support ongoing respiration.', 'Tanpa cahaya, fotosintesis baru tidak aktif. Gula tersimpan mendukung respirasi yang terus berjalan.')],
  [b('Life continues in the dark', 'Kehidupan berlanjut dalam gelap'), b('Living cells keep using sugars and oxygen to release usable energy.', 'Sel hidup tetap menggunakan gula dan oksigen untuk melepaskan energi yang dapat digunakan.')],
  [b('Roots also respire', 'Akar juga berespirasi'), b('Oxygen is still needed below the surface, even without sunlight.', 'Oksigen tetap diperlukan di bawah permukaan, meskipun tanpa matahari.')],
  [b('No light-driven water splitting', 'Tidak ada pemecahan air oleh cahaya'), b('In this unlit scenario, light reactions are inactive; respiration continues.', 'Dalam contoh tanpa pencahayaan ini, reaksi terang tidak aktif; respirasi berlanjut.')],
  [b('A living plant, not a sleeping machine', 'Tanaman tetap hidup'), b('The night scene shows metabolism continuing, without new sugar production from light.', 'Adegan malam menunjukkan metabolisme berlanjut, tanpa pembentukan gula baru dari cahaya.')],
  [b('Before the example sunrise', 'Menjelang pagi pada contoh ini'), b('The plant is still in darkness. Actual sunrise depends on place and date.', 'Tanaman masih dalam gelap. Waktu matahari terbit sebenarnya bergantung pada tempat dan tanggal.')],
  [b('First light', 'Cahaya pertama'), b('The example daylight period begins. Leaves receive light while respiration continues.', 'Periode siang pada contoh dimulai. Daun menerima cahaya, sementara respirasi berlanjut.')],
  [b('Light reaches chlorophyll', 'Cahaya mencapai klorofil'), b('Light reactions supply ATP and NADPH for carbon assimilation.', 'Reaksi terang menyediakan ATP dan NADPH untuk pengolahan karbon.')],
  [b('Water connects roots and leaves', 'Air menghubungkan akar dan daun'), b('Water taken up by roots reaches the leaves through the xylem.', 'Air yang diserap akar mencapai daun melalui xilem.')],
  [b('Carbon dioxide enters', 'Karbon dioksida masuk'), b('Leaf pores allow gas exchange; available CO₂ supports sugar formation.', 'Pori daun memungkinkan pertukaran gas; CO₂ yang tersedia mendukung pembentukan gula.')],
  [b('Two linked reactions', 'Dua reaksi yang terhubung'), b('Light reactions and the Calvin cycle work together when conditions allow.', 'Reaksi terang dan siklus Calvin saling mendukung ketika kondisi memungkinkan.')],
  [b('Brighter is not always faster', 'Lebih terang belum tentu lebih cepat'), b('The sun illustration is brighter, but it does not measure photosynthesis rate.', 'Ilustrasi matahari lebih terang, tetapi tidak mengukur laju fotosintesis.')],
  [b('Midday conditions matter', 'Kondisi tengah hari penting'), b('Heat or water stress can limit gas exchange. More sunlight does not guarantee more sugar.', 'Panas atau kekurangan air dapat membatasi pertukaran gas. Lebih banyak cahaya tidak menjamin lebih banyak gula.')],
  [b('Keep the root environment healthy', 'Jaga lingkungan akar'), b('Suitable water and oxygen remain important in both growing methods.', 'Air dan oksigen yang sesuai tetap penting pada kedua metode tanam.')],
  [b('Water balance matters', 'Keseimbangan air penting'), b('Stomata regulate gas exchange and water loss; their response depends on conditions.', 'Stomata mengatur pertukaran gas dan kehilangan air; responsnya bergantung pada kondisi.')],
  [b('Sugars support the whole plant', 'Gula mendukung seluruh tanaman'), b('Products of photosynthesis can be transported and used beyond the leaves.', 'Hasil fotosintesis dapat diangkut dan digunakan di luar daun.')],
  [b('Afternoon light', 'Cahaya sore'), b('Photosynthesis can continue while suitable light and other resources are available.', 'Fotosintesis dapat berlanjut selama cahaya yang sesuai dan sumber daya lain tersedia.')],
  [b('Approaching the example sunset', 'Menjelang senja pada contoh'), b('The illustrated light fades. Respiration remains active as day turns to night.', 'Cahaya ilustrasi meredup. Respirasi tetap aktif saat siang beralih ke malam.')],
  [b('Darkness returns', 'Gelap kembali'), b('With no grow light in this example, light reactions stop. Respiration continues.', 'Tanpa lampu tanam pada contoh ini, reaksi terang berhenti. Respirasi berlanjut.')],
  [b('Using the day’s reserves', 'Memakai cadangan hari ini'), b('Sugars made earlier can supply energy for cellular work at night.', 'Gula yang terbentuk sebelumnya dapat menyediakan energi untuk kerja sel pada malam hari.')],
  [b('Oxygen is still needed', 'Oksigen tetap dibutuhkan'), b('Leaves, stems, and roots respire; darkness does not remove their oxygen needs.', 'Daun, batang, dan akar berespirasi; gelap tidak menghilangkan kebutuhan oksigennya.')],
  [b('The Calvin cycle is not a night shift', 'Siklus Calvin bukan giliran malam'), b('“Light-independent” does not mean a process that runs all night without light-reaction products.', '“Tidak bergantung langsung pada cahaya” bukan berarti proses berjalan sepanjang malam tanpa hasil reaksi terang.')],
  [b('Root care continues', 'Perawatan akar berlanjut'), b('Maintain the system’s root oxygen supply; do not switch aeration off just because it is dark.', 'Jaga pasokan oksigen akar sesuai sistem; jangan mematikan aerasi hanya karena hari gelap.')],
  [b('A full day, ready to repeat', 'Satu hari penuh, siap berulang'), b('Respiration continues into the next day. Photosynthesis returns when suitable light is available.', 'Respirasi berlanjut ke hari berikutnya. Fotosintesis kembali ketika cahaya yang sesuai tersedia.')],
];
export const dayHours = hourNotes.map(([title, detail], hour) => ({ hour, title, detail, daylight: daylightAt(hour) }));
export function rootNote(method: Method, hour: number, language: Language) {
  const day = daylightAt(hour) > 0;
  return (method === 'soil'
    ? day ? b('Soil: moist, well-drained soil supplies water while air spaces support root respiration.', 'Tanah: tanah lembap berdrainase baik menyediakan air, sementara ruang udara mendukung respirasi akar.') : b('Soil: roots still need oxygen. Avoid keeping soil waterlogged overnight.', 'Tanah: akar tetap membutuhkan oksigen. Hindari tanah tergenang sepanjang malam.')
    : day ? b('Hydroponics: nutrient solution supplies water and minerals; maintain oxygen according to the system.', 'Hidroponik: larutan nutrisi menyediakan air dan mineral; jaga oksigen sesuai sistemnya.') : b('Hydroponics: keep the required aeration or air-root zone available through the night.', 'Hidroponik: pertahankan aerasi atau zona akar udara yang diperlukan sepanjang malam.')
  )[language];
}
