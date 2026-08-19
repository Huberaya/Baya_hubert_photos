'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const moments=[
  {title:'Ma passion',text:"Tout a commencé par les gestes de la rue : saisir un corps en mouvement, une ombre, une coïncidence. La photographie est devenue une manière d'être attentif.",image:'/images/hubert/hubert-03.webp'},
  {title:'Ma vision',text:"Une image forte n'explique pas tout. Elle laisse de l'espace, une tension, une trace. Je cherche cet instant où le réel semble soudain composé.",image:'/images/hubert/hubert-13.webp'},
  {title:'Mon style',text:"Contraste, géométrie, couleurs franches et noir profond. Mon langage s'adapte à chaque histoire mais conserve une présence graphique et sincère.",image:'/images/hubert/hubert-07.webp'},
  {title:'Mon engagement',text:"Être présent sans prendre toute la place. Préparer avec précision, photographier avec instinct, livrer des images exigeantes faites pour durer.",image:'/images/hubert/hubert-12.webp'},
];

export default function Timeline(){const ref=useRef<HTMLElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start center','end center']});const scaleY=useSpring(scrollYProgress,{stiffness:90,damping:28});return <section ref={ref} className="relative bg-[#090909] py-28 md:py-44"><div className="container-luxe"><div className="mb-24 text-center"><p className="eyebrow mb-5">Le chemin</p><h2 className="font-serif text-[clamp(3rem,7vw,7rem)]">Mon histoire</h2></div><div className="relative"><div className="absolute bottom-0 left-3 top-0 w-px bg-white/10 md:left-1/2"><motion.div style={{scaleY}} className="h-full origin-top bg-[#c9a96e]"/></div>{moments.map((m,i)=><motion.article key={m.title} initial={{opacity:0,x:i%2?-40:40}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.35}} transition={{duration:.9,ease:[.76,0,.24,1]}} className={`relative mb-24 grid gap-10 pl-12 md:grid-cols-2 md:pl-0 ${i%2?'':'md:[&>div:first-child]:order-2'}`}><span className="absolute left-3 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#c9a96e] bg-[#090909] md:left-1/2"/><div className={`${i%2?'md:pl-20':'md:pl-20'} flex items-center`}><div><span className="font-accent text-3xl italic text-[#c9a96e]">0{i+1}</span><h3 className="mt-4 font-serif text-4xl md:text-6xl">{m.title}</h3><p className="mt-6 max-w-md text-sm font-light leading-7 text-white/48">{m.text}</p></div></div><div className={`${i%2?'md:pr-20':'md:pr-20'} relative aspect-[1.25] overflow-hidden`}><Image src={m.image} alt={m.title} fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover grayscale transition-all duration-1000 hover:scale-105 hover:grayscale-0"/></div></motion.article>)}</div></div></section>}
