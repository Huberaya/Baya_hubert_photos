'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div aria-hidden className="fixed left-0 right-0 top-0 z-[70] h-px origin-left bg-[#c9a96e]" style={{ scaleX }} />;
}
