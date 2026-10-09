import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGarden } from '../state';
gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function SiteMotion() {
  const { pathname } = useLocation(); const { state } = useGarden();
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.motion-image, .crop-image > svg, .progress-art > svg, .empty-garden-art > svg, .invitation-art > svg').forEach(image => {
        gsap.timeline({ scrollTrigger: { trigger: image.parentElement, start:'top 95%', end:'bottom top', scrub:0.6 } })
          .fromTo(image, {scale:0.8, opacity:1}, {scale:1, opacity:1, duration:0.6, ease:'none'})
          .to(image, {opacity:0.2, duration:0.4, ease:'none'});
      });
      let active = true;
      const refresh = () => { if (active) ScrollTrigger.refresh(); };
      document.fonts?.ready.then(refresh);
      return () => { active = false; };
    });
    return () => media.revert();
  }, { dependencies:[pathname, state.language], revertOnUpdate:true });
  return null;
}
