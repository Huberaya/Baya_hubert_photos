'use client';

import { useScroll } from 'framer-motion';

export function useScrollProgress() {
  return useScroll().scrollYProgress;
}
