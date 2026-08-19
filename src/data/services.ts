export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  price: string;
  image: string;
  includes: string[];
};

export const services: Service[] = [
  {
    slug: 'portrait', title: 'Portrait', shortTitle: 'Portrait', image: '/images/editorial/portrait.webp', price: 'À partir de 290 €',
    description: 'Une séance guidée, naturelle et entièrement pensée autour de votre personnalité.',
    longDescription: "Studio ou lumière naturelle, je crée un espace simple où l'on peut oublier l'objectif. Chaque portrait cherche l'équilibre entre présence, lumière et vérité.",
    includes: ['Échange créatif', '1 h 30 de prise de vue', '15 photographies retouchées', 'Galerie privée HD'],
  },
  {
    slug: 'mariage', title: 'Mariage', shortTitle: 'Mariage', image: '/images/editorial/wedding.webp', price: 'À partir de 1 490 €',
    description: 'Un reportage sensible, discret et cinématographique de votre journée.',
    longDescription: "Des préparatifs à la fête, je raconte votre journée sans la diriger. Une attention particulière aux gestes, aux regards et aux détails qui deviennent votre mémoire.",
    includes: ['Rendez-vous de préparation', 'Reportage 8 heures', '400+ images retouchées', 'Galerie privée & coffret'],
  },
  {
    slug: 'architecture', title: 'Architecture & Immobilier', shortTitle: 'Architecture', image: '/images/editorial/architecture.webp', price: 'Sur devis',
    description: 'Des lignes fortes et une lumière juste pour révéler les espaces.',
    longDescription: "Pour architectes, agences et lieux d'exception : une lecture graphique des volumes, des matières et de la lumière, adaptée aux usages éditoriaux et commerciaux.",
    includes: ['Repérage lumière', 'Prise de vue HDR maîtrisée', 'Retouche colorimétrique', 'Livraison web & print'],
  },
  {
    slug: 'famille', title: 'Famille', shortTitle: 'Famille', image: '/images/editorial/family.webp', price: 'À partir de 350 €',
    description: 'Des moments vrais, vivants et tendres, loin des poses figées.',
    longDescription: "À domicile ou en extérieur, la séance suit votre rythme. Le résultat : un récit de famille lumineux, naturel et précieux, à transmettre.",
    includes: ['Conseils de préparation', '1 h 30 de séance', '25 photographies retouchées', 'Galerie familiale privée'],
  },
  {
    slug: 'mode', title: 'Mode & Éditorial', shortTitle: 'Mode', image: '/images/editorial/fashion.webp', price: 'Sur devis',
    description: 'Direction artistique, caractère et narration pour vos images de marque.',
    longDescription: "Du moodboard au rendu final, je construis une série cohérente qui sert une silhouette, une collection ou un récit éditorial contemporain.",
    includes: ['Direction artistique', 'Moodboard & casting', 'Équipe créative sur demande', 'Post-production éditoriale'],
  },
  {
    slug: 'evenementiel', title: 'Événementiel', shortTitle: 'Événementiel', image: '/images/editorial/event.webp', price: 'Sur devis',
    description: 'Une couverture élégante et réactive de vos temps forts.',
    longDescription: "Corporate, gala, lancement ou scène : je capture l'énergie du lieu et les interactions avec discrétion, sans perdre l'identité de votre événement.",
    includes: ['Brief de production', 'Couverture multi-format', 'Sélection express disponible', 'Cession de droits adaptée'],
  },
];
