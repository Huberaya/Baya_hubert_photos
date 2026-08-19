'use client';

import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

type FloatingPhoto = { src: string; p: [number, number, number]; r: [number, number, number]; s: [number, number] };
const photos: FloatingPhoto[] = [
  { src:'/images/editorial/portrait.webp', p:[-3.15,.65,-1.25], r:[0,.34,-.055], s:[1.08,1.62] },
  { src:'/images/editorial/fashion.webp', p:[2.8,.82,-1.55], r:[0,-.3,.055], s:[1.08,1.62] },
  { src:'/images/editorial/wedding.webp', p:[-1.72,-1.35,-.45], r:[0,.2,.03], s:[1.06,1.58] },
  { src:'/images/editorial/event.webp', p:[1.55,-1.24,-.72], r:[0,-.18,-.035], s:[1.72,1.14] },
  { src:'/images/editorial/architecture.webp', p:[.05,1.4,-2.5], r:[0,.03,0], s:[1.92,1.08] },
];

function PhotoPlane({ item, index }: { item: FloatingPhoto; index: number }) {
  const texture = useTexture(item.src);
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.y = item.p[1] + Math.sin(state.clock.elapsedTime*.22 + index*1.7) * .09;
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, item.p[2] + (hover ? .6 : 0), 4, delta);
    const target = hover ? 1.08 : 1;
    ref.current.scale.x = THREE.MathUtils.damp(ref.current.scale.x, target, 5, delta);
    ref.current.scale.y = THREE.MathUtils.damp(ref.current.scale.y, target, 5, delta);
  });
  return <group position={item.p} rotation={item.r}>
    <mesh ref={ref} onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} onPointerOut={() => setHover(false)}>
      <planeGeometry args={item.s} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    <mesh position={[0,0,-.025]} scale={[1.04,1.04,1]}><planeGeometry args={item.s}/><meshBasicMaterial color="#c9a96e" transparent opacity={hover?.2:.045}/></mesh>
  </group>;
}

export default function FloatingImages() {
  return <group>{photos.map((item,i)=><PhotoPlane key={item.src} item={item} index={i}/>)}</group>;
}
