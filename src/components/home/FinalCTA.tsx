'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import TextReveal from '@/components/ui/TextReveal';

export default function FinalCTA() {
  return <section className="noise relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 py-28 text-center"><Image src="/images/editorial/hero-gold.webp" alt="Matière lumineuse dorée" fill sizes="100vw" className="object-cover opacity-45 blur-[1px]"/><div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/80"/>
    <div className="pointer-events-none absolute inset-0">{Array.from({length:18},(_,i)=><motion.i key={i} className="absolute h-1 w-1 rounded-full bg-[#c9a96e]" style={{left:`${(i*37)%100}%`,top:`${(i*53)%100}%`}} animate={{y:[0,-45,0],opacity:[.05,.65,.05]}} transition={{duration:5+(i%5),delay:i*.2,repeat:Infinity}}/> )}</div>
    <motion.div className="relative z-10 max-w-6xl" initial={{opacity:0,scale:.94}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:1.1}}><p className="eyebrow mb-8">Commençons une histoire</p><h2 className="font-serif text-[clamp(3rem,8vw,8.8rem)] leading-[.87] tracking-[-.06em]"><TextReveal>PRÊT À CRÉER QUELQUE CHOSE D'UNIQUE ?</TextReveal></h2><p className="mx-auto mt-8 max-w-xl text-sm font-light leading-7 text-white/55">Réservez votre séance et transformons vos moments en souvenirs qui traversent le temps.</p><div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row"><MagneticButton href="/contact">Me contacter <ArrowRight size={14}/></MagneticButton><a href="/portfolio" className="link-line text-[8px] uppercase tracking-[.23em]">Voir le portfolio →</a></div></motion.div>
  </section>;
}
