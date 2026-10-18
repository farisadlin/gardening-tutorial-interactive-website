import { useEffect, useRef, useState } from 'react';
import '@hyperframes/player';
import type { HyperframesPlayer } from '@hyperframes/player';
import { dayHours, dayTiming, hourLabel, rootNote } from '../data/photosynthesisDay';
import AnimationFullscreen from './AnimationFullscreen';
import type { Language, Method } from '../data/garden';
export default function PhotosynthesisDay({ language, method, onMethodChange }: { language: Language; method: Method; onMethodChange: (method: Method) => void }) {
  const [frame, setFrame] = useState(6 * dayTiming.framesPerHour);
  const [playing, setPlaying] = useState(false);
  const player = useRef<HyperframesPlayer | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const currentFrame = useRef(frame);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const hour = Math.min(23, Math.floor(frame / dayTiming.framesPerHour));
  const item = dayHours[hour];
  const t = (en: string, id: string) => language === 'en' ? en : id;
  useEffect(() => {
    const current = document.createElement('hyperframes-player') as HyperframesPlayer;
    current.setAttribute('src', `/hyperframes/photosynthesis-day/variants/${method}-${language}/index.html`);
    current.setAttribute('width', String(dayTiming.width));
    current.setAttribute('height', String(dayTiming.height));
    current.setAttribute('disable-click-to-play', '');
    current.setAttribute('aria-hidden', 'true');
    current.style.cssText = 'display:block;width:100%;height:100%';
    setReady(false); setFailed(false); setPlaying(false);
    const onReady = () => { current.seek(currentFrame.current / dayTiming.fps); setReady(true); };
    const update = (event: Event) => {
      const seconds = (event as CustomEvent<{ currentTime: number }>).detail.currentTime;
      const next = Math.min(dayTiming.durationInFrames - 1, Math.max(0, Math.floor(seconds * dayTiming.fps + 0.000001)));
      currentFrame.current = next; setFrame(next);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => { current.pause(); setReady(false); setFailed(true); setPlaying(false); };
    const visibility = () => { if (document.hidden) current.pause(); };
    current.addEventListener('ready', onReady);
    current.addEventListener('timeupdate', update);
    current.addEventListener('play', onPlay);
    current.addEventListener('pause', onPause);
    current.addEventListener('ended', onPause);
    current.addEventListener('error', onError);
    document.addEventListener('visibilitychange', visibility);
    player.current = current;
    host.current?.appendChild(current);
    return () => {
      current.removeEventListener('ready', onReady);
      current.removeEventListener('timeupdate', update);
      current.removeEventListener('play', onPlay);
      current.removeEventListener('pause', onPause);
      current.removeEventListener('ended', onPause);
      current.removeEventListener('error', onError);
      document.removeEventListener('visibilitychange', visibility);
      current.pause(); current.remove(); player.current = null;
    };
  }, [language, method]);
  const selectHour = (value: number) => {
    const current = player.current;
    current?.pause();
    if (current) { current.rangeStart = null; current.rangeEnd = null; }
    const next = value * dayTiming.framesPerHour;
    currentFrame.current = next; setFrame(next); current?.seek(next / dayTiming.fps);
  };
  const animateHour = () => {
    const current = player.current;
    if (!current?.ready) return;
    current.pause(); current.rangeStart = hour * 4; current.rangeEnd = (hour + 1) * 4;
    current.seek(hour * 4); current.play();
  };
  return <section id="day-cycle" className="photo-day" aria-labelledby="photo-day-title">
    <div className="eyebrow">{t('FROM MIDNIGHT TO MIDNIGHT', 'DARI TENGAH MALAM KE TENGAH MALAM')}</div><h2 id="photo-day-title">{t('A plant’s life over 24 hours.', 'Kehidupan tanaman selama 24 jam.')}</h2>
    <p className="photo-day-intro">{t('Choose any hour to see its scene, then animate that hour or play the entire day. The method selected above also applies here.', 'Pilih jam untuk melihat adegannya, lalu putar animasi jam tersebut atau seluruh hari. Metode tanam yang dipilih di atas juga berlaku di sini.')}</p>
    <p className="photo-day-assumption">{t('Learning scenario: natural light from 06:00 to 18:00, no grow lights, and a typical non-CAM garden plant. These times and hourly notes illustrate a sequence, not a fixed biological schedule. Each note highlights a process, not an event exclusive to that hour. Clouds, shade, species, water, and temperature change the real response. CAM plants have a different gas-exchange rhythm; grow lights change the light period.', 'Contoh belajar: cahaya alami pukul 06.00–18.00, tanpa lampu tanam, pada tanaman kebun non-CAM. Jam dan catatan per jam mengilustrasikan urutan, bukan jadwal biologis pasti. Tiap catatan menyoroti proses, bukan kejadian yang hanya berlangsung pada jam itu. Awan, naungan, jenis tanaman, air, dan suhu mengubah respons nyata. Tanaman CAM memiliki ritme pertukaran gas berbeda; lampu tanam mengubah periode cahaya.')}</p>
    <div className="photo-day-layout"><div className="photo-day-view"><AnimationFullscreen aspectRatio={dayTiming.width / dayTiming.height} language={language} label={t('24-hour animation', 'Animasi 24 jam')}><div className="photo-methods fullscreen-methods" role="group" aria-label={t('Compare growing methods', 'Bandingkan metode tanam')}>{(['soil', 'hydro'] as const).map(value => <button key={value} aria-pressed={method === value} onClick={() => { player.current?.pause(); onMethodChange(value); }}>{value === 'soil' ? t('In soil', 'Di tanah') : t('In hydroponics', 'Di hidroponik')}</button>)}</div><div className="animation-focus-stage hyperframes-day-stage" role="img" aria-label={`${hourLabel(hour)} · ${item.title[language]}`} data-renderer="hyperframes" data-ready={ready}>
        <div ref={host} className="hyperframes-day-host"/>
        {failed && <p className="hyperframes-day-error" role="status">{t('The animation is unavailable. Use the hourly explanation beside it.', 'Animasi tidak tersedia. Gunakan penjelasan per jam di sampingnya.')}</p>}
      </div><div className="photo-day-controls"><button disabled={!ready} onClick={() => {
        const current = player.current;
        if (!current) return;
        if (!current.paused) current.pause();
        else { current.rangeStart = null; current.rangeEnd = null; current.seek(0); current.play(); }
      }}>{playing ? t('Pause day animation', 'Jeda animasi harian') : t('Play full day', 'Putar seluruh hari')}</button><button disabled={!ready} onClick={animateHour}>{t('Animate this hour', 'Putar jam ini')}</button></div>
      <label className="animation-hour-control">{t('Explore hour', 'Jelajahi jam')} <strong>{hourLabel(hour)}</strong><input type="range" min="0" max="23" value={hour} aria-label={t('Fullscreen hour timeline', 'Linimasa jam layar penuh')} aria-valuetext={hourLabel(hour)} onChange={event => selectHour(Number(event.target.value))}/></label>
      <p className="photo-film-note">{t('4 seconds per hour · 96 seconds for the full day · starts paused, with no audio. Moving particles show processes, not measured rates.', '4 detik per jam · 96 detik untuk seluruh hari · dimulai dalam keadaan jeda, tanpa audio. Partikel bergerak menunjukkan proses, bukan laju terukur.')}</p></AnimationFullscreen></div>
      <div className="photo-day-detail"><div role="status"><span className="photo-day-clock">{hourLabel(hour)}</span><h3>{item.title[language]}</h3></div><p>{item.detail[language]}</p><dl><div><dt>{t('Photosynthesis', 'Fotosintesis')}</dt><dd>{item.daylight > 0 ? t('Light available; actual activity depends on conditions.', 'Cahaya tersedia; aktivitas nyata bergantung pada kondisi.') : t('Inactive in this unlit scenario.', 'Tidak aktif dalam contoh tanpa cahaya ini.')}</dd></div><div><dt>{t('Respiration', 'Respirasi')}</dt><dd>{t('Continues: sugars and oxygen supply energy for living cells.', 'Berlanjut: gula dan oksigen menyediakan energi bagi sel hidup.')}</dd></div></dl><p className="photo-day-root">{rootNote(method, hour, language)}</p></div></div>
    <div className="photo-hour-selector"><label htmlFor="photo-hour-range">{t('Explore hour', 'Jelajahi jam')} <strong>{hourLabel(hour)}</strong></label><input id="photo-hour-range" type="range" min="0" max="23" step="1" value={hour} aria-valuetext={hourLabel(hour)} onChange={event => selectHour(Number(event.target.value))}/><div className="photo-hour-grid" role="group" aria-label={t('Choose an hour of the day', 'Pilih jam dalam sehari')}>{dayHours.map(entry => <button key={entry.hour} aria-pressed={hour === entry.hour} onClick={() => selectHour(entry.hour)} title={entry.title[language]}><span>{hourLabel(entry.hour)}</span><span className={`photo-hour-mark ${entry.daylight > 0 ? 'daylight' : ''}`} aria-hidden="true"/></button>)}</div></div>
    <p className="photo-day-source">{t('Hourly scenes are an educational model. References for the underlying processes:', 'Adegan per jam adalah model pembelajaran. Rujukan untuk proses dasarnya:')} <a href="https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis" target="_blank" rel="noreferrer">OpenStax · {t('Photosynthesis and water stress', 'Fotosintesis dan kekurangan air')}</a>; <a href="https://pesticidecert.cfans.umn.edu/sites/pesticidecert.cfans.umn.edu/files/files/media/e3_plant_biology_basics_mar24final.pdf" target="_blank" rel="noreferrer">UMN · {t('Day and night respiration', 'Respirasi siang dan malam')}</a>; <a href="https://openstax.org/books/biology-2e/pages/8-3-using-light-energy-to-make-organic-molecules" target="_blank" rel="noreferrer">OpenStax · {t('Calvin cycle and CAM', 'Siklus Calvin dan CAM')}</a>.</p>
  </section>;
}
