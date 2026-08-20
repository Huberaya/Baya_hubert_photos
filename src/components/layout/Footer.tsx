import Link from 'next/link';
import GoldLine from '@/components/ui/GoldLine';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return <footer className="relative bg-[#070707] pb-8 pt-24">
    <div className="container-luxe">
      <GoldLine />
      <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_.6fr_.6fr]">
        <div><p className="font-serif text-4xl md:text-6xl">Hubert <span className="accent gold">Baya</span></p><p className="mt-5 max-w-sm text-sm font-light leading-7 text-white/45">Photographe à Paris. Des images graphiques, vivantes et sincères, partout où les histoires méritent d'être gardées.</p></div>
        <div><p className="mb-5 text-[8px] uppercase tracking-[.25em] text-[#c9a96e]">Explorer</p><ul className="space-y-3 text-xs text-white/60">{[['Portfolio','/portfolio'],['Boutique','/boutique'],['À propos','/a-propos'],['Services','/services'],['Contact','/contact']].map(([label,href]) => <li key={href}><Link href={href} className="link-line">{label}</Link></li>)}</ul></div>
        <div><p className="mb-5 text-[8px] uppercase tracking-[.25em] text-[#c9a96e]">Suivre</p><ul className="space-y-3 text-xs text-white/60"><li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">Instagram <ArrowUpRight size={12}/></a></li><li><a href="https://www.behance.net" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">Behance <ArrowUpRight size={12}/></a></li></ul></div>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-[8px] uppercase tracking-[.18em] text-white/30 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} Hubert Baya. Tous droits réservés.</p><div className="flex gap-5"><Link href="/mentions-legales">Mentions légales</Link><span>Paris · disponible partout</span></div></div>
    </div>
  </footer>;
}
