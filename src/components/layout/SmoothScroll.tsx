'use client';

import { useEffect } from 'react';

export default function SmoothScroll(){useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 1023px)').matches)return;let cancelled=false;let dispose:(()=>void)|undefined;(async()=>{const [{default:Lenis},{ScrollTrigger}]=await Promise.all([import('lenis'),import('gsap/ScrollTrigger')]);if(cancelled)return;const lenis=new Lenis({duration:.9,wheelMultiplier:.95,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);let frame=0;const raf=(time:number)=>{lenis.raf(time);frame=requestAnimationFrame(raf)};frame=requestAnimationFrame(raf);dispose=()=>{cancelAnimationFrame(frame);lenis.destroy()}})();return()=>{cancelled=true;dispose?.()}},[]);return null}
