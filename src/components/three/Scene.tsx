'use client';

import { Float } from '@react-three/drei';
import CameraRig from './CameraRig';
import FloatingImages from './FloatingImages';
import Particles from './Particles';
import FuturisticCore from './FuturisticCore';

export default function Scene() {
  return <>
    <color attach="background" args={['#050505']} />
    <fog attach="fog" args={['#050505', 5, 13]} />
    <ambientLight intensity={.25} />
    <spotLight position={[0,5,4]} angle={.45} penumbra={1} intensity={18} color="#d7bd8c" />
    <FuturisticCore />
    <Float speed={.35} rotationIntensity={.025} floatIntensity={.1}><FloatingImages /></Float>
    <Particles count={240} />
    <CameraRig />
  </>;
}
