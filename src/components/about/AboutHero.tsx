'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import GoldLine from '@/components/ui/GoldLine';
import TextReveal from '@/components/ui/TextReveal';

export default function AboutHero() {
  return <section className="grid min-h-[100svh] bg-[#080808] pt-[76px] md:grid-cols-2 md:pt-[88px]">
    <motion.div initial={{clipPath:'inset(100% 0 0 0)'}} animate={{clipPath:'inset(0% 0 0 0)'}} transition={{duration:1.25,ease:[.76,0,.24,1]}} className="relative min-h-[56vh] md:min-h-0"><Image src="/images/hubert/hubert-10.webp" alt="Hubert Baya, photographe" fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover grayscale"/><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/><p className="absolute bottom-7 left-7 text-[7px] uppercase tracking-[.25em] text-white/55">Autoportrait · Paris</p></motion.div>
    <div className="relative flex items-center p-7 py-20 md:p-[8vw]"><div className="absolute bottom-0 left-0 top-0 hidden md:block"><GoldLine vertical/></div><div><p className="eyebrow mb-8">À propos</p><h1 className="font-serif text-[clamp(3.2rem,6.5vw,8rem)] leading-[.88] tracking-[-.055em]"><TextReveal>L'HOMME DERRIÈRE L'OBJECTIF</TextReveal></h1><p className="mt-9 max-w-md text-sm font-light leading-7 text-white/50">Je photographie ce qui résiste aux mots : une présence, un mouvement, la façon dont la lumière change un visage ou un lieu.</p><div className="mt-10 flex items-center gap-5"><span className="h-px w-14 bg-[#c9a96e]"/><span className="font-accent text-xl italic text-white/60">Hubert Baya</span></div></div></div>
  </section>;
}
