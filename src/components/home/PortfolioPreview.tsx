'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { EASE } from '@/lib/constants';

const selection = [projects[0],projects[2],projects[4],projects[1],projects[5]];
const sizes = ['md:col-span-7 aspect-[1.25]','md:col-span-5 aspect-[.9]','md:col-span-4 aspect-[.82]','md:col-span-8 aspect-[1.35]','md:col-span-10 md:col-start-2 aspect-[1.8]'];

export default function PortfolioPreview() {
  return <section className="bg-[#080808] py-28 md:py-44">
    <div className="container-luxe">
      <div className="mb-16 flex items-end justify-between md:mb-24"><div><p className="eyebrow mb-5">Travaux choisis</p><h2 className="font-serif text-[clamp(3.5rem,9vw,9rem)] leading-none tracking-[-.06em]">Portfolio</h2></div><Link href="/portfolio" className="link-line hidden items-center gap-3 pb-2 text-[8px] uppercase tracking-[.23em] md:flex">Tout voir <ArrowUpRight size={13}/></Link></div>
      <div className="group/grid grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">{selection.map((p,i)=><motion.article key={p.slug} initial={{opacity:0,y:50,clipPath:'inset(0 0 16% 0)'}} whileInView={{opacity:1,y:0,clipPath:'inset(0 0 0% 0)'}} viewport={{once:true,amount:.12}} transition={{duration:1,delay:(i%2)*.12,ease:EASE}} className={`${sizes[i]} image-zoom relative min-h-[370px] overflow-hidden bg-[#111] transition-all duration-700 group-hover/grid:opacity-40 hover:!opacity-100`}>
        <Link href={`/projet/${p.slug}`} data-cursor="view" className="absolute inset-0"><Image src={p.cover} alt={`${p.title} — ${p.category}, photographie Hubert Baya`} fill sizes="(max-width:768px) 100vw, 70vw" className="object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 transition-opacity hover:opacity-100"/><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8"><div><p className="mb-2 text-[8px] uppercase tracking-[.25em] text-[#c9a96e]">{p.category} · {p.year}</p><h3 className="font-serif text-3xl md:text-4xl">{p.title}</h3></div><ArrowUpRight className="text-white/60"/></div></Link>
      </motion.article>)}</div>
      <Link href="/portfolio" className="luxe-button mt-10 md:hidden">Voir tout le portfolio <ArrowUpRight size={13}/></Link>
    </div>
  </section>;
}
