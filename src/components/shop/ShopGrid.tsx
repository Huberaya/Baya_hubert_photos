'use client';

import { useState } from 'react';
import { prints, type Print } from '@/data/prints';
import PrintCard from './PrintCard';
import PurchaseModal from './PurchaseModal';

export default function ShopGrid(){const [selected,setSelected]=useState<Print|null>(null),[limit,setLimit]=useState(12);const shown=prints.slice(0,limit);return <><div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{shown.map((print,index)=><PrintCard key={print.id} artwork={print} onSelect={setSelected} priority={index<3}/>)}</div>{limit<prints.length&&<div className="mt-14 text-center"><button onClick={()=>setLimit(value=>value+9)} className="luxe-button">Afficher plus d'œuvres</button></div>}<PurchaseModal artwork={selected} onClose={()=>setSelected(null)}/></>}
