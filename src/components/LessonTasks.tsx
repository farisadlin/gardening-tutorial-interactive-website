import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import type { Language, Localized } from '../data/garden';

export default function LessonTasks({ tasks, checks, onToggle, language }: {
  tasks: Localized[]; checks: number[]; onToggle: (index: number) => void; language: Language;
}) {
  const [active, setActive] = useState(() => Math.max(0, tasks.findIndex((_, i) => !checks.includes(i))));
  const t = (en: string, id: string) => language === 'en' ? en : id;
  const done = checks.includes(active);
  return <div className="focused-tasks">
    <div className="checklist-heading"><h3>{t('Your next action', 'Langkah Anda berikutnya')}</h3><span>{checks.length}/{tasks.length}</span></div>
    <nav className="task-dots" aria-label={t('Actions in this step', 'Tugas dalam langkah ini')}>
      {tasks.map((_, i) => <button key={i} type="button" aria-label={t(`Task ${i + 1}${checks.includes(i) ? ' · complete' : ''}`, `Tugas ${i + 1}${checks.includes(i) ? ' · selesai' : ''}`)} aria-pressed={active === i} onClick={() => setActive(i)}>{checks.includes(i) ? <Check size={16}/> : i + 1}</button>)}
    </nav>
    <div className="focused-task" aria-live="polite"><p>{tasks[active][language]}</p></div>
    <div className="focused-task-actions">
      <label className="task-item"><input type="checkbox" checked={done} onChange={() => onToggle(active)}/><span>{t('I’ve done this', 'Sudah saya lakukan')}</span></label>
      {done && checks.length < tasks.length && <button type="button" className="text-link" onClick={() => setActive(tasks.findIndex((_, i) => !checks.includes(i)))}>{t('Next action', 'Tugas berikutnya')}<ArrowRight size={16}/></button>}
    </div>
    {checks.length === tasks.length && <p className="task-success" role="status"><Check size={16}/>{t('All actions done. One quick check below.', 'Semua tugas selesai. Jawab cek singkat di bawah.')}</p>}
  </div>;
}
