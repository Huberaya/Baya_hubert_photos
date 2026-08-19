'use client';

import Image from 'next/image';
import TextReveal from '@/components/ui/TextReveal';

export default function Philosophy(){return <section className="noise relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-28 text-center"><Image src="/images/hubert/hubert-06.webp" alt="Silhouette et lumière, photographie Hubert Baya" fill sizes="100vw" className="object-cover opacity-25 blur-[3px]"/><div className="absolute inset-0 bg-black/55"/><div className="relative z-10 max-w-6xl"><p className="eyebrow mb-10">Philosophie</p><blockquote className="font-serif text-[clamp(2.8rem,7vw,7.5rem)] leading-[.92] tracking-[-.05em]"><TextReveal>JE NE PRENDS PAS DES PHOTOS. JE CRÉE DES SOUVENIRS.</TextReveal></blockquote><p className="mx-auto mt-10 max-w-lg font-accent text-xl italic text-white/55">Voir vraiment, puis laisser l'image parler.</p></div></section>}
