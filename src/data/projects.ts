export type Category = 'Portrait' | 'Mariage' | 'Architecture' | 'Immobilier' | 'Famille' | 'Mode' | 'Événementiel';
export type Project = {
  slug: string;
  title: string;
  category: Category;
  location: string;
  year: string;
  cover: string;
  images: string[];
  portrait?: boolean;
  description: string;
};

const hubert = Array.from({ length: 18 }, (_, i) => `/images/hubert/hubert-${String(i + 1).padStart(2, '0')}.webp`);
const editorial = {
  portrait: '/images/editorial/portrait.webp', wedding: '/images/editorial/wedding.webp',
  architecture: '/images/editorial/architecture.webp', interior: '/images/editorial/interior.webp',
  family: '/images/editorial/family.webp', fashion: '/images/editorial/fashion.webp', event: '/images/editorial/event.webp',
};

export const projects: Project[] = [
  { slug: 'nocturne', title: 'Nocturne', category: 'Portrait', location: 'Paris', year: '2023', cover: hubert[0], images: [hubert[0],hubert[4],hubert[5],hubert[9],hubert[10],hubert[6],hubert[12],hubert[13],hubert[14]], portrait: true, description: "Une étude de la présence dans l'obscurité. Les corps émergent du noir, sculptés par une lumière unique, comme des fragments de scène." },
  { slug: 'mouvement-brut', title: 'Mouvement brut', category: 'Mode', location: 'Lyon', year: '2023', cover: hubert[2], images: [hubert[2],hubert[17],hubert[15],hubert[12],hubert[13],hubert[7],hubert[8],hubert[3],hubert[14]], description: "Un récit urbain spontané entre figures, vitesse et géométrie. La ville devient décor, le mouvement devient langage." },
  { slug: 'chromatique', title: 'Chromatique', category: 'Architecture', location: 'Lyon', year: '2022', cover: hubert[3], images: [hubert[3],hubert[6],hubert[8],hubert[14],hubert[1],hubert[16],hubert[7],hubert[12],hubert[13]], description: "Quand l'architecture bascule dans la couleur. Une promenade graphique au crépuscule entre lignes, néons et ombres." },
  { slug: 'corps-de-ville', title: 'Corps de ville', category: 'Portrait', location: 'Paris', year: '2023', cover: hubert[15], images: [hubert[15],hubert[2],hubert[17],hubert[7],hubert[12],hubert[13],hubert[3],hubert[8],hubert[14]], portrait: true, description: "Des silhouettes croisées dans l'espace public. Une collection de gestes, de regards et d'instants sans répétition." },
  { slug: 'carnaval', title: 'Carnaval vivant', category: 'Événementiel', location: 'Paris', year: '2023', cover: hubert[11], images: [hubert[11], editorial.event, hubert[8],hubert[2],hubert[17],hubert[12],hubert[13],hubert[14],hubert[3]], portrait: true, description: "Couleurs franches, gestes généreux et énergie collective : une immersion au cœur d'une célébration populaire." },
  { slug: 'deux', title: 'Deux', category: 'Mariage', location: 'Île-de-France', year: '2026', cover: editorial.wedding, images: [editorial.wedding,hubert[1],editorial.portrait,hubert[16],editorial.interior,hubert[14],hubert[12],hubert[13],hubert[2]], description: "Une histoire de gestes discrets et de lumière douce, racontée avec la proximité d'un documentaire et l'élégance d'un éditorial." },
  { slug: 'ligne-habitee', title: 'Ligne habitée', category: 'Immobilier', location: 'Paris', year: '2026', cover: editorial.interior, images: [editorial.interior,editorial.architecture,hubert[3],hubert[6],hubert[7],hubert[14],hubert[1],hubert[16],hubert[8]], description: "Une lecture sensible des espaces : volumes, matières et lumière naturelle composent un lieu avant même qu'il soit habité." },
  { slug: 'liens', title: 'Liens', category: 'Famille', location: 'Île-de-France', year: '2026', cover: editorial.family, images: [editorial.family,hubert[1],hubert[16],editorial.portrait,hubert[14],hubert[12],hubert[13],hubert[7],hubert[15]], description: "Un après-midi sans scénario, guidé par les rires, les silences et les gestes familiers que l'on voudrait garder toujours." },
  { slug: 'silhouette', title: 'Silhouette', category: 'Mode', location: 'Paris', year: '2026', cover: editorial.fashion, images: [editorial.fashion,hubert[6],hubert[9],hubert[15],hubert[4],hubert[5],hubert[2],hubert[17],hubert[8]], portrait: true, description: "Une silhouette affirmée, confrontée aux lignes de la ville. La mode comme rythme et comme espace de narration." },
];

export const categories = ['Tout', 'Portrait', 'Mariage', 'Architecture', 'Immobilier', 'Famille', 'Mode', 'Événementiel'] as const;
export { hubert };
