import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CloudRain, Sun, Trees } from 'lucide-react';
import { crops } from '../data/garden';
import { hydroSystems, systemSupport, type HydroSystemId } from '../data/hydroSystems';
import { useGarden } from '../state';
import HydroDiagram from './HydroDiagram';

export default function HomeInsights() {
  const { state } = useGarden();
  const language = state.language;
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const [selected, setSelected] = useState<HydroSystemId>('wick');
  const system = hydroSystems.find(item => item.id === selected)!;
  const crop = crops.find(item => systemSupport(item, selected).available) ?? crops[0];
  return <div className="home-insights page-width insights-explorer">
    <section className="insight-hydro" aria-labelledby="insight-hydro-title">
      <div className="eyebrow">{t('LOOK BENEATH THE LEAVES', 'LIHAT DI BAWAH DAUN')}</div>
      <h2 id="insight-hydro-title">{t('Different systems.', 'Beragam sistem.')}<br/><em>{t('Roots at the heart.', 'Akar jadi pusatnya.')}</em></h2>
      <div className="insight-system-buttons" role="group" aria-label={t('Preview hydroponic systems', 'Pratinjau sistem hidroponik')}>{hydroSystems.map(item => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.name[language]}</button>)}</div>
      <div className="insight-system-preview">
        <div className="insight-system-art" key={selected}><HydroDiagram crop={crop} systemId={selected} stage="care" language={language}/></div>
        <div className="insight-system-copy" aria-live="polite"><h3>{system.fullName[language]}</h3><p>{system.description[language]}</p><span className="insight-root-note">{system.rootLabel[language]}</span><Link className="text-link" to={`/plants/${crop.id}?method=hydro&system=${selected}#hydro-systems`}>{t('Explore this system', 'Jelajahi sistem ini')}<ArrowRight size={16} aria-hidden="true"/></Link></div>
      </div>
      <p className="insight-caption">{t('Select a system to see how water reaches the roots. Illustrative diagram.', 'Pilih sistem untuk melihat cara air mencapai akar. Diagram ilustratif.')}</p>
    </section>
    <section className="insight-climate" aria-labelledby="insight-climate-title">
      <div className="climate-sketch" aria-hidden="true"><Sun strokeWidth={1}/><CloudRain strokeWidth={1}/><span className="climate-ground"/></div>
      <div className="eyebrow">{t('GROW WITH YOUR SURROUNDINGS', 'TUMBUH BERSAMA LINGKUNGAN')}</div>
      <h2 id="insight-climate-title">{t('A tropical garden', 'Kebun tropis')}<br/><em>{t('has its own rhythm.', 'punya ritmenya sendiri.')}</em></h2>
      <p>{t('Observe your space, then adapt your growing routine.', 'Amati ruang Anda, lalu sesuaikan rutinitas menanam.')}</p>
      <ul className="climate-observations">
        <li><Sun size={20} aria-hidden="true"/><div><strong>{t('Follow the light', 'Kenali cahayanya')}</strong><span>{t('Notice where sunlight falls throughout the day.', 'Amati bagian yang terkena matahari sepanjang hari.')}</span></div></li>
        <li><CloudRain size={20} aria-hidden="true"/><div><strong>{t('Watch the rain', 'Perhatikan hujannya')}</strong><span>{t('Check your growing space after wet weather.', 'Periksa tempat tanam setelah hujan.')}</span></div></li>
        <li><Trees size={20} aria-hidden="true"/><div><strong>{t('Find your shade', 'Kenali naungannya')}</strong><span>{t('Shade and warmth vary from one corner to another.', 'Naungan dan suhu berbeda di setiap sudut.')}</span></div></li>
      </ul>
      <Link className="text-link" to="/how-it-works">{t('Get to know your growing space', 'Kenali ruang tanam Anda')}<ArrowRight size={16} aria-hidden="true"/></Link>
    </section>
  </div>;
}
