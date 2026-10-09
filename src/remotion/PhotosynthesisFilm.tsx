import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { Language, Method } from '../data/garden';
export type FilmProps = { language: Language; method: Method };
export const filmTiming = { fps: 30, durationInFrames: 720, width: 1000, height: 760 };
export const chapters = [
  { en: 'Light reaches the leaves', id: 'Cahaya mencapai daun' },
  { en: 'Water travels from the roots', id: 'Air mengalir dari akar' },
  { en: 'Carbon dioxide enters the leaves', id: 'Karbon dioksida masuk ke daun' },
  { en: 'Sugar is made; oxygen is released', id: 'Gula terbentuk; oksigen dilepas' },
];
export function PhotosynthesisFilm({ language, method }: FilmProps) {
  const frame = useCurrentFrame();
  const chapter = Math.min(3, Math.floor(frame / 180));
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const reveal = (start: number) => interpolate(frame, [start, start + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const travel = (offset: number) => ((frame + offset) % 90) / 90;
  return <AbsoluteFill style={{ background: '#f1f0df', color: '#274c35', fontFamily: 'Arial, sans-serif' }}>
    <svg viewBox="0 0 1000 760" width="100%" height="100%" role="img" aria-label={chapters[chapter][language]}>
      <defs><marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#56794b" strokeWidth="1.5"/></marker></defs>
      <text x="50" y="52" fontSize="18" letterSpacing="3">{t('THE LEAF IS THE FOOD FACTORY', 'DAUN ADALAH TEMPAT MEMBUAT MAKANAN')}</text>
      <text x="50" y="99" fontFamily="Georgia, serif" fontSize="32">{chapters[chapter][language]}</text>
      <text x="950" y="52" textAnchor="end" fontSize="18">0{chapter + 1} / 04</text>
      <line x1="45" y1="125" x2="955" y2="125" stroke="#cbd1b9"/>
      <g opacity={reveal(0)}>
        <circle cx="150" cy="215" r="39" fill="#e5b65f"/>
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1="150" y1="162" x2="150" y2="150" stroke="#b78636" strokeWidth="3" transform={`rotate(${i * 45} 150 215)`}/>)}
        <text x="150" y="293" textAnchor="middle" fontSize="22">{t('Light energy', 'Energi cahaya')}</text>
        {[0, 30, 60].map(o => <circle key={o} cx={205 + travel(o) * 220} cy={215 + travel(o) * 110} r="6" fill="#c89436"/>)}
      </g>
      {method === 'soil' ? <g><path d="M310 510H690L655 663H345Z" fill="#ba7955"/><path d="M315 510H685V545H315Z" fill="#604c34"/>{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={345 + (i * 71 % 305)} cy={553 + (i * 31 % 83)} r="3" fill="#e7c997"/>)}</g> : <g><path d="M310 510H690V655Q690 670 675 670H325Q310 670 310 655Z" fill="#cfdfd4" stroke="#6c9284" strokeWidth="3"/><path d="M313 555H687V650Q687 665 670 665H330Q313 665 313 650Z" fill="#a5cbd0"/><path d="M310 510H690V534H310Z" fill="#567b62"/><path d="M465 510H535L523 554H477Z" fill="#756951"/>{[0,30,60].map(o => <circle key={o} cx={645 + Math.sin((frame + o)/20)*8} cy={650 - travel(o)*85} r="5" fill="none" stroke="#527d84" strokeWidth="2"/>)}</g>}
      <g fill="none" stroke="#977b4a" strokeWidth="4" strokeLinecap="round"><path d="M500 502V622M500 550Q450 560 425 610M500 572Q545 570 580 620M500 591L470 642M500 610L535 644"/></g>
      <path d="M500 520Q495 420 506 299" fill="none" stroke="#59783f" strokeWidth="12" strokeLinecap="round"/>
      <path d="M501 400Q365 414 351 316Q440 274 501 400" fill="#527746"/>
      <path d="M503 355Q607 376 639 273Q550 251 503 355" fill="#6b904f"/>
      <path d="M506 307Q443 250 493 201Q554 254 506 307" fill="#79974e"/>
      <g fill="none" stroke="#a4bd7d" strokeWidth="2"><path d="M496 397L372 328M506 353L617 288M507 299L494 226"/></g>
      <g opacity={reveal(180)}>
        <text x="50" y="492" fontSize="23" fill="#345f78">H₂O</text><text x="50" y="524" fontSize="19">{t('Water + minerals', 'Air + mineral')}</text>
        <path d="M215 530Q270 570 427 580" fill="none" stroke="#567f93" strokeWidth="2" strokeDasharray="6 6"/>
        {[0,30,60].map(o => <circle key={o} cx={500} cy={603 - travel(o)*242} r="5" fill="#3b7e9a"/>)}
      </g>
      <g opacity={reveal(360)}>
        <text x="735" y="242" fontSize="24">CO₂</text><text x="735" y="275" fontSize="19">{t('From the air', 'Dari udara')}</text>
        {[0,30,60].map(o => <circle key={o} cx={750 - travel(o)*140} cy={305} r="6" fill="#6c7d5b"/>)}
      </g>
      <g opacity={reveal(540)}>
        <circle cx="570" cy="318" r={18 + Math.sin(frame/15)*2} fill="#ebc976"/><text x="570" y="324" textAnchor="middle" fontSize="15" fill="#503d23">{t('sugar', 'gula')}</text>
        <text x="735" y="369" fontSize="24">O₂</text><text x="735" y="402" fontSize="19">{t('To the air', 'Ke udara')}</text>
        {[0,30,60].map(o => <circle key={o} cx={635 + travel(o)*100} cy={345} r="5" fill="#86a88c"/>)}
        <path d="M565 339Q570 450 521 478" fill="none" stroke="#b88e38" strokeWidth="3" markerEnd="url(#arrow-green)"/><text x="600" y="468" fontSize="18">{t('Sugar fuels growth', 'Gula mendukung pertumbuhan')}</text>
      </g>
      <text x="500" y="710" textAnchor="middle" fontSize="22">{method === 'soil' ? t('SOIL · Roots absorb water and dissolved minerals', 'TANAH · Akar menyerap air dan mineral terlarut') : t('HYDROPONICS · Roots absorb water and added minerals', 'HIDROPONIK · Akar menyerap air dan mineral tambahan')}</text>
      <text x="500" y="743" textAnchor="middle" fontSize="16" fill="#5e6e53">{t('Conceptual view · movements are simplified, not real-time rates', 'Ilustrasi konsep · gerakan disederhanakan, bukan laju sebenarnya')}</text>
    </svg>
  </AbsoluteFill>;
}
