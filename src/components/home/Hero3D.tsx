'use client';

import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { ArrowDown, Aperture, MoveDownRight } from 'lucide-react';
import Scene from '@/components/three/Scene';
import SplitText from '@/components/ui/SplitText';

export default function Hero3D() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const update = () => setDesktop(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update);
  }, []);

  return <section className="noise relative h-[100svh] min-h-[720px] overflow-hidden bg-[#020303]" aria-label="Hubert Baya, laboratoire photographique">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(201,169,110,.1),transparent_31%),radial-gradient(circle_at_82%_12%,rgba(116,174,180,.08),transparent_24%)]"/>
    <div className="future-grid absolute inset-0 opacity-35"/>
    <div className="absolute inset-0">{desktop ? <Canvas dpr={[1,1.45]} camera={{ position:[0,0,7.4], fov:48 }} gl={{ antialias:true, alpha:true, powerPreference:'high-performance' }}><Suspense fallback={null}><Scene/></Suspense></Canvas> : <><Image src="/images/editorial/hero-gold.webp" alt="Matière photographique dorée" fill priority sizes="100vw" className="object-cover opacity-60"/><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,.85))]"/></>}</div>

    <div className="pointer-events-none absolute inset-x-5 top-24 z-10 flex items-center justify-between border-b border-white/10 pb-4 md:inset-x-10 md:top-28">
      <div className="flex items-center gap-3"><span className="status-dot"/><span className="text-[7px] uppercase tracking-[.32em] text-white/50">Optical system online</span></div>
      <div className="hidden items-center gap-8 text-[7px] uppercase tracking-[.28em] text-white/35 sm:flex"><span>48.8566° N</span><span>02.3522° E</span><span>Paris / 2026</span></div>
      <span className="text-[7px] tracking-[.25em] text-[#c9a96e]">HB—001</span>
    </div>

    <div className="relative z-10 flex h-full flex-col justify-center px-5 pt-10 md:px-10">
      <div className="mx-auto w-full max-w-[1540px]">
        <motion.div initial={{opacity:0,x:-40}} animate={{opacity:1,x:0}} transition={{delay:.35,duration:1}} className="mb-3 flex items-center gap-4"><Aperture size={15} className="animate-spin-slow text-[#c9a96e]"/><p className="text-[8px] uppercase tracking-[.46em] text-white/48">Photographie augmentée — émotion intacte</p></motion.div>
        <h1 className="font-serif font-normal leading-[.69] tracking-[-.075em] text-[#f3f0e8]">
          <span className="block text-[clamp(4.6rem,13.5vw,14.5rem)]"><SplitText text="HUBERT" /></span>
          <span className="ml-[13vw] block text-[clamp(4.6rem,13.5vw,14.5rem)] text-transparent [-webkit-text-stroke:1px_rgba(243,240,232,.72)]"><SplitText text="BAYA" /></span>
        </h1>
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:1.25,duration:1}} className="mt-10 grid gap-7 border-t border-white/10 pt-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div><p className="max-w-sm text-xs font-light leading-6 text-white/48">Portraits, mouvements et espaces capturés à la frontière entre matière, mémoire et lumière.</p></div>
          <a href="#introduction" className="pointer-events-auto group mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#c9a96e]/55 bg-black/20 backdrop-blur-md transition-all hover:scale-110 hover:bg-[#c9a96e] hover:text-black" aria-label="Explorer"><ArrowDown size={17} className="transition-transform group-hover:translate-y-1"/></a>
          <div className="flex items-end justify-between md:justify-end md:gap-10"><div><p className="text-[7px] uppercase tracking-[.3em] text-white/25">Signal</p><p className="mt-2 font-accent text-xl italic text-[#c9a96e]">Visual futures</p></div><MoveDownRight strokeWidth={1} className="text-white/25"/></div>
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-8 left-5 z-10 hidden items-center gap-4 md:flex"><span className="text-[7px] uppercase tracking-[.3em] text-white/30">Scroll to decode</span><span className="relative h-px w-28 overflow-hidden bg-white/10"><motion.i className="absolute inset-y-0 left-0 w-1/2 bg-[#c9a96e]" animate={{x:['-100%','240%']}} transition={{duration:2.4,repeat:Infinity,ease:'linear'}}/></span></div>
    <div className="scanline pointer-events-none absolute inset-0 z-[4]"/>
  </section>;
}
