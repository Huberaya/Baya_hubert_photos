import type { Variants } from 'framer-motion';
import { EASE } from './constants';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: .9, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: .1, delayChildren: .1 } },
};

export const maskReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', y: 24 },
  visible: { clipPath: 'inset(0 0 0% 0)', y: 0, transition: { duration: 1.05, ease: EASE } },
};

export const gsapEase = 'power4.inOut';
