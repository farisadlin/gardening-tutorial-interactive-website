import { renderToStaticMarkup } from 'react-dom/server';
import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import { PhotosynthesisDayArtwork } from '../src/hyperframes/PhotosynthesisDayArtwork';
import { build } from 'esbuild';
import { dayHours, dayTiming } from '../src/data/photosynthesisDay';

const sceneBundle = await build({ entryPoints: ['src/hyperframes/day-scene.ts'], bundle: true, format: 'iife', platform: 'browser', minify: true, write: false, target: 'es2022' });
const timelineSource = await readFile('src/hyperframes/day-timeline.js', 'utf8');
for (const output of ['motion/photosynthesis-day', 'public/hyperframes/photosynthesis-day']) {
await mkdir(`${output}/assets`, { recursive: true });
await copyFile('node_modules/gsap/dist/gsap.min.js', `${output}/assets/gsap.min.js`);
await writeFile(`${output}/assets/day-scene.js`, sceneBundle.outputFiles[0].text);
for (const language of ['en', 'id'] as const) for (const method of ['soil', 'hydro'] as const) {
  const scenes = Array.from({ length: 24 }, (_, hour) => renderToStaticMarkup(<PhotosynthesisDayArtwork language={language} method={method} frame={hour * dayTiming.framesPerHour}/>));
  const name = `${method}-${language}`;
  await writeFile(`${output}/assets/${name}.js`, `window.dayScenes=${JSON.stringify(scenes).replaceAll('<', '\\u003c')};window.dayData=${JSON.stringify(dayHours).replaceAll('<', '\\u003c')};\n`);
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const overlay = `<canvas id="day3d-canvas" aria-hidden="true" hidden></canvas><div id="day3d-overlay" hidden><header class="day3d-heading"><div><span>${t('ONE PLANT · ONE DAY', 'SATU TANAMAN · SATU HARI')}</span><h1 id="day3d-title"></h1></div><strong id="day3d-clock"></strong></header><div class="day3d-processes"><div><span class="day3d-dot photo-dot"></span><strong>${t('Photosynthesis', 'Fotosintesis')}</strong><p id="day3d-photo-status"></p></div><div><span class="day3d-dot resp-dot"></span><strong>${t('Respiration', 'Respirasi')}</strong><p>${t('Active day + night', 'Aktif siang + malam')}</p></div></div><footer class="day3d-caption"><strong>${method === 'soil' ? t('SOIL · ROOT CUTAWAY', 'TANAH · PENAMPANG AKAR') : t('HYDROPONICS · ROOT CUTAWAY', 'HIDROPONIK · PENAMPANG AKAR')}</strong><span><i class="water-key"></i>${t('Water', 'Air')}<i class="oxygen-key"></i>${t('Root oxygen', 'Oksigen akar')}</span><p>${t('Illustrative movement · not a measured rate', 'Gerakan ilustratif · bukan laju terukur')}</p></footer></div>`;
  const makeHtml = (assets: string) => `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=1000, height=660"><title>Photosynthesis · ${method} · ${language}</title>
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden}#stage{position:relative;width:100%;height:100%;overflow:hidden}#day-artwork{position:absolute;inset:0}#day3d-canvas{position:absolute;inset:0;width:100%;height:100%}#stage[data-dimension="3"] #day-artwork{opacity:0;pointer-events:none}#day3d-overlay{position:absolute;inset:0;font-family:Arial,sans-serif;color:#243c31;pointer-events:none}#day3d-overlay[hidden],#day3d-canvas[hidden]{display:none}.day3d-heading{position:absolute;inset:28px 34px auto;display:flex;justify-content:space-between;gap:25px}.day3d-heading span{font-size:15px;letter-spacing:2px}.day3d-heading h1{font-family:Georgia,serif;font-size:25px;line-height:1.2;font-weight:400;margin:9px 0 0;max-width:740px}.day3d-heading>strong{font-size:37px;font-weight:500;letter-spacing:-1px}.day3d-processes{position:absolute;left:34px;top:235px;width:210px;display:grid;gap:18px}.day3d-processes>div{border-top:1px solid #667c6d80;padding-top:14px}.day3d-processes strong{font-size:17px}.day3d-processes p{font-size:16px;line-height:1.45;margin:8px 0 0}.day3d-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:9px;background:#689356}.resp-dot{background:#a86d43}.day3d-caption{position:absolute;left:34px;right:34px;bottom:24px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px}.day3d-caption>strong{font-size:16px;letter-spacing:.7px}.day3d-caption>span{display:flex;align-items:center;gap:8px;font-size:16px}.day3d-caption i{width:8px;height:8px;border-radius:50%;display:inline-block;background:#3b88ad}.day3d-caption .oxygen-key{background:#679780;margin-left:16px}.day3d-caption p{flex-basis:100%;font-size:13px;margin:0}</style>
<script src="${assets}/gsap.min.js"></script></head><body>
<div id="stage" data-composition-id="photosynthesis-day" data-start="0" data-duration="96" data-fps="30" data-width="1000" data-height="660" data-language="${language}" data-method="${method}"><section id="day-artwork">${scenes[0]}</section>${overlay}</div>
<script src="${assets}/${name}.js"></script><script>${timelineSource}</script><script src="${assets}/day-scene.js"></script>
</body></html>`;
  await mkdir(`${output}/variants/${name}`, { recursive: true });
  await writeFile(`${output}/variants/${name}/index.html`, makeHtml('../../assets'));
  if (name === 'soil-en') await writeFile(`${output}/index.html`, makeHtml('assets'));
}
}
console.log('Built 4 native 3D HyperFrames day-cycle compositions (24 hours, 96 seconds each).');
