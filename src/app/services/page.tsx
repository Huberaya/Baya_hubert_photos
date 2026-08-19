import type { Metadata } from 'next';
import ServicesHero from '@/components/services/ServicesHero';
import ServiceCard3D from '@/components/services/ServiceCard3D';
import ProcessSteps from '@/components/services/ProcessSteps';
import FinalCTA from '@/components/home/FinalCTA';
import { services } from '@/data/services';

export const metadata:Metadata={title:'Services',description:'Portrait, mariage, architecture, immobilier, famille, mode et événementiel : découvrez les prestations photo de Hubert Baya.',alternates:{canonical:'/services'}};
export default function ServicesPage(){return <><ServicesHero/><section className="bg-[#080808] py-24 md:py-36"><div className="container-luxe"><div className="mb-16 flex items-end justify-between"><div><p className="eyebrow mb-5">Expertises</p><h2 className="font-serif text-5xl md:text-8xl">À chacun son récit.</h2></div><p className="hidden max-w-xs text-right text-xs leading-6 text-white/35 md:block">Cliquez sur une prestation pour en découvrir le détail.</p></div><div className="grid gap-5 md:grid-cols-2">{services.map((s,i)=><ServiceCard3D key={s.slug} service={s} index={i}/>)}</div></div></section><ProcessSteps/><FinalCTA/></>}
