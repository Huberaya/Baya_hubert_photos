'use client';

import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import Scene from '@/components/three/Scene';
import SplitText from '@/components/ui/SplitText';

export default function Hero3D() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const update = () => setDesktop(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update);
  }, []);
  return <section className="noise vignette relative h-[100svh] min-h-[680px] overflow-hidden bg-black" aria-label="Introduction immersive">
    <div className="absolute inset-0">{desktop ? <Canvas dpr={[1,1.5]} camera={{ position:[0,0,6.5], fov:50 }} gl={{ antialias:true, alpha:false, powerPreference:'high-performance' }}><Suspense fallback={null}><Scene/></Suspense></Canvas> : <><Image src="/images/hubert/hubert-01.webp" alt="Photographie artistique par Hubert Baya" fill priority sizes="100vw" className="object-cover opacity-65"/><div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black"/></>}</div>
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
      <p className="mb-5 text-[8px] uppercase tracking-[.5em] text-[#c9a96e] md:text-[10px]">Paris · France · Disponible partout</p>
      <h1 className="font-serif text-[clamp(3.5rem,10.8vw,11rem)] font-normal leading-[.78] tracking-[-.065em] text-[#f3f0e8]"><SplitText text="HUBERT BAYA" /></h1>
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:1.45,duration:1}} className="mt-7 flex items-center gap-4"><span className="h-px w-8 bg-[#c9a96e]"/><p className="text-[9px] uppercase tracking-[.35em] text-white/65 md:text-[11px]">Photographe — Capturer l'émotion</p><span className="h-px w-8 bg-[#c9a96e]"/></motion.div>
    </div>
    <motion.a href="#introduction" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.9}} className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3" aria-label="Découvrir le site"><span className="text-[7px] uppercase tracking-[.36em] text-white/50">Découvrir mon univers</span><motion.span animate={{y:[0,7,0]}} transition={{duration:2,repeat:Infinity}}><ArrowDown size={14} className="text-[#c9a96e]"/></motion.span></motion.a>
    <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-3 md:flex"><span className="vertical-rl text-[7px] tracking-[.35em] text-white/35">SCROLL</span><span className="h-20 w-px bg-gradient-to-b from-[#c9a96e] to-transparent"/></div>
  </section>;
}
