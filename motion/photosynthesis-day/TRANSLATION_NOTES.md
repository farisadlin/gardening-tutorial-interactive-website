# Photosynthesis day cycle: native 3D HyperFrames scene

The 24-hour animation on `/photosynthesis` uses the official `@hyperframes/player`, a paused GSAP timeline, and a Three.js scene. The introductory 24-second animation and crop-growth simulations retain their existing players.

- Duration: 96 seconds, 30 fps, 1,000 × 660 composition.
- Variants: English/Indonesian and soil/hydroponics.
- Controls: all 24 hour selections, full-day playback, bounded single-hour playback, pause, native fullscreen and the mobile fullscreen fallback.
- Model: curved leaf surfaces with veins, lit stems, branched root tubes, cutaway containers, soil, hydroponic solution, and moving water/oxygen/light particles.
- Day/night lighting and process labels use the shared `photosynthesisDay.ts` data. Particle motion illustrates processes, not measured rates.
- Starts paused. Explicit playback works with Reduce Motion enabled.

## Source and regeneration

`src/hyperframes/day-scene.ts` builds and renders the 3D scene. It uses the installed Three.js version, bundled locally by esbuild. Assets do not depend on a CDN. It renders from the HyperFrames/GSAP timeline position and `hf-seek`, without a separate free-running animation clock. Pausing freezes the leaves, camera movement and particles; seeking reconstructs the requested time.

`src/hyperframes/day-timeline.js` owns the shared 96-second timeline. `src/hyperframes/PhotosynthesisDayArtwork.tsx` generates the fallback diagram, which remains seekable if WebGL is unavailable or its context is lost. No React or Remotion executes inside the composition.

`npm run motion:day:build` regenerates this authoring project and the deployable files in `public/hyperframes/photosynthesis-day`. `npm run build` runs it automatically. Studio edits to generated HTML last until regeneration; retain changes in the source files above.

The Remotion wrapper and original diagram remain available as a reference. The new 3D scene is an intentional visual redesign, so matching its pixels to the former 2D drawing is not a validation target.

## Validation

- HyperFrames snapshots inspect daytime and nighttime geometry, root cutaways, lighting and labels.
- HyperFrames check samples 0, 12, 24, 48, 72 and 92 seconds for lint, runtime, layout and contrast.
- Browser tests inspect the actual 3D canvas, verify advancing/frozen frame state, both growing methods, language changes, every hourly selection, single-hour stop behavior, full-day playback, mobile accessibility, fullscreen and a simulated no-WebGL fallback.

The composition has no audio. Roots and particle motion are teaching illustrations rather than a biological growth forecast.
