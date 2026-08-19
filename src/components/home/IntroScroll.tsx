'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IntroScroll() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const phases = gsap.utils.toArray<HTMLElement>('.intro-phase');
      gsap.set(phases, { autoAlpha: 0, scale: .96 }); gsap.set(phases[0], { autoAlpha: 1, scale: 1 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start:'top top', end:'+=220%', scrub:1, pin:true, anticipatePin:1 } });
      tl.to(phases[0], { autoAlpha:0, y:-40, duration:1 })
        .fromTo(phases[1], {autoAlpha:0,y:50,clipPath:'inset(100% 0 0 0)'}, {autoAlpha:1,y:0,clipPath:'inset(0% 0 0 0)',duration:1.4}, '<.25')
        .to(phases[1], {autoAlpha:0,y:-40,duration:1}, '+=.55')
        .fromTo(phases[2], {autoAlpha:0,scale:.82}, {autoAlpha:1,scale:1,duration:1.5}, '<.3')
        .to('.intro-glow', {opacity:1,scale:1.25,duration:1.6}, '<');
    }, root);
    return () => ctx.revert();
  }, []);
  return <section id="introduction" ref={root} className="relative flex h-screen min-h-[650px] items-center justify-center overflow-hidden bg-[#070707]">
    <div className="intro-glow gold-glow absolute left-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 opacity-0"/>
    <p className="absolute left-6 top-24 text-[7px] uppercase tracking-[.35em] text-white/25 md:left-12">Manifeste — 01</p>
    {['CHAQUE IMAGE','RACONTE UNE HISTOIRE','JE CAPTURE LA VÔTRE'].map((line,i)=><div key={line} className="intro-phase absolute inset-x-5 top-1/2 -translate-y-1/2 text-center"><p className="mb-5 font-accent text-xl italic text-[#c9a96e]">0{i+1}</p><h2 className="font-serif text-[clamp(2.8rem,8vw,8.8rem)] font-normal leading-[.86] tracking-[-.055em]">{line}</h2></div>)}
    <div className="absolute bottom-8 left-1/2 h-14 w-px -translate-x-1/2 bg-gradient-to-b from-[#c9a96e] to-transparent"/>
  </section>;
}
