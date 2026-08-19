'use client';

import Image, { type ImageProps } from 'next/image';
import { motion } from 'framer-motion';
import { EASE } from '@/lib/constants';

export default function ImageReveal({ className = '', ...props }: ImageProps) {
  return <motion.div className={`relative overflow-hidden ${className}`} initial={{ clipPath: 'inset(0 0 100% 0)' }} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true, amount: .15 }} transition={{ duration: 1.1, ease: EASE }}>
    <Image {...props} className="object-cover" />
  </motion.div>;
}
