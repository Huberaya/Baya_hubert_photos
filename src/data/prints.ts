export type Print = {
  id: string;
  title: string;
  image: string;
  price: number;
  location: string;
  edition: string;
};

const titles = [
  'Canal silencieux','Sous la verrière','Reflets du Nord','Éoliennes I','Place Vendôme','Après la pluie',
  'Ombres portées I','Périphérique','Nef blanche','L’ascension','Banc public','Suspension',
  'Passage 1925','Ombres portées II','Musée intérieur','Le portail','Rétroviseur','Escalier secret',
  'L’appel','Tunnel 03','Verre et nuage','Ligne musicale','Mouvement brut','Vertige',
  'Porte du ciel','La grande halle','Courbe','Double rampe','Le témoin',
];
const prices = [75,95,85,110,125,65,80,95,120,75,50,85,90,80,110,125,70,75,150,95,110,65,85,120,95,130,60,75,100];

export const prints: Print[] = titles.map((title,index)=>({
  id:`HB-${String(index+1).padStart(3,'0')}`,
  title,
  image:`/images/prints/oeuvre-${String(index+1).padStart(2,'0')}.webp`,
  price:prices[index],
  location:index%4===0?'Paris':index%4===1?'Lyon':index%4===2?'Amsterdam':'France',
  edition:index%3===0?'Édition de 15':'Édition de 25',
}));
