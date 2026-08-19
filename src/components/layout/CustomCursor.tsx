'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const x = useMotionValue(-100); const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 650, damping: 45 });
  const springY = useSpring(y, { stiffness: 650, damping: 45 });
  const [mode, setMode] = useState<'default'|'link'|'view'>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); setVisible(true); };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor],a,button');
      setMode(el?.getAttribute('data-cursor') === 'view' ? 'view' : el ? 'link' : 'default');
    };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); document.documentElement.removeEventListener('mouseleave', leave); };
  }, [x, y]);

  return <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[1000] hidden md:block mix-blend-difference" style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}>
    <motion.div animate={{ width: mode === 'view' ? 76 : mode === 'link' ? 42 : 28, height: mode === 'view' ? 76 : mode === 'link' ? 42 : 28 }} transition={{ duration: .35 }} className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white flex items-center justify-center">
      {mode === 'view' ? <span className="text-[8px] tracking-[.22em] text-white">VOIR</span> : <span className="h-1 w-1 rounded-full bg-white" />}
    </motion.div>
  </motion.div>;
}
