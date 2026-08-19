import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/layout/CustomCursor';
import PageTransition from '@/components/layout/PageTransition';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { SITE } from '@/lib/constants';

const inter=Inter({subsets:['latin'],variable:'--font-inter',display:'swap'});
const playfair=Playfair_Display({subsets:['latin'],variable:'--font-playfair',display:'swap'});
const cormorant=Cormorant_Garamond({subsets:['latin'],weight:['400','500','600'],style:['normal','italic'],variable:'--font-cormorant',display:'swap'});

export const metadata:Metadata={metadataBase:new URL(SITE.url),title:{default:SITE.title,template:'%s — Hubert Baya'},description:SITE.description,keywords:['photographe Paris','photographe portrait','photographe mariage Paris','photographe architecture','Hubert Baya'],authors:[{name:'Hubert Baya'}],creator:'Hubert Baya',openGraph:{type:'website',locale:'fr_FR',url:SITE.url,siteName:'Hubert Baya Photographie',title:SITE.title,description:SITE.description,images:[{url:'/images/hubert/hubert-01.webp',width:1080,height:1080,alt:'Photographie par Hubert Baya'}]},twitter:{card:'summary_large_image',title:SITE.title,description:SITE.description,images:['/images/hubert/hubert-01.webp']},alternates:{canonical:'/'},robots:{index:true,follow:true}};
export const viewport:Viewport={themeColor:'#050505',colorScheme:'dark',width:'device-width',initialScale:1};

export default function RootLayout({children}:{children:React.ReactNode}){const schema={"@context":"https://schema.org","@type":"Photographer","name":SITE.name,"url":SITE.url,"image":`${SITE.url}/images/hubert/hubert-01.webp`,"address":{"@type":"PostalAddress","addressLocality":"Paris","addressRegion":"Île-de-France","addressCountry":"FR"},"areaServed":"France"};return <html lang="fr" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}><body><a href="#main-content" className="skip-link">Aller au contenu</a><SmoothScroll/><ScrollProgress/><CustomCursor/><PageTransition/><Navbar/><main id="main-content">{children}</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>}
