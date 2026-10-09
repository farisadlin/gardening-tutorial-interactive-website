import { Component, lazy, Suspense, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Box, Eye, Minus, Plus, RotateCcw, ScanLine } from 'lucide-react';
import { b, type Crop, type Language, type Method, type Stage } from '../data/garden';
import HydroDiagram from './HydroDiagram';
import { defaultSystem, resolveSystem, type HydroSystemId } from '../data/hydroSystems';
import { scenePresets } from './sceneConfig';
import type { ModelAction } from './GardenModel';
const GardenModel = lazy(() => import('./GardenModel'));
class ModelBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function webglAvailable() {
  try { const canvas = document.createElement('canvas'); const gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); if (!gl) return false; gl.getExtension('WEBGL_lose_context')?.loseContext(); return true; } catch { return false; }
}
export function Diagram({ crop, method, stage, language, systemId }: { systemId?: HydroSystemId; crop: Crop; method: Method; stage: Stage; language: Language }) {
  if (method === 'hydro') return <HydroDiagram crop={crop} systemId={systemId || defaultSystem(crop)} stage={stage} language={language}/>;
  const growth = scenePresets[stage].growth;
  const soil = method === 'soil';
  const waterY = ['prepare', 'sow', 'transplant'].includes(stage) ? 183 : 209;
  const t = (en: string, id: string) => language === 'en' ? en : id;
  return <svg viewBox="0 0 440 320" className="static-diagram" role="img" aria-label={t(`${stage}: ${crop.name.en} ${method} setup cross-section`, `${stage}: penampang sistem ${crop.name.id} ${method === 'soil' ? 'tanah' : 'hidroponik'}`)}>
    <ellipse cx="206" cy="288" rx="113" ry="8" fill="#d4dac7"/>
    <path d="M120 154H286L272 277H134Z" fill={soil ? '#c8906c' : '#668675'}/>
    <path d="M132 167H274L260 264H144Z" fill={soil ? '#6d5d46' : '#b8dad3'}/>
    {!soil && <><path d={`M135 173H271L${waterY === 183 ? 270 : 266} ${waterY}H${waterY === 183 ? 136 : 139}Z`} fill="#eaf0e5"/><path d={`M151 ${waterY}H260`} stroke="#66a997" strokeDasharray="4 4"/><path d="M183 153H228L222 183H189Z" fill="#897e5b"/></>}
    {soil && <><path d="M146 164H261" stroke="#947453" strokeWidth="8"/>{[156, 203, 250].map(x => <circle key={x} cx={x} cy="269" r="4" fill="#554733"/>)}</>}
    {growth > 0 && <><path d="M204 165V110" stroke="#749349" strokeWidth="6"/>{Array.from({ length: crop.id === 'chives' ? 9 : 6 }, (_, i) => <path key={i} d={`M204 128Q${i % 2 ? 242 + i * 2 : 161 - i * 2} ${123 - growth * 58} ${i % 2 ? 228 + i * 3 : 182 - i * 3} ${112 - growth * 78}`} stroke={stage === 'troubleshoot' && i === 0 ? '#b7aa56' : '#5d823f'} fill="none" strokeWidth={crop.id === 'chives' ? 3 : 12} strokeLinecap="round"/>)}{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M204 176Q${180 + i * 6} 207 ${172 + i * 8} ${206 + growth * 39}`} stroke="#e8d7a8" fill="none" strokeWidth="2"/>)}</>}
    {stage === 'sow' && <><path d="M196 153H214" stroke="#dfbe6f" strokeWidth="6" strokeLinecap="round"/><text x="302" y="143">{t('Seed', 'Benih')}</text><path d="M215 153L294 140" stroke="#788773" fill="none"/></>}
    <g fill="#344f3c" fontSize="12" fontFamily="sans-serif"><text x="18" y="212">{t(soil ? 'Potting mix' : 'Air zone', soil ? 'Media pot' : 'Zona udara')}</text><path d="M92 209H151" stroke="#788773"/><text x="297" y="242">{t(soil ? 'Drainage' : 'Nutrients', soil ? 'Drainase' : 'Nutrisi')}</text><path d="M259 241H290" stroke="#788773"/>{growth > 0 && <><text x="298" y="94">{t('Growing point', 'Titik tumbuh')}</text><path d="M216 115L290 91" stroke="#788773"/></>}{!soil && crop.system === 'aerated' && <><circle cx="241" cy="247" r="8" fill="#648791"/><circle cx="240" cy="227" r="3" fill="#eff8f4"/><circle cx="245" cy="215" r="3" fill="#eff8f4"/><text x="18" y="258">{t('Air stone', 'Batu aerasi')}</text><path d="M86 254H228" stroke="#788773"/></>}</g>
  </svg>;
}
export default function SceneViewer({ crop, method, stage, language, systemId, preview = false }: { preview?: boolean; systemId?: HydroSystemId; crop: Crop; method: Method; stage: Stage; language: Language }) {
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const portal = useRef<HTMLDivElement>(null);
  const [supported] = useState(webglAvailable);
  const [diagram, setDiagram] = useState(!supported);
  const [cutaway, setCutaway] = useState(!preview);
  const [hotspot, setHotspot] = useState('');
  const [command, setCommand] = useState<{ action: ModelAction; serial: number }>({ action: 'reset', serial: 0 });
  const execute = (action: ModelAction) => setCommand(c => ({ action, serial: c.serial + 1 }));
  const soil = method === 'soil';
  const info: Record<string, ReturnType<typeof b>> = {
    seed: b('A propagation plug holds a seed gently while its first roots form. Keep it moist, not flooded. Use the crop-specific sowing depth in the checklist.', 'Media semai menopang benih saat akar pertamanya terbentuk. Jaga lembap, bukan tergenang. Ikuti kedalaman semai tanaman pada daftar tugas.'),
    container: soil ? b('Drainage holes let excess water escape. Keep them open and empty standing water from the saucer.', 'Lubang drainase membuang air berlebih. Jaga tetap terbuka dan buang genangan di tatakan.') : b('An opaque, food-safe reservoir keeps light out of the solution and helps limit algae. Shelter it from rain and heat.', 'Tandon gelap aman pangan menghalangi cahaya dan membantu membatasi alga. Lindungi dari hujan dan panas.'),
    roots: soil ? b('Roots need moisture and oxygen. A loose potting mix supports both; saturated soil can suffocate fine roots.', 'Akar perlu kelembapan dan oksigen. Media gembur mendukung keduanya; tanah tergenang dapat membuat akar kekurangan oksigen.') : resolveSystem(crop, systemId)!.rootExplanation,
    leaves: b('Keep the growing point above the medium and solution. Protect young plants from harsh sun and look for true leaves before transplanting.', 'Jaga titik tumbuh di atas media dan larutan. Lindungi bibit dari terik dan amati daun sejati sebelum memindahkan.'),
  };
  const fallback = <div className="diagram-fallback"><Diagram systemId={systemId} crop={crop} method={method} stage={stage} language={language}/><p>{preview ? t('Plant diagram · 3D preview unavailable or turned off', 'Diagram tanaman · pratinjau 3D tidak tersedia atau dinonaktifkan') : t('Diagram view · all lesson instructions remain available', 'Tampilan diagram · semua petunjuk tetap tersedia')}</p></div>;
  return <section className={`scene-panel ${preview ? 'plant-preview' : ''}`} aria-label={preview ? t('Interactive plant preview', 'Pratinjau tanaman interaktif') : t('Visual growing guide', 'Panduan visual tanam')}>
    <div className="scene-heading"><span><Box size={17}/>{preview ? t('Explore your plant', 'Jelajahi tanaman Anda') : t('See how it grows', 'Lihat cara tumbuhnya')}</span><span className="small-badge">{method === 'hydro' ? `${resolveSystem(crop, systemId)!.name[language]} · ` : ''}{diagram ? t('DIAGRAM', 'DIAGRAM') : '3D'}</span></div>
    <div className="model-frame">
      {diagram ? fallback : <ModelBoundary fallback={fallback}><Suspense fallback={<div className="model-loading"><SproutLoader/>{t('Preparing your growing space…', 'Menyiapkan ruang tumbuh…')}</div>}><GardenModel preview={preview} systemId={method === 'hydro' ? systemId || defaultSystem(crop) : undefined} portal={portal} crop={crop} method={method} stage={stage} language={language} cutaway={cutaway} command={command} onHotspot={setHotspot} onFailure={() => setDiagram(true)}/></Suspense></ModelBoundary>}
      <div className="model-annotations" ref={portal}/>
    </div>
    {!preview && <div className="scene-caption"><span className="dot"/>{scenePresets[stage].caption[language]}</div>}
    <div className="scene-toolbar">
      {!diagram && <><button className={`tool-button ${cutaway ? 'selected' : ''}`} onClick={() => setCutaway(!cutaway)} aria-pressed={cutaway}><ScanLine size={16}/>{t('Cutaway', 'Penampang')}</button><div className="camera-buttons"><button title={t('Rotate left', 'Putar kiri')} aria-label={t('Rotate left', 'Putar kiri')} onClick={() => execute('left')}><ArrowLeft size={16}/></button><button title={t('Rotate right', 'Putar kanan')} aria-label={t('Rotate right', 'Putar kanan')} onClick={() => execute('right')}><ArrowRight size={16}/></button><button aria-label={t('Zoom in', 'Perbesar')} onClick={() => execute('in')}><Plus size={16}/></button><button aria-label={t('Zoom out', 'Perkecil')} onClick={() => execute('out')}><Minus size={16}/></button><button aria-label={t('Reset camera', 'Atur ulang kamera')} onClick={() => execute('reset')}><RotateCcw size={16}/></button></div></>}
      <button className="tool-button view-switch" onClick={() => { setDiagram(!diagram); setHotspot(''); }} disabled={!supported}><Eye size={16}/>{diagram ? t('View in 3D', 'Lihat dalam 3D') : t('Diagram', 'Diagram')}</button>
    </div>
    {!preview && <div className="part-buttons" aria-label={t('Explore model parts', 'Jelajahi bagian model')}>{Object.keys(info).filter(key => stage === 'sow' ? key !== 'leaves' : key !== 'seed').map(key => <button key={key} onClick={() => setHotspot(hotspot === key ? '' : key)} aria-pressed={hotspot === key}>{key === 'seed' ? t('Seed plug', 'Media semai') : key === 'container' ? t(soil ? 'Drainage' : 'Reservoir', soil ? 'Drainase' : 'Tandon') : key === 'roots' ? t('Root zone', 'Zona akar') : t('Growing point', 'Titik tumbuh')}<Plus size={12}/></button>)}</div>}
    {hotspot && <p className="hotspot-explanation" role="status">{info[hotspot][language]}</p>}
    <p className="scene-help">{t('Drag to rotate · scroll or pinch to zoom. Models illustrate stages, not exact sizes or yields.', 'Geser untuk memutar · gulir atau cubit untuk zoom. Model menggambarkan fase, bukan ukuran atau hasil pasti.')}</p>
  </section>;
}
function SproutLoader() { return <span className="loading-leaf">✳</span>; }
