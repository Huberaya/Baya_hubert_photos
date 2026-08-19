import type { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import Timeline from '@/components/about/Timeline';
import Stats from '@/components/about/Stats';
import Philosophy from '@/components/about/Philosophy';

export const metadata:Metadata={title:'À propos',description:"Découvrez le regard, le parcours et la philosophie de Hubert Baya, photographe basé à Paris.",alternates:{canonical:'/a-propos'}};
export default function AboutPage(){return <><AboutHero/><Timeline/><Stats/><Philosophy/></>}
