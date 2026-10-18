/* Native HyperFrames: one paused, deterministic GSAP timeline. */
(() => {
  const root = document.getElementById('day-artwork');
  const clock = { frame: 0 };
  let activeHour = -1;
  const draw = () => {
    const frame = Math.min(2879, Math.max(0, Math.floor(clock.frame + 0.000001)));
    const hour = Math.floor(frame / 120);
    if (hour !== activeHour) {
      root.innerHTML = window.dayScenes[hour];
      activeHour = hour;
    }
    window.__day3D?.renderAt(frame / 30);
    const day = hour >= 6 && hour < 18;
    const fraction = element => ((frame + Number(element.dataset.offset)) % 90) / 90;
    root.querySelector('.day-plant').setAttribute('transform', `rotate(${Math.sin(frame / 20) * 1.5} 480 424)`);
    root.querySelectorAll('.day-star').forEach(element => element.setAttribute('r', String(2 + Math.sin(frame / 20 + Number(element.dataset.index)) * 0.5)));
    root.querySelectorAll('.water-particle').forEach(element => element.setAttribute('cy', String(525 - fraction(element) * (day ? 204 : 90))));
    root.querySelectorAll('.oxygen-bubble').forEach(element => element.setAttribute('cy', String(545 - fraction(element) * 90)));
    root.querySelectorAll('.process-particle').forEach(element => { element.style.left = `${fraction(element) * 90}%`; });
    const light = day ? Math.sin(((hour - 6 + 0.5) / 12) * Math.PI) : 0;
    const sunX = 170 + Math.max(0, Math.min(1, (hour - 6) / 11)) * 640;
    const sunY = 210 - light * 75;
    root.querySelectorAll('.light-particle').forEach(element => {
      element.setAttribute('cx', String(sunX + (510 - sunX) * fraction(element)));
      element.setAttribute('cy', String(sunY + (295 - sunY) * fraction(element)));
    });
  };
  const timeline = gsap.timeline({ paused: true, onUpdate: draw });
  timeline.to(clock, { frame: 2880, duration: 96, ease: 'none' }, 0);
  draw();
  window.__timelines = window.__timelines || {};
  window.__timelines['photosynthesis-day'] = timeline;
})();
