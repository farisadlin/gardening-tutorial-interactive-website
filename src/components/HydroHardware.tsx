import { useMemo, type ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { CatmullRomCurve3, Vector3 } from 'three';
import type { RefObject } from 'react';
import type { ModelProps } from './GardenModel';
import { hydroSystems } from '../data/hydroSystems';
import { b } from '../data/garden';
import { scenePresets } from './sceneConfig';
type Point = [number, number, number];
function Tube({ points, color = '#718568', radius = .025 }: { points: Point[]; color?: string; radius?: number }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map(p => new Vector3(...p))), [JSON.stringify(points)]);
  return <mesh><tubeGeometry args={[curve, 32, radius, 8, false]}/><meshStandardMaterial color={color} roughness={.7}/></mesh>;
}
function Box({ position, size, color, translucent = false }: { position: Point; size: Point; color: string; translucent?: boolean }) { return <mesh position={position} castShadow><boxGeometry args={size}/><meshStandardMaterial color={color} transparent={translucent} opacity={translucent ? .58 : 1} roughness={translucent ? .3 : .8}/></mesh>; }
function NetPot({ position }: { position: Point }) { return <mesh position={position}><cylinderGeometry args={[.18, .12, .2, 14, 1, true]}/><meshStandardMaterial color="#455844" wireframe/></mesh>; }
function Roots({ position, length, spread = .12 }: { position: Point; length: number; spread?: number }) { return <group position={position}>{Array.from({ length: 9 }, (_, i) => <Tube key={i} radius={.008} color="#e8d5a8" points={[[Math.sin(i * 2.4) * .06, 0, Math.cos(i * 2.4) * .06], [Math.sin(i) * spread, -length * .5, Math.cos(i) * spread], [Math.sin(i * 2) * spread, -length, Math.cos(i * 2) * spread]]}/>)}</group>; }
function Bubbles({ position }: { position: Point }) { return <group position={position}><mesh><sphereGeometry args={[.07, 12, 8]}/><meshStandardMaterial color="#61808a"/></mesh>{Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[Math.sin(i) * .055, .08 + i * .04, Math.cos(i) * .055]}><sphereGeometry args={[.014, 8, 8]}/><meshStandardMaterial color="#e0f4de"/></mesh>)}</group>; }
function Tank({ position = [0, 0, 0], cutaway, water = .4 }: { position?: Point; cutaway: boolean; water?: number }) { return <group position={position}><mesh position={[0, .3, 0]}><cylinderGeometry args={[.8, .8, .6, 40, 1, true, cutaway ? Math.PI / 2 : 0, cutaway ? Math.PI : Math.PI * 2]}/><meshStandardMaterial color="#5b7b67" side={2}/></mesh><mesh position={[0, .015, 0]}><cylinderGeometry args={[.8, .8, .03, 40]}/><meshStandardMaterial color="#4c6654"/></mesh><mesh position={[0, water / 2 + .03, 0]}><cylinderGeometry args={[.77, .77, water, 40]}/><meshStandardMaterial color="#93c6b7" transparent opacity={.6}/></mesh></group>; }
export default function HydroHardware({ plant, ...props }: ModelProps & { plant: ReactNode }) {
  const { crop, stage, cutaway, language, onHotspot } = props;
  const system = hydroSystems.find(s => s.id === props.systemId)!;
  const id = system.id;
  const channel = id === 'nft' || id === 'dft';
  const medium = id === 'wick' || id === 'drip';
  const { growth, focus } = scenePresets[stage];
  const seedPosition: Point = channel ? [-1.5, .2, .6] : [1.1, .2, .65];
  const labels = [
    { key: 'container', label: b('Reservoir', 'Tandon'), position: (channel ? [-.85, .35, .55] : id === 'drip' ? [1.55, .3, .5] : [-.85, .35, .4]) as Point },
    { key: 'roots', label: system.rootLabel, position: (channel ? [.1, 1.07, .42] : medium ? [.45, 1, .38] : [.37, .37, .5]) as Point },
    { key: stage === 'sow' ? 'seed' : 'leaves', label: stage === 'sow' ? b('Seed plug', 'Media semai') : b('Growing point', 'Titik tumbuh'), position: (stage === 'sow' ? [seedPosition[0], seedPosition[1] + .18, seedPosition[2]] : channel ? [.3, 1.45 + growth * .5, .25] : medium ? [.4, 1.45 + growth * .5, .2] : [.4, .94 + growth * .8, .25]) as Point },
  ];
  return <group>
    <mesh position={[0, -.035, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[channel ? 2.45 : id === 'drip' ? 2.1 : 1.7, 64]}/><meshStandardMaterial color="#e5e8da"/></mesh>
    {channel ? <>
      <Tank cutaway={cutaway} water={.4}/>
      <group rotation={[0, 0, id === 'nft' ? -.025 : 0]}>
      <Box position={[0, .98, 0]} size={[3.65, .07, .68]} color="#788c72"/>
      <Box position={[0, 1.16, -.35]} size={[3.65, .35, .045]} color="#718970"/>
      {!cutaway && <Box position={[0, 1.16, .35]} size={[3.65, .35, .045]} color="#718970"/>}
      <Box position={[-1.81, 1.16, 0]} size={[.045, .35, .7]} color="#718970"/><Box position={[1.81, 1.16, 0]} size={[.045, .35, .7]} color="#718970"/>
      <Box position={[0, id === 'nft' ? 1.03 : 1.1, 0]} size={[3.57, id === 'nft' ? .025 : .17, .64]} color="#91c6b7" translucent/>
      <Box position={[0, 1.35, -.19]} size={[3.65, .045, .32]} color="#d5ddbd"/>{!cutaway && <Box position={[0, 1.35, .18]} size={[3.65, .045, .35]} color="#d5ddbd"/>}
      {[-1.3, 0, 1.3].map((x, i) => <group key={x}><NetPot position={[x, 1.29, 0]}/><group position={[x, .8, 0]} scale={[.65, .65, .65]}>{plant}</group>{growth > 0 && cutaway && <Roots position={[x, 1.25, .08]} length={id === 'nft' ? .19 : .27} spread={.13 + growth * .08}/>}{stage !== 'prepare' && <mesh position={[x, 1.32, 0]}><boxGeometry args={[.16, .16, .16]}/><meshStandardMaterial color="#9a8f68"/></mesh>}</group>)}
      </group>
      {[-1.45, 1.45].map(x => <Box key={x} position={[x, .51, -.17]} size={[.06, .95, .06]} color="#9b9d80"/>)}
      <Tube points={[[-.28, .17, .17], [-1.85, .15, .18], [-1.94, 1.2, .08], [-1.64, 1.22, .06]]}/>
      <Tube points={[[1.63, id === 'dft' ? 1.16 : 1.03, .12], [1.95, 1.06, .13], [1.91, .3, .15], [.5, .3, .2]]}/>
      <Box position={[-.28, .11, .18]} size={[.19, .15, .18]} color="#405e53"/>
      {[-.65, .65].map(x => <mesh key={x} position={[x, id === 'dft' ? 1.21 : 1.08, .2]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[.035, .12, 8]}/><meshStandardMaterial color="#417b69"/></mesh>)}
      {id === 'dft' && <><Box position={[-1.28, .1, .56]} size={[.32, .15, .2]} color="#78856e"/><Tube points={[[-1.28, .12, .56], [-.55, .12, .4], [.25, .08, .19]]} color="#c2b99b" radius={.015}/><Bubbles position={[.25, .1, .2]}/></>}
    </> : medium ? <>
      {id === 'wick' ? <Tank cutaway={cutaway} water={.38}/> : <><Tank position={[1.3, 0, 0]} cutaway={cutaway} water={.38}/><Box position={[1.15, .12, .15]} size={[.18, .14, .15]} color="#405e53"/></>}
      <mesh position={[0, .98, 0]}><cylinderGeometry args={[.61, .48, .58, 40, 1, true, cutaway ? Math.PI / 2 : 0, cutaway ? Math.PI : Math.PI * 2]}/><meshStandardMaterial color="#bd8b64" side={2}/></mesh>
      <mesh position={[0, .73, 0]}><cylinderGeometry args={[.48, .48, .04, 40]}/><meshStandardMaterial color="#9a744f"/></mesh>
      <mesh position={[0, 1.01, 0]}><cylinderGeometry args={[.57, .47, .49, 40, 1, false, cutaway ? Math.PI / 2 : 0, cutaway ? Math.PI : Math.PI * 2]}/><meshStandardMaterial color="#9d8a60"/></mesh>
      <group position={[0, .42, 0]}>{plant}</group>{growth > 0 && cutaway && <Roots position={[0, 1.17, .12]} length={.34}/>}
      {id === 'wick' ? <>{[-.18, .18].map(x => <Tube key={x} points={[[x, 1.03, .08], [x, .72, .14], [x, .4, .16], [x, .21, .16]]} radius={.027} color="#e3d4a2"/>)}</> : <>
        <Tube points={[[1.2, .17, .12], [1.6, .18, -.15], [1.6, 1.65, -.18], [.4, 1.68, -.14], [.3, 1.34, .08]]} color="#536f50"/>
        <mesh position={[.3, 1.34, .08]}><cylinderGeometry args={[.035, .035, .1, 8]}/><meshStandardMaterial color="#405b42"/></mesh>
        {[0, 1, 2].map(i => <mesh key={i} position={[.3, 1.24 - i * .065, .08]}><sphereGeometry args={[.012, 8, 8]}/><meshStandardMaterial color="#75b5a6"/></mesh>)}
        <Tube points={[[0, .7, .1], [0, .5, .12], [.7, .22, .15], [1.35, .22, .15]]} color="#9f9f7e"/>
        {[-.55, .55].map(x => <Box key={x} position={[x, .37, -.1]} size={[.055, .67, .06]} color="#93987a"/>)}
        {crop.id === 'chilli' && <Box position={[-.24, 1.55, -.1]} size={[.03, 1.85, .03]} color="#a69a70"/>}
      </>}
    </> : <>
      <Tank cutaway={cutaway} water={id === 'kratky' ? (['prepare', 'sow', 'transplant'].includes(stage) ? .54 : .36) : .48}/>
      <mesh position={[0, .66, 0]}><cylinderGeometry args={[.8, .8, .045, 40, 1, false, cutaway ? Math.PI / 2 : 0, cutaway ? Math.PI : Math.PI * 2]}/><meshStandardMaterial color="#d4dbbc"/></mesh>
      <NetPot position={[0, .64, 0]}/><group position={[0, -.13, 0]}>{plant}</group>
      {growth > 0 && cutaway && <Roots position={[0, .58, .13]} length={.25 + growth * .14}/>}
      {id === 'dwc' && <><Bubbles position={[.35, .1, .12]}/><Box position={[1.12, .09, 0]} size={[.34, .16, .23]} color="#78846e"/><Tube points={[[1.02, .1, 0], [.75, .08, .18], [.35, .1, .12]]} color="#c8be9d" radius={.015}/></>}
      {stage === 'transplant' && <mesh position={[0, .69, 0]}><boxGeometry args={[.18, .2, .18]}/><meshStandardMaterial color="#9a8f68"/></mesh>}
    </>}
    {stage === 'sow' && <group position={seedPosition}><Box position={[0, 0, 0]} size={[.22, .18, .22]} color="#9d916d"/><mesh position={[0, .095, 0]}><sphereGeometry args={[.025, 8, 8]}/><meshStandardMaterial color="#d8b968"/></mesh></group>}
    {labels.filter(label => stage !== 'prepare' || label.key !== 'leaves').map(label => <Html key={label.key} portal={props.portal as RefObject<HTMLElement>} position={label.position} center zIndexRange={[10, 0]}><button className={`model-hotspot ${focus === label.key ? 'highlighted' : ''}`} onClick={() => onHotspot(label.key)}>{label.label[language]}<span>+</span></button></Html>)}
  </group>;
}
