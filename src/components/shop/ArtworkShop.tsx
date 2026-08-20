'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { prints, type Print } from '@/data/prints';
import PrintCard from './PrintCard';
import PurchaseModal from './PurchaseModal';

export default function ArtworkShop(){const [selected,setSelected]=useState<Print|null>(null);return <section className="content-auto relative bg-[#070808] py-24 md:py-40"><div className="container-luxe"><div className="mb-14 grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="mb-5 flex items-center gap-3 text-[7px] uppercase tracking-[.38em] text-[#c9a96e]"><ShoppingBag size={13}/> Éditions photographiques</p><h2 className="font-serif text-[clamp(3.5rem,8vw,8rem)] leading-[.78] tracking-[-.06em]">ŒUVRES<br/><span className="ml-[10vw] text-transparent [-webkit-text-stroke:1px_rgba(243,240,232,.4)]">À ACQUÉRIR</span></h2></div><div><p className="max-w-xs text-xs leading-6 text-white/38">Tirages d'art en éditions limitées, signés et accompagnés d'un certificat d'authenticité.</p><p className="mt-3 font-accent text-2xl italic text-[#c9a96e]">De 50 à 150 €</p></div></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{prints.slice(0,6).map(print=><PrintCard key={print.id} artwork={print} onSelect={setSelected}/>)}</div><div className="mt-12 text-center"><Link href="/boutique" className="luxe-button">Voir les 29 œuvres <ArrowRight size={14}/></Link></div></div><PurchaseModal artwork={selected} onClose={()=>setSelected(null)}/></section>}
