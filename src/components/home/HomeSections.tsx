'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useRef, useState } from 'react';

const IntroScroll=dynamic(()=>import('./IntroScroll'),{ssr:false});
const VideoShowcase=dynamic(()=>import('./VideoShowcase'),{ssr:false});
const PortfolioPreview=dynamic(()=>import('./PortfolioPreview'),{ssr:false});
const HorizontalServices=dynamic(()=>import('./HorizontalServices'),{ssr:false});
const ArtworkShop=dynamic(()=>import('@/components/shop/ArtworkShop'),{ssr:false});
const Testimonials3D=dynamic(()=>import('./Testimonials3D'),{ssr:false});
const FinalCTA=dynamic(()=>import('./FinalCTA'),{ssr:false});

function LazySection({children,minHeight='90vh'}:{children:ReactNode;minHeight?:string}){const ref=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false);useEffect(()=>{if(!ref.current)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{rootMargin:'240px 0px'});observer.observe(ref.current);return()=>observer.disconnect()},[]);return <div ref={ref} style={{minHeight}} className="bg-[#040505]">{visible?children:null}</div>}

export default function HomeSections(){return <><LazySection minHeight="100vh"><IntroScroll/></LazySection><LazySection minHeight="100vh"><VideoShowcase/></LazySection><LazySection minHeight="130vh"><PortfolioPreview/></LazySection><LazySection minHeight="100vh"><HorizontalServices/></LazySection><LazySection minHeight="110vh"><ArtworkShop/></LazySection><LazySection minHeight="90vh"><Testimonials3D/></LazySection><LazySection minHeight="100vh"><FinalCTA/></LazySection></>}
