'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';

export default function MagneticButton({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 14 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 14 });
  const move = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width/2) * .18); y.set((e.clientY - r.top - r.height/2) * .18);
  };
  return <motion.div style={{ x, y }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }} className="inline-block">
    <Link href={href} className={`luxe-button ${className}`}>{children}</Link>
  </motion.div>;
}
