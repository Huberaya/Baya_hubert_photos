'use client';

import { motion } from 'framer-motion';
import TextReveal from '@/components/ui/TextReveal';

export default function ContactHero(){return <section className="relative flex h-[65vh] min-h-[560px] items-center overflow-hidden bg-[#070707] pt-20"><div className="gold-glow absolute left-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 opacity-50"/><div className="pointer-events-none absolute inset-0">{Array.from({length:28},(_,i)=><motion.span key={i} className="absolute h-[2px] w-[2px] rounded-full bg-[#c9a96e]" style={{left:`${(i*41)%97}%`,top:`${(i*67)%93}%`}} animate={{y:[0,-25,0],opacity:[.08,.7,.08],scale:[1,1.8,1]}} transition={{duration:4+i%6,delay:i*.11,repeat:Infinity}}/>)}</div><div className="container-luxe relative z-10 text-center"><p className="eyebrow mb-8">Un projet en tête ?</p><h1 className="font-serif text-[clamp(3.7rem,11vw,11rem)] leading-[.76] tracking-[-.07em]"><TextReveal>CRÉONS ENSEMBLE</TextReveal></h1><p className="mx-auto mt-9 max-w-xl text-sm font-light leading-7 text-white/50">Chaque grand projet commence par une conversation. Racontez-moi ce que vous imaginez.</p></div></section>}
