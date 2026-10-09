import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import type { Language } from '../data/garden';

/** Keep the same player mounted so entering fullscreen preserves its frame. */
export default function AnimationFullscreen({ children, language, label, aspectRatio }: { children: ReactNode; language: Language; label: string; aspectRatio: number }) {
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const wasNative = useRef(false);
  const [native, setNative] = useState(false);
  const [fallback, setFallback] = useState(false);
  const active = native || fallback;
  const t = (en: string, id: string) => language === 'en' ? en : id;
  useEffect(() => {
    const update = () => {
      const entered = document.fullscreenElement === panel.current;
      setNative(entered);
      if (wasNative.current && !entered) requestAnimationFrame(() => toggle.current?.focus({ preventScroll: true }));
      wasNative.current = entered;
    };
    document.addEventListener('fullscreenchange', update);
    return () => { document.removeEventListener('fullscreenchange', update); };
  }, []);
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    toggle.current?.focus({ preventScroll: true });
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fallback) { event.preventDefault(); setFallback(false); toggle.current?.focus({ preventScroll: true }); }
      if (event.key !== 'Tab') return;
      const elements = Array.from(panel.current?.querySelectorAll<HTMLElement>('button, input, [tabindex="0"]') ?? []).filter(element => !element.hasAttribute('disabled') && element.getClientRects().length);
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', keyboard); };
  }, [active, fallback]);
  const change = async () => {
    if (native) { await document.exitFullscreen(); return; }
    if (fallback) { setFallback(false); return; }
    try {
      if (!panel.current?.requestFullscreen) { setFallback(true); return; }
      await panel.current.requestFullscreen();
    } catch { setFallback(true); }
  };
  return <div style={{ '--animation-ratio': aspectRatio } as CSSProperties} ref={panel} className={`animation-focus${active ? ' is-fullscreen' : ''}`} role={fallback ? 'dialog' : undefined} aria-modal={fallback ? true : undefined} aria-label={label}>
    <div className="animation-focus-toolbar"><span>{label}</span><button ref={toggle} type="button" onClick={() => void change()} aria-pressed={active}>{active ? <Minimize size={18} aria-hidden="true"/> : <Maximize size={18} aria-hidden="true"/>}{active ? t('Exit fullscreen', 'Keluar layar penuh') : t('Fullscreen', 'Layar penuh')}</button></div>
    {children}
  </div>;
}
