import type { Metadata } from 'next';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import MasonryGrid from '@/components/portfolio/MasonryGrid';

export const metadata:Metadata={title:'Portfolio',description:'Explorez les séries photographiques de Hubert Baya : portrait, mariage, architecture, immobilier, famille, mode et événementiel.',alternates:{canonical:'/portfolio'}};
export default function PortfolioPage(){return <><PortfolioHero/><MasonryGrid/></>}
