'use client';

import { MeshDistortMaterial, Ring, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function FuturisticCore() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * .08;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * .16) * .08;
    }
    if (inner.current) inner.current.rotation.x -= delta * .15;
  });

  return <group ref={group} position={[0,0,-1.15]}>
    <mesh ref={inner} scale={1.05}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial color="#7b6642" emissive="#c9a96e" emissiveIntensity={.45} roughness={.18} metalness={.82} distort={.24} speed={1.1} transparent opacity={.28} wireframe />
    </mesh>
    <mesh scale={.78}><icosahedronGeometry args={[1,2]} /><meshBasicMaterial color="#c9a96e" wireframe transparent opacity={.13}/></mesh>
    <Ring args={[1.48,1.5,160]} rotation={[Math.PI/2.15,0,.35]}><meshBasicMaterial color="#c9a96e" transparent opacity={.48} side={THREE.DoubleSide}/></Ring>
    <Ring args={[1.82,1.835,160]} rotation={[Math.PI/2.7,.8,-.2]}><meshBasicMaterial color="#b6c8c9" transparent opacity={.2} side={THREE.DoubleSide}/></Ring>
    <Ring args={[2.25,2.26,160]} rotation={[.35,1.1,.8]}><meshBasicMaterial color="#c9a96e" transparent opacity={.12} side={THREE.DoubleSide}/></Ring>
    <Sparkles count={70} scale={[5,4,3]} size={1.4} speed={.24} opacity={.38} color="#c9a96e" />
    <pointLight color="#c9a96e" intensity={18} distance={7}/>
  </group>;
}
