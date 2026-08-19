'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Maximize2, Pause, Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextReveal from '@/components/ui/TextReveal';

export default function VideoShowcase() {
  const root = useRef<HTMLElement>(null); const video = useRef<HTMLVideoElement>(null);
  const [visible,setVisible] = useState(false); const [modal,setModal] = useState(false); const [playing,setPlaying] = useState(true);
  const { scrollYProgress } = useScroll({ target:root, offset:['start end','end start'] });
  const scale = useTransform(scrollYProgress,[0,.5,1],[.94,1,1.035]); const y = useTransform(scrollYProgress,[0,1],[50,-50]);
  useEffect(()=>{ if(!root.current)return; const o=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{rootMargin:'200px'}); o.observe(root.current); return()=>o.disconnect();},[]);
  const toggle=()=>{ if(!video.current)return; video.current.paused?video.current.play():video.current.pause(); setPlaying(video.current.paused===false); };
  return <>
    <section ref={root} className="noise relative h-[100svh] min-h-[650px] overflow-hidden bg-black">
      <motion.div className="absolute inset-0" style={{scale}}>{visible && <video ref={video} className="h-full w-full object-cover opacity-75" autoPlay muted loop playsInline preload="metadata" poster="/images/hubert/hubert-09.webp"><source src="/video/showcase.mp4" type="video/mp4"/></video>}</motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/70"/>
      <motion.div style={{y}} className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"><p className="eyebrow mb-8">L'art de regarder</p><h2 className="max-w-6xl font-serif text-[clamp(2.8rem,8vw,8rem)] leading-[.88] tracking-[-.055em]"><TextReveal>LA LUMIÈRE NE MENT JAMAIS</TextReveal></h2><button onClick={()=>setModal(true)} data-cursor className="group mt-12 inline-flex items-center gap-5 text-[8px] uppercase tracking-[.25em]"><span className="grid h-16 w-16 place-items-center rounded-full border border-white/40 transition-all group-hover:border-[#c9a96e] group-hover:bg-[#c9a96e] group-hover:text-black"><Play size={16} fill="currentColor"/></span>Lire le film</button></motion.div>
      <button onClick={toggle} aria-label={playing?'Mettre en pause':'Lire'} className="absolute bottom-8 right-8 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20">{playing?<Pause size={13}/>:<Play size={13}/>}</button>
    </section>
    <AnimatePresence>{modal && <motion.div className="fixed inset-0 z-[150] grid place-items-center bg-black p-3 md:p-10" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button onClick={()=>setModal(false)} aria-label="Fermer la vidéo" className="absolute right-5 top-5 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/20"><X/></button><video src="/video/showcase.mp4" controls autoPlay className="max-h-full max-w-full"/><Maximize2 className="absolute bottom-6 left-6 text-white/30" size={14}/></motion.div>}</AnimatePresence>
  </>;
}
