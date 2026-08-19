'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { EASE, NAV_ITEMS } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY; setScrolled(y > 32); setHidden(y > last.current && y > 180 && !open); last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  return <>
    <motion.header initial={{ y: -100 }} animate={{ y: hidden ? -110 : 0 }} transition={{ duration: .7, ease: EASE }} className={`fixed inset-x-0 top-0 z-[60] border-b transition-colors duration-500 ${scrolled ? 'border-white/10 bg-black/70 backdrop-blur-xl' : 'border-transparent bg-transparent'}`}>
      <div className="mx-auto flex h-[76px] w-full max-w-[1480px] items-center justify-between px-5 md:h-[88px] md:px-8">
        <Link href="/" aria-label="Hubert Baya — Accueil" className="group relative z-[62] flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[#c9a96e]/60 font-accent text-lg text-[#c9a96e] transition-colors group-hover:bg-[#c9a96e] group-hover:text-black">B</span>
          <span><b className="block font-serif text-sm font-normal leading-none tracking-[.08em]">HUBERT BAYA</b><small className="mt-1.5 block text-[7px] uppercase tracking-[.35em] text-white/45">Photographe</small></span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-9 lg:flex">
          {NAV_ITEMS.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} className="link-line py-2 text-[9px] uppercase tracking-[.22em] text-white/70 transition-colors hover:text-white">{item.label}</Link>)}
        </nav>
        <div className="hidden lg:block"><Link href="/contact" className="border border-[#c9a96e]/50 px-5 py-3 text-[8px] uppercase tracking-[.2em] transition-colors hover:bg-[#c9a96e] hover:text-black">Réserver une séance</Link></div>
        <button onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} className="relative z-[62] grid h-11 w-11 place-items-center rounded-full border border-white/15 lg:hidden">{open ? <X size={18}/> : <Menu size={18}/>}</button>
      </div>
    </motion.header>

    <AnimatePresence>{open && <motion.div id="mobile-menu" className="fixed inset-0 z-[55] bg-[#080808] px-6 pb-8 pt-32" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .8, ease: EASE }}>
      <nav className="flex h-full flex-col justify-between" aria-label="Navigation mobile">
        <div>{NAV_ITEMS.map((item, i) => <motion.div key={item.href} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22 + i*.07 }} className="border-b border-white/10"><Link href={item.href} className="flex items-baseline justify-between py-5"><span className="font-serif text-[clamp(2rem,10vw,4rem)]">{item.label}</span><span className="text-[9px] text-[#c9a96e]">0{i+1}</span></Link></motion.div>)}</div>
        <div className="flex justify-between text-[9px] uppercase tracking-[.2em] text-white/40"><span>Paris — France</span><span>© {new Date().getFullYear()}</span></div>
      </nav>
    </motion.div>}</AnimatePresence>
  </>;
}
