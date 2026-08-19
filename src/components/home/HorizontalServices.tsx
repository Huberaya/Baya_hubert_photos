'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalServices() {
  const root=useRef<HTMLElement>(null); const track=useRef<HTMLDivElement>(null); const progress=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{ const mm=gsap.matchMedia(); mm.add('(min-width: 900px)',()=>{ if(!root.current||!track.current)return; const tween=gsap.to(track.current,{x:()=>-(track.current!.scrollWidth-window.innerWidth),ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:()=>`+=${track.current!.scrollWidth-window.innerWidth}`,scrub:1,pin:true,invalidateOnRefresh:true,onUpdate:self=>gsap.set(progress.current,{scaleX:self.progress})}}); return()=>tween.kill();}); return()=>mm.revert();},[]);
  return <section ref={root} className="relative overflow-hidden bg-[#0a0a0a] md:h-screen md:min-h-[700px]">
    <div ref={track} className="flex flex-col md:h-full md:w-max md:flex-row">{services.map((s,i)=><article key={s.slug} className="relative grid min-h-[95vh] border-b border-white/10 md:h-full md:min-h-0 md:w-screen md:grid-cols-2 md:border-b-0 md:border-r">
      <div className="image-zoom relative min-h-[48vh] overflow-hidden md:min-h-0"><Image src={s.image} alt={`${s.title} par Hubert Baya`} fill sizes="(max-width:900px) 100vw, 50vw" className="object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"/></div>
      <div className="flex flex-col justify-center p-7 md:p-[8vw]"><div className="mb-10 flex items-center justify-between"><span className="font-accent text-3xl text-[#c9a96e]">0{i+1}</span><span className="micro text-white/25">Service</span></div><h2 className="font-serif text-[clamp(3rem,5.5vw,6.8rem)] leading-[.85] tracking-[-.055em]">{s.title}</h2><p className="mt-8 max-w-md text-sm font-light leading-7 text-white/50">{s.description}</p><Link href={`/services#${s.slug}`} className="link-line mt-9 inline-flex w-fit items-center gap-5 text-[8px] uppercase tracking-[.25em]">En savoir plus <ArrowRight size={14}/></Link></div>
    </article>)}</div>
    <div className="absolute bottom-0 left-0 right-0 hidden h-[3px] bg-white/5 md:block"><div ref={progress} className="h-full origin-left scale-x-0 bg-[#c9a96e]"/></div>
  </section>;
}
