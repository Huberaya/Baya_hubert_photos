import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProjetHero from '@/components/projet/ProjetHero';
import ProjetGallery from '@/components/projet/ProjetGallery';
import ProjetNavigation from '@/components/projet/ProjetNavigation';
import TextReveal from '@/components/ui/TextReveal';
import { projects } from '@/data/projects';

export function generateStaticParams(){return projects.map(project=>({slug:project.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=projects.find(p=>p.slug===slug);if(!project)return {title:'Projet introuvable'};return {title:project.title,description:project.description,alternates:{canonical:`/projet/${project.slug}`},openGraph:{title:`${project.title} — Hubert Baya`,description:project.description,images:[project.cover]}}}

export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const index=projects.findIndex(p=>p.slug===slug);if(index<0)notFound();const project=projects[index];const previous=projects[(index-1+projects.length)%projects.length];const next=projects[(index+1)%projects.length];return <><ProjetHero project={project}/><section className="bg-[#080808] py-24 md:py-40"><div className="container-luxe grid items-center gap-14 md:grid-cols-[.8fr_1.2fr] md:gap-24"><div><p className="eyebrow mb-7">L'histoire</p><h2 className="font-serif text-[clamp(2.8rem,5vw,6rem)] leading-[.93]"><TextReveal>Une série, un rythme, une présence.</TextReveal></h2><p className="mt-8 max-w-lg text-sm font-light leading-8 text-white/52">{project.description}</p><dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"><div><dt className="micro text-white/25">Lieu</dt><dd className="mt-2 text-xs">{project.location}</dd></div><div><dt className="micro text-white/25">Année</dt><dd className="mt-2 text-xs">{project.year}</dd></div><div><dt className="micro text-white/25">Genre</dt><dd className="mt-2 text-xs">{project.category}</dd></div></dl></div><div className="relative aspect-[1.25] overflow-hidden"><Image src={project.images[1]} alt={`Détail de la série ${project.title}`} fill sizes="(max-width:768px) 100vw, 60vw" className="object-cover"/></div></div></section><ProjetGallery project={project}/><ProjetNavigation previous={previous} next={next}/></>}
