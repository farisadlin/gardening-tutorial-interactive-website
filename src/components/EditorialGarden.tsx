import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Leaf, Sprout, Droplets, Sun } from 'lucide-react';
import { useGarden } from '../state';
import { crops, b } from '../data/garden';
import { Botanical } from './Botanical';

export function GardenMarquee() {
  const { state } = useGarden();
  return <div className="garden-marquee" aria-hidden="true"><div className="marquee-track">{[0, 1].map(copy => <div className="marquee-copy" key={copy}>{crops.map(crop => <span key={crop.id}>{crop.name[state.language]}<Leaf size={24} strokeWidth={1}/></span>)}</div>)}</div></div>;
}
export function GardenStories() {
  const { state } = useGarden(); const lang = state.language;
  const t = (en: string, id: string) => lang === 'en' ? en : id;
  const stories = [
    { title: b('A little soil.', 'Sedikit tanah.'), text: b('Start with a pot, a healthy growing medium, and a corner with suitable light. Learn what happens beneath the surface.', 'Mulai dari pot, media tanam sehat, dan sudut dengan cahaya yang sesuai. Pelajari yang terjadi di bawah permukaan.'), link:'/plants?method=soil', action:b('Discover soil growing', 'Jelajahi tanam di tanah'), crop:crops[0], icon:Sprout, className:'story-soil' },
    { title: b('A little water.', 'Sedikit air.'), text: b('No soil? There is still plenty to discover. Compare seven hydroponic systems and find the one that suits your plant.', 'Tanpa tanah? Masih banyak yang bisa dipelajari. Bandingkan tujuh sistem hidroponik dan temukan yang sesuai tanaman Anda.'), link:'/plants/pak-choi?method=hydro#hydro-systems', action:b('Discover hydroponics', 'Jelajahi hidroponik'), crop:crops[3], icon:Droplets, className:'story-water' },
    { title: b('A little understanding.', 'Sedikit pemahaman.'), text: b('Follow a leaf through a whole day. See how light, water, and air become the energy behind your next harvest.', 'Ikuti daun sepanjang hari. Lihat bagaimana cahaya, air, dan udara mendukung panen Anda berikutnya.'), link:'/photosynthesis#day-cycle', action:b('Follow the science', 'Ikuti sainsnya'), crop:crops[5], icon:Sun, className:'story-light' },
  ];
  return <section className="garden-stories page-width"><div className="editorial-section-heading"><span className="eyebrow">{t('A GARDEN CAN BEGIN ANYWHERE', 'KEBUN BISA DIMULAI DI MANA SAJA')}</span><h2>{t('Small beginnings.', 'Awal yang kecil.')}<br/><em>{t('Real discoveries.', 'Penemuan yang berarti.')}</em></h2><p>{t('You bring the curiosity. We’ll help with the next step.', 'Anda membawa rasa ingin tahu. Kami membantu langkah berikutnya.')}</p></div><div className="garden-story-row" tabIndex={0} role="group" aria-label={t('Explore soil, hydroponics, and plant science', 'Jelajahi tanah, hidroponik, dan sains tanaman')}>{stories.map(story => <article className={`garden-story-card ${story.className}`} key={story.link}><div className="story-copy"><story.icon size={30} strokeWidth={1.25}/><h3>{story.title[lang]}</h3><p>{story.text[lang]}</p><Link className="text-link" to={story.link}>{story.action[lang]}<ArrowRight size={18}/></Link></div><div className="story-art"><Botanical crop={story.crop}/></div></article>)}</div></section>;
}
export function GrowingNotes() {
  const { state } = useGarden(); const lang = state.language; const [index, setIndex] = useState(0);
  const t = (en: string, id: string) => lang === 'en' ? en : id;
  const notes = [
    { title:b('Let your space lead.', 'Ikuti kondisi ruang Anda.'), text:b('Choose a crop that fits your light and your space. A healthy small garden starts with a suitable place to grow.', 'Pilih tanaman yang cocok dengan cahaya dan ruang Anda. Kebun kecil yang sehat dimulai dari tempat tanam yang sesuai.'), crop:crops[0], label:b('Choosing your first plant', 'Memilih tanaman pertama'), link:'/plants' },
    { title:b('Look below the leaves.', 'Lihat di bawah daun.'), text:b('Water, minerals, and root oxygen matter in every growing method. Our visual guides make the hidden parts easier to understand.', 'Air, mineral, dan oksigen akar penting dalam setiap metode tanam. Panduan visual kami membantu memahami bagian yang tersembunyi.'), crop:crops[3], label:b('Understanding your setup', 'Memahami sistem tanam'), link:'/plants/pak-choi?method=hydro' },
    { title:b('Make room for curiosity.', 'Beri ruang untuk rasa ingin tahu.'), text:b('Photosynthesis makes sugars in the light. Respiration keeps living cells working through day and night. Follow both in our daily animation.', 'Fotosintesis membentuk gula saat ada cahaya. Respirasi menjaga kerja sel hidup siang dan malam. Ikuti keduanya dalam animasi harian.'), crop:crops[5], label:b('Learning the plant science', 'Mempelajari sains tanaman'), link:'/photosynthesis' },
  ];
  const note = notes[index];
  return <section className="growing-notes page-width" aria-label={t('Growing notes carousel', 'Karusel catatan berkebun')}><div className="notes-portraits" aria-hidden="true">{notes.map((item,i) => <span key={i} className={i === index ? 'current' : ''}><Botanical crop={item.crop}/></span>)}</div><div className="notes-copy"><span className="eyebrow">{t('NOTES FROM THE GARDEN', 'CATATAN DARI KEBUN')}</span><div aria-live="polite"><h2>{note.title[lang]}</h2><p>{note.text[lang]}</p></div><Link className="text-link" to={note.link}>{note.label[lang]}<ArrowRight size={16}/></Link><p className="notes-attribution">{t('Grow Together · editorial growing notes', 'Grow Together · catatan panduan berkebun')}</p></div><div className="notes-controls"><button aria-label={t('Previous growing note', 'Catatan berkebun sebelumnya')} onClick={() => setIndex((index+2)%3)}><ArrowLeft size={19}/></button><span>{index+1} / 3</span><button aria-label={t('Next growing note', 'Catatan berkebun berikutnya')} onClick={() => setIndex((index+1)%3)}><ArrowRight size={19}/></button></div></section>;
}
export function GardenInvitation() {
  const { state } = useGarden(); const t = (en: string, id: string) => state.language === 'en' ? en : id;
  return <section className="garden-invitation" aria-label={t('Start your growing journey', 'Mulai perjalanan tanam Anda')}><div className="page-width"><div className="invitation-copy"><span className="eyebrow">{t('YOUR NEXT LITTLE ADVENTURE', 'PETUALANGAN KECIL BERIKUTNYA')}</span><h2>{t('Good things', 'Hal baik')}<br/><em>{t('take a little growing.', 'dimulai dari menanam.')}</em></h2><Link className="button invitation-button" to="/plants">{t('Choose your growing guide', 'Pilih panduan tanam Anda')}<ArrowRight size={20}/></Link></div><div className="invitation-art" aria-hidden="true"><Botanical crop={crops[0]}/></div></div></section>;
}
