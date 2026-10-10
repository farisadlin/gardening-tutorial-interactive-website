import { useId } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { Crop, Language, Method } from '../data/garden';
import { growthChapter, growthChapters } from '../data/growthSimulation';
import { defaultSystem, hydroSystems, type HydroSystemId } from '../data/hydroSystems';
import HydroDiagram from '../components/HydroDiagram';

export type GrowthFilmProps = { crop: Crop; language: Language; method: Method; systemId?: HydroSystemId; reducedMotion?: boolean };
export function GrowthFilm({ crop, language, method, systemId, reducedMotion = false }: GrowthFilmProps) {
  const frame = useCurrentFrame();
  const cutId = useId().replaceAll(':', '');
  const chapter = growthChapter(frame);
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const ramp = (start: number, end: number) => interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const germination = ramp(215, 340);
  const transfer = ramp(380, 475);
  const mature = ramp(540, 715);
  const harvest = ramp(790, 875);
  const growth = .17 * germination + .17 * transfer + .66 * mature;
  const plantX = 230 + 240 * transfer;
  const plantY = 405 - Math.sin(transfer * Math.PI) * 90;
  const chives = crop.id === 'chives';
  const chilli = crop.id === 'chilli';
  const shootHarvest = ['water-spinach', 'amaranth'].includes(crop.id);
  const tall = ['water-spinach', 'amaranth', 'chilli'].includes(crop.id);
  const selectedSystem = systemId || defaultSystem(crop);
  const system = hydroSystems.find(item => item.id === selectedSystem)!;
  const medium = method === 'soil' || ['wick', 'drip', 'dutch-bucket'].includes(selectedSystem);
  const leafPath = crop.id === 'lettuce'
    ? 'M0 0C-25 0-43-17-31-32C-51-42-28-64-20-60C-21-79 0-81 5-68C30-82 42-58 32-47C52-33 25-6 0 0Z'
    : crop.id === 'water-spinach'
      ? 'M0 0Q-28-24-7-73Q28-35 0 0Z'
      : 'M0 0C-36-5-39-47-13-65C10-78 43-50 30-27Q20-9 0 0Z';
  const sway = reducedMotion ? 0 : Math.sin(frame / 28) * mature * .8;
  const leafCount = crop.id === 'lettuce' ? 12 : crop.id === 'pak-choi' ? 8 : 10;
  const plant = (picked = false) => <g transform={`rotate(${picked ? -20 : sway})`}>
    {chives ? Array.from({ length: 19 }, (_, i) => <path key={i} d={`M${i % 5 * 3 - 6} 0Q${i * 6 - 54} -85 ${i * 7 - 64} ${-170 - i % 4 * 17}`} fill="none" stroke={i % 2 ? '#416d38' : '#79994d'} strokeWidth="5" strokeLinecap="round"/>) : <>
      {tall && <path d={`M0 0Q-7-95 0 ${-220 + (shootHarvest && !picked ? harvest * 90 : 0)}`} fill="none" stroke="#6d8641" strokeWidth="6"/>}
      {Array.from({ length: leafCount }, (_, i) => {
        const leafGrowth = .25 + .75 * ramp(550 + i * 9, 610 + i * 9);
        const y = tall ? -20 - i * 19 : -8;
        const angle = tall ? (i % 2 ? 1 : -1) * (45 + i % 3 * 12) : -80 + i * 160 / (leafCount - 1);
        const outerPicked = !picked && !chilli && (shootHarvest ? i >= 6 : i < 2);
        const emerged = i < 2 ? 1 : i < 4 ? transfer : ramp(550 + i * 9, 595 + i * 9);
        return <g key={i} opacity={emerged * (outerPicked ? 1 - harvest : 1)} transform={`translate(0 ${y}) rotate(${angle}) scale(${leafGrowth})`}>
          <path d="M0 0V-35" fill="none" stroke={crop.id === 'pak-choi' ? '#d5dfb5' : '#799754'} strokeWidth={crop.id === 'pak-choi' ? 12 : 4}/>
          <g transform="translate(0 -32)"><path d={leafPath} fill={i % 3 ? '#578044' : '#7f9e54'}/><path d="M0-4Q-5-28-7-60" fill="none" stroke="#c0d293" strokeWidth="1.5"/></g>
        </g>;
      })}
      {chilli && [0, 1, 2, 3].map(i => {
        const fruit = ramp(655 + i * 12, 720 + i * 10);
        const flower = ramp(585 + i * 10, 615 + i * 10) * (1 - fruit);
        return <g key={i} transform={`translate(${i % 2 ? 40 : -42} ${-145 + i * 24})`}>
          <g opacity={flower}>{[0, 1, 2, 3, 4].map(p => <ellipse key={p} cx="0" cy="-7" rx="4" ry="8" fill="#fff4d9" transform={`rotate(${p * 72})`}/>)}<circle r="3" fill="#dab15a"/></g>
          <g opacity={fruit * (i === 0 && !picked ? 1 - harvest : 1)} transform={`scale(${fruit})`}><path d="M0 0Q-13 4-10 24Q-7 47 2 54Q11 34 10 16Q9 2 0 0Z" fill={frame < 710 + i * 15 ? '#6d8d42' : '#ba4d35'}/><path d="M0 0Q2-10 8-12" stroke="#416d38" strokeWidth="4" fill="none"/></g>
        </g>;
      })}
    </>}
  </g>;
  return <AbsoluteFill style={{ background: crop.color, color: '#274c35', fontFamily: 'Arial, sans-serif' }}>
    <svg viewBox="0 0 900 620" width="100%" height="100%" role="img" aria-label={`${crop.name[language]} · ${growthChapters[chapter].title[language]}`}>
      <defs><clipPath id={cutId}><rect x="-120" y={-240 + harvest * 190} width="240" height="250"/></clipPath></defs>
      <text x="40" y="43" fontSize="16" letterSpacing="2">{crop.name[language].toUpperCase()}</text>
      <text x="40" y="85" fontFamily="Georgia, serif" fontSize="32">{growthChapters[chapter].title[language]}</text>
      <text x="855" y="43" textAnchor="end" fontSize="17">0{chapter + 1} / 05</text>
      <line x1="40" y1="108" x2="860" y2="108" stroke="#bfc9ad"/>
      <ellipse cx="475" cy="552" rx="175" ry="10" fill="#47603b" opacity=".1"/>
      <g opacity={ramp(0, 55)}>
        <path d="M160 405H300L288 467H172Z" fill="#a28b65"/><path d="M170 411H290V447H170Z" fill="#786343"/>
        {[195, 230, 265].map(x => <ellipse key={x} cx={x} cy="405" rx="13" ry="5" fill="#51462f"/>)}
        <text x="230" y="500" textAnchor="middle" fontSize="17">{t('Seed tray', 'Wadah semai')}</text>
      </g>
      <g opacity={ramp(55, 130)}>
        <path d="M365 405H575L554 535H386Z" fill={method === 'soil' ? '#c38b67' : '#6b8875'}/>
        <path d="M380 415H560L542 523H398Z" fill={medium ? '#776348' : '#b2d4c6'}/>
        {method === 'soil' && [412, 470, 529].map(x => <circle key={x} cx={x} cy="531" r="4" fill="#51462f"/>)}
        {method === 'hydro' && <>
          {selectedSystem === 'wick' && <><path d="M398 485H542V523H398Z" fill="#b2d4c6"/><path d="M451 442V510M489 442V510" fill="none" stroke="#e9d8a2" strokeWidth="6"/></>}
          {selectedSystem === 'kratky' && <path d="M380 415H560V452H380Z" fill="#e9eddf"/>}
          {['nft', 'dft'].includes(selectedSystem) && <path d={`M380 415H560V${selectedSystem === 'nft' ? 509 : 458}H380Z`} fill="#edf0e4"/>}
          {['dwc', 'dft'].includes(selectedSystem) && [0, 1, 2, 3].map(i => <circle key={i} cx={518 + i % 2 * 7} cy={515 - ((frame / 3 + i * 19) % 65)} r="3" fill="#f4f8ed"/>)}
          {['drip', 'dutch-bucket'].includes(selectedSystem) && <><path d="M584 490V388H507V419" fill="none" stroke="#486f57" strokeWidth="5"/><circle cx="507" cy={425 + frame % 30} r="3" fill="#80b7a2"/></>}
        </>}
        <text x="470" y="580" textAnchor="middle" fontSize="17">{method === 'soil' ? t('Final pot · drainage', 'Pot akhir · drainase') : system.name[language]}</text>
      </g>
      <g opacity={ramp(180, 205) * (1 - germination)} transform={`translate(230 ${350 + 58 * ramp(180, 220)})`}>{Array.from({ length: chives || crop.id === 'amaranth' ? 5 : 1 }, (_, i) => <ellipse key={i} cx={(i - (chives || crop.id === 'amaranth' ? 2 : 0)) * 9} rx={crop.id === 'amaranth' ? 2 : 5} ry="3" fill="#d3af65"/>)}</g>
      <g opacity={germination} transform={`translate(${plantX} ${plantY})`}>
        <g opacity={transfer < 1 ? 1 : 0}><path d="M-15 0H15L11 32H-11Z" fill="#8e7956"/></g>
        <g opacity={germination} transform={`scale(${.15 + growth * .85})`}>{[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`M${i * 4 - 12} 6Q${i * 12 - 36} 50 ${i * 14 - 42} ${75 + i % 3 * 12}`} fill="none" stroke="#eadab7" strokeWidth="2.5"/>)}</g>
        <g transform={`scale(${growth})`}>
          {chives ? <g clipPath={`url(#${cutId})`}>{plant()}</g> : plant()}
        </g>
        {chives && harvest > 0 && <g transform={`scale(${growth})`}><path d="M-45 0L-40-42M-22 0L-22-47M0 0V-45M23 0L26-42M43 0L48-38" stroke="#527c40" strokeWidth="5"/></g>}
      </g>
      {harvest > 0 && <g opacity={harvest} transform={`translate(${630 + harvest * 55} ${390 - harvest * 55}) scale(.65)`}>
        {chilli ? <path d="M0 0Q-15 8-10 30Q-5 53 5 60Q17 30 12 10Q8-2 0 0Z" fill="#ba4d35"/> : chives ? <path d="M-15 15L-35-100M0 15L0-115M15 15L40-95" stroke="#5c8443" strokeWidth="6"/> : <g transform="rotate(35)">{shootHarvest && <><path d="M0 25V-55" stroke="#6d8641" strokeWidth="5"/><path d={leafPath} fill="#678d47" transform="translate(0 -25) rotate(-45) scale(.6)"/></>}<path d={leafPath} fill="#678d47"/><path d="M0 0V25" stroke="#799754" strokeWidth="6"/></g>}
      </g>}
      <g transform="translate(657 147)">
        {method === 'hydro' && <foreignObject width="210" height="165"><HydroDiagram crop={crop} systemId={selectedSystem} stage="prepare" language={language} thumbnail/></foreignObject>}
        <text x="100" y={method === 'hydro' ? 177 : 35} textAnchor="middle" fontSize="15">{method === 'hydro' ? t('Selected system', 'Sistem pilihan') : t('Growing in soil', 'Menanam di tanah')}</text>
      </g>
      {chapter === 4 && <text x="755" y="455" textAnchor="middle" fontSize="17">{t('First harvest', 'Panen pertama')}</text>}
      <text x="40" y="610" fontSize="13">{t('Root zone schematic · stages are compressed, not a daily growth forecast.', 'Skema zona akar · fase dipersingkat, bukan prediksi pertumbuhan harian.')}</text>
    </svg>
  </AbsoluteFill>;
}
