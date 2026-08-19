'use client';

import { motion } from 'framer-motion';

export default function GoldLine({ vertical = false, className = '' }: { vertical?: boolean; className?: string }) {
  return <motion.span aria-hidden className={`${vertical ? 'h-full w-px origin-top' : 'h-px w-full origin-left'} block bg-[#c9a96e] ${className}`} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: 1.1, ease: [.76,0,.24,1] }} />;
}
