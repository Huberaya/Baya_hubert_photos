'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Maximize2, Pause, Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function VideoShowcase() {
  const root=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null);const [visible,setVisible]=useState(false),[modal,setModal]=useState(false),[playing,setPlaying]=useState(true);
  const {scrollYProgress}=useScroll({target:root,offset:['start end','end start']});const scale=useTransform(scrollYProgress,[0,.5,1],[.9,1,1.04]);const titleX=useTransform(scrollYProgress,[0,1],[-60,60]);
  useEffect(()=>{if(!root.current)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'200px'});observer.observe(root.current);return()=>observer.disconnect()},[]);
  const toggle=()=>{if(!video.current)return;video.current.paused?video.current.play():video.current.pause();setPlaying(!video.current.paused)};
  return <>
    <section ref={root} className="relative min-h-screen overflow-hidden bg-[#050606] py-24 md:py-36">
      <div className="future-grid absolute inset-0 opacity-10"/>
      <div className="container-luxe relative">
        <div className="mb-10 flex items-end justify-between"><div><p className="mb-4 text-[7px] uppercase tracking-[.4em] text-[#c9a96e]">Motion capture / Sequence 001</p><motion.h2 style={{x:titleX}} className="font-serif text-[clamp(3.2rem,8vw,8rem)] leading-[.8] tracking-[-.06em]">LIGHT IN <span className="text-transparent [-webkit-text-stroke:1px_rgba(243,240,232,.45)]">MOTION</span></motion.h2></div><p className="hidden max-w-xs text-right text-[8px] uppercase leading-5 tracking-[.2em] text-white/28 md:block">La photographie n'arrête pas le temps.<br/>Elle en révèle la fréquence.</p></div>
        <div className="tech-frame relative aspect-[16/10] overflow-hidden md:aspect-[16/8]"><motion.div style={{scale}} className="absolute inset-0">{visible&&<video ref={video} className="h-full w-full object-cover opacity-70" autoPlay muted loop playsInline preload="metadata" poster="/images/editorial/event.webp"><source src="/video/showcase.mp4" type="video/mp4"/></video>}</motion.div><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.62),transparent_45%,rgba(0,0,0,.28))]"/><div className="scanline absolute inset-0"/>
          <div className="absolute left-5 top-5 flex items-center gap-3 text-[7px] uppercase tracking-[.25em] text-white/50"><span className="status-dot"/>Rec / 4K / 24FPS</div><div className="absolute right-5 top-5 text-[7px] tracking-[.25em] text-white/35">00:23:16:08</div>
          <button onClick={()=>setModal(true)} className="group absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/25 backdrop-blur-md transition-all hover:scale-110 hover:border-[#c9a96e]" aria-label="Lire le film"><Play size={18} fill="currentColor"/><span className="absolute -bottom-7 whitespace-nowrap text-[6px] uppercase tracking-[.3em]">Launch sequence</span></button>
          <button onClick={toggle} aria-label={playing?'Mettre en pause':'Lire'} className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center border border-white/15 bg-black/30">{playing?<Pause size={13}/>:<Play size={13}/>}</button>
          <div className="absolute bottom-5 left-5"><p className="font-serif text-2xl md:text-4xl">La lumière ne ment jamais.</p><p className="mt-2 text-[6px] uppercase tracking-[.3em] text-[#c9a96e]">Hubert Baya / Visual archive</p></div>
        </div>
      </div>
    </section>
    <AnimatePresence>{modal&&<motion.div className="fixed inset-0 z-[150] grid place-items-center bg-black p-3 md:p-10" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button onClick={()=>setModal(false)} aria-label="Fermer" className="absolute right-5 top-5 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/20"><X/></button><video src="/video/showcase.mp4" controls autoPlay className="max-h-full max-w-full"/><Maximize2 className="absolute bottom-6 left-6 text-white/30" size={14}/></motion.div>}</AnimatePresence>
  </>;
}
