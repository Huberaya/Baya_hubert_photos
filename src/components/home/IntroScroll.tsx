'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const phases = [
  { index:'01', code:'INPUT / LIGHT', title:'LA LUMIÈRE', outline:'DEVIENT SIGNAL', image:'/images/editorial/portrait.webp' },
  { index:'02', code:'PROCESS / MATTER', title:'LE GESTE', outline:'DEVIENT MÉMOIRE', image:'/images/editorial/fashion.webp' },
  { index:'03', code:'OUTPUT / EMOTION', title:"L'INSTANT", outline:'DEVIENT ÉTERNEL', image:'/images/editorial/event.webp' },
];

export default function IntroScroll() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.signal-panel');
      const timeline = gsap.timeline({ scrollTrigger:{ trigger:root.current, start:'top top', end:'+=260%', scrub:1, pin:true, anticipatePin:1, onUpdate:self=>gsap.set('.signal-progress',{scaleX:self.progress}) } });
      gsap.set(panels.slice(1),{autoAlpha:0,y:80,clipPath:'inset(100% 0 0 0)'});
      panels.forEach((panel,index)=>{
        if(index===0) return;
        timeline.to(panels[index-1],{autoAlpha:0,y:-70,filter:'blur(12px)',duration:.7})
          .to(panel,{autoAlpha:1,y:0,filter:'blur(0px)',clipPath:'inset(0% 0 0 0)',duration:1.1},'<.15');
      });
      timeline.to('.signal-orbit',{rotation:220,scale:1.18,duration:timeline.duration()},0);
    },root);
    return()=>ctx.revert();
  },[]);

  return <section id="introduction" ref={root} className="relative flex h-screen min-h-[720px] items-center overflow-hidden bg-[#040505]">
    <div className="future-grid absolute inset-0 opacity-20"/>
    <div className="signal-orbit absolute left-1/2 top-1/2 h-[64vw] max-h-[900px] w-[64vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a96e]/10"><span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a96e] shadow-[0_0_24px_#c9a96e]"/><span className="absolute bottom-[12%] right-[7%] h-1.5 w-1.5 rounded-full bg-[#8fb6bb] shadow-[0_0_20px_#8fb6bb]"/></div>
    <div className="container-luxe relative z-10 h-full">
      <div className="absolute inset-x-0 top-24 flex items-center justify-between"><p className="text-[7px] uppercase tracking-[.34em] text-white/35">Image transformation protocol</p><p className="text-[7px] tracking-[.28em] text-[#c9a96e]">HB / MANIFESTO</p></div>
      {phases.map((phase,index)=><article key={phase.index} className="signal-panel absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="grid items-center gap-8 md:grid-cols-[.24fr_1fr_.34fr]">
          <div className="hidden md:block"><p className="font-accent text-6xl italic text-[#c9a96e]">{phase.index}</p><p className="mt-4 text-[7px] uppercase tracking-[.3em] text-white/30">{phase.code}</p></div>
          <div><p className="mb-4 text-[7px] uppercase tracking-[.36em] text-[#c9a96e] md:hidden">{phase.index} — {phase.code}</p><h2 className="font-serif text-[clamp(3.5rem,8.7vw,9rem)] leading-[.76] tracking-[-.06em]">{phase.title}<span className="mt-2 block text-transparent [-webkit-text-stroke:1px_rgba(243,240,232,.36)]">{phase.outline}</span></h2></div>
          <div className="tech-frame relative aspect-[.78] w-[min(48vw,280px)] justify-self-end overflow-hidden"><Image src={phase.image} alt="" fill sizes="280px" className="object-cover opacity-70 grayscale"/><div className="absolute inset-0 bg-gradient-to-t from-[#c9a96e]/25 to-transparent mix-blend-color"/><span className="absolute left-3 top-3 text-[6px] tracking-[.2em] text-white/55">FRAME_00{index+1}</span><span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-[#c9a96e]"/></div>
        </div>
      </article>)}
      <div className="absolute inset-x-0 bottom-10"><div className="h-px bg-white/10"><div className="signal-progress h-full origin-left scale-x-0 bg-[#c9a96e]"/></div><div className="mt-3 flex justify-between text-[6px] uppercase tracking-[.25em] text-white/25"><span>00:00</span><span>Transmission active</span><span>03:00</span></div></div>
    </div>
  </section>;
}
