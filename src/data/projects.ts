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

type Collection = {
  category: Category;
  titles: string[];
  slugs: string[];
  location: string;
  description: string;
  visuals: string[];
  portrait?: boolean;
};

const archive = Array.from({ length: 18 }, (_, i) => `/images/hubert/hubert-${String(i + 1).padStart(2, '0')}.webp`);
const portfolio = (name: string, index: number) => `/images/portfolio/${name}-${String(index).padStart(2, '0')}.webp`;

const collections: Collection[] = [
  {
    category: 'Portrait', location: 'Paris', portrait: true,
    titles: ['Lueur intérieure', 'Silence noir', 'Visage / Matière', 'Présence', 'Après minuit'],
    slugs: ['lueur-interieure', 'silence-noir', 'visage-matiere', 'presence', 'apres-minuit'],
    visuals: ['/images/editorial/portrait.webp', ...[2,3,4,5].map(i => portfolio('portrait', i))],
    description: "Une étude de la présence, du regard et de la lumière. Chaque portrait cherche ce point d'équilibre où la personne oublie l'objectif.",
  },
  {
    category: 'Mariage', location: 'Île-de-France',
    titles: ['Cérémonie solaire', 'Deux', 'Promesse', 'Le jardin blanc', "Détails d'éternité"],
    slugs: ['ceremonie-solaire', 'deux', 'promesse', 'jardin-blanc', 'details-eternite'],
    visuals: ['/images/editorial/wedding.webp', ...[2,3,4,5].map(i => portfolio('wedding', i))],
    description: "Une histoire de gestes discrets et de lumière douce, racontée avec la proximité du documentaire et l'élégance d'un éditorial.",
  },
  {
    category: 'Architecture', location: 'Paris & Europe',
    titles: ["Monolithe", "Lignes d'air", 'Brutalisme calme', 'Transparence', 'Symétrie'],
    slugs: ['monolithe', 'lignes-air', 'brutalisme-calme', 'transparence', 'symetrie'],
    visuals: ['/images/editorial/architecture.webp', ...[2,3,4,5].map(i => portfolio('architecture', i))],
    description: "Volumes, lignes et ombres composent un paysage abstrait. Une lecture graphique de l'espace et de la façon dont la lumière l'habite.",
  },
  {
    category: 'Immobilier', location: 'Paris',
    titles: ['Appartement 08', 'Ligne habitée', 'Volume privé', 'Maison lumière', 'Pierre & verre'],
    slugs: ['appartement-08', 'ligne-habitee', 'volume-prive', 'maison-lumiere', 'pierre-verre'],
    visuals: ['/images/editorial/interior.webp', ...[2,3,4,5].map(i => portfolio('immobilier', i))],
    description: "Une mise en valeur précise des volumes, des matières et de la lumière naturelle, pensée pour donner immédiatement envie d'habiter le lieu.",
  },
  {
    category: 'Famille', location: 'Île-de-France', portrait: true,
    titles: ['Liens', 'Dimanche', "À hauteur d'enfant", 'Éclats', 'Héritage'],
    slugs: ['liens', 'dimanche', 'hauteur-enfant', 'eclats', 'heritage'],
    visuals: ['/images/editorial/family.webp', ...[2,3,4,5].map(i => portfolio('famille', i))],
    description: "Des moments sans scénario, guidés par les rires, les silences et les gestes familiers que l'on voudrait garder toujours.",
  },
  {
    category: 'Mode', location: 'Paris', portrait: true,
    titles: ['Or liquide', 'Chromatique', 'Studio 04', 'Riviera', 'Métropole'],
    slugs: ['or-liquide', 'chromatique', 'studio-04', 'riviera', 'metropole'],
    visuals: ['/images/editorial/fashion.webp', ...[2,3,4,5].map(i => portfolio('mode', i))],
    description: "Silhouette, matière et attitude. La mode devient un territoire de narration où chaque image affirme un rythme et une direction.",
  },
  {
    category: 'Événementiel', location: 'Paris',
    titles: ['Nocturne', 'Constellation', 'Foule électrique', 'Scène', 'Après la lumière'],
    slugs: ['nocturne', 'constellation', 'foule-electrique', 'scene', 'apres-la-lumiere'],
    visuals: ['/images/editorial/event.webp', ...[2,3,4,5].map(i => portfolio('event', i))],
    description: "Une immersion au cœur du mouvement collectif : l'énergie du lieu, les rencontres et les instants décisifs réunis dans un récit vivant.",
  },
];

export const projects: Project[] = collections.flatMap((collection, collectionIndex) =>
  collection.titles.map((title, index) => {
    const rotated = collection.visuals.map((_, imageIndex) => collection.visuals[(index + imageIndex) % collection.visuals.length]);
    const archiveOffset = (collectionIndex * 2 + index) % archive.length;
    const images = [...rotated, archive[archiveOffset], archive[(archiveOffset + 5) % archive.length], archive[(archiveOffset + 9) % archive.length], rotated[0]];
    return {
      slug: collection.slugs[index], title, category: collection.category,
      location: collection.location, year: String(2026 - (index % 3)),
      cover: collection.visuals[index], images, portrait: collection.portrait,
      description: collection.description,
    };
  })
);

export const categories = ['Tout', 'Portrait', 'Mariage', 'Architecture', 'Immobilier', 'Famille', 'Mode', 'Événementiel'] as const;
