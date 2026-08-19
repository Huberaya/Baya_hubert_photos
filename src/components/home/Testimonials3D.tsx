'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { testimonials } from '@/data/testimonials';
import { EASE } from '@/lib/constants';

export default function Testimonials3D() {
  const [active,setActive]=useState(0); const move=(d:number)=>setActive(v=>(v+d+testimonials.length)%testimonials.length);
  useEffect(()=>{const id=setInterval(()=>move(1),6500);return()=>clearInterval(id);},[]);
  return <section className="overflow-hidden bg-[#080808] py-28 md:py-40"><div className="container-luxe"><div className="mb-14 text-center md:mb-20"><p className="eyebrow mb-5">Témoignages</p><h2 className="font-serif text-[clamp(2.8rem,6vw,6.5rem)] leading-none">Ils m'ont fait confiance</h2></div>
    <div className="relative mx-auto h-[430px] max-w-6xl [perspective:1200px] md:h-[480px]">{testimonials.map((t,i)=>{const offset=i-active; const wrapped=((offset+testimonials.length+2)%testimonials.length)-2; const visible=Math.abs(wrapped)<=1; return <motion.article key={t.name} className="absolute left-1/2 top-0 grid h-full w-[min(88vw,720px)] -translate-x-1/2 grid-cols-1 overflow-hidden border border-white/10 bg-[#101010] shadow-2xl md:grid-cols-[.36fr_.64fr]" animate={{x:`calc(-50% + ${wrapped*48}%)`,scale:wrapped===0?1:.8,rotateY:wrapped*-18,z:wrapped===0?60:-120,opacity:visible?(wrapped===0?1:.3):0,zIndex:10-Math.abs(wrapped)}} transition={{duration:.8,ease:EASE}}>
      <div className="relative hidden md:block"><Image src={t.image} alt="" fill sizes="260px" className="object-cover grayscale"/><div className="absolute inset-0 bg-[#c9a96e]/10 mix-blend-color"/></div><div className="flex flex-col justify-between p-8 md:p-12"><Quote size={38} strokeWidth={1} className="text-[#c9a96e]"/><blockquote className="font-accent text-[clamp(1.7rem,3vw,2.7rem)] italic leading-tight text-white/90">“{t.quote}”</blockquote><div><p className="text-xs uppercase tracking-[.18em]">{t.name}</p><p className="mt-2 text-[8px] uppercase tracking-[.2em] text-[#c9a96e]">{t.type}</p></div></div>
    </motion.article>})}</div>
    <div className="mt-8 flex items-center justify-center gap-5"><button onClick={()=>move(-1)} aria-label="Témoignage précédent" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition-colors hover:border-[#c9a96e]"><ArrowLeft size={16}/></button><span className="micro w-14 text-center text-white/40">0{active+1} / 0{testimonials.length}</span><button onClick={()=>move(1)} aria-label="Témoignage suivant" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition-colors hover:border-[#c9a96e]"><ArrowRight size={16}/></button></div>
  </div></section>;
}
