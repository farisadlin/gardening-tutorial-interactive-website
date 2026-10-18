import * as THREE from 'three';

type DaySceneBridge = Window & {
  __day3D?: { renderAt: (time: number) => void };
  __timelines?: Record<string, { time: () => number }>;
  __hfThreeTime?: number;
  dayData?: { hour: number; daylight: number; title: { en: string; id: string } }[];
};
const bridge = window as DaySceneBridge;
const stage = document.getElementById('stage')!;
const canvas = document.getElementById('day3d-canvas') as HTMLCanvasElement;
const overlay = document.getElementById('day3d-overlay')!;
const language = stage.dataset.language === 'id' ? 'id' : 'en';
const hydro = stage.dataset.method === 'hydro';
const t = (en: string, id: string) => language === 'en' ? en : id;
const material = (color: string, roughness = .72) => new THREE.MeshStandardMaterial({ color, roughness, side: THREE.DoubleSide });
const vector = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function buildScene() {
  const entries = bridge.dayData || [];
  if (!entries || entries.length !== 24) throw new Error('Missing day-cycle data');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(1000, 660, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#cbd5df', 12, 28);
  const camera = new THREE.PerspectiveCamera(32, 1000 / 660, .1, 80);
  camera.position.set(5.3, 4.1, 8.7);
  camera.lookAt(.2, 1.9, 0);
  camera.setViewOffset(1000, 660, -105, 0, 1000, 660);
  const hemisphere = new THREE.HemisphereLight('#eff7ff', '#75674a', 2.2);
  scene.add(hemisphere);
  const key = new THREE.DirectionalLight('#fff2c8', 3);
  key.position.set(-3, 7, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5; key.shadow.camera.right = 5;
  key.shadow.camera.top = 7; key.shadow.camera.bottom = -4;
  key.shadow.normalBias = .035;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#bfdaf8', 2);
  rim.position.set(4, 5, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight('#dfe9dd', .7);
  fill.position.set(-4, 2, 6); scene.add(fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), material('#e4e7da'));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.23; ground.receiveShadow = true; scene.add(ground);
  const model = new THREE.Group(); scene.add(model);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.7, .12, 64), material('#d9decc'));
  plinth.position.y = -.13; plinth.receiveShadow = true; model.add(plinth);
  const start = Math.PI / 2;
  const angle = Math.PI;
  const wallMaterial = material(hydro ? '#598b82' : '#b97852', .55);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(1.13, hydro ? 1.1 : .87, 1.45, 64, 1, true, start, angle), wallMaterial);
  wall.position.y = .68; wall.castShadow = true; wall.receiveShadow = true; model.add(wall);
  const bottom = new THREE.Mesh(new THREE.CylinderGeometry(hydro ? 1.1 : .87, hydro ? 1.1 : .87, .07, 64), wallMaterial);
  bottom.position.y = -.015; model.add(bottom);
  const rimPoints = Array.from({ length: 65 }, (_, i) => {
    const a = start + i / 64 * angle;
    return vector(Math.sin(a) * 1.135, 1.405, Math.cos(a) * 1.135);
  });
  const lip = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPoints), 64, .055, 8, false), material(hydro ? '#a7c9ba' : '#e0a77c'));
  model.add(lip);
  if (hydro) {
    const water = new THREE.Mesh(new THREE.CylinderGeometry(1.04, 1.04, .82, 64), new THREE.MeshPhysicalMaterial({ color: '#8bcecb', transparent: true, opacity: .23, roughness: .15, depthWrite: false, side: THREE.DoubleSide }));
    water.position.y = .45; model.add(water);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.11, 1.11, .1, 64, 1, false, start, angle), material('#50725b'));
    lid.position.y = 1.39; model.add(lid);
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(.25, .15, .22, 32), material('#7a6950'));
    plug.position.y = 1.37; model.add(plug);
    const stone = new THREE.Mesh(new THREE.CapsuleGeometry(.09, .28, 4, 12), material('#556d70'));
    stone.rotation.z = Math.PI / 2; stone.position.set(.65, .15, .3); model.add(stone);
  } else {
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(1.065, .84, 1.31, 64, 1, false, start, angle), material('#554631', 1));
    soil.position.y = .66; soil.receiveShadow = true; model.add(soil);
    const soilGrain = new THREE.SphereGeometry(.025, 5, 4);
    for (let i = 0; i < 48; i++) {
      const phi = start + (i * 2.399 % angle);
      const radius = .28 + (i % 7) * .11;
      const grain = new THREE.Mesh(soilGrain, material(i % 3 ? '#86734c' : '#b3a17b'));
      grain.position.set(Math.sin(phi) * radius, 1.32, Math.cos(phi) * radius); model.add(grain);
    }
  }
  const rootMat = material('#e9d7ac');
  function tube(points: THREE.Vector3[], radius: number, mat: THREE.Material, parent: THREE.Group = model) {
    const curve = new THREE.CatmullRomCurve3(points);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius, 6, false), mat);
    mesh.castShadow = true; parent.add(mesh); return curve;
  }
  const rootCurves: THREE.CatmullRomCurve3[] = [];
  for (let i = 0; i < 11; i++) {
    const a = -.65 + i * .16;
    const spread = .45 + i % 4 * .12;
    const curve = tube([vector(0, 1.39, 0), vector(Math.sin(a) * .2, 1.05, .16), vector(Math.sin(a) * spread, .55, Math.cos(a) * spread), vector(Math.sin(a) * (spread + .1), .12 + i % 3 * .06, Math.cos(a) * (spread + .1))], .018 + i % 3 * .004, rootMat);
    rootCurves.push(curve);
    for (const v of [.5, .72]) {
      const p = curve.getPoint(v);
      tube([p, p.clone().add(vector(i % 2 ? .15 : -.15, -.08, .05)), p.clone().add(vector(i % 2 ? .25 : -.25, -.18, .1))], .008, rootMat);
    }
  }
  const plant = new THREE.Group(); plant.position.y = 1.38; model.add(plant);
  tube([vector(0, 0, 0), vector(-.03, .85, 0), vector(.03, 1.7, .02), vector(0, 2.24, 0)], .042, material('#5e8145'), plant);
  const leafGroups: THREE.Group[] = [];
  function leafGeometry(length: number, width: number) {
    const positions: number[] = []; const indices: number[] = [];
    const rows = 20, columns = 10;
    for (let j = 0; j <= rows; j++) {
      const s = j / rows;
      for (let k = 0; k <= columns; k++) {
        const u = k / columns * 2 - 1;
        positions.push(u * width * Math.pow(Math.sin(Math.PI * s), .8), s * length, Math.sin(Math.PI * s) * length * .10 + u * u * .06);
        if (j < rows && k < columns) {
          const a = j * (columns + 1) + k;
          indices.push(a, a + 1, a + columns + 1, a + 1, a + columns + 2, a + columns + 1);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
  }
  for (let i = 0; i < 8; i++) {
    const fan = new THREE.Group(); fan.position.y = .35 + i * .23;
    fan.rotation.y = i * 2.399; fan.rotation.z = i % 2 ? -.8 : .8;
    const length = 1.18 - i * .045;
    const leaf = new THREE.Mesh(leafGeometry(length, .38 - i * .014), material(i % 3 === 0 ? '#8aa850' : i % 2 ? '#5d8b42' : '#396d3f', .54));
    leaf.castShadow = true; leaf.receiveShadow = true; fan.add(leaf);
    tube([vector(0, 0, .012), vector(0, length * .5, length * .10 + .012), vector(0, length, .012)], .006, material('#b9cb7b'), fan);
    for (let j = 1; j <= 3; j++) for (const side of [-1, 1]) {
      const s = j * .19;
      const w = (.38 - i * .014) * Math.pow(Math.sin(Math.PI * (s + .13)), .8);
      tube([vector(0, s * length, Math.sin(Math.PI * s) * length * .10 + .008), vector(side * w * .6, (s + .08) * length, Math.sin(Math.PI * (s + .08)) * length * .10 + .03), vector(side * w * .87, (s + .16) * length, Math.sin(Math.PI * (s + .16)) * length * .10 + .055)], .0025, material('#a9be75'), fan);
    }
    fan.userData.baseZ = fan.rotation.z; leafGroups.push(fan); plant.add(fan);
  }
  const celestial = new THREE.Mesh(new THREE.SphereGeometry(.21, 24, 16), new THREE.MeshStandardMaterial({ color: '#ead4a2', emissive: '#e0bb61', emissiveIntensity: .6, roughness: 1 }));
  celestial.position.set(-3, 3.5, -.7); scene.add(celestial);
  const rayGroup = new THREE.Group(); scene.add(rayGroup);
  const sunCurve = new THREE.CatmullRomCurve3([vector(-3, 3.5, -.7), vector(-1.2, 3.6, -.5), vector(-.3, 3.0, .2)]);
  const waterCurve = new THREE.CatmullRomCurve3([vector(.4, .25, .45), vector(.08, 1.05, .15), vector(0, 1.8, 0), vector(.03, 2.75, .01)]);
  const sphere = new THREE.SphereGeometry(.036, 10, 8);
  const flow: { mesh: THREE.Mesh; kind: string; index: number }[] = [];
  for (const [kind, count, color] of [['water', 11, '#58a9d5'], ['oxygen', 9, '#9fceb5'], ['light', 7, '#e9c36c']] as const) {
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .38, roughness: .4 });
    for (let i = 0; i < count; i++) { const mesh = new THREE.Mesh(sphere, mat); (kind === 'light' ? rayGroup : model).add(mesh); flow.push({ mesh, kind, index: i }); }
  }
  const moon = new THREE.Color('#cad8ec');
  const sun = new THREE.Color('#edcb77');
  const nightGround = new THREE.Color('#cbd5df');
  const dayGround = new THREE.Color('#e6e5cf');
  function renderAt(time: number) {
    const frame = Math.min(2879, Math.max(0, Math.floor(time * 30 + .000001)));
    const hour = Math.floor(frame / 120);
    const entry = entries[hour];
    const light = entry.daylight;
    const day = light > 0;
    stage.dataset.hour = String(hour);
    canvas.dataset.frame = String(frame);
    model.rotation.y = -.13 + Math.sin(time / 13) * .045;
    plant.rotation.z = Math.sin(time * 1.2) * .014;
    leafGroups.forEach((leaf, i) => { leaf.rotation.z = leaf.userData.baseZ + Math.sin(time * 1.35 + i * .8) * .025; });
    hemisphere.intensity = 1.45 + light * .95;
    key.intensity = 1.1 + light * 2.4;
    key.color.set(day ? '#fff0ca' : '#d4e4ff');
    rim.intensity = day ? 1.3 : 2;
    (ground.material as THREE.MeshStandardMaterial).color.copy(nightGround).lerp(dayGround, day ? .5 + light * .5 : 0);
    scene.background = nightGround.clone().lerp(dayGround, day ? .5 + light * .5 : 0);
    scene.fog!.color.copy(scene.background as THREE.Color);
    const celestialMat = celestial.material as THREE.MeshStandardMaterial;
    celestialMat.color.copy(day ? sun : moon); celestialMat.emissive.copy(day ? sun : moon); celestialMat.emissiveIntensity = day ? .55 : .12;
    rayGroup.visible = day;
    flow.forEach(({ mesh, kind, index }) => {
      const p = ((time * (kind === 'water' ? .18 : .24) + index * .127) % 1 + 1) % 1;
      if (kind === 'water') mesh.position.copy(waterCurve.getPoint(p));
      else if (kind === 'light') mesh.position.copy(sunCurve.getPoint(p));
      else { mesh.position.copy(rootCurves[index % rootCurves.length].getPoint(1 - p)); mesh.position.x += .065 * Math.sin(index * 2.1); }
    });
    document.getElementById('day3d-clock')!.textContent = `${String(hour).padStart(2, '0')}:00`;
    document.getElementById('day3d-title')!.textContent = entry.title[language];
    document.getElementById('day3d-photo-status')!.textContent = day ? t('Light available', 'Cahaya tersedia') : t('Inactive without light', 'Tidak aktif tanpa cahaya');
    overlay.dataset.light = day ? 'day' : 'night';
    renderer.render(scene, camera);
  }
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); stage.dataset.dimension = '2'; canvas.hidden = true; overlay.hidden = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    canvas.hidden = false; overlay.hidden = false; stage.dataset.dimension = '3'; renderAt(bridge.__timelines?.['photosynthesis-day']?.time() || 0);
  });
  window.addEventListener('pagehide', () => { renderer.dispose(); renderer.forceContextLoss(); });
  bridge.__day3D = { renderAt };
  window.addEventListener('hf-seek', event => renderAt((event as CustomEvent<{ time: number }>).detail.time));
  renderAt(bridge.__timelines?.['photosynthesis-day']?.time() || bridge.__hfThreeTime || 0);
  canvas.hidden = false; overlay.hidden = false; stage.dataset.dimension = '3';
}
try { buildScene(); } catch {
  // Keep the seekable diagram usable on devices without WebGL.
  stage.dataset.dimension = '2'; canvas.hidden = true; overlay.hidden = true;
}
