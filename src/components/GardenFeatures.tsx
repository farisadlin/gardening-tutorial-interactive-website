import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useGarden } from '../state';

function FeatureDrawing({ kind }: { kind: 'soil' | 'water' | 'model' | 'learn' }) {
  const sprout = <g><path d="M50 49V26" stroke="#557443" strokeWidth="2.5" fill="none"/><path d="M49 34Q30 34 33 19Q48 18 49 34M51 29Q52 12 68 15Q70 30 51 29" fill="#7e9757"/></g>;
  return <svg viewBox="0 0 100 90" aria-hidden="true" className={`feature-drawing feature-${kind}`}>
    <ellipse cx="50" cy="79" rx="32" ry="4" fill="#dce2ce"/>
    {kind === 'soil' && <><path d="M25 46H75L68 75H32Z" fill="#c58e6c"/><path d="M24 45H76V51H24Z" fill="#d7a889"/><path d="M31 51H69L65 68H35Z" fill="#94704e"/>{sprout}<path d="M50 50v16m0-8-8 7m8-5 9 8" stroke="#eadabd" strokeWidth="1.5" fill="none"/></>}
    {kind === 'water' && <><rect x="23" y="46" width="54" height="29" rx="6" fill="#afcfc4"/><path d="M25 60Q37 55 50 60T75 60V71H25Z" fill="#7cafaa"/><path d="M28 46H72" stroke="#537367" strokeWidth="4"/>{sprout}<path d="M42 45h16l-3 10H45Z" fill="#9c9772"/><path d="M47 54q-6 8 0 15m4-15q5 8 0 15m3-14q9 7 5 13" stroke="#f3e8c7" strokeWidth="1.5" fill="none"/><circle cx="66" cy="65" r="2" fill="#d7e8dc"/></>}
    {kind === 'model' && <><path d="M19 34L50 17L81 34V68L50 83L19 68Z" fill="#e3e8d8" stroke="#738663" strokeWidth="1.5"/><path d="M19 34L50 50L81 34M50 50V83" stroke="#738663" strokeWidth="1.5" fill="none"/><g transform="translate(0 8) scale(1 .85)">{sprout}</g><path d="M36 49H64L59 68H41Z" fill="#c58e6c"/><path d="M13 57q-10-16 1-29m-1 0-1 8m1-8-7 4" stroke="#738663" strokeWidth="1.5" fill="none"/></>}
    {kind === 'learn' && <><path d="M50 43Q33 33 16 39V70Q34 65 50 75Q66 65 84 70V39Q67 33 50 43Z" fill="#efe5c7" stroke="#9a9f75" strokeWidth="1.5"/><path d="M50 44V73M24 48L41 51M24 55L41 58M60 51L76 48M60 58L76 55" stroke="#aeb08c" strokeWidth="1.5"/>{sprout}<path d="M50 40V24" stroke="#557443" strokeWidth="2.5"/></>}
  </svg>;
}
export default function GardenFeatures() {
  const { state } = useGarden();
  const t = (en: string, id: string) => state.language === 'en' ? en : id;
  const items = [
    { kind: 'soil' as const, title: t('Rooted in soil', 'Berakar di tanah'), hint: t('Discover the growing medium', 'Kenali media tanam'), to: '/plants?method=soil' },
    { kind: 'water' as const, title: t('Grown in water', 'Tumbuh dalam air'), hint: t('Explore seven systems', 'Jelajahi tujuh sistem'), to: '/plants/pak-choi?method=hydro#hydro-systems' },
    { kind: 'model' as const, title: t('See every step in 3D', 'Lihat tiap langkah dalam 3D'), hint: t('Look beneath the leaves', 'Lihat di bawah daun'), to: '/plants/pak-choi' },
    { kind: 'learn' as const, title: t('Learn at your own pace', 'Belajar sesuai ritme Anda'), hint: t('Make the next step yours', 'Mulai langkah Anda'), to: '/how-it-works' },
  ];
  return <nav className="intro-strip page-width garden-features" aria-label={t('Ways to learn gardening', 'Cara belajar berkebun')}>{items.map(item => <Link className="garden-feature" to={item.to} key={item.kind}><FeatureDrawing kind={item.kind}/><div className="feature-text"><strong>{item.title}</strong><span>{item.hint}</span></div><ArrowUpRight size={16} className="feature-arrow" aria-hidden="true"/></Link>)}</nav>;
}
