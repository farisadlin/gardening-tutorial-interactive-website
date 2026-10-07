import { b, type Crop, type Language, type Stage } from '../data/garden';
import { hydroSystems, type HydroSystemId } from '../data/hydroSystems';
import { scenePresets } from './sceneConfig';
export default function HydroDiagram({ crop, systemId, stage, language, thumbnail = false }: { crop: Crop; systemId: HydroSystemId; stage: Stage; language: Language; thumbnail?: boolean }) {
  const system = hydroSystems.find(s => s.id === systemId)!;
  const growth = scenePresets[stage].growth;
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const channel = systemId === 'nft' || systemId === 'dft';
  const medium = systemId === 'wick' || systemId === 'drip';
  const plant = (x: number, y: number, scale: number) => <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 0V-28" stroke="#648343" strokeWidth="4"/>{[0, 1, 2, 3].map(i => <path key={i} d={`M0-12Q${i % 2 ? 23 : -23} ${-30 - i * 3} ${i % 2 ? 12 : -12} ${-40 - i * 5}`} stroke={stage === 'troubleshoot' && i === 0 ? '#b6a358' : '#61833e'} strokeWidth={crop.id === 'chives' ? 3 : 12} fill="none" strokeLinecap="round"/>)}<path d="M-12 0H12L9 18H-9Z" fill="#9a906c"/>{[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${i * 4 - 8} 13Q${i * 5 - 10} 31 ${i * 6 - 12} 42`} fill="none" stroke="#e7d9b2" strokeWidth="2"/>)}</g>;
  const labels = <g fill="#344f3c" fontSize="12" fontFamily="sans-serif"><text x="18" y="37">{system.name[language]}</text><text x="18" y="305">{system.power[language]}</text></g>;
  return <svg viewBox="0 0 440 320" className={thumbnail ? 'system-thumbnail' : 'static-diagram'} role={thumbnail ? undefined : 'img'} aria-hidden={thumbnail || undefined} aria-label={thumbnail ? undefined : t(`${system.name.en}: ${crop.name.en} at ${stage}`, `${system.name.id}: ${crop.name.id}, fase ${stage}`)}>
    <ellipse cx="220" cy="295" rx="150" ry="5" fill="#d9dfcb"/>
    {channel ? <>
      <path d="M60 161H364V224H60Z" fill="#698370"/><path d="M68 170H356V217H68Z" fill="#e5ead9"/>
      <path d={systemId === 'nft' ? 'M68 209H356V217H68Z' : 'M68 181H356V217H68Z'} fill="#9dcac0"/>
      <path d="M165 246H272V290H165Z" fill="#617f70"/><path d="M171 257H266V284H171Z" fill="#acd3c6"/>
      <path d="M181 266H56V175H72M350 204H383V270H272" stroke="#829875" strokeWidth="6" fill="none"/>
      <rect x="175" y="262" width="16" height="14" rx="3" fill="#3c5f56"/>
      {[106, 213, 318].map(x => growth > 0 ? <g key={x}>{plant(x, 160, .65 + growth * .4)}</g> : <path key={x} d={`M${x - 12} 160h24l-4 18h-16z`} fill="#9a906c"/>)}
      <path d="M77 214L82 245M348 224L351 245" stroke="#8d9479" strokeWidth="5"/>
      <path d="m111 214 8-4-8-4m121 8 8-4-8-4" stroke="#4c9180" fill="none" strokeWidth="2"/>
      {systemId === 'dft' && <><path d="M323 211V182H357" fill="none" stroke="#557767" strokeWidth="4"/><circle cx="237" cy="278" r="5" fill="#668591"/><circle cx="240" cy="266" r="2" fill="#f4faf2"/></>}
      {!thumbnail && <g fill="#344f3c" fontSize="11" fontFamily="sans-serif"><text x="90" y="67">{system.rootLabel[language]}</text><path d="M133 75V190" stroke="#829576" strokeDasharray="3 3"/><text x="285" y="282">{t('Reservoir + pump', 'Tandon + pompa')}</text><text x="278" y="242">{t('Return', 'Aliran balik')}</text></g>}
    </> : medium ? <>
      <path d="M135 161H269L258 240H146Z" fill="#c18b62"/><path d="M145 170H259L249 230H154Z" fill="#9d8b64"/>
      {growth > 0 && plant(202, 160, .75 + growth * .4)}
      {systemId === 'wick' ? <><path d="M150 247H257V289H150Z" fill="#647e70"/><path d="M157 261H251V282H157Z" fill="#a0cabd"/><path d="M185 189Q189 222 189 275M218 190Q214 224 214 275" fill="none" stroke="#ead9a3" strokeWidth="5"/>{!thumbnail && <g fill="#344f3c" fontSize="11" fontFamily="sans-serif"><text x="277" y="212">{t('Airy medium', 'Media berpori')}</text><text x="276" y="267">{t('Wick uptake', 'Serapan sumbu')}</text><path d="M241 260H270" stroke="#829576"/></g>}</> : <><path d="M305 242H403V290H305Z" fill="#647e70"/><path d="M313 260H396V283H313Z" fill="#a0cabd"/><path d="M352 267H378V137H231V166" fill="none" stroke="#547560" strokeWidth="5"/><path d="M201 241V258H305" fill="none" stroke="#819779" strokeWidth="5"/><circle cx="230" cy="177" r="3" fill="#78b7a7"/><rect x="346" y="260" width="15" height="14" rx="3" fill="#3c5f56"/>{!thumbnail && <g fill="#344f3c" fontSize="11" fontFamily="sans-serif"><text x="267" y="121">{t('Drip emitter', 'Emitter tetes')}</text><text x="14" y="253">{t('Drain return', 'Balik drainase')}</text><path d="M95 250H201" stroke="#829576"/></g>}</>}
    </> : <>
      <path d="M133 162H277L268 284H142Z" fill="#638271"/><path d="M143 172H267L259 274H151Z" fill="#b9d9ca"/>
      {systemId === 'kratky' && <path d={`M144 173H266L264 ${['prepare', 'sow', 'transplant'].includes(stage) ? 181 : 209}H146Z`} fill="#e9eedf"/>}
      {growth > 0 && plant(206, 161, .8 + growth * .45)}
      {systemId === 'dwc' && <><circle cx="244" cy="263" r="7" fill="#688791"/><path d="M244 263H303V239" fill="none" stroke="#a59f80" strokeWidth="3"/><rect x="285" y="226" width="40" height="18" rx="5" fill="#7b8e71"/>{[0, 1, 2, 3, 4].map(i => <circle key={i} cx={242 + i % 2 * 5} cy={249 - i * 11} r="3" fill="#eef8ed"/>)}</>}
      {!thumbnail && <g fill="#344f3c" fontSize="11" fontFamily="sans-serif"><text x="16" y="210">{system.rootLabel[language]}</text><path d="M85 208H171" stroke="#829576"/><text x="283" y="269">{t('Nutrient solution', 'Larutan nutrisi')}</text></g>}
    </>}
    {stage === 'sow' && <><rect x="32" y="252" width="32" height="24" rx="3" fill="#9d916c"/><circle cx="48" cy="252" r="3" fill="#d1ae64"/></>}
    {!thumbnail && labels}
  </svg>;
}
