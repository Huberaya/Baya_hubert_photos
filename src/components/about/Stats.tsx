'use client';

import { animate, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function Counter({value,suffix,label}:{value:number;suffix?:string;label:string}){const ref=useRef<HTMLDivElement>(null);const seen=useInView(ref,{once:true,amount:.7});const [current,setCurrent]=useState(0);useEffect(()=>{if(!seen)return;const c=animate(0,value,{duration:1.8,ease:[.2,.8,.2,1],onUpdate:v=>setCurrent(Math.round(v))});return()=>c.stop()},[seen,value]);return <div ref={ref} className="border-b border-white/10 py-12 text-center md:border-b-0 md:border-r md:last:border-r-0"><p className="font-serif text-[clamp(4rem,7vw,8rem)] leading-none"><span className="text-[#c9a96e]">{current}</span>{suffix}</p><p className="mt-5 text-[8px] uppercase tracking-[.25em] text-white/40">{label}</p></div>}
export default function Stats(){return <section className="bg-[#060606] py-20"><div className="container-luxe grid md:grid-cols-3"><Counter value={500} suffix="+" label="Shootings réalisés"/><Counter value={8} label="Années d'expérience"/><Counter value={200} suffix="+" label="Clients satisfaits"/></div></section>}
