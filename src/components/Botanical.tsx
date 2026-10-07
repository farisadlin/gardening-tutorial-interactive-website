import { useId } from 'react';
import type { Crop } from '../data/garden';
export function Botanical({ crop, className = '' }: { crop: Crop; className?: string }) {
  const id = useId().replaceAll(':', '');
  const chive = crop.id === 'chives';
  const chilli = crop.id === 'chilli';
  const tall = ['water-spinach', 'amaranth', 'chilli'].includes(crop.id);
  const leaves = crop.id === 'lettuce' ? 15 : crop.id === 'pak-choi' ? 10 : 12;
  return <svg className={`botanical ${className}`} viewBox="0 0 360 270" aria-hidden="true">
    <defs>
      <linearGradient id={`leaf${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={crop.id === 'lettuce' ? '#a7c566' : '#7d9e54'}/><stop offset=".5" stopColor="#4f7a3d"/><stop offset="1" stopColor="#234e35"/></linearGradient>
      <linearGradient id={`pot${id}`}><stop stopColor="#cc9772"/><stop offset=".5" stopColor="#ddaa86"/><stop offset="1" stopColor="#b87754"/></linearGradient>
      <filter id={`shadow${id}`}><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="182" cy="242" rx="69" ry="9" fill="#3f5430" opacity=".12" filter={`url(#shadow${id})`}/>
    <path d="M136 168L146 229Q180 245 215 229L225 168Z" fill={`url(#pot${id})`}/>
    <path d="M141 180Q180 191 222 180" fill="none" stroke="#9c664b" opacity=".24"/>
    <ellipse cx="180" cy="168" rx="46" ry="13" fill="#9a694a"/>
    <ellipse cx="180" cy="165" rx="42" ry="10" fill="#433e29"/>
    {chive ? Array.from({ length: 25 }, (_, i) => <path key={i} d={`M${174 + i % 5 * 3} 169 Q${120 + i * 5} ${85 + i % 4 * 8} ${117 + i * 5} ${38 + i % 7 * 10}`} fill="none" stroke={i % 2 ? '#416d38' : '#75934a'} strokeWidth={3 + i % 2} strokeLinecap="round"/>) : <>
      {tall && <path d="M180 170Q174 103 181 41" fill="none" stroke="#6d8641" strokeWidth="5"/>}
      {Array.from({ length: leaves }, (_, i) => {
        const angle = tall ? (i % 2 ? 1 : -1) * (45 + i % 3 * 15) : -78 + i * 156 / (leaves - 1);
        const y = tall ? 150 - i * 9 : 166;
        const size = tall ? 0.65 + (i % 3) * 0.08 : 0.7 + (i % 4) * 0.15;
        return <g key={i} transform={`translate(180 ${y}) rotate(${angle}) scale(${size})`}>
          <path d="M0 0Q-8-22 0-45" stroke={crop.id === 'pak-choi' ? '#d8ddac' : '#829558'} strokeWidth={crop.id === 'pak-choi' ? 9 : 3} fill="none"/>
          <path d={crop.id === 'lettuce' ? 'M0-28C-13-24-34-35-29-45C-46-51-35-65-35-68C-47-82-25-89-27-91C-20-108-3-105 0-117C11-109 29-110 29-94C43-93 47-73 35-68C45-53 35-39 24-38C21-25 5-25 0-28Z' : crop.id === 'water-spinach' ? 'M0-28Q-29-49-19-79Q-8-98 0-112Q13-99 20-79Q29-49 0-28Z' : 'M0-28C-39-29-40-74-25-93Q-8-111 0-108Q32-112 35-80C41-53 19-29 0-28Z'} fill={`url(#leaf${id})`}/>
          <path d="M0-33Q-2-66 0-102M0-58L-17-70M0-74L16-86" fill="none" stroke="#bdd28c" opacity=".48" strokeWidth="1.3"/>
        </g>;
      })}
      {chilli && [0, 1, 2, 3].map(i => <g key={i} transform={`translate(${155 + i % 2 * 47} ${76 + i * 15}) rotate(${i % 2 ? -20 : 20})`}><path d="M0 0Q-8 2-8 17Q-8 40 0 51Q8 34 8 17Q9 3 0 0" fill={i === 2 ? '#e6a547' : '#ba4d35'}/><path d="M0 2Q3-6 7-8" stroke="#426137" strokeWidth="3" fill="none"/></g>)}
    </>}
    <path d="M134 165Q180 180 227 165L226 174Q180 188 134 174Z" fill="#ca9270"/>
    <path d="M151 201L154 224" stroke="#efc2a2" strokeWidth="3" opacity=".35"/>
  </svg>;
}
