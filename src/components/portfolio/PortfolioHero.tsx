'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { hubert } from '@/data/projects';

export default function PortfolioHero() {
  const root=useRef<HTMLElement>(null); const {scrollYProgress}=useScroll({target:root,offset:['start start','end start']});
  const y1=useTransform(scrollYProgress,[0,1],[0,-90]); const y2=useTransform(scrollYProgress,[0,1],[0,70]); const fill=useTransform(scrollYProgress,[0,.85],['rgba(243,240,232,0)','rgba(243,240,232,1)']);
  return <section ref={root} className="relative flex h-[75vh] min-h-[600px] items-center overflow-hidden bg-[#060606] pt-20">
    <div className="absolute inset-0 opacity-30"><motion.div style={{y:y1}} className="absolute left-[4%] top-[20%] h-[44%] w-[27%] rotate-[-3deg]"><Image src={hubert[2]} alt="" fill sizes="30vw" className="object-cover grayscale"/></motion.div><motion.div style={{y:y2}} className="absolute right-[6%] top-[9%] h-[58%] w-[28%] rotate-[4deg]"><Image src={hubert[11]} alt="" fill sizes="30vw" className="object-cover"/></motion.div><motion.div style={{y:y1}} className="absolute bottom-[-8%] left-[38%] h-[42%] w-[24%]"><Image src={hubert[3]} alt="" fill sizes="25vw" className="object-cover"/></motion.div></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-[#060606]"/>
    <div className="container-luxe relative z-10"><p className="eyebrow mb-8">Archives sélectionnées · 2022—2026</p><motion.h1 style={{color:fill}} initial={{scale:.82,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:1.2,ease:[.76,0,.24,1]}} className="font-serif text-[clamp(4rem,15vw,14rem)] leading-[.72] tracking-[-.075em] [-webkit-text-stroke:1px_rgba(243,240,232,.72)]">PORTFOLIO</motion.h1><div className="mt-12 flex items-center justify-between border-t border-white/15 pt-5 text-[8px] uppercase tracking-[.25em] text-white/40"><span>Portrait · Espace · Mouvement</span><span className="hidden sm:block">Défiler pour explorer</span></div></div>
  </section>;
}
