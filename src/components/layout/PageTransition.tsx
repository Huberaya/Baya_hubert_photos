'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { EASE } from '@/lib/constants';

export default function PageTransition() {
  const pathname = usePathname();
  return <AnimatePresence mode="wait">
    <motion.div key={pathname} aria-hidden className="fixed inset-0 z-[80] origin-top bg-[#0a0a0a] pointer-events-none" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} exit={{ scaleY: 1 }} transition={{ duration: .8, ease: EASE }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[11vw] text-white/[.025]">HB</div>
    </motion.div>
  </AnimatePresence>;
}
