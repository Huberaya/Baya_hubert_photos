'use client';

import { motion } from 'framer-motion';
import GoldLine from '@/components/ui/GoldLine';
import TextReveal from '@/components/ui/TextReveal';

export default function ServicesHero(){return <section className="relative flex h-[82vh] min-h-[620px] items-center overflow-hidden bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#16140f] pt-20"><div className="gold-glow absolute -right-[15vw] top-0 h-[60vw] w-[60vw] opacity-60"/><div className="container-luxe relative"><p className="eyebrow mb-8">Sur mesure · Paris & ailleurs</p><h1 className="font-serif text-[clamp(4rem,13vw,13rem)] leading-[.72] tracking-[-.07em]"><TextReveal>MES SERVICES</TextReveal></h1><motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1,duration:.9}} className="mt-10 max-w-xl text-sm font-light leading-7 text-white/50">Des prestations pensées comme des collaborations : une écoute précise, un regard singulier et une réalisation sans compromis.</motion.p><div className="mt-12 max-w-md"><GoldLine/></div></div><span className="absolute bottom-8 right-8 hidden text-[7px] uppercase tracking-[.3em] text-white/30 md:block">De l'idée à l'image — 01/06</span></section>}
