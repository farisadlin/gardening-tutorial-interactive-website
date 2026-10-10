import { useEffect, useRef, useState } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { Pause, Play, RotateCcw } from 'lucide-react';
import type { Crop, Language, Method, Stage } from '../data/garden';
import type { HydroSystemId } from '../data/hydroSystems';
import { growthChapter, growthChapters, growthFrameForStage, growthNote, growthTiming } from '../data/growthSimulation';
import { GrowthFilm } from '../remotion/GrowthFilm';
import AnimationFullscreen from './AnimationFullscreen';

export default function GrowthSimulation({ crop, language, method, systemId, stage }: {
  crop: Crop; language: Language; method: Method; systemId?: HydroSystemId; stage?: Stage;
}) {
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const initialFrame = growthFrameForStage(stage) + 150;
  const [frame, setFrame] = useState(initialFrame);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const player = useRef<PlayerRef>(null);
  const section = useRef<HTMLElement>(null);
  const chapter = growthChapter(frame);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(media.matches); if (media.matches) player.current?.pause(); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const current = player.current;
    const update = ({ detail }: { detail: { frame: number } }) => setFrame(detail.frame);
    const play = () => setPlaying(true);
    const pause = () => setPlaying(false);
    current?.addEventListener('frameupdate', update);
    current?.addEventListener('play', play);
    current?.addEventListener('pause', pause);
    current?.addEventListener('ended', pause);
    const visibility = () => { if (document.hidden) current?.pause(); };
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting && !document.fullscreenElement && !section.current?.querySelector('.is-fullscreen')) current?.pause(); });
    if (section.current) observer.observe(section.current);
    return () => {
      current?.removeEventListener('frameupdate', update);
      current?.removeEventListener('play', play);
      current?.removeEventListener('pause', pause);
      current?.removeEventListener('ended', pause);
      document.removeEventListener('visibilitychange', visibility);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    player.current?.pause();
    player.current?.seekTo(initialFrame);
    setFrame(initialFrame);
  }, [initialFrame, crop.id, method, systemId]);
  const seek = (next: number) => { player.current?.pause(); player.current?.seekTo(next); setFrame(next); };
  return <section ref={section} className={`growth-simulation${stage ? ' compact-growth' : ''}`} aria-label={t('Seed to harvest simulation', 'Simulasi benih hingga panen')}>
    <div className="growth-heading"><div className="eyebrow">{t('WATCH YOUR PLANT’S JOURNEY', 'IKUTI PERJALANAN TANAMAN')}</div><h2>{t('From a seed to your first harvest.', 'Dari benih hingga panen pertama.')}</h2><p>{t(`Explore ${crop.name.en.toLowerCase()} at every stage. First-harvest estimate: ${crop.days} DAS.`, `Lihat setiap fase ${crop.name.id.toLowerCase()}. Perkiraan panen pertama: ${crop.days} HSS.`)}</p></div>
    <AnimationFullscreen language={language} label={t(`${crop.name.en} growth simulation`, `Simulasi pertumbuhan ${crop.name.id}`)} aspectRatio={growthTiming.width / growthTiming.height}>
      <div className="animation-focus-stage"><Player ref={player} component={GrowthFilm} inputProps={{ crop, language, method, systemId, reducedMotion }} durationInFrames={growthTiming.durationInFrames} fps={growthTiming.fps} compositionWidth={growthTiming.width} compositionHeight={growthTiming.height} initialFrame={initialFrame} style={{ width: '100%' }} controls={false} clickToPlay={false} autoPlay={false} loop={false} moveToBeginningWhenEnded={false} aria-label={t('Plant growth animation', 'Animasi pertumbuhan tanaman')} errorFallback={() => <p>{t('Follow the stage buttons and instructions below to explore this plant’s growth.', 'Gunakan tombol fase dan petunjuk di bawah untuk mempelajari pertumbuhan tanaman ini.')}</p>}/></div>
      <div className="growth-playback"><button type="button" disabled={reducedMotion} onClick={() => {
        if (playing) player.current?.pause();
        else { if (frame >= 899) player.current?.seekTo(0); player.current?.play(); }
      }}>{playing ? <Pause size={16} aria-hidden="true"/> : <Play size={16} aria-hidden="true"/>} {playing ? t('Pause simulation', 'Jeda simulasi') : t('Play simulation', 'Putar simulasi')}</button><button type="button" onClick={() => seek(0)} aria-label={t('Reset simulation', 'Ulangi simulasi')}><RotateCcw size={16} aria-hidden="true"/></button><input type="range" min="0" max="899" value={frame} aria-label={t('Growth timeline', 'Linimasa pertumbuhan')} aria-valuetext={growthChapters[chapter].title[language]} onChange={event => seek(Number(event.target.value))}/><span>{Math.floor(frame / 30)} / 30 {t('s', 'dtk')}</span></div>
      <div className="growth-stages" role="group" aria-label={t('Growth stages', 'Fase pertumbuhan')}>{growthChapters.map((item, index) => <button type="button" key={item.stage} aria-pressed={chapter === index} onClick={() => seek(index * 180 + 160)}><span>0{index + 1}</span>{item.title[language]}</button>)}</div>
      <div className="growth-note"><strong>{growthChapters[chapter].title[language]}</strong><p>{growthNote(crop, chapter)[language]}</p></div>
      <p className="growth-disclaimer">{reducedMotion ? t('Reduced motion is on. Select a stage or move the timeline to explore still illustrations.', 'Gerakan dikurangi sesuai pengaturan perangkat. Pilih fase atau geser linimasa untuk melihat ilustrasi diam.') : t('30-second illustration · no audio · playback starts only when you press play.', 'Ilustrasi 30 detik · tanpa audio · animasi mulai saat Anda menekan putar.')} {t('Timing and scale are illustrative. Follow plant readiness and the seed packet; varieties, climate and divided chive clumps vary.', 'Waktu dan ukuran bersifat ilustratif. Ikuti kesiapan tanaman dan kemasan benih; varietas, iklim dan pecahan rumpun kucai dapat berbeda.')}</p>
    </AnimationFullscreen>
  </section>;
}
