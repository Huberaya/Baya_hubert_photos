/* =========================================================
   TIRAGES D'ART — catalogue de la page /photographie
   ---------------------------------------------------------
   ⚠️ VISUELS PROVISOIRES
   Instagram (@baya_hubert) n'est pas accessible en lecture
   automatisée (mur de connexion). Les fichiers référencés
   ci-dessous sont ceux déjà présents dans le dépôt.
   Pour publier les vraies photographies :
   1. déposer les fichiers dans /public/assets/images/prints/
   2. mettre à jour `src`, `w`, `h` de chaque entrée
   3. passer PLACEHOLDERS à false
   ========================================================= */

export const PLACEHOLDERS = true

export const PRINT_CATEGORIES = [
  { id: 'all', label: 'Toutes' },
  { id: 'urbain', label: 'Urbain & Nuit' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'nature', label: 'Nature & Saisons' },
  { id: 'culinaire', label: 'Culinaire' },
]

/* Formats proposés — le prix affiché correspond au format d'entrée (A4). */
export const FORMATS = [
  { id: 'a4', label: 'Tirage A4', dims: '21 × 29,7 cm', add: 0, note: 'Papier fine art mat 310 g/m²' },
  { id: '40x50', label: 'Tirage 40 × 50', dims: '40 × 50 cm', add: 45, note: 'Papier fine art mat 310 g/m², marges blanches' },
  { id: '60x80', label: 'Tirage 60 × 80', dims: '60 × 80 cm', add: 110, note: 'Édition limitée à 15 exemplaires, signée et numérotée' },
  { id: 'file', label: 'Fichier numérique', dims: 'Pleine résolution', add: -10, note: 'JPEG haute définition, sRGB — usage personnel' },
]

export const LICENSES = {
  print: {
    title: 'Tirage — usage décoratif personnel',
    points: [
      'Usage privé et décoratif uniquement',
      'Revente, reproduction et exploitation commerciale exclues',
      'Droits d’auteur conservés par Baya Hubert',
    ],
  },
  file: {
    title: 'Fichier numérique — licence personnelle',
    points: [
      'Impression personnelle et usage privé illimités',
      'Publication commerciale, revente et cession à un tiers exclues',
      'Licence commerciale ou publicitaire disponible sur devis',
    ],
  },
}

const IMG = '/assets/images/portfolio'

