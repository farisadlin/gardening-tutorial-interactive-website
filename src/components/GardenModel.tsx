import { useEffect, useRef, type RefObject } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import HydroHardware from './HydroHardware';
import type { HydroSystemId } from '../data/hydroSystems';
import { scenePresets } from './sceneConfig';
import { b, type Crop, type Language, type Method, type Stage } from '../data/garden';
export type ModelAction = 'reset' | 'left' | 'right' | 'in' | 'out';
export interface ModelProps { preview?: boolean; crop: Crop; systemId?: HydroSystemId; method: Method; stage: Stage; language: Language; cutaway: boolean; onHotspot: (key: string) => void; command: { action: ModelAction; serial: number }; onFailure: () => void; portal: RefObject<HTMLDivElement | null> }
function CameraControls({ command, wide, preview }: Pick<ModelProps, 'command' | 'preview'> & { wide: boolean }) {
  const ref = useRef<OrbitControlsType>(null);
  const { camera } = useThree();
  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    if (command.action === 'reset') { camera.position.set(preview ? (wide ? 5 : 4) : wide ? 4 : 3, preview ? 3.4 : wide ? 3 : 2.4, preview ? (wide ? 6.5 : 5.5) : wide ? 5.2 : 4); controls.target.set(0, preview ? 1.25 : wide ? 1 : .65, 0); }
    else {
      const offset = camera.position.clone().sub(controls.target);
      if (command.action === 'left' || command.action === 'right') offset.applyAxisAngle(new Vector3(0, 1, 0), command.action === 'left' ? -.35 : .35);
      else offset.multiplyScalar(command.action === 'in' ? .8 : 1.25).clampLength(3, 10);
      camera.position.copy(controls.target).add(offset);
    }
    controls.update();
  }, [camera, command, wide, preview]);
  return <OrbitControls ref={ref} target={[0, preview ? 1.25 : wide ? 1 : .65, 0]} minDistance={3} maxDistance={10} maxPolarAngle={Math.PI / 2.05} enablePan={false} makeDefault/>;
}
function Plant({ crop, growth, warning }: { crop: Crop; growth: number; warning: boolean }) {
  if (!growth) return null;
  const chives = crop.id === 'chives';
  const tall = ['water-spinach', 'amaranth', 'chilli'].includes(crop.id);
  const leafCount = chives ? 17 : crop.id === 'lettuce' ? 16 : 10;
  return <group position={[0, .85, 0]} scale={[growth, growth, growth]}>
    {!chives && <mesh position={[0, tall ? .7 : .3, 0]}><cylinderGeometry args={[.025, .055, tall ? 1.4 : .6, 8]}/><meshStandardMaterial color="#6b8e48"/></mesh>}
    {Array.from({ length: leafCount }, (_, i) => {
      const angle = i * 2.399;
      const spread = .22 + i % 3 * .14;
      return chives ? <mesh key={i} position={[Math.sin(angle) * .16, .58 + i % 4 * .1, Math.cos(angle) * .16]} rotation={[Math.sin(angle) * .15, 0, Math.cos(angle) * .15]}><cylinderGeometry args={[.012, .022, 1.25 + i % 4 * .15, 7]}/><meshStandardMaterial color={i % 2 ? '#507b36' : '#74964a'}/></mesh> : <group key={i} rotation={[0, angle, 0]} position={[0, tall ? .3 + i * .1 : .06 + i % 3 * .13, 0]}>
        <mesh position={[spread, .18, 0]} rotation={[0, 0, -.7]}><cylinderGeometry args={[.015, .025, spread * 2, 6]}/><meshStandardMaterial color={crop.id === 'pak-choi' ? '#ccdcb2' : '#799449'}/></mesh>
        <mesh position={[spread * 1.9, .45, 0]} rotation={[.2, 0, -.6]} scale={[crop.id === 'water-spinach' ? .17 : crop.id === 'lettuce' ? .38 : .28, .46 + i % 3 * .07, .08]}><sphereGeometry args={[1, crop.id === 'lettuce' ? 9 : 16, 12]}/><meshStandardMaterial color={warning && i === 0 ? '#bdad58' : i % 2 ? '#4c7b35' : '#70954a'} roughness={.75}/></mesh>
      </group>;
    })}
    {crop.id === 'chilli' && growth > .6 && [0, 1, 2].map(i => <mesh key={i} position={[Math.cos(i * 2) * .42, .7 + i * .2, Math.sin(i * 2) * .42]} rotation={[0, 0, .3]} scale={[.08, .24, .08]}><sphereGeometry args={[1, 12, 12]}/><meshStandardMaterial color={growth < 1 ? '#639047' : '#bd5037'}/></mesh>)}
  </group>;
}
function SoilSetup(props: ModelProps) {
  const { crop, method, stage, language, cutaway, onHotspot } = props;
  const soil = method === 'soil';
  const { growth, focus } = scenePresets[stage];
  const solutionTop = ['prepare', 'sow', 'transplant'].includes(stage) ? .63 : .43;
  const theta = cutaway ? Math.PI : Math.PI * 2;
  const thetaStart = cutaway ? Math.PI / 2 : 0;
  const highlight = '#b79749';
  return <group>
    <mesh position={[0, -.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[1.65, 64]}/><meshStandardMaterial color="#e5e8da"/></mesh>
    <mesh position={[0, .36, 0]} castShadow><cylinderGeometry args={[.88, soil ? .65 : .88, .75, 48, 1, true, thetaStart, theta]}/><meshStandardMaterial color={focus === 'container' ? soil ? '#c88959' : '#5c7d67' : soil ? '#b77855' : '#547161'} side={2} roughness={.8}/></mesh>
    <mesh position={[0, 0, 0]}><cylinderGeometry args={[soil ? .65 : .88, soil ? .65 : .88, .035, 48]}/><meshStandardMaterial color={soil ? '#a76e4e' : '#47634f'}/></mesh>
    <>
      <mesh position={[0, .39, 0]}><cylinderGeometry args={[.84, .66, .65, 48, 1, false, thetaStart, theta]}/><meshStandardMaterial color="#61503c" roughness={1}/></mesh>
      <mesh position={[0, .76, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.87, .048, 8, 48, theta]}/><meshStandardMaterial color="#d9a07a"/></mesh>
      {cutaway && [-.4, 0, .4].map(x => <mesh key={x} position={[x, .05, .3]}><sphereGeometry args={[.045, 8, 8]}/><meshStandardMaterial color="#232f23"/></mesh>)}
    </>
    {(stage === 'sow' || stage === 'transplant') && <group position={[stage === 'sow' ? 1.13 : 0, stage === 'sow' ? .15 : .75, .2]}>
      <mesh><boxGeometry args={[.29, .22, .29]}/><meshStandardMaterial color="#9a8d60"/></mesh>
      {stage === 'sow' && <mesh position={[0, .12, 0]}><sphereGeometry args={[.045, 10, 8]}/><meshStandardMaterial color={highlight}/></mesh>}
    </group>}
    {growth > 0 && cutaway && Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * (.07 + i % 3 * .06), .45 - i % 3 * .055, .18 + Math.cos(i * 2.4) * .12]} rotation={[0, 0, Math.sin(i) * .35]}><cylinderGeometry args={[.006, .014, .28 + growth * .38, 6]}/><meshStandardMaterial color={focus === 'roots' ? '#ead8a2' : '#d8cba9'}/></mesh>)}
    <Plant crop={crop} growth={growth} warning={stage === 'troubleshoot'}/>
    {[
      { key: 'container', position: [-.9, .5, .5] as [number, number, number], label: b('Drainage', 'Drainase') },
      { key: 'roots', position: [.43, .42, .55] as [number, number, number], label: b('Root zone', 'Zona akar') },
      { key: stage === 'sow' ? 'seed' : 'leaves', position: (stage === 'sow' ? [1.13, .42, .2] : [.5, .94 + growth * .8, .3]) as [number, number, number], label: stage === 'sow' ? b('Seed plug', 'Media semai') : b('Growing point', 'Titik tumbuh') },
    ].filter(h => stage !== 'prepare' || h.key !== 'leaves').map(h => <Html key={h.key} portal={props.portal as RefObject<HTMLElement>} position={h.position} center zIndexRange={[10, 0]}><button className={`model-hotspot ${focus === h.key ? 'highlighted' : ''}`} onClick={() => onHotspot(h.key)}>{h.label[language]}<span>+</span></button></Html>)}
  </group>;
}
export default function GardenModel(props: ModelProps) {
  const wide = ['nft', 'dft', 'drip'].includes(props.systemId || '');
  return <Canvas shadows dpr={[1, 1.5]} frameloop="demand" camera={{ position: [3, 2.4, 4], fov: 32 }} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', props.onFailure, { once: true }); }} role="group" aria-label={b('Interactive gardening model', 'Model berkebun interaktif')[props.language]}>
    <color attach="background" args={['#eef0e5']}/>
    <ambientLight intensity={1.4}/><directionalLight position={[3, 7, 4]} intensity={2.3} castShadow shadow-mapSize={[1024, 1024]}/>
    {props.method === 'soil' ? <SoilSetup {...props}/> : <HydroHardware {...props} plant={<Plant crop={props.crop} growth={scenePresets[props.stage].growth} warning={props.stage === 'troubleshoot'}/>}/>}<CameraControls command={props.command} wide={wide} preview={props.preview}/>
  </Canvas>;
}
