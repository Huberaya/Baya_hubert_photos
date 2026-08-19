'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Project } from '@/data/projects';
import { ArrowDown } from 'lucide-react';

export default function ProjetHero({project}:{project:Project}) {
  return <section className="noise relative h-[100svh] min-h-[700px] overflow-hidden bg-black"><motion.div layoutId={`project-${project.slug}`} className="absolute inset-0"><motion.div className="absolute inset-0" initial={{scale:1.12}} animate={{scale:1.02}} transition={{duration:8,ease:'linear'}}><Image src={project.cover} alt={`${project.title} — photographie par Hubert Baya`} fill priority sizes="100vw" className="object-cover"/></motion.div></motion.div><div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/80"/>
    <div className="container-luxe relative z-10 flex h-full flex-col justify-end pb-16 md:pb-24"><motion.p initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:.65,duration:.8}} className="mb-5 text-[8px] uppercase tracking-[.3em] text-[#c9a96e]">{project.category} · {project.year}</motion.p><div className="overflow-hidden"><motion.h1 initial={{y:'105%'}} animate={{y:0}} transition={{delay:.25,duration:1.15,ease:[.76,0,.24,1]}} className="font-serif text-[clamp(4rem,12vw,12rem)] leading-[.75] tracking-[-.07em]">{project.title}</motion.h1></div><motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}} className="mt-9 flex items-end justify-between border-t border-white/25 pt-5"><p className="micro text-white/60">{project.location} — France</p><span className="flex items-center gap-3 text-[7px] uppercase tracking-[.28em] text-white/45">Explorer <ArrowDown size={12}/></span></motion.div></div>
  </section>;
}
