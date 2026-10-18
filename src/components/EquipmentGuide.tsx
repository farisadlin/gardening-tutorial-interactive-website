import { Wrench, Check, Leaf, Gauge, Scissors } from 'lucide-react';
import type { Crop, Method, Stage } from '../data/garden';
import type { HydroSystemId } from '../data/hydroSystems';
import { getEquipment } from '../data/equipment';
import { useGarden } from '../state';
export default function EquipmentGuide({ crop, method, systemId, compact = false, open = false, stage }: { crop: Crop; method: Method; systemId?: HydroSystemId; compact?: boolean; open?: boolean; stage?: Stage }) {
  const { state } = useGarden(); const lang = state.language; const t = (en: string, id: string) => lang === 'en' ? en : id;
  const items = getEquipment(crop, method, systemId); const required = items.filter(item => item.required).length;
  const content = <><p className="equipment-intro">{t('Gather these before starting. Tools can be reused; seeds, growing media and nutrients are materials. Use an equivalent item you already own when it serves the same purpose.', 'Siapkan sebelum mulai. Alat dapat dipakai ulang; benih, media dan nutrisi adalah bahan. Gunakan alat setara yang sudah dimiliki jika fungsinya sama.')}</p>{method === 'hydro' && <p className="equipment-planning">{t(`Reservoir planning reference: ${crop.reservoir} for one plant. Shared channels need a larger reservoir matched to the kit and plant count.`, `Acuan perencanaan tandon: ${crop.reservoir} untuk satu tanaman. Talang bersama perlu tandon lebih besar sesuai kit dan jumlah tanaman.`)}</p>}{(['grow', 'measure', 'care'] as const).map(group => <section className="equipment-category" key={group}><h3>{group === 'grow' ? <Leaf size={16}/> : group === 'measure' ? <Gauge size={16}/> : <Scissors size={16}/>} {group === 'grow' ? t('Growing setup & materials', 'Instalasi & bahan tanam') : group === 'measure' ? t('Measuring & mixing', 'Pengukuran & pencampuran') : t('Care & harvesting', 'Perawatan & panen')}</h3><ul className="equipment-cards">{items.filter(item => item.group === group).map(item => <li key={item.id} data-equipment={item.id}><div className="equipment-item-title"><strong>{item.name[lang]}</strong><span className={`equipment-badge ${item.required ? 'required' : ''}`}>{item.required ? <Check size={11}/> : null}{item.required ? t('Required', 'Wajib') : t('Optional', 'Opsional')}</span></div><p>{item.purpose[lang]}</p></li>)}</ul></section>)}</>;
  if (stage) {
    const ids: Record<Stage, string[]> = {
      prepare: items.filter(item => item.required && item.group === 'grow' && !['seeds', 'seed-tray', 'seed-plugs', 'nutrients'].includes(item.id)).map(item => item.id),
      sow: ['seeds', 'seed-tray', 'seed-plugs', 'soil-mix', 'watering-can', 'labels'],
      transplant: ['net-pots', 'media-pot', 'soil-pot', 'soil-mix', 'trowel', 'stake'],
      care: ['ph-meter', 'ec-meter', 'thermometer', 'nutrients', 'watering-can', 'soil-feed'],
      troubleshoot: ['ph-meter', 'ec-meter', 'thermometer', 'snips', 'gloves'],
      harvest: ['snips', 'gloves'],
    };
    return <section className="step-equipment"><h3><Wrench size={17}/>{stage === 'prepare' ? t('Setup essentials', 'Perlengkapan awal') : t('For this step', 'Untuk langkah ini')}</h3><ul>{items.filter(item => ids[stage].includes(item.id)).map(item => <li key={item.id}>{item.name[lang]}</li>)}</ul><details className="learning-details"><summary>{t('Full kit & instructions', 'Perlengkapan lengkap & petunjuk')}</summary>{content}</details></section>;
  }
  return compact ? <details key={`${crop.id}:${method}:${systemId}`} className="equipment-guide compact-equipment" open={open || undefined}><summary><Wrench size={17}/><span>{t('Tools & materials', 'Alat & bahan')}<small>{required} {t('required · view the list', 'wajib · lihat daftar')}</small></span></summary>{content}</details> : <section className="equipment-guide" id="equipment"><div className="equipment-heading"><div><span className="eyebrow">{t('PREPARE YOUR GROWING KIT', 'SIAPKAN PERLENGKAPAN TANAM')}</span><h2><Wrench size={22}/>{t('Tools for every little step.', 'Alat untuk setiap langkah kecil.')}</h2></div><span>{required} {t('required', 'wajib')} · {items.length - required} {t('optional', 'opsional')}</span></div>{content}</section>;
}
