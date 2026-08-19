'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/constants';

export default function TextReveal({ children, className = '', delay = 0 }: { children: string; className?: string; delay?: number }) {
  return <span className={`inline-flex flex-wrap ${className}`} aria-label={children}>{children.split(' ').map((word, i) => <span key={`${word}-${i}`} className="overflow-hidden pr-[.22em]" aria-hidden><motion.span className="inline-block" initial={{ y: '110%', rotate: 2 }} whileInView={{ y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ duration: .9, delay: delay + i * .075, ease: EASE }}>{word}</motion.span></span>)}</span>;
}
