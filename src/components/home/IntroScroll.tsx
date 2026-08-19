'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const phases=[
  {index:'01',code:'INPUT / LIGHT',title:'LA LUMIÈRE',outline:'DEVIENT SIGNAL',image:'/images/editorial/portrait.webp'},
  {index:'02',code:'PROCESS / MATTER',title:'LE GESTE',outline:'DEVIENT MÉMOIRE',image:'/images/editorial/fashion.webp'},
  {index:'03',code:'OUTPUT / EMOTION',title:"L'INSTANT",outline:'DEVIENT ÉTERNEL',image:'/images/editorial/event.webp'},
];

export default function IntroScroll(){const root=useRef<HTMLElement>(null);useLayoutEffect(()=>{if(!root.current)return;const mm=gsap.matchMedia();mm.add('(min-width: 768px)',()=>{const panels=gsap.utils.toArray<HTMLElement>('.signal-panel');const timeline=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top top',end:'+=220%',scrub:1,pin:true,anticipatePin:1,onUpdate:self=>gsap.set('.signal-progress',{scaleX:self.progress})}});gsap.set(panels.slice(1),{autoAlpha:0,y:70,clipPath:'inset(100% 0 0 0)'});panels.forEach((panel,index)=>{if(!index)return;timeline.to(panels[index-1],{autoAlpha:0,y:-55,duration:.6}).to(panel,{autoAlpha:1,y:0,clipPath:'inset(0% 0 0 0)',duration:1},'<.1')});timeline.to('.signal-orbit',{rotation:180,duration:timeline.duration()},0);return()=>timeline.kill()});return()=>mm.revert()},[]);
return <section id="introduction" ref={root} className="relative overflow-hidden bg-[#040505] py-24 md:flex md:h-screen md:min-h-[700px] md:items-center md:py-0"><div className="future-grid absolute inset-0 opacity-15"/>
  <div className="container-luxe relative z-10 md:h-full">
    <div className="mb-12 flex items-center justify-between md:absolute md:inset-x-0 md:top-20 md:mb-0"><p className="text-[7px] uppercase tracking-[.3em] text-white/35">Image transformation protocol</p><p className="text-[7px] tracking-[.25em] text-[#c9a96e]">HB / 03</p></div>
    <div className="space-y-16 md:hidden">{phases.map((phase,index)=><article key={phase.index} className="border-t border-white/10 pt-6"><div className="mb-7 flex justify-between text-[7px] uppercase tracking-[.24em]"><span className="text-[#c9a96e]">{phase.index}</span><span className="text-white/30">{phase.code}</span></div><h2 className="font-serif text-[clamp(2.9rem,14vw,5rem)] leading-[.8] tracking-[-.06em]">{phase.title}<span className="mt-2 block text-transparent [-webkit-text-stroke:1px_rgba(243,240,232,.4)]">{phase.outline}</span></h2><div className="tech-frame relative mt-7 aspect-[16/10] overflow-hidden"><Image src={phase.image} alt="" fill sizes="100vw" className="object-cover opacity-68"/><span className="absolute left-3 top-3 text-[6px] tracking-[.2em] text-white/55">FRAME_00{index+1}</span></div></article>)}</div>
    <div className="signal-orbit absolute left-1/2 top-1/2 hidden h-[60vw] max-h-[820px] w-[60vw] max-w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a96e]/10 md:block"/>
    <div className="hidden md:block">{phases.map((phase,index)=><article key={phase.index} className="signal-panel absolute inset-x-0 top-1/2 -translate-y-1/2"><div className="grid items-center gap-8 md:grid-cols-[.2fr_1fr_.3fr]"><div><p className="font-accent text-6xl italic text-[#c9a96e]">{phase.index}</p><p className="mt-4 text-[7px] uppercase tracking-[.27em] text-white/30">{phase.code}</p></div><h2 className="font-serif text-[clamp(3.5rem,8vw,8.5rem)] leading-[.76] tracking-[-.06em]">{phase.title}<span className="mt-2 block text-transparent [-webkit-text-stroke:1px_rgba(243,240,232,.36)]">{phase.outline}</span></h2><div className="tech-frame relative aspect-[.78] w-[min(22vw,260px)] justify-self-end overflow-hidden"><Image src={phase.image} alt="" fill sizes="260px" className="object-cover opacity-68"/><span className="absolute left-3 top-3 text-[6px] tracking-[.2em] text-white/55">FRAME_00{index+1}</span></div></div></article>)}</div>
    <div className="absolute inset-x-0 bottom-9 hidden md:block"><div className="h-px bg-white/10"><div className="signal-progress h-full origin-left scale-x-0 bg-[#c9a96e]"/></div></div>
  </div>
</section>}
