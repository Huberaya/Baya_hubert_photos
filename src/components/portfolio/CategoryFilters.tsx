'use client';

import { motion } from 'framer-motion';
import { categories } from '@/data/projects';

export default function CategoryFilters({active,onChange}:{active:string;onChange:(category:string)=>void}) {
  return <div className="sticky top-[76px] z-40 border-y border-white/10 bg-[#080808]/90 backdrop-blur-xl md:top-[88px]"><div className="container-luxe scrollbar-none flex gap-7 overflow-x-auto py-5" role="tablist" aria-label="Filtrer les projets">{categories.map(cat=><button key={cat} role="tab" aria-selected={active===cat} onClick={()=>onChange(cat)} className={`relative shrink-0 py-1 text-[8px] uppercase tracking-[.2em] transition-colors ${active===cat?'text-white':'text-white/35 hover:text-white/70'}`}>{cat}{active===cat&&<motion.span layoutId="filter-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-[#c9a96e]"/>}</button>)}</div></div>;
}
