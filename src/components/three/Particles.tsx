'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function Particles({ count = 380 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i=0;i<count;i++) { p[i*3]=(Math.random()-.5)*13; p[i*3+1]=(Math.random()-.5)*8; p[i*3+2]=(Math.random()-.5)*7; }
    return p;
  }, [count]);
  useFrame((state) => { if (ref.current) { ref.current.rotation.y = state.clock.elapsedTime * .012; ref.current.rotation.x = Math.sin(state.clock.elapsedTime*.08)*.02; } });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]} /></bufferGeometry><pointsMaterial color="#c9a96e" size={.018} transparent opacity={.58} sizeAttenuation depthWrite={false} /></points>;
}
