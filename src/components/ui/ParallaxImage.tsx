'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxImage({ src, alt, className = '', speed = .14, priority = false }: { src: string; alt: string; className?: string; speed?: number; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed*100}%`, `${speed*100}%`]);
  return <div ref={ref} className={`relative overflow-hidden ${className}`}><motion.div className="absolute -inset-[18%]" style={{ y }}><Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 70vw" className="object-cover" /></motion.div></div>;
}
