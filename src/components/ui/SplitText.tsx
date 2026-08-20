'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/constants';

export default function SplitText({ text, className = '' }: { text: string; className?: string }) {
  return <span className={`inline-flex ${className}`} aria-label={text}>{[...text].map((letter, i) => <span className="overflow-hidden" key={i} aria-hidden><motion.span className="inline-block" initial={{ y: '105%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .18 + i * .022, duration: .6, ease: EASE }}>{letter === ' ' ? '\u00A0' : letter}</motion.span></span>)}</span>;
}
