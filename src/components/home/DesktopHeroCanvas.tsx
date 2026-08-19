'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Scene from '@/components/three/Scene';

export default function DesktopHeroCanvas() {
  return <Canvas dpr={1} camera={{ position:[0,0,7.4], fov:48 }} frameloop="always" gl={{ antialias:false, alpha:true, powerPreference:'high-performance', precision:'mediump' }}>
    <Suspense fallback={null}><Scene/></Suspense>
  </Canvas>;
}
