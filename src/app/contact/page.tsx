import type { Metadata } from 'next';
import Image from 'next/image';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

export const metadata:Metadata={title:'Contact',description:'Contactez Hubert Baya pour votre projet photo à Paris, en Île-de-France ou ailleurs.',alternates:{canonical:'/contact'}};
export default function ContactPage(){return <><ContactHero/><section className="bg-[#090909] py-24 md:py-36"><div className="container-luxe grid gap-20 lg:grid-cols-2 lg:gap-28"><ContactForm/><ContactInfo/></div></section><section className="noise relative h-[70vh] min-h-[520px] overflow-hidden"><Image src="/images/editorial/architecture.webp" alt="Architecture parisienne sculptée par la lumière" fill sizes="100vw" className="object-cover"/><div className="absolute inset-0 bg-black/55"/><div className="container-luxe relative z-10 flex h-full items-center justify-center text-center"><div><p className="eyebrow mb-7">Paris · 48.8566° N</p><h2 className="font-serif text-[clamp(3rem,8vw,8.5rem)] leading-[.87]">BASÉ À PARIS<br/><span className="accent gold">disponible partout.</span></h2></div></div></section></>}
