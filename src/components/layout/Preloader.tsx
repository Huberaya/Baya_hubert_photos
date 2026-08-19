'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EASE } from '@/lib/constants';

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const start = performance.now(); const duration = 2100;
    let id = 0;
    const tick = (time: number) => {
      const p = Math.min((time - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) id = requestAnimationFrame(tick);
      else setTimeout(() => { setOpen(false); onComplete?.(); }, 250);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [onComplete]);

  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: EASE }}>
    <div className="w-[min(80vw,520px)]">
      <div className="mb-8 flex items-end justify-between">
        <div><p className="font-serif text-3xl tracking-[-.04em]">Hubert Baya</p><p className="mt-2 text-[8px] uppercase tracking-[.42em] text-white/40">Photographie</p></div>
        <span className="font-accent text-3xl tabular-nums text-[#c9a96e]">{String(count).padStart(3, '0')}</span>
      </div>
      <div className="h-px w-full bg-white/10"><motion.div className="h-full origin-left bg-[#c9a96e]" animate={{ scaleX: count / 100 }} /></div>
    </div>
  </motion.div>}</AnimatePresence>;
}