export const PRINTS = [
  {
    id: 'traversee-nocturne',
    n: '01',
    title: 'Traversée nocturne',
    category: 'urbain',
    price: 100,
    src: `${IMG}/urbain-street-1.webp`,
    w: 666,
    h: 1000,
    orientation: 'portrait',
    place: 'Paris 10e',
    shot: 'Heure bleue · 35 mm · f/2.8',
    short: 'La ville qui se réfléchit dans l’asphalte mouillé.',
    desc:
      "Une avenue prise juste après l'averse, quand les néons se dédoublent au sol et que la circulation devient une traînée de lumière. L'image la plus recherchée de la série urbaine : lecture immédiate, format vertical qui tient un mur seul.",
    why: 'Image signature de la série — impact maximal en grand format.',
  },
  {
    id: 'verticale-de-verre',
    n: '02',
    title: 'Verticale de verre',
    category: 'architecture',
    price: 90,
    src: `${IMG}/architecture-1.webp`,
    w: 558,
    h: 1000,
    orientation: 'portrait',
    place: 'La Défense',
    shot: 'Midi contrasté · 24 mm · f/8',
    short: 'La géométrie pure d’une façade qui monte hors cadre.',
    desc:
      "Une composition strictement graphique : lignes parallèles, reflets froids, aucune échelle humaine pour rassurer l'œil. Un tirage qui fonctionne particulièrement bien en intérieur contemporain ou en espace professionnel.",
    why: 'Composition rigoureuse, très demandée en décoration de bureaux.',
  },
  {
    id: 'le-dressage',
    n: '03',
    title: 'Le dressage',
    category: 'culinaire',
    price: 80,
    src: `${IMG}/food-cafe-2.webp`,
    w: 667,
    h: 1000,
    orientation: 'portrait',
    place: 'Paris 9e',
    shot: 'Fenêtre nord · 85 mm · f/2.2',
    short: 'Le geste suspendu, une seconde avant le service.',
    desc:
      "Lumière de fenêtre unique, fond profond, matière au premier plan : la photographie culinaire traitée comme une nature morte. Format pensé pour les salles de restaurant, les cuisines ouvertes et les cartes imprimées.",
    why: 'Forte valeur d’usage professionnelle (restauration, hôtellerie).',
  },
  {
    id: 'ciel-de-saison',
    n: '04',
    title: 'Ciel de saison',
    category: 'nature',
    price: 70,
    src: `${IMG}/nature-saisons-1.webp`,
    w: 1000,
    h: 545,
    orientation: 'paysage',
    place: 'Île-de-France',
    shot: 'Golden hour · 50 mm · f/4',
    short: 'Le moment exact où la lumière bascule.',
    desc:
      "Un panoramique doux, presque abstrait, capté dans les dix minutes qui précèdent la nuit. Les dégradés supportent très bien l'agrandissement : c'est le tirage le plus apaisant de la série.",
    why: 'Palette douce, s’intègre dans presque tous les intérieurs.',
  },
  {
    id: 'carre-urbain',
    n: '05',
    title: 'Carré urbain',
    category: 'urbain',
    price: 60,
    src: `${IMG}/urbain-street-3.webp`,
    w: 1000,
    h: 1000,
    orientation: 'carre',
    place: 'Montreuil',
    shot: 'Lumière diffuse · 35 mm · f/2',
    short: 'Une scène de vie enfermée dans un carré parfait.',
    desc:
      "Le format carré impose sa discipline : tout doit tenir dans le cadre, rien ne dépasse. Une image de rue qui garde sa part de mystère et se prête très bien aux accrochages en série.",
    why: 'Format carré idéal pour un triptyque ou un mur composé.',
  },
  {
    id: 'interieur-silencieux',
    n: '06',
    title: 'Intérieur silencieux',
    category: 'architecture',
    price: 50,
    src: `${IMG}/architecture-2.webp`,
    w: 558,
    h: 1000,
    orientation: 'portrait',
    place: 'Paris 7e',
    shot: 'Lumière zénithale · 24 mm · f/5.6',
    short: 'Un volume vide que seule la lumière habite.',
    desc:
      "Aucune présence, aucun mobilier superflu : la lumière descend et dessine l'espace. Un tirage discret, qui se révèle en s'approchant, à réserver aux murs qu'on regarde longtemps.",
    why: 'Image contemplative, valeur sûre en petit et moyen format.',
  },
  {
    id: 'table-du-matin',
    n: '07',
    title: 'Table du matin',
    category: 'culinaire',
    price: 45,
    src: `${IMG}/food-cafe-1.webp`,
    w: 864,
    h: 715,
    orientation: 'paysage',
    place: 'Paris 11e',
    shot: 'Lumière latérale · 50 mm · f/1.8',
    short: 'Ambre, glace et lumière rasante.',
    desc:
      "Un verre posé, une lumière qui traverse la matière, un fond volontairement sombre. La photographie qui donne envie d'entrer dans le lieu — souvent choisie par les cafés et les bars à cocktails.",
    why: 'Chaleur immédiate, très efficace en format horizontal.',
  },
  {
    id: 'matiere-vegetale',
    n: '08',
    title: 'Matière végétale',
    category: 'nature',
    price: 40,
    src: `${IMG}/nature-saisons-2.webp`,
    w: 1000,
    h: 701,
    orientation: 'paysage',
    place: 'Meudon',
    shot: 'Ombre douce · 85 mm · f/2',
    short: 'Le détail d’une saison, sans horizon.',
    desc:
      "Un cadrage serré sur la matière : nervures, transparences, dégradés de vert. Une image calme qui fonctionne en pendant d'un portrait ou d'une scène urbaine plus dense.",
    why: 'Excellent tirage d’accompagnement dans un accrochage multiple.',
  },
  {
    id: 'ruelle',
    n: '09',
    title: 'Ruelle',
    category: 'urbain',
    price: 35,
    src: `${IMG}/urbain-street-2.webp`,
    w: 666,
    h: 1000,
    orientation: 'portrait',
    place: 'Paris 13e',
    shot: 'Soleil rasant · 50 mm · f/4',
    short: 'Un couloir de pierre et de lumière.',
    desc:
      "Perspective resserrée, murs anciens, une lumière qui s'invite par le haut. Un tirage d'entrée de gamme qui garde toute la signature de la série urbaine.",
    why: 'Point d’entrée accessible dans la collection.',
  },
  {
    id: 'figues',
    n: '10',
    title: 'Figues',
    category: 'culinaire',
    price: 30,
    src: `${IMG}/food-cafe-3.webp`,
    w: 1000,
    h: 667,
    orientation: 'paysage',
    place: 'Paris 3e',
    shot: 'Contre-jour tamisé · 35 mm · f/2',
    short: 'Deux fruits, une assiette, rien d’autre.',
    desc:
      "L'exercice du dépouillement : un sujet minuscule, une lumière juste, beaucoup de vide autour. Le petit format parfait pour une cuisine ou un couloir.",
    why: 'Sobriété assumée, idéal en petit format.',
  },
]

/* Frais et modalités — volontairement présentés comme « à confirmer »
   tant que la logistique et le paiement ne sont pas branchés. */
export const SHIPPING = {
  method: 'Expédition sous tube rigide ou pochette renforcée, avec suivi.',
  delay: 'Tirage réalisé à la commande : 5 à 8 jours ouvrés avant expédition.',
  fees: 'Frais de port confirmés dans la réponse à votre demande (selon format et destination).',
  digital: 'Fichier numérique : lien de téléchargement envoyé sous 24 h après règlement.',
}
