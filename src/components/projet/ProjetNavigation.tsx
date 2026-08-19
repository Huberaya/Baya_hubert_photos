'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Project } from '@/data/projects';

function NavLink({project,direction}:{project:Project;direction:'prev'|'next'}) { return <Link href={`/projet/${project.slug}`} className="group relative flex min-h-[330px] flex-1 items-end overflow-hidden p-7 md:min-h-[480px] md:p-12" data-cursor="view"><Image src={project.cover} alt="" fill sizes="50vw" className="object-cover opacity-25 grayscale transition-all duration-1000 group-hover:scale-105 group-hover:opacity-65 group-hover:grayscale-0"/><div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40"/><div className={`relative z-10 w-full ${direction==='next'?'text-right':''}`}><p className="mb-4 inline-flex items-center gap-3 text-[7px] uppercase tracking-[.24em] text-[#c9a96e]">{direction==='prev'?<><ArrowLeft size={12}/> Projet précédent</>:<>Projet suivant <ArrowRight size={12}/></>}</p><h3 className="font-serif text-[clamp(2.3rem,5vw,5.5rem)] leading-none">{project.title}</h3><p className="mt-3 text-[8px] uppercase tracking-[.22em] text-white/40">{project.category} · {project.year}</p></div></Link> }

export default function ProjetNavigation({previous,next}:{previous:Project;next:Project}) { return <nav className="flex flex-col border-t border-white/10 bg-black md:flex-row" aria-label="Navigation entre les projets"><NavLink project={previous} direction="prev"/><NavLink project={next} direction="next"/></nav>; }
