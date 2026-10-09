import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { FilmProps } from './PhotosynthesisFilm';
import { dayHours, dayTiming, hourLabel } from '../data/photosynthesisDay';
export function PhotosynthesisDayFilm({ language, method }: FilmProps) {
  const frame = useCurrentFrame();
  const hour = Math.min(23, Math.floor(frame / dayTiming.framesPerHour));
  const light = dayHours[hour].daylight;
  const day = light > 0;
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const sky = day ? '#f0edce' : '#e1e6ef';
  const particle = (offset: number) => ((frame + offset) % 90) / 90;
  const sway = Math.sin(frame / 20) * 1.5;
  const sunX = interpolate(hour, [6, 17], [170, 810], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: sky, fontFamily: 'Arial, sans-serif', color: '#294634' }}>
    <svg viewBox="0 0 1000 660" width="100%" height="100%" role="img" aria-label={`${hourLabel(hour)} · ${dayHours[hour].title[language]}`}>
      <text x="42" y="48" fontSize="19" letterSpacing="2">{t('ONE PLANT · ONE DAY', 'SATU TANAMAN · SATU HARI')}</text><text x="952" y="50" textAnchor="end" fontSize="32" fontWeight="bold">{hourLabel(hour)}</text>
      <text x="42" y="86" fontSize="26" fontFamily="Georgia, serif">{dayHours[hour].title[language]}</text>
      {day ? <g><path d="M150 230Q500 40 850 230" fill="none" stroke="#9b916a" strokeDasharray="4 8"/><circle cx={sunX} cy={210 - light * 75} r={26 + light * 7} fill="#d9ae50"/>{[0,30,60].map(o => <circle key={o} cx={sunX + (510 - sunX) * particle(o)} cy={210 - light * 75 + (295 - (210 - light * 75)) * particle(o)} r="4" fill="#a47b28"/>)}</g> : <g><circle cx="780" cy="155" r="31" fill="#8b9bb6"/><circle cx="793" cy="145" r="28" fill={sky}/>{[180,270,380,630,870].map((x,i) => <circle key={x} cx={x} cy={145 + i % 2 * 40} r={2 + Math.sin(frame/20+i)*0.5} fill="#728099"/>)}</g>}
      <path d="M320 424H640L610 562H350Z" fill={method === 'soil' ? '#b87554' : '#c1d4cf'} stroke={method === 'soil' ? '#926247' : '#608e86'} strokeWidth="3"/>
      <path d="M327 435H633L610 550H350Z" fill={method === 'soil' ? '#735b3e' : '#9ec5cc'}/><path d="M320 424H640V441H320Z" fill={method === 'soil' ? '#735b3e' : '#4c765b'}/>
      {method === 'soil' ? Array.from({length:24},(_,i) => <circle key={i} cx={355+i*53%245} cy={452+i*31%90} r="2" fill="#ddbf8c"/>) : [0,30,60].map(o => <circle key={o} cx="593" cy={545-particle(o)*90} r="4" stroke="#4c7785" fill="none" strokeWidth="2"/>)}
      <g fill="none" stroke={method === 'soil' ? '#e3c69d' : '#84683c'} strokeWidth="3" strokeLinecap="round"><path d="M480 429V528M480 460Q440 465 415 510M480 480Q520 470 556 519M480 503L454 541M480 515L507 545"/></g>
      <g transform={`rotate(${sway} 480 424)`}><path d="M480 430V258" stroke="#517944" strokeWidth="10"/><path d="M480 350Q352 354 356 276Q434 247 480 350" fill="#527745"/><path d="M480 303Q580 324 599 248Q521 229 480 303" fill="#6d8b4b"/><path d="M480 271Q423 218 477 189Q524 226 480 271" fill="#79954c"/><path d="M475 347L371 289M483 302L578 263" stroke="#abc289" strokeWidth="2" fill="none"/></g>
      {[0,30,60].map(o => <circle key={o} cx="480" cy={525-particle(o)*(day?204:90)} r="4" fill="#326f98"/>)}
      <text x="675" y="302" fontSize="20">{t('Water to the plant', 'Air ke tanaman')}</text><text x="675" y="337" fontSize="20">{t('Root oxygen: needed', 'Oksigen akar: perlu')}</text>
      <text x="480" y="591" textAnchor="middle" fontSize="20">{method === 'soil' ? t('SOIL · air spaces + dissolved minerals', 'TANAH · ruang udara + mineral terlarut') : t('HYDROPONICS · nutrient solution + root oxygen', 'HIDROPONIK · larutan nutrisi + oksigen akar')}</text>
      <text x="42" y="626" fontSize="17">{t('Example daylight 06:00–18:00 · animation is conceptual, not a measured rate', 'Contoh siang 06:00–18:00 · animasi konsep, bukan laju terukur')}</text>
    </svg>
    <div style={{ position:'absolute', left:35, top:338, width:285, fontSize:18, lineHeight:1.5 }}>
      <div style={{ padding:12, border:'1px solid #9ba98b', background:'#f2f2df', marginBottom:12 }}><strong>{t('Photosynthesis', 'Fotosintesis')}</strong><div>{day ? t('Light available', 'Cahaya tersedia') : t('Inactive without light', 'Tidak aktif tanpa cahaya')}</div>{day && <><div style={{fontSize:15}}>CO₂ + H₂O → {t('sugars', 'gula')} + O₂</div><div style={{height:10,position:'relative',borderBottom:'1px solid #75865d'}}>{[0,30,60].map(o => <span key={o} style={{position:'absolute',left:`${particle(o)*90}%`,width:5,height:5,borderRadius:'50%',background:'#567544'}}/>)}</div></>}</div>
      <div style={{ padding:12, border:'1px solid #9ba4b4', background:'#edf0f5' }}><strong>{t('Respiration', 'Respirasi')}</strong><div>{t('Active day + night', 'Aktif siang + malam')}</div><div style={{fontSize:15}}>{t('sugars', 'gula')} + O₂ → {t('energy', 'energi')} + CO₂ + H₂O</div><div style={{height:10,position:'relative',borderBottom:'1px solid #758196'}}>{[0,30,60].map(o => <span key={o} style={{position:'absolute',left:`${particle(o)*90}%`,width:5,height:5,borderRadius:'50%',background:'#60748f'}}/>)}</div></div>
    </div>
  </AbsoluteFill>;
}
