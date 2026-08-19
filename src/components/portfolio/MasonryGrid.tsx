'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { projects, type Project } from '@/data/projects';
import CategoryFilters from './CategoryFilters';
import { EASE } from '@/lib/constants';

function Tile({project,index}:{project:Project;index:number}) {
  const ref=useRef<HTMLElement>(null); const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const column=index%3; const y=useTransform(scrollYProgress,[0,1],[column===1?28:column===2?-20:0,column===1?-28:column===2?20:0]);
  const aspect=['aspect-[.82]','aspect-[1.18]','aspect-[.72]','aspect-square'][index%4];
  return <motion.article ref={ref} layout initial={{opacity:0,scale:.94,y:35}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.92}} transition={{duration:.75,delay:(index%5)*.06,ease:EASE}} className="masonry-item"><motion.div style={{y}} className={`${aspect} image-zoom group relative overflow-hidden bg-[#111]`}><Link href={`/projet/${project.slug}`} data-cursor="view" className="absolute inset-0"><motion.div layoutId={`project-${project.slug}`} className="absolute inset-0"><Image src={project.cover} alt={`${project.title}, série ${project.category} par Hubert Baya`} fill sizes="(max-width:620px) 100vw, (max-width:900px) 50vw, 33vw" className="object-cover"/></motion.div><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"/><div className="absolute inset-x-0 bottom-0 flex translate-y-5 items-end justify-between p-6 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100"><div><p className="mb-2 text-[7px] uppercase tracking-[.24em] text-[#c9a96e]">{project.category} · {project.location}</p><h2 className="font-serif text-3xl">{project.title}</h2></div><ArrowUpRight size={18}/></div></Link></motion.div></motion.article>;
}

export default function MasonryGrid() {
  const [active,setActive]=useState('Tout'); const filtered=useMemo(()=>active==='Tout'?projects:projects.filter(p=>p.category===active),[active]);
  return <section className="bg-[#080808]"><CategoryFilters active={active} onChange={setActive}/><div className="container-luxe py-16 md:py-28"><div className="mb-14 flex items-end justify-between"><div><p className="micro text-[#c9a96e]">Collection active</p><h2 className="mt-3 font-serif text-4xl md:text-6xl">{active}</h2></div><p className="font-accent text-2xl italic text-white/35">{filtered.length} séries</p></div><motion.div layout className="masonry"><AnimatePresence mode="popLayout">{filtered.map((project,i)=><Tile key={project.slug} project={project} index={i}/>)}</AnimatePresence></motion.div></div></section>;
}
